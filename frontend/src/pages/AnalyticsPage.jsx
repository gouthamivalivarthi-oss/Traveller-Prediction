import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  Calendar,
  MapPin,
  Clock,
  Sparkles,
  Compass
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

// Professional executive palette: Royal Blue, Cyber Cyan, Indigo, Emerald, Ice Blue
const TECH_COLORS = ['#3B82F6', '#06B6D4', '#6366F1', '#10B981', '#38BDF8'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0F172A] p-3 rounded-2xl shadow-2xl border border-slate-700 text-xs text-white">
        <p className="font-bold text-white mb-1">{label}</p>
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
        <div className="flex items-center gap-3 text-cyan-400">
          <Sparkles className="w-5 h-5 animate-spin" />
          <span className="text-sm font-semibold text-slate-400">Aggregating travel demand data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/25 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2">
            <BarChart3 className="w-3.5 h-3.5" />
            3D Corridor Intelligence
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Travel Analytics & Trends</h1>
          <p className="text-sm text-slate-400 mt-1 max-w-xl">
            Empirical demand distributions across festival seasons, weekend demand differentials, destination rankings, and transit modal share.
          </p>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm text-xs font-semibold text-slate-300">
          <Compass className="w-4 h-4 text-cyan-400" />
          <span>Active ML Corridors: <strong className="text-white">14 Major Hubs</strong></span>
        </div>
      </div>

      {/* Row 1: Monthly Demand & Holiday vs Normal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Demand */}
        <GlassCard className="p-6 border border-slate-800 bg-[#0F172A]/90">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-cyan-400" />
              Travel Demand by Month (2026)
            </h3>
            <span className="text-[11px] font-bold text-cyan-400 bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-500/25">
              Annual Cycle
            </span>
          </div>
          <p className="text-xs text-slate-400 mb-6">
            Peak surge windows evident during October (Dussehra), November (Diwali), and January (Sankranti).
          </p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.monthlyDemand}>
                <defs>
                  <linearGradient id="coolDemandGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" opacity={0.6} />
                <XAxis dataKey="month" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} domain={[0, 100]} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="demand"
                  stroke="#38BDF8"
                  strokeWidth={2.5}
                  fill="url(#coolDemandGrad)"
                  name="Demand Score (%)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Holiday vs Normal Days */}
        <GlassCard className="p-6 border border-slate-800 bg-[#0F172A]/90">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-400" />
              Demand & Delay: Holiday vs Normal Days
            </h3>
            <span className="text-[11px] font-bold text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/25">
              Surge Ratio
            </span>
          </div>
          <p className="text-xs text-slate-400 mb-6">
            Comparing demand intensity and average delays (minutes) across calendar event types.
          </p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.holidayVsNormal}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" opacity={0.6} />
                <XAxis dataKey="category" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="demand" fill="#3B82F6" radius={[6, 6, 0, 0]} name="Demand (%)" />
                <Bar dataKey="avgDelay" fill="#06B6D4" radius={[6, 6, 0, 0]} name="Avg Delay (Mins)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      {/* Row 2: Weekend vs Weekday & Destination Demand */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekend vs Weekday */}
        <GlassCard className="p-6 border border-slate-800 bg-[#0F172A]/90">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              Day-of-Week Crowd & Demand Index
            </h3>
            <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/25">
              Weekly Flow
            </span>
          </div>
          <p className="text-xs text-slate-400 mb-6">
            Friday through Sunday reflect sustained surges up to 84% crowd levels.
          </p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.weekendVsWeekday}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" opacity={0.6} />
                <XAxis dataKey="day" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} domain={[0, 100]} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="demand" fill="#3B82F6" radius={[6, 6, 0, 0]} name="Demand Index" />
                <Bar dataKey="crowdIndex" fill="#06B6D4" radius={[6, 6, 0, 0]} name="Crowd Index" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Destination Demand */}
        <GlassCard className="p-6 border border-slate-800 bg-[#0F172A]/90">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-400" />
              Destination Transit Demand Ranking
            </h3>
            <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/25">
              Top Volumes
            </span>
          </div>
          <p className="text-xs text-slate-400 mb-6">
            Corridors leading to Vijayawada, Tirupati, and Goa experience highest demand.
          </p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.destinationDemand} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" opacity={0.6} />
                <XAxis type="number" stroke="#64748B" fontSize={11} domain={[0, 100]} tickLine={false} />
                <YAxis dataKey="destination" type="category" stroke="#64748B" fontSize={11} width={85} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="demandScore" fill="#10B981" radius={[0, 6, 6, 0]} name="Demand Score" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      {/* Row 3: Transport Mode Share & Crowd Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard className="lg:col-span-2 p-6 border border-slate-800 bg-[#0F172A]/90">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-base font-bold text-white">
              Transport Mode Volume & Satisfaction
            </h3>
            <span className="text-[11px] font-bold text-cyan-400 bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-500/25">
              Modal Breakdown
            </span>
          </div>
          <p className="text-xs text-slate-400 mb-6">
            Train accommodates 42% share with 88% passenger satisfaction rating.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            {data.transportModeDemand?.map((t, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm hover:border-blue-500/60 transition-all"
              >
                <span className="text-xs font-semibold text-slate-400 block">{t.mode}</span>
                <span className="text-2xl font-black text-white mt-1 block">{t.share}%</span>
                <span className="text-[11px] font-bold text-emerald-400 mt-1 block">{t.satisfaction}% Satisfaction</span>
                <span className="text-[10px] text-cyan-400 font-medium block">Avg Delay: {t.avgDelayMin}m</span>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-6 border border-slate-800 bg-[#0F172A]/90 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white mb-1">Crowd Level Breakdown</h3>
            <p className="text-xs text-slate-400 mb-4">Total monitored corridor days</p>

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
                      <Cell key={`cell-${index}`} fill={TECH_COLORS[index % TECH_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-3 border-t border-slate-800">
            {data.crowdDistribution?.map((c, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: TECH_COLORS[idx % TECH_COLORS.length] }} />
                <span className="text-slate-300 font-semibold">{c.level}: {c.percentage}%</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
