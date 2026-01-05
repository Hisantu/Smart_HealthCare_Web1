// server/src/app.js
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();
require('./config/db')(); // connect to MongoDB

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(morgan('dev'));

// Serve static files from React build
app.use(express.static(path.join(__dirname, '../../web/dist')));

// Routes
app.get('/api/health', (req, res) => res.json({ ok: true, now: new Date() }));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/patients', require('./routes/patients'));
app.use('/api/tokens', require('./routes/tokens'));
app.use('/api/appointments', require('./routes/appointments'));
app.use('/api/doctors', require('./routes/doctors'));
app.use('/api/display', require('./routes/display'));

// Serve React app for all non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../web/dist/index.html'));
});

// error handler
app.use((err, req, res, next) => {
  console.error(err.stack || err);
  res.status(err.status || 500).json({ ok: false, error: err.message || 'Server error' });
});

module.exports = app;
