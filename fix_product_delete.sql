-- Fix product deletion by handling order_items constraint
ALTER TABLE order_items
DROP CONSTRAINT IF EXISTS order_items_product_id_fkey;

ALTER TABLE order_items
ADD CONSTRAINT order_items_product_id_fkey
FOREIGN KEY (product_id)
REFERENCES products(id)
ON DELETE SET NULL;
