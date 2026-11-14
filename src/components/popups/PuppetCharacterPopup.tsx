import React, { useCallback, useEffect, useRef, useState } from 'react';
import type { GameId } from '../../games/types';
import { soundManager } from '../../audio/soundManager';
import { X } from 'lucide-react';
import { quotaManager, type QuotaState, type QuotaTier } from '../../engine/quotaSystem';
import baronImg from '../../assets/baron_sterling.webp';
import gusImg from '../../assets/grizzly_gus.webp';
import pennyImg from '../../assets/pixel_penny.webp';

interface PuppetCharacterPopupProps {
  activeGameId?: GameId;
  isSpinning?: boolean;
  isAnticipating?: boolean;
  isNearMiss?: boolean;
  isMaxBet?: boolean;
  consecutiveWins?: number;
  winAmount?: number;
  unlockedTier?: QuotaTier | null;
  onRewardCoins?: (coins: number) => void;
  onClearUnlockedTier?: () => void;
}

interface CharacterLineMap {
  idle: string[];
  win: string[];
  bigWin: string[];
  anticipating: string[];
  coldStreak: string[];
  nearMiss: string[];
  maxBet: string[];
  streakWin: string[];
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
  nearMiss: [
    'ARGH! Two vault bolts clicked and the third jammed! Don’t tease an old tycoon!',
    'By the Queen’s corgis! One tumbler away from the gold bars! Spin again, immediately!',
  ],
  maxBet: [
    'Now THAT is executive decision making! Bartholomew likes a fearless high-roller!',
    'MAX STEAM PRESSURE! You’re swinging for the Fort Knox fences, lad!',
  ],
  streakWin: [
    'Three consecutive paylines! The mint is singing like a brass steam organ!',
    'Triple dividend on the ledger! Keep this up and I might give you stock options!',
  ],
  coldStreak: [
    'Five dry spins in a row? Bah! Put some grease on those bearings and pull harder!',
    'The furnace is losing pressure! Don’t just sit there, feed another gold coin to the hopper!',
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
  nearMiss: [
    'HOO-WEE! Two moonlit owls in a row! One more feather and the timber bonus was ours!',
    'Gus almost dropped his flapjack! Two scatters lined up! Keep sawin’ that cedar!',
  ],
  maxBet: [
    'WHOLE HOG WOODCUTTER! Maximum cords on the line! Let’s fell a giant redwood!',
    'Hot maple syrup! Gus tips his beaver cap to a brave high-roller!',
  ],
  streakWin: [
    'THREE IN A ROW! The camp dinner bell is ringin’ for fresh river trout!',
    'A woodland hat trick! Gus is whistlin’ all the way to the sawmill!',
  ],
  coldStreak: [
    'Just a dry breeze through the hemlocks! Keep sawdust in your boots, the next spin is ripe!',
    'Don’t let a dry run spook ya! Even the grizzly has to sniff a few empty logs before the honey!',
  ],
};

const ARCADE_LINES: CharacterLineMap = {
  idle: [
    'INSERT COIN, PLAYER 1! Don’t let your combo meter drop to zero on my watch!',
    'That balltop joystick isn’t gonna wiggle itself! Pull for the 8-Bit Boss Stage!',
    'Two years in this arcade and you might discover the secret warp pipe behind the coin door!',
    'High score table is waiting! Put your three initials AAA right at the top!',
    'Hey kid, the CRT phosphor is burning in! Spin those 6 mega-reels!',
  ],
  win: [
    'COMBO STRIKE! +1,000 EXP points straight to your neighborhood arcade ledger!',
    'Sweet 8-bit chimes! That payline hit harder than an invincibility power star!',
    '1-UP! The token hopper is spitting sweet brass tokens into your cup!',
  ],
  bigWin: [
    'STAGE CLEAR! BOSS DEFEATED! THE COIN HOPPER IS OVERFLOWING ONTO THE CARPET!',
    'MAXIMUM OVERDRIVE! Holy pixel dust, that is an all-time tournament high score record!',
  ],
  anticipating: [
    'WARNING! BOSS DETECTED! Two ROM cartridges locked in the slot! ONE MORE FOR BONUS STAGE!',
    'CHIPTUNE INTENSIFIES! That 6th reel is spinning for the final cartridge strike!',
  ],
  nearMiss: [
    'ALMOST HIT THE BONUS STAGE! 2 ROM Cartridges inserted, one more for extra lives!',
    'WARNING! Boss stage almost unlocked! Don’t let your combo drop now!',
  ],
  maxBet: [
    'TURBO OVERCLOCK ACTIVE! Max credits inserted! Going for the #1 tournament record!',
    'MAXIMUM POWER-UP! That CRT tube is glowing with raw 8-bit energy!',
  ],
  streakWin: [
    'TRIPLE COMBO STRIKE! +300% Multiplier bonus surging through the board!',
    'CANNOT BE STOPPED! Three straight victories! Player 1 is on fire!',
  ],
  coldStreak: [
    'Out of continues? No way! Tap that button rapid-fire, your streak is coming right back!',
    'A few blank pixels never stopped a true arcade champion! Insert another coin and roll!',
  ],
};

const PS2_LINES: CharacterLineMap = {
  idle: [
    'Emotion Engine 128-bit core at 294 MHz. Waiting on user vector instruction: execute spin!',
    'The Graphics Synthesizer is idling at 147 MHz. Feed the DMA channel another spin cycle!',
    'Warning: No memory card activity detected in Slot 1. Spin to populate system save blocks!',
    'Sub-pixel rendering pipeline calibrated. Ready for 128-bit slot execution!',
    'Optical pickup laser calibrated. Spin the disc before the drive spins down!',
  ],
  win: [
    'Vector Unit 0 (VU0) confirmed payline calculation! Payout credits written to memory!',
    '128-Bit Emotion Pipeline clear! High-bandwidth bus transfers winning credits!',
    'Memory Card save operation complete: payout credits cached to Slot 1 MagicGate!',
    'Floating point coprocessor locked the winning vectors! Clean hit!',
  ],
  bigWin: [
    'JACKPOT OVERFLOW! 128-BIT EMOTION ENGINE OVERCLOCK AT MAXIMUM 6.2 GFLOPS CAPACITY!',
    'CRITICAL SYSTEM SURGE! Graphics Synthesizer VRAM buffer overflowing with pure gold coins!',
    'TITANIC PAYOUT! DualShock 2 dual rumble motors vibrating at maximum force feedback!',
  ],
  anticipating: [
    'OPTICAL LASER SEEK: 2 Blue DVD-ROM Scatters detected! VU1 calculating bonus vector!',
    'SYSTEM ALERT: Dual Scatters locked in the drive tray! Awaiting 3rd scatter seek!',
  ],
  nearMiss: [
    'SEEK ERROR: Optical laser skipped the 3rd DVD scatter by 0.05mm! Retry spin cycle!',
    'Two scatters verified, third tray stop slipped past the laser! Spin again to recalibrate!',
  ],
  maxBet: [
    'MAXIMUM OVERCLOCK! Emotion Engine running in 480p Progressive Scan with full 40 lines!',
    '128-BIT HIGH ROLLER: Full pipeline saturation on all 40 paylines!',
  ],
  streakWin: [
    'CONSECUTIVE VECTOR COMBO: 3 consecutive hits! DMA bus bandwidth pegged at 100%!',
    'VU0 and VU1 executing in parallel harmony! Winning streak recorded to BIOS history!',
  ],
  coldStreak: [
    'Laser alignment drift detected. Don’t eject the disc, recalibrate with another spin!',
    'Diagnostic check: Cache empty. Next vector cycle has increased hit probability!',
  ],
};

type SpeechCategory = 'idle' | 'win' | 'bigWin' | 'anticipating' | 'nearMiss' | 'maxBet' | 'streakWin' | 'quota' | 'coldStreak';

export const PuppetCharacterPopup: React.FC<PuppetCharacterPopupProps> = ({
  activeGameId = 'vault-24k',
  isSpinning = false,
  isAnticipating = false,
  isNearMiss = false,
  isMaxBet = false,
  consecutiveWins = 0,
  winAmount = 0,
  unlockedTier = null,
  onRewardCoins,
  onClearUnlockedTier,
}) => {
  const isTimber = activeGameId === 'timber-critters';
  const isPixel = activeGameId === 'pixel-arcade';
  const isPs2 = activeGameId === 'ps2-legends';

  const [isVisible, setIsVisible] = useState(false);
  const [speechText, setSpeechText] = useState('');
  const [speechCategory, setSpeechCategory] = useState<SpeechCategory>('idle');
  const [quotaState, setQuotaState] = useState<QuotaState>(() => quotaManager.getState(activeGameId));
  const [isJiggling, setIsJiggling] = useState(false);

  const hideTimerRef = useRef<number | null>(null);
  const jiggleTimerRef = useRef<number | null>(null);
  const quipTimerRef = useRef<number | null>(null);
  const lastSpinTimeRef = useRef<number>(0);
  const lastPopupTimeRef = useRef<number>(0);
  const consecutiveLossesRef = useRef<number>(0);

  const triggerPopup = useCallback(
    (category: SpeechCategory, customText?: string) => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
      if (jiggleTimerRef.current) clearTimeout(jiggleTimerRef.current);
      if (quipTimerRef.current) clearTimeout(quipTimerRef.current);
      lastPopupTimeRef.current = Date.now();

      const pool = isPs2 ? PS2_LINES : isTimber ? GUS_LINES : isPixel ? ARCADE_LINES : BARON_LINES;
      const list = (category !== 'quota' ? pool[category] : undefined) || pool.idle;
      const text = customText || list[Math.floor(Math.random() * list.length)] || pool.idle[0];

      setSpeechText(text);
      setSpeechCategory(category);
      setIsVisible(true);
      setIsJiggling(true);
      jiggleTimerRef.current = window.setTimeout(() => setIsJiggling(false), 700);

      // Audio cue
      soundManager.playPuppetBoing();
      quipTimerRef.current = window.setTimeout(() => {
        soundManager.playPuppetQuip();
      }, 160);

      // Auto hide after 8 seconds
      hideTimerRef.current = window.setTimeout(() => {
        setIsVisible(false);
      }, 8000);
    },
    [isPs2, isTimber, isPixel]
  );

