// Simple in-memory data store for testing
const inMemoryStore = {
  patients: [],
  departments: [
    { _id: '1', name: 'Cardiology', description: 'Heart care', isOpen: true, maxQueueSize: 30 },
    { _id: '2', name: 'Orthopedics', description: 'Bone and joint care', isOpen: true, maxQueueSize: 40 },
    { _id: '3', name: 'Pediatrics', description: 'Child care', isOpen: true, maxQueueSize: 50 },
    { _id: '4', name: 'General Medicine', description: 'General consultation', isOpen: true, maxQueueSize: 60 }
  ],
  doctors: [
    { _id: '1', name: 'Dr. Sarah Johnson', specialization: 'Interventional Cardiologist', department: '1', isAvailable: true },
    { _id: '2', name: 'Dr. Michael Rodriguez', specialization: 'Cardiac Surgeon', department: '1', isAvailable: true },
    { _id: '3', name: 'Dr. Jennifer Lee', specialization: 'Electrophysiologist', department: '1', isAvailable: true },
    { _id: '4', name: 'Dr. Michael Chen', specialization: 'Orthopedic Surgeon', department: '2', isAvailable: true }
  ],
  tokens: [],
  users: [
    { _id: '1', username: 'admin', password: '$2a$10$hash', role: 'admin', name: 'Admin User' }
  ]
};

module.exports = inMemoryStore;