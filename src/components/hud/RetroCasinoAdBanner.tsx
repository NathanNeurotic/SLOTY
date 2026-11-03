import React, { useState, useEffect } from 'react';
import { Sparkles, Utensils, Car, Trophy, Coffee, Trees } from 'lucide-react';
import type { GameId } from '../../games/types';
import { soundManager } from '../../audio/soundManager';

interface RetroCasinoAdBannerProps {
  activeGameId?: GameId;
  onAdClick?: () => void;
}

interface CasinoAd {
  icon: 'buffet' | 'car' | 'trophy' | 'coffee' | 'bingo' | 'forest';
  tag: string;
  headline: string;
  subtext: string;
  disclaimer: string;
}

const VAULT_ADS: CasinoAd[] = [
  {
    icon: 'buffet',
    tag: 'GRAND BUFFET SPECIAL',
    headline: 'ALL-YOU-CAN-EAT SNOW CRAB LEGS & PRIME RIB • $13.99',
    subtext: '4PM - 9PM NIGHTLY • SENIOR CLUB MEMBERS RECEIVE FREE WARM PEACH COBBLER',
    disclaimer: 'Must present VIP card. No take-home bags or purse tupperware permitted.',
  },
  {
    icon: 'car',
    tag: 'MASSIVE VEHICLE GIVEAWAY',
    headline: 'WIN A PRISTINE 2004 BUICK LESABRE LIMITED!',
    subtext: 'LEATHER BENCH SEATING • CASSETTE DECK • ONLY 64,000 MILES ON ODOCLOCK',
    disclaimer: 'Drawing this Saturday at 8 PM behind the Keno lounge. Winner must be present.',
  },
  {
    icon: 'trophy',
    tag: 'RECENT JACKPOT WINNER',
    headline: 'CONGRATULATIONS TO GLADYS M. FROM BEND, OR — $4,850!',
    subtext: 'HIT 5 IMPERIAL WILDS ON 24K GOLD VAULT • "I WAS JUST WAITING FOR MY BUS!"',
    disclaimer: 'State and federal taxes withheld at cashier cage.',
  },
  {
    icon: 'coffee',
    tag: 'EARLY BIRD REWARDS',
    headline: 'COMPLIMENTARY FILTERED ROAST & GLAZED DONUTS AT 7 AM',
    subtext: 'SWIPE YOUR CLUB CARD AT THE REWARDS KIOSK FOR 100 INSTANT BONUS POINTS',
    disclaimer: 'While supplies last. Limit two crullers per guest.',
  },
  {
    icon: 'bingo',
    tag: 'THURSDAY MATINEE BINGO',
    headline: 'SUPER BOOMER COVERALL BONANZA: $10,000 GUARANTEED',
    subtext: 'BALLROOM C • DOORS OPEN AT NOON • FREE DAUBER WITH 6-PACK PURCHASE',
    disclaimer: 'Tape recording or flash photography of called numbers strictly forbidden.',
  },
];

