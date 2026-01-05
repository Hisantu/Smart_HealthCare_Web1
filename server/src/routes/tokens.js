const express = require('express');
const Token = require('../models/Token');
const Department = require('../models/Department');
const Notification = require('../models/Notification');
const { sendTokenNotification } = require('../services/emailService');
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { patient, patientId, department, priority } = req.body;
    
    // Support both 'patient' and 'patientId' for backward compatibility
    const actualPatientId = patient || patientId;
    
    console.log('Token request:', { actualPatientId, department, priority });
    
    if (!department) {
      return res.status(400).json({ error: 'Department is required' });
    }
    
    const dept = await Department.findById(department);
    console.log('Found department:', dept);
    
    if (!dept) {
      return res.status(400).json({ error: 'Department not found' });
    }

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    
    const queueCount = await Token.countDocuments({
      department,
      createdAt: { $gte: todayStart },
      status: { $in: ['waiting', 'called', 'serving'] }
    });

    if (queueCount >= dept.maxQueueSize) {
      return res.status(400).json({ error: 'Queue is full' });
    }

    const lastToken = await Token.findOne({ department, createdAt: { $gte: todayStart } })
      .sort({ createdAt: -1 });
    
    const nextNum = lastToken ? parseInt(lastToken.tokenNumber.split('-')[1]) + 1 : 1;
    const deptPrefix = dept.name.substring(0, 3).toUpperCase();
    const tokenNumber = `${deptPrefix}-${String(nextNum).padStart(3, '0')}`;

    const token = new Token({ tokenNumber, patient: actualPatientId, department, priority });
    await token.save();

    const populatedToken = await Token.findById(token._id)
      .populate('patient')
      .populate('department');

    // Send email notification if patient has email
    console.log('📧 Checking email for patient:', populatedToken.patient.email);
    if (populatedToken.patient && populatedToken.patient.email) {
      console.log('📤 Sending token email to:', populatedToken.patient.email);
      const emailSent = await sendTokenNotification(
        populatedToken.patient.email,
        populatedToken.patient.name,
        populatedToken.tokenNumber,
        populatedToken.department.name
      );
      console.log('📧 Email sent status:', emailSent ? '✅ Success' : '❌ Failed');
    } else {
      console.log('⚠️ No email address found for patient');
    }

    if (req.io) {
      req.io.emit('tokenCreated', populatedToken);
    }
    res.status(201).json(populatedToken);
  } catch (error) {
    console.error('Token creation error:', error);
    res.status(400).json({ error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const { department, status } = req.query;
    const query = {};
    
    if (department) query.department = department;
    if (status) query.status = status;

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    query.createdAt = { $gte: todayStart };

    const tokens = await Token.find(query)
      .populate('patient')
      .populate('department')
      .populate('doctor')
      .sort({ priority: -1, createdAt: 1 });
    
    res.json(tokens);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch('/:id/call', async (req, res) => {
  try {
    const token = await Token.findByIdAndUpdate(
      req.params.id,
      { status: 'called', calledAt: new Date(), counter: req.body.counter },
      { new: true }
    ).populate('patient').populate('department');

    const notification = new Notification({
      patient: token.patient._id,
      token: token._id,
      message: `Your token ${token.tokenNumber} is being called. Please proceed to ${req.body.counter || 'counter'}`,
      type: 'push',
      status: 'sent',
      sentAt: new Date()
    });
    await notification.save();

    req.io.emit('tokenCalled', token);
    res.json(token);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.patch('/:id/skip', async (req, res) => {
  try {
    const token = await Token.findByIdAndUpdate(
      req.params.id,
      { status: 'skipped' },
      { new: true }
    ).populate('patient').populate('department');

    req.io.emit('tokenUpdated', token);
    res.json(token);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.patch('/:id/complete', async (req, res) => {
  try {
    const token = await Token.findByIdAndUpdate(
      req.params.id,
      { status: 'completed', completedAt: new Date() },
      { new: true }
    ).populate('patient').populate('department');

    req.io.emit('tokenUpdated', token);
    res.json(token);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const token = await Token.findByIdAndDelete(req.params.id);
    if (!token) {
      return res.status(404).json({ error: 'Token not found' });
    }
    
    if (req.io) {
      req.io.emit('tokenDeleted', { _id: req.params.id });
    }
    
    res.json({ message: 'Token cancelled successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Test email endpoint
router.post('/test-email', async (req, res) => {
  try {
    const { email } = req.body;
    const { sendTokenNotification } = require('../services/emailService');
    
    const result = await sendTokenNotification(
      email,
      'Test User',
      'TEST-001',
      'Test Department'
    );
    
    res.json({ 
      success: result, 
      message: result ? 'Test email sent successfully' : 'Failed to send test email'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
