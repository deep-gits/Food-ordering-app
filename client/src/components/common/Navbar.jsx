import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ShoppingCart, ChefHat, User, LogOut, LayoutDashboard, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { logout } from '../../store/slices/authSlice';
import { toggleCart, selectCartCount } from '../../store/slices/cartSlice';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const dispatch   = useDispatch();
  const navigate   = useNavigate();
  const { user }   = useSelector((s) => s.auth);
  const cartCount  = useSelector(selectCartCount);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    setMobileOpen(false);
  };

  const navLinks = [
    { to: '/',     label: 'Home'   },
    { to: '/menu', label: 'Menu'   },
  ];

  return (
    <header className="sticky top-0 z-50 bg-surface/80 backdrop-blur-xl border-b border-surface-border">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-brand-500 flex items-center justify-center shadow-glow group-hover:shadow-glow-lg transition-all duration-300">
            <ChefHat size={20} className="text-white" />
          </div>
          <span className="font-display font-bold text-xl text-white hidden sm:block">
            Feast<span className="text-gradient">Flow</span>
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive ? 'text-brand-400 bg-brand-500/10' : 'text-gray-400 hover:text-white hover:bg-surface-elevated'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
          {user?.role === 'admin' && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1.5 ${
                  isActive ? 'text-brand-400 bg-brand-500/10' : 'text-gray-400 hover:text-white hover:bg-surface-elevated'
                }`
              }
            >
              <LayoutDashboard size={15} /> Admin
            </NavLink>
          )}
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2">
          {/* Cart Button */}
          <button
            id="cart-toggle-btn"
            onClick={() => dispatch(toggleCart())}
            className="relative p-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-surface-elevated transition-all duration-200"
            aria-label="Open cart"
          >
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <motion.span
                key={cartCount}
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-brand-500 text-white text-[10px] font-bold flex items-center justify-center"
              >
                {cartCount > 99 ? '99+' : cartCount}
              </motion.span>
            )}
          </button>

          {/* Auth Area */}
          {user ? (
            <div className="hidden md:flex items-center gap-2">
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive ? 'text-brand-400 bg-brand-500/10' : 'text-gray-400 hover:text-white hover:bg-surface-elevated'
                  }`
                }
              >
                <div className="w-6 h-6 rounded-full bg-brand-500/20 border border-brand-500/40 flex items-center justify-center">
                  <User size={13} className="text-brand-400" />
                </div>
                <span className="max-w-[100px] truncate">{user.name}</span>
              </NavLink>
              <button
                onClick={handleLogout}
                className="p-2.5 rounded-xl text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
                aria-label="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link to="/login"    className="btn-ghost text-sm">Login</Link>
              <Link to="/register" className="btn-primary text-sm px-4 py-2">Sign Up</Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-surface-elevated transition-all"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-surface-border bg-surface-card px-4 pb-4 pt-2 space-y-1"
          >
            {navLinks.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/'}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `block px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive ? 'text-brand-400 bg-brand-500/10' : 'text-gray-400 hover:text-white hover:bg-surface-elevated'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
            {user?.role === 'admin' && (
              <NavLink to="/admin" onClick={() => setMobileOpen(false)} className="block px-4 py-3 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-surface-elevated">
                Admin Dashboard
              </NavLink>
            )}
            <div className="divider" />
            {user ? (
              <>
                <NavLink to="/profile" onClick={() => setMobileOpen(false)} className="block px-4 py-3 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-surface-elevated">
                  Profile
                </NavLink>
                <NavLink to="/orders" onClick={() => setMobileOpen(false)} className="block px-4 py-3 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-surface-elevated">
                  My Orders
                </NavLink>
                <button onClick={handleLogout} className="w-full text-left px-4 py-3 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-all">
                  Logout
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2 pt-2">
                <Link to="/login"    onClick={() => setMobileOpen(false)} className="btn-secondary justify-center">Login</Link>
                <Link to="/register" onClick={() => setMobileOpen(false)} className="btn-primary  justify-center">Sign Up</Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
