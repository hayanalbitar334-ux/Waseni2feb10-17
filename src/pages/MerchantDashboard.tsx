import React, { useEffect, useState } from 'react';
import { Bell, User, Plus, Package, ShoppingCart, TrendingUp, ChevronLeft, CheckCircle2, Truck, Clock, Loader2, X, Save, Upload, Edit, Trash2 } from 'lucide-react';
import { BarChart, Bar, XAxis, ResponsiveContainer, Cell } from 'recharts';
import { useAuth } from '../context/AuthContext';
import { useSellerStats } from '../hooks/useSellerStats';
import { supabase } from '../lib/supabase';
import { StatsSkeleton } from '../components/Skeleton';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';

export default function MerchantDashboard() {
  const { user } = useAuth();
  const [store, setStore] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders'>('overview');
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const { stats, loading, error } = useSellerStats(store?.id || '');

  useEffect(() => {
    async function fetchData() {
      if (!user) return;
      
      const [storeRes, categoriesRes] = await Promise.all([
        supabase.from('stores').select('*').eq('owner_id', user.id).single(),
        supabase.from('categories').select('*')
      ]);
      
      if (storeRes.data) {
        setStore(storeRes.data);
        const { data: productsData } = await supabase
          .from('products')
          .select('*')
          .eq('store_id', storeRes.data.id)
          .order('created_at', { ascending: false });
        if (productsData) setProducts(productsData);
      }
      if (categoriesRes.data) setCategories(categoriesRes.data);
    }
    fetchData();
  }, [user]);

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا المنتج؟')) return;
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) toast.error('فشل حذف المنتج');
    else {
      toast.success('تم حذف المنتج بنجاح');
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSaveProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!store) return;
    
    setUploading(true);
    const formData = new FormData(e.currentTarget);
    
    let imageUrl = editingProduct?.image_url;

    if (selectedFile) {
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(filePath, selectedFile);

      if (uploadError) {
        toast.error('فشل رفع الصورة: ' + uploadError.message);
        setUploading(false);
        return;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('products')
        .getPublicUrl(filePath);
      
      imageUrl = publicUrl;
    }

    const productData = {
      title: formData.get('title'),
      price: parseFloat(formData.get('price') as string),
      stock_quantity: parseInt(formData.get('stock') as string),
      description: formData.get('description'),
      image_url: imageUrl,
      category_id: formData.get('category_id'),
      store_id: store.id
    };

    let error;
    if (editingProduct) {
      const { error: err } = await supabase.from('products').update(productData).eq('id', editingProduct.id);
      error = err;
    } else {
      const { error: err } = await supabase.from('products').insert([productData]);
      error = err;
    }

    if (error) {
      toast.error('فشل حفظ المنتج');
    } else {
      toast.success(editingProduct ? 'تم تحديث المنتج' : 'تم إضافة المنتج');
      setShowProductModal(false);
      setEditingProduct(null);
      setSelectedFile(null);
      setPreviewUrl(null);
      // Refresh stats or products list if needed
      window.location.reload(); // Simple refresh for now
    }
    setUploading(false);
  };

  const barData = [
    { name: '١٥ مايو', value: 300 },
    { name: '٢٠ مايو', value: 250 },
    { name: '٢٥ مايو', value: 350 },
    { name: '٣٠ مايو', value: 500 },
    { name: '٥ يونيو', value: 400 },
    { name: '١٠ يونيو', value: 320 },
    { name: '١٥ يونيو', value: 200 },
  ];

  if (loading && !store) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-24">
      {/* Header */}
      <header className="bg-white px-6 py-6 flex items-center justify-between sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-emerald-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-600/20">
            <ShoppingCart size={24} />
          </div>
          <div>
            <h1 className="text-lg font-black text-gray-900">{store?.store_name || 'متجري'}</h1>
            <p className="text-[10px] text-emerald-600 font-bold">بائع معتمد • الرياض</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center relative">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
          </button>
          <div className="w-10 h-10 rounded-full bg-emerald-100 overflow-hidden border-2 border-white shadow-sm">
             <img src={user?.user_metadata?.avatar_url || "https://picsum.photos/seed/merchant-user/100/100"} alt="Profile" referrerPolicy="no-referrer" />
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6">
        {activeTab === 'overview' && (
          <>
            {/* Sales Stats */}
            {loading ? (
              <StatsSkeleton />
            ) : (
              <div className="bg-white rounded-[40px] p-6 shadow-sm border border-gray-100">
                 <div className="flex items-center justify-between mb-2">
                   <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">+١٢%</span>
                   <span className="text-sm text-gray-400">إجمالي المبيعات</span>
                 </div>
                 <h2 className="text-3xl font-black text-gray-900 text-center mb-6">{stats.totalSales.toLocaleString()} ر.س</h2>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-3xl p-4 flex flex-col items-center">
                      <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-2">
                        <ShoppingCart size={20} />
                      </div>
                      <span className="text-[10px] text-gray-400 mb-1">الطلبات النشطة</span>
                      <span className="text-xl font-black text-gray-900">{stats.activeOrders}</span>
                    </div>
                    <div className="bg-gray-50 rounded-3xl p-4 flex flex-col items-center">
                      <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center mb-2">
                        <Package size={20} />
                      </div>
                      <span className="text-[10px] text-gray-400 mb-1">إجمالي المنتجات</span>
                      <span className="text-xl font-black text-gray-900">{stats.totalProducts}</span>
                    </div>
                 </div>
              </div>
            )}

            {/* Revenue Analysis */}
            <div className="bg-white rounded-[40px] p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-black text-gray-900">تحليل الإيرادات</h3>
                <select className="bg-gray-50 border-none text-[10px] font-bold rounded-lg py-1 pr-2 pl-6">
                  <option>آخر ٣٠ يوم</option>
                </select>
              </div>
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData}>
                    <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                      {barData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 3 ? '#10b981' : '#d1fae5'} />
                      ))}
                    </Bar>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Add Product Button */}
            <button 
              onClick={() => { setEditingProduct(null); setShowProductModal(true); }}
              className="w-full bg-emerald-600 text-white font-black py-4 rounded-3xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20"
            >
              <Plus size={24} />
              إضافة منتج جديد
            </button>

            {/* Recent Orders */}
            <section>
              <div className="flex items-center justify-between mb-4 px-2">
                <h3 className="text-lg font-black text-gray-900">الطلبات الأخيرة</h3>
                <button 
                  onClick={() => setActiveTab('orders')}
                  className="text-emerald-600 text-xs font-bold"
                >
                  عرض الكل
                </button>
              </div>
              <div className="space-y-4">
                {stats.recentOrders.length === 0 ? (
                  <div className="bg-white rounded-3xl p-8 text-center border border-gray-100">
                    <p className="text-gray-400 text-sm">لا توجد طلبات أخيرة</p>
                  </div>
                ) : (
                  stats.recentOrders.map((item, i) => (
                    <div key={i} className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 flex items-center gap-4">
                      <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                        <Package size={28} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-sm font-black text-gray-900">{item.products?.title}</h4>
                          <span className="text-[10px] text-gray-400">#{item.orders?.id.slice(0, 5)}</span>
                        </div>
                        <p className="text-[10px] text-gray-400 mb-2">الكمية: {item.quantity}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-emerald-600 font-black text-sm">{item.unit_price * item.quantity} ر.س</span>
                          <span className={`text-[10px] font-bold px-3 py-1 rounded-full ${
                            item.orders?.status === 'delivered' ? 'bg-emerald-50 text-emerald-600' : 
                            item.orders?.status === 'pending' ? 'bg-yellow-50 text-yellow-600' : 'bg-blue-50 text-blue-600'
                          }`}>
                            {item.orders?.status === 'pending' ? 'قيد الانتظار' : 
                             item.orders?.status === 'processing' ? 'قيد التجهيز' : 
                             item.orders?.status === 'shipped' ? 'في الطريق' : 'تم التوصيل'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          </>
        )}

        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-gray-900">منتجاتي</h3>
              <button 
                onClick={() => { setEditingProduct(null); setShowProductModal(true); }}
                className="bg-emerald-600 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-2"
              >
                <Plus size={16} />
                إضافة
              </button>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {products.map((product) => (
                <div key={product.id} className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gray-100">
                    <img src={product.image_url} alt={product.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-black text-gray-900">{product.title}</h4>
                    <p className="text-xs text-emerald-600 font-bold">{product.price} ر.س</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => { setEditingProduct(product); setShowProductModal(true); }}
                      className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors"
                    >
                      <Edit size={18} />
                    </button>
                    <button 
                      onClick={() => handleDeleteProduct(product.id)}
                      className="w-10 h-10 bg-red-50 text-red-500 rounded-xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="space-y-6">
            <h3 className="text-lg font-black text-gray-900">إدارة الطلبات</h3>
            <div className="space-y-4">
              {stats.recentOrders.map((item, i) => (
                <div key={i} className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                        <Package size={20} />
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-gray-900">{item.products?.title}</h4>
                        <p className="text-[10px] text-gray-400">#{item.orders?.id.slice(0, 8)}</p>
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold px-3 py-1 rounded-full ${
                      item.orders?.status === 'delivered' ? 'bg-emerald-50 text-emerald-600' : 
                      item.orders?.status === 'pending' ? 'bg-yellow-50 text-yellow-600' : 'bg-blue-50 text-blue-600'
                    }`}>
                      {item.orders?.status === 'pending' ? 'قيد الانتظار' : 
                       item.orders?.status === 'processing' ? 'قيد التجهيز' : 
                       item.orders?.status === 'shipped' ? 'في الطريق' : 'تم التوصيل'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-dashed border-gray-200">
                    <span className="text-emerald-600 font-black text-sm">{item.unit_price * item.quantity} ر.س</span>
                    <select 
                      value={item.orders?.status}
                      onChange={async (e) => {
                        const { error } = await supabase.from('orders').update({ status: e.target.value }).eq('id', item.orders.id);
                        if (!error) {
                          toast.success('تم تحديث الحالة');
                          window.location.reload();
                        }
                      }}
                      className="text-[10px] font-bold bg-gray-50 border-none rounded-lg py-1 px-2"
                    >
                      <option value="pending">قيد الانتظار</option>
                      <option value="processing">قيد التجهيز</option>
                      <option value="shipped">في الطريق</option>
                      <option value="delivered">تم التوصيل</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Product Modal */}
      <AnimatePresence>
        {showProductModal && (
          <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowProductModal(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="relative w-full max-w-lg bg-white rounded-t-[40px] sm:rounded-[40px] p-8 shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black text-gray-900">
                  {editingProduct ? 'تعديل المنتج' : 'إضافة منتج جديد'}
                </h2>
                <button onClick={() => setShowProductModal(false)} className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">عنوان المنتج</label>
                  <input 
                    name="title"
                    defaultValue={editingProduct?.title}
                    required
                    className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm focus:ring-2 focus:ring-emerald-500/20"
                    placeholder="مثال: عطر العود الملكي"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">السعر (ر.س)</label>
                    <input 
                      name="price"
                      type="number"
                      step="0.01"
                      defaultValue={editingProduct?.price}
                      required
                      className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">الكمية</label>
                    <input 
                      name="stock"
                      type="number"
                      defaultValue={editingProduct?.stock_quantity}
                      required
                      className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">الفئة</label>
                  <select 
                    name="category_id"
                    defaultValue={editingProduct?.category_id}
                    required
                    className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm focus:ring-2 focus:ring-emerald-500/20"
                  >
                    <option value="">اختر الفئة</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">صورة المنتج</label>
                  <div className="flex flex-col items-center gap-4">
                    {(previewUrl || editingProduct?.image_url) && (
                      <div className="w-full h-48 rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 relative group">
                        <img 
                          src={previewUrl || editingProduct?.image_url} 
                          alt="Preview" 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                           <button 
                             type="button"
                             onClick={() => { setSelectedFile(null); setPreviewUrl(null); }}
                             className="bg-white/20 backdrop-blur-md text-white p-2 rounded-full hover:bg-white/40"
                           >
                             <X size={20} />
                           </button>
                        </div>
                      </div>
                    )}
                    <label className="w-full cursor-pointer">
                      <div className="w-full border-2 border-dashed border-gray-200 rounded-2xl py-8 flex flex-col items-center justify-center gap-2 hover:border-emerald-500/50 hover:bg-emerald-50/50 transition-all">
                        <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center">
                          <Upload size={24} />
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-bold text-gray-700">اضغط لرفع صورة</p>
                          <p className="text-[10px] text-gray-400">PNG, JPG حتى 5MB</p>
                        </div>
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </div>
                    </label>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">الوصف</label>
                  <textarea 
                    name="description"
                    defaultValue={editingProduct?.description}
                    rows={3}
                    className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm focus:ring-2 focus:ring-emerald-500/20"
                    placeholder="وصف تفصيلي للمنتج..."
                  />
                </div>

                <button 
                  type="submit"
                  disabled={uploading}
                  className="w-full bg-emerald-600 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                  {editingProduct ? 'حفظ التعديلات' : 'إضافة المنتج'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Merchant Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-3 flex justify-between items-center z-50">
        <button 
          onClick={() => setActiveTab('overview')}
          className={`flex flex-col items-center gap-1 ${activeTab === 'overview' ? 'text-emerald-600' : 'text-gray-400'}`}
        >
          <TrendingUp size={24} />
          <span className="text-[10px] font-bold">الرئيسية</span>
        </button>
        <button 
          onClick={() => setActiveTab('orders')}
          className={`flex flex-col items-center gap-1 ${activeTab === 'orders' ? 'text-emerald-600' : 'text-gray-400'}`}
        >
          <ShoppingCart size={24} />
          <span className="text-[10px] font-bold">الطلبات</span>
        </button>
        <div className="relative -top-8">
          <button 
            onClick={() => { setEditingProduct(null); setShowProductModal(true); }}
            className="w-16 h-16 bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-xl shadow-emerald-600/40 border-4 border-white"
          >
            <Plus size={32} />
          </button>
        </div>
        <button 
          onClick={() => setActiveTab('products')}
          className={`flex flex-col items-center gap-1 ${activeTab === 'products' ? 'text-emerald-600' : 'text-gray-400'}`}
        >
          <Package size={24} />
          <span className="text-[10px] font-bold">المنتجات</span>
        </button>
        <div className="flex flex-col items-center gap-1 text-gray-400">
          <User size={24} />
          <span className="text-[10px] font-bold">الحساب</span>
        </div>
      </nav>
    </div>
  );
}
