// server/src/services/notifService.js
const Notification = require('../models/Notification');
const Patient = require('../models/Patient');
const { sendSMS } = require('./smsService');

async function notifyPatient(patientId, type, message) {
  try {
    const patient = await Patient.findById(patientId);
    const notif = await Notification.create({ patient: patientId, type, message, status: 'PENDING' });

    if (patient?.phone) {
      const res = await sendSMS(patient.phone, message);
      notif.status = res?.ok ? 'SENT' : 'FAILED';
      notif.sentTime = new Date();
      await notif.save();
      return { ok: true, notif, sms: res };
    } else {
      return { ok: true, notif, sms: null };
    }
  } catch (err) {
    console.error('notifyPatient error', err);
    return { ok: false, error: err.message };
  }
}

module.exports = { notifyPatient };
