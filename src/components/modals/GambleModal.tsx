import React, { useCallback, useEffect, useRef, useState } from 'react';
import { X, Sparkles, Trophy, Trees, Gamepad2, Zap, Gift } from 'lucide-react';
import { soundManager } from '../../audio/soundManager';
import { MysteryPickModal } from './MysteryPickModal';
import type { GameId } from '../../games/types';

interface GambleModalProps {
  initialPot: number;
  onCollect: (amount: number) => void;
  onLose: () => void;
  onClose?: () => void;
  activeGameId?: GameId;
}

type CardSuit = 'HEARTS' | 'DIAMONDS' | 'SPADES' | 'CLUBS';
type CardColor = 'RED' | 'BLACK';

export const GambleModal: React.FC<GambleModalProps> = ({
  initialPot,
  onCollect,
  onLose,
  onClose,
  activeGameId = 'vault-24k',
}) => {
  const isTimber = activeGameId === 'timber-critters';
  const isPixel = activeGameId === 'pixel-arcade';
  const isPs2 = activeGameId === 'ps2-legends';

  const [gambleMode, setGambleMode] = useState<'CARDS' | 'MYSTERY_PICK'>('CARDS');
  const [currentPot, setCurrentPot] = useState(initialPot);
  const [history, setHistory] = useState<{ color: CardColor; suit: CardSuit; rank: string }[]>([]);
  const [isFlipping, setIsFlipping] = useState(false);
  const [revealedCard, setRevealedCard] = useState<{
    color: CardColor;
    suit: CardSuit;
    rank: string;
  } | null>(null);
  const [gambleStatus, setGambleStatus] = useState<'CHOOSING' | 'WON' | 'LOST'>('CHOOSING');

  const settledRef = useRef(false);
  const flipTimerRef = useRef<number | null>(null);
  const loseTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (flipTimerRef.current) clearTimeout(flipTimerRef.current);
      if (loseTimerRef.current) clearTimeout(loseTimerRef.current);
    };
  }, []);

  const finalizeLose = useCallback(() => {
    if (settledRef.current) return;
    settledRef.current = true;
    if (loseTimerRef.current) clearTimeout(loseTimerRef.current);
    onLose();
  }, [onLose]);

  const handleCollect = useCallback(() => {
    if (settledRef.current || isFlipping || gambleStatus === 'LOST') return;
    settledRef.current = true;
    soundManager.playCoinTally();
    onCollect(currentPot);
  }, [isFlipping, gambleStatus, onCollect, currentPot]);

  const handlePickColor = useCallback(
    (chosenColor: CardColor) => {
      if (isFlipping || gambleStatus === 'LOST' || settledRef.current) return;
      setIsFlipping(true);
      soundManager.playButtonClick();

      const suits: CardSuit[] = ['HEARTS', 'DIAMONDS', 'SPADES', 'CLUBS'];
      const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
      const randomSuit = suits[Math.floor(Math.random() * suits.length)];
      const randomRank = ranks[Math.floor(Math.random() * ranks.length)];
      const cardColor: CardColor =
        randomSuit === 'HEARTS' || randomSuit === 'DIAMONDS' ? 'RED' : 'BLACK';

      flipTimerRef.current = window.setTimeout(() => {
        const newCard = { color: cardColor, suit: randomSuit, rank: randomRank };
        setRevealedCard(newCard);
        setHistory((prev) => [newCard, ...prev.slice(0, 5)]);
        setIsFlipping(false);

        if (chosenColor === cardColor) {
          setCurrentPot((prev) => prev * 2);
          setGambleStatus('WON');
          soundManager.playWinChime(8);
        } else {
          setGambleStatus('LOST');
          soundManager.playReelStop(0);
          loseTimerRef.current = window.setTimeout(() => {
            finalizeLose();
          }, 1600);
        }
      }, 550);
    },
    [isFlipping, gambleStatus, finalizeLose]
  );

  useEffect(() => {
    if (gambleMode !== 'CARDS') return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        e.stopPropagation();
        handlePickColor('RED');
      } else if (e.key === 'ArrowRight' || e.key === 'b' || e.key === 'B') {
        e.preventDefault();
        e.stopPropagation();
        handlePickColor('BLACK');
      } else if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        e.stopPropagation();
        if (gambleStatus === 'WON') {
          handleCollect();
        } else if (gambleStatus === 'LOST') {
          finalizeLose();
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        if (gambleStatus === 'LOST') {
          finalizeLose();
        } else if (!isFlipping) {
          handleCollect();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown, { capture: true });
    return () => window.removeEventListener('keydown', handleKeyDown, { capture: true });
  }, [gambleMode, isFlipping, gambleStatus, handlePickColor, handleCollect, finalizeLose]);

  if (gambleMode === 'MYSTERY_PICK') {
    return (
      <MysteryPickModal
        totalBet={Math.max(10, Math.round(currentPot / 35))}
        activeGameId={activeGameId}
        onComplete={(wonAmount) => {
          if (settledRef.current) return;
          settledRef.current = true;
          onCollect(wonAmount);
        }}
        onClose={() => setGambleMode('CARDS')}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md select-none animate-fadeIn">
      <div className={`relative max-w-md w-full max-h-[92vh] overflow-y-auto ${
        isPs2
          ? 'bg-gradient-to-b from-[#000e26] via-[#000511] to-black border-2 border-[#006FCD] shadow-[0_0_60px_rgba(0,111,205,0.7)] font-mono'
          : isPixel
          ? 'bg-gradient-to-b from-[#1b052e] via-[#0d0218] to-black border-2 border-pink-500 shadow-[0_0_60px_rgba(236,72,153,0.6)] font-mono'
          : isTimber
          ? 'bg-gradient-to-b from-[#241308] via-[#120a05] to-[#040804] border-2 border-[#b45309] shadow-[0_0_50px_rgba(180,83,9,0.5)]'
          : 'bg-gradient-to-b from-casino-900 via-casino-950 to-black border-2 border-gold-bright/60 shadow-[0_0_50px_rgba(251,191,36,0.5)]'
      } rounded-3xl p-4 sm:p-7 flex flex-col items-center`}>
        {/* Header */}
        <div className="w-full flex items-center justify-between pb-3 border-b border-white/10 mb-3">
          <div className="flex items-center space-x-2">
            {isPs2 ? (
              <span className="text-xl animate-bounce">🎮</span>
            ) : isPixel ? (
              <Gamepad2 className="w-5 h-5 text-pink-400 animate-bounce" />
            ) : isTimber ? (
              <Trees className="w-5 h-5 text-emerald-400 animate-bounce" />
            ) : (
              <Trophy className="w-5 h-5 text-gold-bright animate-bounce" />
            )}
            <span className={`text-base sm:text-lg font-black uppercase tracking-wider ${
              isPs2
                ? 'text-[#00F0FF] drop-shadow-[0_0_8px_#00F0FF] font-mono'
                : isPixel
                ? 'text-pink-300 drop-shadow-[0_0_8px_#EC4899] font-mono'
                : isTimber
                ? 'text-amber-300 drop-shadow'
                : 'gold-gradient-text'
            }`}>
              {isPs2 ? 'DualShock 2 Memory Double-Up' : isPixel ? '1989 Cyber Token Double-Up' : isTimber ? 'Wild Forest Berry Double-Up' : 'Casino Video Poker Double-Up'}
            </span>
          </div>
          <button
            onClick={() => {
              if (gambleStatus === 'LOST') {
                finalizeLose();
              } else if (onClose) {
                onClose();
              } else {
                handleCollect();
              }
            }}
            disabled={isFlipping}
            aria-label="Close Gamble Modal"
            className={`p-1.5 rounded-lg text-slate-300 disabled:opacity-40 ${
              isPs2 ? 'bg-[#00224d] hover:bg-[#003880]' : isPixel ? 'bg-purple-950 hover:bg-pink-900' : isTimber ? 'bg-[#1a0e06] hover:bg-[#2e180a]' : 'bg-casino-800 hover:bg-casino-700'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Gamble Feature Mode Switcher */}
        <div className="w-full flex items-center p-1 rounded-xl bg-black/40 border border-white/10 mb-4 text-xs font-bold">
          <button
            onClick={() => setGambleMode('CARDS')}
            className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center space-x-1 ${
              gambleMode === 'CARDS'
                ? isPs2
                  ? 'bg-[#006FCD] text-white shadow-[0_0_12px_rgba(0,111,205,0.8)] font-mono'
                  : isPixel
                  ? 'bg-pink-600 text-white shadow-[0_0_12px_rgba(236,72,153,0.8)] font-mono'
                  : isTimber
                  ? 'bg-emerald-700 text-white shadow-md'
                  : 'bg-gold-500 text-black font-black shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>🃏</span>
            <span>Card Double-Up (2X)</span>
          </button>
          <button
            onClick={() => setGambleMode('MYSTERY_PICK')}
            className="flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center space-x-1 text-slate-400 hover:text-white hover:bg-white/5"
          >
            <Gift className="w-3.5 h-3.5 text-amber-300" />
            <span>{isPs2 ? 'Memory Sectors' : isPixel ? 'Prize Cubes' : isTimber ? 'Hollow Logs' : 'Vault Safes'}</span>
          </button>
        </div>

        {/* Current Win Pot */}
        <div className="flex flex-col items-center mb-5">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">
            {isPs2 ? 'Current Cache Pot' : 'Current Win Pot'}
          </span>
          <span className={`text-2xl sm:text-3xl font-black ${
            isPs2 ? 'text-[#00F0FF] drop-shadow-[0_0_12px_#00F0FF]' : isPixel ? 'text-cyan-300 drop-shadow-[0_0_12px_#06B6D4]' : 'text-amber-300 drop-shadow-[0_0_12px_rgba(251,191,36,0.8)]'
          }`}>
            {currentPot.toLocaleString()} {isPs2 ? 'CREDITS' : isPixel ? 'PTS' : 'COINS'}
          </span>
          <span className="text-[11px] text-emerald-400 font-bold mt-0.5">
            Double to: {(currentPot * 2).toLocaleString()} {isPs2 ? 'CREDITS' : isPixel ? 'PTS' : 'COINS'}
          </span>
        </div>

        {/* 3D Playing Card */}
        <div className="relative w-40 h-56 sm:w-48 sm:h-64 my-2 perspective-1000 flex items-center justify-center">
          <div
            className={`w-full h-full rounded-2xl border-4 transition-all duration-500 transform shadow-2xl flex flex-col items-center justify-center ${
              isFlipping
                ? 'rotate-y-90 scale-95 opacity-50 bg-slate-900 border-white/20'
                : revealedCard
                ? revealedCard.color === 'RED'
                  ? isPs2
                    ? 'bg-gradient-to-b from-[#2e0509] to-rose-950 border-rose-500 text-rose-300 shadow-[0_0_30px_rgba(244,63,94,0.8)] font-mono'
                    : isPixel
                    ? 'bg-gradient-to-b from-[#24061a] to-rose-950 border-pink-500 text-pink-300 shadow-[0_0_30px_rgba(236,72,153,0.8)] font-mono'
                    : isTimber
                    ? 'bg-gradient-to-b from-[#2d120a] to-[#1a0804] border-red-500 text-amber-200 shadow-[0_0_30px_rgba(239,68,68,0.7)]'
                    : 'bg-gradient-to-b from-white to-rose-50 border-rose-600 text-rose-600 shadow-[0_0_30px_rgba(225,29,72,0.6)]'
                  : isPs2
                  ? 'bg-gradient-to-b from-[#031533] to-[#01091a] border-[#00F0FF] text-cyan-200 shadow-[0_0_30px_rgba(0,240,255,0.8)] font-mono'
                  : isPixel
                  ? 'bg-gradient-to-b from-[#081a2e] to-blue-950 border-cyan-400 text-cyan-300 shadow-[0_0_30px_rgba(6,182,212,0.8)] font-mono'
                  : isTimber
                  ? 'bg-gradient-to-b from-[#14121a] to-[#0a0810] border-purple-500 text-purple-200 shadow-[0_0_30px_rgba(168,85,247,0.7)]'
                  : 'bg-gradient-to-b from-white to-slate-100 border-slate-900 text-slate-900 shadow-[0_0_30px_rgba(15,23,42,0.8)]'
                : isPs2
                ? 'bg-gradient-to-br from-[#00102b] via-[#001f4d] to-black border-[#006FCD] shadow-[0_0_25px_rgba(0,111,205,0.6)]'
                : isPixel
                ? 'bg-gradient-to-br from-purple-900 via-indigo-950 to-black border-pink-400 shadow-[0_0_25px_rgba(236,72,153,0.5)]'
                : isTimber
                ? 'bg-gradient-to-br from-[#2e1708] via-[#1a0c04] to-black border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.5)]'
                : 'bg-gradient-to-br from-indigo-900 via-blue-950 to-casino-950 border-yellow-400 shadow-[0_0_20px_rgba(234,179,8,0.5)]'
            }`}
          >
            {!revealedCard && !isFlipping && (
              <div className="flex flex-col items-center space-y-2">
                {isPs2 ? (
                  <span className="text-3xl animate-bounce">🎮</span>
                ) : isPixel ? (
                  <Zap className="w-8 h-8 text-pink-400 animate-pulse" />
                ) : isTimber ? (
                  <span className="text-3xl animate-bounce">🍓</span>
                ) : (
                  <Sparkles className="w-8 h-8 text-yellow-400 animate-pulse" />
                )}
                <span className={`text-xs font-black tracking-widest uppercase ${
                  isPs2 ? 'text-[#00F0FF]' : isPixel ? 'text-pink-300' : isTimber ? 'text-amber-300' : 'text-yellow-300'
                }`}>
                  {isPs2 ? '◯ RED OR ✕ BLUE?' : isPixel ? 'RED OR BLUE?' : isTimber ? 'CRIMSON OR BLACKBERRY?' : 'RED OR BLACK?'}
                </span>
                <span className="text-[9px] text-slate-400">GUESS TO DOUBLE</span>
              </div>
            )}

            {revealedCard && !isFlipping && (
              <div className="relative flex flex-col items-center justify-between h-full p-3 sm:p-4 w-full overflow-hidden">
                {/* Filigree Corner Inset Frame */}
                <div className={`absolute inset-1.5 rounded-xl border pointer-events-none ${
                  isPs2
                    ? 'border-[#006FCD]/50'
                    : isPixel
                    ? 'border-pink-500/40'
                    : isTimber
                    ? 'border-[#a16207]/40'
                    : 'border-yellow-500/40'
                }`} />

                {/* Top Corner Icon & Rank Badge */}
                <div className="w-full flex justify-between items-center z-10">
                  <div className="flex items-center space-x-1">
                    <span className="font-black text-xl sm:text-2xl leading-none">{revealedCard.rank}</span>
                    <span className="text-sm">
                      {isPs2
                        ? revealedCard.color === 'RED' ? '◯' : '✕'
                        : isPixel
                        ? revealedCard.color === 'RED' ? '⚡' : '🔮'
                        : isTimber
                        ? revealedCard.color === 'RED' ? '🍓' : '🫐'
                        : revealedCard.suit === 'HEARTS' ? '♥' : revealedCard.suit === 'DIAMONDS' ? '♦' : revealedCard.suit === 'SPADES' ? '♠' : '♣'}
                    </span>
                  </div>
                  <div className="text-[9px] font-black uppercase tracking-widest opacity-75">
                    {isPs2 ? 'EMOTION CARD' : isPixel ? 'CYBER CARD' : isTimber ? 'WOODLAND CARD' : '24K ROYAL'}
                  </div>
                </div>

                {/* Center Giant Custom Themed Icon */}
                <div className="flex flex-col items-center justify-center my-auto z-10">
                  {isPs2 ? (
                    <div className="flex flex-col items-center">
                      <div className="text-5xl sm:text-6xl animate-pulse drop-shadow-[0_0_15px_currentColor]">
                        {revealedCard.color === 'RED' ? '◯' : '✕'}
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest mt-1 font-mono">
                        {revealedCard.color === 'RED' ? 'RED CIRCLE' : 'BLUE CROSS'}
                      </span>
                    </div>
                  ) : isPixel ? (
                    <div className="flex flex-col items-center">
                      <div className="text-5xl sm:text-6xl animate-pulse drop-shadow-[0_0_15px_currentColor]">
                        {revealedCard.color === 'RED' ? '🔴' : '🔵'}
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest mt-1 font-mono">
                        {revealedCard.color === 'RED' ? 'RED LASER' : 'BLUE PLASMA'}
                      </span>
                    </div>
                  ) : isTimber ? (
                    <div className="flex flex-col items-center">
                      <div className="text-5xl sm:text-6xl animate-bounce">
                        {revealedCard.color === 'RED' ? '🍓' : '🫐'}
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest mt-1 text-amber-200">
                        {revealedCard.color === 'RED' ? 'SALMONBERRY' : 'BLACKBERRY'}
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <div className="text-5xl sm:text-6xl drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]">
                        {revealedCard.suit === 'HEARTS'
                          ? '♥'
                          : revealedCard.suit === 'DIAMONDS'
                          ? '♦'
                          : revealedCard.suit === 'SPADES'
                          ? '♠'
                          : '♣'}
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest mt-1 text-yellow-600">
                        {revealedCard.color === 'RED' ? 'ROYAL CRIMSON' : 'MIDNIGHT ONYX'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Bottom Inverted Rank Badge */}
                <div className="w-full flex justify-between items-center rotate-180 z-10">
                  <div className="flex items-center space-x-1">
                    <span className="font-black text-xl sm:text-2xl leading-none">{revealedCard.rank}</span>
                    <span className="text-sm">
                      {isPs2
                        ? revealedCard.color === 'RED' ? '◯' : '✕'
                        : isPixel
                        ? revealedCard.color === 'RED' ? '⚡' : '🔮'
                        : isTimber
                        ? revealedCard.color === 'RED' ? '🍓' : '🫐'
                        : revealedCard.suit === 'HEARTS' ? '♥' : revealedCard.suit === 'DIAMONDS' ? '♦' : revealedCard.suit === 'SPADES' ? '♠' : '♣'}
                    </span>
                  </div>
                  <div className="text-[9px] font-black uppercase tracking-widest opacity-75">
                    {isPs2 ? 'EMOTION CARD' : isPixel ? 'CYBER CARD' : isTimber ? 'WOODLAND CARD' : '24K ROYAL'}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Status Message */}
        <div className="h-7 my-2 flex items-center justify-center">
          {gambleStatus === 'WON' && (
            <span className="text-sm font-black text-emerald-400 animate-bounce">
              🎉 CORRECT! WIN DOUBLED TO {currentPot.toLocaleString()}!
            </span>
          )}
          {gambleStatus === 'LOST' && (
            <span className="text-sm font-black text-rose-500 animate-pulse">
              ❌ WRONG CARD! POT LOST!
            </span>
          )}
          {gambleStatus === 'CHOOSING' && (
            <span className="text-xs text-slate-400 font-bold">
              {isPs2
                ? 'SELECT RED ◯ OR BLUE ✕ TO OVERCLOCK DOUBLE'
                : isPixel
                ? 'CHOOSE RED LASER OR BLUE PLASMA TO DOUBLE'
                : isTimber
                ? 'PICK CRIMSON SALMONBERRY OR RIPE BLACKBERRY'
                : 'PICK A COLOR TO RISK & DOUBLE YOUR WIN'}
            </span>
          )}
        </div>

        {/* Action Controls: RED vs BLACK */}
        {gambleStatus !== 'LOST' && (
          <div className="w-full flex items-center space-x-3 mt-2">
            <button
              onClick={() => handlePickColor('RED')}
              disabled={isFlipping}
              className={`flex-1 py-3 sm:py-3.5 rounded-xl border text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg hover:scale-[1.02] active:scale-95 disabled:opacity-50 transition-all ${
                isPs2
                  ? 'bg-gradient-to-r from-red-600 via-rose-700 to-red-800 border-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.7)] font-mono'
                  : isPixel
                  ? 'bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 border-pink-400 shadow-[0_0_15px_rgba(236,72,153,0.7)]'
                  : isTimber
                  ? 'bg-gradient-to-r from-red-700 via-rose-600 to-amber-700 border-amber-500/50'
                  : 'bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 border-white/20'
              }`}
            >
              {isPs2 ? '◯ RED CIRCLE' : isPixel ? '🔴 RED LASER' : isTimber ? '🍓 SALMONBERRY' : 'RED ♥ ♦'}
            </button>
            <button
              onClick={() => handlePickColor('BLACK')}
              disabled={isFlipping}
              className={`flex-1 py-3 sm:py-3.5 rounded-xl border text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg hover:scale-[1.02] active:scale-95 disabled:opacity-50 transition-all ${
                isPs2
                  ? 'bg-gradient-to-r from-[#003875] via-[#006FCD] to-[#00A3FF] border-[#00F0FF] shadow-[0_0_15px_rgba(0,111,205,0.7)] font-mono'
                  : isPixel
                  ? 'bg-gradient-to-r from-cyan-600 via-blue-700 to-indigo-800 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.7)]'
                  : isTimber
                  ? 'bg-gradient-to-r from-purple-900 via-slate-900 to-stone-950 border-purple-400/50'
                  : 'bg-gradient-to-r from-slate-900 to-black hover:from-slate-800 hover:to-slate-950 border-white/30'
              }`}
            >
              {isPs2 ? '✕ BLUE CROSS' : isPixel ? '🔵 BLUE PLASMA' : isTimber ? '🫐 BLACKBERRY' : 'BLACK ♠ ♣'}
            </button>
          </div>
        )}

        {/* Collect Win / Take Pot Button */}
        {gambleStatus !== 'LOST' && (
          <button
            onClick={handleCollect}
            disabled={isFlipping}
            className={`w-full mt-3 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest shadow-md hover:scale-[1.01] active:scale-95 transition-transform ${
              isPs2
                ? 'bg-gradient-to-r from-[#00478F] via-[#006FCD] to-[#00F0FF] text-white shadow-[0_0_20px_rgba(0,240,255,0.7)] font-mono'
                : isPixel
                ? 'bg-gradient-to-r from-pink-500 via-purple-600 to-cyan-400 text-white shadow-[0_0_20px_rgba(236,72,153,0.7)] font-mono'
                : isTimber
                ? 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white border border-emerald-300'
                : 'bg-emerald-600 hover:bg-emerald-500 border border-white/20 text-black'
            }`}
          >
            TAKE WIN ({currentPot.toLocaleString()} {isPs2 ? 'CREDITS' : isPixel ? 'PTS' : 'COINS'})
          </button>
        )}

        {/* History Trail */}
        {history.length > 0 && (
          <div className="w-full flex items-center justify-center space-x-2 mt-4 pt-3 border-t border-white/10">
            <span className="text-[9px] uppercase font-bold text-slate-500">History:</span>
            {history.map((h, i) => (
              <span
                key={i}
                className={`text-xs font-black ${
                  h.color === 'RED'
                    ? isPixel ? 'text-pink-400' : 'text-rose-400'
                    : isPixel ? 'text-cyan-300' : 'text-slate-300'
                }`}
              >
                {h.rank}
                {h.suit === 'HEARTS'
                  ? '♥'
                  : h.suit === 'DIAMONDS'
                  ? '♦'
                  : h.suit === 'SPADES'
                  ? '♠'
                  : '♣'}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
