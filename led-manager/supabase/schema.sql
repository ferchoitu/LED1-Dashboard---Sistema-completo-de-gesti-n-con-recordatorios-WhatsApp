-- LED1 Manager Database Schema

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table (optional, for user management)
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create clients table
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  business_name TEXT,
  phone_e164 TEXT NOT NULL, -- WhatsApp format +549...
  whatsapp_opt_in BOOLEAN DEFAULT true,
  status TEXT CHECK (status IN ('active', 'paused', 'ended')) DEFAULT 'active',
  start_date DATE NOT NULL,
  end_date DATE,
  ticket_amount NUMERIC(12,2) NOT NULL,
  currency TEXT DEFAULT 'ARS',
  billing_frequency TEXT CHECK (billing_frequency IN ('monthly', 'custom')) DEFAULT 'monthly',
  billing_day SMALLINT CHECK (billing_day BETWEEN 1 AND 28), -- día de cobro mensual
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create payments table
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE NOT NULL,
  period_year INTEGER NOT NULL,
  period_month INTEGER CHECK (period_month BETWEEN 1 AND 12) NOT NULL,
  amount NUMERIC(12,2) NOT NULL,
  paid_at TIMESTAMPTZ NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(client_id, period_year, period_month)
);

-- Create notifications_log table (for WhatsApp audit trail)
CREATE TABLE notifications_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE NOT NULL,
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT NOT NULL, -- 'sent', 'failed', 'pending'
  provider_message_id TEXT,
  message_body TEXT,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_clients_status ON clients(status);
CREATE INDEX idx_clients_billing_day ON clients(billing_day);
CREATE INDEX idx_clients_start_date ON clients(start_date);
CREATE INDEX idx_payments_client_id ON payments(client_id);
CREATE INDEX idx_payments_period ON payments(period_year, period_month);
CREATE INDEX idx_notifications_client_id ON notifications_log(client_id);
CREATE INDEX idx_notifications_sent_at ON notifications_log(sent_at);

-- Create materialized view for expected monthly revenue
CREATE OR REPLACE VIEW v_expected_monthly AS
SELECT
  EXTRACT(YEAR FROM CURRENT_DATE) as charged_year,
  EXTRACT(MONTH FROM CURRENT_DATE) as charged_month,
  c.id as client_id,
  c.name,
  c.business_name,
  c.ticket_amount as amount,
  c.billing_day,
  c.phone_e164
FROM clients c
WHERE c.status = 'active'
  AND (c.end_date IS NULL OR c.end_date >= CURRENT_DATE);

-- Create view for KPIs
CREATE OR REPLACE VIEW v_kpis AS
WITH active_clients AS (
  SELECT COUNT(*) as active_clients_count
  FROM clients
  WHERE status = 'active'
    AND (end_date IS NULL OR end_date >= CURRENT_DATE)
),
mrr_expected AS (
  SELECT COALESCE(SUM(ticket_amount), 0) as mrr_amount
  FROM clients
  WHERE status = 'active'
    AND (end_date IS NULL OR end_date >= CURRENT_DATE)
),
to_collect_today AS (
  SELECT COUNT(*) as to_collect_today_count,
         COALESCE(SUM(c.ticket_amount), 0) as to_collect_today_amount
  FROM clients c
  LEFT JOIN payments p ON c.id = p.client_id
    AND p.period_year = EXTRACT(YEAR FROM CURRENT_DATE)
    AND p.period_month = EXTRACT(MONTH FROM CURRENT_DATE)
  WHERE c.status = 'active'
    AND c.billing_day = EXTRACT(DAY FROM CURRENT_DATE)
    AND p.id IS NULL
    AND (c.end_date IS NULL OR c.end_date >= CURRENT_DATE)
),
overdue_clients AS (
  SELECT COUNT(*) as overdue_count,
         COALESCE(SUM(c.ticket_amount), 0) as overdue_amount
  FROM clients c
  LEFT JOIN payments p ON c.id = p.client_id
    AND p.period_year = EXTRACT(YEAR FROM CURRENT_DATE)
    AND p.period_month = EXTRACT(MONTH FROM CURRENT_DATE)
  WHERE c.status = 'active'
    AND c.billing_day < EXTRACT(DAY FROM CURRENT_DATE)
    AND p.id IS NULL
    AND (c.end_date IS NULL OR c.end_date >= CURRENT_DATE)
)
SELECT
  ac.active_clients_count,
  mrr.mrr_amount,
  tc.to_collect_today_count,
  tc.to_collect_today_amount,
  oc.overdue_count,
  oc.overdue_amount
FROM active_clients ac, mrr_expected mrr, to_collect_today tc, overdue_clients oc;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clients_updated_at
  BEFORE UPDATE ON clients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications_log ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (single-tenant for now - allow authenticated users to access all data)
-- For multi-tenant, you would add owner_id columns and filter by auth.uid()

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Clients policies (allow all for authenticated users - single tenant)
CREATE POLICY "Authenticated users can view all clients" ON clients
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert clients" ON clients
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update clients" ON clients
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete clients" ON clients
  FOR DELETE USING (auth.role() = 'authenticated');

-- Payments policies
CREATE POLICY "Authenticated users can view all payments" ON payments
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert payments" ON payments
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update payments" ON payments
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete payments" ON payments
  FOR DELETE USING (auth.role() = 'authenticated');

-- Notifications log policies
CREATE POLICY "Authenticated users can view all notifications" ON notifications_log
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert notifications" ON notifications_log
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;