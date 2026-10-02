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
      className={`relative inline-flex items-center justify-center p-3 rounded-2xl bg-gradient-to-tr from-[#FFFDF8] to-[#FFF1DD] border border-[#FF9F43]/30 shadow-[0_8px_20px_-4px_rgba(255,159,67,0.25)] hover:rotate-6 hover:scale-110 transition-all duration-300 ${className}`}
    >
      <IconComponent className="text-[#FF7657]" size={size} />
      <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#FFC857] shadow-sm animate-pulse" />
    </div>
  );
}
