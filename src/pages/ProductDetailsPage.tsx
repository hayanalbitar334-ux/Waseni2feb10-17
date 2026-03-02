import { ArrowRight, Share2, Heart, Star, ShoppingCart, Truck, ChevronDown, Plus, Minus } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { MOCK_PRODUCTS, cn } from '../types';
import { useState } from 'react';
import { motion } from 'motion/react';

import { useProduct } from '../hooks/useProducts';
import { useCartStore } from '../store/cartStore';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

export default function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { product, loading, error } = useProduct(id || '');
  const addItem = useCartStore(state => state.addItem);
  
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

  const handleAddToCart = async () => {
    if (!user) {
      toast.error('يرجى تسجيل الدخول أولاً');
      navigate('/login');
      return;
    }
    
    try {
      await addItem(user.id, product.id, quantity);
      toast.success('تمت إضافة المنتج للسلة بنجاح');
    } catch (err) {
      toast.error('حدث خطأ أثناء إضافة المنتج');
    }
  };

  const handleBuyNow = async () => {
    if (!user) {
      toast.error('يرجى تسجيل الدخول أولاً');
      navigate('/login');
      return;
    }
    await handleAddToCart();
    navigate('/cart');
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: product.title,
          text: product.description,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success('تم نسخ الرابط!');
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6 text-center">
        <h2 className="text-xl font-black text-gray-900 mb-2">المنتج غير موجود</h2>
        <button onClick={() => navigate('/')} className="text-emerald-600 font-bold">العودة للرئيسية</button>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pb-32">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-4 py-4 flex items-center justify-between pointer-events-none">
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center shadow-sm pointer-events-auto"
        >
          <ArrowRight size={20} />
        </button>
        <div className="flex gap-2 pointer-events-auto">
          <button 
            onClick={handleShare}
            className="w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center shadow-sm"
          >
            <Share2 size={20} />
          </button>
          <button 
            onClick={() => setIsFavorite(!isFavorite)}
            className={cn(
              "w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center shadow-sm transition-colors",
              isFavorite ? "text-red-500" : "text-gray-400"
            )}
          >
            <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
          </button>
        </div>
      </header>

      {/* Image Gallery */}
      <div className="relative aspect-square bg-gray-100">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2">
          <div className="w-2 h-2 rounded-full bg-gray-300" />
          <div className="w-2 h-2 rounded-full bg-gray-300" />
          <div className="w-6 h-2 rounded-full bg-emerald-600" />
        </div>
      </div>

      {/* Content */}
      <div className="px-6 pt-8 pb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1">
            <Star size={16} className="fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-bold text-gray-900">{product.rating}</span>
            <span className="text-xs text-gray-400">(120 مراجعة)</span>
          </div>
          <span className="text-emerald-600 text-xs font-bold bg-emerald-50 px-2 py-1 rounded-lg">متوفر في المخزون</span>
        </div>

        <h1 className="text-2xl font-black text-gray-900 mb-2">{product.name}</h1>
        <div className="flex items-center gap-3 mb-6">
          <span className="text-3xl font-black text-emerald-600">{product.price} ر.س</span>
          <span className="text-lg text-gray-300 line-through">399 ر.س</span>
          <span className="bg-emerald-50 text-emerald-600 text-xs font-bold px-2 py-1 rounded-lg">خصم 25%</span>
        </div>

        {/* Merchant */}
        <div className="bg-gray-50 rounded-3xl p-4 flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden">
              <img src="https://picsum.photos/seed/merchant/100/100" alt="Merchant" referrerPolicy="no-referrer" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">متجر الفخامة</h3>
              <p className="text-[10px] text-gray-400">بائع موثوق • شحن سريع</p>
            </div>
          </div>
          <button className="text-emerald-600 text-xs font-bold">زيارة الملف الشخصي</button>
        </div>

        {/* Description */}
        <div className="mb-8">
          <h3 className="text-lg font-black text-gray-900 mb-3">الوصف</h3>
          <p className={cn(
            "text-sm text-gray-500 leading-relaxed",
            !showFullDescription && "line-clamp-3"
          )}>
            {product.description || 'ساعة وصيني الذكية تجمع بين التصميم العصري والأداء القوي. تتميز بشاشة AMOLED فائقة الوضوح، وعمر بطارية يدوم حتى 14 يوماً. تدعم جميع الإشعارات العربية...'}
          </p>
          <button 
            onClick={() => setShowFullDescription(!showFullDescription)}
            className="flex items-center gap-1 text-emerald-600 text-sm font-bold mt-2"
          >
            {showFullDescription ? 'عرض أقل' : 'اقرأ المزيد'} <ChevronDown size={16} className={cn("transition-transform", showFullDescription && "rotate-180")} />
          </button>
        </div>

        {/* Quantity */}
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-lg font-black text-gray-900">الكمية</h3>
          <div className="flex items-center gap-4 bg-gray-50 rounded-2xl p-2">
            <button 
              onClick={() => setQuantity(q => Math.max(1, q - 1))}
              className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-gray-600 shadow-sm"
            >
              <Minus size={20} />
            </button>
            <span className="text-lg font-black text-gray-900 w-8 text-center">{quantity}</span>
            <button 
              onClick={() => setQuantity(q => q + 1)}
              className="w-10 h-10 bg-emerald-600 text-white rounded-xl flex items-center justify-center shadow-sm"
            >
              <Plus size={20} />
            </button>
          </div>
        </div>

        {/* Shipping info */}
        <div className="flex items-center gap-3 text-gray-600 mb-8">
          <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
            <Truck size={20} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-900">شحن مجاني</h4>
            <p className="text-[10px] text-gray-400">التوصيل المتوقع خلال 2-3 أيام عمل إلى الرياض</p>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 flex gap-4 z-50 pb-8">
        <button 
          onClick={handleAddToCart}
          className="flex-1 bg-emerald-600 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20"
        >
          <ShoppingCart size={20} />
          إضافة للسلة
        </button>
        <button 
          onClick={handleBuyNow}
          className="flex-1 border-2 border-emerald-600 text-emerald-600 font-black py-4 rounded-2xl"
        >
          شراء الآن
        </button>
      </div>
    </div>
  );
}
