import React from 'react';
import { Bot } from 'lucide-react';

export default function TravelAIButton({ onClick, isOpen = false }) {
  return (
    <button
      onClick={onClick}
      className={`fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-full font-bold text-sm text-white shadow-2xl transition-all duration-300 flex items-center gap-2.5 cursor-pointer hover:scale-105 active:scale-95 ${
        isOpen
          ? 'bg-slate-900 text-slate-200 border border-slate-700 shadow-xl'
          : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 shadow-[0_12px_32px_rgba(37,99,235,0.45)] border border-white/20'
      }`}
    >
      <div className="relative">
        <Bot className="w-5 h-5 text-white" />
        <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
      </div>
      <span>{isOpen ? '✕ Close Assistant' : '✦ Ask Travel AI'}</span>
    </button>
  );
}
