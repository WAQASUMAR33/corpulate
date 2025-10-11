# Production Deployment Guide

## 🚀 Vercel Deployment

### Current Status
- **Repository**: https://github.com/WAQASUMAR33/corpulate.git
- **Local Development**: http://localhost:3000
- **Production URL**: To be deployed on Vercel

### Deployment Steps

#### 1. Deploy to Vercel
```bash
# Install Vercel CLI (if not already installed)
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod

# Or deploy and get preview URL
vercel
```

#### 2. Environment Variables Setup
Create `.env.production` file with:
```env
# Database Configuration
DATABASE_URL=mysql://u918383293_corpulate:Carpulate123@193.203.184.245:3306/u918383293_corpulate

# JWT Secret for Authentication
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-2024

# Application Base URL (Update after deployment)
NEXT_PUBLIC_BASE_URL=https://your-app.vercel.app

# SMTP Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

#### 3. Vercel Dashboard Configuration
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Import your GitHub repository
3. Set environment variables in project settings
4. Deploy automatically on push to main branch

### Production URLs

#### After Deployment:
- **Main App**: `https://corpulate.vercel.app` (or your custom domain)
- **API Base**: `https://corpulate.vercel.app/api`

#### API Endpoints:
- **Packages**: `https://corpulate.vercel.app/api/packages`
- **Auth**: `https://corpulate.vercel.app/api/auth`
- **Stats**: `https://corpulate.vercel.app/api/packages/stats`

### Testing Production API

#### 1. Test Package API
```bash
# Get all packages
curl https://corpulate.vercel.app/api/packages

# Create a package
curl -X POST https://corpulate.vercel.app/api/packages \
  -H "Content-Type: application/json" \
  -d '{
    "package_title": "Test Package",
    "package_description": "Production test package",
    "package_price": 199.99
  }'

# Get package statistics
curl https://corpulate.vercel.app/api/packages/stats
```

#### 2. Test Authentication
```bash
# Signup
curl -X POST https://corpulate.vercel.app/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "test@example.com",
    "phoneNumber": "+1234567890",
    "password": "test123456"
  }'

# Login
curl -X POST https://corpulate.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123456"
  }'
```

### Database Migration

#### 1. Push Schema to Production
```bash
# Update production database schema
npx prisma db push --preview-feature
```

#### 2. Generate Prisma Client
```bash
# Generate client for production
npx prisma generate
```

### Domain Configuration (Optional)

#### 1. Custom Domain Setup
1. Go to Vercel Dashboard → Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Update `NEXT_PUBLIC_BASE_URL` environment variable

#### 2. SSL Certificate
- Automatically handled by Vercel
- HTTPS enabled by default

### Monitoring & Analytics

#### 1. Vercel Analytics
- Built-in analytics available in Vercel Dashboard
- Monitor performance, errors, and usage

#### 2. Error Tracking
- Check Vercel function logs
- Monitor API response times
- Track user authentication issues

### Backup & Recovery

#### 1. Database Backup
```bash
# Backup production database
mysqldump -h 193.203.184.245 -u u918383293_corpulate -p u918383293_corpulate > backup.sql
```

#### 2. Code Backup
- GitHub repository serves as code backup
- Vercel keeps deployment history
- Environment variables backed up in Vercel Dashboard

### Performance Optimization

#### 1. Production Optimizations
- Enable Vercel Edge Functions
- Use CDN for static assets
- Optimize database queries
- Implement caching strategies

#### 2. Monitoring
- Set up uptime monitoring
- Monitor API response times
- Track error rates
- Monitor database performance

## 🔧 Troubleshooting

### Common Issues

#### 1. Environment Variables
- Ensure all required env vars are set in Vercel Dashboard
- Check variable names match exactly
- Restart deployment after env var changes

#### 2. Database Connection
- Verify database credentials
- Check network connectivity
- Ensure database allows Vercel IPs

#### 3. Build Errors
- Check build logs in Vercel Dashboard
- Verify all dependencies are installed
- Check for TypeScript/ESLint errors

### Support
- Vercel Documentation: https://vercel.com/docs
- Next.js Documentation: https://nextjs.org/docs
- Prisma Documentation: https://www.prisma.io/docs
