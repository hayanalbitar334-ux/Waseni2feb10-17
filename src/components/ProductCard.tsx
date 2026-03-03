import React from 'react';
import { Star, ShoppingCart, Heart, Plus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Product, cn } from '../types';
import { motion } from 'motion/react';
import { useCartStore } from '../store/cartStore';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

export interface ProductCardProps {
  product: any;
  variant?: 'grid' | 'horizontal';
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, variant = 'grid' }) => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const addItem = useCartStore(state => state.addItem);
  const [isFavorite, setIsFavorite] = React.useState(false);

  const handleAction = async (e: React.MouseEvent, action: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (action === 'favorite') {
      setIsFavorite(!isFavorite);
    } else if (action === 'cart') {
      try {
        if (!product.id) {
          console.error('Product ID is missing', product);
          toast.error('بيانات المنتج غير مكتملة');
          return;
        }
        // Treat admin as guest to avoid FK constraints
        const userId = user?.email === 'saryatest123@gmail.com' ? null : user?.id;
        await addItem(userId || null, product.id, 1);
        toast.success('تمت إضافة المنتج للسلة');
      } catch (err: any) {
        console.error('Add to cart error in ProductCard:', err);
        toast.error(`حدث خطأ أثناء إضافة المنتج: ${err.message || 'خطأ غير معروف'}`);
      }
    }
  };

  if (variant === 'horizontal') {
    return (
      <Link to={`/product/${product.id}`} className="flex-shrink-0 w-48 bg-white rounded-2xl p-3 shadow-sm border border-gray-50">
        <div className="relative aspect-square mb-3 rounded-xl overflow-hidden bg-gray-100">
          <img src={product.image_url} alt={product.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          <button 
            onClick={(e) => handleAction(e, 'cart')}
            className="absolute top-2 left-2 w-8 h-8 bg-white/80 backdrop-blur rounded-full flex items-center justify-center text-emerald-600 shadow-sm"
          >
            <Plus size={16} />
          </button>
        </div>
        <h3 className="text-sm font-bold text-gray-900 mb-1 truncate">{product.title}</h3>
        <p className="text-[10px] text-gray-400 mb-2">متجر وصيني</p>
        <div className="flex items-center justify-between">
          <span className="text-emerald-600 font-bold text-sm">{product.price} ل.س</span>
        </div>
      </Link>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 relative"
    >
      <Link to={`/product/${product.id}`}>
        <div className="relative aspect-[4/5] bg-gray-100">
          <img src={product.image_url} alt={product.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          <button 
            onClick={(e) => handleAction(e, 'favorite')}
            className={cn(
              "absolute top-3 left-3 w-8 h-8 bg-white/80 backdrop-blur rounded-full flex items-center justify-center shadow-sm transition-colors",
              isFavorite ? "text-red-500" : "text-gray-400"
            )}
          >
            <Heart size={16} fill={isFavorite ? "currentColor" : "none"} />
          </button>
        </div>
        <div className="p-3">
          <div className="flex items-center gap-1 mb-1">
            <Star size={12} className="fill-yellow-400 text-yellow-400" />
            <span className="text-[10px] font-bold text-gray-900">{product.rating || 4.5}</span>
          </div>
          <h3 className="text-sm font-bold text-gray-900 mb-1 line-clamp-1">{product.title}</h3>
          <p className="text-[10px] text-gray-400 mb-2">متجر وصيني</p>
          <div className="flex items-center justify-between">
            <span className="text-emerald-600 font-bold">{product.price} ل.س</span>
            <button 
              onClick={(e) => handleAction(e, 'cart')}
              className="w-8 h-8 bg-emerald-600 text-white rounded-lg flex items-center justify-center"
            >
              <ShoppingCart size={16} />
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
