import React, { useState } from 'react';
import { X, Sparkles, Trophy } from 'lucide-react';
import { soundManager } from '../../audio/soundManager';

interface GambleModalProps {
  initialPot: number;
  onCollect: (amount: number) => void;
  onLose: () => void;
  onClose?: () => void;
}

type CardSuit = 'HEARTS' | 'DIAMONDS' | 'SPADES' | 'CLUBS';
type CardColor = 'RED' | 'BLACK';

export const GambleModal: React.FC<GambleModalProps> = ({
  initialPot,
  onCollect,
  onLose,
  onClose,
}) => {
  const [currentPot, setCurrentPot] = useState(initialPot);
  const [history, setHistory] = useState<{ color: CardColor; suit: CardSuit; rank: string }[]>([]);
  const [isFlipping, setIsFlipping] = useState(false);
  const [revealedCard, setRevealedCard] = useState<{
    color: CardColor;
    suit: CardSuit;
    rank: string;
  } | null>(null);
  const [gambleStatus, setGambleStatus] = useState<'CHOOSING' | 'WON' | 'LOST'>('CHOOSING');

  const handlePickColor = (chosenColor: CardColor) => {
    if (isFlipping) return;
    setIsFlipping(true);
    soundManager.playButtonClick();

    // Generate random card outcome
    const suits: CardSuit[] = ['HEARTS', 'DIAMONDS', 'SPADES', 'CLUBS'];
    const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    const randomSuit = suits[Math.floor(Math.random() * suits.length)];
    const randomRank = ranks[Math.floor(Math.random() * ranks.length)];
    const cardColor: CardColor = randomSuit === 'HEARTS' || randomSuit === 'DIAMONDS' ? 'RED' : 'BLACK';

    setTimeout(() => {
      const newCard = { color: cardColor, suit: randomSuit, rank: randomRank };
      setRevealedCard(newCard);
      setHistory((prev) => [newCard, ...prev.slice(0, 5)]);
      setIsFlipping(false);

      if (chosenColor === cardColor) {
        // Double the pot!
        const doubled = currentPot * 2;
        setCurrentPot(doubled);
        setGambleStatus('WON');
        soundManager.playWinChime(8);
      } else {
        // Lost
        setGambleStatus('LOST');
        soundManager.playReelStop(0);
        setTimeout(() => {
          onLose();
        }, 1600);
      }
    }, 600);
  };

  const handleCollect = () => {
    soundManager.playCoinTally();
    onCollect(currentPot);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md select-none animate-fadeIn">
      <div className="relative max-w-md w-full max-h-[92vh] overflow-y-auto bg-gradient-to-b from-casino-900 via-casino-950 to-black border-2 border-gold-bright/60 shadow-[0_0_50px_rgba(251,191,36,0.5)] rounded-3xl p-4 sm:p-7 flex flex-col items-center">
        {/* Header */}
        <div className="w-full flex items-center justify-between pb-3 border-b border-white/10 mb-4">
          <div className="flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-gold-bright animate-bounce" />
            <span className="text-base sm:text-lg font-black gold-gradient-text uppercase tracking-wider">
              Casino Video Poker Double-Up
            </span>
          </div>
          <button
            onClick={onClose || handleCollect}
            className="p-1.5 rounded-lg bg-casino-800 hover:bg-casino-700 text-slate-300"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Current Win Pot */}
        <div className="flex flex-col items-center mb-5">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">
            Current Win Pot
          </span>
          <span className="text-2xl sm:text-3xl font-black text-amber-300 drop-shadow-[0_0_12px_rgba(251,191,36,0.8)]">
            {currentPot.toLocaleString()} COINS
          </span>
          <span className="text-[11px] text-emerald-400 font-bold mt-0.5">
            Double to: {(currentPot * 2).toLocaleString()} COINS
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
                  ? 'bg-gradient-to-b from-white to-rose-50 border-rose-600 text-rose-600 shadow-[0_0_30px_rgba(225,29,72,0.6)]'
                  : 'bg-gradient-to-b from-white to-slate-100 border-slate-900 text-slate-900 shadow-[0_0_30px_rgba(15,23,42,0.8)]'
                : 'bg-gradient-to-br from-indigo-900 via-blue-950 to-casino-950 border-yellow-400 shadow-[0_0_20px_rgba(234,179,8,0.5)]'
            }`}
          >
            {!revealedCard && !isFlipping && (
              <div className="flex flex-col items-center space-y-2">
                <Sparkles className="w-8 h-8 text-yellow-400 animate-pulse" />
                <span className="text-xs font-black tracking-widest text-yellow-300 uppercase">
                  RED OR BLACK?
                </span>
                <span className="text-[9px] text-slate-400">GUESS TO DOUBLE</span>
              </div>
            )}

            {revealedCard && !isFlipping && (
              <div className="flex flex-col items-center justify-between h-full p-4 w-full">
                <div className="w-full flex justify-between items-start font-black text-xl">
                  <span>{revealedCard.rank}</span>
                  <span>
                    {revealedCard.suit === 'HEARTS'
                      ? '♥'
                      : revealedCard.suit === 'DIAMONDS'
                      ? '♦'
                      : revealedCard.suit === 'SPADES'
                      ? '♠'
                      : '♣'}
                  </span>
                </div>
                <div className="text-5xl">
                  {revealedCard.suit === 'HEARTS'
                    ? '♥'
                    : revealedCard.suit === 'DIAMONDS'
                    ? '♦'
                    : revealedCard.suit === 'SPADES'
                    ? '♠'
                    : '♣'}
                </div>
                <div className="w-full flex justify-between items-end font-black text-xl rotate-180">
                  <span>{revealedCard.rank}</span>
                  <span>
                    {revealedCard.suit === 'HEARTS'
                      ? '♥'
                      : revealedCard.suit === 'DIAMONDS'
                      ? '♦'
                      : revealedCard.suit === 'SPADES'
                      ? '♠'
                      : '♣'}
                  </span>
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
              PICK A COLOR TO RISK &amp; DOUBLE YOUR WIN
            </span>
          )}
        </div>

        {/* Action Controls: RED vs BLACK */}
        {gambleStatus !== 'LOST' && (
          <div className="w-full flex items-center space-x-3 mt-2">
            <button
              onClick={() => handlePickColor('RED')}
              disabled={isFlipping}
              className="flex-1 py-3 sm:py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 border border-white/20 text-white font-black text-sm uppercase tracking-wider shadow-lg hover:scale-[1.02] active:scale-95 disabled:opacity-50"
            >
              RED ♥ ♦
            </button>
            <button
              onClick={() => handlePickColor('BLACK')}
              disabled={isFlipping}
              className="flex-1 py-3 sm:py-3.5 rounded-xl bg-gradient-to-r from-slate-900 to-black hover:from-slate-800 hover:to-slate-950 border border-white/30 text-white font-black text-sm uppercase tracking-wider shadow-lg hover:scale-[1.02] active:scale-95 disabled:opacity-50"
            >
              BLACK ♠ ♣
            </button>
          </div>
        )}

        {/* Collect Win / Take Pot Button */}
        {gambleStatus !== 'LOST' && (
          <button
            onClick={handleCollect}
            disabled={isFlipping}
            className="w-full mt-3 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 border border-white/20 text-black font-black text-xs uppercase tracking-widest shadow-md hover:scale-[1.01] active:scale-95"
          >
            TAKE WIN ({currentPot.toLocaleString()} COINS)
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
                  h.color === 'RED' ? 'text-rose-400' : 'text-slate-300'
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
