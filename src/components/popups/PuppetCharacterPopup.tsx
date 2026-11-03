import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import type { GameId } from '../../games/types';
import { soundManager } from '../../audio/soundManager';
import { quotaManager, type QuotaState, type QuotaTier } from '../../engine/quotaSystem';

interface PuppetCharacterPopupProps {
  activeGameId?: GameId;
  isSpinning?: boolean;
  isAnticipating?: boolean;
  winAmount?: number;
  unlockedTier?: QuotaTier | null;
  onRewardCoins?: (coins: number) => void;
}

interface CharacterLineMap {
  idle: string[];
  win: string[];
  bigWin: string[];
  anticipating: string[];
  quota?: string[];
}

const BARON_LINES: CharacterLineMap = {
  idle: [
    'Great smoking gears! Do I pay you by the hour to stare at the carpet? Spin that reel!',
    'Bah! The board of directors is breathing down my brass collar. Get back to work!',
    'Two years of continuous spinning and you might just unlock Chapter 2: The Deep Sub-Vault!',
    'My valet informs me you took a ten-second breather. Unacceptable! Pull the lever!',
    'That molten gold isn’t going to press itself into bullion bars, grease monkey!',
  ],
  win: [
    'Hot slag! That’ll cover the fuel surcharge on my private dirigible!',
    'Not bad, lad! I might just approve a 4-minute cafeteria biscuit break!',
    'Splendid payline! The minting boilers are humming with 999.9 pure profit!',
    'Keep that steam pumping! You’re putting my shift supervisor to shame!',
  ],
  bigWin: [
    'GREAT JUMPING PISTONS! A MONSTER PAYOUT! Lock the vault gates, we broke the bank!',
    'HOLY HIGH-PRESSURE STEAM! That’s more gold than I keep in my drawing room safe!',
    'Magnificent! Bartholomew approves! Someone bring this worker a glass of vintage port!',
  ],
  anticipating: [
    'Hold your wrenches! Two vault scatters locked! Don’t tease an old tycoon, my ticker can’t take it!',
    'One more tumbler and the main vault opens! Great gears of Birmingham, come to papa!',
  ],
};

const GUS_LINES: CharacterLineMap = {
  idle: [
    'Shake them towering pines, greenhorn! We got 40 cords of cedar to split before sunset!',
    'Camp quota won’t fill itself on wishful thinkin’! Give that timber lever a yank!',
    'Gus is gettin’ hungry! Spin up some honey jars before he starts chewin’ the porch rail!',
    'Two years in these woods and you’ll know every owl by name! Keep rollin’!',
  ],
  win: [
    'HOT SQUIRREL GRAVY! That’s a woodsman special right off the griddle!',
    'Atta boy! That cedar sliced like fresh butter! Stack them coins high!',
    'Yeeee-haw! Even the woodpeckers are tappin’ their toes to that payout!',
  ],
  bigWin: [
    'TIMBERRRRRR! Clear the campsite! We’re feastin’ on King Salmon all winter long!',
    'HOLY PINE SAP! That’s a monster harvest! Gus is doin’ the camp jig!',
  ],
  anticipating: [
    'HOO HOO! Two moonlit owls on the high branch! One more hoot and the whole forest parties!',
    'Hold your breath, explorer! The canopy is shakin’ for that third scatter!',
  ],
};

