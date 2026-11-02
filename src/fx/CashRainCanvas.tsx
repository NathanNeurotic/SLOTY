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
  type: 'bill' | 'coin';
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
    // Detect mobile / low-power devices
    const isMobile =
      typeof window !== 'undefined' &&
      (window.innerWidth < 768 || window.matchMedia('(pointer: coarse)').matches);

    // On mobile, never run continuous light background rain to protect weak GPUs & batteries
    if (!enabled || intensity === 'idle' || (isMobile && intensity === 'light')) {
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

    // Lean particle counts tailored for buttery 60 FPS performance
    const maxParticles = isMobile
      ? intensity === 'jackpot'
        ? 22
        : 12
      : intensity === 'jackpot'
      ? 55
      : intensity === 'heavy'
      ? 30
      : 15;

    // Seed particles
    particlesRef.current = Array.from({ length: maxParticles }).map(() => ({
      x: Math.random() * canvas.width,
      y: Math.random() * -canvas.height * 0.8,
      width: 28 + Math.random() * 16,
      height: 14 + Math.random() * 8,
      vx: (Math.random() - 0.5) * 1.2,
      vy: 2.5 + Math.random() * 3.0,
      rotation: Math.random() * Math.PI * 2,
      vRot: (Math.random() - 0.5) * 0.04,
      flipAngle: Math.random() * Math.PI,
      vFlip: 0.04 + Math.random() * 0.06,
      type: Math.random() < 0.65 ? 'bill' : 'coin',
      color: Math.random() < 0.5 ? '#F59E0B' : '#22C55E',
    }));

    let lastTime = performance.now();

    const render = (currentTime: number) => {
      // Throttle rendering when tab is hidden or backgrounded
      if (document.hidden) {
        animFrameRef.current = requestAnimationFrame(render);
        return;
      }

      const delta = Math.min(32, currentTime - lastTime);
      lastTime = currentTime;
      const speedFactor = delta / 16.6;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((p) => {
        p.x += (p.vx + Math.sin(p.flipAngle) * 0.6) * speedFactor;
        p.y += p.vy * speedFactor;
        p.rotation += p.vRot * speedFactor;
        p.flipAngle += p.vFlip * speedFactor;

        // Reset if offscreen
        if (p.y > canvas.height + 30) {
          p.y = -30;
          p.x = Math.random() * canvas.width;
          p.vy = 2.5 + Math.random() * 3.0;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        const cosFlip = Math.cos(p.flipAngle);
        ctx.scale(1, Math.abs(cosFlip) > 0.08 ? cosFlip : 0.08);

        if (p.type === 'bill') {
          // Hardware-friendly $100 Banknote
          ctx.fillStyle = cosFlip > 0 ? '#15803D' : '#14532D';
          ctx.fillRect(-p.width / 2, -p.height / 2, p.width, p.height);

          // Blue ribbon strip
          ctx.fillStyle = '#0284C7';
          ctx.fillRect(-p.width * 0.1, -p.height / 2, p.width * 0.2, p.height);

          // Subtle gold border
          ctx.strokeStyle = '#86EFAC';
          ctx.lineWidth = 0.8;
          ctx.strokeRect(-p.width / 2, -p.height / 2, p.width, p.height);
        } else {
          // Hardware-friendly 3D Gold Bullion Coin
          const radius = p.height * 0.65;
          ctx.fillStyle = '#F59E0B';
          ctx.beginPath();
          ctx.arc(0, 0, radius, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = '#FEF08A';
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        ctx.restore();
      });

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [intensity, enabled]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-20"
      style={{ willChange: 'transform' }}
    />
  );
};
