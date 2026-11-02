import { evaluateSpin, generateForcedGrid, generateRandomGrid } from './src/engine/evaluator';
import { PAYLINES } from './src/engine/paylines';
import { SYMBOLS } from './src/engine/symbols';
import { calculateProgression } from './src/engine/progression';

console.log('--- RUNNING SLOTS MATH & ENGINE VERIFICATION SUITE ---');

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

// 4. Monte Carlo Statistical RTP verification
console.log('Running 20,000 Monte Carlo simulated spins...');
let totalWagered = 0;
let totalWon = 0;
let hitCount = 0;
let freeSpinsCount = 0;
let holdAndSpinCount = 0;
const bet = 200;

for (let i = 0; i < 20000; i++) {
  totalWagered += bet;
  const grid = generateRandomGrid();
  const res = evaluateSpin(grid, bet, 40);
  totalWon += res.totalPayout;
  if (res.totalPayout > 0) hitCount++;
  if (res.isFreeSpinsTriggered) freeSpinsCount++;
  if (res.isHoldAndSpinTriggered) holdAndSpinCount++;
}

const rtp = ((totalWon / totalWagered) * 100).toFixed(2);
const hitRate = ((hitCount / 20000) * 100).toFixed(2);
console.log(`- Wagered: ${totalWagered}, Won: ${totalWon}`);
console.log(`- Simulated RTP: ${rtp}%`);
console.log(`- Hit Frequency: ${hitRate}%`);
console.log(`- Free Spins Hit: ${freeSpinsCount} times (${((freeSpinsCount / 20000) * 100).toFixed(2)}%)`);
console.log(`- Hold & Spin Hit: ${holdAndSpinCount} times (${((holdAndSpinCount / 20000) * 100).toFixed(2)}%)`);

// 5. Timberland Critters (5x3, 25 paylines) Verification
console.log('Checking Timberland Critters game:');
const { getGame } = await import('./src/games/gameRegistry');
const timber = getGame('timber-critters');
console.log(`- Loaded: ${timber.name} (${timber.reels}x${timber.rows}, ${timber.defaultLines} lines)`);
if (timber.rows !== 3) throw new Error('Expected 3 rows');
if (timber.paylines.length !== 25) throw new Error('Expected 25 paylines');

const timberGrid = generateRandomGrid(timber);
if (timberGrid.length !== 5) throw new Error('Expected 5 reels');
if (timberGrid[0].length !== 3) throw new Error('Expected 3 rows per reel');
const sampleResult = evaluateSpin(timberGrid, 25, 25, 1, timber);
console.log(`- Sample spin result: ${sampleResult.winningLines.length} line wins, payout: ${sampleResult.totalPayout}`);
console.log('✓ Timberland Critters 5x3 verification passed!');

console.log('✓ ALL ENGINE & MATH CHECKS PASSED SUCCESSFULLY!');
