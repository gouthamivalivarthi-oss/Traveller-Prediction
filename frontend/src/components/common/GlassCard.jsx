import React from 'react';

export default function GlassCard({
  children,
  className = '',
  hoverEffect = true,
  onClick = null,
  glow = 'blue' // 'blue', 'cyan', 'indigo', 'green', 'none'
}) {
  const glowClasses = {
    blue: 'hover:shadow-[0_16px_36px_-8px_rgba(59,130,246,0.3)]',
    cyan: 'hover:shadow-[0_16px_36px_-8px_rgba(6,182,212,0.3)]',
    indigo: 'hover:shadow-[0_16px_36px_-8px_rgba(99,102,241,0.3)]',
    green: 'hover:shadow-[0_16px_36px_-8px_rgba(16,185,129,0.3)]',
    orange: 'hover:shadow-[0_16px_36px_-8px_rgba(59,130,246,0.3)]',
    coral: 'hover:shadow-[0_16px_36px_-8px_rgba(6,182,212,0.3)]',
    golden: 'hover:shadow-[0_16px_36px_-8px_rgba(99,102,241,0.3)]',
    none: ''
  };

  return (
    <div
      onClick={onClick}
      className={`glass-panel rounded-3xl p-6 transition-all duration-300 ${
        hoverEffect ? 'glass-card-hover' : ''
      } ${glowClasses[glow] || glowClasses.blue} ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {children}
    </div>
  );
}
