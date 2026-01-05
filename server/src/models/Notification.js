const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  token: { type: mongoose.Schema.Types.ObjectId, ref: 'Token' },
  message: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['sms', 'push', 'email'],
    default: 'push'
  },
  status: { 
    type: String, 
    enum: ['pending', 'sent', 'failed'],
    default: 'pending'
  },
  sentAt: Date
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
