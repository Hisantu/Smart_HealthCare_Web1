const express = require('express');
const Patient = require('../models/Patient');
const memoryStore = require('../config/memoryStore');
const router = express.Router();

// Fallback to in-memory storage when MongoDB is not available
let useMemoryStore = false;

router.post('/', async (req, res) => {
  try {
    if (useMemoryStore) {
      // Use in-memory storage
      const existing = memoryStore.patients.find(p => p.phone === req.body.phone);
      if (existing) {
        return res.json(existing);
      }
      const patient = {
        _id: Date.now().toString(),
        ...req.body,
        createdAt: new Date()
      };
      memoryStore.patients.push(patient);
      return res.status(201).json(patient);
    }
    
    // Try MongoDB first
    const existing = await Patient.findOne({ phone: req.body.phone });
    if (existing) {
      return res.json(existing);
    }
    const patient = new Patient(req.body);
    await patient.save();
    res.status(201).json(patient);
  } catch (error) {
    // Fallback to memory store on MongoDB error
    useMemoryStore = true;
    const existing = memoryStore.patients.find(p => p.phone === req.body.phone);
    if (existing) {
      return res.json(existing);
    }
    const patient = {
      _id: Date.now().toString(),
      ...req.body,
      createdAt: new Date()
    };
    memoryStore.patients.push(patient);
    res.status(201).json(patient);
  }
});

router.get('/', async (req, res) => {
  try {
    if (useMemoryStore) {
      const { phone } = req.query;
      let patients = memoryStore.patients;
      if (phone) {
        patients = patients.filter(p => p.phone === phone);
      }
      return res.json(patients.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    }
    
    const { phone } = req.query;
    const query = phone ? { phone } : {};
    const patients = await Patient.find(query).sort({ createdAt: -1 });
    res.json(patients);
  } catch (error) {
    // Fallback to memory store
    useMemoryStore = true;
    const { phone } = req.query;
    let patients = memoryStore.patients;
    if (phone) {
      patients = patients.filter(p => p.phone === phone);
    }
    res.json(patients.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
  }
});

router.get('/:id', async (req, res) => {
  try {
    if (useMemoryStore) {
      const patient = memoryStore.patients.find(p => p._id === req.params.id);
      return res.json(patient);
    }
    
    const patient = await Patient.findById(req.params.id);
    res.json(patient);
  } catch (error) {
    useMemoryStore = true;
    const patient = memoryStore.patients.find(p => p._id === req.params.id);
    res.json(patient);
  }
});

module.exports = router;
