const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: String,
  isOpen: { type: Boolean, default: true },
  maxQueueSize: { type: Number, default: 50 }
}, { timestamps: true });

module.exports = mongoose.model('Department', departmentSchema);
