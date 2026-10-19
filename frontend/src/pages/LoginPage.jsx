import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Plane, Lock, Mail, User, Sparkles, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import GlassCard from '../components/common/GlassCard';
import TiltCard from '../components/common/TiltCard';
import AnimatedButton from '../components/common/AnimatedButton';
import FloatingParticles from '../components/three/FloatingParticles';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, register, loginDemo } = useAuth();

  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [preferredTransport, setPreferredTransport] = useState('train');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDemoLogin = () => {
    loginDemo();
    navigate('/dashboard');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    if (isRegister) {
      const res = await register({
        name,
        email,
        password,
        preferred_transport: preferredTransport
      });
      if (res.success) {
        navigate('/dashboard');
      } else {
        setErrorMessage(res.message || 'Registration failed');
      }
    } else {
      const res = await login(email, password);
      if (res.success) {
        navigate('/dashboard');
      } else {
        setErrorMessage(res.message || 'Login failed');
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#090D16] text-[#F8FAFC] flex items-center justify-center p-4 relative overflow-hidden">
      <FloatingParticles count={25} />

      <div className="w-full max-w-md space-y-6 relative z-10">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-2 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-xl shadow-blue-500/25 group-hover:scale-105 transition-transform">
              <Plane className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <span className="font-black text-xl text-white tracking-tight block">SmartTravel AI</span>
              <span className="text-[11px] text-cyan-400 font-bold tracking-wider uppercase block">
                3D Demand & Crowd Predictor
              </span>
            </div>
          </Link>
          <h2 className="text-2xl font-black text-white">
            {isRegister ? 'Create Your Account' : 'Welcome to Travel Dashboard'}
          </h2>
          <p className="text-xs text-slate-400 font-medium">
            {isRegister
              ? 'Join to forecast travel demand, avoid delays, and plan smarter'
              : 'Sign in to access real-time 3D predictions, Travel AI, and saved trips'}
          </p>
        </div>

        {/* 1-Click Demo Login Box */}
        <TiltCard className="p-5 border border-blue-500/30 bg-[#0F172A]/90 shadow-2xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span className="text-xs font-black text-white uppercase tracking-wider">Fast Faculty Demo Access</span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
              Instant 1-Click
            </span>
          </div>
          <p className="text-xs text-slate-300">
            Log in directly as <strong>Gouthami (Sample Traveler)</strong> with preconfigured corridor profile.
          </p>
          <AnimatedButton
            type="button"
            onClick={handleDemoLogin}
            className="w-full py-3"
          >
            <span>🚀 Instant Demo Login & Open Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </AnimatedButton>
        </TiltCard>

        {/* Traditional Credentials Form Card */}
        <GlassCard className="p-6 rounded-3xl border border-slate-800 bg-[#0F172A]/90 shadow-2xl space-y-5">
          {/* Tabs */}
          <div className="flex rounded-2xl bg-slate-950 p-1 border border-slate-800 text-xs font-bold">
            <button
              type="button"
              onClick={() => setIsRegister(false)}
              className={`flex-1 py-2 rounded-xl transition-all cursor-pointer ${
                !isRegister ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setIsRegister(true)}
              className={`flex-1 py-2 rounded-xl transition-all cursor-pointer ${
                isRegister ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>

          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {isRegister && (
              <div>
                <label className="text-slate-300 font-bold block mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Enter your name"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white font-semibold focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-slate-300 font-bold block mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="name@example.com"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white font-semibold focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="text-slate-300 font-bold block mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white font-semibold focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {isRegister && (
              <div>
                <label className="text-slate-300 font-bold block mb-1">Preferred Transport</label>
                <select
                  value={preferredTransport}
                  onChange={(e) => setPreferredTransport(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white font-semibold focus:outline-none focus:border-blue-500"
                >
                  <option value="train">Train</option>
                  <option value="flight">Flight</option>
                  <option value="bus">Bus</option>
                  <option value="car">Car</option>
                </select>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-blue-500 text-slate-200 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50 shadow-sm"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <span>{isRegister ? 'Register & Continue' : 'Sign In with Credentials'}</span>
              )}
            </button>
          </form>
        </GlassCard>

        {/* Back Link */}
        <div className="text-center">
          <Link
            to="/"
            className="text-xs font-bold text-slate-400 hover:text-cyan-400 transition-colors inline-flex items-center gap-1"
          >
            <span>← Back to AI Traveler Landing Page</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
