// Standalone Email Test Script
// Run with: node test-email.js

const nodemailer = require('nodemailer');
require('dotenv').config();

async function testEmail() {
  console.log('\n🔧 Testing Email Configuration...\n');

  // Check environment variables
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.error('❌ Error: SMTP settings not found in .env file\n');
    console.log('Please add the following to your .env file:');
    console.log('SMTP_HOST=smtp.your-provider.com');
    console.log('SMTP_PORT=465 or 587');
    console.log('SMTP_USER=your-email@domain.com');
    console.log('SMTP_PASS=your-password');
    console.log('SMTP_SECURE=true or false\n');
    process.exit(1);
  }

  console.log(`📧 SMTP Host: ${process.env.SMTP_HOST}`);
  console.log(`📧 SMTP Port: ${process.env.SMTP_PORT}`);
  console.log(`📧 SMTP User: ${process.env.SMTP_USER}`);
  console.log(`🔐 Password: ${'*'.repeat(process.env.SMTP_PASS.length)}\n`);

  try {
    // Create transporter
    console.log('Creating email transporter...');
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Verify connection
    console.log('Verifying SMTP connection...');
    await transporter.verify();
    console.log('✅ SMTP connection verified!\n');

    // Send test email
    console.log('Sending test email to theitxprts786@gmail.com...');
    const info = await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: 'theitxprts786@gmail.com',
      subject: '✅ Test Email from Next.js App - ' + new Date().toLocaleString(),
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; background-color: #f9fafb; border-radius: 10px;">
          <div style="background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h2 style="color: #10b981; margin-top: 0;">✅ Email Test Successful!</h2>
            <p style="color: #374151; font-size: 16px; line-height: 1.6;">
              Congratulations! Your email configuration is working correctly.
            </p>
            
            <div style="background-color: #f3f4f6; padding: 20px; border-radius: 6px; margin: 25px 0; border-left: 4px solid #10b981;">
              <h3 style="color: #1f2937; margin-top: 0; font-size: 16px;">📋 Test Details</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #6b7280; font-weight: bold;">Date:</td>
                  <td style="padding: 8px 0; color: #1f2937;">${new Date().toLocaleString()}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b7280; font-weight: bold;">From:</td>
                  <td style="padding: 8px 0; color: #1f2937;">${process.env.SMTP_USER}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b7280; font-weight: bold;">To:</td>
                  <td style="padding: 8px 0; color: #1f2937;">theitxprts786@gmail.com</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b7280; font-weight: bold;">SMTP Server:</td>
                  <td style="padding: 8px 0; color: #1f2937;">${process.env.SMTP_HOST}</td>
                </tr>
              </table>
            </div>

            <div style="background-color: #ecfdf5; padding: 15px; border-radius: 6px; border: 1px solid #10b981;">
              <p style="margin: 0; color: #065f46; font-size: 14px;">
                <strong>🎉 Success!</strong> If you're reading this email, your Nodemailer setup is configured correctly and ready to use in your Next.js application.
              </p>
            </div>

            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 25px 0;">

            <p style="color: #6b7280; font-size: 14px; margin-bottom: 0;">
              This is an automated test email sent from your Next.js application using Nodemailer.
            </p>
          </div>
        </div>
      `,
      text: `
✅ Email Test Successful!

Your email configuration is working correctly.

Test Details:
- Date: ${new Date().toLocaleString()}
- From: ${process.env.SMTP_USER}
- To: theitxprts786@gmail.com
- SMTP Server: ${process.env.SMTP_HOST}

If you received this email, your Nodemailer setup is configured correctly! 🎉
      `,
    });

    console.log('\n✅ Email sent successfully!\n');
    console.log('📬 Message Details:');
    console.log(`   Message ID: ${info.messageId}`);
    console.log(`   Recipient: theitxprts786@gmail.com`);
    console.log(`   From: ${process.env.SMTP_USER}\n`);
    console.log('✨ Check the inbox at theitxprts786@gmail.com to confirm delivery.\n');

  } catch (error) {
    console.error('\n❌ Error sending email:\n');
    console.error(error.message);
    
    if (error.code === 'EAUTH') {
      console.log('\n💡 Tip: Authentication failed. Please check:');
      console.log('   1. Your email and password are correct');
      console.log('   2. If using Gmail, you need an App Password (not your regular password)');
      console.log('   3. 2-Factor Authentication must be enabled to create App Passwords');
      console.log('   4. Create App Password: https://myaccount.google.com/apppasswords\n');
    } else if (error.code === 'ECONNECTION') {
      console.log('\n💡 Tip: Connection failed. Please check:');
      console.log('   1. Your internet connection');
      console.log('   2. Firewall settings');
      console.log('   3. SMTP server settings\n');
    }
    
    process.exit(1);
  }
}

// Run the test
testEmail();

