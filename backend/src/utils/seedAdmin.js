const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const resolveSrvUri = require('./dnsResolver');

// Load environment variables
dotenv.config();

const DB_URI = process.env.MONGODB_URI;

const seedAdmin = async (shouldExit = true) => {
  try {
    if (!DB_URI) {
      throw new Error('MONGODB_URI environment variable is not defined.');
    }

    // Connect to database if not already connected
    if (mongoose.connection.readyState === 0) {
      const resolvedUri = await resolveSrvUri(DB_URI);
      await mongoose.connect(resolvedUri);
      console.log('Connected to MongoDB successfully.');
    }

    // Configure admin details from environment variables or use safe defaults
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@dealership.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'adminpassword123';
    const adminName = process.env.ADMIN_NAME || 'Dealership Admin';

    // Check if the user already exists
    const existingUser = await User.findOne({ email: adminEmail.toLowerCase() });

    if (existingUser) {
      console.log(`ℹ️ User with email "${adminEmail}" already exists.`);
      if (existingUser.role !== 'admin') {
        console.log(`⚠️ Existing user role is "${existingUser.role}". Updating to "admin"...`);
        existingUser.role = 'admin';
        await existingUser.save();
        console.log('✅ User role successfully updated to "admin".');
      } else {
        console.log('✅ Admin user is already configured properly. No changes made.');
      }
    } else {
      console.log(`Creating new admin account: ${adminEmail}`);
      await User.create({
        name: adminName,
        email: adminEmail,
        password: adminPassword,
        role: 'admin',
      });
      console.log('✅ Admin user created successfully.');
    }

    if (shouldExit) {
      await mongoose.connection.close();
      console.log('MongoDB connection closed.');
      process.exit(0);
    }
  } catch (err) {
    console.error('❌ Error running admin seeding script:', err.message);
    if (shouldExit) {
      process.exit(1);
    } else {
      throw err;
    }
  }
};

if (require.main === module) {
  seedAdmin(true);
}

module.exports = seedAdmin;
