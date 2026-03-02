import { Search, Bell, Filter, ShoppingBag, Clock } from 'lucide-react';
import { MOCK_PRODUCTS } from '../types';
import { ProductCard } from '../components/ProductCard';
import { motion } from 'motion/react';

export default function HomePage() {
  const categories = [
    { name: 'إلكترونيات', icon: '📱', color: 'bg-emerald-50' },
    { name: 'أزياء', icon: '👕', color: 'bg-blue-50' },
    { name: 'المنزل', icon: '🛋️', color: 'bg-orange-50' },
    { name: 'جمال', icon: '💄', color: 'bg-pink-50' },
  ];

  return (
    <div className="pb-24">
      {/* Header */}
      <header className="bg-white px-4 pt-4 pb-2 sticky top-0 z-40">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600">
              <ShoppingBag size={20} />
            </div>
            <h1 className="text-xl font-black text-gray-900">وصيني</h1>
          </div>
          <div className="flex items-center gap-2">
            <button className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-600">
              <Bell size={20} />
            </button>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="ابحث عن المنتجات والمتاجر..." 
              className="w-full bg-gray-50 border-none rounded-xl py-3 pr-10 pl-4 text-sm focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
          <button className="w-12 h-12 bg-emerald-600 text-white rounded-xl flex items-center justify-center">
            <Filter size={20} />
          </button>
        </div>
      </header>

      {/* Categories */}
      <section className="px-4 py-6 overflow-x-auto flex gap-4 no-scrollbar">
        {categories.map((cat) => (
          <div key={cat.name} className="flex flex-col items-center gap-2 flex-shrink-0">
            <div className={`w-16 h-16 ${cat.color} rounded-2xl flex items-center justify-center text-2xl shadow-sm`}>
              {cat.icon}
            </div>
            <span className="text-xs font-bold text-gray-600">{cat.name}</span>
          </div>
        ))}
      </section>

      {/* Banner */}
      <section className="px-4 mb-8">
        <div className="relative h-44 bg-[#E6B14D] rounded-3xl overflow-hidden p-6 flex flex-col justify-center">
          <div className="relative z-10">
            <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-lg mb-2 inline-block">عروض خاطفة</span>
            <h2 className="text-2xl font-black text-gray-900 mb-1">خصومات تصل إلى 50%</h2>
            <p className="text-sm text-gray-800 mb-4">على جميع مستلزمات الشتاء</p>
            <div className="flex gap-2">
              {[ {v: 12, l: 'ساعة'}, {v: 45, l: 'دقيقة'}, {v: 30, l: 'ثانية'} ].map((t, i) => (
                <div key={i} className="bg-white/30 backdrop-blur-md rounded-xl px-3 py-1 flex flex-col items-center min-w-[50px]">
                  <span className="text-sm font-black text-gray-900">{t.v}</span>
                  <span className="text-[8px] font-bold text-gray-800">{t.l}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="absolute -right-10 -top-10 w-64 h-64 bg-black/5 rounded-full" />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 w-32 h-32 opacity-20">
             <Clock size={120} className="text-gray-900" />
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="mb-8">
        <div className="px-4 flex items-center justify-between mb-4">
          <h2 className="text-lg font-black text-gray-900">الأكثر مبيعاً</h2>
          <button className="text-emerald-600 text-sm font-bold">عرض الكل</button>
        </div>
        <div className="flex gap-4 overflow-x-auto px-4 no-scrollbar">
          {MOCK_PRODUCTS.slice(0, 3).map(p => (
            <ProductCard key={p.id} product={p} variant="horizontal" />
          ))}
        </div>
      </section>

      {/* Discover Products */}
      <section className="px-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-black text-gray-900">اكتشف منتجاتنا</h2>
          <div className="flex gap-2">
            <button className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
              <LayoutGrid size={16} />
            </button>
            <button className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-gray-400 shadow-sm">
              <Filter size={16} />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {MOCK_PRODUCTS.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}

import { LayoutGrid } from 'lucide-react';
