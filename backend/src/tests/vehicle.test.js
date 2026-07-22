const request = require('supertest');
const app = require('../app');
const dbHandler = require('./dbHandler');
const Vehicle = require('../models/Vehicle');
const User = require('../models/User');

jest.setTimeout(30000);

let userToken;
let adminToken;

beforeAll(async () => {
  await dbHandler.connect();

  // Create testing users and get tokens
  const adminRes = await request(app)
    .post('/api/auth/register')
    .send({ name: 'Admin User', email: 'admin@test.com', password: 'adminpassword', role: 'admin' });
  adminToken = adminRes.body.token;

  const userRes = await request(app)
    .post('/api/auth/register')
    .send({ name: 'Standard User', email: 'user@test.com', password: 'userpassword', role: 'user' });
  userToken = userRes.body.token;
});

afterEach(async () => {
  // Clear only vehicles, preserve users so we don't have to re-register
  await Vehicle.deleteMany({});
});

afterAll(async () => {
  await dbHandler.closeDatabase();
});

describe('Vehicles and Inventory API', () => {
  const sampleVehicle = {
    make: 'Honda',
    model: 'Civic',
    category: 'Sedan',
    price: 22000,
    quantity: 5,
  };

  describe('POST /api/vehicles (Create Vehicle)', () => {
    it('should allow admin to create a vehicle', async () => {
      const res = await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(sampleVehicle);

      expect(res.status).toBe(201);
      expect(res.body.status).toBe('success');
      expect(res.body.data.vehicle.make).toBe(sampleVehicle.make);
    });

    it('should block non-admin from creating a vehicle', async () => {
      const res = await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${userToken}`)
        .send(sampleVehicle);

      expect(res.status).toBe(403);
      expect(res.body.status).toBe('fail');
    });

    it('should reject creation with negative price or quantity', async () => {
      const invalidVehicle = { ...sampleVehicle, price: -100 };
      const res = await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(invalidVehicle);

      expect(res.status).toBe(400);
      expect(res.body.status).toBe('fail');
    });
  });

  describe('GET /api/vehicles/search (Search Vehicles)', () => {
    beforeEach(async () => {
      // Seed test vehicles
      await Vehicle.create([
        { make: 'Toyota', model: 'Camry', category: 'Sedan', price: 25000, quantity: 4 },
        { make: 'Honda', model: 'CR-V', category: 'SUV', price: 30000, quantity: 3 },
        { make: 'Ford', model: 'F-150', category: 'Truck', price: 40000, quantity: 2 },
      ]);
    });

    it('should filter vehicles by make', async () => {
      const res = await request(app)
        .get('/api/vehicles/search?make=toyota')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.results).toBe(1);
      expect(res.body.data.vehicles[0].make).toBe('Toyota');
    });

    it('should filter vehicles by price range', async () => {
      const res = await request(app)
        .get('/api/vehicles/search?minPrice=26000&maxPrice=35000')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.results).toBe(1);
      expect(res.body.data.vehicles[0].model).toBe('CR-V');
    });
  });

  describe('PUT /api/vehicles/:id (Update Vehicle)', () => {
    it('should allow admin to update a vehicle', async () => {
      const vehicle = await Vehicle.create(sampleVehicle);
      const res = await request(app)
        .put(`/api/vehicles/${vehicle._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ price: 23500 });

      expect(res.status).toBe(200);
      expect(res.body.data.vehicle.price).toBe(23500);
    });
  });

  describe('DELETE /api/vehicles/:id (Delete Vehicle)', () => {
    it('should allow admin to delete a vehicle', async () => {
      const vehicle = await Vehicle.create(sampleVehicle);
      const res = await request(app)
        .delete(`/api/vehicles/${vehicle._id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      const dbVehicle = await Vehicle.findById(vehicle._id);
      expect(dbVehicle).toBeNull();
    });
  });

  describe('POST /api/vehicles/:id/purchase (Purchase Vehicle)', () => {
    it('should decrease quantity by 1 for authenticated user', async () => {
      const vehicle = await Vehicle.create(sampleVehicle);
      const res = await request(app)
        .post(`/api/vehicles/${vehicle._id}/purchase`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.vehicle.quantity).toBe(sampleVehicle.quantity - 1);
    });

    it('should prevent purchase when quantity is 0', async () => {
      const vehicle = await Vehicle.create({ ...sampleVehicle, quantity: 0 });
      const res = await request(app)
        .post(`/api/vehicles/${vehicle._id}/purchase`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('out of stock');
    });
  });

  describe('POST /api/vehicles/:id/restock (Restock Vehicle)', () => {
    it('should increase quantity by restock amount (Admin only)', async () => {
      const vehicle = await Vehicle.create(sampleVehicle);
      const res = await request(app)
        .post(`/api/vehicles/${vehicle._id}/restock`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ quantity: 5 });

      expect(res.status).toBe(200);
      expect(res.body.data.vehicle.quantity).toBe(sampleVehicle.quantity + 5);
    });

    it('should reject negative values for restock', async () => {
      const vehicle = await Vehicle.create(sampleVehicle);
      const res = await request(app)
        .post(`/api/vehicles/${vehicle._id}/restock`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ quantity: -3 });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('cannot be negative');
    });
  });
});
