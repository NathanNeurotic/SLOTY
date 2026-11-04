import { evaluateSpin, generateForcedGrid, generateRandomGrid } from './src/engine/evaluator';
import { PAYLINES } from './src/engine/paylines';
import { calculateProgression } from './src/engine/progression';
import { getGame } from './src/games/gameRegistry';

console.log('--- SLOTY ENGINE & MATH REGRESSION SUITE (self-measured — not a certification) ---');

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
// These are REGRESSION BOUNDS for SLOTY's own free-play math model, set from
// this suite's own repeated measurements — not a certification and not an
// external standard. (The previous suite printed an "Oregon VLT Standard:
// 92.0% - 96.0%" next to every game but only asserted 88-100%, and never
// asserted hit frequency at all: Timberland measured 98.07% RTP and Pixel
// Arcade a 49.92% hit rate and both "passed".)
//
// Bonus EV is MODELED, not simulated:
//   free spins  = trigger rate x definition award x definition multiplier x base RTP
//   hold & spin = trigger rate x 28x total bet average award (a modeling
//                 assumption carried over from the original suite, stated openly)
// Bounds sit wider than observed run-to-run variance at 100,000 spins. If a
// change moves a game's math on purpose, re-measure and update the bounds
// and the measured-range comment together.
const REGRESSION_BOUNDS: Record<string, { rtp: [number, number]; hit: [number, number]; freeSpins1In: [number, number]; holdSpin1In: [number, number] }> = {
  // Measured at 100k spins (3 runs, 2026-11-03): Vault RTP 93.1-96.3 / hit ~33.6-34.0,
  // Timber RTP 93.0-96.4 / hit ~26.2-26.3, Pixel RTP 90.9-91.3 / hit ~50.2-50.4,
  // PS2 RTP 91.3-93.2 / hit ~48.4-48.7.
  'vault-24k': { rtp: [88, 104], hit: [28, 40], freeSpins1In: [105, 180], holdSpin1In: [120, 260] },
  'timber-critters': { rtp: [88, 104], hit: [20, 33], freeSpins1In: [110, 185], holdSpin1In: [120, 250] },
  'pixel-arcade': { rtp: [84, 100], hit: [43, 57], freeSpins1In: [105, 180], holdSpin1In: [125, 250] },
  'ps2-legends': { rtp: [86, 102], hit: [42, 56], freeSpins1In: [110, 185], holdSpin1In: [125, 250] },
};

const games = ['vault-24k', 'timber-critters', 'pixel-arcade', 'ps2-legends'] as const;

for (const gameId of games) {
  const game = getGame(gameId);
  const bounds = REGRESSION_BOUNDS[gameId];
  const spins = 100000;
  // Bet must be an exact multiple of the line count: evaluateSpin derives the
  // line bet with Math.floor(totalBet / lines), so a non-multiple bet would
  // silently distort the measured RTP. 5 per line mirrors the original suite.
  const totalBet = game.defaultLines * 5;
  let totalWagered = 0;
  let baseWon = 0;
  let hitCount = 0;
  let freeSpinsCount = 0;
  let holdAndSpinCount = 0;

  for (let i = 0; i < spins; i++) {
    const grid = generateRandomGrid(game);
    const res = evaluateSpin(grid, totalBet, game.defaultLines, 1, game);
    totalWagered += totalBet;
    baseWon += res.totalPayout;
    if (res.totalPayout > 0) hitCount++;
    if (res.isFreeSpinsTriggered) freeSpinsCount++;
    if (res.isHoldAndSpinTriggered) holdAndSpinCount++;
  }

  const baseRtp = (baseWon / totalWagered) * 100;
  const fsEv = freeSpinsCount > 0 ? (game.freeSpinsAward * game.freeSpinsMultiplier * (baseRtp / 100) * freeSpinsCount) / spins * 100 : 0;
  const hsEv = holdAndSpinCount > 0 ? (28 * holdAndSpinCount) / spins * 100 : 0;
  const totalRtp = baseRtp + fsEv + hsEv;
  const hitRate = (hitCount / spins) * 100;
  const fs1In = Math.round(spins / (freeSpinsCount || 1));
  const hs1In = Math.round(spins / (holdAndSpinCount || 1));

  console.log(`\nMeasuring ${game.name} (${spins.toLocaleString()} spins, free spins ${game.freeSpinsAward} @ ${game.freeSpinsMultiplier}X)...`);
  console.log(`- Base Game RTP: ${baseRtp.toFixed(2)}%`);
  console.log(`- Free Spins EV (modeled): ${fsEv.toFixed(2)}%`);
  console.log(`- Hold & Spin EV (modeled): ${hsEv.toFixed(2)}%`);
  console.log(`- Total Estimated RTP: ${totalRtp.toFixed(2)}% (regression bound: ${bounds.rtp[0]}% - ${bounds.rtp[1]}%)`);
  console.log(`- Hit Frequency: ${hitRate.toFixed(2)}% (regression bound: ${bounds.hit[0]}% - ${bounds.hit[1]}%)`);
  console.log(`- Free Spins Trigger: 1 in ${fs1In} spins (regression bound: 1 in ${bounds.freeSpins1In[0]} - ${bounds.freeSpins1In[1]})`);
  console.log(`- Hold & Spin Trigger: 1 in ${hs1In} spins (regression bound: 1 in ${bounds.holdSpin1In[0]} - ${bounds.holdSpin1In[1]})`);

  if (totalRtp < bounds.rtp[0] || totalRtp > bounds.rtp[1]) {
    throw new Error(`Estimated RTP ${totalRtp.toFixed(2)}% outside regression bound for ${game.name}`);
  }
  if (hitRate < bounds.hit[0] || hitRate > bounds.hit[1]) {
    throw new Error(`Hit frequency ${hitRate.toFixed(2)}% outside regression bound for ${game.name}`);
  }
  if (fs1In < bounds.freeSpins1In[0] || fs1In > bounds.freeSpins1In[1]) {
    throw new Error(`Free spins trigger 1 in ${fs1In} outside regression bound for ${game.name}`);
  }
  if (hs1In < bounds.holdSpin1In[0] || hs1In > bounds.holdSpin1In[1]) {
    throw new Error(`Hold & Spin trigger 1 in ${hs1In} outside regression bound for ${game.name}`);
  }
  console.log(`✓ ${game.name} within its measured regression bounds`);
}

console.log('\n✓ ALL ENGINE & MATH REGRESSION CHECKS PASSED (regression guards for SLOTY\'s own model — not a certification)');
