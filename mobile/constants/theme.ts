/**
 * Neumorphism (Soft UI) Design System Tokens
 * Tactile, soft-extruded lighting with Titanium Dark Mode
 */

export const LightColors = {
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
};

export const DarkColors = {
  // Titanium Dark Base Canvas & Surfaces
  background: '#121418',
  surface: '#181A20',
  surfaceSubtle: '#22252D',
  surfaceCard: '#181A20',
  surfaceSunken: '#0F1014',
  surfaceDeepSunken: '#090A0D',
  surfaceContainerLow: '#1A1D24',
  surfaceContainer: '#181A20',
  surfaceContainerHigh: '#242833',
  surfaceDim: '#2D323E',

  // Shadow and Highlight Tones for Dark Titanium
  neuLight: '#282C37',
  neuDark: '#0A0B0E',
  neuDarkDeep: '#050507',
  neuHighlight: 'rgba(255, 255, 255, 0.08)',
  neuShadow: 'rgba(0, 0, 0, 0.85)',
  neuShadowDark: 'rgba(0, 0, 0, 0.95)',
  neuSunkenBorder: '#222630',

  // Primary & Accent Tones (High-contrast Glowing White / Titanium)
  primary: '#FFFFFF',
  primaryActive: '#E2E8F0',
  primaryAccent: '#FFFFFF',
  primaryAccentGradient: '#F8FAFC',
  onPrimary: '#111111',
  onPrimaryAccent: '#111111',

  // Text & Typography
  onSurface: '#F8FAFC',
  onSurfaceVariant: '#CBD5E1',
  secondary: '#94A3B8',
  muted: '#64748B',
  mutedLight: '#475569',

  // Outlines & Subtle Lighting Borders
  outline: 'rgba(255, 255, 255, 0.1)',
  outlineDark: 'rgba(0, 0, 0, 0.6)',
  border: 'rgba(255, 255, 255, 0.08)',

  // Semantic Accents
  error: '#EF4444',
  errorContainer: '#3F1212',
  onErrorContainer: '#FCA5A5',
  errorNeuShadow: 'rgba(239, 68, 68, 0.4)',

  success: '#22C55E',
  successContainer: '#0D331A',
  onSuccessContainer: '#86EFAC',
  successNeuShadow: 'rgba(34, 197, 94, 0.4)',

  warning: '#F59E0B',
  warningContainer: '#3A2708',
  onWarningContainer: '#FCD34D',
};

export const Colors = {
  ...LightColors,
  dark: DarkColors,
};

export const LightNeuShadows = {
  raised: {
    backgroundColor: LightColors.surface,
    shadowColor: LightColors.neuDark,
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 0.65,
    shadowRadius: 10,
    elevation: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  raisedSm: {
    backgroundColor: LightColors.surface,
    shadowColor: LightColors.neuDark,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.55,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.9)',
  },
  raisedLg: {
    backgroundColor: LightColors.surface,
    shadowColor: LightColors.neuDarkDeep,
    shadowOffset: { width: 8, height: 8 },
    shadowOpacity: 0.7,
    shadowRadius: 16,
    elevation: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.9)',
  },
  sunken: {
    backgroundColor: LightColors.surfaceSunken,
    borderWidth: 1.5,
    borderColor: LightColors.neuSunkenBorder,
    shadowColor: LightColors.neuDarkDeep,
    shadowOffset: { width: -2, height: -2 },
    shadowOpacity: 0.35,
    shadowRadius: 4,
    elevation: 0,
  },
  sunkenDeep: {
    backgroundColor: LightColors.surfaceDeepSunken,
    borderWidth: 1,
    borderColor: LightColors.neuSunkenBorder,
  },
  accentRaised: {
    backgroundColor: LightColors.primaryAccent,
    shadowColor: LightColors.neuDarkDeep,
    shadowOffset: { width: 4, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
};

export const DarkNeuShadows = {
  raised: {
    backgroundColor: DarkColors.surface,
    shadowColor: DarkColors.neuDark,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.85,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.09)',
  },
  raisedSm: {
    backgroundColor: DarkColors.surface,
    shadowColor: DarkColors.neuDark,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.75,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  raisedLg: {
    backgroundColor: DarkColors.surface,
    shadowColor: DarkColors.neuDarkDeep,
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 0.9,
    shadowRadius: 14,
    elevation: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  sunken: {
    backgroundColor: DarkColors.surfaceSunken,
    borderWidth: 1.5,
    borderColor: DarkColors.neuSunkenBorder,
    shadowColor: '#000000',
    shadowOffset: { width: -2, height: -2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 0,
  },
  sunkenDeep: {
    backgroundColor: DarkColors.surfaceDeepSunken,
    borderWidth: 1,
    borderColor: DarkColors.neuSunkenBorder,
  },
  accentRaised: {
    backgroundColor: DarkColors.primaryAccent,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
};

export const NeuShadows = {
  ...LightNeuShadows,
  dark: DarkNeuShadows,
};

export const Typography = {
  displayLg: {
    fontSize: 34,
    fontWeight: '800' as const,
    letterSpacing: -0.8,
  },
  displayMd: {
    fontSize: 28,
    fontWeight: '800' as const,
    letterSpacing: -0.6,
  },
  headlineLg: {
    fontSize: 24,
    fontWeight: '700' as const,
    letterSpacing: -0.4,
  },
  headlineMd: {
    fontSize: 20,
    fontWeight: '700' as const,
    letterSpacing: -0.2,
  },
  headlineSm: {
    fontSize: 18,
    fontWeight: '600' as const,
  },
  bodyLg: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
  },
  bodyMd: {
    fontSize: 15,
    fontWeight: '400' as const,
    lineHeight: 22,
  },
  bodySm: {
    fontSize: 13,
    fontWeight: '400' as const,
    lineHeight: 18,
  },
  labelLg: {
    fontSize: 15,
    fontWeight: '600' as const,
  },
  labelMd: {
    fontSize: 13,
    fontWeight: '600' as const,
  },
  labelSm: {
    fontSize: 11,
    fontWeight: '700' as const,
    letterSpacing: 0.5,
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  margin: 20,
};

export const Radius = {
  none: 0,
  xs: 6,
  sm: 10,
  md: 14,
  lg: 20,
  xl: 28,
  xxl: 36,
  full: 9999,
};
