-- Fix RLS for cart_items to allow public insert (for guests)
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can insert their own cart items" ON cart_items;
DROP POLICY IF EXISTS "Anyone can insert cart items" ON cart_items;
DROP POLICY IF EXISTS "Public insert cart items" ON cart_items;

-- Create a permissive insert policy for everyone (Guest + Auth)
CREATE POLICY "Public insert cart items" ON cart_items
  FOR INSERT
  WITH CHECK (true);

-- Allow viewing cart items (needed for fetching)
DROP POLICY IF EXISTS "Users can view their own cart items" ON cart_items;
DROP POLICY IF EXISTS "Public view cart items" ON cart_items;

CREATE POLICY "Public view cart items" ON cart_items
  FOR SELECT
  USING (true);

-- Allow updating cart items
DROP POLICY IF EXISTS "Users can update their own cart items" ON cart_items;
DROP POLICY IF EXISTS "Public update cart items" ON cart_items;

CREATE POLICY "Public update cart items" ON cart_items
  FOR UPDATE
  USING (true);

-- Allow deleting cart items
DROP POLICY IF EXISTS "Users can delete their own cart items" ON cart_items;
DROP POLICY IF EXISTS "Public delete cart items" ON cart_items;

CREATE POLICY "Public delete cart items" ON cart_items
  FOR DELETE
  USING (true);
