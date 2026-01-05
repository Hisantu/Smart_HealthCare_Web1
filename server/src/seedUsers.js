require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to MongoDB');

    // Clear existing users
    await User.deleteMany({});

    // Create initial users
    const users = [
      {
        username: 'admin',
        password: 'admin123',
        role: 'admin',
        name: 'Admin User',
        email: 'admin@smarthealth.com'
      },
      {
        username: 'receptionist',
        password: 'recep123',
        role: 'receptionist',
        name: 'Receptionist User',
        email: 'receptionist@smarthealth.com'
      },
      {
        username: 'doctor1',
        password: 'doc123',
        role: 'doctor',
        name: 'Dr. Sarah Johnson',
        email: 'sarah.johnson@smarthealth.com'
      }
    ];

    await User.insertMany(users);
    console.log('✅ Users seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding users:', error);
    process.exit(1);
  }
};

seedUsers();