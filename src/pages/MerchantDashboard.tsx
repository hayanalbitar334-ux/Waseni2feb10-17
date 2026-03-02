import { Bell, User, Plus, Package, ShoppingCart, TrendingUp, ChevronLeft, CheckCircle2, Truck, Clock } from 'lucide-react';
import { BarChart, Bar, XAxis, ResponsiveContainer, Cell } from 'recharts';

export default function MerchantDashboard() {
  const barData = [
    { name: '١٥ مايو', value: 300 },
    { name: '٢٠ مايو', value: 250 },
    { name: '٢٥ مايو', value: 350 },
    { name: '٣٠ مايو', value: 500 },
    { name: '٥ يونيو', value: 400 },
    { name: '١٠ يونيو', value: 320 },
    { name: '١٥ يونيو', value: 200 },
  ];

  const stats = [
    { label: 'إجمالي المبيعات', value: '٤٥,٠٠٠ ر.س', change: '+١٢%', icon: TrendingUp, color: 'bg-emerald-50 text-emerald-600' },
    { label: 'الطلبات النشطة', value: '١٢', icon: ShoppingCart, color: 'bg-blue-50 text-blue-600' },
    { label: 'إجمالي المنتجات', value: '١٥٨', icon: Package, color: 'bg-orange-50 text-orange-600' },
  ];

  const recentOrders = [
    { id: 'W-9842', customer: 'أحمد محمد', price: 240, status: 'قيد التجهيز', time: 'منذ ساعة', icon: Package, statusColor: 'bg-yellow-50 text-yellow-600' },
    { id: 'W-9840', customer: 'سارة خالد', price: 1120, status: 'في الطريق', time: 'منذ ٤ ساعات', icon: Truck, statusColor: 'bg-blue-50 text-blue-600' },
    { id: 'W-9835', customer: 'فهد العتيبي', price: 560, status: 'تم التوصيل', time: 'أمس', icon: CheckCircle2, statusColor: 'bg-emerald-50 text-emerald-600' },
  ];

  return (
    <div className="bg-gray-50 min-h-screen pb-24">
      {/* Header */}
      <header className="bg-white px-6 py-6 flex items-center justify-between sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-emerald-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-600/20">
            <ShoppingCart size={24} />
          </div>
          <div>
            <h1 className="text-lg font-black text-gray-900">متجر وصيني الرئيسي</h1>
            <p className="text-[10px] text-emerald-600 font-bold">بائع معتمد • الرياض</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center relative">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
          </button>
          <div className="w-10 h-10 rounded-full bg-emerald-100 overflow-hidden border-2 border-white shadow-sm">
             <img src="https://picsum.photos/seed/merchant-user/100/100" alt="Profile" referrerPolicy="no-referrer" />
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6">
        {/* Sales Stats */}
        <div className="bg-white rounded-[40px] p-6 shadow-sm border border-gray-100">
           <div className="flex items-center justify-between mb-2">
             <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">+١٢%</span>
             <span className="text-sm text-gray-400">إجمالي المبيعات</span>
           </div>
           <h2 className="text-3xl font-black text-gray-900 text-center mb-6">٤٥,٠٠٠ ر.س</h2>
           <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-3xl p-4 flex flex-col items-center">
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-2">
                  <ShoppingCart size={20} />
                </div>
                <span className="text-[10px] text-gray-400 mb-1">الطلبات النشطة</span>
                <span className="text-xl font-black text-gray-900">١٢</span>
              </div>
              <div className="bg-gray-50 rounded-3xl p-4 flex flex-col items-center">
                <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center mb-2">
                  <Package size={20} />
                </div>
                <span className="text-[10px] text-gray-400 mb-1">إجمالي المنتجات</span>
                <span className="text-xl font-black text-gray-900">١٥٨</span>
              </div>
           </div>
        </div>

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
        <button className="w-full bg-emerald-600 text-white font-black py-4 rounded-3xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20">
          <Plus size={24} />
          إضافة منتج جديد
        </button>

        {/* Recent Orders */}
        <section>
          <div className="flex items-center justify-between mb-4 px-2">
            <h3 className="text-lg font-black text-gray-900">الطلبات الأخيرة</h3>
            <button className="text-emerald-600 text-xs font-bold">عرض الكل</button>
          </div>
          <div className="space-y-4">
            {recentOrders.map((order, i) => (
              <div key={i} className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 flex items-center gap-4">
                <div className={`w-14 h-14 ${order.statusColor.split(' ')[0]} rounded-2xl flex items-center justify-center`}>
                  <order.icon size={28} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-black text-gray-900">طلب #{order.id}</h4>
                    <span className="text-[10px] text-gray-400">{order.time}</span>
                  </div>
                  <p className="text-[10px] text-gray-400 mb-2">العميل: {order.customer}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-emerald-600 font-black text-sm">{order.price} ر.س</span>
                    <span className={`text-[10px] font-bold px-3 py-1 rounded-full ${order.statusColor}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Merchant Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-3 flex justify-between items-center z-50">
        <div className="flex flex-col items-center gap-1 text-emerald-600">
          <TrendingUp size={24} />
          <span className="text-[10px] font-bold">الرئيسية</span>
        </div>
        <div className="flex flex-col items-center gap-1 text-gray-400">
          <ShoppingCart size={24} />
          <span className="text-[10px] font-bold">الطلبات</span>
        </div>
        <div className="relative -top-8">
          <button className="w-16 h-16 bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-xl shadow-emerald-600/40 border-4 border-white">
            <Plus size={32} />
          </button>
        </div>
        <div className="flex flex-col items-center gap-1 text-gray-400">
          <Package size={24} />
          <span className="text-[10px] font-bold">المنتجات</span>
        </div>
        <div className="flex flex-col items-center gap-1 text-gray-400">
          <User size={24} />
          <span className="text-[10px] font-bold">الحساب</span>
        </div>
      </nav>
    </div>
  );
}
