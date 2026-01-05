const express = require('express');
const Notification = require('../models/Notification');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { patient } = req.query;
    const query = patient ? { patient } : {};
    const notifications = await Notification.find(query)
      .populate('patient')
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
