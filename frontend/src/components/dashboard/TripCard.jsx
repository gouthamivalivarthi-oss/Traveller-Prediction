import React from 'react';
import { Plane, Calendar, ArrowRight, Trash2 } from 'lucide-react';
import TiltCard from '../common/TiltCard';

export default function TripCard({
  trip,
  onView = null,
  onDelete = null
}) {
  if (!trip) return null;

  return (
    <TiltCard className="p-6 border border-slate-800 bg-[#0F172A]/90 hover:border-blue-500/60 transition-all space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-sm">
            <Plane className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-extrabold text-white text-base">
              {trip.origin} → {trip.destination}
            </h4>
            <span className="text-[10px] text-slate-400 block">
              {trip.transportMode ? trip.transportMode.toUpperCase() : 'TRAIN'} • {trip.passengers || 2} Travelers
            </span>
          </div>
        </div>

        {onDelete && (
          <button
            onClick={() => onDelete(trip._id)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
            title="Delete Trip"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="flex items-center gap-2 text-xs text-slate-300 font-semibold">
        <Calendar className="w-3.5 h-3.5 text-cyan-400" />
        <span>{trip.travelDate}</span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs py-2">
        <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-[10px] text-slate-400 block">Demand</span>
          <span className="font-extrabold text-rose-400">{trip.crowdLevel || 'HIGH'}</span>
        </div>
        <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-[10px] text-slate-400 block">Risk</span>
          <span className="font-extrabold text-amber-400">{trip.delayRisk || 'MEDIUM'}</span>
        </div>
      </div>

      {onView && (
        <button
          onClick={() => onView(trip)}
          className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-blue-600 hover:text-white text-cyan-400 border border-blue-500/30 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
        >
          <span>View Trip Details</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      )}
    </TiltCard>
  );
}
