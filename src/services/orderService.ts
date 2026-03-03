import { supabase } from '../lib/supabase';
import { CartItem } from '../store/cartStore';

export async function placeOrder(
  userId: string | null,
  items: CartItem[],
  totals: { total: number },
  paymentMethod: string,
  shippingAddress: string,
  guestInfo?: { name: string; email: string; phone: string }
) {
  try {
    // 1. Create order record
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: userId,
        total_amount: totals.total,
        status: 'pending',
        payment_method: paymentMethod,
        shipping_address: shippingAddress,
        guest_name: guestInfo?.name,
        guest_email: guestInfo?.email,
        guest_phone: guestInfo?.phone
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // 2. Map cart items to order_items
    const orderItems = items.map((item) => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      unit_price: item.product?.price || 0,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) throw itemsError;

    // 3. Clear cart
    if (userId) {
      const { error: clearError } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', userId);

      if (clearError) throw clearError;
    } else {
      // Clear guest cart from localStorage
      localStorage.removeItem('guest_cart');
      // Also need to clear zustand store, but this function is pure service.
      // The caller (CheckoutPage) should handle UI state or store refresh.
      // Actually, cartStore.clearCart(null) handles localStorage removal.
    }

    return { success: true, orderId: order.id };
  } catch (error) {
    console.error('Error placing order:', error);
    return { success: false, error };
  }
}
