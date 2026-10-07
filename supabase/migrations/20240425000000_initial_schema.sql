-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABLES

-- USERS
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  username TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  affiliate_code TEXT UNIQUE NOT NULL DEFAULT substr(md5(random()::text), 1, 8),
  referred_by UUID REFERENCES users(id),
  free_coupon_last_used TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- WALLETS
CREATE TABLE IF NOT EXISTS wallets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  balance_fcfa INTEGER NOT NULL DEFAULT 0,
  total_earned INTEGER NOT NULL DEFAULT 0,
  total_withdrawn INTEGER NOT NULL DEFAULT 0
);

-- COUPONS
CREATE TABLE IF NOT EXISTS coupons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL CHECK (type IN ('standard','big_t1','big_t2','free')),
  price_fcfa INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','published','no_coupon')),
  overall_odds DECIMAL(8,2),
  confidence_score INTEGER CHECK (confidence_score BETWEEN 0 AND 100),
  publish_date DATE NOT NULL,
  published_at TIMESTAMPTZ,
  content JSONB,
  result TEXT CHECK (result IN ('won','lost','pending')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_coupons_publish_date ON coupons(publish_date);
CREATE INDEX IF NOT EXISTS idx_coupons_status ON coupons(status);

-- COUPON PURCHASES
CREATE TABLE IF NOT EXISTS coupon_purchases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id),
  coupon_id UUID NOT NULL REFERENCES coupons(id),
  amount_paid INTEGER NOT NULL,
  payment_id TEXT,
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending','paid','failed')),
  is_free BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, coupon_id)
);
CREATE INDEX IF NOT EXISTS idx_purchases_user_id ON coupon_purchases(user_id);

-- ANALYZED MATCHES
CREATE TABLE IF NOT EXISTS analyzed_matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  coupon_id UUID REFERENCES coupons(id),
  sport TEXT NOT NULL CHECK (sport IN ('football','tennis')),
  home_team TEXT NOT NULL,
  away_team TEXT NOT NULL,
  league TEXT,
  venue TEXT,
  weather TEXT,
  kickoff_utc TIMESTAMPTZ,
  raw_data JSONB,
  poisson_data JSONB,
  llm_analysis JSONB,
  recommended_option TEXT,
  odds_1xbet DECIMAL(8,2),
  probability_pct INTEGER CHECK (probability_pct BETWEEN 0 AND 100),
  match_result TEXT CHECK (match_result IN ('won','lost','pending')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- AFFILIATE TRANSACTIONS
CREATE TABLE IF NOT EXISTS affiliate_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  beneficiary_id UUID NOT NULL REFERENCES users(id),
  source_user_id UUID NOT NULL REFERENCES users(id),
  purchase_id UUID NOT NULL REFERENCES coupon_purchases(id),
  amount_fcfa INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','available','withdrawn')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- AFFILIATE WITHDRAWALS
CREATE TABLE IF NOT EXISTS affiliate_withdrawals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id),
  amount_fcfa INTEGER NOT NULL,
  phone TEXT NOT NULL,
  operator TEXT NOT NULL CHECK (operator IN ('orange','mtn','moov','wave')),
  fedapay_transfer_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','processing','done','failed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- AGENT LOGS
CREATE TABLE IF NOT EXISTS agent_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_name TEXT NOT NULL CHECK (agent_name IN ('scraper','math','llm','coupon')),
  run_date DATE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('success','error','partial')),
  matches_scraped INTEGER DEFAULT 0,
  matches_validated INTEGER DEFAULT 0,
  error_message TEXT,
  duration_ms INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- PUSH SUBSCRIPTIONS
CREATE TABLE IF NOT EXISTS push_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL,
  keys JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- STAFF MEMBERS
CREATE TABLE IF NOT EXISTS staff_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  invited_by UUID REFERENCES staff_members(id),
  role TEXT NOT NULL DEFAULT 'staff' CHECK (role IN ('super_admin','staff')),
  permissions JSONB NOT NULL DEFAULT '{
    "view_dashboard": false,
    "manage_coupons": false,
    "manage_users": false,
    "manage_withdrawals": false,
    "view_agent_logs": false,
    "use_admin_chat": false,
    "manage_staff": false
  }',
  status TEXT NOT NULL DEFAULT 'invited' CHECK (status IN ('invited','active','suspended')),
  invitation_token TEXT,
  invitation_expires_at TIMESTAMPTZ,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- STAFF ACTION LOGS
CREATE TABLE IF NOT EXISTS staff_action_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  staff_id UUID NOT NULL REFERENCES staff_members(id),
  action TEXT NOT NULL,
  target_type TEXT,
  target_id TEXT,
  details JSONB,
  ip_address INET,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. RLS POLICIES

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupon_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE analyzed_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_withdrawals ENABLE ROW LEVEL SECURITY;
ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_action_logs ENABLE ROW LEVEL SECURITY;

-- Policies
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'users_select_own') THEN
        CREATE POLICY "users_select_own" ON users FOR SELECT USING (auth.uid() = id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'users_update_own') THEN
        CREATE POLICY "users_update_own" ON users FOR UPDATE USING (auth.uid() = id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'wallets_select_own') THEN
        CREATE POLICY "wallets_select_own" ON wallets FOR SELECT USING (user_id = auth.uid());
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'coupons_select_published') THEN
        CREATE POLICY "coupons_select_published" ON coupons FOR SELECT USING (status = 'published');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'purchases_select_own') THEN
        CREATE POLICY "purchases_select_own" ON coupon_purchases FOR SELECT USING (user_id = auth.uid());
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'purchases_insert_own') THEN
        CREATE POLICY "purchases_insert_own" ON coupon_purchases FOR INSERT WITH CHECK (user_id = auth.uid());
    END IF;
END $$;
