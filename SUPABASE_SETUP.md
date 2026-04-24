## SUPABASE SETUP INSTRUCTIONS

### Step 1: Apply Schema
1. Go to https://app.supabase.com/project/aqpwfurradxbnqvycvkm/sql/
2. Click "New Query"
3. Copy entire content of `supabase-schema.sql`
4. Run (all tables will be created automatically)

### Step 2: Add Test Data
Execute in Supabase SQL Editor:
```sql
INSERT INTO clients (first_name, last_name, email, phone, event_type) VALUES
('Prova', 'Cliente', 'test@example.com', '+39 333 1234567', 'matrimonio');
```

### Step 3: Enable PostgREST API
Settings → API → Enable PostgREST on all tables

### Step 4: Configure Auth (if needed for admin)
Auth → Policies → Create public/authenticated policies

### Tables Created:
- clients (anagrafica clienti)
- events (eventi prenotati)
- bookings (prenotazioni)
- payments (pagamenti Stripe)
- invoices (fatture)
- services (servizi offerti)
- availability (calendario disponibilità)
- communication_log (log email/SMS/WhatsApp)
- booking_analytics (analitiche)

All with proper foreign keys, indexes, and timestamps.
