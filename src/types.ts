import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface Product {
  id: string;
  name: string;
  price: number;
  oldPrice?: number;
  image: string;
  rating: number;
  reviewsCount: number;
  merchant: string;
  category: string;
  description?: string;
  discount?: string;
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

export interface Order {
  id: string;
  customerName: string;
  date: string;
  status: 'pending' | 'shipping' | 'delivered';
  total: number;
}

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'حذاء ركض رياضي',
    price: 240,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80',
    rating: 4.8,
    reviewsCount: 120,
    merchant: 'متجر نايك',
    category: 'أزياء',
    description: 'حذاء رياضي مريح للركض اليومي بتصميم عصري وأداء عالي.'
  },
  {
    id: '2',
    name: 'سماعات لاسلكية',
    price: 450,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80',
    rating: 4.5,
    reviewsCount: 85,
    merchant: 'متجر التقنية',
    category: 'إلكترونيات'
  },
  {
    id: '3',
    name: 'ساعة يد ذكية الإصدار 7',
    price: 890,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80',
    rating: 4.9,
    reviewsCount: 210,
    merchant: 'متجر آي تك',
    category: 'إلكترونيات',
    discount: '25%'
  },
  {
    id: '4',
    name: 'نظارات شمسية',
    price: 120,
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&q=80',
    rating: 4.8,
    reviewsCount: 45,
    merchant: 'متجر الموضة',
    category: 'جمال'
  },
  {
    id: '5',
    name: 'حذاء رسمي جلد طبيعي',
    price: 350,
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&q=80',
    rating: 4.5,
    reviewsCount: 32,
    merchant: 'عالم الأحذية',
    category: 'أزياء'
  },
  {
    id: '6',
    name: 'سماعات رأس احترافية',
    price: 550,
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400&q=80',
    rating: 4.7,
    reviewsCount: 64,
    merchant: 'الصوتيات الحديثة',
    category: 'إلكترونيات'
  }
];
