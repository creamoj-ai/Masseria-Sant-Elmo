-- Migration: Add password protection + 2FA predisposition to admin_users
-- Date: 2026-05-06

-- Add password_hash column (optional, allows passwordless admins during transition)
ALTER TABLE admin_users
ADD COLUMN IF NOT EXISTS password_hash TEXT;

-- Add 2FA columns (predisposed, but not active yet)
ALTER TABLE admin_users
ADD COLUMN IF NOT EXISTS twofa_enabled BOOLEAN DEFAULT FALSE;

ALTER TABLE admin_users
ADD COLUMN IF NOT EXISTS twofa_phone TEXT;

ALTER TABLE admin_users
ADD COLUMN IF NOT EXISTS twofa_verified BOOLEAN DEFAULT FALSE;

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);

-- Optional: Create audit log for admin password changes (2FA preparation)
-- This table tracks when passwords are set/changed
CREATE TABLE IF NOT EXISTS admin_audit_log (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  admin_email TEXT NOT NULL,
  action TEXT NOT NULL,
  details JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (admin_email) REFERENCES admin_users(email)
);

CREATE INDEX IF NOT EXISTS idx_admin_audit_log_email ON admin_audit_log(admin_email);