const TIMBER_ADS: CasinoAd[] = [
  {
    icon: 'buffet',
    tag: 'PINE CONE DINER SPECIAL',
    headline: 'TALL STACK OF BUTTERMILK FLAPJACKS & SMOKED HAM • $5.99',
    subtext: '100% PURE MAPLE SYRUP • UNLIMITED CAMP MUG REFILLS TILL 11 AM',
    disclaimer: 'Grizzly Gus approved. No feeding leftover bacon to the camp chipmunks.',
  },
  {
    icon: 'car',
    tag: 'CAMPGROUND TRUCK SWEEPSTAKES',
    headline: 'WIN A RUGGED 1998 FORD RANGER 4X4 WITH CAMPER SHELL!',
    subtext: 'MANUAL TRANSMISSION • GUN RACK • MUD-TERRAIN TIRES • REBUILT CLUTCH',
    disclaimer: 'Drop ticket stubs in the hollow oak barrel outside Cabin 4.',
  },
  {
    icon: 'forest',
    tag: 'RECENT WOODLAND WINNER',
    headline: 'CONGRATS TO BOBBY-RAY FROM COOS BAY — $3,420 ON TIMBERLAND!',
    subtext: 'TRIGGERED MOONLIT OWL FREE SPINS AT 3X • "PAID OFF MY LOGGING TRAILER!"',
    disclaimer: 'Another tall tale from the woodland floor — unverified, like all good fishing stories.',
  },
  {
    icon: 'coffee',
    tag: 'CAMP TRADING POST DEALS',
    headline: 'BUY 1 GET 1 50% OFF ALL BUFFALO-PLAID FLANNEL SHIRTS',
    subtext: 'SHOW YOUR SENIOR WOODSMAN PASS FOR FREE CEDAR SACHET & TICK REPELLENT',
    disclaimer: 'Sizes XXL through 5XL only. While rolls of flannel last.',
  },
  {
    icon: 'trophy',
    tag: 'ANNUAL DERBY NOTICE',
    headline: '48TH ANNUAL CRAPPIE & RAINBOW TROUT FISHING DERBY',
    subtext: 'SPONSORED BY SMOKEY’S TACKLE • WEIGH-IN AT THE BOAT RAMP SUNDAY AT 4 PM',
    disclaimer: 'Catch and release rules apply to fish under 12 inches.',
  },
];

const PIXEL_ADS: CasinoAd[] = [
  {
    icon: 'trophy',
    tag: 'MALL ARCADE TOURNAMENT',
    headline: '1994 STREET FIGHTER II CHAMPIONSHIP THIS SATURDAY!',
    subtext: 'WIN A 27-INCH SONY TRINITRON CRT TV • $5 ENTRY INCLUDES 20 TOKENS',
    disclaimer: 'No holding down select or pausing mid-combo. Attendant decision is final.',
  },
  {
    icon: 'buffet',
    tag: 'FOOD COURT MEAL COMBO',
    headline: 'SBARRO NY PIZZA SLICE & 32OZ MOUNTAIN DEW ONLY $2.99',
    subtext: 'SHOW 5 ARCADE TOKENS AT REGISTER 2 FOR FREE GARLIC ROLLS',
    disclaimer: 'Limit 1 refill per cup. Extra parmesan packets upon request.',
  },
  {
    icon: 'car',
    tag: 'NEW CABINET ARRIVAL',
    headline: 'MORTAL KOMBAT II JUST ARRIVED NEXT TO SKEE-BALL!',
    subtext: 'PLEASE DO NOT BANG ON THE JOYSTICKS • 25¢ QUARTERS ONLY • NO SLUGS',
    disclaimer: 'Management is not responsible for blistered thumbs or bruised egos.',
  },
  {
    icon: 'trophy',
    tag: 'ALL-TIME HIGH SCORE RECORD',
    headline: 'CONGRATS TO TODD R. FROM EUGENE — 12,450,900 PTS ON PIXEL QUEST!',
    subtext: 'HIT 6 MECHA DRAGONS ON THE 6x5 MEGA-GRID • "PLAYED ON ONE TOKEN!"',
    disclaimer: 'Initials AAA permanently etched onto high-score table.',
  },
];

