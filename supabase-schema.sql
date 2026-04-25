-- ESSENZE DI NATURA - SUPABASE SCHEMA
-- Created for event management system with booking, payments, and CRM

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- ============================================
-- CLIENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20) NOT NULL,
  slug VARCHAR(100) UNIQUE, -- @mario for Telegram commands
  tipo VARCHAR(50), -- tipo di cliente: buyer, supplier, partner
  company_name VARCHAR(255),
  event_type VARCHAR(100), -- matrimonio, aziendale, enogastronomico, altro
  budget_range VARCHAR(50), -- €, per categorizzare
  source VARCHAR(100), -- come hanno trovato (referral, google, social, etc)
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  is_vip BOOLEAN DEFAULT FALSE
);

-- ============================================
-- EVENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  event_name VARCHAR(255) NOT NULL,
  event_type VARCHAR(100), -- matrimonio, cerimonia, aziendale, enogastronomico
  event_date DATE NOT NULL,
  event_time TIME,
  guest_count INT,
  status VARCHAR(50) DEFAULT 'pending', -- pending, confirmed, completed, cancelled
  venue VARCHAR(100) DEFAULT 'Masseria Sant\'Elmo', -- sempre questa per adesso
  catering_partner VARCHAR(255), -- Caffetteria Leopardi, etc
  notes TEXT,
  total_price DECIMAL(10, 2),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- BOOKINGS TABLE (prenotazioni)
-- ============================================
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  booking_date TIMESTAMP DEFAULT NOW(),
  event_date DATE NOT NULL,
  event_time TIME,
  guest_count INT NOT NULL,
  booking_status VARCHAR(50) DEFAULT 'pending', -- pending, confirmed, paid, cancelled
  deposit_required DECIMAL(10, 2) DEFAULT 1000.00, -- acconto standard
  deposit_paid DECIMAL(10, 2) DEFAULT 0.00,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- PAYMENTS TABLE (pagamenti Stripe)
-- ============================================
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  stripe_payment_intent_id VARCHAR(255) UNIQUE,
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'EUR',
  status VARCHAR(50) DEFAULT 'pending', -- pending, succeeded, failed, cancelled
  payment_method VARCHAR(100), -- card, bank_transfer, etc
  receipt_url VARCHAR(500),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- PAYMENT LOGS TABLE (log pagamenti telegram)
-- ============================================
CREATE TABLE IF NOT EXISTS logs_pagamenti (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  description VARCHAR(255),
  stripe_payment_intent_id VARCHAR(255),
  status VARCHAR(50) DEFAULT 'pending', -- pending, succeeded, failed
  metadata JSONB, -- Stores additional data: telegram_chat_id, payment_url, sms_error, etc
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- INVOICES TABLE (fatture)
-- ============================================
CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  invoice_number VARCHAR(50) UNIQUE NOT NULL,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  issue_date DATE NOT NULL,
  due_date DATE,
  total_amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'issued', -- issued, paid, overdue, cancelled
  pdf_url VARCHAR(500),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- SERVICES OFFERED
-- ============================================
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  service_name VARCHAR(255) NOT NULL,
  service_category VARCHAR(100), -- matrimoni, corporate, enogastronomico, turismo
  base_price DECIMAL(10, 2),
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- AVAILABILITY CALENDAR
-- ============================================
CREATE TABLE IF NOT EXISTS availability (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_date DATE NOT NULL UNIQUE,
  is_available BOOLEAN DEFAULT TRUE,
  notes VARCHAR(500),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- COMMUNICATION LOG (email, SMS, WhatsApp)
-- ============================================
CREATE TABLE IF NOT EXISTS communication_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  communication_type VARCHAR(50), -- email, sms, whatsapp, call
  subject VARCHAR(255),
  message TEXT,
  status VARCHAR(50), -- sent, failed, opened, clicked
  metadata JSONB, -- Stores additional data: telegram_chat_id, twilio_message_id, etc
  sent_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- ANALYTICS - BOOKINGS SUMMARY
-- ============================================
CREATE TABLE IF NOT EXISTS booking_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  month DATE NOT NULL,
  total_bookings INT DEFAULT 0,
  total_revenue DECIMAL(12, 2) DEFAULT 0,
  average_guest_count INT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX idx_clients_email ON clients(email);
CREATE INDEX idx_clients_phone ON clients(phone);
CREATE INDEX idx_clients_slug ON clients(slug);
CREATE INDEX idx_events_client_id ON events(client_id);
CREATE INDEX idx_events_date ON events(event_date);
CREATE INDEX idx_bookings_client_id ON bookings(client_id);
CREATE INDEX idx_bookings_event_id ON bookings(event_id);
CREATE INDEX idx_bookings_status ON bookings(booking_status);
CREATE INDEX idx_payments_booking_id ON payments(booking_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_logs_pagamenti_client_id ON logs_pagamenti(client_id);
CREATE INDEX idx_logs_pagamenti_status ON logs_pagamenti(status);
CREATE INDEX idx_invoices_client_id ON invoices(client_id);
CREATE INDEX idx_communication_client_id ON communication_log(client_id);

-- ============================================
-- INSERT DEFAULT SERVICES
-- ============================================
INSERT INTO services (service_name, service_category, base_price, description) VALUES
('Matrimoni - Cerimonie', 'matrimoni', 5000.00, 'Pacchetto completo per matrimoni e cerimonie'),
('Feste Private', 'matrimoni', 2000.00, 'Celebrazioni private, lauree, battesimi'),
('Corporate Events', 'corporate', 3500.00, 'Cene aziendali, team-building, lanci prodotto'),
('Degustazioni Enogastronomiche', 'enogastronomico', 50.00, 'Per persona - with catering partner'),
('Turismo Esperienziale', 'turismo', 100.00, 'Pacchetto giornaliero con esperienze'),
('Privatizzazione Location', 'matrimoni', 1500.00, 'Fee per use of entire venue');

-- ============================================
-- ROW LEVEL SECURITY (RLS) - Optional security layer
-- ============================================
-- ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE events ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- Create admin policy for development (remove in production)
-- CREATE POLICY "All access for authenticated users" ON clients
--   USING (auth.role() = 'authenticated')
--   WITH CHECK (auth.role() = 'authenticated');
