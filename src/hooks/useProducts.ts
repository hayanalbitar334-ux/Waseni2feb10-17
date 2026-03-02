import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useProducts(categoryId?: string) {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        let query = supabase
          .from('products')
          .select('*, store:stores(store_name)');

        if (categoryId) {
          query = query.eq('category_id', categoryId);
        }

        const { data, error } = await query;

        if (error) throw error;
        setProducts(data || []);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [categoryId]);

  return { products, loading, error };
}

export function useProduct(id: string) {
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    async function fetchProduct() {
      if (!id) return;
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('products')
          .select('*, store:stores(store_name)')
          .eq('id', id)
          .single();

        if (error) throw error;
        setProduct(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [id]);

  return { product, loading, error };
}
