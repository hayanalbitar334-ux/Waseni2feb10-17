-- 1. Modify orders table to allow null user_id (Guest)
ALTER TABLE orders ALTER COLUMN user_id DROP NOT NULL;

-- 2. Add guest columns if they don't exist
ALTER TABLE orders ADD COLUMN IF NOT EXISTS guest_email TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS guest_name TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS guest_phone TEXT;

-- 3. Fix RLS on orders
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Remove potentially conflicting policies
DROP POLICY IF EXISTS "Users can insert their own orders" ON orders;
DROP POLICY IF EXISTS "Anyone can insert orders" ON orders;
DROP POLICY IF EXISTS "Public insert orders" ON orders;
DROP POLICY IF EXISTS "Users can view their own orders" ON orders;

-- Create a permissive insert policy for everyone (Guest + Auth)
CREATE POLICY "Public insert orders" ON orders
  FOR INSERT
  WITH CHECK (true);

-- Allow viewing orders (needed for the .select() after insert)
CREATE POLICY "Public view orders" ON orders
  FOR SELECT
  USING (true);

-- 4. Fix RLS on order_items
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can insert their own order items" ON order_items;
DROP POLICY IF EXISTS "Anyone can insert order items" ON order_items;
DROP POLICY IF EXISTS "Public insert order items" ON order_items;
DROP POLICY IF EXISTS "Users can view their own order items" ON order_items;

CREATE POLICY "Public insert order items" ON order_items
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Public view order items" ON order_items
  FOR SELECT
  USING (true);
