const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  email: String,
  age: Number,
  gender: { type: String, enum: ['Male', 'Female', 'Other'] },
  address: String,
  medicalHistory: [String]
}, { timestamps: true });

module.exports = mongoose.model('Patient', patientSchema);
