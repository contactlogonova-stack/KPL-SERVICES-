-- RLS Policy for Admin access to reservations table
-- Run this in your Supabase SQL Editor

-- Enable RLS if not already enabled
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users (Admins)
CREATE POLICY "Admin full access reservations"
ON reservations FOR ALL
USING (auth.role() = 'authenticated');