  // Initialize activity timestamps on mount / game change and clean timers on unmount
  useEffect(() => {
    const now = Date.now();
    lastSpinTimeRef.current = now;
    lastPopupTimeRef.current = now;
    const raf = requestAnimationFrame(() => {
      setIsVisible(false);
      setSpeechText('');
      setSpeechCategory('idle');
      setIsJiggling(false);
      setQuotaState(quotaManager.getState(activeGameId));
    });
    return () => {
      cancelAnimationFrame(raf);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
      if (jiggleTimerRef.current) clearTimeout(jiggleTimerRef.current);
      if (quipTimerRef.current) clearTimeout(quipTimerRef.current);
    };
  }, [activeGameId]);

  // Listen to quota updates
  useEffect(() => {
    const unsub = quotaManager.subscribe((gId, state) => {
      if (gId === activeGameId) {
        setQuotaState({ ...state });
      }
    });
    return unsub;
  }, [activeGameId]);

  // Track user inactivity (Idle Quota Nagging - balanced to once every 50s)
  useEffect(() => {
    const checkIdle = setInterval(() => {
      const now = Date.now();
      if (!isSpinning && !isVisible && now - lastSpinTimeRef.current > 45000 && now - lastPopupTimeRef.current > 35000) {
        triggerPopup('idle');
      }
    }, 6000);

    return () => clearInterval(checkIdle);
  }, [isSpinning, isVisible, triggerPopup]);