export const PuppetCharacterPopup: React.FC<PuppetCharacterPopupProps> = ({
  activeGameId = 'vault-24k',
  isSpinning = false,
  isAnticipating = false,
  winAmount = 0,
  unlockedTier = null,
  onRewardCoins,
}) => {
  const isTimber = activeGameId === 'timber-critters';
  const [isVisible, setIsVisible] = useState(false);
  const [speechText, setSpeechText] = useState('');
  const [speechCategory, setSpeechCategory] = useState<'idle' | 'win' | 'bigWin' | 'anticipating' | 'quota'>('idle');
  const [quotaState, setQuotaState] = useState<QuotaState>(() => quotaManager.getState(activeGameId));
  const [isJiggling, setIsJiggling] = useState(false);
  const hideTimerRef = useRef<number | null>(null);
  const lastSpinTimeRef = useRef<number>(Date.now());

  // Listen to quota updates
  useEffect(() => {
    const unsub = quotaManager.subscribe((gId, state) => {
      if (gId === activeGameId) {
        setQuotaState({ ...state });
      }
    });
    return unsub;
  }, [activeGameId]);

  // Track user inactivity (Idle Quota Nagging)
  useEffect(() => {
    const checkIdle = setInterval(() => {
      if (!isSpinning && !isVisible && Date.now() - lastSpinTimeRef.current > 25000) {
        triggerPopup('idle');
        lastSpinTimeRef.current = Date.now();
      }
    }, 5000);

    return () => clearInterval(checkIdle);
  }, [isSpinning, isVisible]);

  // Handle spin events
  useEffect(() => {
    if (isSpinning) {
      lastSpinTimeRef.current = Date.now();
      if (isAnticipating) {
        triggerPopup('anticipating');
      }
    } else if (winAmount > 0) {
      if (winAmount >= 500) {
        triggerPopup('bigWin');
      } else {
        triggerPopup('win');
      }
    }
  }, [isSpinning, isAnticipating, winAmount]);

  // Handle newly unlocked tier celebration
  useEffect(() => {
    if (unlockedTier) {
      triggerPopup('quota', unlockedTier.dialogueUnlock);
      if (onRewardCoins) {
        onRewardCoins(unlockedTier.coinReward);
      }
    }
  }, [unlockedTier]);

  const triggerPopup = (category: 'idle' | 'win' | 'bigWin' | 'anticipating' | 'quota', customText?: string) => {
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);

    const pool = isTimber ? GUS_LINES : BARON_LINES;
    const list = (category !== 'quota' ? pool[category] : undefined) || pool.idle;
    const text = customText || list[Math.floor(Math.random() * list.length)] || pool.idle[0];

    setSpeechText(text);
    setSpeechCategory(category);
    setIsVisible(true);
    setIsJiggling(true);
    setTimeout(() => setIsJiggling(false), 800);

    // Audio cue
    soundManager.playPuppetBoing();
    setTimeout(() => {
      soundManager.playPuppetQuip();
    }, 180);

    // Auto hide after 8 seconds
    hideTimerRef.current = window.setTimeout(() => {
      setIsVisible(false);
    }, 8500);
  };

  const handleCharacterClick = () => {
    soundManager.playPuppetBoing();
    setIsJiggling(true);
    setTimeout(() => setIsJiggling(false), 600);
    triggerPopup('idle');
  };

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsVisible(false);
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
  };

  const curTier = quotaManager.getCurrentTier(activeGameId);
  const progressPercent = Math.min(100, Math.round((quotaState.currentPoints / curTier.targetPoints) * 100));

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-14 sm:bottom-16 left-2 sm:left-6 z-50 pointer-events-auto flex items-end space-x-2 select-none animate-slide-in-up">
      {/* 1. Pin-Joint Articulated Puppet Bust Sprite */}
      <div
        onClick={handleCharacterClick}
        className={`relative cursor-pointer group transition-transform duration-300 ${
          isJiggling ? 'animate-bounce' : 'hover:scale-105'
        }`}
        title="Click to interact with the Boss!"
      >
        {/* Grungy Brass Pin-Joint Rivets Overlay */}
        <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-gradient-to-br from-yellow-300 to-amber-700 border border-black shadow z-30 flex items-center justify-center">
          <div className="w-1 h-1 rounded-full bg-amber-950" />
        </div>
        <div className="absolute top-1/2 -left-1 w-2.5 h-2.5 rounded-full bg-gradient-to-br from-yellow-300 to-amber-700 border border-black shadow z-30 flex items-center justify-center">
          <div className="w-0.5 h-0.5 rounded-full bg-amber-950" />
        </div>

        {/* Steampunk Cigar Smoke Plume (Baron Only) */}
        {!isTimber && (
          <div className="absolute -top-6 right-3 pointer-events-none z-20 flex flex-col items-center">
            <span className="w-2.5 h-2.5 rounded-full bg-white/40 filter blur-xs animate-ping" />
            <span className="w-3.5 h-3.5 rounded-full bg-cyan-200/30 filter blur-sm animate-pulse -mt-1" />
          </div>
        )}

        {/* Character Puppet Frame Card */}
        <div
          className={`w-24 h-28 sm:w-28 sm:h-32 rounded-2xl overflow-hidden border-2 shadow-2xl relative p-1 ${
            isTimber
              ? 'bg-gradient-to-b from-[#3d1e0b] via-[#1f0f05] to-black border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.5)]'
              : 'bg-gradient-to-b from-amber-950 via-slate-900 to-black border-yellow-400 shadow-[0_0_25px_rgba(245,158,11,0.7)]'
          }`}
        >
          {/* Authentic Cutout Puppet Illustration */}
          <img
            src={isTimber ? './assets/grizzly_gus.jpg' : './baron_sterling.jpg'}
            alt={isTimber ? 'Grizzly Gus' : 'Baron Bartholomew Sterling'}
            className="w-full h-full object-cover object-top rounded-xl filter drop-shadow-md"
            onError={(e) => {
              // Fallback if image path differences occur
              (e.target as HTMLImageElement).src = isTimber ? '/assets/grizzly_gus.jpg' : '/baron_sterling.jpg';
            }}
          />

          {/* Nameplate Pill */}
          <div
            className={`absolute bottom-1 inset-x-1.5 py-0.5 rounded-md text-[7.5px] font-black uppercase text-center border shadow-md ${
              isTimber
                ? 'bg-[#2b1407]/95 text-amber-200 border-amber-600/60'
                : 'bg-casino-950/95 text-yellow-300 border-yellow-500/70'
            }`}
          >
            {isTimber ? '🌲 GRIZZLY GUS' : '⚙️ BARON STERLING'}
          </div>
        </div>
      </div>

      {/* 2. Comic Speech Bubble & Unreasonable Quota Progress */}
      <div className="relative max-w-xs sm:max-w-sm mb-4">
        {/* Comic Pointer Triangle */}
        <div
          className={`absolute -left-2 bottom-4 w-0 h-0 border-t-8 border-t-transparent border-r-8 border-b-8 border-b-transparent ${
            isTimber ? 'border-r-[#1e1008]' : 'border-r-slate-900'
          }`}
        />

        {/* Main Dialogue Speech Box */}
        <div
          className={`p-3 rounded-2xl border-2 shadow-2xl relative backdrop-blur-md ${
            isTimber
              ? 'bg-[#180d06]/95 border-amber-500/80 shadow-[0_4px_25px_rgba(0,0,0,0.95)]'
              : 'bg-slate-950/95 border-yellow-400/90 shadow-[0_4px_30px_rgba(0,0,0,0.95)]'
          }`}
        >
          {/* Header Bar with Category Tag & Dismiss X */}
          <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-white/10">
            <div className="flex items-center space-x-1">
              <span className="text-xs">
                {speechCategory === 'quota' ? '🏆' : speechCategory === 'bigWin' ? '🔥' : '💬'}
              </span>
              <span
                className={`text-[8.5px] font-black uppercase tracking-wider ${
                  isTimber ? 'text-emerald-300' : 'text-amber-300'
                }`}
              >
                {speechCategory === 'quota'
                  ? 'QUOTA MILESTONE UNLOCKED!'
                  : speechCategory === 'bigWin'
                  ? 'JACKPOT REACTION'
                  : speechCategory === 'anticipating'
                  ? 'HIGH TENSION LOCK'
                  : 'BOSS COMMENTARY'}
              </span>
            </div>

            <button
              onClick={handleDismiss}
              className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              title="Dismiss dialogue"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Speech Text */}
          <p className="text-[11px] sm:text-xs font-bold leading-snug text-slate-100 font-sans tracking-wide">
            “{speechText}”
          </p>

          {/* Unreasonable Quota Progress Tracker */}
          <div className="mt-2.5 pt-2 border-t border-white/10 flex flex-col space-y-1">
            <div className="flex items-center justify-between text-[8px] font-mono font-bold">
              <span className="text-amber-300 uppercase truncate">
                QUOTA TIER {quotaState.currentTierIndex + 1}: {curTier.name}
              </span>
              <span className="text-slate-300 ml-1 flex-shrink-0 font-black">
                {progressPercent}%
              </span>
            </div>

            {/* Quota Progress Bar */}
            <div className="w-full h-1.5 rounded-full bg-black/80 border border-white/10 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 shadow-sm ${
                  isTimber
                    ? 'bg-gradient-to-r from-emerald-500 to-amber-400'
                    : 'bg-gradient-to-r from-amber-500 via-yellow-300 to-amber-500'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Next Perk Reward */}
            <div className="text-[7.5px] font-mono text-slate-400 flex items-center justify-between">
              <span className="truncate">Reward: +{curTier.coinReward.toLocaleString()} coins</span>
              <span className="text-amber-400 font-black flex-shrink-0">
                {quotaState.currentPoints.toLocaleString()} / {curTier.targetPoints.toLocaleString()} pts
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
