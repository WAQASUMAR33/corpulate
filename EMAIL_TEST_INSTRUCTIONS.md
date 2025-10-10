# 📧 Email Testing Instructions

## Overview
Your Next.js app now has email testing functionality using **Nodemailer**. You can test email delivery to `theitxprts786@gmail.com`.

## 🚀 Quick Start

### 1. Configure Environment Variables

Make sure your `.env` file in the root directory contains:

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### 2. Gmail App Password Setup (If using Gmail)

⚠️ **Important:** You cannot use your regular Gmail password. You need an App Password.

**Steps to create Gmail App Password:**

1. Go to your Google Account: https://myaccount.google.com/
2. Select **Security** from the left menu
3. Enable **2-Step Verification** if not already enabled
4. Search for "App Passwords" or go to: https://myaccount.google.com/apppasswords
5. Create a new App Password:
   - Select app: **Mail**
   - Select device: **Other (Custom name)**
   - Enter name: "Next.js App" or any name
6. Copy the 16-character password (no spaces)
7. Add it to your `.env` file as `EMAIL_PASS`

## 🧪 Testing Methods

### Method 1: Standalone Script (Fastest)

Run the standalone test script directly:

```bash
node test-email.js
```

This will:
- Verify your email configuration
- Send a test email to `theitxprts786@gmail.com`
- Show detailed success/error messages

### Method 2: Web Interface (Best for debugging)

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open your browser and go to:
   ```
   http://localhost:3000/test-email
   ```

3. Click "Send Test Email" to test the functionality

4. You can also change the recipient email if needed

### Method 3: API Endpoint (For integration testing)

Send a POST request to the API endpoint:

```bash
# Using curl (Git Bash or WSL on Windows)
curl -X POST http://localhost:3000/api/test-email -H "Content-Type: application/json" -d "{\"to\":\"theitxprts786@gmail.com\"}"
```

Or using PowerShell:
```powershell
$body = @{ to = "theitxprts786@gmail.com" } | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:3000/api/test-email" -Method POST -Body $body -ContentType "application/json"
```

## 📁 Files Created

- `app/api/test-email/route.js` - API endpoint for sending emails
- `app/test-email/page.js` - Web interface for testing
- `test-email.js` - Standalone test script
- `EMAIL_TEST_INSTRUCTIONS.md` - This file

## ✅ Expected Result

When successful, you should see:
- ✅ Console message: "Email sent successfully!"
- 📧 Email arrives at `theitxprts786@gmail.com` with:
  - Subject: "Test Email from Next.js App"
  - Professional HTML formatted message
  - Test details (date, sender, recipient)

## ❌ Common Issues

### Issue: Authentication Failed (EAUTH)

**Solution:**
- Make sure you're using an App Password, not your regular password
- Enable 2-Factor Authentication on your Google account
- Generate a new App Password

### Issue: Connection Refused (ECONNECTION)

**Solution:**
- Check your internet connection
- Verify firewall settings
- Make sure port 587 or 465 is not blocked

### Issue: Environment Variables Not Found

**Solution:**
- Verify `.env` file exists in the project root
- Check variable names: `EMAIL_USER` and `EMAIL_PASS` (case-sensitive)
- Restart your development server after modifying `.env`

## 📝 Using Other Email Providers

If not using Gmail, modify the transporter configuration in `app/api/test-email/route.js`:

```javascript
const transporter = nodemailer.createTransport({
  host: 'smtp.your-provider.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
```

Common SMTP settings:
- **Outlook/Hotmail:** smtp.office365.com (port 587)
- **Yahoo:** smtp.mail.yahoo.com (port 587)
- **Custom SMTP:** Check your provider's documentation

## 🔍 Troubleshooting

1. **Check console logs** for detailed error messages
2. **Verify SMTP connection** using the standalone script
3. **Test with curl/Postman** to isolate frontend issues
4. **Check spam folder** - test emails might be filtered

## 📧 Support

For more information about Nodemailer:
- Documentation: https://nodemailer.com/
- Gmail setup: https://nodemailer.com/usage/using-gmail/

