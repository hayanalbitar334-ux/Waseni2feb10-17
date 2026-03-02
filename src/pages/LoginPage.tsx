import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Mail, Lock, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email || '');
  const [password, setPassword] = useState(location.state?.password || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    }
    if (location.state?.password) {
      setPassword(location.state.password);
    }
  }, [location.state]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'حدث خطأ أثناء تسجيل الدخول');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col px-6 pt-12">
      <header className="mb-12">
        <button onClick={() => navigate(-1)} className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center mb-8">
          <ArrowRight size={20} />
        </button>
        <h1 className="text-3xl font-black text-gray-900 mb-2">تسجيل الدخول</h1>
        <p className="text-gray-400">مرحباً بك مجدداً في وصيني</p>
      </header>

      <form onSubmit={handleLogin} className="space-y-6">
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

        <div className="text-left">
          <button type="button" className="text-emerald-600 text-sm font-bold">نسيت كلمة المرور؟</button>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-emerald-600 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 disabled:opacity-70"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : 'تسجيل الدخول'}
        </button>
      </form>

      <div className="mt-auto pb-12 text-center">
        <p className="text-gray-400 text-sm">
          ليس لديك حساب؟{' '}
          <Link to="/register" className="text-emerald-600 font-bold">إنشاء حساب جديد</Link>
        </p>
      </div>
    </div>
  );
}
