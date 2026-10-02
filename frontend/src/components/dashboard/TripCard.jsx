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
    <TiltCard className="p-6 border border-[#FF9F43]/30 bg-[#FFFDF8] hover:border-[#FF7657] transition-all space-y-4">
      <div className="flex items-center justify-between border-b border-[#FF9F43]/20 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#FF7657] to-[#FF9F43] flex items-center justify-center text-white shadow-sm">
            <Plane className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-black text-[#34261F] text-base">
              {trip.origin} → {trip.destination}
            </h4>
            <span className="text-[10px] text-[#8C7162] block">
              {trip.transportMode ? trip.transportMode.toUpperCase() : 'TRAIN'} • {trip.passengers || 2} Travelers
            </span>
          </div>
        </div>

        {onDelete && (
          <button
            onClick={() => onDelete(trip._id)}
            className="p-1.5 rounded-lg text-[#8C7162] hover:text-[#FF7657] hover:bg-[#FFF8ED] transition-colors"
            title="Delete Trip"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="flex items-center gap-2 text-xs text-[#5A4032] font-semibold">
        <Calendar className="w-3.5 h-3.5 text-[#FF9F43]" />
        <span>{trip.travelDate}</span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs py-2">
        <div className="p-2 rounded-xl bg-[#FFF8ED] border border-[#FF9F43]/20">
          <span className="text-[10px] text-[#8C7162] block">Demand</span>
          <span className="font-extrabold text-[#FF7657]">{trip.crowdLevel || 'HIGH'}</span>
        </div>
        <div className="p-2 rounded-xl bg-[#FFF8ED] border border-[#FF9F43]/20">
          <span className="text-[10px] text-[#8C7162] block">Risk</span>
          <span className="font-extrabold text-[#FF9F43]">{trip.delayRisk || 'MEDIUM'}</span>
        </div>
      </div>

      {onView && (
        <button
          onClick={() => onView(trip)}
          className="w-full py-2.5 rounded-xl bg-[#FFF8ED] hover:bg-[#FF7657] hover:text-white text-[#FF7657] border border-[#FF7657]/30 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
        >
          <span>View Trip Details</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      )}
    </TiltCard>
  );
}
