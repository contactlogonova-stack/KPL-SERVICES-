-- RLS Policies for Admin access to realisations and categories tables
-- Run this in your Supabase SQL Editor

-- Enable RLS
ALTER TABLE realisations ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Policies for categories
CREATE POLICY "Admin full access categories"
ON categories FOR ALL
USING (auth.role() = 'authenticated');

CREATE POLICY "Public read access categories"
ON categories FOR SELECT
USING (true);

-- Policies for realisations
CREATE POLICY "Admin full access realisations"
ON realisations FOR ALL
USING (auth.role() = 'authenticated');

CREATE POLICY "Public read access realisations"
ON realisations FOR SELECT
USING (true);
