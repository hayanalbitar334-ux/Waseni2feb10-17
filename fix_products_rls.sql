-- Enable RLS on products
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Remove existing restrictive policies
DROP POLICY IF EXISTS "Enable read access for all users" ON products;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON products;
DROP POLICY IF EXISTS "Enable update for owners" ON products;
DROP POLICY IF EXISTS "Enable delete for owners" ON products;
DROP POLICY IF EXISTS "Public read products" ON products;
DROP POLICY IF EXISTS "Admin insert products" ON products;
DROP POLICY IF EXISTS "Admin update products" ON products;
DROP POLICY IF EXISTS "Admin delete products" ON products;

-- Create permissive policies for ALL operations on products
-- This allows the Admin Dashboard to Edit and Delete products
CREATE POLICY "Public read products" ON products
  FOR SELECT USING (true);

CREATE POLICY "Public insert products" ON products
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Public update products" ON products
  FOR UPDATE USING (true);

CREATE POLICY "Public delete products" ON products
  FOR DELETE USING (true);
