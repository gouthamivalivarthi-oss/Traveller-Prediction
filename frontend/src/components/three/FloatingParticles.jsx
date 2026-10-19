import React, { useEffect, useRef } from 'react';

export default function FloatingParticles({ count = 35 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const onResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);

    // Cool celestial palette: Sapphire, Cyan, Electric Indigo, Ice White
    const colors = [
      'rgba(59, 130, 246, 0.50)',
      'rgba(6, 182, 212, 0.45)',
      'rgba(99, 102, 241, 0.40)',
      'rgba(147, 197, 253, 0.35)',
      'rgba(248, 250, 252, 0.30)'
    ];

    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 3.5 + 1.2,
      speedX: (Math.random() - 0.5) * 0.4,
      speedY: -Math.random() * 0.5 - 0.2,
      color: colors[Math.floor(Math.random() * colors.length)],
      opacity: Math.random() * 0.6 + 0.2
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.y < -10) p.y = height + 10;
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.color;
        ctx.fill();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
    };
  }, [count]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-60"
    />
  );
}
