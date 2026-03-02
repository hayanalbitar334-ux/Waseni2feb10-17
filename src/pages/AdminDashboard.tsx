import { Bell, Search, Menu, CheckCircle2, Users, ShoppingBag, DollarSign, Clock, AlertCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function AdminDashboard() {
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
    { label: 'إجمالي المستخدمين', value: '12,450', change: '+12.5%', icon: Users, color: 'bg-emerald-50 text-emerald-600' },
    { label: 'إجمالي البائعين', value: '850', change: '+8.3%', icon: ShoppingBag, color: 'bg-blue-50 text-blue-600' },
    { label: 'إجمالي الإيرادات', value: '45,000 ر.س', change: '+5.4%', icon: DollarSign, color: 'bg-orange-50 text-orange-600' },
    { label: 'طلبات معلقة', value: '24', status: 'عاجل', icon: Clock, color: 'bg-red-50 text-red-600' },
  ];

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* Header */}
      <header className="bg-white px-6 py-6 flex items-center justify-between sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-4">
          <button className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center">
            <Menu size={20} />
          </button>
          <div>
            <h1 className="text-xl font-black text-gray-900">نظرة عامة</h1>
            <p className="text-[10px] text-gray-400">مرحباً بك مجدداً، إليك آخر التحديثات اليوم</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center relative">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
          </button>
          <button className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center">
            <Search size={20} />
          </button>
        </div>
      </header>

      <div className="p-6 space-y-6">
        {/* Alert */}
        <div className="bg-emerald-50 rounded-3xl p-4 flex items-center justify-between border border-emerald-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <h3 className="text-sm font-black text-emerald-900">تنبيه النظام</h3>
              <p className="text-[10px] text-emerald-700/70">هناك 5 بائعين جدد في انتظار مراجعة الوثائق</p>
            </div>
          </div>
          <button className="bg-emerald-600 text-white text-[10px] font-bold px-4 py-2 rounded-xl">مراجعة الآن</button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-4">
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

        {/* Recent Requests */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-black text-gray-900">طلبات الانضمام الأخيرة</h3>
            <button className="text-emerald-600 text-xs font-bold">عرض الكل</button>
          </div>
          <div className="space-y-4">
            {[
              { name: 'متجر الجذور الطازجة', email: 'freshroots@example.com', cat: 'مواد غذائية', img: 'https://picsum.photos/seed/shop1/100/100' },
              { name: 'أحلام الأطفال', email: 'kidsdreams@example.com', cat: 'ألعاب وأطفال', img: 'https://picsum.photos/seed/shop2/100/100' },
            ].map((shop, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100">
                    <img src={shop.img} alt={shop.name} referrerPolicy="no-referrer" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-gray-900">{shop.name}</h4>
                    <p className="text-[10px] text-gray-400">{shop.email}</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-gray-600 bg-gray-50 px-2 py-1 rounded-lg">{shop.cat}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
