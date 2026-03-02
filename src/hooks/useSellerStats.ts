import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useSellerStats(storeId: string) {
  const [stats, setStats] = useState({
    totalSales: 0,
    activeOrders: 0,
    totalProducts: 0,
    recentOrders: [] as any[],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    async function fetchStats() {
      if (!storeId) return;
      try {
        setLoading(true);
        
        // 1. Fetch total sales (sum of order_items for products in this store)
        const { data: salesData, error: salesError } = await supabase
          .from('order_items')
          .select('unit_price, quantity, products!inner(store_id)')
          .eq('products.store_id', storeId);

        if (salesError) throw salesError;

        const totalSales = salesData.reduce((acc, item) => acc + (item.unit_price * item.quantity), 0);

        // 2. Fetch active orders count
        const { count: activeOrders, error: ordersError } = await supabase
          .from('orders')
          .select('id, order_items!inner(products!inner(store_id))', { count: 'exact', head: true })
          .eq('order_items.products.store_id', storeId)
          .in('status', ['pending', 'processing', 'shipped']);

        if (ordersError) throw ordersError;

        // 3. Fetch total products
        const { count: totalProducts, error: productsError } = await supabase
          .from('products')
          .select('id', { count: 'exact', head: true })
          .eq('store_id', storeId);

        if (productsError) throw productsError;

        // 4. Fetch recent orders
        const { data: recentOrders, error: recentError } = await supabase
          .from('order_items')
          .select('*, orders(*), products(title)')
          .eq('products.store_id', storeId)
          .order('created_at', { foreignTable: 'orders', ascending: false })
          .limit(5);

        if (recentError) throw recentError;

        setStats({
          totalSales,
          activeOrders: activeOrders || 0,
          totalProducts: totalProducts || 0,
          recentOrders: recentOrders || [],
        });
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, [storeId]);

  return { stats, loading, error };
}
