// Test data creation script for Smart Health System
// This script creates sample data for all collections

const testData = {
  departments: [
    { name: 'Cardiology', description: 'Heart care', isOpen: true, maxQueueSize: 30 },
    { name: 'Orthopedics', description: 'Bone and joint care', isOpen: true, maxQueueSize: 40 },
    { name: 'Pediatrics', description: 'Child care', isOpen: true, maxQueueSize: 50 },
    { name: 'General Medicine', description: 'General consultation', isOpen: true, maxQueueSize: 60 }
  ],

  users: [
    { username: 'admin', password: 'admin123', role: 'admin', name: 'Admin User', email: 'admin@hospital.com' },
    { username: 'receptionist', password: 'recep123', role: 'receptionist', name: 'Receptionist User', email: 'receptionist@hospital.com' },
    { username: 'doctor1', password: 'doc123', role: 'doctor', name: 'Dr. Sarah Johnson', email: 'sarah@hospital.com' },
    { username: 'doctor2', password: 'doc123', role: 'doctor', name: 'Dr. Michael Chen', email: 'michael@hospital.com' }
  ],

  doctors: [
    // Cardiology Department - 3 doctors
    { name: 'Dr. Sarah Johnson', specialization: 'Interventional Cardiologist', phone: '555-1001', email: 'sarah@hospital.com', isAvailable: true },
    { name: 'Dr. Michael Rodriguez', specialization: 'Cardiac Surgeon', phone: '555-1002', email: 'michael.r@hospital.com', isAvailable: true },
    { name: 'Dr. Jennifer Lee', specialization: 'Electrophysiologist', phone: '555-1003', email: 'jennifer@hospital.com', isAvailable: true },
    
    // Orthopedics Department - 3 doctors
    { name: 'Dr. Michael Chen', specialization: 'Orthopedic Surgeon', phone: '555-2001', email: 'michael.c@hospital.com', isAvailable: true },
    { name: 'Dr. David Thompson', specialization: 'Sports Medicine Specialist', phone: '555-2002', email: 'david@hospital.com', isAvailable: true },
    { name: 'Dr. Lisa Wang', specialization: 'Joint Replacement Surgeon', phone: '555-2003', email: 'lisa@hospital.com', isAvailable: true },
    
    // Pediatrics Department - 3 doctors
    { name: 'Dr. Emily Davis', specialization: 'General Pediatrician', phone: '555-3001', email: 'emily@hospital.com', isAvailable: true },
    { name: 'Dr. James Miller', specialization: 'Pediatric Cardiologist', phone: '555-3002', email: 'james@hospital.com', isAvailable: true },
    { name: 'Dr. Anna Garcia', specialization: 'Pediatric Neurologist', phone: '555-3003', email: 'anna@hospital.com', isAvailable: true },
    
    // General Medicine Department - 3 doctors
    { name: 'Dr. Robert Wilson', specialization: 'Internal Medicine', phone: '555-4001', email: 'robert@hospital.com', isAvailable: true },
    { name: 'Dr. Maria Santos', specialization: 'Family Medicine', phone: '555-4002', email: 'maria@hospital.com', isAvailable: true },
    { name: 'Dr. Kevin Brown', specialization: 'General Physician', phone: '555-4003', email: 'kevin@hospital.com', isAvailable: true }
  ],

  shifts: [
    // Cardiology shifts - 3 doctors
    { dayOfWeek: 'Monday', startTime: '09:00', endTime: '17:00', isActive: true },
    { dayOfWeek: 'Wednesday', startTime: '09:00', endTime: '17:00', isActive: true },
    { dayOfWeek: 'Friday', startTime: '08:00', endTime: '16:00', isActive: true },
    
    // Orthopedics shifts - 3 doctors
    { dayOfWeek: 'Monday', startTime: '08:00', endTime: '16:00', isActive: true },
    { dayOfWeek: 'Tuesday', startTime: '09:00', endTime: '17:00', isActive: true },
    { dayOfWeek: 'Thursday', startTime: '10:00', endTime: '18:00', isActive: true },
    
    // Pediatrics shifts - 3 doctors
    { dayOfWeek: 'Tuesday', startTime: '09:00', endTime: '17:00', isActive: true },
    { dayOfWeek: 'Wednesday', startTime: '08:00', endTime: '16:00', isActive: true },
    { dayOfWeek: 'Saturday', startTime: '10:00', endTime: '14:00', isActive: true },
    
    // General Medicine shifts - 3 doctors
    { dayOfWeek: 'Monday', startTime: '08:00', endTime: '20:00', isActive: true },
    { dayOfWeek: 'Thursday', startTime: '09:00', endTime: '17:00', isActive: true },
    { dayOfWeek: 'Saturday', startTime: '09:00', endTime: '13:00', isActive: true }
  ],

  patients: [
    { name: 'John Smith', phone: '555-0101', email: 'john@email.com', age: 45, gender: 'Male' },
    { name: 'Mary Johnson', phone: '555-0102', email: 'mary@email.com', age: 38, gender: 'Female' },
    { name: 'David Wilson', phone: '555-0103', email: 'david@email.com', age: 52, gender: 'Male' },
    { name: 'Sarah Davis', phone: '555-0104', email: 'sarah@email.com', age: 29, gender: 'Female' },
    { name: 'Mike Brown', phone: '555-0105', email: 'mike@email.com', age: 41, gender: 'Male' }
  ],

  notifications: [
    { message: 'Your appointment is confirmed for today at 09:00 AM', type: 'sms', status: 'sent', sentAt: new Date() },
    { message: 'Reminder: Your appointment is in 30 minutes', type: 'push', status: 'sent', sentAt: new Date() },
    { message: 'Your appointment has been rescheduled', type: 'email', status: 'pending' },
    { message: 'Please arrive 15 minutes early for your appointment', type: 'sms', status: 'sent', sentAt: new Date() },
    { message: 'Your test results are ready for pickup', type: 'push', status: 'failed' }
  ]
};

console.log('📋 Test Data Structure Created');
console.log('🏥 Collections included:');
console.log(`- Departments: ${testData.departments.length} records`);
console.log(`- Users: ${testData.users.length} records`);
console.log(`- Doctors: ${testData.doctors.length} records (3 per department)`);
console.log(`- Shifts: ${testData.shifts.length} records (3 per department)`);
console.log(`- Patients: ${testData.patients.length} records`);
console.log(`- Notifications: ${testData.notifications.length} records`);

console.log('\n🔑 Test Login Credentials:');
console.log('Admin: admin / admin123');
console.log('Receptionist: receptionist / recep123');
console.log('Doctor: doctor1 / doc123');

module.exports = testData;