# 🚀 ESSENZE DI NATURA - DEPLOYMENT INSTRUCTIONS

**Status**: ✅ Code ready to deploy  
**Date**: April 24, 2025  
**Deliverables**: Homepage, Booking System, Stripe Integration, Admin API ready

---

## STEP 0: PREREQUISITES ✅
- GitHub account: `creamoj-ai`
- Vercel account (connect with GitHub)
- Supabase project: `aqpwfurradxbnqvycvkm`

---

## STEP 1: APPLY SUPABASE SCHEMA (5 min)

1. Go to: https://app.supabase.com/project/aqpwfurradxbnqvycvkm/sql/
2. Click **"New Query"**
3. Copy entire file content: `supabase-schema.sql`
4. Paste into SQL editor
5. Click **"RUN"** ✅

**Verify**: Go to Tables panel → Should see 9 tables created:
- clients
- events
- bookings
- payments
- invoices
- services
- availability
- communication_log
- booking_analytics

---

## STEP 2: PUSH TO GITHUB (5 min)

Run these commands from the project folder:

```bash
# Add GitHub remote
git remote add origin https://github.com/creamoj-ai/essenze-di-natura-website.git

# Set branch to master
git branch -M master

# Push code to GitHub
git push -u origin master
```

**If repo doesn't exist yet**: Create it on GitHub:
1. Go to: https://github.com/new
2. Repo name: `essenze-di-natura-website`
3. Private repo (recommended)
4. Click "Create repository"
5. Then run the commands above

---

## STEP 3: CONNECT VERCEL (10 min)

1. Go to: https://vercel.com/dashboard
2. Click **"Add New..."** → **"Project"**
3. Select **"Import Git Repository"**
4. Find `essenze-di-natura-website` in list
5. Click **"Import"**
6. Under "Environment Variables", add:

```
NEXT_PUBLIC_SUPABASE_URL = https://aqpwfurradxbnqvycvkm.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = sbp_32f31ce230e96be040ae4ece4f44a242822fda0c
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = pk_test_51234567890abcdefghij
STRIPE_SECRET_KEY = sk_test_51234567890abcdefghij
EMAIL_FROM = creamoj@gmail.com
WHATSAPP_PHONE = +39 3737902538
SITE_URL = https://essenzedinaturaeventi.vercel.app
```

7. Click **"Deploy"**

**Wait 3-5 minutes for build to complete** ✅

---

## STEP 4: VERIFY DEPLOYMENT ✅

Once build completes:
1. Copy the **Vercel URL** (shown on dashboard)
2. Visit the URL in browser
3. You should see:
   - ✅ Homepage with Essenze di Natura branding
   - ✅ Navigation menu (Location, Servizi, Prenotazioni, Contatti)
   - ✅ Hero section with CTA buttons
   - ✅ Services cards
   - ✅ Booking form
   - ✅ Footer with contact info

**If you see 404**: Wait 1-2 more minutes for build to fully complete

---

## STEP 5: SETUP CUSTOM DOMAIN (Optional, 5 min)

1. In Vercel Dashboard, select project
2. Go to **Settings** → **Domains**
3. Add custom domain: `essenzedinaturaeventi.it` (or your choice)
4. Follow DNS instructions provided by registrar
5. Wait 24-48 hours for propagation

---

## STEP 6: STRIPE WEBHOOK (10 min, for live payments)

1. Go to: https://dashboard.stripe.com/webhooks
2. Click **"Add endpoint"**
3. URL: `https://YOUR_VERCEL_URL/api/payments/webhook`
   - Replace `YOUR_VERCEL_URL` with your actual Vercel domain
4. Select events:
   - ✅ `payment_intent.succeeded`
   - ✅ `payment_intent.payment_failed`
5. Copy **Signing Secret** 
6. Add to Vercel Environment Variables:
   ```
   STRIPE_WEBHOOK_SECRET = whsec_xxxxxxxxxxxxx
   ```
7. Re-deploy Vercel (automatic after env var change)

---

## STEP 7: EMAIL CONFIGURATION (Optional, 5 min)

For booking confirmation emails:

