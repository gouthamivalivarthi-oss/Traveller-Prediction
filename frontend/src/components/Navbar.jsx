import React from 'react';
import { Menu, Search, Sparkles, Bot, ShieldCheck, Home, LogOut, LogIn, Bell } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AnimatedButton from './common/AnimatedButton';

export default function Navbar({ onMenuToggle }) {
  const navigate = useNavigate();
  const { user, isLoggedIn, isDemoMode, setIsDemoMode, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 h-16 w-full bg-[#FFFDF8]/90 backdrop-blur-xl border-b border-[#F2DECC] px-4 lg:px-8 flex items-center justify-between shadow-xs">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuToggle}
          className="p-2 rounded-xl text-[#7A5843] hover:text-[#34261F] hover:bg-[#FFF8ED] lg:hidden cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-3">
          <Link
            to="/"
            className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl bg-[#FFF8ED] text-[#7A5843] hover:text-[#34261F] border border-[#F2DECC] hover:border-[#FF9F43] transition-colors"
          >
            <Home className="w-3.5 h-3.5 text-[#FF7657]" />
            <span>AI Overview</span>
          </Link>

          <span className="flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-[#FFF8ED] text-[#2D6A2E] border border-[#7BC67B]/40">
            <span className="w-1.5 h-1.5 rounded-full bg-[#7BC67B] animate-pulse" />
            3D Pipeline Online
          </span>

          <div
            onClick={() => setIsDemoMode(!isDemoMode)}
            className="cursor-pointer flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-[#FF7657]/10 text-[#FF7657] border border-[#FF7657]/25 hover:bg-[#FF7657]/20 transition-all"
            title="Toggle between Live Mode & Synthetic Demo Data"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#FF7657]" />
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
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#FFF8ED] text-[#7A5843] hover:text-[#34261F] hover:bg-[#FDE7D3] border border-[#F2DECC] hover:border-[#FF9F43] text-xs font-bold transition-all cursor-pointer"
        >
          <Bot className="w-3.5 h-3.5 text-[#FF7657]" />
          <span className="hidden sm:inline">Ask Travel AI</span>
        </button>

        <div className="h-6 w-px bg-[#F2DECC] hidden sm:block" />

        {isLoggedIn ? (
          <div className="flex items-center gap-2">
            <Link to="/profile" className="flex items-center gap-2 hover:opacity-85 transition-opacity">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#FF7657] to-[#FF9F43] flex items-center justify-center font-bold text-xs text-white shadow-xs ring-2 ring-[#FF7657]/30">
                {user?.name ? user.name[0].toUpperCase() : 'G'}
              </div>
              <span className="text-xs font-bold text-[#34261F] hidden md:block">
                {user?.name || 'Gouthami'}
              </span>
            </Link>

            <button
              onClick={() => {
                logout();
                navigate('/');
              }}
              className="p-1.5 rounded-xl text-[#7A5843] hover:text-[#FF7657] hover:bg-[#FFF8ED] transition-colors cursor-pointer"
              title="Log Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#FF7657] to-[#FF9F43] text-white text-xs font-bold shadow-md shadow-[#FF7657]/30 transition-all"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </Link>
        )}
      </div>
    </header>
  );
}
