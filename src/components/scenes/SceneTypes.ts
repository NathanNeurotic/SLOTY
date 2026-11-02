export type CasinoSceneId = 'VAULT' | 'PENTHOUSE' | 'MINT' | 'HEIST';

export interface CasinoScene {
  id: CasinoSceneId;
  name: string;
  tagline: string;
  badge: string;
  themeColor: string;
  borderGlow: string;
  description: string;
}

export const CASINO_SCENES: Record<CasinoSceneId, CasinoScene> = {
  VAULT: {
    id: 'VAULT',
    name: 'Fort Knox Gold Vault',
    tagline: '999.9 PURE BULLION RESERVE',
    badge: '★ THE GOLD VAULT ★',
    themeColor: '#F59E0B',
    borderGlow: 'rgba(245, 158, 11, 0.6)',
    description: 'Towering stacks of 24K Swiss bullion, emerald marble floors, and biometric laser security grids.',
  },
  PENTHOUSE: {
    id: 'PENTHOUSE',
    name: 'Midnight Cash Penthouse',
    tagline: 'HIGH-ROLLER VEGAS SKYLINE',
    badge: '★ CASH PENTHOUSE ★',
    themeColor: '#A855F7',
    borderGlow: 'rgba(168, 85, 247, 0.6)',
    description: 'Floor-to-ceiling glass over the glittering Las Vegas Strip at midnight, with raining $100 bills.',
  },
  MINT: {
    id: 'MINT',
    name: 'The Federal Currency Mint',
    tagline: 'MOLTEN GOLD & CASH PRESSES',
    badge: '★ THE FEDERAL MINT ★',
    themeColor: '#EF4444',
    borderGlow: 'rgba(239, 68, 68, 0.6)',
    description: 'Industrial coin presses stamping solid gold bullion and conveyor belts of freshly banded banknotes.',
  },
  HEIST: {
    id: 'HEIST',
    name: 'High Stakes Heist Overdrive',
    tagline: 'MAXIMUM SECURITY ALARM OVERDRIVE',
    badge: '★ VAULT HEIST 777 ★',
    themeColor: '#00F0FF',
    borderGlow: 'rgba(0, 240, 255, 0.6)',
    description: 'Cracked master safe doors, flying banknotes, high-voltage lasers, and siren spotlight sweeps.',
  },
};
