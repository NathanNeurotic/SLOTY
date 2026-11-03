import { evaluateSpin, generateForcedGrid, generateRandomGrid } from './src/engine/evaluator';
import { PAYLINES } from './src/engine/paylines';
import { SYMBOLS } from './src/engine/symbols';
import { calculateProgression } from './src/engine/progression';
import { getGame } from './src/games/gameRegistry';

console.log('--- RUNNING SLOTY MATH VERIFICATION SUITE (REGRESSION CHECKS, NOT A CERTIFICATION) ---');

// 1. Payline verification
console.log(`Checking paylines: ${PAYLINES.length} defined.`);
if (PAYLINES.length !== 40) throw new Error(`Expected exactly 40 paylines, found ${PAYLINES.length}`);
PAYLINES.forEach((line, idx) => {
  if (line.length !== 5) throw new Error(`Payline ${idx} length is not 5`);
  line.forEach((row) => {
    if (row < 0 || row > 3) throw new Error(`Invalid row index ${row} in payline ${idx}`);
  });
});
console.log('✓ All 40 Paylines valid (5 reels x 4 rows).');

// 2. Forced Scenarios Verification
console.log('Checking forced outcome generators:');

// Test 5 Wilds
const fiveWildsGrid = generateForcedGrid('FIVE_WILDS');
const wildsResult = evaluateSpin(fiveWildsGrid, 200, 40);
console.log(`- 5 Wilds payout: ${wildsResult.totalPayout} (WinTier: ${wildsResult.winTier})`);
if (wildsResult.winTier !== 'EPIC_JACKPOT') throw new Error('Expected 5 Wilds to trigger EPIC_JACKPOT');
if (wildsResult.winningLines.length === 0) throw new Error('Expected winning lines for 5 Wilds');

// Test 5 Diamonds
const fiveDiamondsGrid = generateForcedGrid('FIVE_DIAMONDS');
const diamondsResult = evaluateSpin(fiveDiamondsGrid, 200, 40);
console.log(`- 5 Diamonds payout: ${diamondsResult.totalPayout} (WinTier: ${diamondsResult.winTier})`);
if (diamondsResult.winTier !== 'BIG_WIN' && diamondsResult.winTier !== 'MEGA_WIN' && diamondsResult.winTier !== 'EPIC_JACKPOT') {
  throw new Error('Expected 5 Diamonds to trigger at least BIG_WIN');
}

// Test Free Spins
const freeSpinsGrid = generateForcedGrid('FREE_SPINS');
const freeSpinsResult = evaluateSpin(freeSpinsGrid, 200, 40);
console.log(`- Free Spins triggered: ${freeSpinsResult.isFreeSpinsTriggered} (Scatters: ${freeSpinsResult.scatterCount})`);
if (!freeSpinsResult.isFreeSpinsTriggered) throw new Error('Expected Free Spins to be triggered');
if (freeSpinsResult.scatterCount < 3) throw new Error('Expected 3+ Scatters');

// Test Hold & Spin
const holdAndSpinGrid = generateForcedGrid('HOLD_AND_SPIN');
const holdAndSpinResult = evaluateSpin(holdAndSpinGrid, 200, 40);
console.log(`- Hold & Spin triggered: ${holdAndSpinResult.isHoldAndSpinTriggered} (Coins: ${holdAndSpinResult.coinCount})`);
if (!holdAndSpinResult.isHoldAndSpinTriggered) throw new Error('Expected Hold & Spin to be triggered');
if (holdAndSpinResult.coinCount < 6) throw new Error('Expected 6+ Coins');

// Test Near Miss
const nearMissGrid = generateForcedGrid('NEAR_MISS');
const nearMissResult = evaluateSpin(nearMissGrid, 200, 40);
console.log(`- Near Miss scatters: ${nearMissResult.scatterCount}`);
if (nearMissResult.scatterCount !== 2) throw new Error('Expected exactly 2 Scatters for Near Miss');
if (nearMissResult.isFreeSpinsTriggered) throw new Error('Near miss should not trigger free spins');

// Test No Win
const noWinGrid = generateForcedGrid('NO_WIN');
const noWinResult = evaluateSpin(noWinGrid, 200, 40);
console.log(`- No Win payout: ${noWinResult.totalPayout} (WinTier: ${noWinResult.winTier})`);
if (noWinResult.totalPayout !== 0) throw new Error('Expected 0 payout for NO_WIN scenario');
if (noWinResult.winTier !== 'NONE') throw new Error('Expected NONE winTier');

// 3. Progression calculations
console.log('Checking VIP XP progression:');
const p1 = calculateProgression(0);
console.log(`- Level at 0 XP: ${p1.level}, Max Bet: ${p1.maxBet}`);
if (p1.level !== 1) throw new Error('Level should start at 1');

const p2 = calculateProgression(15000);
console.log(`- Level at 15,000 XP: ${p2.level}, Max Bet: ${p2.maxBet}`);
if (p2.level <= 1) throw new Error('XP should have leveled up player');

