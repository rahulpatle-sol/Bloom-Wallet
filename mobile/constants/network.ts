// ============================================
// BLOOM — Network Config
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

export const PROGRAM_ID: Record<Network, string> = {
  devnet: process.env.EXPO_PUBLIC_PROGRAM_ID_DEVNET ?? '11111111111111111111111111111111',
  'mainnet-beta': process.env.EXPO_PUBLIC_PROGRAM_ID_MAINNET ?? '11111111111111111111111111111111',
} as const;

export const WILL_ACCOUNT_SEED = 'will';

// Phantom-inspired dark theme
export const COLORS = {
  bg:          '#010101',
  bgCard:      '#0A0A0A',
  bgCardAlt:   '#151515',
  bgElevated:  '#1C1C1C',
  primary:     '#AB9FF2',
  primaryDark: '#5548D0',
  accent:      '#AC34D7',
  bloom:       '#E8A87C',
  success:     '#24D37D',
  danger:      '#FF4545',
  warning:     '#FFAB2D',
  text:        '#FFFFFF',
  textSecondary:'#8A8A8A',
  textMuted:   '#555555',
  border:      '#2A2A2A',
  borderLight: '#333333',
  purple:      '#5548D0',
  blue:        '#26A9E0',
  tabBarBg:    '#0A0A0A',
  tabBarBorder:'#1E1E1E',
} as const;
