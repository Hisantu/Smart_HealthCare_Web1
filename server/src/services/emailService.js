const nodemailer = require('nodemailer');

// Create transporter with fallback to console logging if email not configured
const createTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || process.env.EMAIL_PASS === 'your_actual_gmail_app_password') {
    console.log('⚠️ Email not configured - notifications will be logged to console');
    return null;
  }
  
  return nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

const transporter = createTransporter();

// Test email configuration
const testEmailConfig = async () => {
  try {
    await transporter.verify();
    console.log('✅ Email service is ready');
    return true;
  } catch (error) {
    console.error('❌ Email service error:', error.message);
    return false;
  }
};

const sendTokenNotification = async (patientEmail, patientName, tokenNumber, departmentName) => {
  try {
    console.log(`📧 Token notification for: ${patientName} (${patientEmail})`);
    console.log(`🎫 Token: ${tokenNumber} | Department: ${departmentName}`);
    
    if (!transporter) {
      console.log('📝 EMAIL NOTIFICATION (Console Mode):');
      console.log('═══════════════════════════════════════');
      console.log(`To: ${patientEmail}`);
      console.log(`Subject: Token Generated - Smart Health`);
      console.log(`Dear ${patientName},`);
      console.log(`Your token ${tokenNumber} has been generated for ${departmentName}.`);
      console.log(`Date: ${new Date().toLocaleDateString()}`);
      console.log(`Time: ${new Date().toLocaleTimeString()}`);
      console.log('═══════════════════════════════════════');
      return true;
    }

    const mailOptions = {
      from: `Smart Health System <${process.env.EMAIL_USER}>`,
      to: patientEmail,
      subject: 'Token Generated - Smart Health',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4F46E5;">Token Generated Successfully</h2>
          <p>Dear ${patientName},</p>
          <p>Your token has been generated successfully. Here are the details:</p>
          <div style="background-color: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1F2937; margin: 0;">Token Details</h3>
            <p><strong>Token Number:</strong> ${tokenNumber}</p>
            <p><strong>Department:</strong> ${departmentName}</p>
            <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
            <p><strong>Time:</strong> ${new Date().toLocaleTimeString()}</p>
          </div>
          <p>Please keep this token number safe and arrive at the hospital on time.</p>
          <p>Thank you for choosing Smart Health!</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Token notification email sent successfully to:', patientEmail);
    return true;
  } catch (error) {
    console.error('❌ Failed to send token email:', error.message);
    return false;
  }
};

const sendAppointmentNotification = async (patientEmail, patientName, doctorName, departmentName, appointmentDate, timeSlot) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: patientEmail,
      subject: 'Appointment Confirmed - Smart Health',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #10B981;">Appointment Confirmed Successfully</h2>
          <p>Dear ${patientName},</p>
          <p>Your appointment has been confirmed. Here are the details:</p>
          <div style="background-color: #F0FDF4; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10B981;">
            <h3 style="color: #1F2937; margin: 0;">Appointment Details</h3>
            <p><strong>Doctor:</strong> ${doctorName}</p>
            <p><strong>Department:</strong> ${departmentName}</p>
            <p><strong>Date:</strong> ${new Date(appointmentDate).toLocaleDateString()}</p>
            <p><strong>Time:</strong> ${timeSlot}</p>
          </div>
          <p>Please arrive 15 minutes before your scheduled time.</p>
          <p>Thank you for choosing Smart Health!</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Appointment notification email sent successfully');
    return true;
  } catch (error) {
    console.error('Failed to send appointment email:', error);
    return false;
  }
};

module.exports = { sendTokenNotification, sendAppointmentNotification, testEmailConfig };