export const RetroCasinoAdBanner: React.FC<RetroCasinoAdBannerProps> = ({
  activeGameId = 'vault-24k',
  onAdClick,
}) => {
  const isTimber = activeGameId === 'timber-critters';
  const isPixel = activeGameId === 'pixel-arcade';
  const ads = isTimber ? TIMBER_ADS : isPixel ? PIXEL_ADS : VAULT_ADS;
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentAdIndex((prev) => (prev + 1) % ads.length);
        setIsFlipping(false);
      }, 400);
    }, 7000);

    return () => clearInterval(timer);
  }, [ads.length]);

  const activeAd = ads[currentAdIndex];

  const handleBannerClick = () => {
    soundManager.playPuppetQuip();
    setIsFlipping(true);
    setTimeout(() => {
      setCurrentAdIndex((prev) => (prev + 1) % ads.length);
      setIsFlipping(false);
    }, 250);
    if (onAdClick) onAdClick();
  };

  const renderIcon = () => {
    switch (activeAd.icon) {
      case 'buffet':
        return <Utensils className="w-3.5 h-3.5 text-amber-300 animate-pulse flex-shrink-0" />;
      case 'car':
        return <Car className="w-3.5 h-3.5 text-cyan-300 animate-bounce flex-shrink-0" />;
      case 'trophy':
        return <Trophy className="w-3.5 h-3.5 text-yellow-300 fill-yellow-400 animate-pulse flex-shrink-0" />;
      case 'coffee':
        return <Coffee className="w-3.5 h-3.5 text-orange-300 flex-shrink-0" />;
      case 'forest':
        return <Trees className="w-3.5 h-3.5 text-emerald-400 animate-pulse flex-shrink-0" />;
      default:
        return <Sparkles className="w-3.5 h-3.5 text-yellow-400 flex-shrink-0" />;
    }
  };

  return (
    <div
      onClick={handleBannerClick}
      className={`relative w-full overflow-hidden select-none cursor-pointer border rounded-lg transition-all duration-300 px-2 py-1 shadow-md group ${
        isTimber
          ? 'bg-gradient-to-r from-[#211107] via-[#100703] to-[#211107] border-[#854d0e]/70 shadow-[0_2px_12px_rgba(0,0,0,0.85)]'
          : 'bg-gradient-to-r from-amber-950/90 via-slate-950 to-amber-950/90 border-yellow-500/50 shadow-[0_2px_15px_rgba(0,0,0,0.9)]'
      }`}
      title="Click to flip to next casino promotion"
    >
      {/* CRT Scanline Texture Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] pointer-events-none opacity-40" />

      {/* Flashing Vintage Corner Bulbs */}
      <div className="absolute left-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-yellow-400 animate-ping opacity-75" />
      <div className="absolute right-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-yellow-400 animate-ping opacity-75" />

      {/* Ad Content Container with Split-Flap Transition */}
      <div
        className={`flex items-center justify-between space-x-2 transition-all duration-300 px-2 ${
          isFlipping ? 'opacity-0 scale-95 translate-y-1' : 'opacity-100 scale-100 translate-y-0'
        }`}
      >
        {/* Left Badge: Category Tag */}
        <div className="flex items-center space-x-1 flex-shrink-0">
          {renderIcon()}
          <span
            className={`text-[8.5px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded border shadow-sm ${
              isTimber
                ? 'bg-[#3b1d0c] text-amber-200 border-[#a16207]'
                : 'bg-amber-900/80 text-yellow-200 border-yellow-400/60'
            }`}
          >
            {activeAd.tag}
          </span>
        </div>

        {/* Center: Main Headline & Hilarious Subtext */}
        <div className="flex-1 min-w-0 text-center overflow-hidden">
          <div className="flex items-center justify-center space-x-2 truncate">
            <span
              className={`text-[9.5px] sm:text-[11px] font-black uppercase tracking-wide truncate ${
                isTimber
                  ? 'text-emerald-200 drop-shadow-[0_0_6px_rgba(52,211,153,0.8)]'
                  : 'text-yellow-200 drop-shadow-[0_0_8px_rgba(253,224,71,0.8)]'
              }`}
            >
              {activeAd.headline}
            </span>
            <span className="hidden md:inline text-[9px] font-mono text-slate-300/80 truncate">
              • {activeAd.subtext}
            </span>
          </div>
        </div>

        {/* Right: Fine Print / Quip */}
        <div className="hidden lg:flex items-center space-x-1 flex-shrink-0">
          <span className="text-[8px] font-mono text-slate-400 italic truncate max-w-[220px]">
            {activeAd.disclaimer}
          </span>
          <span className="text-[7.5px] font-black text-amber-400/80 uppercase px-1 py-0.5 rounded bg-black/40 border border-white/10 group-hover:text-yellow-300">
            NEXT »
          </span>
        </div>
      </div>
    </div>
  );
};
