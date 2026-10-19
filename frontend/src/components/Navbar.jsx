import React from 'react';
import { Menu, Sparkles, Bot, ShieldCheck, Home, LogOut, LogIn } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AnimatedButton from './common/AnimatedButton';

export default function Navbar({ onMenuToggle }) {
  const navigate = useNavigate();
  const { user, isLoggedIn, isDemoMode, setIsDemoMode, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 h-16 w-full bg-[#0F172A]/90 backdrop-blur-xl border-b border-slate-800/80 px-4 lg:px-8 flex items-center justify-between shadow-lg">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuToggle}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-3">
          <Link
            to="/"
            className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-900/80 text-slate-300 hover:text-white border border-slate-700/60 hover:border-blue-500/60 transition-colors"
          >
            <Home className="w-3.5 h-3.5 text-cyan-400" />
            <span>AI Overview</span>
          </Link>

          <span className="flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            3D Pipeline Online
          </span>

          <div
            onClick={() => setIsDemoMode(!isDemoMode)}
            className="cursor-pointer flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/25 hover:bg-blue-500/20 transition-all"
            title="Toggle between Live Mode & Synthetic Demo Data"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            <span>{isDemoMode ? 'Demo Simulation Mode' : 'Live Inference Engine'}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Quick CTA Buttons */}
        <AnimatedButton
          onClick={() => navigate('/predict')}
          className="hidden md:flex px-3.5 py-1.5 text-xs"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Predict Trip</span>
        </AnimatedButton>

        <button
          onClick={() => navigate('/chatbot')}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700/60 hover:border-cyan-500/60 text-xs font-bold transition-all cursor-pointer"
        >
          <Bot className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden sm:inline">Ask Travel AI</span>
        </button>

        <div className="h-6 w-px bg-slate-800 hidden sm:block" />

        {isLoggedIn ? (
          <div className="flex items-center gap-2">
            <Link to="/profile" className="flex items-center gap-2 hover:opacity-85 transition-opacity">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center font-bold text-xs text-white shadow-xs ring-2 ring-blue-500/30">
                {user?.name ? user.name[0].toUpperCase() : 'G'}
              </div>
              <span className="text-xs font-bold text-slate-200 hidden md:block">
                {user?.name || 'Gouthami'}
              </span>
            </Link>

            <button
              onClick={() => {
                logout();
                navigate('/');
              }}
              className="p-1.5 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors cursor-pointer"
              title="Log Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs font-bold shadow-md shadow-blue-500/25 hover:shadow-cyan-500/30 transition-all"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </Link>
        )}
      </div>
    </header>
  );
}
