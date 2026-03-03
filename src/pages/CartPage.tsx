import { ArrowRight, Trash2, Plus, Minus, Ticket, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { motion } from 'motion/react';

import { useCartStore } from '../store/cartStore';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';
import { toast } from 'sonner';

export default function CartPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, loading, fetchItems, updateQuantity, removeItem, clearCart, getTotals, applyPromoCode } = useCartStore();

  useEffect(() => {
    if (user) {
      fetchItems(user.id);
    }
  }, [user, fetchItems]);

  const totals = getTotals();

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (loading && items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="bg-gray-50 min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <div className="w-24 h-24 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-6">
          <ShoppingCart size={48} />
        </div>
        <h2 className="text-2xl font-black text-gray-900 mb-2">السلة فارغة</h2>
        <p className="text-gray-500 mb-8">لم تقم بإضافة أي منتجات إلى سلتك بعد</p>
        <button 
          onClick={() => navigate('/')}
          className="w-full bg-emerald-600 text-white font-black py-4 rounded-2xl shadow-lg"
        >
          اكتشف المنتجات
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-40">
      {/* Header */}
      <header className="bg-white px-4 py-6 flex items-center justify-between sticky top-0 z-40">
        <button onClick={() => navigate(-1)} className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center">
          <ArrowRight size={20} />
        </button>
        <h1 className="text-xl font-black text-gray-900">سلة التسوق</h1>
        <button 
          onClick={() => user && clearCart(user.id)}
          className="w-10 h-10 bg-red-50 text-red-500 rounded-full flex items-center justify-center"
        >
          <Trash2 size={20} />
        </button>
      </header>

      <div className="p-4 space-y-4">
        {items.map((item) => (
          <motion.div 
            key={item.id}
            layout
            className="bg-white rounded-3xl p-4 flex items-center gap-4 shadow-sm border border-gray-100"
          >
            <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0">
              <img src={item.product?.image_url} alt={item.product?.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-1">
                <h3 className="text-sm font-black text-gray-900 truncate">{item.product?.title}</h3>
                <button 
                  onClick={() => user && removeItem(user.id, item.id)}
                  className="text-gray-300 hover:text-red-500 transition-colors"
                >
                  <Plus size={16} className="rotate-45" />
                </button>
              </div>
              <p className="text-[10px] text-emerald-600 font-bold mb-3">متوفر في المخزون</p>
              <div className="flex items-center justify-between">
                <span className="text-emerald-600 font-black">{item.product?.price}.00 ل.س</span>
                <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-1">
                  <button 
                    onClick={() => user && updateQuantity(user.id, item.id, Math.max(1, item.quantity - 1))}
                    className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-gray-400 shadow-sm"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="text-sm font-black text-gray-900">{item.quantity}</span>
                  <button 
                    onClick={() => user && updateQuantity(user.id, item.id, item.quantity + 1)}
                    className="w-8 h-8 bg-emerald-600 text-white rounded-lg flex items-center justify-center shadow-sm"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        {/* Promo Code */}
        <div className="relative mt-6">
          <input 
            type="text" 
            placeholder="أدخل كود الخصم" 
            onChange={(e) => applyPromoCode(e.target.value)}
            className="w-full bg-white border border-gray-100 rounded-2xl py-4 pr-4 pl-12 text-sm focus:ring-2 focus:ring-emerald-500/20"
          />
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300">
            <Ticket size={20} />
          </div>
        </div>

        {/* Summary */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mt-6">
          <h3 className="text-lg font-black text-gray-900 mb-4">ملخص الطلب</h3>
          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">المجموع الفرعي</span>
              <span className="text-gray-900 font-bold">{totals.subtotal}.00 ل.س</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">رسوم التوصيل</span>
              <span className="text-gray-900 font-bold">{totals.shipping}.00 ل.س</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">ضريبة القيمة المضافة (15%)</span>
              <span className="text-gray-900 font-bold">{totals.tax.toFixed(2)} ل.س</span>
            </div>
            {totals.discount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-red-500">الخصم</span>
                <span className="text-red-500 font-bold">-{totals.discount.toFixed(2)} ل.س</span>
              </div>
            )}
          </div>
          <div className="pt-4 border-t border-dashed border-gray-100 flex justify-between items-center">
            <span className="text-xl font-black text-gray-900">الإجمالي</span>
            <span className="text-2xl font-black text-emerald-600">{totals.total.toFixed(2)} ل.س</span>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="fixed bottom-20 left-0 right-0 p-4 bg-white border-t border-gray-100 z-50">
        <button 
          onClick={handleCheckout}
          className="w-full bg-emerald-600 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20"
        >
          <ShoppingCart size={20} />
          إتمام عملية الشراء
        </button>
      </div>
    </div>
  );
}
