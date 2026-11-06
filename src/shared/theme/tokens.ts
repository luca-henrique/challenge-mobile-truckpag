export const tokens = {
  colors: {
    primary: '#2563eb',
    primaryDark: '#1d4ed8',
    primaryLight: '#eff6ff',
    background: '#f9fafb',
    surface: '#ffffff',
    cardHighlight: '#f3e8ff',
    cardBorder: '#111827',
    text: '#111827',
    textSecondary: '#4b5563',
    textMuted: '#9ca3af',
    border: '#e5e7eb',
    borderDark: '#111827',
    activeTab: '#d1d5db',
    audioProgress: '#38bdf8',
    audioTrack: '#e2e8f0',
    error: '#dc2626',
    errorLight: '#fee2e2',
    favorite: '#ef4444',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  radius: {
    none: 0,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    full: 9999,
  },
  typography: {
    xs: { fontSize: 12, lineHeight: 16 },
    sm: { fontSize: 14, lineHeight: 20 },
    base: { fontSize: 16, lineHeight: 24 },
    lg: { fontSize: 18, lineHeight: 28 },
    xl: { fontSize: 20, lineHeight: 28 },
    xxl: { fontSize: 24, lineHeight: 32 },
  },
  touch: {
    minTarget: 44,
    hitSlop: { top: 12, bottom: 12, left: 12, right: 12 },
  },
} as const;

export type AppColors = typeof tokens.colors;
export type AppSpacing = typeof tokens.spacing;
