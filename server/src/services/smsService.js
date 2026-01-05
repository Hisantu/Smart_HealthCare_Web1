// server/src/services/smsService.js
const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_FROM;

let client;
if (accountSid && authToken) client = twilio(accountSid, authToken);

async function sendSMS(to, body) {
  if (!to || !body) return null;
  if (!client || !fromNumber) {
    console.log(`[sms stub] to=${to} body=${body}`);
    return { ok: true, stub: true };
  }
  try {
    const msg = await client.messages.create({ body, from: fromNumber, to });
    return { ok: true, sid: msg.sid };
  } catch (err) {
    console.error('Twilio error', err);
    return { ok: false, error: err.message };
  }
}

module.exports = { sendSMS };
