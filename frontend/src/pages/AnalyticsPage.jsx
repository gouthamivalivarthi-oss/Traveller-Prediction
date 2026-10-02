import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  Calendar,
  MapPin,
  Clock,
  Sparkles,
  Compass,
  ArrowUpRight
} from 'lucide-react';
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { getAnalytics } from '../services/api';
import GlassCard from '../components/common/GlassCard';
import TiltCard from '../components/common/TiltCard';

// Warm palette: Coral, Orange, Golden Yellow, Soft Green, Sage
const WARM_COLORS = ['#FF7657', '#FF9F43', '#FFC857', '#7BC67B', '#A8C99B'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#FFFDF8] p-3 rounded-2xl shadow-xl border border-[#F2DECC] text-xs">
        <p className="font-bold text-[#34261F] mb-1">{label}</p>
        {payload.map((entry, index) => (
          <p key={`tooltip-${index}`} className="flex items-center gap-2 font-medium" style={{ color: entry.color || entry.fill }}>
            <span>{entry.name}:</span>
            <span className="font-bold">{entry.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function AnalyticsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const res = await getAnalytics();
      if (res.success && res.data) {
        setData(res.data);
      }
    } catch (err) {
      console.warn('Analytics loading error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex items-center gap-3 text-[#FF7657]">
          <Sparkles className="w-5 h-5 animate-spin" />
          <span className="text-sm font-semibold text-[#5A4032]">Aggregating travel demand data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF7657]/10 border border-[#FF7657]/25 text-[#FF7657] text-xs font-bold uppercase tracking-wider mb-2">
            <BarChart3 className="w-3.5 h-3.5" />
            3D Corridor Intelligence
          </div>
          <h1 className="text-3xl font-extrabold text-[#34261F] tracking-tight">Travel Analytics & Trends</h1>
          <p className="text-sm text-[#7A5843] mt-1 max-w-xl">
            Empirical demand distributions across festival seasons, weekend demand differentials, destination rankings, and transit modal share.
          </p>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#FFFDF8] border border-[#F2DECC] shadow-sm text-xs font-semibold text-[#5A4032]">
          <Compass className="w-4 h-4 text-[#FF7657]" />
          <span>Active ML Corridors: <strong>14 Major Hubs</strong></span>
        </div>
      </div>

      {/* Row 1: Monthly Demand & Holiday vs Normal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Demand */}
        <GlassCard className="p-6 border border-[#F2DECC]">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-base font-bold text-[#34261F] flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#FF7657]" />
              Travel Demand by Month (2026)
            </h3>
            <span className="text-[11px] font-bold text-[#FF7657] bg-[#FF7657]/10 px-2.5 py-0.5 rounded-full">
              Annual Cycle
            </span>
          </div>
          <p className="text-xs text-[#7A5843] mb-6">
            Peak surge windows evident during October (Dussehra), November (Diwali), and January (Sankranti).
          </p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.monthlyDemand}>
                <defs>
                  <linearGradient id="warmDemandGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF7657" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#FFC857" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0DFC8" opacity={0.6} />
                <XAxis dataKey="month" stroke="#8C6E54" fontSize={11} tickLine={false} />
                <YAxis stroke="#8C6E54" fontSize={11} domain={[0, 100]} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="demand"
                  stroke="#FF7657"
                  strokeWidth={2.5}
                  fill="url(#warmDemandGrad)"
                  name="Demand Score (%)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Holiday vs Normal Days */}
        <GlassCard className="p-6 border border-[#F2DECC]">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-base font-bold text-[#34261F] flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#FF9F43]" />
              Demand & Delay: Holiday vs Normal Days
            </h3>
            <span className="text-[11px] font-bold text-[#FF9F43] bg-[#FF9F43]/10 px-2.5 py-0.5 rounded-full">
              Surge Ratio
            </span>
          </div>
          <p className="text-xs text-[#7A5843] mb-6">
            Comparing demand intensity and average delays (minutes) across calendar event types.
          </p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.holidayVsNormal}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0DFC8" opacity={0.6} />
                <XAxis dataKey="category" stroke="#8C6E54" fontSize={11} tickLine={false} />
                <YAxis stroke="#8C6E54" fontSize={11} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="demand" fill="#FF7657" radius={[6, 6, 0, 0]} name="Demand (%)" />
                <Bar dataKey="avgDelay" fill="#FFC857" radius={[6, 6, 0, 0]} name="Avg Delay (Mins)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      {/* Row 2: Weekend vs Weekday & Destination Demand */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekend vs Weekday */}
        <GlassCard className="p-6 border border-[#F2DECC]">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-base font-bold text-[#34261F] flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#FF9F43]" />
              Day-of-Week Crowd & Demand Index
            </h3>
            <span className="text-[11px] font-bold text-[#7BC67B] bg-[#7BC67B]/10 px-2.5 py-0.5 rounded-full">
              Weekly Flow
            </span>
          </div>
          <p className="text-xs text-[#7A5843] mb-6">
            Friday through Sunday reflect sustained surges up to 84% crowd levels.
          </p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.weekendVsWeekday}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0DFC8" opacity={0.6} />
                <XAxis dataKey="day" stroke="#8C6E54" fontSize={11} tickLine={false} />
                <YAxis stroke="#8C6E54" fontSize={11} domain={[0, 100]} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="demand" fill="#FF9F43" radius={[6, 6, 0, 0]} name="Demand Index" />
                <Bar dataKey="crowdIndex" fill="#FFC857" radius={[6, 6, 0, 0]} name="Crowd Index" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Destination Demand */}
        <GlassCard className="p-6 border border-[#F2DECC]">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-base font-bold text-[#34261F] flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#7BC67B]" />
              Destination Transit Demand Ranking
            </h3>
            <span className="text-[11px] font-bold text-[#7BC67B] bg-[#7BC67B]/10 px-2.5 py-0.5 rounded-full">
              Top Volumes
            </span>
          </div>
          <p className="text-xs text-[#7A5843] mb-6">
            Corridors leading to Vijayawada, Tirupati, and Goa experience highest demand.
          </p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.destinationDemand} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#F0DFC8" opacity={0.6} />
                <XAxis type="number" stroke="#8C6E54" fontSize={11} domain={[0, 100]} tickLine={false} />
                <YAxis dataKey="destination" type="category" stroke="#8C6E54" fontSize={11} width={85} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="demandScore" fill="#7BC67B" radius={[0, 6, 6, 0]} name="Demand Score" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      {/* Row 3: Transport Mode Share & Crowd Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard className="lg:col-span-2 p-6 border border-[#F2DECC]">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-base font-bold text-[#34261F]">
              Transport Mode Volume & Satisfaction
            </h3>
            <span className="text-[11px] font-bold text-[#FF7657] bg-[#FF7657]/10 px-2.5 py-0.5 rounded-full">
              Modal Breakdown
            </span>
          </div>
          <p className="text-xs text-[#7A5843] mb-6">
            Train accommodates 42% share with 88% passenger satisfaction rating.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            {data.transportModeDemand?.map((t, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-[#FFF8ED] border border-[#F2DECC] shadow-sm hover:border-[#FF9F43] transition-all"
              >
                <span className="text-xs font-semibold text-[#7A5843] block">{t.mode}</span>
                <span className="text-2xl font-black text-[#34261F] mt-1 block">{t.share}%</span>
                <span className="text-[11px] font-bold text-[#7BC67B] mt-1 block">{t.satisfaction}% Satisfaction</span>
                <span className="text-[10px] text-[#A85832] font-medium block">Avg Delay: {t.avgDelayMin}m</span>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-6 border border-[#F2DECC] flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-[#34261F] mb-1">Crowd Level Breakdown</h3>
            <p className="text-xs text-[#7A5843] mb-4">Total monitored corridor days</p>

            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.crowdDistribution}
                    dataKey="percentage"
                    nameKey="level"
                    cx="50%"
                    cy="50%"
                    outerRadius={65}
                    innerRadius={38}
                    paddingAngle={3}
                  >
                    {data.crowdDistribution?.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={WARM_COLORS[index % WARM_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-3 border-t border-[#F2DECC]">
            {data.crowdDistribution?.map((c, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: WARM_COLORS[idx % WARM_COLORS.length] }} />
                <span className="text-[#5A4032] font-semibold">{c.level}: {c.percentage}%</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

