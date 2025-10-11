import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { config } from '../../../lib/config.js';

export async function POST(request) {
  try {
    const { to } = await request.json();

    // Create transporter using your SMTP settings
    const transporter = nodemailer.createTransport({
      host: config.smtp.host,
      port: config.smtp.port,
      secure: config.smtp.secure,
      auth: {
        user: config.smtp.user,
        pass: config.smtp.pass,
      },
    });

    // Test email options
    const mailOptions = {
      from: `${config.app.name} <${config.smtp.user}>`,
      to: to || 'theitxprts786@gmail.com',
      subject: `Test Email from ${config.app.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">✅ Email Test Successful!</h2>
          <p>This is a test email sent from your Next.js application using Nodemailer.</p>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
            <p><strong>From:</strong> ${config.smtp.user}</p>
            <p><strong>To:</strong> ${to || 'theitxprts786@gmail.com'}</p>
            <p><strong>Base URL:</strong> ${config.baseUrl}</p>
          </div>
          <p style="color: #666; font-size: 14px;">If you received this email, your email configuration is working correctly! 🎉</p>
        </div>
      `,
      text: 'This is a test email sent from your Next.js application. Email functionality is working correctly!',
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);

    return NextResponse.json({
      success: true,
      message: 'Email sent successfully!',
      messageId: info.messageId,
      recipient: to || 'theitxprts786@gmail.com'
    }, { status: 200 });

  } catch (error) {
    console.error('Email error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      details: 'Make sure SMTP settings (SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS) are set in your .env file'
    }, { status: 500 });
  }
}

// Also support GET request for quick testing
export async function GET() {
  return NextResponse.json({
    message: 'Email test endpoint is ready. Send a POST request to test email functionality.',
    usage: {
      method: 'POST',
      body: { to: 'recipient@example.com' },
      note: 'The "to" field is optional. Default: theitxprts786@gmail.com'
    }
  });
}

