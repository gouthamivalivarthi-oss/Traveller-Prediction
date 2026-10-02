import React from 'react';
import { Bot, Sparkles } from 'lucide-react';

export default function TravelAIButton({ onClick, isOpen = false }) {
  return (
    <button
      onClick={onClick}
      className={`fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-full font-extrabold text-sm text-white shadow-2xl transition-all duration-300 flex items-center gap-2.5 cursor-pointer hover:scale-105 active:scale-95 ${
        isOpen
          ? 'bg-[#34261F] text-white shadow-[0_8px_24px_rgba(52,38,31,0.4)]'
          : 'bg-gradient-to-r from-[#FF7657] via-[#FF9F43] to-[#FF7657] shadow-[0_12px_32px_rgba(255,118,87,0.5)] border border-white/20'
      }`}
    >
      <div className="relative">
        <Bot className="w-5 h-5 text-white" />
        <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#FFC857] animate-ping" />
      </div>
      <span>{isOpen ? '✕ Close Assistant' : '✦ Ask Travel AI'}</span>
    </button>
  );
}
