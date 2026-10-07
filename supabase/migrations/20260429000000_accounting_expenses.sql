-- Ajout de la table des charges d'exploitation (Factures manuelles) pour le calcul du bénéfice réel

CREATE TABLE IF NOT EXISTS operating_expenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  staff_id UUID REFERENCES staff_members(id),
  title TEXT NOT NULL,
  amount_fcfa INTEGER NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('api_ia', 'database', 'marketing', 'server', 'other')),
  expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE operating_expenses ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'staff_select_expenses') THEN
        CREATE POLICY "staff_select_expenses" ON operating_expenses FOR SELECT USING (true); -- Adapté selon les rôles si nécessaire
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policy WHERE polname = 'staff_insert_expenses') THEN
        CREATE POLICY "staff_insert_expenses" ON operating_expenses FOR INSERT WITH CHECK (true);
    END IF;
END $$;
