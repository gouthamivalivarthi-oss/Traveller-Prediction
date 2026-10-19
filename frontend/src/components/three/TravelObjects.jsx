import React from 'react';
import { Compass, Plane, Luggage, MapPin, Ticket, Camera, Train, ShieldCheck } from 'lucide-react';

export default function TravelObjects({ type = 'compass', className = '', size = 28 }) {
  const icons = {
    compass: Compass,
    plane: Plane,
    suitcase: Luggage,
    pin: MapPin,
    ticket: Ticket,
    camera: Camera,
    train: Train,
    shield: ShieldCheck
  };

  const IconComponent = icons[type] || Compass;

  return (
    <div
      className={`relative inline-flex items-center justify-center p-3 rounded-2xl bg-gradient-to-tr from-slate-900 to-slate-800 border border-slate-750 border-blue-500/25 shadow-lg shadow-blue-500/15 hover:rotate-6 hover:scale-110 transition-all duration-300 ${className}`}
    >
      <IconComponent className="text-cyan-400" size={size} />
      <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-blue-500 shadow-sm animate-pulse" />
    </div>
  );
}
