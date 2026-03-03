/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { Home, LayoutGrid, ShoppingCart, ClipboardList, User, Bell, Search, Filter } from 'lucide-react';
import { cn } from './types';
import { AuthProvider, useAuth } from './context/AuthContext';
import { useCartStore } from './store/cartStore';

import { Toaster } from 'sonner';
import { ProtectedRoute } from './components/ProtectedRoute';

// Pages
import HomePage from './pages/HomePage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboard from './pages/AdminDashboard';
import MerchantDashboard from './pages/MerchantDashboard';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

function BottomNav() {
  const location = useLocation();
  const path = location.pathname;
  const { user, profile } = useAuth();
  const { items, fetchItems } = useCartStore();

  useEffect(() => {
    if (user) {
      fetchItems(user.id);
    }
  }, [user, fetchItems]);

  const navItems = [
    { icon: Home, label: 'الرئيسية', path: '/' },
    { icon: LayoutGrid, label: 'الفئات', path: '/categories' },
    { icon: ShoppingCart, label: 'السلة', path: '/cart', badge: items.length > 0 ? items.length : undefined },
    { icon: ClipboardList, label: 'الطلبات', path: '/orders' },
    { icon: User, label: 'حسابي', path: user ? '/profile' : '/login' },
  ];

  if (profile?.role === 'seller') {
    navItems.splice(3, 0, { icon: LayoutGrid, label: 'متجري', path: '/merchant' });
  }

  // Hide bottom nav on specific pages
  const hideOn = ['/checkout', '/login', '/register'];
  if (hideOn.includes(path) || path.startsWith('/admin') || path.startsWith('/merchant') || path.startsWith('/product/')) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-2 flex justify-between items-center z-50">
      {navItems.map((item) => {
        const isActive = path === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex flex-col items-center gap-1 transition-colors",
              isActive ? "text-emerald-600" : "text-gray-400"
            )}
          >
            <div className="relative">
              <item.icon size={24} />
              {item.badge && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                  {item.badge}
                </span>
              )}
            </div>
            <span className="text-[10px] font-medium">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 font-sans pb-20" dir="rtl">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/product/:id" element={<ProductDetailsPage />} />
            <Route path="/cart" element={<CartPage />} />
            
            {/* Protected Routes */}
            <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>} />
            <Route path="/merchant" element={<ProtectedRoute requiredRole="seller"><MerchantDashboard /></ProtectedRoute>} />
            
            {/* Fallback to home */}
            <Route path="*" element={<HomePage />} />
          </Routes>
          <BottomNav />
          <Toaster position="top-center" richColors />
        </div>
      </Router>
    </AuthProvider>
  );
}
