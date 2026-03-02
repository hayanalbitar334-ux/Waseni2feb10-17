import React from 'react';
import { Star, ShoppingCart, Heart, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Product, cn } from '../types';
import { motion } from 'motion/react';

export interface ProductCardProps {
  product: Product;
  variant?: 'grid' | 'horizontal';
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, variant = 'grid' }) => {
  if (variant === 'horizontal') {
    return (
      <Link to={`/product/${product.id}`} className="flex-shrink-0 w-48 bg-white rounded-2xl p-3 shadow-sm border border-gray-50">
        <div className="relative aspect-square mb-3 rounded-xl overflow-hidden bg-gray-100">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          <button className="absolute top-2 left-2 w-8 h-8 bg-white/80 backdrop-blur rounded-full flex items-center justify-center text-gray-400">
            <Plus size={16} />
          </button>
        </div>
        <h3 className="text-sm font-bold text-gray-900 mb-1 truncate">{product.name}</h3>
        <p className="text-[10px] text-gray-400 mb-2">{product.merchant}</p>
        <div className="flex items-center justify-between">
          <span className="text-emerald-600 font-bold text-sm">{product.price} ر.س</span>
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
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          <button className="absolute top-3 left-3 w-8 h-8 bg-white/80 backdrop-blur rounded-full flex items-center justify-center text-gray-400 shadow-sm">
            <Heart size={16} />
          </button>
          {product.discount && (
            <div className="absolute top-3 right-3 bg-red-50 text-red-500 text-[10px] font-bold px-2 py-1 rounded-lg">
              خصم {product.discount}
            </div>
          )}
        </div>
        <div className="p-3">
          <div className="flex items-center gap-1 mb-1">
            <Star size={12} className="fill-yellow-400 text-yellow-400" />
            <span className="text-[10px] font-bold text-gray-900">{product.rating}</span>
          </div>
          <h3 className="text-sm font-bold text-gray-900 mb-1 line-clamp-1">{product.name}</h3>
          <p className="text-[10px] text-gray-400 mb-2">{product.merchant}</p>
          <div className="flex items-center justify-between">
            <span className="text-emerald-600 font-bold">{product.price} ر.س</span>
            <button className="w-8 h-8 bg-emerald-600 text-white rounded-lg flex items-center justify-center">
              <ShoppingCart size={16} />
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