  // Handle spin events with balanced trigger filtering
  useEffect(() => {
    const now = Date.now();
    let raf: number | null = null;
    if (isSpinning) {
      lastSpinTimeRef.current = now;
      if (isAnticipating && now - lastPopupTimeRef.current > 30000) {
        raf = requestAnimationFrame(() => triggerPopup('anticipating'));
      }
    } else {
      if (winAmount > 0) {
        consecutiveLossesRef.current = 0;
        if (winAmount >= 1000) {
          raf = requestAnimationFrame(() => triggerPopup('bigWin'));
        } else if (consecutiveWins >= 3 && now - lastPopupTimeRef.current > 20000) {
          raf = requestAnimationFrame(() => triggerPopup('streakWin'));
        } else if (winAmount >= 300 && now - lastPopupTimeRef.current > 30000) {
          raf = requestAnimationFrame(() => triggerPopup('win'));
        }
      } else {
        if (isNearMiss && now - lastPopupTimeRef.current > 25000) {
          raf = requestAnimationFrame(() => triggerPopup('nearMiss'));
        } else {
          consecutiveLossesRef.current += 1;
          if (consecutiveLossesRef.current >= 5 && now - lastPopupTimeRef.current > 35000) {
            consecutiveLossesRef.current = 0;
            raf = requestAnimationFrame(() => triggerPopup('coldStreak'));
          }
        }
      }
    }
    return () => {
      if (raf !== null) cancelAnimationFrame(raf);
    };
  }, [isSpinning, isAnticipating, isNearMiss, winAmount, consecutiveWins, triggerPopup]);

