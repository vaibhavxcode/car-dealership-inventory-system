const mongoose = require('mongoose');
const resolveSrvUri = require('../src/utils/dnsResolver');
require('dotenv').config();

const DB_URI = process.env.MONGODB_URI || 'mongodb+srv://vaibhavsrajputofficial_db_user:8cxIMY6RR7TNqFDL@cluster0.pxugdwy.mongodb.net/car_dealership?retryWrites=true&w=majority&appName=Cluster0';

const run = async () => {
  try {
    const resolvedUri = await resolveSrvUri(DB_URI);
    console.log('Resolved URI:', resolvedUri);
    await mongoose.connect(resolvedUri);
    console.log('Connected to Database successfully.');

    const Vehicle = mongoose.model('Vehicle', new mongoose.Schema({}, { strict: false }));
    const vehicles = await Vehicle.find({});
    console.log('Total Vehicles:', vehicles.length);
    console.log('Vehicles:', JSON.stringify(vehicles, null, 2));

    const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));
    const users = await User.find({});
    console.log('Total Users:', users.length);
    console.log('Users:', JSON.stringify(users.map(u => ({ name: u.name, email: u.email, role: u.role })), null, 2));

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Error querying database:', err);
    process.exit(1);
  }
};

run();
