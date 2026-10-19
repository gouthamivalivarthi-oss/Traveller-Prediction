import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  Calendar,
  MapPin,
  Bot,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Plane,
  Compass,
  BarChart3,
  LogIn
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import TravelGlobe from '../components/three/TravelGlobe';
import FloatingParticles from '../components/three/FloatingParticles';
import GlassCard from '../components/common/GlassCard';
import TiltCard from '../components/common/TiltCard';
import AnimatedButton from '../components/common/AnimatedButton';

export default function LandingPage() {
  const navigate = useNavigate();
  const { isLoggedIn, loginDemo, logout } = useAuth();

  const handleLaunchDashboard = () => {
    if (!isLoggedIn) {
      loginDemo();
    }
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#090D16] text-[#F8FAFC] selection:bg-blue-500 selection:text-white overflow-x-hidden relative">
      <FloatingParticles count={30} />

      {/* 1. Top Navigation Bar */}
      <header className="sticky top-0 z-50 w-full bg-[#0F172A]/85 border-b border-slate-800/80 px-4 sm:px-8 py-4 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform">
              <Plane className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg text-white tracking-tight">SmartTravel AI</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/15 text-cyan-400 border border-blue-500/30">
                  3D R&D Platform
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">3D Travel Prediction & Intelligence</p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-xs font-bold text-slate-300">
            <a href="#about" className="hover:text-cyan-400 transition-colors">About AI</a>
            <a href="#how-it-works" className="hover:text-cyan-400 transition-colors">How It Works</a>
            <a href="#features" className="hover:text-cyan-400 transition-colors">3D Features</a>
            <a href="#baselines" className="hover:text-cyan-400 transition-colors">Model Metrics</a>
            <a href="#walkthrough" className="hover:text-cyan-400 transition-colors">Demo Flow</a>
          </nav>

          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <div className="flex items-center gap-3">
                <AnimatedButton
                  onClick={() => navigate('/dashboard')}
                  className="px-4 py-2"
                >
                  <Compass className="w-4 h-4" />
                  <span>Go to Dashboard</span>
                </AnimatedButton>
                <button
                  onClick={logout}
                  className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-bold border border-slate-700 transition-colors cursor-pointer"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700 transition-all flex items-center gap-1.5"
                >
                  <LogIn className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Log In</span>
                </Link>
                <AnimatedButton
                  onClick={handleLaunchDashboard}
                  className="px-4 py-2 text-xs"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>1-Click Demo Login</span>
                </AnimatedButton>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 2. Hero Section with Interactive 3D Travel Globe */}
      <section className="relative pt-10 pb-16 px-4 sm:px-8 max-w-7xl mx-auto overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Headings & CTAs */}
          <div className="lg:col-span-6 space-y-6 relative z-10 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/25 text-cyan-400 text-xs font-bold uppercase tracking-wider shadow-inner">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              AI Traveler Prediction • ThreeUI 3D Engine
            </div>

            <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.12]">
              Travel Smarter.<br />
              <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">
                Predict Before You Go.
              </span>
            </h1>

            <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-xl">
              AI-powered travel prediction for smarter dates, safer journeys and better travel decisions. Forecast corridor passenger volumes, festival surges, delay risks, and price volatility.
            </p>

            {/* Action CTAs */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <AnimatedButton
                onClick={handleLaunchDashboard}
                className="px-6 py-3.5 text-sm"
              >
                <span>🚀 Predict My Trip</span>
                <ArrowRight className="w-4 h-4" />
              </AnimatedButton>

              <Link
                to="/chatbot"
                className="px-6 py-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 text-sm font-bold border border-slate-700 hover:border-cyan-500/60 flex items-center gap-2 transition-all shadow-md"
              >
                <Bot className="w-4 h-4 text-cyan-400" />
                <span>✦ Ask Travel AI</span>
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-3 text-xs text-slate-300 font-semibold">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                10,950+ Empirical Records
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                95.8% Classification Accuracy
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                R² = 0.970 Regressor
              </span>
            </div>
          </div>

          {/* Right Column: Interactive 3D Travel Command Center */}
          <div className="lg:col-span-6 relative">
            <div className="relative">
              {/* Subtle sapphire/cyan glow behind container */}
              <div className="absolute -inset-1.5 bg-gradient-to-r from-blue-600/30 via-indigo-600/20 to-cyan-500/30 rounded-3xl blur-2xl opacity-70 pointer-events-none" />
              <TravelGlobe height="460px" />
            </div>
          </div>
        </div>
      </section>

      {/* 3. The Problem & Core ML Principle Section */}
      <section id="about" className="py-16 px-4 sm:px-8 border-t border-slate-800 bg-[#0B1120]">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              The Scientific Principle: Why Simple Rules Fail
            </h2>
            <p className="text-slate-400 text-sm">
              Most travel apps claim <code className="bg-slate-900 px-1.5 py-0.5 rounded border border-slate-700 text-cyan-400">Holiday = High Crowd</code>. In reality, travel demand is a multi-dimensional system where a holiday is just one factor among many.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* The Flawed Approach */}
            <GlassCard className="p-6 sm:p-8 border border-rose-500/30 bg-[#0F172A]/90 space-y-4">
              <div className="flex items-center gap-2 text-rose-400">
                <AlertTriangle className="w-5 h-5" />
                <h3 className="font-bold text-base text-white">The Naive Rule-Based Approach</h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Simple calculators assign a hardcoded surge whenever a calendar date contains a holiday flag.
              </p>
              <div className="p-3.5 rounded-xl bg-slate-950 border border-rose-500/30 text-xs font-mono text-rose-400 font-bold">
                IF date == Holiday THEN Crowd = HIGH
              </div>
              <ul className="text-xs text-slate-300 space-y-2">
                <li>• Fails to account for weekend connectivity or mid-week holidays.</li>
                <li>• Ignores destination popularity (e.g. pilgrimage vs commercial hubs).</li>
                <li>• Result: <strong className="text-rose-400">MAE 14.34, Negative R² (-0.78), only 15.9% accuracy</strong>.</li>
              </ul>
            </GlassCard>

            {/* Our Multi-Factor Model */}
            <GlassCard className="p-6 sm:p-8 border border-emerald-500/30 bg-[#0F172A]/90 space-y-4">
              <div className="flex items-center gap-2 text-emerald-400">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-base text-white">Our Integrated Multi-Factor ML Pipeline</h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                A Random Forest regressor and classifier ensemble synthesizing 8 normalized features simultaneously.
              </p>
              <div className="p-3.5 rounded-xl bg-slate-950 border border-emerald-500/30 text-xs font-mono text-emerald-400 font-bold">
                Score = Holiday + Weekend + Seasonal + Historical + Events + Weather + Availability
              </div>
              <ul className="text-xs text-slate-300 space-y-2">
                <li>• Proximity factor detects whether a holiday connects to an extended long weekend.</li>
                <li>• Decomposes each prediction into explainable feature contribution points (+25, +20, +15).</li>
                <li>• Result: <strong className="text-emerald-400">MAE 1.826, R² = 0.970, and 95.8% Classification Accuracy</strong>.</li>
              </ul>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* 4. Complete User Workflow */}
      <section id="how-it-works" className="py-16 px-4 sm:px-8 border-t border-slate-800 bg-[#090D16]">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider">
              Step-by-Step Architecture
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              End-to-End Prediction Workflow
            </h2>
            <p className="text-slate-400 text-sm">
              How the platform transforms trip coordinates into actionable 3D travel intelligence
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <TiltCard className="p-6 border border-slate-800 bg-[#0F172A]/90 space-y-3">
              <span className="w-8 h-8 rounded-full bg-blue-500/20 text-cyan-400 font-black text-sm flex items-center justify-center">1</span>
              <h4 className="text-base font-bold text-white">Trip Input Collection</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                User enters origin, destination, target dates, vehicle mode, travelers, and personal preferences.
              </p>
            </TiltCard>

            <TiltCard className="p-6 border border-slate-800 bg-[#0F172A]/90 space-y-3">
              <span className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 font-black text-sm flex items-center justify-center">2</span>
              <h4 className="text-base font-bold text-white">Feature Engineering</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Holiday engine checks festival calendars, long weekends, weather alerts, and corridor booking rates.
              </p>
            </TiltCard>

            <TiltCard className="p-6 border border-slate-800 bg-[#0F172A]/90 space-y-3">
              <span className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 font-black text-sm flex items-center justify-center">3</span>
              <h4 className="text-base font-bold text-white">ML Inference</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Random Forest models predict continuous Demand Score, Crowd Level, Delay Risk, and Fare Surge Risk.
              </p>
            </TiltCard>

            <TiltCard className="p-6 border border-slate-800 bg-[#0F172A]/90 space-y-3">
              <span className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 font-black text-sm flex items-center justify-center">4</span>
              <h4 className="text-base font-bold text-white">Alternative Dates & Advice</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Compares neighboring dates (-2 to +2 days), suggests alternative routes, and saves to itinerary manager.
              </p>
            </TiltCard>
          </div>
        </div>
      </section>

      {/* 5. Key System Features Showcase */}
      <section id="features" className="py-16 px-4 sm:px-8 border-t border-slate-800 bg-[#0B1120]">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Complete Feature Suite
            </h2>
            <p className="text-slate-400 text-sm">
              Comprehensive modules accessible from the 3D authenticated dashboard
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <TiltCard className="p-6 border border-slate-800 bg-[#0F172A]/90 space-y-3 hover:border-blue-500/60">
              <div className="w-10 h-10 rounded-2xl bg-blue-500/15 text-cyan-400 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Travel Demand Prediction</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Categorizes demand into LOW, MEDIUM, HIGH, and VERY HIGH with feature contribution explanations (+25 holiday, +15 weekend).
              </p>
            </TiltCard>

            <TiltCard className="p-6 border border-slate-800 bg-[#0F172A]/90 space-y-3 hover:border-cyan-500/60">
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Alternative Date Analysis</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Compares a 5-day window (-2 to +2 days) using actual model inferences to identify lower-crowd travel windows.
              </p>
            </TiltCard>

            <TiltCard className="p-6 border border-slate-800 bg-[#0F172A]/90 space-y-3 hover:border-indigo-500/60">
              <div className="w-10 h-10 rounded-2xl bg-indigo-500/15 text-indigo-400 flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Travel AI Assistant</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Unified dialogue understanding across MultiWOZ and AirDialogue with interactive action buttons and inline prediction cards.
              </p>
            </TiltCard>

            <TiltCard className="p-6 border border-slate-800 bg-[#0F172A]/90 space-y-3 hover:border-emerald-500/60">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Smart Route Planner</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Evaluates Route A (Express), Route B (Bypass), and Route C (Multi-Modal) alongside cross-modal trade-offs (Train, Bus, Flight, Car).
              </p>
            </TiltCard>

            <TiltCard className="p-6 border border-slate-800 bg-[#0F172A]/90 space-y-3 hover:border-blue-500/60">
              <div className="w-10 h-10 rounded-2xl bg-blue-500/15 text-blue-400 flex items-center justify-center">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Corridor Travel Analytics</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Empirical charts tracking monthly demand curves, weekend vs weekday variations, and delay vs price surge correlations.
              </p>
            </TiltCard>

            <TiltCard className="p-6 border border-slate-800 bg-[#0F172A]/90 space-y-3 hover:border-rose-500/60">
              <div className="w-10 h-10 rounded-2xl bg-rose-500/15 text-rose-400 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Multi-Dimensional Risk Engine</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Calculates travel risk score (0-100) from Crowd, Delay, Weather, Holiday, Transport Availability, and Price risks.
              </p>
            </TiltCard>
          </div>
        </div>
      </section>

      {/* 6. Baseline Comparison Section */}
      <section id="baselines" className="py-16 px-4 sm:px-8 border-t border-slate-800 bg-[#090D16]">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider">
              Research Contribution
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Empirical Baseline Comparison
            </h2>
            <p className="text-slate-400 text-sm">
              Tested on 2,190 hold-out transit instances to validate predictive superiority
            </p>
          </div>

          <GlassCard className="p-6 sm:p-8 border border-slate-800 bg-[#0F172A]/90 overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-xs">
                  <th className="py-3 px-3">Approach</th>
                  <th className="py-3 px-3">Model Description</th>
                  <th className="py-3 px-3">MAE</th>
                  <th className="py-3 px-3">RMSE</th>
                  <th className="py-3 px-3">R² Score</th>
                  <th className="py-3 px-3">Crowd Accuracy</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-850 text-slate-300">
                  <td className="py-3 px-3 font-bold text-white">Baseline 1: Rule-Based</td>
                  <td className="py-3 px-3 text-slate-400 text-xs">Fixed holiday heuristic: Holiday = High crowd</td>
                  <td className="py-3 px-3 font-mono">14.34</td>
                  <td className="py-3 px-3 font-mono">17.19</td>
                  <td className="py-3 px-3 font-mono text-rose-400 font-bold">-0.78</td>
                  <td className="py-3 px-3 font-bold text-rose-400">15.9%</td>
                </tr>
                <tr className="border-b border-slate-850 text-slate-300">
                  <td className="py-3 px-3 font-bold text-white">Baseline 2: ML without Holidays</td>
                  <td className="py-3 px-3 text-slate-400 text-xs">Random Forest with only route & vehicle parameters</td>
                  <td className="py-3 px-3 font-mono">2.719</td>
                  <td className="py-3 px-3 font-mono">3.318</td>
                  <td className="py-3 px-3 font-mono font-bold text-slate-200">0.934</td>
                  <td className="py-3 px-3 font-bold text-slate-200">93.3%</td>
                </tr>
                <tr className="border-b border-slate-850 text-slate-300">
                  <td className="py-3 px-3 font-bold text-white">Baseline 3: ML + Holiday/Weekend Only</td>
                  <td className="py-3 px-3 text-slate-400 text-xs">ML trained solely on holiday & weekend flags</td>
                  <td className="py-3 px-3 font-mono">6.399</td>
                  <td className="py-3 px-3 font-mono">7.659</td>
                  <td className="py-3 px-3 font-mono font-bold text-slate-200">0.647</td>
                  <td className="py-3 px-3 font-bold text-slate-200">83.1%</td>
                </tr>
                <tr className="bg-blue-600/15 font-bold text-white border-l-4 border-cyan-400">
                  <td className="py-3.5 px-3 text-cyan-400 font-black">Proposed Method: Multi-Factor ML</td>
                  <td className="py-3.5 px-3 text-slate-300 text-xs">Integrated RF + Holiday Proximity + Events + Season + Availability</td>
                  <td className="py-3.5 px-3 font-mono text-emerald-400 font-black">1.826</td>
                  <td className="py-3.5 px-3 font-mono text-emerald-400 font-black">2.224</td>
                  <td className="py-3.5 px-3 font-mono text-emerald-400 font-black">0.970</td>
                  <td className="py-3.5 px-3 text-emerald-400 font-black">95.8%</td>
                </tr>
              </tbody>
            </table>
          </GlassCard>
        </div>
      </section>

      {/* 7. Demonstration Walkthrough */}
      <section id="walkthrough" className="py-16 px-4 sm:px-8 border-t border-slate-800 bg-[#0B1120]">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Demonstration Walkthrough
            </h2>
            <p className="text-slate-400 text-sm">
              Evaluate the complete traveler prediction workflow in 6 clear steps:
            </p>
          </div>

          <GlassCard className="p-6 sm:p-8 border border-slate-800 bg-[#0F172A]/90 space-y-4 text-xs sm:text-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1.5 shadow-sm">
                <span className="font-bold text-cyan-400 block">Step 1: Sign In</span>
                <p className="text-slate-300">Click <strong>1-Click Demo Login</strong> to access the dashboard instantly as Gouthami.</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1.5 shadow-sm">
                <span className="font-bold text-cyan-400 block">Step 2: Enter Trip Coordinates</span>
                <p className="text-slate-300">Select <strong>Hyderabad → Vijayawada</strong> on <strong>October 20, 2026</strong> (Dussehra day).</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1.5 shadow-sm">
                <span className="font-bold text-cyan-400 block">Step 3: Predict Demand</span>
                <p className="text-slate-300">Observe Demand Score (84% VERY HIGH) and feature breakdown (+25 festival, +20 historical).</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1.5 shadow-sm">
                <span className="font-bold text-cyan-400 block">Step 4: Alternative Dates</span>
                <p className="text-slate-300">Review the -2 to +2 days comparison table showing lower crowds on Oct 18 and Oct 22.</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1.5 shadow-sm">
                <span className="font-bold text-cyan-400 block">Step 5: Ask Travel AI</span>
                <p className="text-slate-300">Ask: <em>"Will it be crowded next weekend?"</em> and inspect structured cards and interactive buttons.</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1.5 shadow-sm">
                <span className="font-bold text-cyan-400 block">Step 6: Explore 3D Routes & Calendar</span>
                <p className="text-slate-300">Inspect Route A/B/C trade-offs, transport mode cards, and the 3D holiday calendar.</p>
              </div>
            </div>

            <div className="pt-4 text-center">
              <AnimatedButton
                onClick={handleLaunchDashboard}
                className="px-8 py-3.5 text-sm inline-flex"
              >
                <span>Launch 3D Travel Dashboard Now</span>
                <ArrowRight className="w-4 h-4" />
              </AnimatedButton>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* 8. Footer */}
      <footer className="py-8 px-4 sm:px-8 border-t border-slate-800 text-xs text-slate-400 text-center space-y-2 bg-[#070A12]">
        <p className="font-bold text-slate-200">AI-Powered Smart Traveler Prediction and Personalized Travel Assistant</p>
        <p className="text-slate-500">Built with React Vite, Three.js 3D WebGL, Node.js Express, MongoDB, Python FastAPI, and scikit-learn.</p>
      </footer>
    </div>
  );
}
