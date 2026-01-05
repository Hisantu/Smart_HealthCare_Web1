// server/src/config/db.js
const mongoose = require('mongoose');

module.exports = () => {
  const url = process.env.MONGO_URL;
  if (!url) {
    console.error('❌ MONGO_URL not set in environment variables');
    process.exit(1);
  }
  mongoose.set('strictQuery', false);
  
  // If connection string doesn't have a database name, use 'smarthealth'
  const connectionOptions = url.includes('/?') || url.includes('?') 
    ? {} 
    : { dbName: 'smarthealth' };
  
  mongoose.connect(url, connectionOptions)
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch(err => {
      console.error('❌ MongoDB connection error:', err.message);
      console.log('💡 Check your MONGO_URL connection string');
      process.exit(1);
    });
};
