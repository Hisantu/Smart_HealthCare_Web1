require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Department = require('../models/Department');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');
const Notification = require('../models/Notification');
const Shift = require('../models/Shift');

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to MongoDB');

    await User.deleteMany({});
    await Department.deleteMany({});
    await Doctor.deleteMany({});
    await Patient.deleteMany({});
    await Appointment.deleteMany({});
    await Notification.deleteMany({});
    await Shift.deleteMany({});

    const admin = await User.create({
      username: 'admin',
      password: 'admin123',
      role: 'admin',
      name: 'Admin User'
    });

    const receptionist = await User.create({
      username: 'receptionist',
      password: 'recep123',
      role: 'receptionist',
      name: 'Receptionist User'
    });

    const departments = await Department.insertMany([
      { name: 'Cardiology', description: 'Heart care', isOpen: true, maxQueueSize: 30 },
      { name: 'Orthopedics', description: 'Bone and joint care', isOpen: true, maxQueueSize: 40 },
      { name: 'Pediatrics', description: 'Child care', isOpen: true, maxQueueSize: 50 },
      { name: 'General Medicine', description: 'General consultation', isOpen: true, maxQueueSize: 60 }
    ]);

    const doctors = await Doctor.insertMany([
      // Cardiology Department - 3 doctors
      { name: 'Dr. Sarah Johnson', specialization: 'Interventional Cardiologist', department: departments[0]._id, phone: '555-1001', email: 'sarah@hospital.com', isAvailable: true },
      { name: 'Dr. Michael Rodriguez', specialization: 'Cardiac Surgeon', department: departments[0]._id, phone: '555-1002', email: 'michael.r@hospital.com', isAvailable: true },
      { name: 'Dr. Jennifer Lee', specialization: 'Electrophysiologist', department: departments[0]._id, phone: '555-1003', email: 'jennifer@hospital.com', isAvailable: true },
      
      // Orthopedics Department - 3 doctors
      { name: 'Dr. Michael Chen', specialization: 'Orthopedic Surgeon', department: departments[1]._id, phone: '555-2001', email: 'michael.c@hospital.com', isAvailable: true },
      { name: 'Dr. David Thompson', specialization: 'Sports Medicine Specialist', department: departments[1]._id, phone: '555-2002', email: 'david@hospital.com', isAvailable: true },
      { name: 'Dr. Lisa Wang', specialization: 'Joint Replacement Surgeon', department: departments[1]._id, phone: '555-2003', email: 'lisa@hospital.com', isAvailable: true },
      
      // Pediatrics Department - 3 doctors
      { name: 'Dr. Emily Davis', specialization: 'General Pediatrician', department: departments[2]._id, phone: '555-3001', email: 'emily@hospital.com', isAvailable: true },
      { name: 'Dr. James Miller', specialization: 'Pediatric Cardiologist', department: departments[2]._id, phone: '555-3002', email: 'james@hospital.com', isAvailable: true },
      { name: 'Dr. Anna Garcia', specialization: 'Pediatric Neurologist', department: departments[2]._id, phone: '555-3003', email: 'anna@hospital.com', isAvailable: true },
      
      // General Medicine Department - 3 doctors
      { name: 'Dr. Robert Wilson', specialization: 'Internal Medicine', department: departments[3]._id, phone: '555-4001', email: 'robert@hospital.com', isAvailable: true },
      { name: 'Dr. Maria Santos', specialization: 'Family Medicine', department: departments[3]._id, phone: '555-4002', email: 'maria@hospital.com', isAvailable: true },
      { name: 'Dr. Kevin Brown', specialization: 'General Physician', department: departments[3]._id, phone: '555-4003', email: 'kevin@hospital.com', isAvailable: true }
    ]);

    // Create sample patients
    const patients = await Patient.insertMany([
      { name: 'John Smith', phone: '555-0101', email: 'john@email.com', age: 45, gender: 'Male' },
      { name: 'Mary Johnson', phone: '555-0102', email: 'mary@email.com', age: 38, gender: 'Female' },
      { name: 'David Wilson', phone: '555-0103', email: 'david@email.com', age: 52, gender: 'Male' },
      { name: 'Sarah Davis', phone: '555-0104', email: 'sarah@email.com', age: 29, gender: 'Female' },
      { name: 'Mike Brown', phone: '555-0105', email: 'mike@email.com', age: 41, gender: 'Male' }
    ]);

    // Create sample appointments for today
    const today = new Date();
    await Appointment.insertMany([
      // Cardiology appointments
      { patient: patients[0]._id, doctor: doctors[0]._id, department: departments[0]._id, appointmentDate: today, timeSlot: '09:00 AM', status: 'scheduled' },
      { patient: patients[1]._id, doctor: doctors[1]._id, department: departments[0]._id, appointmentDate: today, timeSlot: '10:30 AM', status: 'scheduled' },
      
      // Orthopedics appointments
      { patient: patients[2]._id, doctor: doctors[3]._id, department: departments[1]._id, appointmentDate: today, timeSlot: '11:00 AM', status: 'scheduled' },
      
      // Pediatrics appointments
      { patient: patients[3]._id, doctor: doctors[6]._id, department: departments[2]._id, appointmentDate: today, timeSlot: '02:00 PM', status: 'scheduled' },
      
      // General Medicine appointments
      { patient: patients[4]._id, doctor: doctors[9]._id, department: departments[3]._id, appointmentDate: today, timeSlot: '03:30 PM', status: 'scheduled' }
    ]);

    // Create sample shifts for doctors
    await Shift.insertMany([
      // Cardiology shifts - 3 doctors
      { doctor: doctors[0]._id, department: departments[0]._id, dayOfWeek: 'Monday', startTime: '09:00', endTime: '17:00', isActive: true },
      { doctor: doctors[1]._id, department: departments[0]._id, dayOfWeek: 'Wednesday', startTime: '09:00', endTime: '17:00', isActive: true },
      { doctor: doctors[2]._id, department: departments[0]._id, dayOfWeek: 'Friday', startTime: '08:00', endTime: '16:00', isActive: true },
      
      // Orthopedics shifts - 3 doctors
      { doctor: doctors[3]._id, department: departments[1]._id, dayOfWeek: 'Monday', startTime: '08:00', endTime: '16:00', isActive: true },
      { doctor: doctors[4]._id, department: departments[1]._id, dayOfWeek: 'Tuesday', startTime: '09:00', endTime: '17:00', isActive: true },
      { doctor: doctors[5]._id, department: departments[1]._id, dayOfWeek: 'Thursday', startTime: '10:00', endTime: '18:00', isActive: true },
      
      // Pediatrics shifts - 3 doctors
      { doctor: doctors[6]._id, department: departments[2]._id, dayOfWeek: 'Tuesday', startTime: '09:00', endTime: '17:00', isActive: true },
      { doctor: doctors[7]._id, department: departments[2]._id, dayOfWeek: 'Wednesday', startTime: '08:00', endTime: '16:00', isActive: true },
      { doctor: doctors[8]._id, department: departments[2]._id, dayOfWeek: 'Saturday', startTime: '10:00', endTime: '14:00', isActive: true },
      
      // General Medicine shifts - 3 doctors
      { doctor: doctors[9]._id, department: departments[3]._id, dayOfWeek: 'Monday', startTime: '08:00', endTime: '20:00', isActive: true },
      { doctor: doctors[10]._id, department: departments[3]._id, dayOfWeek: 'Thursday', startTime: '09:00', endTime: '17:00', isActive: true },
      { doctor: doctors[11]._id, department: departments[3]._id, dayOfWeek: 'Saturday', startTime: '09:00', endTime: '13:00', isActive: true }
    ]);

    // Create sample notifications
    await Notification.insertMany([
      { patient: patients[0]._id, message: 'Your appointment is confirmed for today at 09:00 AM', type: 'sms', status: 'sent', sentAt: new Date() },
      { patient: patients[1]._id, message: 'Reminder: Your appointment is in 30 minutes', type: 'push', status: 'sent', sentAt: new Date() },
      { patient: patients[2]._id, message: 'Your appointment has been rescheduled', type: 'email', status: 'pending' },
      { patient: patients[3]._id, message: 'Please arrive 15 minutes early for your appointment', type: 'sms', status: 'sent', sentAt: new Date() },
      { patient: patients[4]._id, message: 'Your test results are ready for pickup', type: 'push', status: 'failed' }
    ]);

    console.log('✅ Seed data created successfully');
    console.log('Admin: admin / admin123');
    console.log('Receptionist: receptionist / recep123');
    console.log('📊 Test data includes:');
    console.log('- 4 Departments');
    console.log('- 12 Doctors');
    console.log('- 5 Patients');
    console.log('- 5 Appointments');
    console.log('- 12 Shifts (3 per department)');
    console.log('- 5 Notifications');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
}

seed();
