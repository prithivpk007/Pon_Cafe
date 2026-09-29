import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Cake,
  ShoppingBag,
  Gift,
  ShieldCheck,
  ArrowLeft,
  LogOut,
  Store,
  Layers
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAdmin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (!isAdmin) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-stone-900">Administrator Access Required</h2>
        <p className="text-xs text-stone-600">
          This portal is reserved for Administrator <strong>Rukmani</strong>. Please log in with administrator credentials.
        </p>
        <Link
          to="/login"
          className="inline-block px-6 py-2.5 bg-amber-600 text-white font-bold text-xs uppercase rounded-full shadow-warm"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  const navItems = [
    { label: 'Overview & KPIs', path: '/admin', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'Orders Management', path: '/admin/orders', icon: <ShoppingBag className="w-4 h-4" /> },
    { label: 'Products & Inventory', path: '/admin/products', icon: <Layers className="w-4 h-4" /> },
    { label: 'Custom Cake Requests', path: '/admin/custom-cakes', icon: <Cake className="w-4 h-4" /> },
    { label: 'Offers & Coupons', path: '/admin/offers', icon: <Gift className="w-4 h-4" /> }
  ];

  const isActive = (path: string) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col">
      {/* Admin Topbar */}
      <div className="bg-stone-950 text-white border-b border-stone-800 sticky top-0 z-30 px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-600 text-white flex items-center justify-center shadow-glow">
              <Cake className="w-5 h-5" />
            </div>
            <div>
              <span className="font-serif font-bold text-lg text-white leading-none block">
                PON CAFE Control Center
              </span>
              <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
                Administrator: Rukmani • 6374123265
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <Store className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">View Public Store</span>
            </Link>
            <button
              onClick={() => {
                logout();
                navigate('/');
              }}
              className="p-1.5 text-stone-400 hover:text-white rounded-lg"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Admin Subnav */}
      <div className="bg-white border-b border-stone-200 shadow-xs px-4 sm:px-8 py-2 sticky top-[60px] z-20 overflow-x-auto">
        <div className="max-w-7xl mx-auto flex gap-2">
          {navItems.map(item => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                  active
                    ? 'bg-amber-600 text-white shadow-warm'
                    : 'text-stone-700 hover:bg-stone-100 hover:text-stone-900'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};
