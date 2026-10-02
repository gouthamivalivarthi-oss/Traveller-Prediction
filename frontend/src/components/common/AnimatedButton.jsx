import React from 'react';
import { Sparkles } from 'lucide-react';

export default function AnimatedButton({
  children,
  onClick = null,
  disabled = false,
  variant = 'primary', // 'primary' (orange/coral), 'secondary' (cream/warm), 'outline'
  icon = null,
  className = '',
  type = 'button'
}) {
  const baseStyles = 'relative inline-flex items-center justify-center gap-2 font-extrabold rounded-2xl px-6 py-3.5 text-sm transition-all duration-300 cursor-pointer shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-gradient-to-r from-[#FF7657] via-[#FF9F43] to-[#FF7657] text-white shadow-[0_8px_24px_-4px_rgba(255,118,87,0.45)] hover:shadow-[0_12px_32px_-4px_rgba(255,118,87,0.6)] hover:-translate-y-0.5 border border-white/20',
    secondary: 'bg-[#FFFDF8] hover:bg-[#FFF8ED] text-[#34261F] border border-[#FF9F43]/30 shadow-[0_6px_20px_-4px_rgba(90,64,50,0.12)] hover:border-[#FF9F43]/60 hover:-translate-y-0.5',
    outline: 'bg-transparent text-[#5A4032] border border-[#5A4032]/25 hover:bg-[#FFF8ED] hover:border-[#FF9F43] hover:text-[#34261F]'
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
