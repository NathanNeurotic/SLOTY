import React, { useMemo } from 'react';
import type { GameId } from '../../games/types';

interface VegasAmbienceProps {
  activeGameId?: GameId;
}

export const VegasAmbience: React.FC<VegasAmbienceProps> = ({
  activeGameId = 'vault-24k',
}) => {
  const isTimber = activeGameId === 'timber-critters';
  const isPixel = activeGameId === 'pixel-arcade';
  const isPs2 = activeGameId === 'ps2-legends';

  // Pre-generate deterministic floating sparkle particles tailored to game theme
  const sparkles = useMemo(() => {
    return Array.from({ length: 24 }).map((_, i) => {
      let color = '#FBBF24';
      if (isPs2) {
        color = i % 3 === 0 ? '#00F0FF' : i % 2 === 0 ? '#006FCD' : '#38BDF8';
      } else if (isPixel) {
        color = i % 3 === 0 ? '#EC4899' : i % 2 === 0 ? '#06B6D4' : '#A855F7';
      } else if (isTimber) {
        color = i % 3 === 0 ? '#34D399' : i % 2 === 0 ? '#FBBF24' : '#10B981';
      } else {
        color = i % 3 === 0 ? '#FDE047' : i % 2 === 0 ? '#F59E0B' : '#00F0FF';
      }

      return {
        id: i,
        left: `${(i * 4.3 + 7) % 96}%`,
        top: `${(i * 7.1 + 15) % 90}%`,
        size: 2 + (i % 3) * 1.5,
        delay: `${(i * 0.35) % 4}s`,
        duration: `${3.5 + (i % 4) * 0.8}s`,
        color,
      };
    });
  }, [isTimber, isPixel, isPs2]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none">
      {/* 1. Sweeping Panoramic Searchlights */}
      <div className={`absolute -bottom-10 left-[15%] w-32 sm:w-48 h-[120vh] origin-bottom transform rotate-[-25deg] animate-spotlight-left opacity-30 blur-2xl ${
        isPs2
          ? 'bg-gradient-to-t from-cyan-500/25 via-[#006FCD]/15 to-transparent'
          : isPixel
          ? 'bg-gradient-to-t from-pink-500/25 via-purple-600/15 to-transparent'
          : isTimber
          ? 'bg-gradient-to-t from-emerald-500/20 via-teal-600/10 to-transparent'
          : 'bg-gradient-to-t from-cyan-400/20 via-sky-500/10 to-transparent'
      }`} />
      <div className={`absolute -bottom-10 right-[15%] w-32 sm:w-48 h-[120vh] origin-bottom transform rotate-[25deg] animate-spotlight-right opacity-30 blur-2xl ${
        isPs2
          ? 'bg-gradient-to-t from-[#006FCD]/25 via-cyan-400/15 to-transparent'
          : isPixel
          ? 'bg-gradient-to-t from-cyan-400/25 via-pink-500/15 to-transparent'
          : isTimber
          ? 'bg-gradient-to-t from-amber-500/25 via-emerald-600/10 to-transparent'
          : 'bg-gradient-to-t from-amber-400/20 via-yellow-500/10 to-transparent'
      }`} />

      {/* 2. Central Casino Neon Ambient Wash */}
      <div className={`absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full blur-[140px] opacity-25 ${
        isPs2 ? 'bg-[#006FCD]/20' : isPixel ? 'bg-pink-600/20' : isTimber ? 'bg-emerald-600/15' : 'bg-purple-600/10'
      }`} />
      <div className={`absolute bottom-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[350px] rounded-full blur-[150px] opacity-25 ${
        isPs2 ? 'bg-cyan-500/15' : isPixel ? 'bg-cyan-500/15' : isTimber ? 'bg-amber-600/15' : 'bg-amber-500/10'
      }`} />

      {/* 3. Floating Golden Embers & Stardust */}
      {sparkles.map((sp) => (
        <div
          key={sp.id}
          className="absolute rounded-full animate-float-sparkle"
          style={{
            left: sp.left,
            top: sp.top,
            width: `${sp.size}px`,
            height: `${sp.size}px`,
            backgroundColor: sp.color,
            boxShadow: `0 0 8px ${sp.color}`,
            animationDelay: sp.delay,
            animationDuration: sp.duration,
          }}
        />
      ))}
    </div>
  );
};
