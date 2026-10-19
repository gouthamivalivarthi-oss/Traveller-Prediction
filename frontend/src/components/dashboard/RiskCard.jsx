import React from 'react';
import { ShieldAlert } from 'lucide-react';
import TiltCard from '../common/TiltCard';

export default function RiskCard({
  overallScore = 62,
  overallLevel = 'MEDIUM',
  components = null
}) {
  const factors = components || {
    crowd: { name: 'Crowd Pressure', score: 70, color: '#F43F5E' },
    delay: { name: 'Transit Delay', score: 50, color: '#F59E0B' },
    weather: { name: 'Weather Conditions', score: 30, color: '#06B6D4' },
    holiday: { name: 'Holiday Surge', score: 80, color: '#6366F1' },
    price: { name: 'Dynamic Fare Surge', score: 45, color: '#3B82F6' }
  };

  const getLevelColor = () => {
    if (overallScore >= 70) return '#F43F5E'; // Rose
    if (overallScore >= 45) return '#F59E0B'; // Amber
    return '#10B981'; // Emerald
  };

  return (
    <TiltCard className="p-6 border border-slate-800 bg-[#0F172A]/90 space-y-5">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-cyan-400" />
            <h3 className="font-extrabold text-white text-base">Journey Risk 3D Radar</h3>
          </div>
          <p className="text-xs text-slate-400">Synthesizing 6 key travel risk dimensions</p>
        </div>
        <span
          className="text-xs font-black px-3 py-1 rounded-full uppercase"
          style={{
            backgroundColor: `${getLevelColor()}20`,
            color: getLevelColor(),
            border: `1px solid ${getLevelColor()}40`
          }}
        >
          {overallLevel} RISK
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-6">
        {/* 3D Circular Gauge Visual */}
        <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="rgba(148, 163, 184, 0.12)"
              strokeWidth="10"
              fill="transparent"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke={getLevelColor()}
              strokeWidth="10"
              strokeDasharray={251.2}
              strokeDashoffset={251.2 - (251.2 * overallScore) / 100}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-700 ease-out"
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-3xl font-black text-white">{overallScore}</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              / 100 Risk
            </span>
          </div>
        </div>

        {/* 5 Dimensional Factor Bars */}
        <div className="flex-1 w-full space-y-2.5">
          {Object.entries(factors).map(([key, item], idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                <span>{item.name || key.toUpperCase()}</span>
                <span style={{ color: item.color || '#3B82F6' }}>{item.score || 50}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${item.score || 50}%`,
                    backgroundColor: item.color || '#3B82F6'
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </TiltCard>
  );
}
