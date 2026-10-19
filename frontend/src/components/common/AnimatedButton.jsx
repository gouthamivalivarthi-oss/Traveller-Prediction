import React from 'react';

export default function AnimatedButton({
  children,
  onClick = null,
  disabled = false,
  variant = 'primary', // 'primary' (electric blue/indigo), 'secondary' (dark slate), 'outline'
  icon = null,
  className = '',
  type = 'button'
}) {
  const baseStyles = 'relative inline-flex items-center justify-center gap-2 font-bold rounded-2xl px-6 py-3.5 text-sm transition-all duration-300 cursor-pointer shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 text-white shadow-[0_8px_24px_-4px_rgba(37,99,235,0.45)] hover:shadow-[0_12px_32px_-4px_rgba(6,182,212,0.55)] hover:-translate-y-0.5 border border-white/20',
    secondary: 'bg-slate-800/90 hover:bg-slate-700/90 text-white border border-slate-700 shadow-[0_6px_20px_-4px_rgba(0,0,0,0.3)] hover:border-blue-500/50 hover:-translate-y-0.5',
    outline: 'bg-transparent text-slate-200 border border-slate-700 hover:bg-slate-800/80 hover:border-blue-500/50 hover:text-white'
  };

  const IconComp = icon;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${className}`}
    >
      {IconComp && <IconComp className="w-4 h-4 shrink-0" />}
      <span>{children}</span>
    </button>
  );
}
