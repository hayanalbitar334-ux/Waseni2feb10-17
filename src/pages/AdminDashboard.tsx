import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bell, Search, Menu, CheckCircle2, Users, ShoppingBag, 
  DollarSign, Clock, AlertCircle, Trash2, Edit, Check, X, 
  LayoutDashboard, Store, Package, ShoppingCart, Loader2,
  Plus, XCircle, Save, Upload, Image as ImageIcon
} from 'lucide-react';
import { BarChart, Bar, XAxis, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';

type Tab = 'overview' | 'vendors' | 'products' | 'orders' | 'users' | 'home';

export default function AdminDashboard() {
  const navigate = useNavigate();
  // ... existing state ...

  const handleSaveHomeConfig = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUploading(true);
    const formData = new FormData(e.currentTarget);
    
    let bannerUrl = homeConfig?.banner_image_url;

    if (selectedFile) {
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `banner-${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('products') // Using products bucket for now as it's public
        .upload(filePath, selectedFile);

      if (uploadError) {
        toast.error('فشل رفع الصورة: ' + uploadError.message);
        setUploading(false);
        return;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('products')
        .getPublicUrl(filePath);
      
      bannerUrl = publicUrl;
    }

    const updates = {
      banner_image_url: bannerUrl,
      banner_position: parseInt(formData.get('banner_position') as string),
      categories_position: parseInt(formData.get('categories_position') as string),
      categories_layout: formData.get('categories_layout'),
      news_ticker_text: formData.get('news_ticker_text'),
      news_ticker_enabled: formData.get('news_ticker_enabled') === 'on'
    };

    const { error } = await supabase
      .from('home_config')
      .upsert({ id: homeConfig?.id, ...updates });

    if (error) {
      toast.error('فشل تحديث الإعدادات');
    } else {
      toast.success('تم تحديث إعدادات الصفحة الرئيسية');
      setSelectedFile(null);
      setPreviewUrl(null);
      fetchData();
    }
    setUploading(false);
  };

  const handleSaveCategory = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const icon = formData.get('icon') as string;

    // Use upsert or insert, but check if we are handling errors correctly
    const { error } = await supabase.from('categories').insert({ name, icon });

    if (error) {
      console.error('Add category error:', error);
      toast.error(`فشل إضافة التصنيف: ${error.message}`);
    } else {
      toast.success('تم إضافة التصنيف بنجاح');
      setShowCategoryModal(false);
      fetchData();
    }
  };

  // ... existing functions ...

  const renderHomeConfig = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-[40px] p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-black text-gray-900 mb-6">إعدادات الصفحة الرئيسية</h3>
        <form onSubmit={handleSaveHomeConfig} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">صورة البانر</label>
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden relative">
                {previewUrl || homeConfig?.banner_image_url ? (
                  <img 
                    src={previewUrl || homeConfig?.banner_image_url} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <ImageIcon className="text-gray-300" />
                )}
                <input 
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 mb-2">اضغط على المربع لرفع صورة جديدة</p>
                {uploading && <p className="text-xs text-emerald-600 font-bold">جاري الرفع...</p>}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">موقع البانر (الترتيب)</label>
              <input 
                name="banner_position"
                type="number"
                defaultValue={homeConfig?.banner_position || 2}
                className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">موقع التصنيفات (الترتيب)</label>
              <input 
                name="categories_position"
                type="number"
                defaultValue={homeConfig?.categories_position || 1}
                className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">شكل عرض التصنيفات</label>
            <select 
              name="categories_layout"
              defaultValue={homeConfig?.categories_layout || 'slider'}
              className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm focus:ring-2 focus:ring-emerald-500/20"
            >
              <option value="slider">شريط تمرير (Slider)</option>
              <option value="grid">شبكة (Grid)</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">نص شريط الأخبار</label>
            <input 
              name="news_ticker_text"
              defaultValue={homeConfig?.news_ticker_text}
              className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm focus:ring-2 focus:ring-emerald-500/20"
              placeholder="توصيل مجاني للطلبات..."
            />
          </div>

          <div className="flex items-center gap-2">
            <input 
              type="checkbox"
              name="news_ticker_enabled"
              defaultChecked={homeConfig?.news_ticker_enabled}
              id="ticker_enabled"
              className="w-5 h-5 rounded text-emerald-600 focus:ring-emerald-500"
            />
            <label htmlFor="ticker_enabled" className="text-sm font-bold text-gray-700">تفعيل شريط الأخبار</label>
          </div>

          <button 
            type="submit"
            className="w-full bg-emerald-600 text-white font-black py-4 rounded-2xl shadow-lg shadow-emerald-600/20"
          >
            حفظ التغييرات
          </button>
        </form>
      </div>

      <div className="bg-white rounded-[40px] p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-black text-gray-900">إدارة التصنيفات</h3>
          <button 
            onClick={() => setShowCategoryModal(true)}
            className="bg-emerald-600 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-2"
          >
            <Plus size={16} />
            إضافة تصنيف
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {data.categories.map((cat) => (
            <div key={cat.id} className="bg-gray-50 p-4 rounded-3xl flex flex-col items-center gap-2 border border-gray-100 relative group">
              <div className={`w-12 h-12 ${cat.color || 'bg-emerald-50'} rounded-2xl flex items-center justify-center text-2xl`}>
                {cat.icon || '📦'}
              </div>
              <span className="text-sm font-bold text-gray-900">{cat.name}</span>
              <button 
                onClick={() => handleDelete('categories', cat.id)}
                className="absolute top-2 right-2 w-6 h-6 bg-red-50 text-red-500 rounded-full flex items-center justify-center transition-colors hover:bg-red-500 hover:text-white"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showStoreModal, setShowStoreModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [productFilter, setProductFilter] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [homeConfig, setHomeConfig] = useState<any>(null);
  const [data, setData] = useState<{
    stores: any[];
    products: any[];
    orders: any[];
    profiles: any[];
    categories: any[];
  }>({
    stores: [],
    products: [],
    orders: [],
    profiles: [],
    categories: []
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [storesRes, productsRes, ordersRes, profilesRes, categoriesRes, homeConfigRes] = await Promise.all([
        supabase.from('stores').select('*, profiles(full_name, email)').order('created_at', { ascending: false }),
        supabase.from('products').select('*, stores(store_name)').order('created_at', { ascending: false }),
        supabase.from('orders').select('*, profiles(full_name)').order('created_at', { ascending: false }),
        supabase.from('profiles').select('*').order('created_at', { ascending: false }),
        supabase.from('categories').select('*'),
        supabase.from('home_config').select('*').single()
      ]);

      setData({
        stores: storesRes.data || [],
        products: productsRes.data || [],
        orders: ordersRes.data || [],
        profiles: profilesRes.data || [],
        categories: categoriesRes.data || []
      });
      setHomeConfig(homeConfigRes.data || {});
    } catch (error) {
      toast.error('حدث خطأ أثناء جلب البيانات');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateUserRole = async (id: string, role: string) => {
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    
    if (currentUser?.id === id) {
      toast.error('لا يمكنك تغيير رتبة نفسك من هنا');
      return;
    }

    // تحديث متفائل: تحديث الواجهة فوراً
    const previousProfiles = [...data.profiles];
    const updatedProfiles = data.profiles.map(p => 
      p.id === id ? { ...p, role } : p
    );
    
    setData(prev => ({ ...prev, profiles: updatedProfiles }));

    // استدعاء الدالة الآمنة من قاعدة البيانات
    const { error } = await supabase.rpc('update_user_role', {
      target_user_id: id,
      new_role: role
    });
    
    if (error) {
      console.error('Update role error:', error);
      // تراجع عن التغيير في حال حدوث خطأ
      setData(prev => ({ ...prev, profiles: previousProfiles }));
      
      if (error.message.includes('Could not find the function')) {
         toast.error('يرجى تشغيل كود SQL الجديد لإنشاء دالة update_user_role في Supabase');
      } else {
         toast.error(`فشل التحديث: ${error.message}`);
      }
    } else {
      toast.success('تم تحديث دور المستخدم بنجاح');
    }
  };

  const handleApproveStore = async (id: string, approved: boolean) => {
    const { error } = await supabase.from('stores').update({ is_approved: approved }).eq('id', id);
    if (error) toast.error('فشل التحديث');
    else {
      toast.success(approved ? 'تم اعتماد المتجر' : 'تم إلغاء اعتماد المتجر');
      fetchData();
    }
  };

  const handleDelete = async (table: string, id: string) => {
    if (!confirm('هل أنت متأكد من الحذف؟')) return;
    
    const { error } = await supabase.from(table).delete().eq('id', id);
    
    if (error) {
      console.error(`Delete error on ${table}:`, error);
      toast.error(`فشل الحذف: ${error.message}`);
    } else {
      toast.success('تم الحذف بنجاح');
      fetchData();
    }
  };

  const handleUpdateOrderStatus = async (id: string, status: string) => {
    const { error } = await supabase.from('orders').update({ status }).eq('id', id);
    if (error) toast.error('فشل تحديث الحالة');
    else {
      toast.success('تم تحديث حالة الطلب');
      fetchData();
    }
  };

  const handleSaveStore = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const store_name = formData.get('store_name') as string;
    const owner_id = formData.get('owner_id') as string;

    // استدعاء الدالة الآمنة من قاعدة البيانات لإنشاء المتجر كمسؤول
    const { error } = await supabase.rpc('create_store_as_admin', {
      p_store_name: store_name,
      p_owner_id: owner_id
    });

    if (error) {
      console.error('Create store error:', error);
      if (error.message.includes('Could not find the function')) {
         toast.error('يرجى تشغيل كود SQL الجديد لإنشاء دالة create_store_as_admin في Supabase');
      } else {
         toast.error(`فشل إنشاء المتجر: ${error.message}`);
      }
    } else {
      toast.success('تم إنشاء المتجر بنجاح');
      setShowStoreModal(false);
      fetchData();
    }
  };

  const handleSaveProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUploading(true);
    const formData = new FormData(e.currentTarget);
    
    let imageUrl = editingProduct?.image_url;

    if (selectedFile) {
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError, data: uploadData } = await supabase.storage
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
      description: formData.get('description') || '',
      image_url: imageUrl,
      category_id: formData.get('category_id') || null,
      store_id: formData.get('store_id')
    };

    let error;
    let data;
    if (editingProduct) {
      const { data: updatedData, error: err } = await supabase.from('products').update(productData).eq('id', editingProduct.id).select();
      error = err;
      data = updatedData;
    } else {
      // استدعاء الدالة الآمنة من قاعدة البيانات لإضافة المنتج كمسؤول
      const { error: err } = await supabase.rpc('create_product_as_admin', {
        p_title: productData.title,
        p_description: productData.description,
        p_price: productData.price,
        p_stock_quantity: productData.stock_quantity,
        p_image_url: productData.image_url,
        p_category_id: productData.category_id,
        p_store_id: productData.store_id
      });
      error = err;
      data = [{}]; // Dummy data to pass the check
    }

    if (error) {
      console.error('Save product error:', error);
      if (error.message.includes('Could not find the function')) {
         toast.error('يرجى تشغيل كود SQL الجديد لإنشاء دالة create_product_as_admin في Supabase');
      } else {
         toast.error(`فشل حفظ المنتج: ${error.message}`);
      }
    } else if (editingProduct && (!data || data.length === 0)) {
      toast.error('لم يتم التحديث: يبدو أنك لا تملك الصلاحية. يرجى تشغيل كود SQL الخاص بالصلاحيات.');
    } else {
      toast.success(editingProduct ? 'تم تحديث المنتج' : 'تم إضافة المنتج');
      setShowProductModal(false);
      setEditingProduct(null);
      setSelectedFile(null);
      setPreviewUrl(null);
      fetchData();
    }
    setUploading(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const barData = [
    { name: 'السبت', value: 400 },
    { name: 'الأحد', value: 500 },
    { name: 'الاثنين', value: 300 },
    { name: 'الثلاثاء', value: 450 },
    { name: 'الأربعاء', value: 350 },
    { name: 'الخميس', value: 420 },
    { name: 'الجمعة', value: 250 },
  ];

  const pieData = [
    { name: 'خدمات التوصيل', value: 50, color: '#10b981' },
    { name: 'هدايا ومنتجات', value: 25, color: '#3b82f6' },
    { name: 'خدمات متنوعة', value: 25, color: '#f59e0b' },
  ];

  const stats = [
    { label: 'إجمالي المستخدمين', value: data.profiles.length.toLocaleString(), change: '+12.5%', icon: Users, color: 'bg-emerald-50 text-emerald-600' },
    { label: 'إجمالي البائعين', value: data.stores.length.toLocaleString(), change: '+8.3%', icon: ShoppingBag, color: 'bg-blue-50 text-blue-600' },
    { label: 'إجمالي المنتجات', value: data.products.length.toLocaleString(), change: '+5.4%', icon: Package, color: 'bg-orange-50 text-orange-600' },
    { label: 'طلبات معلقة', value: data.orders.filter(o => o.status === 'pending').length.toLocaleString(), status: 'عاجل', icon: Clock, color: 'bg-red-50 text-red-600' },
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Alert */}
      {data.stores.filter(s => !s.is_approved).length > 0 && (
        <div className="bg-emerald-50 rounded-3xl p-4 flex items-center justify-between border border-emerald-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <h3 className="text-sm font-black text-emerald-900">تنبيه النظام</h3>
              <p className="text-[10px] text-emerald-700/70">هناك {data.stores.filter(s => !s.is_approved).length} بائعين جدد في انتظار المراجعة</p>
            </div>
          </div>
          <button 
            onClick={() => setActiveTab('vendors')}
            className="bg-emerald-600 text-white text-[10px] font-bold px-4 py-2 rounded-xl"
          >
            مراجعة الآن
          </button>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                {stat.change && <span className="text-[10px] font-bold text-emerald-600">{stat.change} ↗</span>}
                {stat.status && <span className="text-[10px] font-bold text-red-600 flex items-center gap-1"><AlertCircle size={10} /> {stat.status}</span>}
              </div>
              <p className="text-xs text-gray-400 mb-1">{stat.label}</p>
              <h3 className="text-2xl font-black text-gray-900">{stat.value}</h3>
            </div>
            <div className={`w-14 h-14 ${stat.color} rounded-2xl flex items-center justify-center`}>
              <stat.icon size={28} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Growth Chart */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-black text-gray-900">نمو المستخدمين</h3>
            <select className="bg-gray-50 border-none text-[10px] font-bold rounded-lg py-1 pr-2 pl-6">
              <option>آخر 30 يوم</option>
            </select>
          </div>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <Bar dataKey="value" fill="#d1fae5" radius={[4, 4, 0, 0]} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sales Chart */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-black text-gray-900 mb-6">مبيعات الفئات</h3>
          <div className="flex flex-col items-center">
            <div className="h-48 w-48 relative mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-gray-900">100%</span>
                <span className="text-[10px] text-gray-400">الإجمالي</span>
              </div>
            </div>
            <div className="w-full space-y-3">
              {pieData.map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-xs text-gray-600">{item.name}</span>
                  </div>
                  <span className="text-xs font-bold text-gray-900">%{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderVendors = () => (
    <div className="bg-white rounded-[40px] p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-black text-gray-900">إدارة البائعين</h3>
        <button 
          onClick={() => setShowStoreModal(true)}
          className="bg-emerald-600 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-2"
        >
          <Plus size={16} />
          إنشاء متجر
        </button>
      </div>
      <div className="space-y-4">
        {data.stores.map((store) => (
          <div key={store.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-3xl border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600">
                <Store size={24} />
              </div>
              <div>
                <h4 className="text-sm font-black text-gray-900">{store.store_name}</h4>
                <p className="text-[10px] text-gray-400">{store.profiles?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => {
                  setProductFilter(store.id);
                  setActiveTab('products');
                }}
                className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-3 py-2 rounded-xl hover:bg-emerald-600 hover:text-white transition-all"
              >
                عرض المنتجات
              </button>
              {!store.is_approved ? (
                <button 
                  onClick={() => handleApproveStore(store.id, true)}
                  className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-colors"
                  title="اعتماد"
                >
                  <Check size={20} />
                </button>
              ) : (
                <button 
                  onClick={() => handleApproveStore(store.id, false)}
                  className="w-10 h-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center hover:bg-orange-600 hover:text-white transition-colors"
                  title="إلغاء اعتماد"
                >
                  <X size={20} />
                </button>
              )}
              <button 
                onClick={() => handleDelete('stores', store.id)}
                className="w-10 h-10 bg-red-50 text-red-500 rounded-xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"
                title="حذف"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderProducts = () => {
    const filteredProducts = productFilter 
      ? data.products.filter(p => p.store_id === productFilter)
      : data.products;

    return (
      <div className="bg-white rounded-[40px] p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-black text-gray-900">إدارة المنتجات</h3>
            {productFilter && (
              <button 
                onClick={() => setProductFilter(null)}
                className="text-[10px] font-bold text-gray-400 hover:text-red-500 flex items-center gap-1"
              >
                <X size={12} />
                إلغاء الفلترة
              </button>
            )}
          </div>
          <button 
            onClick={() => { setEditingProduct(null); setShowProductModal(true); }}
            className="bg-emerald-600 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-2"
          >
            <Plus size={16} />
            إضافة منتج
          </button>
        </div>
        <div className="space-y-4">
          {filteredProducts.map((product) => (
            <div key={product.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-3xl border border-gray-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl overflow-hidden bg-gray-200">
                  <img src={product.image_url} alt={product.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-gray-900 truncate max-w-[150px]">{product.title}</h4>
                  <p className="text-[10px] text-emerald-600 font-bold">{product.stores?.store_name}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-gray-900 ml-2">{product.price} ل.س</span>
                <button 
                  onClick={() => { setEditingProduct(product); setShowProductModal(true); }}
                  className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors"
                  title="تعديل"
                >
                  <Edit size={18} />
                </button>
                <button 
                  onClick={() => handleDelete('products', product.id)}
                  className="w-10 h-10 bg-red-50 text-red-500 rounded-xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"
                  title="حذف"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderOrders = () => (
    <div className="bg-white rounded-[40px] p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-black text-gray-900 mb-6">إدارة الطلبات</h3>
      <div className="space-y-4">
        {data.orders.map((order) => (
          <div key={order.id} className="p-4 bg-gray-50 rounded-3xl border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="text-sm font-black text-gray-900">طلب #{order.id.slice(0, 8)}</h4>
                <p className="text-[10px] text-gray-400">العميل: {order.profiles?.full_name}</p>
              </div>
              <span className={`text-[10px] font-bold px-3 py-1 rounded-full ${
                order.status === 'delivered' ? 'bg-emerald-50 text-emerald-600' : 
                order.status === 'pending' ? 'bg-yellow-50 text-yellow-600' : 'bg-blue-50 text-blue-600'
              }`}>
                {order.status === 'pending' ? 'قيد الانتظار' : 
                 order.status === 'processing' ? 'قيد التجهيز' : 
                 order.status === 'shipped' ? 'في الطريق' : 'تم التوصيل'}
              </span>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-dashed border-gray-200">
              <span className="text-sm font-black text-emerald-600">{order.total_amount} ل.س</span>
              <div className="flex gap-2">
                <select 
                  value={order.status}
                  onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                  className="text-[10px] font-bold bg-white border border-gray-200 rounded-lg py-1 px-2"
                >
                  <option value="pending">قيد الانتظار</option>
                  <option value="processing">قيد التجهيز</option>
                  <option value="shipped">في الطريق</option>
                  <option value="delivered">تم التوصيل</option>
                </select>
                <button 
                  onClick={() => handleDelete('orders', order.id)}
                  className="w-8 h-8 bg-red-50 text-red-500 rounded-lg flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="bg-white rounded-[40px] p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-black text-gray-900">إدارة المستخدمين</h3>
        <button 
          onClick={fetchData}
          className="p-2 bg-gray-50 rounded-xl text-emerald-600 hover:bg-emerald-50 transition-colors"
          title="تحديث البيانات"
        >
          <Loader2 size={20} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>
      
      <div className="space-y-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <Loader2 size={40} className="animate-spin mb-4 text-emerald-600" />
            <p className="text-sm font-bold">جاري تحميل المستخدمين...</p>
          </div>
        ) : data.profiles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
            <Users size={40} className="mb-4 opacity-20" />
            <p className="text-sm font-bold">لا يوجد مستخدمون مسجلون حالياً</p>
            <button 
              onClick={fetchData}
              className="mt-4 text-xs font-bold text-emerald-600 underline"
            >
              حاول التحديث مرة أخرى
            </button>
          </div>
        ) : (
          data.profiles.map((profile) => (
            <div key={profile.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-3xl border border-gray-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600">
                  <Users size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-black text-gray-900 truncate">{profile.full_name || 'مستخدم جديد'}</h4>
                  <p className="text-[10px] text-gray-400 truncate">{profile.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <select 
                  value={profile.role}
                  onChange={(e) => handleUpdateUserRole(profile.id, e.target.value)}
                  className="text-[10px] font-bold bg-white border border-gray-200 rounded-lg py-1 px-2"
                >
                  <option value="buyer">مشتري</option>
                  <option value="seller">بائع</option>
                  <option value="admin">مسؤول</option>
                </select>
                <button 
                  onClick={() => handleDelete('profiles', profile.id)}
                  className="w-10 h-10 bg-red-50 text-red-500 rounded-xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen pb-32">
      {/* Sidebar/Nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-4 flex justify-between items-center z-50 md:top-0 md:bottom-auto md:flex-col md:w-20 md:h-screen md:border-t-0 md:border-l">
        <button 
          onClick={() => setActiveTab('overview')}
          className={`flex flex-col items-center gap-1 ${activeTab === 'overview' ? 'text-emerald-600' : 'text-gray-400'}`}
        >
          <LayoutDashboard size={24} />
          <span className="text-[10px] font-bold">الرئيسية</span>
        </button>
        <button 
          onClick={() => setActiveTab('vendors')}
          className={`flex flex-col items-center gap-1 ${activeTab === 'vendors' ? 'text-emerald-600' : 'text-gray-400'}`}
        >
          <Store size={24} />
          <span className="text-[10px] font-bold">البائعين</span>
        </button>
        <button 
          onClick={() => setActiveTab('products')}
          className={`flex flex-col items-center gap-1 ${activeTab === 'products' ? 'text-emerald-600' : 'text-gray-400'}`}
        >
          <Package size={24} />
          <span className="text-[10px] font-bold">المنتجات</span>
        </button>
        <button 
          onClick={() => setActiveTab('orders')}
          className={`flex flex-col items-center gap-1 ${activeTab === 'orders' ? 'text-emerald-600' : 'text-gray-400'}`}
        >
          <ShoppingCart size={24} />
          <span className="text-[10px] font-bold">الطلبات</span>
        </button>
        <button 
          onClick={() => setActiveTab('users')}
          className={`flex flex-col items-center gap-1 ${activeTab === 'users' ? 'text-emerald-600' : 'text-gray-400'}`}
        >
          <Users size={24} />
          <span className="text-[10px] font-bold">المستخدمين</span>
        </button>
        <button 
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center gap-1 ${activeTab === 'home' ? 'text-emerald-600' : 'text-gray-400'}`}
        >
          <LayoutDashboard size={24} />
          <span className="text-[10px] font-bold">الواجهة</span>
        </button>
      </div>

      <div className="md:mr-20">
        {/* Header */}
        <header className="bg-white px-6 py-6 flex items-center justify-between sticky top-0 z-40 shadow-sm">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-black text-gray-900">
              {activeTab === 'overview' && 'لوحة التحكم'}
              {activeTab === 'vendors' && 'إدارة البائعين'}
              {activeTab === 'products' && 'إدارة المنتجات'}
              {activeTab === 'orders' && 'إدارة الطلبات'}
              {activeTab === 'users' && 'إدارة المستخدمين'}
              {activeTab === 'home' && 'إعدادات الواجهة'}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => navigate('/')}
              className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-xs font-bold hover:bg-emerald-600 hover:text-white transition-colors"
            >
              العودة للمتجر
            </button>
            <button 
              onClick={fetchData}
              className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center"
            >
              {loading ? <Loader2 size={20} className="animate-spin" /> : <Bell size={20} />}
            </button>
          </div>
        </header>

        <div className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'overview' && renderOverview()}
              {activeTab === 'vendors' && renderVendors()}
              {activeTab === 'products' && renderProducts()}
              {activeTab === 'orders' && renderOrders()}
              {activeTab === 'users' && renderUsers()}
              {activeTab === 'home' && renderHomeConfig()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Category Modal */}
      <AnimatePresence>
        {showCategoryModal && (
          <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCategoryModal(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="relative w-full max-w-lg bg-white rounded-t-[40px] sm:rounded-[40px] p-8 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black text-gray-900">إضافة تصنيف جديد</h2>
                <button onClick={() => setShowCategoryModal(false)} className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSaveCategory} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">اسم التصنيف</label>
                  <input 
                    name="name"
                    required
                    className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm focus:ring-2 focus:ring-emerald-500/20"
                    placeholder="مثال: إلكترونيات"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">الأيقونة (Emoji)</label>
                  <input 
                    name="icon"
                    required
                    className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm focus:ring-2 focus:ring-emerald-500/20"
                    placeholder="مثال: 📱"
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full bg-emerald-600 text-white font-black py-4 rounded-2xl shadow-lg shadow-emerald-600/20"
                >
                  إضافة التصنيف
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
                    <label className="text-sm font-bold text-gray-700">السعر (ل.س)</label>
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
                  <label className="text-sm font-bold text-gray-700">المتجر</label>
                  <select 
                    name="store_id"
                    defaultValue={editingProduct?.store_id}
                    required
                    className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm focus:ring-2 focus:ring-emerald-500/20"
                  >
                    <option value="">اختر المتجر</option>
                    {data.stores.map(s => (
                      <option key={s.id} value={s.id}>{s.store_name}</option>
                    ))}
                  </select>
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
                    {data.categories.map(c => (
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

      {/* Store Modal */}
      <AnimatePresence>
        {showStoreModal && (
          <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowStoreModal(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="relative w-full max-w-lg bg-white rounded-t-[40px] sm:rounded-[40px] p-8 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black text-gray-900">إنشاء متجر جديد</h2>
                <button onClick={() => setShowStoreModal(false)} className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSaveStore} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">اسم المتجر</label>
                  <input 
                    name="store_name"
                    required
                    className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm focus:ring-2 focus:ring-emerald-500/20"
                    placeholder="مثال: متجر العود الفاخر"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">المالك (المستخدم)</label>
                  <select 
                    name="owner_id"
                    required
                    className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm focus:ring-2 focus:ring-emerald-500/20"
                  >
                    <option value="">اختر المستخدم</option>
                    {data.profiles.filter(p => p.role === 'seller').map(p => (
                      <option key={p.id} value={p.id}>{p.full_name || p.email}</option>
                    ))}
                  </select>
                  <p className="text-[10px] text-gray-400 mt-1">يظهر هنا المستخدمون الذين لديهم دور "بائع" فقط</p>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-emerald-600 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20"
                >
                  <Save size={20} />
                  إنشاء المتجر
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
