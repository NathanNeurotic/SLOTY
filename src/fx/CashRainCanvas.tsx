import React, { useEffect, useRef } from 'react';

interface CashRainCanvasProps {
  intensity: 'idle' | 'light' | 'heavy' | 'jackpot';
  enabled?: boolean;
}

interface BillParticle {
  x: number;
  y: number;
  width: number;
  height: number;
  vx: number;
  vy: number;
  rotation: number;
  vRot: number;
  flipAngle: number;
  vFlip: number;
  type: 'bill' | 'coin' | 'symbol';
  symbolGlyph?: string;
  color: string;
}

export const CashRainCanvas: React.FC<CashRainCanvasProps> = ({
  intensity = 'idle',
  enabled = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const particlesRef = useRef<BillParticle[]>([]);

  useEffect(() => {
    if (!enabled || intensity === 'idle') {
      particlesRef.current = [];
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    // Number of particles based on intensity
    const maxParticles = intensity === 'jackpot' ? 90 : intensity === 'heavy' ? 45 : 20;
    const glyphs = ['$', '€', '£', '¥', '₿', '777', '24K'];

    // Seed particles
    particlesRef.current = Array.from({ length: maxParticles }).map(() => ({
      x: Math.random() * canvas.width,
      y: Math.random() * -canvas.height * 0.8,
      width: 32 + Math.random() * 22,
      height: 16 + Math.random() * 12,
      vx: (Math.random() - 0.5) * 1.5,
      vy: 2.2 + Math.random() * 3.5,
      rotation: Math.random() * Math.PI * 2,
      vRot: (Math.random() - 0.5) * 0.05,
      flipAngle: Math.random() * Math.PI,
      vFlip: 0.04 + Math.random() * 0.08,
      type: Math.random() < 0.65 ? 'bill' : Math.random() < 0.85 ? 'coin' : 'symbol',
      symbolGlyph: glyphs[Math.floor(Math.random() * glyphs.length)],
      color: Math.random() < 0.5 ? '#F59E0B' : '#22C55E',
    }));

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((p) => {
        p.x += p.vx + Math.sin(p.flipAngle) * 0.8;
        p.y += p.vy;
        p.rotation += p.vRot;
        p.flipAngle += p.vFlip;

        // Reset if offscreen
        if (p.y > canvas.height + 40) {
          p.y = -40;
          p.x = Math.random() * canvas.width;
          p.vy = 2.2 + Math.random() * 3.5;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        const cosFlip = Math.cos(p.flipAngle);
        ctx.scale(1, Math.abs(cosFlip) > 0.05 ? cosFlip : 0.05);

        if (p.type === 'bill') {
          // 3D Tumbling $100 Banknote
          const isFront = cosFlip > 0;
          ctx.fillStyle = isFront ? '#15803D' : '#14532D';
          ctx.strokeStyle = '#86EFAC';
          ctx.lineWidth = 1;

          // Bill Rectangle
          ctx.beginPath();
          ctx.roundRect(-p.width / 2, -p.height / 2, p.width, p.height, 2);
          ctx.fill();
          ctx.stroke();

          // Inner Border & Blue Security Ribbon
          ctx.fillStyle = '#0284C7';
          ctx.fillRect(-p.width * 0.1, -p.height / 2, p.width * 0.18, p.height);

          // $100 text
          ctx.fillStyle = '#DCFCE7';
          ctx.font = 'bold 8px monospace';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('$100', 0, 0);
        } else if (p.type === 'coin') {
          // Spinning 3D Minted Gold Bullion Coin
          const radius = p.height * 0.7;
          ctx.fillStyle = '#F59E0B';
          ctx.strokeStyle = '#FEF08A';
          ctx.lineWidth = 1.5;

          ctx.beginPath();
          ctx.arc(0, 0, radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          // Inner rim
          ctx.beginPath();
          ctx.arc(0, 0, radius * 0.7, 0, Math.PI * 2);
          ctx.strokeStyle = '#78350F';
          ctx.lineWidth = 0.8;
          ctx.stroke();

          // Dollar glyph
          ctx.fillStyle = '#FFFFFF';
          ctx.font = 'bold 10px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('$', 0, 0);
        } else {
          // Glowing Neon Currency Symbol
          ctx.fillStyle = p.color;
          ctx.font = '900 14px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 8;
          ctx.fillText(p.symbolGlyph || '$', 0, 0);
        }

        ctx.restore();
      });

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [intensity, enabled]);

  if (!enabled || intensity === 'idle') return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-30 select-none"
    />
  );
};
