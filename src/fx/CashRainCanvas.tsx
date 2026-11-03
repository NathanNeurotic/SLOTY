import React, { useEffect, useRef } from 'react';
import type { GameId } from '../games/types';

interface CashRainCanvasProps {
  intensity: 'idle' | 'light' | 'heavy' | 'jackpot';
  enabled?: boolean;
  activeGameId?: GameId;
}

interface RainParticle {
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
  type: 'bill' | 'coin' | 'leaf' | 'acorn' | 'ps_glyph' | 'crystal' | 'pixel_coin' | 'pixel_gem';
  glyph?: 'triangle' | 'circle' | 'cross' | 'square';
  color: string;
}

export const CashRainCanvas: React.FC<CashRainCanvasProps> = ({
  intensity = 'idle',
  enabled = true,
  activeGameId = 'vault-24k',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const particlesRef = useRef<RainParticle[]>([]);
  const isTimber = activeGameId === 'timber-critters';
  const isPixel = activeGameId === 'pixel-arcade';
  const isPs2 = activeGameId === 'ps2-legends';

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

    const leafColors = ['#F59E0B', '#DC2626', '#10B981', '#D97706', '#EAB308'];
    const psGlyphDefs: Array<{ glyph: 'triangle' | 'circle' | 'cross' | 'square'; color: string }> = [
      { glyph: 'triangle', color: '#24B059' }, // Green Triangle
      { glyph: 'circle', color: '#E61A22' },   // Crimson Circle
      { glyph: 'cross', color: '#006FCD' },    // PlayStation Cobalt Cross
      { glyph: 'square', color: '#DF508E' },   // Vivid Pink Square
    ];

    // Seed particles
    particlesRef.current = Array.from({ length: maxParticles }).map(() => {
      if (isPs2) {
        const isCrystal = Math.random() < 0.35;
        const glyphDef = psGlyphDefs[Math.floor(Math.random() * psGlyphDefs.length)];
        return {
          x: Math.random() * canvas.width,
          y: Math.random() * -canvas.height * 0.8,
          width: 16 + Math.random() * 8,
          height: 16 + Math.random() * 8,
          vx: (Math.random() - 0.5) * 1.5,
          vy: 2.5 + Math.random() * 2.8,
          rotation: Math.random() * Math.PI * 2,
          vRot: (Math.random() - 0.5) * 0.08,
          flipAngle: Math.random() * Math.PI,
          vFlip: 0.04 + Math.random() * 0.06,
          type: isCrystal ? 'crystal' : 'ps_glyph',
          glyph: glyphDef.glyph,
          color: isCrystal ? '#00F0FF' : glyphDef.color,
        };
      }

      if (isPixel) {
        const isGem = Math.random() < 0.4;
        return {
          x: Math.random() * canvas.width,
          y: Math.random() * -canvas.height * 0.8,
          width: 14 + Math.random() * 8,
          height: 14 + Math.random() * 8,
          vx: (Math.random() - 0.5) * 1.5,
          vy: 2.6 + Math.random() * 2.8,
          rotation: Math.random() * Math.PI * 2,
          vRot: (Math.random() - 0.5) * 0.06,
          flipAngle: Math.random() * Math.PI,
          vFlip: 0.04 + Math.random() * 0.06,
          type: isGem ? 'pixel_gem' : 'pixel_coin',
          color: isGem ? (Math.random() < 0.5 ? '#FF007F' : '#00F0FF') : '#FFE600',
        };
      }

      if (isTimber) {
        return {
          x: Math.random() * canvas.width,
          y: Math.random() * -canvas.height * 0.8,
          width: 20 + Math.random() * 12,
          height: 16 + Math.random() * 10,
          vx: (Math.random() - 0.5) * 1.6,
          vy: 2.0 + Math.random() * 2.5,
          rotation: Math.random() * Math.PI * 2,
          vRot: (Math.random() - 0.5) * 0.05,
          flipAngle: Math.random() * Math.PI,
          vFlip: 0.04 + Math.random() * 0.06,
          type: Math.random() < 0.6 ? 'leaf' : 'acorn',
          color: leafColors[Math.floor(Math.random() * leafColors.length)],
        };
      }

      return {
        x: Math.random() * canvas.width,
        y: Math.random() * -canvas.height * 0.8,
        width: 28 + Math.random() * 16,
        height: 14 + Math.random() * 8,
        vx: (Math.random() - 0.5) * 1.2,
        vy: 2.5 + Math.random() * 3.0,
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.05,
        flipAngle: Math.random() * Math.PI,
        vFlip: 0.04 + Math.random() * 0.06,
        type: Math.random() < 0.65 ? 'bill' : 'coin',
        color: Math.random() < 0.5 ? '#F59E0B' : '#22C55E',
      };
    });

    let lastTime = performance.now();

    const render = (currentTime: number) => {
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
          p.vy = isTimber ? 2.0 + Math.random() * 2.5 : 2.5 + Math.random() * 3.0;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        const cosFlip = Math.cos(p.flipAngle);
        ctx.scale(1, Math.abs(cosFlip) > 0.08 ? cosFlip : 0.08);

        if (p.type === 'ps_glyph') {
          const r = p.width * 0.45;
          ctx.strokeStyle = p.color;
          ctx.lineWidth = 2.4;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 6;
          ctx.beginPath();
          if (p.glyph === 'triangle') {
            ctx.moveTo(0, -r);
            ctx.lineTo(r, r);
            ctx.lineTo(-r, r);
            ctx.closePath();
          } else if (p.glyph === 'circle') {
            ctx.arc(0, 0, r, 0, Math.PI * 2);
          } else if (p.glyph === 'square') {
            ctx.strokeRect(-r, -r, r * 2, r * 2);
          } else {
            // cross
            ctx.moveTo(-r, -r);
            ctx.lineTo(r, r);
            ctx.moveTo(r, -r);
            ctx.lineTo(-r, r);
          }
          ctx.stroke();
        } else if (p.type === 'crystal') {
          // 8MB Memory Card Crystal Gem Shard
          const w = p.width * 0.4;
          const h = p.height * 0.6;
          ctx.fillStyle = '#00F0FF';
          ctx.shadowColor = '#00F0FF';
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.moveTo(0, -h);
          ctx.lineTo(w, 0);
          ctx.lineTo(0, h);
          ctx.lineTo(-w, 0);
          ctx.closePath();
          ctx.fill();
          ctx.strokeStyle = '#FFFFFF';
          ctx.lineWidth = 1;
          ctx.stroke();
        } else if (p.type === 'pixel_gem') {
          // 8-Bit Pixel Gem
          const r = p.width * 0.45;
          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 8;
          ctx.fillRect(-r, -r, r * 2, r * 2);
        } else if (p.type === 'pixel_coin') {
          // 8-Bit Token
          const r = p.width * 0.4;
          ctx.fillStyle = '#FFE600';
          ctx.shadowColor = '#FFE600';
          ctx.shadowBlur = 6;
          ctx.beginPath();
          ctx.arc(0, 0, r, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.type === 'leaf') {
          // Autumn Leaf Flutter
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.ellipse(0, 0, p.width * 0.5, p.height * 0.35, Math.PI / 4, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#78350F';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(-p.width * 0.4, 0);
          ctx.lineTo(p.width * 0.4, 0);
          ctx.stroke();
        } else if (p.type === 'acorn') {
          // Golden Acorn
          const r = p.height * 0.5;
          ctx.fillStyle = '#D97706';
          ctx.beginPath();
          ctx.arc(0, 2, r, 0, Math.PI);
          ctx.lineTo(0, r + 4);
          ctx.closePath();
          ctx.fill();
          ctx.fillStyle = '#78350F';
          ctx.beginPath();
          ctx.arc(0, 0, r * 1.1, Math.PI, Math.PI * 2);
          ctx.closePath();
          ctx.fill();
        } else if (p.type === 'bill') {
          // Hardware-friendly $100 Banknote
          ctx.fillStyle = cosFlip > 0 ? '#15803D' : '#14532D';
          ctx.fillRect(-p.width / 2, -p.height / 2, p.width, p.height);
          ctx.fillStyle = '#0284C7';
          ctx.fillRect(-p.width * 0.1, -p.height / 2, p.width * 0.2, p.height);
          ctx.strokeStyle = '#86EFAC';
          ctx.lineWidth = 0.8;
          ctx.strokeRect(-p.width / 2, -p.height / 2, p.width, p.height);
        } else {
          // 3D Gold Bullion Coin
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
  }, [intensity, enabled, isTimber, isPixel, isPs2]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-20"
      style={{ willChange: 'transform' }}
    />
  );
};
