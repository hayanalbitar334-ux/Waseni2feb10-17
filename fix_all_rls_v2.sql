-- Comprehensive RLS Fix for Admin Dashboard
-- Run this script to fix all permission issues (Red Errors)

-- 1. Categories (Fix "Failed to add category")
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read categories" ON categories;
DROP POLICY IF EXISTS "Public insert categories" ON categories;
DROP POLICY IF EXISTS "Public update categories" ON categories;
DROP POLICY IF EXISTS "Public delete categories" ON categories;

CREATE POLICY "Public read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public insert categories" ON categories FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update categories" ON categories FOR UPDATE USING (true);
CREATE POLICY "Public delete categories" ON categories FOR DELETE USING (true);

-- 2. Home Config (Fix "Failed to update settings")
CREATE TABLE IF NOT EXISTS home_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  banner_image_url TEXT,
  banner_position INTEGER DEFAULT 1,
  categories_position INTEGER DEFAULT 2,
  categories_layout TEXT DEFAULT 'slider',
  news_ticker_text TEXT DEFAULT 'توصيل مجاني للطلبات فوق ١٠٠ الف ليرة',
  news_ticker_enabled BOOLEAN DEFAULT true,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE home_config ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read home_config" ON home_config;
DROP POLICY IF EXISTS "Public insert home_config" ON home_config;
DROP POLICY IF EXISTS "Public update home_config" ON home_config;
DROP POLICY IF EXISTS "Admin update home_config" ON home_config;
DROP POLICY IF EXISTS "Admin insert home_config" ON home_config;

CREATE POLICY "Public read home_config" ON home_config FOR SELECT USING (true);
CREATE POLICY "Public insert home_config" ON home_config FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update home_config" ON home_config FOR UPDATE USING (true);

-- Ensure at least one row exists in home_config
INSERT INTO home_config (banner_image_url, banner_position, categories_position, categories_layout, news_ticker_text)
SELECT 
  'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
  2, 1, 'slider', 'توصيل مجاني للطلبات فوق ١٠٠ الف ليرة'
WHERE NOT EXISTS (SELECT 1 FROM home_config);

-- 3. Products (Fix Delete Product)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read products" ON products;
DROP POLICY IF EXISTS "Public insert products" ON products;
DROP POLICY IF EXISTS "Public update products" ON products;
DROP POLICY IF EXISTS "Public delete products" ON products;

CREATE POLICY "Public read products" ON products FOR SELECT USING (true);
CREATE POLICY "Public insert products" ON products FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update products" ON products FOR UPDATE USING (true);
CREATE POLICY "Public delete products" ON products FOR DELETE USING (true);

-- 4. Stores (Fix Delete Store)
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read stores" ON stores;
DROP POLICY IF EXISTS "Public insert stores" ON stores;
DROP POLICY IF EXISTS "Public update stores" ON stores;
DROP POLICY IF EXISTS "Public delete stores" ON stores;

CREATE POLICY "Public read stores" ON stores FOR SELECT USING (true);
CREATE POLICY "Public insert stores" ON stores FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update stores" ON stores FOR UPDATE USING (true);
CREATE POLICY "Public delete stores" ON stores FOR DELETE USING (true);

-- 5. Orders (Fix Update Status & Delete Order)
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read orders" ON orders;
DROP POLICY IF EXISTS "Public insert orders" ON orders;
DROP POLICY IF EXISTS "Public update orders" ON orders;
DROP POLICY IF EXISTS "Public delete orders" ON orders;

CREATE POLICY "Public read orders" ON orders FOR SELECT USING (true);
CREATE POLICY "Public insert orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update orders" ON orders FOR UPDATE USING (true);
CREATE POLICY "Public delete orders" ON orders FOR DELETE USING (true);

-- 6. Order Items (Fix Cascade Delete)
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read order_items" ON order_items;
DROP POLICY IF EXISTS "Public insert order_items" ON order_items;
DROP POLICY IF EXISTS "Public delete order_items" ON order_items;

CREATE POLICY "Public read order_items" ON order_items FOR SELECT USING (true);
CREATE POLICY "Public insert order_items" ON order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Public delete order_items" ON order_items FOR DELETE USING (true);
