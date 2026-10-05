import { Platform, TextStyle, ViewStyle } from 'react-native';

/**
 * Design tokens read from DESIGN.md (the Figma "businesshandler" frames).
 * Every colour, radius, spacing step and type ramp used by the UI lives here.
 */
export const colors = {
  bg: '#F4F5FA',
  bgAlt: '#F4F4F4',
  bgAlt2: '#ECF1FA',
  surface: '#FFFFFF',
  surfaceTop: '#FFFFFF',
  fg: '#23233C',
  fgBody: '#1C1C1C',
  fgInverse: '#FFFFFF',
  accent: '#6CC57C',
  accentGradientEnd: '#179F2F',
  accentSoft: '#61D27C',
  accentTranslucent: '#6CC57CD9',
  accentBlock: '#6CC57CA3',
  onAccent: '#FFFFFF',
  secondary: '#23233C',
  muted: '#A5A5A5',
  mutedAlt: '#898888',
  mutedLight: '#B4B4B4',
  placeholder: '#BBC7DB',
  iconInk: '#181461',
  border: '#707070',
  borderSoft: '#DCE5F4',
  track: '#E3E3E3',
  chartDeposit: '#2B2B2B',
  warmLine: '#C48B30',
  shadowNav: '#60719329',
  shadowSoft: '#00000014',
  shadowAvatar: '#00000029',
  shadowLogin: '#0D4E810D',
  shadowCard: '#0000000F',
  shadowHeader: '#0000001A',
  black: '#000000',
} as const;

/** Spacing scale from DESIGN.md (`--space-0` … `--space-7`). */
export const space = {
  s0: 4,
  s1: 8,
  s2: 12,
  s3: 16,
  s4: 20,
  s5: 24,
  s6: 32,
  s7: 40,
} as const;

/** Border radii from DESIGN.md. */
export const radius = {
  sm: 3,
  md: 5,
  lg: 8,
  xl: 10,
  xxl: 12,
  xxxl: 18,
  card: 20,
  pill: 999,
} as const;

/** Horizontal screen inset used by every content block (DESIGN.md layout). */
export const screenInset = 40;

/**
 * Loaded Google font family names (see App.tsx useFonts()).
 * The weight is encoded in the family name, so we never combine these with
 * fontWeight — that would send Android looking for a variant that is not bundled.
 */
export const fontFamily = {
  heading: 'Aleo_700Bold',
  body: 'Inter_400Regular',
  bodyThin: 'Inter_100Thin',
  bodyMedium: 'Inter_500Medium',
  alt: 'Ubuntu_400Regular',
  altBold: 'Ubuntu_700Bold',
  login: 'Actor_400Regular',
} as const;

/** Type ramp from DESIGN.md. */
export const type = {
  text25: {
    fontFamily: fontFamily.heading,
    fontSize: 25,
    lineHeight: 30,
  },
  text24: {
    fontFamily: fontFamily.heading,
    fontSize: 24,
    lineHeight: 29,
  },
  text20: {
    fontFamily: fontFamily.heading,
    fontSize: 20,
    lineHeight: 25,
  },
  text16: {
    fontFamily: fontFamily.heading,
    fontSize: 16,
    lineHeight: 19,
  },
  text16Alt: {
    fontFamily: fontFamily.body,
    fontSize: 16,
    lineHeight: 19,
  },
  text14: {
    fontFamily: fontFamily.heading,
    fontSize: 14,
    lineHeight: 17,
  },
  text14Alt: {
    fontFamily: fontFamily.body,
    fontSize: 14,
    lineHeight: 17,
  },
  text12: {
    fontFamily: fontFamily.bodyThin,
    fontSize: 12,
    lineHeight: 15,
    letterSpacing: 2.4,
    textTransform: 'uppercase' as TextStyle['textTransform'],
  },
  text12Alt: {
    fontFamily: fontFamily.body,
    fontSize: 12,
    lineHeight: 14,
  },
  text10: {
    fontFamily: fontFamily.body,
    fontSize: 10,
    lineHeight: 13,
  },
  text9: {
    fontFamily: fontFamily.bodyThin,
    fontSize: 9,
    lineHeight: 11,
    letterSpacing: 1.8,
    textTransform: 'uppercase' as TextStyle['textTransform'],
  },
  text7: {
    fontFamily: fontFamily.heading,
    fontSize: 7,
    lineHeight: 5,
  },
  amountHero: {
    fontFamily: fontFamily.bodyMedium,
    fontSize: 45,
    lineHeight: 57,
  },
  eyebrow14: {
    fontFamily: fontFamily.bodyThin,
    fontSize: 14,
    lineHeight: 18,
    letterSpacing: 2.8,
    textTransform: 'uppercase' as TextStyle['textTransform'],
  },
  amountRow: {
    fontFamily: fontFamily.bodyThin,
    fontSize: 14,
    lineHeight: 18,
  },
  ubuntu17: {
    fontFamily: fontFamily.altBold,
    fontSize: 17,
    lineHeight: 20,
  },
  ubuntu15: {
    fontFamily: fontFamily.alt,
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: 0.4,
  },
  ubuntu13: {
    fontFamily: fontFamily.alt,
    fontSize: 13,
    lineHeight: 15,
  },
  ubuntu11: {
    fontFamily: fontFamily.altBold,
    fontSize: 11,
    lineHeight: 12,
    letterSpacing: 0.3,
  },
  ubuntu10: {
    fontFamily: fontFamily.alt,
    fontSize: 10,
    lineHeight: 12,
  },
  ubuntu7: {
    fontFamily: fontFamily.altBold,
    fontSize: 7,
    lineHeight: 10,
  },
} satisfies Record<string, TextStyle>;

/** Soft shadows, translated from the frame tokens. */
export const shadows = {
  soft: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 3,
  } as ViewStyle,
  card: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 2,
  } as ViewStyle,
  nav: {
    shadowColor: colors.shadowNav,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.16,
    shadowRadius: 20,
    elevation: 8,
  } as ViewStyle,
  fab: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.16,
    shadowRadius: 40,
    elevation: 10,
  } as ViewStyle,
} as const;

/** Bottom tab bar height (413×118 group, FAB overlaps it). */
export const TAB_BAR_HEIGHT = 118;

/** react-native-web renders text differently; keep a single place to branch. */
export const isWeb = Platform.OS === 'web';

/** Formats a positive EUR amount exactly as the design does: `1,345.00€`. */
export function formatAmount(amount: number): string {
  const safe = Number.isFinite(amount) ? amount : 0;
  const [whole, decimals] = Math.abs(safe).toFixed(2).split('.');
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const sign = safe < 0 ? '-' : '';
  return `${sign}${grouped}.${decimals}€`;
}