  // Max bet trigger
  useEffect(() => {
    if (!isMaxBet) return;
    const now = Date.now();
    if (now - lastPopupTimeRef.current > 35000) {
      const raf = requestAnimationFrame(() => triggerPopup('maxBet'));
      return () => cancelAnimationFrame(raf);
    }
  }, [isMaxBet, triggerPopup]);

  // Handle newly unlocked tier celebration
  useEffect(() => {
    if (!unlockedTier) return;
    const tierSnapshot = unlockedTier;
    const raf = requestAnimationFrame(() => {
      triggerPopup('quota', tierSnapshot.dialogueUnlock);
      onRewardCoins?.(tierSnapshot.coinReward);
      onClearUnlockedTier?.();
    });
    return () => cancelAnimationFrame(raf);
  }, [unlockedTier, onRewardCoins, onClearUnlockedTier, triggerPopup]);

  const handleCharacterClick = () => {
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
    <div className="fixed bottom-16 sm:bottom-20 right-2 sm:right-6 md:right-8 z-40 pointer-events-auto flex flex-row-reverse items-end space-x-reverse space-x-2 select-none animate-slide-in-up max-w-[92vw] sm:max-w-md">
      {/* 1. Pin-Joint Articulated Boss Standee Sprite (Anchored to Bottom-Right Corner) */}
      <div
        onClick={handleCharacterClick}
        className={`relative cursor-pointer group transition-transform duration-300 flex-shrink-0 ${
          isJiggling ? 'animate-bounce' : 'hover:scale-105'
        }`}
        title="Click to interact with the Boss!"
      >
        {/* Grungy Brass Pin-Joint Rivets Overlay */}
        <div className="absolute -top-1 -left-1 w-3 h-3 rounded-full bg-gradient-to-br from-yellow-300 to-amber-700 border border-black shadow z-30 flex items-center justify-center">
          <div className="w-1 h-1 rounded-full bg-amber-950" />
        </div>
        <div className="absolute top-1/2 -right-1 w-2.5 h-2.5 rounded-full bg-gradient-to-br from-yellow-300 to-amber-700 border border-black shadow z-30 flex items-center justify-center">
          <div className="w-0.5 h-0.5 rounded-full bg-amber-950" />
        </div>

        {/* Character Puppet Frame Card */}
        <div
          className={`w-20 h-24 sm:w-24 sm:h-28 rounded-2xl overflow-hidden border-2 shadow-2xl relative p-0.5 ${
            isPs2
              ? 'bg-gradient-to-b from-[#001122] via-[#002244] to-black border-[#006FCD] shadow-[0_0_20px_rgba(0,111,205,0.7)]'
              : isTimber
              ? 'bg-gradient-to-b from-[#3d1e0b] via-[#1f0f05] to-black border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.5)]'
              : isPixel
              ? 'bg-gradient-to-b from-purple-950 via-slate-950 to-black border-pink-400 shadow-[0_0_20px_rgba(236,72,153,0.6)]'
              : 'bg-gradient-to-b from-amber-950 via-slate-900 to-black border-yellow-400 shadow-[0_0_25px_rgba(245,158,11,0.7)]'
          }`}
        >
          {/* Authentic Cutout Puppet Illustration or PS2 Vector CPU */}
          {isPs2 ? (
            <div className="w-full h-full rounded-xl bg-gradient-to-br from-[#060e1c] via-[#02050c] to-black flex flex-col items-center justify-center p-1.5 relative overflow-hidden">
              <div
                className="absolute inset-0 opacity-30 pointer-events-none"
                style={{
                  backgroundImage: 'radial-gradient(#00F0FF 1px, transparent 1px)',
                  backgroundSize: '8px 8px',
                }}
              />
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg bg-gradient-to-b from-[#181c24] to-[#0a0d14] border border-[#006FCD] shadow-[0_0_15px_rgba(0,111,205,0.8)] relative flex flex-col items-center justify-center">
                <div className="absolute top-1 left-1 w-1.5 h-1.5 bg-yellow-400 rotate-45 shadow-[0_0_4px_#FACC15]" />
                <div className="flex items-center space-x-2 my-1">
                  <div className="w-2.5 h-1.5 rounded-xs bg-[#00F0FF] shadow-[0_0_8px_#00F0FF] animate-pulse" />
                  <div className="w-2.5 h-1.5 rounded-xs bg-[#00F0FF] shadow-[0_0_8px_#00F0FF] animate-pulse" />
                </div>
                <span className="text-[6px] font-black tracking-widest text-[#006FCD] uppercase font-mono">EMOTION</span>
                <span className="text-[5px] font-mono text-cyan-300">ENGINE</span>
              </div>
            </div>
          ) : (
            <img
              src={isPixel ? pennyImg : isTimber ? gusImg : baronImg}
              alt={isPixel ? 'Pixel Penny' : isTimber ? 'Grizzly Gus' : 'Baron Bartholomew Sterling'}
              className="w-full h-full object-cover object-top rounded-xl filter drop-shadow-md"
            />
          )}

          {/* Nameplate Pill */}
          <div
            className={`absolute bottom-0.5 inset-x-0.5 py-0.5 rounded-md text-[6.5px] font-black uppercase text-center border shadow-md truncate font-mono ${
              isPs2
                ? 'bg-[#001933]/95 text-cyan-300 border-[#006FCD]/80'
                : isTimber
                ? 'bg-[#2b1407]/95 text-amber-200 border-amber-600/60'
                : isPixel
                ? 'bg-purple-950/95 text-pink-300 border-pink-500/70'
                : 'bg-casino-950/95 text-yellow-300 border-yellow-500/70'
            }`}
          >
            {isPs2 ? '💾 VECTOR VICTOR' : isTimber ? '🌲 GRIZZLY GUS' : isPixel ? '🕹️ PIXEL PENNY' : '⚙️ BARON STERLING'}
          </div>
        </div>
      </div>

      {/* 2. Comic Speech Bubble & Unreasonable Quota Progress */}
      <div className="relative flex-1 min-w-0 max-w-xs sm:max-w-sm mb-1">
        {/* Comic Pointer Triangle (Pointing to the right toward the Boss) */}
        <div
          className={`absolute -right-2 bottom-4 w-0 h-0 border-t-8 border-t-transparent border-l-8 border-b-8 border-b-transparent ${
            isPs2 ? 'border-l-[#030d1c]' : isTimber ? 'border-l-[#1e1008]' : isPixel ? 'border-l-[#1a0836]' : 'border-l-slate-900'
          }`}
        />

        {/* Main Dialogue Speech Box */}
        <div
          className={`p-2.5 sm:p-3 rounded-2xl border-2 shadow-2xl relative backdrop-blur-md ${
            isPs2
              ? 'bg-[#030d1c]/95 border-[#006FCD] shadow-[0_4px_30px_rgba(0,111,205,0.7)]'
              : isTimber
              ? 'bg-[#180d06]/95 border-amber-500/80 shadow-[0_4px_25px_rgba(0,0,0,0.95)]'
              : isPixel
              ? 'bg-[#120524]/95 border-pink-500/80 shadow-[0_4px_30px_rgba(0,0,0,0.95)]'
              : 'bg-slate-950/95 border-yellow-400/90 shadow-[0_4px_30px_rgba(0,0,0,0.95)]'
          }`}
        >
          {/* Header Bar with Category Tag & Dismiss X */}
          <div className="flex items-center justify-between pb-1 mb-1 border-b border-white/10">
            <div className="flex items-center space-x-1 truncate">
              <span className="text-xs flex-shrink-0">
                {speechCategory === 'quota'
                  ? '🏆'
                  : speechCategory === 'bigWin' || speechCategory === 'streakWin'
                  ? '🔥'
                  : speechCategory === 'nearMiss'
                  ? '⚡'
                  : '💬'}
              </span>
              <span
                className={`text-[8px] sm:text-[8.5px] font-black uppercase tracking-wider truncate ${
                  speechCategory === 'quota'
                    ? 'text-yellow-400 animate-pulse font-bold'
                    : isPs2
                    ? 'text-[#00F0FF]'
                    : isTimber
                    ? 'text-amber-300'
                    : isPixel
                    ? 'text-pink-300'
                    : 'text-yellow-300'
                }`}
              >
                {speechCategory === 'quota'
                  ? 'QUOTA MILESTONE UNLOCKED!'
                  : speechCategory === 'bigWin'
                  ? 'JACKPOT ALERT!'
                  : speechCategory === 'streakWin'
                  ? 'WINNING STREAK!'
                  : speechCategory === 'nearMiss'
                  ? 'NEAR MISS ALERT!'
                  : isPs2
                  ? 'SYSTEM DAEMON'
                  : isTimber
                  ? 'GUS SHOUTS'
                  : isPixel
                  ? 'PIXEL PENNY'
                  : 'BARON STERLING'}
              </span>
            </div>

            <button
              onClick={handleDismiss}
              className="w-4 h-4 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-colors flex-shrink-0 ml-1"
              title="Dismiss"
            >
              <X className="w-2.5 h-2.5" />
            </button>
          </div>

          {/* Dialogue Text */}
          <p className="text-[10px] sm:text-[11px] font-bold leading-snug text-white/95 mb-1.5 font-sans italic">
            "{speechText}"
          </p>

          {/* Unreasonable Quota Progress Bar */}
          <div className="pt-1 border-t border-white/10">
            <div className="flex items-center justify-between text-[7px] sm:text-[7.5px] font-mono text-white/70 mb-0.5">
              <span className="truncate uppercase font-bold text-amber-300 max-w-[170px] sm:max-w-[210px]">
                TIER {curTier.tier}: {curTier.name}
              </span>
              <span className="font-bold text-yellow-300 ml-1 flex-shrink-0">
                {quotaState.currentPoints.toLocaleString()} / {curTier.targetPoints.toLocaleString()} pts
              </span>
            </div>

            <div className="w-full bg-black/60 h-1.5 sm:h-2 rounded-full overflow-hidden p-0.5 border border-white/20">
              <div
                className={`h-full rounded-full transition-all duration-500 shadow-sm ${
                  isPs2
                    ? 'bg-gradient-to-r from-[#003366] via-[#006FCD] to-[#00F0FF]'
                    : isTimber
                    ? 'bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-300'
                    : isPixel
                    ? 'bg-gradient-to-r from-purple-500 via-pink-400 to-cyan-300'
                    : 'bg-gradient-to-r from-amber-600 via-yellow-400 to-yellow-200'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
