import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Cake, Mail, Lock, LogIn, ShieldCheck, UserCheck, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const LoginPage: React.FC = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !password.trim()) {
      toast.error('Please enter your email/phone and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await login(identifier.trim(), password);
      if (res.success && res.user) {
        toast.success(res.message, 'Signed In');
        if (res.user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate(from === '/login' ? '/dashboard' : from);
        }
      } else {
        toast.error(res.message || 'Login failed. Please check your credentials.');
      }
    } catch (err: any) {
      toast.error(err.message || 'Login error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillAdminDemo = () => {
    setIdentifier('admin@poncafe.com');
    setPassword('admin123');
    toast.info('Filled Administrator (Rukmani) demo credentials.');
  };

  const fillCustomerDemo = () => {
    setIdentifier('customer@example.com');
    setPassword('customer123');
    toast.info('Filled Demo Customer credentials.');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-14 h-14 rounded-2xl bg-amber-600 flex items-center justify-center text-white mx-auto shadow-warm">
          <Cake className="w-8 h-8" />
        </div>
        <h1 className="font-serif text-3xl font-bold text-stone-900">
          Welcome to PON CAFE
        </h1>
        <p className="text-xs text-stone-500">
          Sign in to manage orders, view history, or access admin controls.
        </p>
      </div>

      {/* Demo Credentials Quick-Fill Pills */}
      <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 space-y-2">
        <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wider block text-center">
          ⚡ Quick 1-Click Demo Login
        </span>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={fillAdminDemo}
            className="p-2 bg-white hover:bg-amber-100 text-stone-900 text-xs font-bold rounded-xl border border-amber-300 shadow-xs flex items-center justify-center gap-1.5 transition-all"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
            <span>Admin (Rukmani)</span>
          </button>

          <button
            type="button"
            onClick={fillCustomerDemo}
            className="p-2 bg-white hover:bg-amber-100 text-stone-900 text-xs font-bold rounded-xl border border-amber-300 shadow-xs flex items-center justify-center gap-1.5 transition-all"
          >
            <UserCheck className="w-3.5 h-3.5 text-amber-600" />
            <span>Demo Customer</span>
          </button>
        </div>
      </div>

      {/* Main Login Card */}
      <div className="bg-white rounded-3xl p-8 border border-amber-100 shadow-warm">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-stone-800 block mb-1">
              Email Address or Mobile Number *
            </label>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="admin@poncafe.com / 6374123265"
                value={identifier}
                onChange={e => setIdentifier(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:bg-white"
              />
              <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-stone-800 block mb-1">
              Password *
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full pl-9 pr-10 py-2.5 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:bg-white"
              />
              <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-stone-400 hover:text-stone-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-warm transition-all flex items-center justify-center gap-2 mt-2"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </>
            )}
          </button>
        </form>

        <div className="pt-6 mt-6 border-t border-stone-100 text-center text-xs text-stone-600">
          <span>Don’t have a bakery account yet? </span>
          <Link to="/register" className="text-amber-700 font-bold hover:underline">
            Register as Customer
          </Link>
        </div>
      </div>
    </div>
  );
};
