import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Package, Clock, CheckCircle, XCircle, ChevronLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { motion } from 'motion/react';

export default function OrdersPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            product:products (title, image_url)
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching orders:', error);
      } else {
        setOrders(data || []);
      }
      setLoading(false);
    };

    fetchOrders();
  }, [user]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'text-emerald-600 bg-emerald-50';
      case 'shipped': return 'text-blue-600 bg-blue-50';
      case 'cancelled': return 'text-red-600 bg-red-50';
      default: return 'text-orange-600 bg-orange-50';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'delivered': return 'تم التوصيل';
      case 'shipped': return 'تم الشحن';
      case 'cancelled': return 'ملغي';
      default: return 'قيد المعالجة';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-24">
      <header className="bg-white px-4 py-6 flex items-center justify-between sticky top-0 z-40 shadow-sm">
        <button onClick={() => navigate('/profile')} className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center">
          <ArrowRight size={20} />
        </button>
        <h1 className="text-xl font-black text-gray-900">طلباتي</h1>
        <div className="w-10" />
      </header>

      <div className="p-4 space-y-4">
        {!user ? (
          <div className="text-center py-12">
            <Package size={48} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-lg font-bold text-gray-900 mb-2">سجل الدخول لعرض طلباتك</h2>
            <button 
              onClick={() => navigate('/login')}
              className="text-emerald-600 font-bold"
            >
              تسجيل الدخول
            </button>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12">
            <Package size={48} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-lg font-bold text-gray-900 mb-2">لا توجد طلبات حتى الآن</h2>
            <button 
              onClick={() => navigate('/')}
              className="text-emerald-600 font-bold"
            >
              تصفح المنتجات
            </button>
          </div>
        ) : (
          orders.map((order, i) => (
            <motion.div 
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs text-gray-400 mb-1">رقم الطلب #{order.id.slice(0, 8)}</p>
                  <p className="text-sm font-bold text-gray-900">
                    {new Date(order.created_at).toLocaleDateString('ar-SA')}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-xl text-xs font-bold ${getStatusColor(order.status)}`}>
                  {getStatusLabel(order.status)}
                </span>
              </div>

              <div className="space-y-3 mb-4">
                {order.order_items.map((item: any) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                      <img src={item.product?.image_url} alt={item.product?.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-gray-900 line-clamp-1">{item.product?.title}</p>
                      <p className="text-xs text-gray-500">الكمية: {item.quantity}</p>
                    </div>
                    <span className="text-sm font-bold text-emerald-600">{item.unit_price} ل.س</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                <span className="text-sm text-gray-500">الإجمالي</span>
                <span className="text-lg font-black text-gray-900">{order.total_amount} ل.س</span>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
