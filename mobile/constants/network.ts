// ============================================
// VAULTIS — Network Config
// Values come from .env file
// Change EXPO_PUBLIC_NETWORK in .env to switch
// ============================================

export type Network = 'devnet' | 'mainnet-beta';

export const NETWORKS = {
  devnet: 'https://api.devnet.solana.com',
  'mainnet-beta': process.env.EXPO_PUBLIC_HELIUS_KEY
    ? `https://rpc.helius.xyz/?api-key=${process.env.EXPO_PUBLIC_HELIUS_KEY}`
    : 'https://api.mainnet-beta.solana.com',
} as const;

export const DEFAULT_NETWORK: Network =
  (process.env.EXPO_PUBLIC_NETWORK as Network) ?? 'devnet';

export const PROGRAM_ID = {
  devnet: process.env.EXPO_PUBLIC_PROGRAM_ID_DEVNET ?? '11111111111111111111111111111111',
  'mainnet-beta': process.env.EXPO_PUBLIC_PROGRAM_ID_MAINNET ?? '',
} as const;

export const WILL_ACCOUNT_SEED = 'will';

// UI Colors
export const COLORS = {
  bg:          '#0A0A1A',
  bgCard:      '#12122A',
  bgCardAlt:   '#1A1A35',
  primary:     '#7C3AED',
  primaryLight:'#A78BFA',
  accent:      '#06D6A0',
  danger:      '#EF4444',
  warning:     '#F59E0B',
  text:        '#F1F5F9',
  textMuted:   '#94A3B8',
  border:      '#2D2D5E',
} as const;
