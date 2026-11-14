# SLOTY

A free-play slot machine arcade for the browser — four themed cabinets, a
simulated casino floor, quests, quotas, and a puppet entourage. **SLOTY is a
free game: virtual coins only. There is no real-money gambling, no payout,
and no certification by any lottery or regulator.** Math profiles below are
measured by the repo's own test suite (`test-engine.ts`).

## The four cabinets

Each game is defined by a single `GameDefinition` (reels, paylines, symbols,
reel strips, theme, and its bonus identity — wild / scatter / coin symbols,
free-spins award and multiplier, volatility). The evaluator reads bonus roles
from the definition; nothing per-game is hardcoded in the engine.

| Game | Grid | Lines | Wild | Scatter → Free Spins | Coin → Hold & Spin | Profile (modeled RTP, measured hit rate) |
| --- | --- | --- | --- | --- | --- | --- |
| ★ 24K Gold & Cash Vault | 5×4 | 40 | Wild | Scatter → 10 @ 3X | Bullion Coin | ~93–96% RTP, ~34% hits — balanced, big-win leaning |
| 🌲 Timberland Critters | 5×3 | 25 | Grizzly Bear | Moonlit Owl → 10 @ 3X | Golden Acorn | ~93–96% RTP, ~26% hits — steady |
| 🕹️ Pixel Arcade: 8-Bit Quest | 6×5 | 50 | Cyber Wild | Cartridge → 10 @ 3X | Retro Token | ~91% RTP, ~50% hits — small wins, often |
| 🎮 PlayStation 2: Emotion Engine | 5×4 | 40 | PS2 Logo | DVD-ROM → **15 @ 2X** | Memory Card | ~91–93% RTP, ~48% hits — marathon free spins |

> RTP values are modeled estimates from `test-engine.ts`. Base-game RTP and
> hit frequency come from 100,000 simulated spins per game; free-spin EV uses
> each game's definition award and multiplier, and Hold & Spin EV assumes a
> 28× total-bet average award. The bonus rounds themselves are not simulated.

Quota pacing differs per cabinet too: Vault climbs slowly, Timberland keeps
the classic ladder, Pixel loops fast like an arcade score chase, and the PS2
game is the long save-file grind.

## Controls & Features

- **Space**: spin / quick stop
- **G**: switch game (cycles all four cabinets)
- **P**: paytable • **B**: max bet • **M**: mute • **T**: turbo
- **↑ / ↓**: bet per line
- **Konami Code (↑ ↑ ↓ ↓ ← → ← → B A)**: secret retro cheat code (+2,500 credits)
- **Mechanical Reel Nudge**: near-miss spins have a chance to trigger a mechanical solenoid nudge into the bonus
- **Hold & Spin Grand Jackpot**: locking all board positions awards the top progressive Grand Jackpot (+50,000 coins / +500x total bet)
- **Mystery Safecracker Multi-Pick Bonus**: pick mystery safes, hollow logs, prize cubes, and memory card sectors for cash bullion, multipliers up to 75X, and extra picks. Selectable anytime in the Double-Up gamble modal or debug suite
- **Responsive Mobile Touch Deck**: dedicated bottom touch controls with 32px+ touch targets, dynamic reel fitting engine, and landscape phone support
- **Haptic & Enhanced Audio**: vibration feedback on spin start, reel stops, scatter lands, and jackpot sirens, paired with themed chimes and bells

## The casino floor is simulated

The "multiplayer" floor — neighbours, live win feeds, the hall-of-fame board —
is populated by simulated patrons (bots) so the room feels alive. It is not a
real-time multiplayer service, and the Discord leaderboard integration is
inert unless configured with a real client ID.

## Run it

```bash
npm install
npm run dev     # local development
npm test        # engine & math regression suite (Monte Carlo, 100k spins/game)
npm run build   # production build
```

## Debug suite

The developer debug drawer (forced reels, credit injection, custom grids) is
available in dev builds, or in production with `?debug=1` appended to the URL.
It is a development tool, not a player feature.

## Tech

React 19 + TypeScript + Vite. Spin outcomes come from weighted reel strips
(a random stop per reel), evaluated against fixed paylines by
`src/engine/evaluator.ts`.
