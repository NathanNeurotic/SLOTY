# SLOTY — Deluxe Casino Slots

A free-play casino slot machine for the web. **Virtual coins only — no real-money
gambling, no prizes, nothing to buy.** SLOTY's math is its own model, measured by the
test suite in this repo; it is not certified by, endorsed by, or affiliated with the
Oregon Lottery or any regulator.

**Play it:** https://nathanneurotic.github.io/SLOTY/

## The games

| Game | Grid | Lines | Character |
|---|---|---|---|
| **24K Gold & Cash Vault** | 5×4 | 40 | The high-roller vault. Blast-door scatters, bullion coins, Baron Bartholomew Sterling watching your quota. |
| **Timberland Critters** | 5×3 | 25 | Woodland camp slots with Grizzly Gus, moonlit owl scatters, and golden acorn respins. |
| **Pixel Arcade: 8-Bit Quest** | 6×5 | 50 | A high-hit-frequency 8-bit cabinet — frequent small wins, cartridge scatters, boss-stage free spins. |

Every game shares the same bonus skeleton — 3 scatters award 10 free spins at 3×,
6 coins trigger a hold & spin respin round, and wins can be risked in a double-up
gamble — plus a per-boss quota ladder, a fever meter, VIP XP levels, and a fully
synthesized WebAudio soundtrack (no audio files).

## Controls

- **Space** — spin / quick stop
- **↑ / ↓** — bet per line · **B** — max bet · **A** — 25 auto-spins
- **G** — switch game · **F** — casino floor view · **P** / **L** — paytable
- **M** — mute · **T** — turbo

Progress (balance, XP, stats, settings) is stored locally in your browser.

## Run it locally

```bash
npm ci
npm run dev      # Vite dev server
npm test         # engine + math-model regression checks (Monte Carlo, 100k spins/game)
npm run lint     # oxlint
npm run build    # tsc -b && vite build -> dist/
```

## About the math checks

`test-engine.ts` verifies the forced-outcome scenarios, the payline tables, XP
progression, and Monte Carlo measurements of each game's base RTP, hit frequency,
and bonus trigger rates. Bonus EV in the total-RTP estimate is **modeled**, not
simulated, and the pass/fail bounds are **regression guards for SLOTY's own model** —
they exist to catch accidental math changes, not to certify anything. Each game's
measured profile is printed when the suite runs.

## Tech

React 19 · TypeScript · Vite · Tailwind CSS 3 · canvas-confetti · lucide-react ·
Discord Embedded App SDK (ambient floor mode; the neighbouring "patrons" are
simulated, not real players).

## Developer debug suite

Forced reels / credit injection exist for development only: available under
`npm run dev`, or on a production build by adding `?debug=1` to the URL. It is off
for normal visitors.
