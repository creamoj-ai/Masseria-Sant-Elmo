# Essenze di Natura - Event Management Website

![Status](https://img.shields.io/badge/Status-Active-green)
![Next.js](https://img.shields.io/badge/Next.js-16.2-blue)
![React](https://img.shields.io/badge/React-19.2-blue)
![License](https://img.shields.io/badge/License-Private-red)

**A modern SaaS booking and management platform for exclusive events at Masseria Sant'Elmo in the Vesuvius National Park, near Naples.**

## 🌳 About Essenze di Natura

Essenze di Natura is an exclusive event venue featuring:
- **14x20m geodesic dome** with panoramic views
- **Lavender field** with on-site distillery for essences
- **Custom catering partnerships** (Caffetteria Leopardi)
- **Capacity**: 400+ guests
- **Seasonal operation**: March - October

### Event Types Offered
- 💍 Weddings & Ceremonies (€5,000+)
- 🏢 Corporate Events (€3,500+)
- 🍷 Enogastronomy Experiences (€50/pp)
- 🎯 Experiential Tourism Packages

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account (PostgreSQL + Auth)
- Stripe account (payments)
- GitHub account (for version control)

### Installation

```bash
# Clone the repository
git clone https://github.com/creamoj-ai/essenze-di-natura-website.git
cd essenze-di-natura-website

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Update .env.local with your actual keys:
# - NEXT_PUBLIC_SUPABASE_URL
# - NEXT_PUBLIC_SUPABASE_ANON_KEY
# - STRIPE_SECRET_KEY
# - STRIPE_PUBLISHABLE_KEY (optional, only if using Stripe)
# - EMAIL credentials (for confirmations)
# - WHATSAPP_API_KEY (for notifications)
```

### Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🗄️ Database Setup (Supabase)

1. **Go to Supabase SQL Editor** → https://app.supabase.com/project/aqpwfurradxbnqvycvkm/sql/
2. **Create a new query**
3. **Copy & run** the entire `supabase-schema.sql` file
4. **Verify all tables created:**
   - `clients` - Customer information
   - `events` - Event instances
   - `bookings` - Booking records
   - `payments` - Stripe transactions
   - `invoices` - Billing documents
   - `services` - Service offerings
   - `availability` - Calendar availability
   - `communication_log` - Email/SMS/WhatsApp logs
   - `booking_analytics` - Revenue tracking

### Test Data
```sql
INSERT INTO clients (first_name, last_name, email, phone, event_type) 
VALUES ('Test', 'User', 'test@example.com', '+39 333 1234567', 'matrimonio');
```

---

## 📦 Project Structure

```
essenze-di-natura-website/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Homepage (hero, services, booking form)
│   │   ├── layout.tsx            # Root layout + metadata
│   │   ├── globals.css           # Tailwind + custom vars
│   │   └── api/
│   │       ├── bookings/         # POST /api/bookings (create booking)
│   │       ├── payments/         # POST /api/payments (Stripe intent)
│   │       │   └── webhook.ts    # Stripe webhook handler
│   │       ├── clients/          # Client CRUD
│   │       └── admin/            # Admin analytics
│   ├── components/               # Reusable React components (TODO)
│   ├── lib/                      # Utilities (supabase client, helpers)
│   └── types/                    # TypeScript interfaces
├── public/                       # Static assets
├── supabase-schema.sql          # Database schema
├── vercel.json                  # Vercel deployment config
├── next.config.ts              # Next.js configuration
├── tailwind.config.ts          # Tailwind configuration
├── tsconfig.json               # TypeScript configuration
├── package.json
└── .env.example                # Environment template
```

---

## 🎨 Design System

**Color Palette:**
- **Verde Salvia** (#4A6741) - Primary brand color
- **Panna** (#F5F1E8) - Light background
- **Oro Vintage** (#C9A876) - Accent/CTA color
- **Charcoal** (#2C2C2C) - Text color
- **Off-White** (#FAFAF8) - Main background

**Typography:**
- **Headings**: Geist Sans (from Google Fonts)
- **Body**: Geist Sans (from Google Fonts)

---

## 🔗 API Endpoints

### Bookings
- **POST** `/api/bookings` - Create new booking
  ```json
  {
    "first_name": "string",
    "last_name": "string",
    "email": "string",
    "phone": "string",
    "event_type": "matrimonio|corporate|enogastronomico",
    "event_date": "YYYY-MM-DD",
    "guest_count": number,
    "notes": "string"
  }
  ```
- **GET** `/api/bookings` - List all bookings (admin)

### Payments
- **POST** `/api/payments` - Create Stripe PaymentIntent
  ```json
  {
    "booking_id": "uuid",
    "amount": 1000.00,
    "email": "customer@example.com",
    "event_type": "matrimonio"
  }
  ```
- **POST** `/api/payments/webhook` - Stripe webhook handler

### Admin
- **GET** `/api/admin/clients` - Dashboard stats + client list

---

## 💳 Stripe Integration

### Test Mode (Development)
- **Publishable Key**: `pk_test_...` (from Stripe Dashboard)
- **Secret Key**: `sk_test_...` (from Stripe Dashboard)
- **Test Cards**: 
  - Success: `4242 4242 4242 4242`
  - Fail: `4000 0000 0000 0002`

### Live Mode (Production)
Update `.env.local` with live keys when ready (starts with `pk_live_` and `sk_live_`)

### Webhook Setup
1. Go to Stripe Dashboard → Webhooks
2. Add endpoint: `https://essenzedinaturaevents.it/api/payments/webhook`
3. Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`
4. Copy **Signing Secret** to `STRIPE_WEBHOOK_SECRET` in `.env.local`

---

## 📧 Email Configuration

### Gmail (SMTP)
1. Enable "2-Step Verification" in Google Account
2. Generate "App Password" (16-char code)
3. Set in `.env.local`:
   ```
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   EMAIL_FROM=your-email@gmail.com
   ```

### Custom Domain Email (Recommended)
Use your own domain email via provider:
```
SMTP_HOST=mail.yourdomain.com
SMTP_USER=info@essenzedinaturaevents.it
SMTP_PASS=your-password
```

---

## 📱 WhatsApp Integration

### WhatsApp Business API
1. Set up WhatsApp Business Account
2. Get API key from Meta/Twilio
3. Set in `.env.local`:
   ```
   WHATSAPP_API_KEY=your_api_key
   WHATSAPP_PHONE=+39 373 790 2538
   ```

---

## 🤖 Telegram Bot ("Telecomando")

### Quick Start: Send SMS Commands from Telegram

This project includes a Telegram bot that acts as a mobile-first command center to send SMS messages without accessing the web dashboard.

#### Setup Instructions

1. **Get Your Telegram Bot Token**
   ```bash
   # Open Telegram and chat with @BotFather
   # Send: /newbot
   # Follow the instructions
   # Copy your bot token (looks like: 1234567890:ABCdefGHIjklMNOpqrsTUVwxyz)
   ```

2. **Get Your Telegram Chat ID**
   ```bash
   # Open Telegram and chat with your bot
   # Send any message
   # Visit: https://api.telegram.org/bot{TOKEN}/getUpdates
   # Look for "chat": { "id": YOUR_CHAT_ID }
   # Or use @userinfobot to get your ID
   ```

3. **Get Twilio Credentials**
   ```bash
   # Sign up: https://www.twilio.com
   # Go to Account Settings → API Keys & Tokens
   # Copy: Account SID, Auth Token
   # Buy a phone number or use existing virtual number
   ```

4. **Configure Environment Variables** (`.env.local`)
   ```env
   # Telegram Bot
   TELEGRAM_BOT_TOKEN=your_bot_token_here
   TELEGRAM_AUTHORIZED_CHAT_ID=your_chat_id_here
   TELEGRAM_WEBHOOK_SECRET=optional_secret_for_extra_security

   # Twilio SMS Gateway
   TWILIO_ACCOUNT_SID=your_account_sid
   TWILIO_AUTH_TOKEN=your_auth_token
   TWILIO_PHONE_NUMBER=+1234567890
   ```

5. **Set Up Telegram Webhook**
   - Deploy the app first (or use ngrok locally)
   - Run this command with your actual domain:
   ```bash
   curl -X POST https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/setWebhook \
     -H "Content-Type: application/json" \
     -d '{"url":"https://your-domain.com/api/telegram/webhook"}'
   ```

6. **Test the Bot**
   - Open Telegram and chat with your bot
   - Try: `/help` (see available commands)
   - Try: `/sms +393737902538 Test message here`
   - Check that recipient receives SMS

#### Available Commands

- **/sms [number] [message]** - Send SMS to any phone number
  - Format: `/sms +393737902538 Ciao! Come stai?`
  - Supports Italian numbers with auto-normalization
  - Max 160 characters per message (SMS limit)
  - Returns confirmation with message ID

- **/help** - Show available commands and usage

#### Security Features

- ✅ **Chat ID Verification**: Only your authorized Telegram account can use the bot
- ✅ **Phone Number Validation**: Validates format before sending SMS
- ✅ **Country Whitelist**: Restricts SMS to Italian numbers (+39) by default to prevent unexpected charges
- ✅ **Communication Logging**: All SMS are logged in `communication_log` table (legal audit trail)
- ✅ **Error Handling**: Clear error messages on Telegram for validation failures

#### SMS Cost Management

- Twilio rates vary by country (~€0.05-0.15 per SMS in EU)
- Monitor usage in Twilio Dashboard
- Set up billing alerts in Twilio to avoid surprises
- Currently restricted to +39 (Italy) - contact to enable other countries

#### API Endpoint

- **POST** `/api/telegram/webhook` - Telegram webhook receiver
- **GET** `/api/telegram/webhook` - Health check

#### Architecture

The Telegram bot system consists of:
1. **Telegram Helper** (`src/lib/telegram.ts`) - Message sending, command parsing, authorization
2. **Twilio Helper** (`src/lib/twilio.ts`) - SMS sending, phone number normalization
3. **Webhook Handler** (`src/app/api/telegram/webhook/route.ts`) - Receives Telegram updates, routes commands

---

## 🚀 Deployment

### Vercel (Recommended)

#### Automatic Deployment (CI/CD)
1. Push to GitHub: `git push origin master`
2. Vercel auto-deploys on push
3. Live at: `https://essenzedinaturaevents.vercel.app`

#### Manual Deployment
```bash
npm install -g vercel
vercel env pull  # Pull environment variables
vercel --prod    # Deploy to production
```

### Environment Variables on Vercel
1. Go to Vercel Dashboard → Project Settings → Environment Variables
2. Add all from `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `STRIPE_SECRET_KEY`
   - etc.

---

## 📊 Admin Dashboard (TODO)

Coming soon:
- Real-time booking calendar
- Client management
- Payment history
- Revenue analytics
- Email/WhatsApp campaign tools
- Invoicing system

---

## 🔒 Security

- ✅ Environment variables never committed
- ✅ CORS configured for trusted domains
- ✅ SQL injection prevented via Supabase prepared statements
- ✅ Stripe PCI compliance (never handle raw card data)
- ✅ HTTPS enforced in production

### Recommended: Row-Level Security (RLS)
Uncomment RLS policies in `supabase-schema.sql` for production.

---

## 📝 Development Workflow

```bash
# Create a new feature branch
git checkout -b feature/new-feature

# Make your changes, test locally
npm run dev

# Commit with conventional commit message
git commit -m "feat: add new feature"

# Push and create PR
git push origin feature/new-feature
```

---

## 🐛 Troubleshooting

### Port 3000 Already in Use
```bash
npx kill-port 3000
npm run dev
```

### Supabase Connection Error
- Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Check that tables are created in SQL Editor
- Ensure Supabase project is active

### Stripe Payment Failed
- Verify `STRIPE_SECRET_KEY` is correct
- Check Stripe webhook is correctly signed
- Use test cards in test mode

---

## 📞 Support

- **Contact**: +39 373 790 2538 (WhatsApp)
- **Email**: creamoj@gmail.com
- **GitHub Issues**: [Issues Page](https://github.com/creamoj-ai/essenze-di-natura-website/issues)

---

## 📄 License

**PRIVATE** - All rights reserved to Essenze di Natura S.R.L.S. (Ramona Savino)

---

## 🙏 Credits

Built by Claude (Anthropic) with Next.js 16, Supabase, and Stripe.

Last updated: **April 24, 2025**
