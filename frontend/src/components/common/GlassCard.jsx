import React from 'react';

export default function GlassCard({
  children,
  className = '',
  hoverEffect = true,
  onClick = null,
  glow = 'orange' // 'orange', 'coral', 'golden', 'green', 'none'
}) {
  const glowClasses = {
    orange: 'hover:shadow-[0_16px_36px_-8px_rgba(255,159,67,0.28)]',
    coral: 'hover:shadow-[0_16px_36px_-8px_rgba(255,118,87,0.28)]',
    golden: 'hover:shadow-[0_16px_36px_-8px_rgba(255,200,87,0.28)]',
    green: 'hover:shadow-[0_16px_36px_-8px_rgba(123,198,123,0.28)]',
    none: ''
  };

  return (
    <div
      onClick={onClick}
      className={`glass-panel-warm rounded-3xl p-6 transition-all duration-300 ${
        hoverEffect ? 'glass-card-hover' : ''
      } ${glowClasses[glow] || ''} ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {children}
    </div>
  );
}
