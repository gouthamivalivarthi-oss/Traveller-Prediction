import React from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle2 } from 'lucide-react';
import TiltCard from '../common/TiltCard';

export default function RiskCard({
  overallScore = 62,
  overallLevel = 'MEDIUM',
  components = null
}) {
  const factors = components || {
    crowd: { name: 'Crowd Pressure', score: 70, color: '#FF7657' },
    delay: { name: 'Transit Delay', score: 50, color: '#FF9F43' },
    weather: { name: 'Weather Conditions', score: 30, color: '#7BC67B' },
    holiday: { name: 'Holiday Surge', score: 80, color: '#FF7657' },
    price: { name: 'Dynamic Fare Surge', score: 45, color: '#FFC857' }
  };

  const getLevelColor = () => {
    if (overallScore >= 70) return '#FF7657'; // Coral
    if (overallScore >= 45) return '#FF9F43'; // Orange
    return '#7BC67B'; // Soft Green
  };

  return (
    <TiltCard className="p-6 border border-[#FF9F43]/30 bg-[#FFFDF8]/90 space-y-5">
      <div className="flex items-center justify-between border-b border-[#FF9F43]/20 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-[#FF7657]" />
            <h3 className="font-extrabold text-[#34261F] text-base">Journey Risk 3D Radar</h3>
          </div>
          <p className="text-xs text-[#5A4032]">Synthesizing 6 key travel risk dimensions</p>
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
        {/* 3D Circular Gauge Visual (Section 18) */}
        <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="#FFF1DD"
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
            <span className="text-3xl font-black text-[#34261F]">{overallScore}</span>
            <span className="text-[10px] font-bold text-[#8C7162] uppercase tracking-wider">
              / 100 Risk
            </span>
          </div>
        </div>

        {/* 5 Dimensional Factor Bars (Crowd 70, Delay 50, Weather 30, Holiday 80, Price 45) */}
        <div className="flex-1 w-full space-y-2.5">
          {Object.entries(factors).map(([key, item], idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex items-center justify-between text-xs font-bold text-[#34261F]">
                <span>{item.name || key.toUpperCase()}</span>
                <span style={{ color: item.color || '#FF9F43' }}>{item.score || 50}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#FFF1DD] overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${item.score || 50}%`,
                    backgroundColor: item.color || '#FF9F43'
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