### Option A: Gmail (easiest for testing)
1. Enable 2-Step Verification: https://accounts.google.com/security
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Add to Vercel Environment Variables:
   ```
   SMTP_HOST = smtp.gmail.com
   SMTP_PORT = 587
   SMTP_USER = creamoj@gmail.com
   SMTP_PASS = your_16_char_app_password
   EMAIL_FROM = creamoj@gmail.com
   ```

### Option B: Custom Domain Email (recommended)
Use your hosting provider's email settings:
```
SMTP_HOST = mail.yourdomain.com
SMTP_USER = info@essenzedinaturaeventi.it
SMTP_PASS = your_password
EMAIL_FROM = info@essenzedinaturaeventi.it
```

---

## STEP 8: TEST BOOKING FLOW (5 min)

1. Visit your deployed site
2. Fill booking form:
   - Name: "Test Booking"
   - Email: your-email@gmail.com
   - Phone: +39 333 1234567
   - Event Date: Future date
   - Guest Count: 50
   - Event Type: Matrimonio
3. Submit form
4. Check:
   - ✅ Form accepted (no errors)
   - ✅ Supabase: New entry in `bookings` table
   - ✅ Supabase: New entry in `clients` table
   - ✅ Email received (if email configured)

---

## STEP 9: STRIPE TEST PAYMENT (10 min, optional)

To test Stripe integration:

1. Get Stripe test publishable key from: https://dashboard.stripe.com/apikeys
2. Create booking via form (see Step 8)
3. During payment, use test card: `4242 4242 4242 4242`
4. Expiry: Any future date (e.g., 12/25)
5. CVC: Any 3 digits (e.g., 123)
6. Click "Pay"
7. Verify in Stripe Dashboard:
   - ✅ New Payment Intent created
   - ✅ Payment succeeded
8. Check Supabase `payments` table: New payment record

---

## 🎯 WHAT'S LIVE NOW

### ✅ Completed Features
- [x] Homepage with hero section
- [x] Location details page
- [x] Services listing
- [x] Booking form (POST /api/bookings)
- [x] Stripe payment intent API (POST /api/payments)
- [x] Webhook handler for payment updates
- [x] Admin API for clients data (/api/admin/clients)
- [x] Supabase schema with 9 tables
- [x] Tailwind CSS design system
- [x] Mobile responsive layout
- [x] Vercel auto-deployment

### 📋 TODO (Next Phase)
- [ ] Admin dashboard UI (view bookings, clients, revenue)
- [ ] Calendar picker for booking dates
- [ ] Email confirmation automation
- [ ] WhatsApp notification integration
- [ ] Invoice generation
- [ ] Analytics dashboard
- [ ] AI image generation (Vesuvio backdrop, location gallery)
- [ ] Blog/SEO
- [ ] Terms of Service
- [ ] Privacy Policy

---

## 🚨 TROUBLESHOOTING

### Build fails on Vercel
- ✅ Check: All environment variables are set
- ✅ Check: Supabase tables exist
- ✅ Check: Node version is 18+

### Booking form not submitting
- ✅ Check: API route `/api/bookings` exists
- ✅ Check: Supabase keys are correct
- ✅ Check: Browser console for errors (F12)

### Payments not working
- ✅ Check: Stripe keys are valid
- ✅ Check: Using test cards in test mode
- ✅ Check: Webhook is configured

### Domain not working
- ✅ Wait 24-48 hours for DNS propagation
- ✅ Check: DNS records are correct (provided by Vercel)
- ✅ Check: Custom domain is added in Vercel settings

---

## 📞 QUICK REFERENCE

**GitHub**: https://github.com/creamoj-ai/essenze-di-natura-website  
**Vercel**: https://vercel.com/dashboard  
**Supabase**: https://app.supabase.com/project/aqpwfurradxbnqvycvkm  
**Stripe**: https://dashboard.stripe.com  

**Contact Email**: creamoj@gmail.com  
**Contact WhatsApp**: +39 373 790 2538

---

## 🎉 YOU'RE DONE!

When Steps 1-3 are complete, you have:
- ✅ Live website at `https://essenzedinaturaeventi.vercel.app`
- ✅ Working booking system
- ✅ Database ready for payments
- ✅ Automatic deployments on code push

**TIMELINE**: 30 minutes total from start to live 🚀
