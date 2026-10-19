import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Home,
  Compass,
  Bot,
  Sparkles,
  CalendarDays,
  MapPin,
  BarChart3,
  Luggage,
  Heart,
  History,
  User,
  Settings,
  ShieldCheck,
  Plane,
  LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navigationItems = [
  { name: 'Overview / Landing', path: '/', icon: Home, symbol: '✦', badge: 'Home' },
  { name: 'Dashboard', path: '/dashboard', icon: Compass, symbol: '◉', badge: null },
  { name: 'Travel AI', path: '/chatbot', icon: Bot, symbol: '✦', badge: 'AI' },
  { name: 'Predictions', path: '/predict', icon: Sparkles, symbol: '◈', badge: 'ML' },
  { name: 'Holidays & Events', path: '/holidays', icon: CalendarDays, symbol: '◌', badge: null },
  { name: 'Smart Routes', path: '/routes', icon: MapPin, symbol: '⌁', badge: null },
  { name: 'Analytics', path: '/analytics', icon: BarChart3, symbol: '▣', badge: null },
  { name: 'My Trips', path: '/trips', icon: Luggage, symbol: '♡', badge: '2' },
  { name: 'Saved Corridors', path: '/saved', icon: Heart, symbol: '♡', badge: null },
  { name: 'Travel History', path: '/history', icon: History, symbol: '⏱', badge: null },
  { name: 'Profile', path: '/profile', icon: User, symbol: '◎', badge: null },
  { name: 'Admin Diagnostics', path: '/admin', icon: Settings, symbol: '⚙', badge: 'R&D' }
];

export default function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { user, isDemoMode, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
    if (onClose) onClose();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-72 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } bg-[#0B1120]/95 backdrop-blur-xl border-r border-slate-800/80 flex flex-col justify-between shadow-2xl`}
      >
        <div>
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-800/80">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/25">
              <Plane className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg text-white tracking-tight">SmartTravel</span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-blue-500/15 text-cyan-400 border border-blue-500/30">
                  3D AI
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">Predictive Travel Command</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="px-3 py-4 space-y-1.5 overflow-y-auto max-h-[calc(100vh-230px)]">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/'}
                  onClick={() => onClose && onClose()}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/25 transform scale-[1.02]'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm opacity-90">{item.symbol}</span>
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-slate-800/90 text-cyan-400 border border-slate-700 shadow-xs">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom User Profile Section */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-900/60">
          {isDemoMode && (
            <div className="mb-3 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-xs font-bold text-emerald-400">Live Demo Mode</span>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
          )}

          <div className="flex items-center justify-between">
            <NavLink
              to="/profile"
              onClick={() => onClose && onClose()}
              className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-slate-800/60 transition-colors flex-1 min-w-0"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center font-bold text-xs text-white shadow-sm shrink-0">
                {user?.name ? user.name[0].toUpperCase() : 'G'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-200 truncate">{user?.name || 'Gouthami'}</p>
                <p className="text-[10px] text-slate-400 truncate font-medium">{user?.preferred_transport || 'Train'} • {user?.budget || 'Medium'}</p>
              </div>
            </NavLink>

            <button
              onClick={handleLogout}
              className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-800/80 transition-colors shrink-0 cursor-pointer"
              title="Log Out / Return to Home"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
