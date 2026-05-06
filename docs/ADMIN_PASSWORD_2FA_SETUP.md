# Admin Password Protection & 2FA Setup

## Overview

This document explains how to set up password protection for the admin dashboard and prepare for 2FA (Two-Factor Authentication).

**Status:**
- ✅ **Password Protection**: Implemented and ready to use
- 🔄 **2FA (SMS via Twilio)**: Predisposed, implementation pending

---

## Phase 1: Password Protection (DONE) 🔐

### Database Migration

Run this SQL migration to add password fields to `admin_users` table:

```sql
-- Add to admin_users table
ALTER TABLE admin_users ADD COLUMN password_hash TEXT;
ALTER TABLE admin_users ADD COLUMN twofa_enabled BOOLEAN DEFAULT FALSE;
ALTER TABLE admin_users ADD COLUMN twofa_phone TEXT;
ALTER TABLE admin_users ADD COLUMN twofa_verified BOOLEAN DEFAULT FALSE;

-- Create audit log for tracking password changes
CREATE TABLE admin_audit_log (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  admin_email TEXT NOT NULL,
  action TEXT NOT NULL,
  details JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (admin_email) REFERENCES admin_users(email)
);
```

**File location**: `migrations/add_admin_password_twofa.sql`

### How It Works

#### For Regular Users
1. User logs in with email (Supabase Auth)
2. User navigates to `/admin`
3. Email is whitelisted in `admin_users` table
4. If password is set → **Password modal appears**
5. User enters admin password
6. Access granted to dashboard

#### For Superadmin
Superadmin can manage other admins' passwords via the **"Gestione Admin Utenti"** section in the dashboard.

### Setting Admin Passwords

#### Option A: Via Admin Dashboard (Recommended)
1. Log in as **Superadmin** → Navigate to `/admin`
2. Scroll to **"Gestione Admin Utenti"** section
3. Find the admin user in the list
4. Click **"Set PSW"** button
5. Enter minimum 8-character password
6. Click **"Imposta"**

#### Option B: Manual Database Update (For Initial Setup)
If you need to set a password before the UI is fully functional:

```javascript
// Run in Node.js or browser console
const bcrypt = require('bcrypt');

async function generateHash() {
  const password = 'your_secure_password';
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  console.log('Password hash:', hash);
}

generateHash();
```

Then update Supabase:
```sql
UPDATE admin_users 
SET password_hash = '$2b$10$...' 
WHERE email = 'admin@example.com';
```

### API Endpoints

#### Verify Password
```
POST /api/admin/verify-password
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "secure_password"
}

Response: { "success": true, "email": "...", "role": "..." }
```

#### Set Admin Password (Superadmin Only)
```
POST /api/admin/set-password
Headers: x-user-email: superadmin@example.com
Content-Type: application/json

{
  "targetEmail": "admin@example.com",
  "newPassword": "new_secure_password"
}
```

---

## Phase 2: Two-Factor Authentication (2FA) - PREDISPOSED 🚀

### What's Ready

The database schema is prepared with these columns:
- `twofa_enabled`: Boolean flag (default: false)
- `twofa_phone`: Phone number for SMS OTP
- `twofa_verified`: Whether 2FA has been verified

The components for 2FA are **predisposed but not implemented**.

### Implementation Plan (When Ready)

#### Step 1: Enable 2FA for an Admin
```javascript
// In superadmin dashboard, enable 2FA
UPDATE admin_users 
SET twofa_enabled = TRUE, twofa_phone = '+39 XXX XXX XXXX'
WHERE email = 'admin@example.com';
```

#### Step 2: Implement 2FA Modal
After password verification succeeds, show 2FA modal:
- Send OTP via Twilio SMS to `twofa_phone`
- User enters 6-digit OTP
- Verify against sent code

#### Step 3: OTP Verification Flow
```
Email Login ✓ → Password Verification ✓ → 2FA OTP Modal → Dashboard Access
```

### 2FA Components (Framework)

**File**: `src/components/AdminTwoFactorModal.tsx` (To be created)

```typescript
interface AdminTwoFactorModalProps {
  userEmail: string;
  onTwoFAVerified: () => void;
}
```

**Required Endpoints**:
- `POST /api/admin/send-otp` - Send SMS via Twilio
- `POST /api/admin/verify-otp` - Verify OTP entered by user

### Twilio Integration

Twilio is already configured in the project. The `lib/twilio.ts` utility is available:

```typescript
import { sendSMS } from '@/lib/twilio';

// Send OTP
await sendSMS(
  '+39XXX',  // twofa_phone
  `Your admin access code: ${otp}`
);
```

### Security Considerations

✅ **Implemented**:
- Password hashing with bcrypt
- Session-based verification (sessionStorage)
- Admin audit log for password changes
- Role-based access (only superadmin can set passwords)

🔄 **For 2FA Implementation**:
- OTP should expire after 5-10 minutes
- Max 3 attempts before lockout
- OTP never stored in database (only TTL cache)
- Log failed 2FA attempts in audit log

---

## Rollout Checklist

- [ ] Run migration SQL to add password columns
- [ ] Test password setting via superadmin UI
- [ ] Set initial passwords for all admins
- [ ] Verify users are prompted for password on login
- [ ] Test password verification flow
- [ ] Document password policy (min 8 chars, etc.)
- [ ] Audit log verification (check `admin_audit_log` table)
- [ ] Plan 2FA implementation sprint
- [ ] Implement 2FA OTP endpoints
- [ ] Test full flow: Email → Password → 2FA → Dashboard

---

## Troubleshooting

### Problem: "Password modal never appears"
**Solution**: Check if `password_hash` is set in the database
```sql
SELECT email, password_hash FROM admin_users;
```

### Problem: "Password verification fails"
**Solution**: Check browser console and Supabase logs. Verify password hash format.

### Problem: "Superadmin cannot set passwords"
**Solution**: Verify superadmin role is set correctly:
```sql
SELECT email, role FROM admin_users WHERE email = 'superadmin@example.com';
```

---

## Next Steps

1. **Now**: Run migration SQL to enable password protection
2. **Today**: Set passwords for all admin users
3. **This Week**: Test full flow in staging environment
4. **Next Sprint**: Implement 2FA SMS verification

Questions? Check the audit log at `admin_audit_log` table for admin action history.
