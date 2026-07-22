const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Vehicle = require('../models/Vehicle');

dotenv.config();

const DB_URI = process.env.MONGODB_URI || 'mongodb+srv://vaibhavsrajputofficial_db_user:8cxIMY6RR7TNqFDL@cluster0.pxugdwy.mongodb.net/car_dealership?retryWrites=true&w=majority&appName=Cluster0';

const users = [
  {
    name: 'Dealership Admin',
    email: 'admin@dealership.com',
    password: 'adminpassword123',
    role: 'admin',
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'userpassword123',
    role: 'user',
  },
];

const vehicles = [
  {
    make: 'Toyota',
    model: 'Camry',
    category: 'Sedan',
    price: 26000,
    quantity: 10,
    imageUrl: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&q=80&w=800',
  },
  {
    make: 'Honda',
    model: 'CR-V',
    category: 'SUV',
    price: 31000,
    quantity: 8,
    imageUrl: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800',
  },
  {
    make: 'Ford',
    model: 'F-150',
    category: 'Truck',
    price: 45000,
    quantity: 5,
    imageUrl: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=800',
  },
  {
    make: 'Volkswagen',
    model: 'Golf',
    category: 'Hatchback',
    price: 24000,
    quantity: 6,
    imageUrl: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=800',
  },
  {
    make: 'Tesla',
    model: 'Model Y',
    category: 'SUV',
    price: 48000,
    quantity: 4,
    imageUrl: 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&q=80&w=800',
  },
  {
    make: 'Chevrolet',
    model: 'Bolt EV',
    category: 'Hatchback',
    price: 28000,
    quantity: 0, // Set to 0 to test out-of-stock scenario
    imageUrl: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=800',
  },
];

const resolveSrvUri = require('./dnsResolver');

const seedDB = async () => {
  try {
    const resolvedUri = await resolveSrvUri(DB_URI);
    await mongoose.connect(resolvedUri);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Vehicle.deleteMany({});
    console.log('Cleared existing User and Vehicle documents.');

    // Seed users (passwords will be hashed pre-save)
    await User.create(users);
    console.log('Successfully seeded Users.');

    // Seed vehicles
    await Vehicle.create(vehicles);
    console.log('Successfully seeded Vehicles.');

    console.log('Database seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('\n========================================================================');
    console.error('❌ SEEDING DATABASE CONNECTION FAILURE DIAGNOSTIC:');
    console.error('------------------------------------------------------------------------');
    console.error(`Error message: ${err.message}`);
    console.error(`Error code: ${err.code || 'N/A'}`);
    
    if (err.message.includes('querySrv') || err.code === 'ECONNREFUSED') {
      console.error('\n💡 POSSIBILITIES:');
      console.error('1. Your current network or DNS resolver is blocking SRV records used by mongodb+srv:// URIs.');
      console.error('2. You are behind a firewall/VPN that blocks outgoing connections to port 27017.');
      console.error('3. Make sure to check your Atlas Network Access tab and whitelist your current IP address (or set to 0.0.0.0/0).');
    } else if (err.message.includes('Authentication failed') || err.message.includes('bad auth')) {
      console.error('\n💡 POSSIBILITIES:');
      console.error('1. The MongoDB username or password in your MONGODB_URI is incorrect.');
      console.error('2. Check if the password contains any special characters that need URL encoding.');
    }
    console.error('========================================================================\n');
    process.exit(1);
  }
};

seedDB();
