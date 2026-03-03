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
  fetchItems: (userId: string | null) => Promise<void>;
  addItem: (userId: string | null, productId: string, quantity?: number) => Promise<void>;
  removeItem: (userId: string | null, itemId: string) => Promise<void>;
  updateQuantity: (userId: string | null, itemId: string, quantity: number) => Promise<void>;
  clearCart: (userId: string | null) => Promise<void>;
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

  fetchItems: async (userId: string | null) => {
    set({ loading: true });
    if (!userId) {
      // Guest mode: load from localStorage
      const savedCart = localStorage.getItem('guest_cart');
      if (savedCart) {
        set({ items: JSON.parse(savedCart), loading: false });
      } else {
        set({ items: [], loading: false });
      }
      return;
    }

    const { data, error } = await supabase
      .from('cart_items')
      .select('*, product:products(title, price, image_url)')
      .eq('user_id', userId);

    if (!error && data) {
      set({ items: data as any, loading: false });
    } else {
      console.error('Fetch cart items error:', error);
      set({ loading: false });
    }
  },

  addItem: async (userId: string | null, productId: string, quantity = 1) => {
    if (!userId) {
      // Guest mode: add to localStorage
      const { items } = get();
      const existingItemIndex = items.findIndex(item => item.product_id === productId);
      let newItems = [...items];

      if (existingItemIndex >= 0) {
        newItems[existingItemIndex].quantity += quantity;
      } else {
        // Need to fetch product details for local display
        const { data: product } = await supabase
          .from('products')
          .select('title, price, image_url')
          .eq('id', productId)
          .single();
          
        if (product) {
          newItems.push({
            id: `guest-${Date.now()}`,
            product_id: productId,
            quantity,
            product: product as any
          });
        }
      }
      
      set({ items: newItems });
      localStorage.setItem('guest_cart', JSON.stringify(newItems));
      return;
    }

    // Check if item already exists
    const { data: existingItem } = await supabase
      .from('cart_items')
      .select('id, quantity')
      .eq('user_id', userId)
      .eq('product_id', productId)
      .single();

    let result;
    if (existingItem) {
      // Update quantity
      result = await supabase
        .from('cart_items')
        .update({ quantity: existingItem.quantity + quantity })
        .eq('id', existingItem.id)
        .select()
        .single();
    } else {
      // Insert new item
      result = await supabase
        .from('cart_items')
        .insert({ user_id: userId, product_id: productId, quantity })
        .select()
        .single();
    }

    if (!result.error && result.data) {
      await get().fetchItems(userId);
    } else {
      console.error('Add to cart error:', result.error);
      throw result.error;
    }
  },

  removeItem: async (userId: string | null, itemId: string) => {
    if (!userId) {
      const { items } = get();
      const newItems = items.filter((item) => item.id !== itemId);
      set({ items: newItems });
      localStorage.setItem('guest_cart', JSON.stringify(newItems));
      return;
    }

    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', itemId);

    if (!error) {
      set((state) => ({
        items: state.items.filter((item) => item.id !== itemId),
      }));
    } else {
      console.error('Remove item error:', error);
    }
  },

  updateQuantity: async (userId: string | null, itemId: string, quantity: number) => {
    if (!userId) {
      const { items } = get();
      const newItems = items.map((item) =>
        item.id === itemId ? { ...item, quantity } : item
      );
      set({ items: newItems });
      localStorage.setItem('guest_cart', JSON.stringify(newItems));
      return;
    }

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
    } else {
      console.error('Update quantity error:', error);
    }
  },

  clearCart: async (userId: string | null) => {
    if (!userId) {
      set({ items: [] });
      localStorage.removeItem('guest_cart');
      return;
    }

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
