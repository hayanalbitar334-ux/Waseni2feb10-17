import React from 'react';
import { Search, Bell, Filter, ShoppingBag, Clock, LayoutGrid } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ProductCard } from '../components/ProductCard';
import { motion } from 'motion/react';
import { useProducts } from '../hooks/useProducts';
import { ProductSkeleton } from '../components/Skeleton';
import { supabase } from '../lib/supabase';

export default function HomePage() {
  const navigate = useNavigate();
  const { products, loading, error } = useProducts();
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = React.useState('');
  
  const [homeConfig, setHomeConfig] = React.useState<any>(null);
  const [categories, setCategories] = React.useState<any[]>([]);

  React.useEffect(() => {
    const fetchHomeData = async () => {
      const [configRes, categoriesRes] = await Promise.all([
        supabase.from('home_config').select('*').single(),
        supabase.from('categories').select('*')
      ]);
      setHomeConfig(configRes.data || {});
      if (categoriesRes.data) setCategories(categoriesRes.data);
    };
    fetchHomeData();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const filteredProducts = products.filter(product => 
    product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-6 text-center">
        <p className="text-red-500">حدث خطأ أثناء تحميل المنتجات. يرجى المحاولة لاحقاً.</p>
      </div>
    );
  }

  const renderCategories = () => (
    <section className={`px-4 py-6 ${homeConfig?.categories_layout === 'grid' ? 'grid grid-cols-4 gap-4' : 'overflow-x-auto flex gap-4 no-scrollbar'}`}>
      {categories.map((cat) => (
        <button 
          key={cat.name} 
          onClick={() => alert(`عرض فئة: ${cat.name}`)}
          className="flex flex-col items-center gap-2 flex-shrink-0"
        >
          <div className={`w-16 h-16 ${cat.color || 'bg-gray-100'} rounded-2xl flex items-center justify-center text-2xl shadow-sm`}>
            {cat.icon}
          </div>
          <span className="text-xs font-bold text-gray-600">{cat.name}</span>
        </button>
      ))}
    </section>
  );

  const renderBanner = () => {
    if (homeConfig?.banner_image_url) {
      return (
        <section className="px-4 mb-8">
          <div className="relative h-44 bg-gray-100 rounded-3xl overflow-hidden shadow-sm">
            <img 
              src={homeConfig.banner_image_url} 
              alt="Banner" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </section>
      );
    }

    return (
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
    );
  };

  return (
    <div className="pb-24">
      {/* News Ticker */}
      {homeConfig?.news_ticker_enabled && (
        <div className="bg-emerald-600 text-white text-xs font-bold py-2 overflow-hidden relative">
          <div className="whitespace-nowrap animate-marquee inline-block px-4">
            {homeConfig.news_ticker_text || 'توصيل مجاني للطلبات فوق ١٠٠ الف ليرة'}
          </div>
        </div>
      )}

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
            <button 
              onClick={() => alert('لا توجد تنبيهات جديدة')}
              className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-600"
            >
              <Bell size={20} />
            </button>
          </div>
        </div>
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن المنتجات والمتاجر..." 
              className="w-full bg-gray-50 border-none rounded-xl py-3 pr-10 pl-4 text-sm focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
          <button 
            type="button"
            onClick={() => alert('الفلاتر قيد التطوير')}
            className="w-12 h-12 bg-emerald-600 text-white rounded-xl flex items-center justify-center"
          >
            <Filter size={20} />
          </button>
        </form>
      </header>

      {!searchQuery && (
        <>
          {[
            { id: 'categories', pos: homeConfig?.categories_position || 1, component: renderCategories },
            { id: 'banner', pos: homeConfig?.banner_position || 2, component: renderBanner }
          ]
          .sort((a, b) => a.pos - b.pos)
          .map((section) => (
            <React.Fragment key={section.id}>
              {section.component()}
            </React.Fragment>
          ))}
        </>
      )}

      {/* Best Sellers */}
      {!searchQuery && (
        <section className="mb-8">
          <div className="px-4 flex items-center justify-between mb-4">
            <h2 className="text-lg font-black text-gray-900">الأكثر مبيعاً</h2>
            <button 
              onClick={() => navigate('/categories')}
              className="text-emerald-600 text-sm font-bold"
            >
              عرض الكل
            </button>
          </div>
          <div className="flex gap-4 overflow-x-auto px-4 no-scrollbar">
            {loading ? (
              Array(3).fill(0).map((_, i) => <div key={i} className="w-48 flex-shrink-0"><ProductSkeleton /></div>)
            ) : (
              products.slice(0, 3).map(p => (
                <ProductCard key={p.id} product={p} variant="horizontal" />
              ))
            )}
          </div>
        </section>
      )}

      {/* Discover Products */}
      <section className="px-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-black text-gray-900">
            {searchQuery ? 'نتائج البحث' : 'اكتشف منتجاتنا'}
          </h2>
          <div className="flex gap-2">
            <button 
              onClick={() => setViewMode('grid')}
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                viewMode === 'grid' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-gray-100 text-gray-400'
              }`}
            >
              <LayoutGrid size={16} />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                viewMode === 'list' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-gray-100 text-gray-400'
              }`}
            >
              <Filter size={16} className="rotate-90" />
            </button>
          </div>
        </div>
        <div className={viewMode === 'grid' ? "grid grid-cols-2 gap-4" : "space-y-4"}>
          {loading ? (
            Array(4).fill(0).map((_, i) => <ProductSkeleton key={i} />)
          ) : (
            filteredProducts.length > 0 ? (
              filteredProducts.map(p => (
                <ProductCard key={p.id} product={p} variant={viewMode === 'list' ? 'horizontal' : 'grid'} />
              ))
            ) : (
              <div className="col-span-2 text-center py-12 text-gray-500">
                لا توجد نتائج مطابقة لبحثك
              </div>
            )
          )}
        </div>
      </section>
    </div>
  );
}
