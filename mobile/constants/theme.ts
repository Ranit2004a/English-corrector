/**
 * Neumorphism (Soft UI) Design System Tokens
 * Tactile, soft-extruded lighting with sleek Dark Black Accents
 */

export const Colors = {
  // Neumorphic Base Canvas & Surfaces
  background: '#E8ECF5',
  surface: '#E8ECF5',
  surfaceSubtle: '#EFF3FA',
  surfaceCard: '#E8ECF5',
  surfaceSunken: '#DCE2EC',
  surfaceDeepSunken: '#D0D8E5',
  surfaceContainerLow: '#EFF3FA',
  surfaceContainer: '#E8ECF5',
  surfaceContainerHigh: '#DEE4EF',
  surfaceDim: '#CBD5E1',

  // Shadow and Highlight Tones for Soft 3D Lighting
  neuLight: '#FFFFFF',
  neuDark: '#B2BECF',
  neuDarkDeep: '#98A6BB',
  neuHighlight: 'rgba(255, 255, 255, 0.95)',
  neuShadow: 'rgba(163, 177, 198, 0.65)',
  neuShadowDark: 'rgba(140, 155, 178, 0.75)',
  neuSunkenBorder: '#CBD5E1',

  // Primary & Accent Tones (Deep Dark Black)
  primary: '#111111',
  primaryActive: '#000000',
  primaryAccent: '#111111',
  primaryAccentGradient: '#1F242D',
  onPrimary: '#FFFFFF',
  onPrimaryAccent: '#FFFFFF',

  // Text & Typography
  onSurface: '#111111',
  onSurfaceVariant: '#334155',
  secondary: '#64748B',
  muted: '#7A8B9E',
  mutedLight: '#94A3B8',

  // Outlines & Subtle Lighting Borders
  outline: 'rgba(255, 255, 255, 0.7)',
  outlineDark: 'rgba(163, 177, 198, 0.35)',
  border: 'rgba(255, 255, 255, 0.6)',

  // Semantic Accents
  error: '#DC2626',
  errorContainer: '#FEE2E2',
  onErrorContainer: '#991B1B',
  errorNeuShadow: 'rgba(239, 68, 68, 0.3)',

  success: '#16A34A',
  successContainer: '#DCFCE7',
  onSuccessContainer: '#15803D',
  successNeuShadow: 'rgba(34, 197, 94, 0.3)',

  warning: '#D97706',
  warningContainer: '#FEF3C7',
  onWarningContainer: '#92400E',

  // Dark mode variants
  dark: {
    background: '#121418',
    surface: '#181A20',
    surfaceSubtle: '#22252D',
    surfaceCard: '#181A20',
    surfaceSunken: '#0F1014',
    neuLight: '#2B2F3A',
    neuDark: '#0B0C0E',
    onSurface: '#F8FAFC',
    secondary: '#94A3B8',
    outline: '#2D323E',
    primary: '#FFFFFF',
    onPrimary: '#111111',
  },
};

export const NeuShadows = {
  // Extruded Raised Surface (Convex)
  raised: {
    backgroundColor: Colors.surface,
    shadowColor: Colors.neuDark,
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 0.65,
    shadowRadius: 10,
    elevation: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },

  // Subtle Raised (for small buttons, tags, chips)
  raisedSm: {
    backgroundColor: Colors.surface,
    shadowColor: Colors.neuDark,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.55,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.9)',
  },

  // Grand Raised (Hero cards, interactive floating docks)
  raisedLg: {
    backgroundColor: Colors.surface,
    shadowColor: Colors.neuDarkDeep,
    shadowOffset: { width: 8, height: 8 },
    shadowOpacity: 0.7,
    shadowRadius: 16,
    elevation: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.9)',
  },

  // Sunken Groove / Debossed (Concave) for inputs, tracks, pressed elements
  sunken: {
    backgroundColor: Colors.surfaceSunken,
    borderWidth: 1.5,
    borderColor: Colors.neuSunkenBorder,
    shadowColor: Colors.neuDarkDeep,
    shadowOffset: { width: -2, height: -2 },
    shadowOpacity: 0.35,
    shadowRadius: 4,
    elevation: 0,
  },

  // Inset Deep Sunken
  sunkenDeep: {
    backgroundColor: Colors.surfaceDeepSunken,
    borderWidth: 1,
    borderColor: Colors.neuSunkenBorder,
  },

  // Sleek Dark Black Accent Raised
  accentRaised: {
    backgroundColor: Colors.primaryAccent,
    shadowColor: Colors.neuDarkDeep,
    shadowOffset: { width: 4, height: 6 },
    shadowOpacity: 0.55,
    shadowRadius: 10,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },

  // Pressed / Flat Active State
  pressed: {
    backgroundColor: Colors.surfaceContainerHigh,
    shadowColor: 'transparent',
    shadowOpacity: 0,
    elevation: 0,
    borderWidth: 1,
    borderColor: Colors.neuDark,
  },
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
  xs: 6,
  sm: 10,
  md: 14,
  lg: 20,
  xl: 26,
  xxl: 32,
  full: 9999,
};

export const Typography = {
  fontFamily: 'System',
  displayLg: {
    fontSize: 34,
    lineHeight: 40,
    fontWeight: '700' as const,
    letterSpacing: -0.8,
  },
  headlineLg: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '700' as const,
    letterSpacing: -0.5,
  },
  headlineMd: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '700' as const,
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
    fontWeight: '600' as const,
    letterSpacing: 0.3,
  },
  labelSm: {
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '700' as const,
    letterSpacing: 0.6,
  },
};