// 4. Monte Carlo regression checks for all games
//
// HONESTY NOTE: these are regression bounds for SLOTY's own math model.
// They are not a certification and not the Oregon Lottery's standards.
// The bounds were set from measured runs of each game, widened for Monte
// Carlo variance at 100,000 spins. Bonus EV is a MODELED estimate (free
// spins valued at 10 spins x 3x base RTP; hold & spin at a flat 28-coin
// average) — the bonus rounds themselves are not simulated here, so the
// total is an estimate, not a measurement. A 92-96% total-RTP reference
// band is printed for information only; landing outside it is reported,
// not failed.

interface GameExpectation {
  rtp: [number, number];
  hit: [number, number];
  freeSpins1In: [number, number];
  holdSpin1In: [number, number];
}

const EXPECTATIONS: Record<string, GameExpectation> = {
  // Measured across repeated runs: ~93-96% RTP, ~33.5-34% hit, FS ~1:134-147, H&S ~1:161-163
  'vault-24k': { rtp: [89, 101], hit: [28, 39], freeSpins1In: [110, 170], holdSpin1In: [125, 260] },
  // Measured across repeated runs: ~93-98% RTP (high variance), ~26% hit, FS ~1:129-146, H&S ~1:152-165
  'timber-critters': { rtp: [90, 102], hit: [21, 32], freeSpins1In: [115, 185], holdSpin1In: [120, 240] },
  // Measured across repeated runs: ~92-94% RTP, ~50% hit, FS ~1:129-137, H&S ~1:158-185
  'pixel-arcade': { rtp: [87, 98], hit: [44, 56], freeSpins1In: [110, 170], holdSpin1In: [125, 240] },
};

const games = ['vault-24k', 'timber-critters', 'pixel-arcade'] as const;

for (const gameId of games) {
  const game = getGame(gameId);
  const exp = EXPECTATIONS[gameId];
  const spins = 100000;
  const bet = game.defaultLines * 5;
  let baseWon = 0;
  let totalWagered = 0;
  let hitCount = 0;
  let freeSpinsCount = 0;
  let holdAndSpinCount = 0;

  for (let i = 0; i < spins; i++) {
    totalWagered += bet;
    const grid = generateRandomGrid(game);
    const res = evaluateSpin(grid, bet, game.defaultLines, 1, game);
    baseWon += res.totalPayout;
    if (res.totalPayout > 0) hitCount++;
    if (res.isFreeSpinsTriggered) freeSpinsCount++;
    if (res.isHoldAndSpinTriggered) holdAndSpinCount++;
  }

  const baseRtp = (baseWon / totalWagered) * 100;
  const fsEv = freeSpinsCount > 0 ? (10 * 3 * (baseRtp / 100) * freeSpinsCount) / spins * 100 : 0;
  const hsEv = holdAndSpinCount > 0 ? (28 * holdAndSpinCount) / spins * 100 : 0;
  const totalRtp = baseRtp + fsEv + hsEv;
  const hitRate = (hitCount / spins) * 100;
  const fs1In = Math.round(spins / (freeSpinsCount || 1));
  const hs1In = Math.round(spins / (holdAndSpinCount || 1));
  const inBand = (v: number, [lo, hi]: [number, number]) => v >= lo && v <= hi;

  console.log(`\nMeasuring math model for: ${game.name} (${spins.toLocaleString()} spins)...`);
  console.log(`- Base Game RTP: ${baseRtp.toFixed(2)}%`);
  console.log(`- Free Spins EV (modeled): ${fsEv.toFixed(2)}%`);
  console.log(`- Hold & Spin EV (modeled): ${hsEv.toFixed(2)}%`);
  console.log(`- Total Estimated RTP: ${totalRtp.toFixed(2)}% (regression bound: ${exp.rtp[0]}% - ${exp.rtp[1]}%)`);
  if (!inBand(totalRtp, [92, 96])) {
    console.log(`  Note: outside the 92% - 96% reference band — reported for information, not a failure.`);
  }
  console.log(`- Hit Frequency: ${hitRate.toFixed(2)}% (regression bound: ${exp.hit[0]}% - ${exp.hit[1]}%)`);
  console.log(`- Free Spins Trigger: 1 in ${fs1In} spins (regression bound: 1 in ${exp.freeSpins1In[0]}-${exp.freeSpins1In[1]})`);
  console.log(`- Hold & Spin Trigger: 1 in ${hs1In} spins (regression bound: 1 in ${exp.holdSpin1In[0]}-${exp.holdSpin1In[1]})`);

  if (!inBand(totalRtp, exp.rtp)) {
    throw new Error(`Estimated RTP ${totalRtp.toFixed(2)}% outside regression bound for ${game.name}`);
  }
  if (!inBand(hitRate, exp.hit)) {
    throw new Error(`Hit frequency ${hitRate.toFixed(2)}% outside regression bound for ${game.name}`);
  }
  if (!inBand(fs1In, exp.freeSpins1In)) {
    throw new Error(`Free spins trigger frequency 1 in ${fs1In} outside regression bound for ${game.name}`);
  }
  if (!inBand(hs1In, exp.holdSpin1In)) {
    throw new Error(`Hold & Spin trigger frequency 1 in ${hs1In} outside regression bound for ${game.name}`);
  }
  console.log(`✓ ${game.name} is inside its regression bounds.`);
}

console.log('\n✓ ALL ENGINE & MATH REGRESSION CHECKS PASSED (regression guards for SLOTY\'s own model — not a certification)');
