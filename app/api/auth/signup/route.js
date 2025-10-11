import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import prisma from '../../../../lib/prisma.js';

export async function POST(request) {
  try {
    const { email, password, firstName, lastName, phoneNumber } = await request.json();

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    if (!firstName || !lastName) {
      return NextResponse.json(
        { success: false, error: 'First name and last name are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate password strength (minimum 6 characters)
    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        password: hashedPassword,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phoneNumber: phoneNumber ? phoneNumber.trim() : null,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phoneNumber: true,
        createdAt: true,
      },
    });

    // Generate JWT token for auto-login after signup
    const jwt = require('jsonwebtoken');
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET || 'your-secret-key-change-this',
      { expiresIn: '7d' }
    );

    // Send welcome email
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      const mailOptions = {
        from: process.env.SMTP_USER,
        to: user.email,
        subject: 'Welcome to Corpulate! 🎉',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: 'Poppins', Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #3b82f6 0%, #a855f7 100%); padding: 40px 20px; text-align: center; border-radius: 10px 10px 0 0; }
              .header h1 { color: white; margin: 0; font-size: 28px; }
              .content { background: #ffffff; padding: 40px 30px; border: 1px solid #e5e7eb; }
              .button { display: inline-block; padding: 14px 30px; background: linear-gradient(135deg, #3b82f6 0%, #a855f7 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
              .info-box { background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0; }
              .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🎉 Welcome to Corpulate!</h1>
              </div>
              <div class="content">
                <h2>Hi ${user.firstName} ${user.lastName},</h2>
                <p>Thank you for signing up! Your account has been successfully created.</p>
                
                <div class="info-box">
                  <h3 style="margin-top: 0;">📋 Your Account Details:</h3>
                  <p><strong>Name:</strong> ${user.firstName} ${user.lastName}</p>
                  <p><strong>Email:</strong> ${user.email}</p>
                  ${user.phoneNumber ? `<p><strong>Phone:</strong> ${user.phoneNumber}</p>` : ''}
                  <p><strong>Account Created:</strong> ${new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>

                <p>You can now log in to your account and start managing your business operations.</p>
                
                <center>
                  <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001'}/login" class="button">
                    Log In to Your Account →
                  </a>
                </center>

                <div style="margin-top: 30px; padding-top: 30px; border-top: 1px solid #e5e7eb;">
                  <h3>🚀 What's Next?</h3>
                  <ul>
                    <li>Complete your profile</li>
                    <li>Explore our features</li>
                    <li>Connect with your team</li>
                    <li>Start managing your business</li>
                  </ul>
                </div>

                <p style="margin-top: 30px;">If you have any questions, feel free to reach out to our support team.</p>
                
                <p>Best regards,<br><strong>The Corpulate Team</strong></p>
              </div>
              <div class="footer">
                <p>© ${new Date().getFullYear()} Corpulate. All rights reserved.</p>
                <p>This email was sent to ${user.email}</p>
              </div>
            </div>
          </body>
          </html>
        `,
        text: `Welcome to Corpulate!\n\nHi ${user.firstName} ${user.lastName},\n\nThank you for signing up! Your account has been successfully created.\n\nAccount Details:\n- Name: ${user.firstName} ${user.lastName}\n- Email: ${user.email}\n${user.phoneNumber ? `- Phone: ${user.phoneNumber}\n` : ''}- Account Created: ${new Date(user.createdAt).toLocaleDateString()}\n\nYou can now access your dashboard and start managing your business operations.\n\nBest regards,\nThe Corpulate Team`,
      };

      await transporter.sendMail(mailOptions);
      console.log('Welcome email sent to:', user.email);
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
      // Don't fail the signup if email fails
    }

    return NextResponse.json(
      {
        success: true,
        message: 'User registered successfully',
        token,
        user,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'An error occurred during registration',
        details: error.message,
      },
      { status: 500 }
    );
  }
}

