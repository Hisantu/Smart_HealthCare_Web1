// server/src/routes/display.js
const express = require('express');
const router = express.Router();
const Token = require('../models/Token');

// get current called token for a dept
router.get('/now-serving/:deptId', async (req, res) => {
  const { deptId } = req.params;
  const now = await Token.findOne({ dept: deptId, status: 'CALLED' }).sort({ calledTime: -1 }).lean();
  res.json({ ok:true, now });
});

// get upcoming queue
router.get('/queue/:deptId', async (req, res) => {
  const { deptId } = req.params;
  const queue = await Token.find({ dept: deptId, status: 'ISSUED' }).sort({ priority: -1, issuedTime: 1 }).limit(20).lean();
  res.json({ ok:true, queue });
});

module.exports = router;
