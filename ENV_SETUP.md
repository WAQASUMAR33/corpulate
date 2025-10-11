# Environment Variables Setup

## 📋 Required Environment Variables

### For Local Development

Create a `.env` file in the root directory with the following variables:

```env
# Database Configuration
DATABASE_URL="mysql://u918383293_corpulate:Carpulate123@193.203.184.245:3306/u918383293_corpulate"

# JWT Secret for Authentication
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# Application Base URL
NEXT_PUBLIC_BASE_URL="http://localhost:3001"

# SMTP Email Configuration (Optional)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
```

### For Production (Vercel)

Add these environment variables in your Vercel project settings:

1. Go to your project on Vercel
2. Navigate to **Settings** → **Environment Variables**
3. Add the following:

| Variable | Value | Description |
|----------|-------|-------------|
| `DATABASE_URL` | Your production MySQL connection string | Database connection |
| `JWT_SECRET` | A secure random string | JWT token encryption |
| `NEXT_PUBLIC_BASE_URL` | `https://your-app.vercel.app` | Your production URL |
| `SMTP_HOST` | Your SMTP server | Email server host |
| `SMTP_PORT` | `587` or `465` | Email server port |
| `SMTP_SECURE` | `true` or `false` | Use SSL/TLS |
| `SMTP_USER` | Your email address | SMTP username |
| `SMTP_PASS` | Your email password/app password | SMTP password |

---

## 🔧 Environment Variable Details

### `NEXT_PUBLIC_BASE_URL`
- **Purpose**: Used in email templates to generate correct links
- **Local**: `http://localhost:3001`
- **Production**: Your Vercel URL (e.g., `https://corpulate.vercel.app`)
- **Important**: Must include protocol (`http://` or `https://`)

### `DATABASE_URL`
- **Format**: `mysql://username:password@host:port/database`
- **Used for**: Database connections via Prisma

### `JWT_SECRET`
- **Purpose**: Encrypts JWT tokens for authentication
- **Recommendation**: Use a long random string (32+ characters)
- **Security**: Never commit this to Git

### SMTP Variables
- **Purpose**: Send welcome emails and notifications
- **Optional**: App works without email, but won't send notifications
- **Gmail**: Requires "App Password" (not regular password)

---

## 📧 Email Service Providers

### Using Gmail
```env
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-16-character-app-password"
```

**How to get Gmail App Password:**
1. Go to Google Account → Security
2. Enable 2-Step Verification
3. Go to App Passwords
4. Generate password for "Mail"

### Using SendGrid
```env
SMTP_HOST="smtp.sendgrid.net"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="apikey"
SMTP_PASS="your-sendgrid-api-key"
```

### Using Mailgun
```env
SMTP_HOST="smtp.mailgun.org"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="your-mailgun-smtp-username"
SMTP_PASS="your-mailgun-smtp-password"
```

---

## 🚀 Quick Setup

### Local Development

1. Copy the example file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` with your actual values

3. Update `NEXT_PUBLIC_BASE_URL` to match your local server:
   ```env
   NEXT_PUBLIC_BASE_URL="http://localhost:3001"
   ```

### Production Deployment

1. Deploy to Vercel
2. Get your production URL (e.g., `https://corpulate.vercel.app`)
3. Add all environment variables in Vercel dashboard
4. Set `NEXT_PUBLIC_BASE_URL` to your production URL
5. Redeploy

---

## ⚠️ Important Notes

- `.env` file is in `.gitignore` and will NOT be committed
- `NEXT_PUBLIC_*` variables are exposed to the browser
- Never put secrets in `NEXT_PUBLIC_*` variables
- Environment variables require rebuild/redeploy to take effect
- Vercel automatically rebuilds on environment variable changes

---

## ✅ Verify Setup

Test your configuration:

```bash
# Check if variables are loaded
npm run dev

# Test email functionality
# Visit: http://localhost:3001/test-email
```

For production, check Vercel deployment logs to ensure variables are set correctly.

