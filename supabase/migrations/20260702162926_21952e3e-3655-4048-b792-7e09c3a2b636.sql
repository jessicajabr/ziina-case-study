CREATE TABLE public.landlords (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.landlords TO anon, authenticated;
GRANT ALL ON public.landlords TO service_role;
ALTER TABLE public.landlords ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read landlords" ON public.landlords FOR SELECT USING (true);

CREATE TABLE public.tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  bank_authorized BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.tenants TO anon, authenticated;
GRANT ALL ON public.tenants TO service_role;
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read tenants" ON public.tenants FOR SELECT USING (true);

CREATE TABLE public.properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  landlord_id UUID NOT NULL REFERENCES public.landlords(id) ON DELETE CASCADE,
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  area TEXT,
  annual_rent_aed NUMERIC(12,2) NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('on_track','due_soon','at_risk','recovered','paid','settlement_pending')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.properties TO anon, authenticated;
GRANT ALL ON public.properties TO service_role;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read properties" ON public.properties FOR SELECT USING (true);

CREATE TABLE public.rent_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  number_of_payments INT NOT NULL,
  payment_amount_aed NUMERIC(12,2) NOT NULL,
  first_due_date DATE NOT NULL,
  ask_bank_connect BOOLEAN NOT NULL DEFAULT true,
  allow_ziina_fallback BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.rent_schedules TO anon, authenticated;
GRANT ALL ON public.rent_schedules TO service_role;
ALTER TABLE public.rent_schedules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read rent_schedules" ON public.rent_schedules FOR SELECT USING (true);

CREATE TABLE public.rent_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  schedule_id UUID NOT NULL REFERENCES public.rent_schedules(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  due_date DATE NOT NULL,
  amount_aed NUMERIC(12,2) NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('on_track','due_soon','at_risk','recovered','paid','settlement_pending')),
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.rent_payments TO anon, authenticated;
GRANT ALL ON public.rent_payments TO service_role;
ALTER TABLE public.rent_payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read rent_payments" ON public.rent_payments FOR SELECT USING (true);

CREATE TABLE public.reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id UUID NOT NULL REFERENCES public.rent_payments(id) ON DELETE CASCADE,
  channel TEXT NOT NULL,
  sent_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  note TEXT
);
GRANT SELECT ON public.reminders TO anon, authenticated;
GRANT ALL ON public.reminders TO service_role;
ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read reminders" ON public.reminders FOR SELECT USING (true);

