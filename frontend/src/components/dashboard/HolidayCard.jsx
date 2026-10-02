import React from 'react';
import { Calendar, MapPin, AlertTriangle } from 'lucide-react';
import TiltCard from '../common/TiltCard';

export default function HolidayCard({ holiday, onClick = null }) {
  if (!holiday) return null;

  const isHigh = holiday.importance === 'high' || holiday.type === 'festival';

  return (
    <TiltCard
      onClick={onClick}
      className="p-5 border border-[#FF9F43]/30 bg-[#FFFDF8] hover:border-[#FF7657] transition-all space-y-3"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-black text-[#FF7657] uppercase tracking-wider flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5" />
          {holiday.date}
        </span>
        <span
          className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
            isHigh
              ? 'bg-[#FF7657]/15 text-[#FF7657] border border-[#FF7657]/30'
              : 'bg-[#FF9F43]/15 text-[#FF9F43] border border-[#FF9F43]/30'
          }`}
        >
          {isHigh ? 'HIGH INFLUENCE' : 'MEDIUM'}
        </span>
      </div>

      <h4 className="text-base font-extrabold text-[#34261F]">{holiday.name}</h4>

      <p className="text-xs text-[#5A4032] flex items-center gap-1">
        <MapPin className="w-3.5 h-3.5 text-[#FF9F43]" />
        <span>{holiday.location || 'National Corridor'}</span>
      </p>

      <div className="pt-2 border-t border-[#FF9F43]/20 flex items-center justify-between text-[11px] font-semibold text-[#8C7162]">
        <span>Demand Surge Likelihood:</span>
        <span className={isHigh ? 'text-[#FF7657] font-bold' : 'text-[#FF9F43] font-bold'}>
          {isHigh ? '85%+' : '60%+'}
        </span>
      </div>
    </TiltCard>
  );
}
