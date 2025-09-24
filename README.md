# GreyBrain SEO Assistant

A comprehensive SEO campaign management and AI-powered content generation platform built with React, TypeScript, and Supabase.

## 🚀 Features

### Core Functionality
- **AI-Powered SEO Content Generation** - Generate optimized content using Google's Gemini AI
- **Campaign Management** - Create, manage, and track SEO campaigns
- **Calendar Integration** - Schedule and visualize campaign timelines
- **Real-time Results** - Live content generation and optimization suggestions
- **User Authentication** - Secure login with email-based whitelist system

### Admin Features
- **User Management** - Add/remove users from whitelist
- **License Management** - Create and manage user licenses
- **Email Integration** - Send welcome emails to new users
- **System Monitoring** - Debug tools and user activity tracking

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Authentication**: Supabase Auth
- **Database**: Supabase PostgreSQL
- **AI Integration**: Google Gemini API
- **Email Service**: Resend API
- **Deployment**: Netlify

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- Google Gemini API key
- Resend API key (for emails)

## 🔧 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd gemseo
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Variables**
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_GEMINI_API_KEY=your_gemini_api_key
   VITE_RESEND_API_KEY=your_resend_api_key
   ```

4. **Configure Whitelist**
   Edit `config/whitelistedEmails.ts` to add authorized users:
   ```typescript
   export const WHITELISTED_EMAILS = [
     'user1@example.com',
     'user2@example.com',
     // Add more emails here
   ] as const;
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Build for production**
   ```bash
   npm run build
   ```

## 🚀 Deployment

### Netlify Deployment (Recommended)

1. **Connect to Netlify**
   - Push your code to GitHub
   - Connect your GitHub repo to Netlify
   - Configure build settings:
     - Build command: `npm run build`
     - Publish directory: `dist`

2. **Set Environment Variables**
   In Netlify dashboard, add these environment variables:
   ```
   VITE_SUPABASE_URL
   VITE_SUPABASE_ANON_KEY
   VITE_GEMINI_API_KEY
   VITE_RESEND_API_KEY
   ```

3. **Deploy**
   - Netlify will automatically deploy on push to main branch
   - Your app will be available at `https://your-app-name.netlify.app`

### Manual Deployment

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy to your hosting service**
   Upload the `dist` folder to your web server or hosting provider.

## 🔐 Authentication System

### How It Works
- **Primary**: Hardcoded whitelist in `config/whitelistedEmails.ts`
- **Secondary**: Supabase database (currently blocked by RLS policies)
- **Fallback**: Admin can add users via dashboard (adds to hardcoded list)

### Current Whitelisted Users
```
drpratichi@skids.health
dr.satish@greybrain.ai
dev@santaan.in
raghab.panda@santaan.in
Lnmishra84@gmail.com
satish@skids.health
```

## 📊 Admin Dashboard

Access the admin dashboard at `/admin` to:
- Add new whitelisted users
- Manage user licenses
- Send welcome emails
- Monitor system status

## 🔍 Troubleshooting

### Common Issues

1. **Authentication Fails**
   - Check if user email is in `config/whitelistedEmails.ts`
   - Verify Supabase credentials in environment variables
   - Check browser console for detailed error messages

2. **AI Content Generation Fails**
   - Verify Gemini API key is correct
   - Check API quota limits
   - Review network requests in browser dev tools

3. **Email Sending Fails**
   - Verify Resend API key
   - Check email configuration in admin dashboard
   - Review server logs for email errors

### Debug Tools

Several test scripts are available:
- `test-complete-auth-flow.mjs` - Test authentication flow
- `test-whitelist-config.mjs` - Verify whitelist configuration
- `test-email.mjs` - Test email functionality

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| VITE_SUPABASE_URL | Supabase project URL | ✅ |
| VITE_SUPABASE_ANON_KEY | Supabase anonymous key | ✅ |
| VITE_GEMINI_API_KEY | Google Gemini API key | ✅ |
| VITE_RESEND_API_KEY | Resend email API key | ❌ |

## 🔄 Recent Updates

- **Authentication Fix**: Resolved RLS policy blocking issues
- **Enhanced Error Handling**: Better feedback for authentication failures
- **Admin Dashboard**: Improved user management interface
- **Email Integration**: Welcome email system for new users

## 📞 Support

For issues and questions:
1. Check the troubleshooting section above
2. Review the test scripts for debugging
3. Check browser console for detailed error messages
4. Verify all environment variables are correctly set

## 📄 License

This project is proprietary software. All rights reserved.

---

**Built with ❤️ for GreyBrain SEO**
