const express = require('express');
const Appointment = require('../models/Appointment');
const Notification = require('../models/Notification');
const { sendAppointmentNotification } = require('../services/emailService');
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const appointment = new Appointment(req.body);
    await appointment.save();
    
    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate('patient')
      .populate('doctor')
      .populate('department');

    const notification = new Notification({
      patient: appointment.patient,
      message: `Appointment confirmed for ${new Date(appointment.appointmentDate).toLocaleDateString()} at ${appointment.timeSlot}`,
      type: 'push',
      status: 'sent',
      sentAt: new Date()
    });
    await notification.save();

    // Send email notification if patient has email
    if (populatedAppointment.patient.email) {
      await sendAppointmentNotification(
        populatedAppointment.patient.email,
        populatedAppointment.patient.name,
        populatedAppointment.doctor.name,
        populatedAppointment.department.name,
        populatedAppointment.appointmentDate,
        populatedAppointment.timeSlot
      );
    }

    res.status(201).json(populatedAppointment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const { doctor, patient, date, department } = req.query;
    const query = {};
    
    if (doctor) query.doctor = doctor;
    if (patient) query.patient = patient;
    if (department) query.department = department;
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      query.appointmentDate = { $gte: startDate, $lt: endDate };
    }

    const appointments = await Appointment.find(query)
      .populate('patient')
      .populate('doctor')
      .populate('department')
      .sort({ appointmentDate: 1 });
    
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('patient').populate('doctor').populate('department');
    
    res.json(appointment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    
    res.json({ message: 'Appointment cancelled successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
