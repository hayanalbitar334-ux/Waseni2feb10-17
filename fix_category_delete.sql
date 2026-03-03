-- Allow deleting categories even if they have products (Set category_id to NULL)
ALTER TABLE products
DROP CONSTRAINT IF EXISTS products_category_id_fkey;

ALTER TABLE products
ADD CONSTRAINT products_category_id_fkey
FOREIGN KEY (category_id)
REFERENCES categories(id)
ON DELETE SET NULL;
