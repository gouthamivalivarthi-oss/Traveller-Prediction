import React from 'react';

export default function RoutePath({
  origin = 'Hyderabad',
  destination = 'Vijayawada',
  status = 'Active Transit Corridor'
}) {
  return (
    <div className="p-4 rounded-2xl glass-panel border border-slate-700/60 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-xs">
          ●
        </div>
        <div>
          <span className="font-extrabold text-white text-sm">{origin}</span>
          <span className="text-[10px] text-slate-400 block">Origin Transit Hub</span>
        </div>
      </div>

      <div className="flex-1 mx-4 flex flex-col items-center">
        <div className="w-full flex items-center justify-between text-[10px] text-cyan-400 font-bold px-1 mb-1">
          <span>{status}</span>
          <span>274 km</span>
        </div>
        <div className="w-full h-1.5 rounded-full bg-slate-800 relative overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-400 w-full animate-pulse" />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-right">
          <span className="font-extrabold text-white text-sm">{destination}</span>
          <span className="text-[10px] text-slate-400 block">Destination</span>
        </div>
        <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-xs">
          ▲
        </div>
      </div>
    </div>
  );
}
