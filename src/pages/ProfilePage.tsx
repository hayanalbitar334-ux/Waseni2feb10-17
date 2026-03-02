import { Edit2, ChevronLeft, ShoppingBag, Heart, MapPin, Star, Settings, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const menuItems = [
    { icon: ShoppingBag, label: 'طلباتي', color: 'bg-emerald-50 text-emerald-600', path: '/orders' },
    { icon: Heart, label: 'المفضلة', color: 'bg-emerald-50 text-emerald-600', path: '/favorites' },
    { icon: MapPin, label: 'العناوين المحفوظة', color: 'bg-emerald-50 text-emerald-600', path: '/addresses' },
    { icon: Star, label: 'تقييماتي', color: 'bg-emerald-50 text-emerald-600', path: '/reviews' },
    { icon: Settings, label: 'الإعدادات', color: 'bg-emerald-50 text-emerald-600', path: '/settings' },
  ];

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const handleMenuClick = (path: string) => {
    // For now, most of these will just show a message or navigate to home
    // since we haven't built all the sub-pages yet
    if (path === '/orders') {
      navigate('/cart'); // Redirect to cart as a placeholder for orders
    } else {
      alert(`هذه الصفحة (${path}) قيد التطوير حالياً`);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-24">
      {/* Profile Header */}
      <div className="bg-white rounded-b-[40px] pt-16 pb-12 px-6 flex flex-col items-center shadow-sm">
        <div className="relative mb-4">
          <div className="w-32 h-32 rounded-full border-4 border-emerald-50 p-1">
            <div className="w-full h-full rounded-full bg-emerald-100 flex items-center justify-center overflow-hidden">
              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`} alt="Avatar" referrerPolicy="no-referrer" />
            </div>
          </div>
          <button className="absolute bottom-0 right-0 w-10 h-10 bg-emerald-600 text-white rounded-full border-4 border-white flex items-center justify-center">
            <Edit2 size={16} />
          </button>
        </div>
        <h1 className="text-2xl font-black text-gray-900 mb-1">{user?.user_metadata?.full_name || 'مستخدم وصيني'}</h1>
        <p className="text-sm text-emerald-600 font-medium">{user?.email}</p>
      </div>

      <div className="p-6 space-y-6">
        {/* Merchant CTA */}
        {user?.email === 'saryatest123@gmail.com' && (
          <div className="bg-gray-900 rounded-[40px] p-8 border border-gray-800 text-center mb-6">
            <h2 className="text-xl font-black text-white mb-2">لوحة تحكم المسؤول</h2>
            <p className="text-sm text-gray-400 mb-6 leading-relaxed">
              إدارة المنتجات، الطلبات، والمستخدمين في وصيني
            </p>
            <button 
              onClick={() => navigate('/admin')}
              className="w-full bg-white text-gray-900 font-black py-4 rounded-2xl shadow-lg"
            >
              دخول لوحة التحكم
            </button>
          </div>
        )}

        <div className="bg-emerald-50 rounded-[40px] p-8 border border-emerald-100 text-center">
          <h2 className="text-xl font-black text-emerald-900 mb-2">كن تاجراً معنا</h2>
          <p className="text-sm text-emerald-700/70 mb-6 leading-relaxed">
            ابدأ ببيع منتجاتك والوصول لآلاف العملاء الآن في وصيني
          </p>
          <button 
            onClick={() => navigate('/merchant')}
            className="w-full bg-emerald-600 text-white font-black py-4 rounded-2xl shadow-lg shadow-emerald-600/20"
          >
            سجل كتاجر
          </button>
        </div>

        {/* Menu Items */}
        <div className="bg-white rounded-[40px] overflow-hidden shadow-sm border border-gray-100">
          {menuItems.map((item, i) => (
            <button 
              key={i}
              onClick={() => handleMenuClick(item.path)}
              className={`w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors ${
                i !== menuItems.length - 1 ? 'border-b border-gray-50' : ''
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 ${item.color} rounded-2xl flex items-center justify-center`}>
                  <item.icon size={24} />
                </div>
                <span className="font-black text-gray-900">{item.label}</span>
              </div>
              <ChevronLeft size={20} className="text-gray-300" />
            </button>
          ))}
        </div>

        {/* Logout */}
        <button 
          onClick={handleLogout}
          className="w-full bg-white rounded-[40px] p-5 flex items-center justify-center gap-3 text-red-500 font-black shadow-sm border border-gray-100"
        >
          <LogOut size={24} />
          تسجيل الخروج
        </button>
      </div>
    </div>
  );
}
