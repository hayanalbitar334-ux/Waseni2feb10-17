import { supabase } from '../lib/supabase';
import { CartItem } from '../store/cartStore';

export async function placeOrder(
  userId: string,
  items: CartItem[],
  totals: { total: number },
  paymentMethod: string,
  shippingAddress: string
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
    const { error: clearError } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', userId);

    if (clearError) throw clearError;

    return { success: true, orderId: order.id };
  } catch (error) {
    console.error('Error placing order:', error);
    return { success: false, error };
  }
}
