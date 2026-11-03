import React, { useEffect, useRef, useState } from 'react';
import type { GameId } from '../games/types';

interface ThemedCursorFXProps {
  activeGameId?: GameId;
  enabled?: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  maxLife: number;
  life: number;
  rotation: number;
  vRot: number;
  type: 'spark' | 'coin' | 'dollar' | 'firefly' | 'leaf' | 'spore' | 'acorn';
  color: string;
}

interface Shockwave {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  color: string;
}

export const ThemedCursorFX: React.FC<ThemedCursorFXProps> = ({
  activeGameId = 'vault-24k',
  enabled = true,
}) => {
  const isTimber = activeGameId === 'timber-critters';
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mousePosRef = useRef<{ x: number; y: number; visible: boolean; isHovering: boolean }>({
    x: -100,
    y: -100,
    visible: false,
    isHovering: false,
  });
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  const particlesRef = useRef<Particle[]>([]);
  const shockwavesRef = useRef<Shockwave[]>([]);
  const lastSpawnTimeRef = useRef<number>(0);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    // Detect touch-only screen
    const isTouch =
      typeof window !== 'undefined' &&
      (window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window);
    setIsTouchDevice(isTouch);

    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    const spawnTrailParticle = (x: number, y: number) => {
      const maxCount = isTouch ? 20 : 50;
      if (particlesRef.current.length > maxCount) return;

      if (isTimber) {
        // Timberland: Firefly, Leaf, or Spore
        const rand = Math.random();
        const type = rand < 0.4 ? 'firefly' : rand < 0.75 ? 'leaf' : 'spore';
        const leafColors = ['#F59E0B', '#DC2626', '#10B981', '#D97706', '#EAB308'];
        particlesRef.current.push({
          x: x + (Math.random() - 0.5) * 8,
          y: y + (Math.random() - 0.5) * 8,
          vx: (Math.random() - 0.5) * 0.8,
          vy: -0.4 - Math.random() * 0.8,
          size: type === 'leaf' ? 8 + Math.random() * 6 : type === 'firefly' ? 4 + Math.random() * 3 : 2 + Math.random() * 2,
          alpha: 1,
          life: 0,
          maxLife: 35 + Math.random() * 25,
          rotation: Math.random() * Math.PI * 2,
          vRot: (Math.random() - 0.5) * 0.08,
          type,
          color: type === 'firefly' ? (Math.random() < 0.6 ? '#FDE047' : '#34D399') : type === 'leaf' ? leafColors[Math.floor(Math.random() * leafColors.length)] : '#10B981',
        });
      } else {
        // 24K Vault: Gold Spark, Micro-Coin, Dollar Glint
        const rand = Math.random();
        const type = rand < 0.5 ? 'spark' : rand < 0.8 ? 'dollar' : 'coin';
        particlesRef.current.push({
          x: x + (Math.random() - 0.5) * 6,
          y: y + (Math.random() - 0.5) * 6,
          vx: (Math.random() - 0.5) * 1.2,
          vy: 0.2 + Math.random() * 0.8,
          size: type === 'coin' ? 6 + Math.random() * 4 : type === 'dollar' ? 7 + Math.random() * 3 : 3 + Math.random() * 3,
          alpha: 1,
          life: 0,
          maxLife: 30 + Math.random() * 20,
          rotation: Math.random() * Math.PI * 2,
          vRot: (Math.random() - 0.5) * 0.1,
          type,
          color: type === 'dollar' ? '#4ADE80' : Math.random() < 0.7 ? '#FDE047' : '#FFFFFF',
        });
      }
    };

    const spawnClickBurst = (x: number, y: number) => {
      // Add Shockwave
      shockwavesRef.current.push({
        x,
        y,
        radius: 4,
        maxRadius: isTimber ? 48 : 56,
        alpha: 0.9,
        color: isTimber ? '#34D399' : '#FDE047',
      });

      // Spawn 14 burst particles radiating outwards
      const burstCount = isTouch ? 10 : 16;
      for (let i = 0; i < burstCount; i++) {
        const angle = (i / burstCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
        const speed = 2.5 + Math.random() * 4.5;
        if (isTimber) {
          const rand = Math.random();
          const type = rand < 0.5 ? 'leaf' : rand < 0.8 ? 'acorn' : 'firefly';
          particlesRef.current.push({
            x,
            y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 1.2,
            size: type === 'acorn' ? 8 + Math.random() * 4 : 7 + Math.random() * 6,
            alpha: 1,
            life: 0,
            maxLife: 40 + Math.random() * 25,
            rotation: Math.random() * Math.PI * 2,
            vRot: (Math.random() - 0.5) * 0.2,
            type,
            color: rand < 0.4 ? '#F59E0B' : rand < 0.7 ? '#10B981' : '#EAB308',
          });
        } else {
          const rand = Math.random();
          const type = rand < 0.6 ? 'coin' : 'spark';
          particlesRef.current.push({
            x,
            y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 1.5,
            size: type === 'coin' ? 8 + Math.random() * 5 : 4 + Math.random() * 4,
            alpha: 1,
            life: 0,
            maxLife: 40 + Math.random() * 25,
            rotation: Math.random() * Math.PI * 2,
            vRot: (Math.random() - 0.5) * 0.25,
            type,
            color: rand < 0.7 ? '#FDE047' : '#67E8F9',
          });
        }
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      mousePosRef.current.x = e.clientX;
      mousePosRef.current.y = e.clientY;
      mousePosRef.current.visible = true;

      // Check if hovering clickable element
      const target = e.target as HTMLElement | null;
      if (target) {
        const isClickable =
          target.tagName === 'BUTTON' ||
          target.tagName === 'A' ||
          target.getAttribute('role') === 'button' ||
          target.closest('button') !== null ||
          target.classList.contains('cursor-pointer');
        mousePosRef.current.isHovering = isClickable;
      }

      // Throttle trail spawn
      const now = performance.now();
      if (now - lastSpawnTimeRef.current > 32) {
        lastSpawnTimeRef.current = now;
        spawnTrailParticle(e.clientX, e.clientY);
      }
    };

    const handlePointerDown = (e: PointerEvent) => {
      spawnClickBurst(e.clientX, e.clientY);
    };

    const handlePointerLeave = () => {
      mousePosRef.current.visible = false;
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown, { passive: true });
    document.addEventListener('mouseleave', handlePointerLeave);

    // 60 FPS Render Loop
    let lastTime = performance.now();
    const render = (currentTime: number) => {
      if (document.hidden) {
        animFrameRef.current = requestAnimationFrame(render);
        return;
      }

      const delta = Math.min(32, currentTime - lastTime);
      lastTime = currentTime;
      const speed = delta / 16.6;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 1. Render Shockwaves
        for (let i = shockwavesRef.current.length - 1; i >= 0; i--) {
          const sw = shockwavesRef.current[i];
          sw.radius += 3.2 * speed;
          sw.alpha = Math.max(0, 1 - sw.radius / sw.maxRadius);

          ctx.save();
          ctx.beginPath();
          ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
          ctx.strokeStyle = sw.color;
          ctx.globalAlpha = sw.alpha * 0.8;
          ctx.lineWidth = 2.5;
          ctx.shadowColor = sw.color;
          ctx.shadowBlur = 10;
          ctx.stroke();
          ctx.restore();

          if (sw.radius >= sw.maxRadius) {
            shockwavesRef.current.splice(i, 1);
          }
        }

        // 2. Render Particles
        for (let i = particlesRef.current.length - 1; i >= 0; i--) {
          const p = particlesRef.current[i];
          p.life += speed;
          p.x += p.vx * speed;
          p.y += p.vy * speed;
          p.rotation += p.vRot * speed;

          // Drag and gravity
          p.vx *= 0.96;
          p.vy += (isTimber ? 0.05 : 0.08) * speed;
          p.alpha = Math.max(0, 1 - p.life / p.maxLife);

          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.globalAlpha = p.alpha;

          if (p.type === 'spark') {
            // Radiant 4-point gold glint star
            ctx.fillStyle = p.color;
            ctx.shadowColor = p.color;
            ctx.shadowBlur = 6;
            ctx.beginPath();
            const s = p.size;
            ctx.moveTo(0, -s);
            ctx.lineTo(s * 0.25, -s * 0.25);
            ctx.lineTo(s, 0);
            ctx.lineTo(s * 0.25, s * 0.25);
            ctx.lineTo(0, s);
            ctx.lineTo(-s * 0.25, s * 0.25);
            ctx.lineTo(-s, 0);
            ctx.lineTo(-s * 0.25, -s * 0.25);
            ctx.closePath();
            ctx.fill();
          } else if (p.type === 'dollar') {
            // Emerald/Gold floating currency symbol
            ctx.font = `bold ${Math.round(p.size)}px monospace`;
            ctx.fillStyle = p.color;
            ctx.shadowColor = p.color;
            ctx.shadowBlur = 4;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('$', 0, 0);
          } else if (p.type === 'coin') {
            // Micro 3D gold bullion coin
            ctx.fillStyle = '#F59E0B';
            ctx.shadowColor = '#FDE047';
            ctx.shadowBlur = 5;
            ctx.beginPath();
            ctx.arc(0, 0, p.size * 0.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#FEF08A';
            ctx.lineWidth = 1;
            ctx.stroke();
          } else if (p.type === 'firefly') {
            // Pulsing bioluminescent firefly with soft halo
            const pulse = 0.7 + 0.3 * Math.sin(p.life * 0.2);
            ctx.fillStyle = p.color;
            ctx.shadowColor = p.color;
            ctx.shadowBlur = 8 * pulse;
            ctx.beginPath();
            ctx.arc(0, 0, p.size * 0.5 * pulse, 0, Math.PI * 2);
            ctx.fill();
          } else if (p.type === 'leaf') {
            // Fluttering maple/autumn leaf
            ctx.fillStyle = p.color;
            ctx.shadowColor = p.color;
            ctx.shadowBlur = 3;
            ctx.beginPath();
            ctx.ellipse(0, 0, p.size * 0.5, p.size * 0.28, Math.PI / 4, 0, Math.PI * 2);
            ctx.fill();
          } else if (p.type === 'acorn') {
            // Mini golden acorn
            const r = p.size * 0.4;
            ctx.fillStyle = '#D97706';
            ctx.beginPath();
            ctx.arc(0, 2, r, 0, Math.PI);
            ctx.lineTo(0, r + 3);
            ctx.closePath();
            ctx.fill();
            ctx.fillStyle = '#78350F';
            ctx.beginPath();
            ctx.arc(0, 0, r * 1.1, Math.PI, Math.PI * 2);
            ctx.closePath();
            ctx.fill();
          } else {
            // Soft forest spore
            ctx.fillStyle = p.color;
            ctx.shadowColor = p.color;
            ctx.shadowBlur = 4;
            ctx.beginPath();
            ctx.arc(0, 0, p.size * 0.5, 0, Math.PI * 2);
            ctx.fill();
          }

          ctx.restore();

          if (p.life >= p.maxLife) {
            particlesRef.current.splice(i, 1);
          }
        }

        // 3. Render Custom Desktop Cursor Pointer (Desktop only)
        if (!isTouch && mousePosRef.current.visible) {
          const { x, y, isHovering } = mousePosRef.current;
          const scale = isHovering ? 1.25 : 1.0;

          ctx.save();
          ctx.translate(x, y);
          ctx.scale(scale, scale);

          if (isTimber) {
            // Handcrafted Wooden Acorn / Bear Paw Cursor with Glowing Core
            ctx.shadowColor = isHovering ? '#34D399' : '#F59E0B';
            ctx.shadowBlur = isHovering ? 14 : 8;

            // Wooden pointer shape
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(12, 12);
            ctx.lineTo(5, 14);
            ctx.lineTo(0, 19);
            ctx.closePath();
            ctx.fillStyle = '#3E1D0B';
            ctx.fill();
            ctx.strokeStyle = '#B45309';
            ctx.lineWidth = 1.5;
            ctx.stroke();

            // Inner glowing emerald core
            ctx.beginPath();
            ctx.arc(4, 7, isHovering ? 3 : 2, 0, Math.PI * 2);
            ctx.fillStyle = isHovering ? '#34D399' : '#10B981';
            ctx.shadowColor = '#34D399';
            ctx.shadowBlur = 8;
            ctx.fill();
          } else {
            // High-Tech 24K Gold Bullion Diamond Reticle Cursor
            ctx.shadowColor = isHovering ? '#67E8F9' : '#FDE047';
            ctx.shadowBlur = isHovering ? 16 : 10;

            // Diamond crosshair reticle
            const r = isHovering ? 9 : 7;
            ctx.beginPath();
            ctx.moveTo(0, -r);
            ctx.lineTo(r, 0);
            ctx.lineTo(0, r);
            ctx.lineTo(-r, 0);
            ctx.closePath();
            ctx.strokeStyle = isHovering ? '#67E8F9' : '#FDE047';
            ctx.lineWidth = 1.8;
            ctx.stroke();

            // Central radiant diamond gem
            ctx.beginPath();
            ctx.arc(0, 0, 2.5, 0, Math.PI * 2);
            ctx.fillStyle = isHovering ? '#FFFFFF' : '#F59E0B';
            ctx.fill();

            // 4 Corner Laser Crosshairs
            ctx.strokeStyle = isHovering ? '#67E8F9' : '#FDE047';
            ctx.lineWidth = 1.2;
            const ext = r + 4;
            ctx.beginPath();
            ctx.moveTo(0, -r - 1);
            ctx.lineTo(0, -ext);
            ctx.moveTo(0, r + 1);
            ctx.lineTo(0, ext);
            ctx.moveTo(-r - 1, 0);
            ctx.lineTo(-ext, 0);
            ctx.moveTo(r + 1, 0);
            ctx.lineTo(ext, 0);
            ctx.stroke();
          }

          ctx.restore();
        }
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('mouseleave', handlePointerLeave);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isTimber, isTouchDevice, enabled]);

  if (!enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-50 select-none ${
        !isTouchDevice ? 'cursor-none' : ''
      }`}
    />
  );
};
