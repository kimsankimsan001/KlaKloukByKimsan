export const COLORS = {
  // Traditional Cambodian Gold palette
  goldPrimary: '#F5BA13',
  goldSecondary: '#E6A100',
  goldLight: '#FFE382',
  goldDark: '#8A5800',
  goldBorder: '#D4AF37',
  goldGlow: 'rgba(245, 186, 19, 0.45)',

  // Deep luxury dark casino tones
  bgDark: '#0B1218',
  bgCard: '#131F2A',
  bgSurface: '#192837',
  bgTranslucent: 'rgba(11, 18, 24, 0.88)',

  // Ornate card colors (matching reference image)
  cardCream: '#FAF8F2',
  cardCreamSelected: '#FFF8E1',
  kbachTeal: '#00878C',
  kbachTealDark: '#00595C',
  ringRed: '#C92A2A',
  ringRedDark: '#991B1B',
  ringYellow: '#FCD34D',

  // Status & accent colors
  winGreen: '#10B981',
  winGreenDark: '#065F46',
  loseRed: '#EF4444',
  accentBlue: '#3B82F6',
  accentPurple: '#8B5CF6',

  // Text
  textPrimary: '#FFFFFF',
  textSecondary: '#D1D5DB',
  textMuted: '#9CA3AF',
  textDark: '#1E293B',
  textGold: '#FDE047',

  // UI Elements
  borderMuted: 'rgba(255, 255, 255, 0.15)',
  borderGold: '#F5BA13',
};

export const CHIP_VALUES = [10, 50, 100, 500, 1000, 5000] as const;

export const CHIP_COLORS: Record<number, { bg: string; border: string; text: string }> = {
  10: { bg: '#475569', border: '#94A3B8', text: '#FFFFFF' },      // Grey/Blue
  50: { bg: '#B91C1C', border: '#F87171', text: '#FFFFFF' },      // Red
  100: { bg: '#1D4ED8', border: '#60A5FA', text: '#FFFFFF' },     // Blue
  500: { bg: '#047857', border: '#34D399', text: '#FFFFFF' },     // Green
  1000: { bg: '#B45309', border: '#FBBF24', text: '#FFFFFF' },    // Gold/Orange
  5000: { bg: '#6B21A8', border: '#C084FC', text: '#FFFFFF' },    // Purple
};

export const FONTS = {
  khmerRegular: 'Hanuman_400Regular',
  khmerBold: 'Hanuman_700Bold',
  khmerBlack: 'Hanuman_900Black',
};

