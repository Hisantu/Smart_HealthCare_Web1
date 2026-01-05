require('dotenv').config();
const mongoose = require('mongoose');
const testData = require('./create_test_data');

// Import models
const User = require('../models/User');
const Department = require('../models/Department');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const Notification = require('../models/Notification');
const Shift = require('../models/Shift');

async function initializeDatabase() {
  try {
    // Use a local MongoDB connection if the cloud connection fails
    let mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017/smart_health_test';
    
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(mongoUrl);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await Promise.all([
      User.deleteMany({}),
      Department.deleteMany({}),
      Doctor.deleteMany({}),
      Patient.deleteMany({}),
      Notification.deleteMany({}),
      Shift.deleteMany({})
    ]);

    // Create departments first
    console.log('🏥 Creating departments...');
    const departments = await Department.insertMany(testData.departments);

    // Create users
    console.log('👥 Creating users...');
    const users = await User.insertMany(testData.users);

    // Create doctors with department references
    console.log('👨‍⚕️ Creating doctors...');
    const doctorsWithDepts = testData.doctors.map((doctor, index) => ({
      ...doctor,
      department: departments[Math.floor(index / 3)]._id // 3 doctors per department
    }));
    const doctors = await Doctor.insertMany(doctorsWithDepts);

    // Create shifts with doctor and department references
    console.log('📅 Creating shifts...');
    const shiftsWithRefs = [
      // Cardiology shifts - 3 doctors
      { ...testData.shifts[0], doctor: doctors[0]._id, department: departments[0]._id },
      { ...testData.shifts[1], doctor: doctors[1]._id, department: departments[0]._id },
      { ...testData.shifts[2], doctor: doctors[2]._id, department: departments[0]._id },
      
      // Orthopedics shifts - 3 doctors
      { ...testData.shifts[3], doctor: doctors[3]._id, department: departments[1]._id },
      { ...testData.shifts[4], doctor: doctors[4]._id, department: departments[1]._id },
      { ...testData.shifts[5], doctor: doctors[5]._id, department: departments[1]._id },
      
      // Pediatrics shifts - 3 doctors
      { ...testData.shifts[6], doctor: doctors[6]._id, department: departments[2]._id },
      { ...testData.shifts[7], doctor: doctors[7]._id, department: departments[2]._id },
      { ...testData.shifts[8], doctor: doctors[8]._id, department: departments[2]._id },
      
      // General Medicine shifts - 3 doctors
      { ...testData.shifts[9], doctor: doctors[9]._id, department: departments[3]._id },
      { ...testData.shifts[10], doctor: doctors[10]._id, department: departments[3]._id },
      { ...testData.shifts[11], doctor: doctors[11]._id, department: departments[3]._id }
    ];
    await Shift.insertMany(shiftsWithRefs);

    // Create patients
    console.log('🏃‍♂️ Creating patients...');
    const patients = await Patient.insertMany(testData.patients);

    // Create notifications with patient references
    console.log('📱 Creating notifications...');
    const notificationsWithRefs = testData.notifications.map((notification, index) => ({
      ...notification,
      patient: patients[index]._id
    }));
    await Notification.insertMany(notificationsWithRefs);

    console.log('\n🎉 Database initialized successfully!');
    console.log('📊 Created:');
    console.log(`   - ${departments.length} Departments`);
    console.log(`   - ${users.length} Users`);
    console.log(`   - ${doctors.length} Doctors`);
    console.log(`   - ${shiftsWithRefs.length} Shifts`);
    console.log(`   - ${patients.length} Patients`);
    console.log(`   - ${notificationsWithRefs.length} Notifications`);

    console.log('\n🔑 Login Credentials:');
    console.log('   Admin: admin / admin123');
    console.log('   Receptionist: receptionist / recep123');
    console.log('   Doctor: doctor1 / doc123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error initializing database:', error.message);
    console.log('\n💡 Tip: Make sure MongoDB is running or check your connection string');
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  initializeDatabase();
}

module.exports = initializeDatabase;