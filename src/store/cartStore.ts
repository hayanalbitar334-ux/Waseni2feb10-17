import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  product?: {
    title: string;
    price: number;
    image_url: string;
  };
}

interface CartState {
  items: CartItem[];
  loading: boolean;
  promoCode: string | null;
  fetchItems: (userId: string) => Promise<void>;
  addItem: (userId: string, productId: string, quantity?: number) => Promise<void>;
  removeItem: (userId: string, itemId: string) => Promise<void>;
  updateQuantity: (userId: string, itemId: string, quantity: number) => Promise<void>;
  clearCart: (userId: string) => Promise<void>;
  applyPromoCode: (code: string) => void;
  getTotals: () => {
    subtotal: number;
    tax: number;
    shipping: number;
    discount: number;
    total: number;
  };
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  loading: false,
  promoCode: null,

  fetchItems: async (userId: string) => {
    set({ loading: true });
    const { data, error } = await supabase
      .from('cart_items')
      .select('*, product:products(title, price, image_url)')
      .eq('user_id', userId);

    if (!error && data) {
      set({ items: data as any, loading: false });
    } else {
      set({ loading: false });
    }
  },

  addItem: async (userId: string, productId: string, quantity = 1) => {
    const { data, error } = await supabase
      .from('cart_items')
      .upsert({ user_id: userId, product_id: productId, quantity }, { onConflict: 'user_id,product_id' })
      .select()
      .single();

    if (!error && data) {
      await get().fetchItems(userId);
    }
  },

  removeItem: async (userId: string, itemId: string) => {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', itemId);

    if (!error) {
      set((state) => ({
        items: state.items.filter((item) => item.id !== itemId),
      }));
    }
  },

  updateQuantity: async (userId: string, itemId: string, quantity: number) => {
    const { error } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('id', itemId);

    if (!error) {
      set((state) => ({
        items: state.items.map((item) =>
          item.id === itemId ? { ...item, quantity } : item
        ),
      }));
    }
  },

  clearCart: async (userId: string) => {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', userId);

    if (!error) {
      set({ items: [] });
    }
  },

  applyPromoCode: (code: string) => {
    set({ promoCode: code.toUpperCase() });
  },

  getTotals: () => {
    const { items, promoCode } = get();
    const subtotal = items.reduce((acc, item) => {
      const price = item.product?.price || 0;
      return acc + price * item.quantity;
    }, 0);

    const taxRate = 0.15; // 15% VAT
    const shipping = subtotal > 0 ? 15 : 0;
    const tax = subtotal * taxRate;
    
    let discount = 0;
    if (promoCode === 'WELCOME20') {
      discount = subtotal * 0.2; // 20% discount
    }

    const total = subtotal + tax + shipping - discount;

    return {
      subtotal,
      tax,
      shipping,
      discount,
      total,
    };
  },
}));
