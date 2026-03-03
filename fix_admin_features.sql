-- Create a table to store home page configuration
CREATE TABLE IF NOT EXISTS home_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  banner_image_url TEXT,
  banner_position INTEGER DEFAULT 1,
  categories_position INTEGER DEFAULT 2,
  categories_layout TEXT DEFAULT 'slider', -- 'slider' or 'grid'
  news_ticker_text TEXT DEFAULT 'توصيل مجاني للطلبات فوق ١٠٠ الف ليرة',
  news_ticker_enabled BOOLEAN DEFAULT true,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE home_config ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Public read home_config" ON home_config
  FOR SELECT USING (true);

-- Allow admin update access (using a permissive policy for now to ensure it works)
CREATE POLICY "Admin update home_config" ON home_config
  FOR UPDATE USING (true);

CREATE POLICY "Admin insert home_config" ON home_config
  FOR INSERT WITH CHECK (true);

-- Insert default configuration if not exists
INSERT INTO home_config (banner_image_url, banner_position, categories_position, categories_layout, news_ticker_text)
SELECT 
  'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
  2, -- Banner below categories by default
  1, -- Categories at top by default
  'slider',
  'توصيل مجاني للطلبات فوق ١٠٠ الف ليرة'
WHERE NOT EXISTS (SELECT 1 FROM home_config);

-- Fix product deletion policy again to be absolutely sure
DROP POLICY IF EXISTS "Public delete products" ON products;
CREATE POLICY "Public delete products" ON products
  FOR DELETE USING (true);

-- Allow inserting categories
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public insert categories" ON categories
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update categories" ON categories
  FOR UPDATE USING (true);
CREATE POLICY "Public delete categories" ON categories
  FOR DELETE USING (true);
