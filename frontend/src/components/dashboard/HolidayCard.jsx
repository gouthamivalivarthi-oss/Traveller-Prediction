import React from 'react';
import { Calendar, MapPin } from 'lucide-react';
import TiltCard from '../common/TiltCard';

export default function HolidayCard({ holiday, onClick = null }) {
  if (!holiday) return null;

  const isHigh = holiday.importance === 'high' || holiday.type === 'festival';

  return (
    <TiltCard
      onClick={onClick}
      className="p-5 border border-slate-800 bg-[#0F172A]/90 hover:border-blue-500/60 transition-all space-y-3"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-black text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5" />
          {holiday.date}
        </span>
        <span
          className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
            isHigh
              ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
              : 'bg-blue-500/15 text-cyan-400 border border-blue-500/30'
          }`}
        >
          {isHigh ? 'HIGH INFLUENCE' : 'MEDIUM'}
        </span>
      </div>

      <h4 className="text-base font-extrabold text-white">{holiday.name}</h4>

      <p className="text-xs text-slate-400 flex items-center gap-1">
        <MapPin className="w-3.5 h-3.5 text-blue-400" />
        <span>{holiday.location || 'National Corridor'}</span>
      </p>

      <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] font-semibold text-slate-400">
        <span>Demand Surge Likelihood:</span>
        <span className={isHigh ? 'text-rose-400 font-bold' : 'text-cyan-400 font-bold'}>
          {isHigh ? '85%+' : '60%+'}
        </span>
      </div>
    </TiltCard>
  );
}
