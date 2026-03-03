-- Allow mock admin to manage cart items
-- First, we need to allow profiles to exist without a corresponding auth.user for the mock admin
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;

-- Ensure profile exists for mock admin
INSERT INTO profiles (id, role, full_name, email)
VALUES ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'admin', 'Admin User', 'saryatest123@gmail.com')
ON CONFLICT (id) DO UPDATE SET role = 'admin';

DROP POLICY IF EXISTS "Users can manage their own cart" ON cart_items;
CREATE POLICY "Users can manage their own cart" ON cart_items
  FOR ALL USING (
    auth.uid() = user_id 
    OR 
    user_id = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'
  );

-- Allow mock admin to manage orders
DROP POLICY IF EXISTS "Users can view their own orders" ON orders;
CREATE POLICY "Users can view their own orders" ON orders
  FOR SELECT USING (
    auth.uid() = user_id 
    OR 
    user_id = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'
  );

CREATE POLICY "Users can insert their own orders" ON orders
  FOR INSERT WITH CHECK (
    auth.uid() = user_id 
    OR 
    user_id = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'
  );

-- Allow mock admin to manage order items
DROP POLICY IF EXISTS "Users can view their own order items" ON order_items;
CREATE POLICY "Users can view their own order items" ON order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND (orders.user_id = auth.uid() OR orders.user_id = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11')
    )
  );

CREATE POLICY "Users can insert their own order items" ON order_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND (orders.user_id = auth.uid() OR orders.user_id = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11')
    )
  );

-- Allow mock admin to manage all stores (since they are admin)
DROP POLICY IF EXISTS "Sellers can manage their own store" ON stores;
CREATE POLICY "Sellers and Admins can manage stores" ON stores
  FOR ALL USING (
    auth.uid() = owner_id 
    OR 
    owner_id = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'
    OR
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

-- Allow mock admin to manage all products
DROP POLICY IF EXISTS "Sellers can manage their own products" ON products;
CREATE POLICY "Sellers and Admins can manage products" ON products
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM stores
      WHERE stores.id = products.store_id
      AND (stores.owner_id = auth.uid() OR stores.owner_id = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11')
    )
    OR
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );
