import confetti from 'canvas-confetti';

export function launchCoinFountain(intensity: 'big' | 'mega' | 'jackpot' = 'big') {
  const count = intensity === 'jackpot' ? 250 : intensity === 'mega' ? 140 : 70;

  // Gold coin colors
  const colors = ['#FFE885', '#F59E0B', '#D97706', '#FFFFFF', '#FDE047'];

  // Left cannon
  confetti({
    particleCount: Math.floor(count / 2),
    angle: 60,
    spread: 60,
    origin: { x: 0.1, y: 0.8 },
    colors,
    ticks: 300,
    gravity: 1.1,
    scalar: 1.2,
  });

  // Right cannon
  confetti({
    particleCount: Math.floor(count / 2),
    angle: 120,
    spread: 60,
    origin: { x: 0.9, y: 0.8 },
    colors,
    ticks: 300,
    gravity: 1.1,
    scalar: 1.2,
  });

  if (intensity === 'jackpot') {
    // Center fountain for epic jackpot
    setTimeout(() => {
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 },
        colors: [...colors, '#00F0FF', '#FF007F'],
        ticks: 400,
        gravity: 0.9,
        scalar: 1.4,
      });
    }, 400);
  }
}
