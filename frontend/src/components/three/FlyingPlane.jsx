import React from 'react';
import { Plane } from 'lucide-react';

export default function FlyingPlane({ className = '' }) {
  return (
    <div className={`relative inline-block ${className}`}>
      <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FF7657] to-[#FF9F43] flex items-center justify-center text-white shadow-lg shadow-[#FF7657]/30 transform rotate-45 hover:rotate-12 transition-transform duration-300">
        <Plane className="w-5 h-5 -rotate-45" />
      </div>
    </div>
  );
}
