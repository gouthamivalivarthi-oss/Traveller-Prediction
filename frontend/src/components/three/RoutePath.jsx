import React from 'react';

export default function RoutePath({
  origin = 'Hyderabad',
  destination = 'Vijayawada',
  status = 'Active Flight Corridor'
}) {
  return (
    <div className="p-4 rounded-2xl glass-panel-warm border border-[#FF9F43]/30 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-[#FF7657]/15 flex items-center justify-center text-[#FF7657] font-bold text-xs">
          ●
        </div>
        <div>
          <span className="font-extrabold text-[#34261F] text-sm">{origin}</span>
          <span className="text-[10px] text-[#8C7162] block">Origin Transit Hub</span>
        </div>
      </div>

      <div className="flex-1 mx-4 flex flex-col items-center">
        <div className="w-full flex items-center justify-between text-[10px] text-[#FF9F43] font-bold px-1 mb-1">
          <span>{status}</span>
          <span>274 km</span>
        </div>
        <div className="w-full h-1.5 rounded-full bg-[#FF9F43]/20 relative overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[#FF7657] via-[#FF9F43] to-[#7BC67B] w-full animate-pulse" />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-right">
          <span className="font-extrabold text-[#34261F] text-sm">{destination}</span>
          <span className="text-[10px] text-[#8C7162] block">Destination</span>
        </div>
        <div className="w-8 h-8 rounded-xl bg-[#7BC67B]/20 flex items-center justify-center text-[#7BC67B] font-bold text-xs">
          ▲
        </div>
      </div>
    </div>
  );
}
