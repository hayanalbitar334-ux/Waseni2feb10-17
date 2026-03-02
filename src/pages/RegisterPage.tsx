import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Mail, Lock, User, ArrowRight, Loader2, AlertCircle, MailCheck, ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) throw error;
      
      // If identities is empty, it means the user already exists
      if (data.user && data.user.identities && data.user.identities.length === 0) {
        setError('البريد الإلكتروني مسجل مسبقاً. يرجى تسجيل الدخول بدلاً من ذلك.');
        return;
      }
      
      setShowSuccess(true);
    } catch (err: any) {
      setError(err.message || 'حدث خطأ أثناء إنشاء الحساب');
    } finally {
      setLoading(false);
    }
  };

  const openEmailApp = () => {
    const domain = email.split('@')[1];
    if (domain === 'gmail.com') {
      window.open('https://mail.google.com', '_blank');
    } else if (domain === 'outlook.com' || domain === 'hotmail.com') {
      window.open('https://outlook.live.com', '_blank');
    } else if (domain === 'yahoo.com') {
      window.open('https://mail.yahoo.com', '_blank');
    } else {
      // Generic fallback
      window.open(`https://www.google.com/search?q=login+to+${domain}`, '_blank');
    }
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-white flex flex-col px-6 pt-24 items-center text-center">
        <motion.div 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-24 h-24 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-8"
        >
          <MailCheck size={48} />
        </motion.div>
        
        <h1 className="text-3xl font-black text-gray-900 mb-4">تحقق من بريدك!</h1>
        <p className="text-gray-500 mb-8 leading-relaxed">
          لقد أرسلنا رابط تأكيد إلى <span className="font-bold text-gray-900">{email}</span>. 
          يرجى النقر على الرابط لتفعيل حسابك قبل تسجيل الدخول.
        </p>

        <div className="w-full space-y-4">
          <button 
            onClick={openEmailApp}
            className="w-full bg-emerald-600 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20"
          >
            <ExternalLink size={20} />
            فتح البريد الإلكتروني
          </button>
          
          <button 
            onClick={() => navigate('/login', { state: { email, password } })}
            className="w-full bg-gray-50 text-gray-600 font-bold py-4 rounded-2xl"
          >
            العودة لتسجيل الدخول
          </button>
        </div>

        <div className="mt-auto pb-12">
          <p className="text-gray-400 text-sm">
            لم يصلك البريد؟ <button className="text-emerald-600 font-bold">إعادة الإرسال</button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col px-6 pt-12">
      <header className="mb-12">
        <button onClick={() => navigate(-1)} className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center mb-8">
          <ArrowRight size={20} />
        </button>
        <h1 className="text-3xl font-black text-gray-900 mb-2">إنشاء حساب</h1>
        <p className="text-gray-400">انضم إلى مجتمع وصيني اليوم</p>
      </header>

      <form onSubmit={handleRegister} className="space-y-6">
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 text-red-600 p-4 rounded-2xl flex items-center gap-3 text-sm"
          >
            <AlertCircle size={18} />
            {error}
          </motion.div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 mr-1">الاسم الكامل</label>
          <div className="relative">
            <User className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
            <input 
              type="text" 
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="أحمد محمد"
              className="w-full bg-gray-50 border-none rounded-2xl py-4 pr-12 pl-4 text-sm focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 mr-1">البريد الإلكتروني</label>
          <div className="relative">
            <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@mail.com"
              className="w-full bg-gray-50 border-none rounded-2xl py-4 pr-12 pl-4 text-sm focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 mr-1">كلمة المرور</label>
          <div className="relative">
            <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-gray-50 border-none rounded-2xl py-4 pr-12 pl-4 text-sm focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-emerald-600 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 disabled:opacity-70"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : 'إنشاء الحساب'}
        </button>
      </form>

      <div className="mt-auto pb-12 text-center">
        <p className="text-gray-400 text-sm">
          لديك حساب بالفعل؟{' '}
          <Link to="/login" className="text-emerald-600 font-bold">تسجيل الدخول</Link>
        </p>
      </div>
    </div>
  );
}
