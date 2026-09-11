/**
 * Editorial Monolith Design System Tokens
 * Strictly adheres to prototype/DESIGN.md
 */

export const Colors = {
  // Pure monochrome palette
  primary: '#111111',
  primaryActive: '#000000',
  onPrimary: '#ffffff',
  
  // Surfaces & Backgrounds
  background: '#ffffff',
  surface: '#ffffff',
  surfaceSubtle: '#f4f4f5',
  surfaceCard: '#fafafa',
  surfaceContainerLow: '#f3f3f4',
  surfaceContainer: '#eeeeee',
  surfaceContainerHigh: '#e8e8e8',
  surfaceDim: '#dadada',
  
  // Text & Typography
  onSurface: '#111111',
  onSurfaceVariant: '#444748',
  secondary: '#71717a',
  muted: '#71717a',
  mutedLight: '#a1a1aa',
  
  // Outlines & Dividers
  outline: '#e4e4e7',
  outlineVariant: '#d4d4d8',
  border: '#e4e4e7',
  
  // Semantic Accents
  error: '#ba1a1a',
  errorContainer: '#ffdad6',
  onErrorContainer: '#93000a',
  
  success: '#166534',
  successContainer: '#dcfce7',
  
  warning: '#854d0e',
  warningContainer: '#fef9c3',
  
  // Dark mode variants (for dark theme support)
  dark: {
    background: '#121212',
    surface: '#18181b',
    surfaceSubtle: '#27272a',
    surfaceCard: '#1f1f23',
    onSurface: '#f4f4f5',
    secondary: '#a1a1aa',
    outline: '#3f3f46',
    primary: '#ffffff',
    onPrimary: '#111111',
  }
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
  margin: 20,
  gutter: 16,
};

export const Radius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

export const Typography = {
  fontFamily: 'System', // Hanken Grotesk on supported platforms / fallback system font
  displayLg: {
    fontSize: 34,
    lineHeight: 40,
    fontWeight: '600' as const,
    letterSpacing: -0.8,
  },
  headlineLg: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '600' as const,
    letterSpacing: -0.5,
  },
  headlineMd: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '600' as const,
    letterSpacing: -0.3,
  },
  headlineSm: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '600' as const,
    letterSpacing: -0.2,
  },
  bodyLg: {
    fontSize: 17,
    lineHeight: 26,
    fontWeight: '400' as const,
  },
  bodyMd: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '400' as const,
  },
  bodySm: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '400' as const,
  },
  labelLg: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '600' as const,
    letterSpacing: 0.2,
  },
  labelMd: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500' as const,
    letterSpacing: 0.3,
  },
  labelSm: {
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '600' as const,
    letterSpacing: 0.6,
  },
};
