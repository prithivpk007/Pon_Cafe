import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  User as UserIcon,
  Search,
  Menu,
  X,
  Cake,
  Phone,
  MapPin,
  Clock,
  ShieldCheck,
  LogOut,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

export const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchInput, setShowSearchInput] = useState(false);

  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { itemCount, setIsCartOpen } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearchInput(false);
      setIsMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Products', path: '/products' },
    { name: 'Custom Cake', path: '/custom-cake' },
    { name: 'Offers', path: '/offers' },
    { name: 'Track Order', path: '/track' },
    { name: 'Contact', path: '/contact' }
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-40 w-full shadow-sm bg-white/95 backdrop-blur-md border-b border-amber-100">
      {/* Top Announcement Bar with Bakery Info */}
      <div className="bg-amber-950 text-amber-100 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-4 text-xs font-medium">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              Kangeayam Road, Chennimalai, Erode – 638051
            </span>
            <span className="hidden md:flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              Open Daily: 7:00 AM – 10:00 PM
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="tel:6374123265"
              className="flex items-center gap-1 text-amber-300 hover:text-amber-200 font-semibold transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call: 6374123265</span>
            </a>
            {isAdmin && (
              <Link
                to="/admin"
                className="bg-amber-500 hover:bg-amber-400 text-stone-950 px-2 py-0.5 rounded font-bold text-[11px] flex items-center gap-1 transition-colors"
              >
                <ShieldCheck className="w-3 h-3" />
                Admin Dashboard
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Branding */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white shadow-warm group-hover:scale-105 transition-transform duration-200">
              <Cake className="w-7 h-7" />
            </div>
            <div>
              <span className="block font-serif text-2xl font-bold tracking-tight text-stone-900 leading-none">
                PON CAFE
              </span>
              <span className="block text-xs uppercase tracking-widest font-semibold text-amber-600 mt-1">
                Rukmani Bakery
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map(link => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? 'bg-amber-100 text-amber-900 font-semibold shadow-xs'
                      : 'text-stone-700 hover:text-amber-700 hover:bg-amber-50/70'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Action Icons: Search, Cart, Auth */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Toggle / Input */}
            <div className="relative">
              {showSearchInput ? (
                <form onSubmit={handleSearchSubmit} className="flex items-center">
                  <input
                    type="text"
                    placeholder="Search cakes, puffs, breads..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    autoFocus
                    className="w-48 sm:w-64 pl-3 pr-8 py-1.5 text-xs bg-stone-100 border border-amber-300 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSearchInput(false)}
                    className="absolute right-2 text-stone-400 hover:text-stone-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setShowSearchInput(true)}
                  className="p-2.5 text-stone-600 hover:text-amber-700 hover:bg-amber-50 rounded-full transition-colors"
                  title="Search Bakery Items"
                >
                  <Search className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Shopping Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 text-stone-700 hover:text-amber-800 hover:bg-amber-50 rounded-full transition-colors"
              aria-label="View Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-600 text-white font-bold text-[11px] w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-pulse">
                  {itemCount}
                </span>
              )}
            </button>

            {/* User Account / Profile Menu */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 py-1.5 px-3 rounded-full bg-amber-50 border border-amber-200 text-stone-800 hover:bg-amber-100 transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-amber-600 text-white flex items-center justify-center text-xs font-bold uppercase">
                    {user?.name ? user.name[0] : 'U'}
                  </div>
                  <span className="text-xs font-semibold max-w-[90px] truncate hidden sm:inline">
                    {user?.name}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-stone-500" />
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-20"
                      onClick={() => setIsUserMenuOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-warm border border-stone-200 py-2 z-30 divide-y divide-stone-100">
                      <div className="px-4 py-2">
                        <p className="text-xs text-stone-500 font-medium">Signed in as</p>
                        <p className="text-sm font-bold text-stone-800 truncate">{user?.name}</p>
                        <p className="text-xs text-amber-700 capitalize font-medium">{user?.role} Account</p>
                      </div>

                      <div className="py-1">
                        <Link
                          to="/dashboard"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-stone-700 hover:bg-amber-50 hover:text-amber-800"
                        >
                          <UserIcon className="w-4 h-4 text-amber-600" />
                          My Dashboard & Orders
                        </Link>
                        <Link
                          to="/track"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-stone-700 hover:bg-amber-50 hover:text-amber-800"
                        >
                          <Clock className="w-4 h-4 text-amber-600" />
                          Track Active Order
                        </Link>
                        {isAdmin && (
                          <Link
                            to="/admin"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-amber-700 bg-amber-50/60 hover:bg-amber-100"
                          >
                            <ShieldCheck className="w-4 h-4 text-amber-600" />
                            Admin Control Center
                          </Link>
                        )}
                      </div>

                      <div className="py-1">
                        <button
                          onClick={() => {
                            logout();
                            setIsUserMenuOpen(false);
                            navigate('/');
                          }}
                          className="w-full flex items-center gap-2 px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50"
                        >
                          <LogOut className="w-4 h-4" />
                          Logout
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-full bg-amber-600 hover:bg-amber-700 text-white shadow-xs transition-all hover:shadow-warm"
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span>Login</span>
              </Link>
            )}

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-stone-700 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-amber-100 bg-stone-50 px-4 pt-3 pb-6 space-y-2">
          {/* Mobile Search */}
          <form onSubmit={handleSearchSubmit} className="mb-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search cakes, snacks, breads..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
            </div>
          </form>

          {navLinks.map(link => {
            const active = isActive(link.path);
            return (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  active
                    ? 'bg-amber-600 text-white font-semibold shadow-xs'
                    : 'text-stone-700 hover:bg-amber-100/60'
                }`}
              >
                {link.name}
              </Link>
            );
          })}

          {isAdmin && (
            <Link
              to="/admin"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-4 py-2.5 rounded-xl text-sm font-bold bg-amber-100 text-amber-900 border border-amber-300"
            >
              👑 Admin Dashboard (Rukmani)
            </Link>
          )}

          <div className="pt-2 border-t border-stone-200 text-xs text-stone-600 space-y-1">
            <p className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-600" />
              Kangeayam Road, Chennimalai, Erode – 638051
            </p>
            <p className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-amber-600" />
              Contact: 6374123265
            </p>
          </div>
        </div>
      )}
    </header>
  );
};
