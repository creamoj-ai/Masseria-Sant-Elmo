-- ============================================
-- ADD ADMIN USERS TABLE FOR ROLE MANAGEMENT
-- ============================================

CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  role VARCHAR(20) DEFAULT 'admin', -- 'admin' or 'superadmin'
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_admin_users_email ON admin_users(email);
CREATE INDEX idx_admin_users_role ON admin_users(role);

-- INSERT initial superadmin + admins
INSERT INTO admin_users (email, role) VALUES
  ('creamoj@gmail.com', 'superadmin'),
  ('itjob.azienda@gmail.com', 'admin'),
  ('info@masseriasantelmo.com', 'admin')
ON CONFLICT (email) DO NOTHING;

-- ============================================
-- ADD AUDIT LOG TRACKING TO COMMUNICATION LOG
-- ============================================

ALTER TABLE communication_log
ADD COLUMN IF NOT EXISTS admin_action VARCHAR(100),
ADD COLUMN IF NOT EXISTS admin_user_email VARCHAR(255),
ADD COLUMN IF NOT EXISTS admin_action_result VARCHAR(50);

-- ============================================
-- RLS POLICIES (Optional - activate if needed)
-- ============================================

-- ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Admin users can view all admins" ON admin_users
--   FOR SELECT USING (auth.role() = 'authenticated');
-- CREATE POLICY "Superadmin can manage admins" ON admin_users
--   FOR INSERT WITH CHECK (
--     EXISTS (
--       SELECT 1 FROM admin_users
--       WHERE email = auth.jwt()->>'email' AND role = 'superadmin'
--     )
--   );
