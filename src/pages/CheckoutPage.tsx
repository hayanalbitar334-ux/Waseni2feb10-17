import { ArrowRight, MapPin, Plus, Apple, CreditCard, Wallet, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('apple');

  return (
    <div className="bg-gray-50 min-h-screen pb-32">
      {/* Header */}
      <header className="bg-white px-4 py-6 flex items-center justify-between sticky top-0 z-40">
        <div className="w-10" />
        <h1 className="text-xl font-black text-gray-900">إتمام الطلب</h1>
        <button onClick={() => navigate(-1)} className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center">
          <ArrowRight size={20} />
        </button>
      </header>

      <div className="p-4 space-y-8">
        {/* Shipping Address */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-black text-gray-900">عنوان الشحن</h2>
            <button className="text-emerald-600 text-sm font-bold flex items-center gap-1">
              <Plus size={16} /> إضافة عنوان جديد
            </button>
          </div>
          <div className="bg-white rounded-3xl p-4 flex items-center gap-4 shadow-sm border border-gray-100">
            <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0">
              <img src="https://picsum.photos/seed/map/200/200" alt="Map" referrerPolicy="no-referrer" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-black text-gray-900">المنزل</h3>
                <div className="w-5 h-5 bg-emerald-50 text-emerald-600 rounded-md flex items-center justify-center">
                  <MapPin size={12} />
                </div>
              </div>
              <p className="text-[10px] text-gray-400 leading-relaxed">
                شارع الملك فهد، حي الصحافة، الرياض، 12345
              </p>
              <button className="text-emerald-600 text-[10px] font-bold bg-emerald-50 px-2 py-1 rounded-lg mt-2">تغيير العنوان</button>
            </div>
          </div>
        </section>

        {/* Payment Methods */}
        <section>
          <h2 className="text-lg font-black text-gray-900 mb-4">طريقة الدفع</h2>
          <div className="space-y-3">
            {[
              { id: 'apple', name: 'Apple Pay', desc: 'دفع سريع وآمن', icon: Apple, color: 'bg-black text-white' },
              { id: 'card', name: 'بطاقة ائتمان', desc: 'مدى، فيزا، ماستركارد', icon: CreditCard, color: 'bg-emerald-50 text-emerald-600' },
              { id: 'cash', name: 'الدفع عند الاستلام', desc: 'رسوم إضافية 10 ر.س', icon: Wallet, color: 'bg-emerald-50 text-emerald-600' },
            ].map((method) => (
              <label 
                key={method.id}
                className={`flex items-center justify-between p-4 rounded-3xl border-2 transition-all cursor-pointer ${
                  paymentMethod === method.id ? 'bg-white border-emerald-600' : 'bg-white border-transparent shadow-sm'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    paymentMethod === method.id ? 'border-emerald-600' : 'border-gray-200'
                  }`}>
                    {paymentMethod === method.id && <div className="w-3 h-3 bg-emerald-600 rounded-full" />}
                  </div>
                  <input 
                    type="radio" 
                    name="payment" 
                    className="hidden" 
                    checked={paymentMethod === method.id}
                    onChange={() => setPaymentMethod(method.id)}
                  />
                  <div>
                    <h3 className="text-sm font-black text-gray-900">{method.name}</h3>
                    <p className="text-[10px] text-gray-400">{method.desc}</p>
                  </div>
                </div>
                <div className={`w-12 h-12 ${method.color} rounded-2xl flex items-center justify-center`}>
                  <method.icon size={24} />
                </div>
              </label>
            ))}
          </div>
        </section>

        {/* Order Summary */}
        <section>
          <h2 className="text-lg font-black text-gray-900 mb-4">ملخص السلة</h2>
          <div className="space-y-3">
            {[
              { name: 'حذاء رياضي الترا', price: 240, meta: 'المقاس: 42 | الكمية: 1', img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80' },
              { name: 'ساعة يد ذكية', price: 150, meta: 'اللون: أسود | الكمية: 1', img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80' },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-3xl p-3 flex items-center gap-4 shadow-sm border border-gray-100">
                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gray-100">
                  <img src={item.img} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-black text-gray-900">{item.name}</h3>
                  <p className="text-[10px] text-gray-400">{item.meta}</p>
                </div>
                <span className="text-emerald-600 font-black text-sm">{item.price} ر.س</span>
              </div>
            ))}
          </div>
        </section>

        {/* Totals */}
        <section className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">المجموع الفرعي</span>
              <span className="text-gray-900 font-bold">390 ر.س</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">رسوم التوصيل</span>
              <span className="text-emerald-600 font-bold">مجاني</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">ضريبة القيمة المضافة (15%)</span>
              <span className="text-gray-900 font-bold">58.5 ر.س</span>
            </div>
          </div>
          <div className="pt-4 border-t border-dashed border-gray-100 flex justify-between items-center">
            <span className="text-xl font-black text-gray-900">الإجمالي الكلي</span>
            <span className="text-2xl font-black text-emerald-600">448.5 ر.س</span>
          </div>
        </section>
      </div>

      {/* Action Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 z-50">
        <button className="w-full bg-emerald-600 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20">
          <Lock size={20} />
          تأكيد الطلب والدفع
        </button>
        <p className="text-[10px] text-gray-400 text-center mt-2">بالنقر على تأكيد الطلب، فإنك توافق على الشروط والأحكام الخاصة بـ "وصيني"</p>
      </div>
    </div>
  );
}
