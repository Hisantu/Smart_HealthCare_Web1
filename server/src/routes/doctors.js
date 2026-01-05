const express = require('express');
const Doctor = require('../models/Doctor');
const Shift = require('../models/Shift');
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const doctor = new Doctor(req.body);
    await doctor.save();
    res.status(201).json(doctor);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const { department } = req.query;
    const query = department ? { department } : {};
    const doctors = await Doctor.find(query).populate('department');
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(doctor);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/:id/shifts', async (req, res) => {
  try {
    const shifts = await Shift.find({ doctor: req.params.id }).populate('department');
    res.json(shifts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/:id/shifts', async (req, res) => {
  try {
    const shift = new Shift({ ...req.body, doctor: req.params.id });
    await shift.save();
    res.status(201).json(shift);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
