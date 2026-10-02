import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  Calendar,
  MapPin,
  Bot,
  Luggage,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Plane,
  Compass,
  BarChart3,
  LogIn,
  Layers,
  ChevronRight,
  Globe2
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
    <div className="min-h-screen bg-[#FFF8ED] text-[#34261F] selection:bg-[#FF7657] selection:text-white overflow-x-hidden relative">
      <FloatingParticles count={25} />

      {/* 1. Top Navigation Bar */}
      <header className="sticky top-0 z-50 w-full bg-[#FFFDF8]/90 border-b border-[#F2DECC] px-4 sm:px-8 py-4 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FF7657] to-[#FF9F43] flex items-center justify-center text-white shadow-md shadow-[#FF7657]/25 group-hover:scale-105 transition-transform">
              <Plane className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg text-[#34261F] tracking-tight">SmartTravel AI</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FF7657]/15 text-[#FF7657] border border-[#FF7657]/30">
                  3D R&D Platform
                </span>
              </div>
              <p className="text-[11px] text-[#7A5843] font-medium">3D Travel Prediction & Intelligence</p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-xs font-bold text-[#7A5843]">
            <a href="#about" className="hover:text-[#FF7657] transition-colors">About AI</a>
            <a href="#how-it-works" className="hover:text-[#FF7657] transition-colors">How It Works</a>
            <a href="#features" className="hover:text-[#FF7657] transition-colors">3D Features</a>
            <a href="#baselines" className="hover:text-[#FF7657] transition-colors">Model Metrics</a>
            <a href="#walkthrough" className="hover:text-[#FF7657] transition-colors">Demo Flow</a>
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
                  className="px-3.5 py-2 rounded-xl bg-[#FFFDF8] hover:bg-[#FFF8ED] text-[#7A5843] hover:text-[#34261F] text-xs font-bold border border-[#F2DECC] transition-colors cursor-pointer"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-2 rounded-xl text-xs font-bold text-[#7A5843] hover:text-[#34261F] hover:bg-[#FFF8ED] border border-[#F2DECC] transition-all flex items-center gap-1.5"
                >
                  <LogIn className="w-3.5 h-3.5 text-[#FF7657]" />
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
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FF7657]/10 border border-[#FF7657]/25 text-[#FF7657] text-xs font-bold uppercase tracking-wider shadow-inner">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              AI Traveler Prediction • ThreeUI 3D Engine
            </div>

            <h1 className="text-4xl sm:text-6xl font-black text-[#34261F] tracking-tight leading-[1.12]">
              Travel Smarter.<br />
              <span className="text-[#FF7657]">
                Predict Before You Go.
              </span>
            </h1>

            <p className="text-[#7A5843] text-base sm:text-lg leading-relaxed max-w-xl">
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
                className="px-6 py-3.5 rounded-2xl bg-[#FFFDF8] hover:bg-[#FFF8ED] text-[#A85832] text-sm font-bold border border-[#F2DECC] hover:border-[#FF9F43] flex items-center gap-2 transition-all shadow-sm"
              >
                <Bot className="w-4 h-4 text-[#FF7657]" />
                <span>✦ Ask Travel AI</span>
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-3 text-xs text-[#7A5843] font-semibold">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#7BC67B]" />
                10,950+ Empirical Records
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#7BC67B]" />
                95.8% Classification Accuracy
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#7BC67B]" />
                R² = 0.970 Regressor
              </span>
            </div>
          </div>

          {/* Right Column: Interactive 3D Travel Command Center */}
          <div className="lg:col-span-6 relative">
            <div className="relative">
              {/* Subtle warm glow behind container */}
              <div className="absolute -inset-1.5 bg-gradient-to-r from-[#FF7657]/20 via-[#FF9F43]/20 to-[#FFC857]/20 rounded-3xl blur-xl opacity-70 pointer-events-none" />
              <TravelGlobe height="460px" />
            </div>
          </div>
        </div>
      </section>

      {/* 3. The Problem & Core ML Principle Section */}
      <section id="about" className="py-16 px-4 sm:px-8 border-t border-[#F2DECC] bg-[#FFF8ED]">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#34261F]">
              The Scientific Principle: Why Simple Rules Fail
            </h2>
            <p className="text-[#7A5843] text-sm">
              Most travel apps claim <code className="bg-[#FFFDF8] px-1.5 py-0.5 rounded border border-[#F2DECC]">Holiday = High Crowd</code>. In reality, travel demand is a multi-dimensional system where a holiday is just one factor among many.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* The Flawed Approach */}
            <GlassCard className="p-6 sm:p-8 border border-[#FF7657]/30 bg-[#FFFDF8] space-y-4">
              <div className="flex items-center gap-2 text-[#FF7657]">
                <AlertTriangle className="w-5 h-5" />
                <h3 className="font-bold text-base text-[#34261F]">The Naive Rule-Based Approach</h3>
              </div>
              <p className="text-xs text-[#7A5843] leading-relaxed">
                Simple calculators assign a hardcoded surge whenever a calendar date contains a holiday flag.
              </p>
              <div className="p-3.5 rounded-xl bg-[#FFF8ED] border border-[#FF7657]/30 text-xs font-mono text-[#FF7657] font-bold">
                IF date == Holiday THEN Crowd = HIGH
              </div>
              <ul className="text-xs text-[#7A5843] space-y-2">
                <li>• Fails to account for weekend connectivity or mid-week holidays.</li>
                <li>• Ignores destination popularity (e.g. pilgrimage vs commercial hubs).</li>
                <li>• Result: <strong>MAE 14.34, Negative R² (-0.78), only 15.9% accuracy</strong>.</li>
              </ul>
            </GlassCard>

            {/* Our Multi-Factor Model */}
            <GlassCard className="p-6 sm:p-8 border border-[#7BC67B]/40 bg-[#FFFDF8] space-y-4">
              <div className="flex items-center gap-2 text-[#7BC67B]">
                <CheckCircle2 className="w-5 h-5 text-[#2D6A2E]" />
                <h3 className="font-bold text-base text-[#34261F]">Our Integrated Multi-Factor ML Pipeline</h3>
              </div>
              <p className="text-xs text-[#7A5843] leading-relaxed">
                A Random Forest regressor and classifier ensemble synthesizing 8 normalized features simultaneously.
              </p>
              <div className="p-3.5 rounded-xl bg-[#FFF8ED] border border-[#7BC67B]/40 text-xs font-mono text-[#2D6A2E] font-bold">
                Score = Holiday + Weekend + Seasonal + Historical + Events + Weather + Availability
              </div>
              <ul className="text-xs text-[#5A4032] space-y-2">
                <li>• Proximity factor detects whether a holiday connects to an extended long weekend.</li>
                <li>• Decomposes each prediction into explainable feature contribution points (+25, +20, +15).</li>
                <li>• Result: <strong>MAE 1.826, R² = 0.970, and 95.8% Classification Accuracy</strong>.</li>
              </ul>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* 4. Complete User Workflow */}
      <section id="how-it-works" className="py-16 px-4 sm:px-8 border-t border-[#F2DECC]">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF9F43]/15 border border-[#FF9F43]/30 text-[#A85832] text-xs font-bold uppercase tracking-wider">
              Step-by-Step Architecture
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#34261F]">
              End-to-End Prediction Workflow
            </h2>
            <p className="text-[#7A5843] text-sm">
              How the platform transforms trip coordinates into actionable 3D travel intelligence
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <TiltCard className="p-6 border border-[#F2DECC] space-y-3">
              <span className="w-8 h-8 rounded-full bg-[#FF7657]/15 text-[#FF7657] font-black text-sm flex items-center justify-center">1</span>
              <h4 className="text-base font-bold text-[#34261F]">Trip Input Collection</h4>
              <p className="text-xs text-[#7A5843] leading-relaxed">
                User enters origin, destination, target dates, vehicle mode, travelers, and personal preferences.
              </p>
            </TiltCard>

            <TiltCard className="p-6 border border-[#F2DECC] space-y-3">
              <span className="w-8 h-8 rounded-full bg-[#FF9F43]/15 text-[#FF9F43] font-black text-sm flex items-center justify-center">2</span>
              <h4 className="text-base font-bold text-[#34261F]">Feature Engineering</h4>
              <p className="text-xs text-[#7A5843] leading-relaxed">
                Holiday engine checks festival calendars, long weekends, weather alerts, and corridor booking rates.
              </p>
            </TiltCard>

            <TiltCard className="p-6 border border-[#F2DECC] space-y-3">
              <span className="w-8 h-8 rounded-full bg-[#FFC857]/20 text-[#A85832] font-black text-sm flex items-center justify-center">3</span>
              <h4 className="text-base font-bold text-[#34261F]">ML Inference</h4>
              <p className="text-xs text-[#7A5843] leading-relaxed">
                Random Forest models predict continuous Demand Score, Crowd Level, Delay Risk, and Fare Surge Risk.
              </p>
            </TiltCard>

            <TiltCard className="p-6 border border-[#F2DECC] space-y-3">
              <span className="w-8 h-8 rounded-full bg-[#7BC67B]/20 text-[#2D6A2E] font-black text-sm flex items-center justify-center">4</span>
              <h4 className="text-base font-bold text-[#34261F]">Alternative Dates & Advice</h4>
              <p className="text-xs text-[#7A5843] leading-relaxed">
                Compares neighboring dates (-2 to +2 days), suggests alternative routes, and saves to itinerary manager.
              </p>
            </TiltCard>
          </div>
        </div>
      </section>

      {/* 5. Key System Features Showcase */}
      <section id="features" className="py-16 px-4 sm:px-8 border-t border-[#F2DECC] bg-[#FFF8ED]">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#34261F]">
              Complete Feature Suite
            </h2>
            <p className="text-[#7A5843] text-sm">
              Comprehensive modules accessible from the 3D authenticated dashboard
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <TiltCard className="p-6 border border-[#F2DECC] space-y-3 hover:border-[#FF7657]">
              <div className="w-10 h-10 rounded-2xl bg-[#FF7657]/10 text-[#FF7657] flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#34261F]">Travel Demand Prediction</h3>
              <p className="text-xs text-[#7A5843] leading-relaxed">
                Categorizes demand into LOW, MEDIUM, HIGH, and VERY HIGH with feature contribution explanations (+25 holiday, +15 weekend).
              </p>
            </TiltCard>

            <TiltCard className="p-6 border border-[#F2DECC] space-y-3 hover:border-[#FF9F43]">
              <div className="w-10 h-10 rounded-2xl bg-[#FF9F43]/10 text-[#FF9F43] flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#34261F]">Alternative Date Analysis</h3>
              <p className="text-xs text-[#7A5843] leading-relaxed">
                Compares a 5-day window (-2 to +2 days) using actual model inferences to identify lower-crowd travel windows.
              </p>
            </TiltCard>

            <TiltCard className="p-6 border border-[#F2DECC] space-y-3 hover:border-[#FFC857]">
              <div className="w-10 h-10 rounded-2xl bg-[#FFC857]/20 text-[#A85832] flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#34261F]">Travel AI Assistant</h3>
              <p className="text-xs text-[#7A5843] leading-relaxed">
                Unified dialogue understanding across MultiWOZ and AirDialogue with interactive action buttons and inline prediction cards.
              </p>
            </TiltCard>

            <TiltCard className="p-6 border border-[#F2DECC] space-y-3 hover:border-[#7BC67B]">
              <div className="w-10 h-10 rounded-2xl bg-[#7BC67B]/20 text-[#2D6A2E] flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#34261F]">Smart Route Planner</h3>
              <p className="text-xs text-[#7A5843] leading-relaxed">
                Evaluates Route A (Express), Route B (Bypass), and Route C (Multi-Modal) alongside cross-modal trade-offs (Train, Bus, Flight, Car).
              </p>
            </TiltCard>

            <TiltCard className="p-6 border border-[#F2DECC] space-y-3 hover:border-[#FF9F43]">
              <div className="w-10 h-10 rounded-2xl bg-[#FF9F43]/10 text-[#FF9F43] flex items-center justify-center">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#34261F]">Corridor Travel Analytics</h3>
              <p className="text-xs text-[#7A5843] leading-relaxed">
                Empirical charts tracking monthly demand curves, weekend vs weekday variations, and delay vs price surge correlations.
              </p>
            </TiltCard>

            <TiltCard className="p-6 border border-[#F2DECC] space-y-3 hover:border-[#FF7657]">
              <div className="w-10 h-10 rounded-2xl bg-[#FF7657]/10 text-[#FF7657] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#34261F]">Multi-Dimensional Risk Engine</h3>
              <p className="text-xs text-[#7A5843] leading-relaxed">
                Calculates travel risk score (0-100) from Crowd, Delay, Weather, Holiday, Transport Availability, and Price risks.
              </p>
            </TiltCard>
          </div>
        </div>
      </section>

      {/* 6. Baseline Comparison Section */}
      <section id="baselines" className="py-16 px-4 sm:px-8 border-t border-[#F2DECC]">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7BC67B]/20 text-[#2D6A2E] border border-[#7BC67B]/40 text-xs font-bold uppercase tracking-wider">
              Research Contribution
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#34261F]">
              Empirical Baseline Comparison
            </h2>
            <p className="text-[#7A5843] text-sm">
              Tested on 2,190 hold-out transit instances to validate predictive superiority
            </p>
          </div>

          <GlassCard className="p-6 sm:p-8 border border-[#F2DECC] overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-[#F2DECC] text-[#7A5843] uppercase tracking-wider text-xs">
                  <th className="py-3 px-3">Approach</th>
                  <th className="py-3 px-3">Model Description</th>
                  <th className="py-3 px-3">MAE</th>
                  <th className="py-3 px-3">RMSE</th>
                  <th className="py-3 px-3">R² Score</th>
                  <th className="py-3 px-3">Crowd Accuracy</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-[#F2DECC]/60 text-[#5A4032]">
                  <td className="py-3 px-3 font-bold">Baseline 1: Rule-Based</td>
                  <td className="py-3 px-3 text-[#7A5843] text-xs">Fixed holiday heuristic: Holiday = High crowd</td>
                  <td className="py-3 px-3 font-mono">14.34</td>
                  <td className="py-3 px-3 font-mono">17.19</td>
                  <td className="py-3 px-3 font-mono text-[#FF7657] font-bold">-0.78</td>
                  <td className="py-3 px-3 font-bold text-[#FF7657]">15.9%</td>
                </tr>
                <tr className="border-b border-[#F2DECC]/60 text-[#5A4032]">
                  <td className="py-3 px-3 font-bold">Baseline 2: ML without Holidays</td>
                  <td className="py-3 px-3 text-[#7A5843] text-xs">Random Forest with only route & vehicle parameters</td>
                  <td className="py-3 px-3 font-mono">2.719</td>
                  <td className="py-3 px-3 font-mono">3.318</td>
                  <td className="py-3 px-3 font-mono font-bold">0.934</td>
                  <td className="py-3 px-3 font-bold">93.3%</td>
                </tr>
                <tr className="border-b border-[#F2DECC]/60 text-[#5A4032]">
                  <td className="py-3 px-3 font-bold">Baseline 3: ML + Holiday/Weekend Only</td>
                  <td className="py-3 px-3 text-[#7A5843] text-xs">ML trained solely on holiday & weekend flags</td>
                  <td className="py-3 px-3 font-mono">6.399</td>
                  <td className="py-3 px-3 font-mono">7.659</td>
                  <td className="py-3 px-3 font-mono font-bold">0.647</td>
                  <td className="py-3 px-3 font-bold">83.1%</td>
                </tr>
                <tr className="bg-[#FF7657]/15 font-bold text-[#34261F] border-l-4 border-[#FF7657]">
                  <td className="py-3.5 px-3 text-[#FF7657] font-black">Proposed Method: Multi-Factor ML</td>
                  <td className="py-3.5 px-3 text-[#5A4032] text-xs">Integrated RF + Holiday Proximity + Events + Season + Availability</td>
                  <td className="py-3.5 px-3 font-mono text-[#2D6A2E] font-black">1.826</td>
                  <td className="py-3.5 px-3 font-mono text-[#2D6A2E] font-black">2.224</td>
                  <td className="py-3.5 px-3 font-mono text-[#2D6A2E] font-black">0.970</td>
                  <td className="py-3.5 px-3 text-[#2D6A2E] font-black">95.8%</td>
                </tr>
              </tbody>
            </table>
          </GlassCard>
        </div>
      </section>

      {/* 7. Demonstration Walkthrough */}
      <section id="walkthrough" className="py-16 px-4 sm:px-8 border-t border-[#F2DECC] bg-[#FFF8ED]">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#34261F]">
              Demonstration Walkthrough
            </h2>
            <p className="text-[#7A5843] text-sm">
              Evaluate the complete traveler prediction workflow in 6 clear steps:
            </p>
          </div>

          <GlassCard className="p-6 sm:p-8 border border-[#F2DECC] space-y-4 text-xs sm:text-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-[#FFFDF8] border border-[#F2DECC] space-y-1.5 shadow-sm">
                <span className="font-bold text-[#FF7657] block">Step 1: Sign In</span>
                <p className="text-[#5A4032]">Click <strong>1-Click Demo Login</strong> to access the dashboard instantly as Gouthami.</p>
              </div>
              <div className="p-4 rounded-2xl bg-[#FFFDF8] border border-[#F2DECC] space-y-1.5 shadow-sm">
                <span className="font-bold text-[#FF7657] block">Step 2: Enter Trip Coordinates</span>
                <p className="text-[#5A4032]">Select <strong>Hyderabad → Vijayawada</strong> on <strong>October 20, 2026</strong> (Dussehra day).</p>
              </div>
              <div className="p-4 rounded-2xl bg-[#FFFDF8] border border-[#F2DECC] space-y-1.5 shadow-sm">
                <span className="font-bold text-[#FF7657] block">Step 3: Predict Demand</span>
                <p className="text-[#5A4032]">Observe Demand Score (84% VERY HIGH) and feature breakdown (+25 festival, +20 historical).</p>
              </div>
              <div className="p-4 rounded-2xl bg-[#FFFDF8] border border-[#F2DECC] space-y-1.5 shadow-sm">
                <span className="font-bold text-[#FF7657] block">Step 4: Alternative Dates</span>
                <p className="text-[#5A4032]">Review the -2 to +2 days comparison table showing lower crowds on Oct 18 and Oct 22.</p>
              </div>
              <div className="p-4 rounded-2xl bg-[#FFFDF8] border border-[#F2DECC] space-y-1.5 shadow-sm">
                <span className="font-bold text-[#FF7657] block">Step 5: Ask Travel AI</span>
                <p className="text-[#5A4032]">Ask: <em>"Will it be crowded next weekend?"</em> and inspect structured cards and interactive buttons.</p>
              </div>
              <div className="p-4 rounded-2xl bg-[#FFFDF8] border border-[#F2DECC] space-y-1.5 shadow-sm">
                <span className="font-bold text-[#FF7657] block">Step 6: Explore 3D Routes & Calendar</span>
                <p className="text-[#5A4032]">Inspect Route A/B/C trade-offs, transport mode cards, and the 3D holiday calendar.</p>
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
      <footer className="py-8 px-4 sm:px-8 border-t border-[#F2DECC] text-xs text-[#7A5843] text-center space-y-2 bg-[#FFFDF8]">
        <p className="font-bold text-[#34261F]">AI-Powered Smart Traveler Prediction and Personalized Travel Assistant</p>
        <p>Built with React Vite, Three.js 3D WebGL, Node.js Express, MongoDB, Python FastAPI, and scikit-learn.</p>
      </footer>
    </div>
  );
}