CREATE TABLE public.recovery_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id UUID NOT NULL REFERENCES public.rent_payments(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  outcome TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.recovery_actions TO anon, authenticated;
GRANT ALL ON public.recovery_actions TO service_role;
ALTER TABLE public.recovery_actions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read recovery_actions" ON public.recovery_actions FOR SELECT USING (true);

-- Seed data
WITH ll AS (
  INSERT INTO public.landlords (id, name, email) VALUES
    ('11111111-1111-1111-1111-111111111111', 'Sara Al Mansoori', 'sara@example.ae')
  RETURNING id
),
tn AS (
  INSERT INTO public.tenants (id, name, phone, email, bank_authorized) VALUES
    ('22222222-2222-2222-2222-222222222201', 'Omar Haddad', '+971 50 111 2201', 'omar@example.ae', false),
    ('22222222-2222-2222-2222-222222222202', 'Layla Rahman', '+971 50 111 2202', 'layla@example.ae', true),
    ('22222222-2222-2222-2222-222222222203', 'Yusuf Khan', '+971 50 111 2203', 'yusuf@example.ae', true),
    ('22222222-2222-2222-2222-222222222204', 'Maya Sultan', '+971 50 111 2204', 'maya@example.ae', true),
    ('22222222-2222-2222-2222-222222222205', 'Hassan Ali', '+971 50 111 2205', 'hassan@example.ae', true),
    ('22222222-2222-2222-2222-222222222206', 'Noura Faisal', '+971 50 111 2206', 'noura@example.ae', true),
    ('22222222-2222-2222-2222-222222222207', 'Karim Nasser', '+971 50 111 2207', 'karim@example.ae', true),
    ('22222222-2222-2222-2222-222222222208', 'Reem Sami', '+971 50 111 2208', 'reem@example.ae', true),
    ('22222222-2222-2222-2222-222222222209', 'Tariq Malik', '+971 50 111 2209', 'tariq@example.ae', true),
    ('22222222-2222-2222-2222-222222222210', 'Aisha Habib', '+971 50 111 2210', 'aisha@example.ae', true),
    ('22222222-2222-2222-2222-222222222211', 'Farah Zayed', '+971 50 111 2211', 'farah@example.ae', true),
    ('22222222-2222-2222-2222-222222222212', 'Jamal Otaibi', '+971 50 111 2212', 'jamal@example.ae', true)
  RETURNING id
)
SELECT 1;

INSERT INTO public.properties (id, landlord_id, tenant_id, name, area, annual_rent_aed, status) VALUES
  ('33333333-3333-3333-3333-333333333301', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222201', 'Marina Studio 1208', 'Dubai Marina', 120000, 'at_risk'),
  ('33333333-3333-3333-3333-333333333302', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222202', 'JBR Loft 402',      'JBR',           155000, 'due_soon'),
  ('33333333-3333-3333-3333-333333333303', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222203', 'Downtown 2BR 1804', 'Downtown',      210000, 'on_track'),
  ('33333333-3333-3333-3333-333333333304', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222204', 'Business Bay 907',  'Business Bay',  138000, 'on_track'),
  ('33333333-3333-3333-3333-333333333305', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222205', 'Jumeirah Villa 12', 'Jumeirah',      320000, 'on_track'),
  ('33333333-3333-3333-3333-333333333306', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222206', 'JLT Tower B 1602',  'JLT',           118000, 'paid'),
  ('33333333-3333-3333-3333-333333333307', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222207', 'Silicon Oasis 305', 'Silicon Oasis',  92000, 'on_track'),
  ('33333333-3333-3333-3333-333333333308', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222208', 'Mirdif Villa 7',    'Mirdif',        180000, 'due_soon'),
  ('33333333-3333-3333-3333-333333333309', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222209', 'DIFC Loft 2201',    'DIFC',          240000, 'on_track'),
  ('33333333-3333-3333-3333-333333333310', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222210', 'Al Barsha 1BR 501', 'Al Barsha',      88000, 'on_track'),
  ('33333333-3333-3333-3333-333333333311', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222211', 'Palm Studio 908',   'Palm Jumeirah', 165000, 'on_track'),
  ('33333333-3333-3333-3333-333333333312', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222212', 'City Walk 1103',    'City Walk',     195000, 'on_track');

INSERT INTO public.rent_schedules (id, property_id, number_of_payments, payment_amount_aed, first_due_date, ask_bank_connect, allow_ziina_fallback) VALUES
  ('44444444-4444-4444-4444-444444444401', '33333333-3333-3333-3333-333333333301', 4, 30000, '2026-07-05', true, true),
  ('44444444-4444-4444-4444-444444444402', '33333333-3333-3333-3333-333333333302', 4, 38750, '2026-07-08', true, true);

INSERT INTO public.rent_payments (schedule_id, property_id, due_date, amount_aed, status, paid_at) VALUES
  ('44444444-4444-4444-4444-444444444401', '33333333-3333-3333-3333-333333333301', '2026-07-05', 30000, 'at_risk', NULL),
  ('44444444-4444-4444-4444-444444444401', '33333333-3333-3333-3333-333333333301', '2026-10-05', 30000, 'on_track', NULL),
  ('44444444-4444-4444-4444-444444444402', '33333333-3333-3333-3333-333333333302', '2026-07-08', 38750, 'due_soon', NULL);