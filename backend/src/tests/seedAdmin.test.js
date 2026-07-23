const mongoose = require('mongoose');
const dbHandler = require('./dbHandler');
const User = require('../models/User');
const seedAdmin = require('../utils/seedAdmin');

describe('Admin Seeding Script', () => {
  let mockLog;
  let mockError;

  beforeAll(async () => {
    await dbHandler.connect();
    // Set MONGODB_URI dummy variable so the validation in seedAdmin passes
    process.env.MONGODB_URI = 'mongodb://localhost:27017/test';
  });

  beforeEach(async () => {
    mockLog = jest.spyOn(console, 'log').mockImplementation(() => {});
    mockError = jest.spyOn(console, 'error').mockImplementation(() => {});
    await dbHandler.clearDatabase();
  });

  afterEach(() => {
    mockLog.mockRestore();
    mockError.mockRestore();
  });

  afterAll(async () => {
    await dbHandler.closeDatabase();
  });

  it('should create a new admin user if none exists', async () => {
    await seedAdmin(false);

    const admin = await User.findOne({ email: 'admin@dealership.com' });
    expect(admin).not.toBeNull();
    expect(admin.email).toBe('admin@dealership.com');
    expect(admin.role).toBe('admin');
    expect(admin.name).toBe('Dealership Admin');
  });

  it('should promote an existing user with role "user" to "admin" role without duplicating', async () => {
    await User.create({
      name: 'Old User',
      email: 'admin@dealership.com',
      password: 'password123',
      role: 'user',
    });
    
    await User.create({
      name: 'Unrelated User',
      email: 'user@dealership.com',
      password: 'password123',
      role: 'user',
    });

    await seedAdmin(false);

    const admin = await User.findOne({ email: 'admin@dealership.com' });
    expect(admin).not.toBeNull();
    expect(admin.role).toBe('admin');
    
    const unrelated = await User.findOne({ email: 'user@dealership.com' });
    expect(unrelated).not.toBeNull();
    expect(unrelated.role).toBe('user');
    
    const count = await User.countDocuments();
    expect(count).toBe(2);
  });
});
