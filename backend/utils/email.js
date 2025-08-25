const nodemailer = require('nodemailer');
const logger = require('./logger');

const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

const sendEmail = async (options) => {
  try {
    const transporter = createTransporter();
    
    const message = {
      from: `${process.env.FROM_NAME || 'Govt Doc System'} <${process.env.EMAIL_USER}>`,
      to: options.email,
      subject: options.subject,
      html: options.html || options.message
    };

    const info = await transporter.sendMail(message);
    logger.info(`Email sent: ${info.messageId}`);
    return info;
  } catch (error) {
    logger.error(`Email error: ${error.message}`);
    throw error;
  }
};

const sendOTP = async (email, name, otp) => {
  const html = `
    <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
        <h1 style="color: white; margin: 0;">Government Document Portal</h1>
      </div>
      <div style="padding: 30px; background-color: #f9f9f9;">
        <h2 style="color: #333; margin-bottom: 20px;">OTP Verification</h2>
        <p style="color: #666; font-size: 16px; margin-bottom: 20px;">Hi ${name},</p>
        <p style="color: #666; font-size: 16px; margin-bottom: 30px;">
          Your One-Time Password (OTP) for secure access to your government documents is:
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <div style="background-color: #667eea; color: white; font-size: 32px; font-weight: bold; padding: 20px; border-radius: 8px; letter-spacing: 5px;">
            ${otp}
          </div>
        </div>
        <p style="color: #666; font-size: 14px; margin-top: 30px;">
          This OTP is valid for 5 minutes. Do not share this code with anyone.
        </p>
        <div style="border-top: 1px solid #ddd; margin-top: 30px; padding-top: 20px; text-align: center;">
          <p style="color: #999; font-size: 12px;">
            Government Document Management System<br>
            This is an automated message, please do not reply.
          </p>
        </div>
      </div>
    </div>
  `;

  return sendEmail({
    email,
    subject: 'OTP Verification - Government Document Portal',
    html
  });
};

module.exports = { sendEmail, sendOTP };