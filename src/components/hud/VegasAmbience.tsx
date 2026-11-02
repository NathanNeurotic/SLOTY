import React, { useMemo } from 'react';

export const VegasAmbience: React.FC = () => {
  // Pre-generate deterministic floating sparkle particles
  const sparkles = useMemo(() => {
    return Array.from({ length: 24 }).map((_, i) => ({
      id: i,
      left: `${(i * 4.3 + 7) % 96}%`,
      top: `${(i * 7.1 + 15) % 90}%`,
      size: 2 + (i % 3) * 1.5,
      delay: `${(i * 0.35) % 4}s`,
      duration: `${3.5 + (i % 4) * 0.8}s`,
      color: i % 3 === 0 ? '#00F0FF' : i % 2 === 0 ? '#FBBF24' : '#F43F5E',
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none">
      {/* 1. Sweeping Vegas Strip Searchlights */}
      <div className="absolute -bottom-10 left-[15%] w-32 sm:w-48 h-[120vh] origin-bottom transform rotate-[-25deg] animate-spotlight-left opacity-35 bg-gradient-to-t from-cyan-400/20 via-sky-500/10 to-transparent blur-2xl" />
      <div className="absolute -bottom-10 right-[15%] w-32 sm:w-48 h-[120vh] origin-bottom transform rotate-[25deg] animate-spotlight-right opacity-35 bg-gradient-to-t from-amber-400/20 via-yellow-500/10 to-transparent blur-2xl" />

      {/* 2. Central Casino Neon Ambient Wash */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-purple-600/10 rounded-full blur-[140px]" />
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-amber-500/10 rounded-full blur-[150px]" />

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
