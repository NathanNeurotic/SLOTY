import React from 'react';
import { X, Trophy, Crown, Sparkles, Award } from 'lucide-react';
import type { CasinoPeerState, DiscordUserProfile } from '../../multiplayer/discordTypes';

interface LeaderboardModalProps {
  userProfile: DiscordUserProfile | null;
  currentBalance: number;
  peakBalance: number;
  peers: CasinoPeerState[];
  onClose: () => void;
}

interface LeaderboardEntry {
  id: string;
  name: string;
  avatarUrl: string;
  isSelf: boolean;
  peakBalance: number;
  lastWin: number;
  title: string;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  userProfile,
  currentBalance,
  peakBalance,
  peers,
  onClose,
}) => {
  // Combine user profile and peers into a sorted leaderboard
  const entries: LeaderboardEntry[] = [
    {
      id: userProfile?.id || 'self',
      name: userProfile?.username || 'You',
      avatarUrl: userProfile?.avatarUrl || 'https://cdn.discordapp.com/embed/avatars/0.png',
      isSelf: true,
      peakBalance: Math.max(peakBalance, currentBalance),
      lastWin: 0,
      title: 'Current Player',
    },
    ...peers.map((p) => ({
      id: p.id,
      name: p.name,
      avatarUrl: p.avatarUrl,
      isSelf: false,
      peakBalance: p.peakBalance,
      lastWin: p.lastWin,
      title: p.isBot ? 'Casino Regular' : 'Discord Member',
    })),
  ].sort((a, b) => b.peakBalance - a.peakBalance);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in select-none">
      <div className="relative w-full max-w-lg rounded-3xl bg-gradient-to-b from-casino-900 via-casino-950 to-black border-2 border-yellow-400/40 p-4 sm:p-6 shadow-[0_0_50px_rgba(245,158,11,0.4)] flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-casino-800 text-slate-400 hover:text-white border border-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-2.5 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-600 border border-yellow-200 flex items-center justify-center shadow-lg">
            <Trophy className="w-5 h-5 text-amber-950 fill-amber-950 animate-bounce" />
          </div>
          <div className="flex flex-col">
            <h2 className="text-lg sm:text-xl font-black uppercase tracking-wider text-yellow-300 flex items-center space-x-1.5">
              <span>DISCORD SERVER HIGH SCORES</span>
              <Sparkles className="w-4 h-4 text-amber-400" />
            </h2>
            <p className="text-[11px] text-slate-400 font-semibold">
              The high roller championship among you and your server friends
            </p>
          </div>
        </div>

        {/* Rules & Stealth Bailout Banner */}
        <div className="mb-4 p-2.5 rounded-xl bg-amber-500/10 border border-amber-400/30 flex items-center space-x-2 text-[11px] text-amber-200 font-medium">
          <Award className="w-4 h-4 text-yellow-400 flex-shrink-0" />
          <span>
            Play together in Discord. Hold the crown by reaching the highest bankroll. No one ever drops out!
          </span>
        </div>

        {/* Leaderboard Rankings List */}
        <div className="flex flex-col space-y-2 max-h-[320px] overflow-y-auto pr-1">
          {entries.map((entry, index) => {
            const isFirst = index === 0;
            const isSecond = index === 1;
            const isThird = index === 2;

            return (
              <div
                key={entry.id}
                className={`flex items-center justify-between p-2.5 rounded-2xl border transition-all ${
                  entry.isSelf
                    ? 'bg-yellow-500/15 border-yellow-400/80 shadow-[0_0_15px_rgba(251,191,36,0.25)]'
                    : isFirst
                    ? 'bg-gradient-to-r from-amber-900/40 via-yellow-950/30 to-black border-yellow-400/50'
                    : 'bg-casino-950/80 border-white/10'
                }`}
              >
                {/* Left: Rank Badge & Avatar */}
                <div className="flex items-center space-x-3">
                  {/* Rank Badge */}
                  <div className="flex items-center justify-center w-7 h-7 rounded-xl font-black text-xs">
                    {isFirst ? (
                      <Crown className="w-6 h-6 text-yellow-300 fill-yellow-400 animate-pulse" />
                    ) : isSecond ? (
                      <span className="text-slate-300 font-black">#2</span>
                    ) : isThird ? (
                      <span className="text-amber-600 font-black">#3</span>
                    ) : (
                      <span className="text-slate-500 font-bold">#{index + 1}</span>
                    )}
                  </div>

                  {/* Player Avatar */}
                  <img
                    src={entry.avatarUrl}
                    alt={entry.name}
                    className="w-9 h-9 rounded-full border-2 border-yellow-300 shadow-md flex-shrink-0"
                  />

                  {/* Player Names */}
                  <div className="flex flex-col">
                    <span className="text-xs sm:text-sm font-black text-white flex items-center space-x-1.5">
                      <span>{entry.name}</span>
                      {entry.isSelf && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-yellow-400 text-amber-950 font-black">
                          YOU
                        </span>
                      )}
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold">{entry.title}</span>
                  </div>
                </div>

                {/* Right: Peak Bankroll Score */}
                <div className="flex flex-col text-right font-mono">
                  <span className="text-[9px] font-black uppercase text-slate-400">
                    PEAK BANKROLL
                  </span>
                  <span className="text-sm sm:text-base font-black text-emerald-400 leading-none">
                    ${entry.peakBalance.toLocaleString()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Footer Note */}
        <div className="mt-4 pt-3 border-t border-white/10 text-center text-[10px] text-slate-500 font-mono">
          SCORES SYNCHRONIZE ACROSS VOICE CHANNELS &amp; TABS IN REAL TIME
        </div>
      </div>
    </div>
  );
};
