import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Clock,
  DollarSign,
  Compass,
  Bot,
  Calendar,
  MapPin,
  ChevronRight,
  ShieldCheck,
  Plane,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';

import TravelGlobe from '../components/three/TravelGlobe';
import PredictionCard from '../components/dashboard/PredictionCard';
import RiskCard from '../components/dashboard/RiskCard';
import HolidayCard from '../components/dashboard/HolidayCard';
import TripCard from '../components/dashboard/TripCard';
import TiltCard from '../components/common/TiltCard';
import AnimatedButton from '../components/common/AnimatedButton';
import { predictTrip } from '../services/api';
import { useAuth } from '../context/AuthContext';

const corridorTrendData = [
  { day: 'Oct 15', demand: 46, crowd: 'Medium' },
  { day: 'Oct 16', demand: 54, crowd: 'Medium' },
  { day: 'Oct 17', demand: 68, crowd: 'High' },
  { day: 'Oct 18', demand: 76, crowd: 'High' },
  { day: 'Oct 19', demand: 86, crowd: 'Very High' },
  { day: 'Oct 20', demand: 92, crowd: 'Peak Fest' },
  { day: 'Oct 21', demand: 88, crowd: 'High' },
  { day: 'Oct 22', demand: 64, crowd: 'Medium' },
  { day: 'Oct 23', demand: 48, crowd: 'Low' }
];

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [activeOrigin, setActiveOrigin] = useState('Hyderabad');
  const [activeDestination, setActiveDestination] = useState('Vijayawada');
  const [loading, setLoading] = useState(false);

  const [predictionData, setPredictionData] = useState({
    origin: 'Hyderabad',
    destination: 'Vijayawada',
    travel_date: '2026-10-20',
    demand_score: 84,
    crowd_level: 'VERY HIGH',
    delay_risk: 'MEDIUM',
    price_risk: 'HIGH',
    holiday_factor: 0.85,
    overall_risk_score: 65,
    overall_risk_level: 'MEDIUM',
    holiday_info: {
      proximity_description: 'Dussehra / Navaratri Festival surge across NH65'
    },
    explanation: {
      summary: 'Demand Score 84/100 based on multi-factor analysis.',
      contributions: [
        { factor: 'Holiday / Festival Period', points: '+25', impact: 'High' },
        { factor: 'Historical Demand', points: '+20', impact: 'High' },
        { factor: 'Weekend Migration', points: '+15', impact: 'Medium' },
        { factor: 'Destination Pilgrimage', points: '+15', impact: 'Medium' },
        { factor: 'Seasonal Volume', points: '+10', impact: 'Medium' }
      ]
    },
    recommendations: [
      'Consider traveling on October 18 or 22 for 35% lower crowd volume.',
      'Book train seats early as Tatkal quotas are nearing exhaustion.'
    ]
  });

  const handlePredict = async (formValues) => {
    setLoading(true);
    try {
      setActiveOrigin(formValues.origin);
      setActiveDestination(formValues.destination);
      const res = await predictTrip(formValues);
      if (res.success && res.data) {
        setPredictionData(res.data);
      }
    } catch (err) {
      console.warn('Prediction run error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10 pb-20">
      {/* 1. Header (Section 6: Good Morning, Traveler 👋 Plan smarter. Travel better.) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#FF9F43]/20 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#34261F] tracking-tight">
            Good Morning, {user?.name || 'Traveler'} 👋
          </h1>
          <p className="text-xs sm:text-sm text-[#5A4032] mt-1 font-medium">
            Plan smarter. Travel better. Real-time pre-journey forecasting platform.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/chatbot')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl glass-panel-warm hover:border-[#FF7657] text-[#34261F] text-xs font-bold transition-all shadow-sm cursor-pointer"
          >
            <Bot className="w-4 h-4 text-[#FF7657]" />
            <span>AI Assistant</span>
          </button>
          <button
            onClick={() => navigate('/predict')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#FF7657] to-[#FF9F43] text-white text-xs font-bold shadow-md shadow-[#FF7657]/30 transition-all hover:scale-105 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Full Prediction</span>
          </button>
        </div>
      </div>

      {/* 2. Stunning 3D Hero Section (Section 4 & 5) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center rounded-3xl glass-panel-warm p-6 sm:p-10 border border-[#FF9F43]/30 shadow-xl relative overflow-hidden bg-gradient-to-br from-[#FFFDF8] via-[#FFF8ED] to-[#FFF1DD]">
        {/* Left Side: Headline & Quick Actions */}
        <div className="lg:col-span-6 space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FF9F43]/15 text-[#FF7657] text-xs font-extrabold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            3D Intelligent Travel Forecasting
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-[#34261F] tracking-tight leading-[1.15]">
            Travel Smarter.{' '}
            <span className="bg-gradient-to-r from-[#FF7657] to-[#FF9F43] bg-clip-text text-transparent">
              Predict Before You Go.
            </span>
          </h2>

          <p className="text-[#5A4032] text-sm sm:text-base font-medium leading-relaxed max-w-lg">
            AI-powered travel prediction for smarter dates, safer journeys and better travel decisions.
            Evaluating holiday surges, historical demand, and delay probabilities across transit corridors.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <AnimatedButton
              onClick={() => {
                const el = document.getElementById('prediction-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              variant="primary"
              className="text-sm px-6 py-3"
            >
              ✦ Predict My Journey
            </AnimatedButton>

            <button
              onClick={() => navigate('/chatbot')}
              className="px-5 py-3 rounded-2xl glass-panel-warm border border-[#FF9F43]/30 hover:border-[#FF7657] text-[#34261F] font-bold text-xs flex items-center gap-2 shadow-sm transition-all"
            >
              <Bot className="w-4 h-4 text-[#FF7657]" />
              <span>Ask Travel AI</span>
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-3 text-center">
            <div className="p-3 rounded-2xl bg-[#FFFDF8]/80 border border-[#FF9F43]/20">
              <span className="text-lg font-black text-[#FF7657] block">95.8%</span>
              <span className="text-[10px] font-bold text-[#8C7162]">Accuracy</span>
            </div>
            <div className="p-3 rounded-2xl bg-[#FFFDF8]/80 border border-[#FF9F43]/20">
              <span className="text-lg font-black text-[#FF9F43] block">R² = 0.97</span>
              <span className="text-[10px] font-bold text-[#8C7162]">Demand Score</span>
            </div>
            <div className="p-3 rounded-2xl bg-[#FFFDF8]/80 border border-[#FF9F43]/20">
              <span className="text-lg font-black text-[#7BC67B] block">10.9K+</span>
              <span className="text-[10px] font-bold text-[#8C7162]">Corridor Samples</span>
            </div>
          </div>
        </div>

        {/* Right Side: Reusable 3D TravelGlobe Component (Section 5) */}
        <div className="lg:col-span-6 relative flex items-center justify-center">
          <TravelGlobe
            activeOrigin={activeOrigin}
            activeDestination={activeDestination}
            height="440px"
            interactive={true}
          />
        </div>
      </div>

      {/* 3. Main Trip Prediction Card & Result Section (Section 7, 8, 9) */}
      <div id="prediction-section" className="space-y-6">
        <PredictionCard
          onPredict={handlePredict}
          loading={loading}
          result={predictionData}
          initialValues={{
            origin: activeOrigin,
            destination: activeDestination,
            travelDate: '2026-10-20'
          }}
        />
      </div>

      {/* 4. Multi-Dimensional Risk Radar & Corridor Area Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Journey Risk 3D Visualization (Section 18) */}
        <div className="lg:col-span-5">
          <RiskCard
            overallScore={predictionData.overall_risk_score || 62}
            overallLevel={predictionData.overall_risk_level || 'MEDIUM'}
          />
        </div>

        {/* Corridor Passenger Volume Chart */}
        <div className="lg:col-span-7">
          <TiltCard className="p-6 sm:p-8 border border-[#FF9F43]/30 bg-[#FFFDF8]/90 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#FF9F43]/20 pb-3">
              <div>
                <h3 className="font-extrabold text-[#34261F] text-base flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[#FF7657]" />
                  Corridor Passenger Demand Trend (Oct 15 – 23)
                </h3>
                <p className="text-xs text-[#5A4032]">
                  Visualizing transit curve across Dussehra & Navaratri holiday rush
                </p>
              </div>
              <span className="text-xs font-black px-2.5 py-1 rounded-xl bg-[#FF7657]/15 text-[#FF7657] border border-[#FF7657]/30 self-start sm:self-auto">
                Peak: Oct 20 (92%)
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={corridorTrendData}>
                  <defs>
                    <linearGradient id="warmGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FF7657" stopOpacity={0.6} />
                      <stop offset="95%" stopColor="#FF9F43" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#FDEBD4" />
                  <XAxis dataKey="day" stroke="#8C7162" fontSize={11} tickLine={false} />
                  <YAxis stroke="#8C7162" fontSize={11} tickLine={false} domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFDF8',
                      borderColor: '#FF9F43',
                      borderRadius: '16px',
                      color: '#34261F',
                      fontWeight: 'bold',
                      fontSize: '12px'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="demand"
                    stroke="#FF7657"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#warmGrad)"
                    name="Demand Score (%)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </TiltCard>
        </div>
      </div>

      {/* 5. Upcoming 3D Holiday Cards (Section 13) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-black text-[#34261F] flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#FF9F43]" />
              Upcoming High-Demand Festival Periods
            </h3>
            <p className="text-xs text-[#5A4032]">
              Configured holiday engine monitoring statewide passenger movement
            </p>
          </div>
          <button
            onClick={() => navigate('/holidays')}
            className="text-xs font-bold text-[#FF7657] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Full 3D Calendar</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <HolidayCard
            holiday={{
              name: 'Dussehra / Vijayadashami',
              date: '2026-10-20',
              location: 'Telangana & Andhra Pradesh',
              importance: 'high',
              type: 'festival'
            }}
            onClick={() => navigate('/holidays')}
          />
          <HolidayCard
            holiday={{
              name: 'Diwali / Deepavali',
              date: '2026-11-08',
              location: 'National Transit Hubs',
              importance: 'high',
              type: 'festival'
            }}
            onClick={() => navigate('/holidays')}
          />
          <HolidayCard
            holiday={{
              name: 'Sankranti / Pongal',
              date: '2027-01-14',
              location: 'South India Expressways',
              importance: 'high',
              type: 'festival'
            }}
            onClick={() => navigate('/holidays')}
          />
        </div>
      </div>

      {/* 6. Recent Monitored Trips (Section 20) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-black text-[#34261F] flex items-center gap-2">
              <Compass className="w-5 h-5 text-[#7BC67B]" />
              Your Monitored Journeys
            </h3>
            <p className="text-xs text-[#5A4032]">
              Continuously tracking crowd alerts and dynamic fare changes
            </p>
          </div>
          <button
            onClick={() => navigate('/trips')}
            className="text-xs font-bold text-[#FF7657] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View All Trips</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <TripCard
            trip={{
              origin: 'Hyderabad',
              destination: 'Vijayawada',
              travelDate: '2026-10-20',
              transportMode: 'train',
              passengers: 2,
              crowdLevel: 'HIGH',
              delayRisk: 'MEDIUM'
            }}
            onView={() => navigate('/predict')}
          />
          <TripCard
            trip={{
              origin: 'Bangalore',
              destination: 'Goa',
              travelDate: '2026-11-15',
              transportMode: 'flight',
              passengers: 1,
              crowdLevel: 'MEDIUM',
              delayRisk: 'LOW'
            }}
            onView={() => navigate('/predict')}
          />
        </div>
      </div>
    </div>
  );
}
