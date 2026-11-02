import React, { useState } from 'react';
import { X, Gift, Sparkles } from 'lucide-react';
import { soundManager } from '../../audio/soundManager';
import { launchCoinFountain } from '../../fx/celebrations';

interface DailyBonusModalProps {
  canClaim: boolean;
  timeRemaining: string;
  onClaim: (amount: number) => void;
  onClose: () => void;
}

const WHEEL_SLICES = [
  { amount: 5000, label: '5,000', color: '#3B82F6' },
  { amount: 25000, label: '25,000', color: '#EC4899' },
  { amount: 10000, label: '10,000', color: '#10B981' },
  { amount: 100000, label: '100,000', color: '#F59E0B' }, // Jackpot
  { amount: 15000, label: '15,000', color: '#8B5CF6' },
  { amount: 50000, label: '50,000', color: '#EF4444' },
  { amount: 20000, label: '20,000', color: '#06B6D4' },
  { amount: 75000, label: '75,000', color: '#D946EF' },
];

export const DailyBonusModal: React.FC<DailyBonusModalProps> = ({
  canClaim,
  timeRemaining,
  onClaim,
  onClose,
}) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotationDegrees, setRotationDegrees] = useState(0);
  const [wonAmount, setWonAmount] = useState<number | null>(null);

  const handleSpinWheel = () => {
    if (isSpinning || !canClaim) return;

    soundManager.playSpinStart();
    setIsSpinning(true);
    setWonAmount(null);

    // Pick random target slice
    const sliceIndex = Math.floor(Math.random() * WHEEL_SLICES.length);
    const targetSlice = WHEEL_SLICES[sliceIndex];

    // Each slice is 360 / 8 = 45 degrees
    // Pointer is at the top (0 degrees / 270 deg)
    const sliceDegrees = 360 / WHEEL_SLICES.length;
    // Compute rotation: at least 5 full rotations (1800 deg) + offset to land target slice at top pointer
    const targetRotation = 360 * 6 + (WHEEL_SLICES.length - 1 - sliceIndex) * sliceDegrees + sliceDegrees / 2;

    setRotationDegrees(targetRotation);

    // Play ticking sounds while spinning
    const tickInterval = setInterval(() => {
      soundManager.playCoinTally();
    }, 120);

    setTimeout(() => {
      clearInterval(tickInterval);
      soundManager.playWinChime(targetSlice.amount >= 50000 ? 25 : 10);
      launchCoinFountain(targetSlice.amount >= 50000 ? 'mega' : 'big');
      setIsSpinning(false);
      setWonAmount(targetSlice.amount);
      onClaim(targetSlice.amount);
    }, 4500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md select-none">
      <div className="relative max-w-md w-full max-h-[92vh] overflow-y-auto bg-casino-950 border-2 border-gold-bright/60 shadow-[0_0_60px_rgba(245,158,11,0.5)] rounded-3xl p-4 sm:p-6 text-center flex flex-col items-center">
        {/* Close Button */}
        <button
          onClick={() => {
            soundManager.playButtonClick();
            onClose();
          }}
          disabled={isSpinning}
          className="absolute top-4 right-4 p-2 rounded-xl bg-casino-900 hover:bg-casino-800 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-1.5 text-gold-bright text-xs font-bold uppercase tracking-widest mb-1">
          <Sparkles className="w-4 h-4" />
          <span>LUCKY BONUS WHEEL</span>
          <Sparkles className="w-4 h-4" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white uppercase mb-4">
          Free Coin Spin
        </h2>

        {/* The Wheel Stage */}
        <div className="relative w-64 h-64 sm:w-72 sm:h-72 my-2 flex items-center justify-center">
          {/* Top Indicator Arrow */}
          <div className="absolute top-0 z-30 transform -translate-y-2">
            <div className="w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[24px] border-t-yellow-400 filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]" />
          </div>

          {/* Wheel Frame */}
          <div
            className="w-full h-full rounded-full border-4 border-yellow-400 shadow-[0_0_35px_rgba(245,158,11,0.6)] overflow-hidden relative bg-black"
            style={{
              transform: `rotate(${rotationDegrees}deg)`,
              transition: isSpinning
                ? 'transform 4.5s cubic-bezier(0.15, 0.95, 0.25, 1)'
                : 'none',
            }}
          >
            <svg viewBox="0 0 200 200" className="w-full h-full">
              <defs>
                <filter id="wheelShadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#000" floodOpacity="0.8" />
                </filter>
              </defs>
              {WHEEL_SLICES.map((slice, idx) => {
                const startDeg = idx * 45 - 90; // Start at top
                const endDeg = (idx + 1) * 45 - 90;
                const midDeg = (idx + 0.5) * 45; // 0..360 for rotation transform
                const rad0 = (startDeg * Math.PI) / 180;
                const rad1 = (endDeg * Math.PI) / 180;
                const R = 98;
                const x0 = 100 + R * Math.cos(rad0);
                const y0 = 100 + R * Math.sin(rad0);
                const x1 = 100 + R * Math.cos(rad1);
                const y1 = 100 + R * Math.sin(rad1);
                const d = `M 100 100 L ${x0} ${y0} A ${R} ${R} 0 0 1 ${x1} ${y1} Z`;

                return (
                  <g key={idx}>
                    {/* Colored Slice Wedge */}
                    <path d={d} fill={slice.color} stroke="#1C0A00" strokeWidth="1.2" />

                    {/* Radially Oriented Text Label */}
                    <g transform={`rotate(${midDeg}, 100, 100)`}>
                      <text
                        x="100"
                        y="34"
                        textAnchor="middle"
                        fill="#FFFFFF"
                        stroke="#000000"
                        strokeWidth="1.2"
                        paintOrder="stroke fill"
                        fontSize="10"
                        fontWeight="900"
                        fontFamily="monospace"
                        filter="url(#wheelShadow)"
                        letterSpacing="0.5"
                      >
                        {slice.label}
                      </text>
                    </g>

                    {/* Gold Rim Pin at Sector Border */}
                    <circle
                      cx={100 + 94 * Math.cos(rad0)}
                      cy={100 + 94 * Math.sin(rad0)}
                      r="2.5"
                      fill="#FEF08A"
                      stroke="#451A03"
                      strokeWidth="0.8"
                    />
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Center Hub */}
          <div className="absolute z-20 w-14 h-14 rounded-full bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-700 border-2 border-white shadow-[0_0_20px_rgba(0,0,0,0.9)] flex items-center justify-center">
            <Gift className="w-6 h-6 text-amber-950" />
          </div>
        </div>

        {/* Result Announcement or Spin Button */}
        <div className="mt-4 w-full">
          {wonAmount !== null ? (
            <div className="flex flex-col items-center bg-casino-900 border border-gold-bright/40 p-3 rounded-2xl animate-bounce-soft">
              <span className="text-xs font-bold text-slate-300">YOU WON!</span>
              <span className="text-2xl font-black text-gold-light">
                +{wonAmount.toLocaleString()} COINS
              </span>
            </div>
          ) : canClaim ? (
            <button
              onClick={handleSpinWheel}
              disabled={isSpinning}
              className="gold-btn w-full py-3.5 rounded-2xl font-black text-base uppercase tracking-wider text-casino-950 hover:scale-105 active:scale-95 transition-transform"
            >
              {isSpinning ? 'SPINNING...' : 'SPIN FOR FREE COINS!'}
            </button>
          ) : (
            <div className="bg-casino-900/80 border border-white/10 p-3 rounded-2xl text-center">
              <span className="text-xs text-slate-400 block mb-1">NEXT BONUS READY IN</span>
              <span className="text-xl font-mono font-bold text-neon-cyan">{timeRemaining}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
