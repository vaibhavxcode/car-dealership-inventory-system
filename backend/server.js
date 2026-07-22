const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Load environment variables
dotenv.config();

const app = require('./src/app');

// Database connection
const DB_URI = process.env.MONGODB_URI || 'mongodb+srv://vaibhavsrajputofficial_db_user:8cxIMY6RR7TNqFDL@cluster0.pxugdwy.mongodb.net/car_dealership?retryWrites=true&w=majority&appName=Cluster0';
const PORT = process.env.PORT || 5000;
const resolveSrvUri = require('./src/utils/dnsResolver');

resolveSrvUri(DB_URI).then((resolvedUri) => {
  mongoose
    .connect(resolvedUri)
    .then(() => {
      console.log('MongoDB connection successful');
      app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
      });
    })
    .catch((err) => {
      console.error('\n========================================================================');
      console.error('❌ MONGODB CONNECTION FAILURE DIAGNOSTIC:');
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
    });
});
