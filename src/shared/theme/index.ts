import type { ColorSchemeName, TextStyle } from 'react-native';
import { useColorScheme } from 'react-native';

export const colors = {
  light: {
    background: '#F7F8FA',
    surface: '#FFFFFF',
    surfaceElevated: '#FFFFFF',
    glass: 'rgba(255,255,255,0.72)',
    border: 'rgba(16,24,40,0.12)',
    text: '#111827',
    textSecondary: '#667085',
    accent: '#0A84FF',
    accentSoft: 'rgba(10,132,255,0.12)',
    danger: '#D92D20',
  },
  dark: {
    background: '#090D14',
    surface: '#111827',
    surfaceElevated: '#182230',
    glass: 'rgba(17,24,39,0.72)',
    border: 'rgba(255,255,255,0.12)',
    text: '#F8FAFC',
    textSecondary: '#CBD5E1',
    accent: '#64D2FF',
    accentSoft: 'rgba(100,210,255,0.16)',
    danger: '#FF6961',
  },
} as const;

export const spacing = {
  one: 4,
  two: 8,
  three: 12,
  four: 16,
  five: 24,
  six: 32,
  seven: 48,
} as const;

export const radii = {
  small: 8,
  medium: 12,
  large: 18,
  full: 999,
} as const;

export const typography = {
  title: {
    fontSize: 34,
    lineHeight: 40,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '700',
  },
  body: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '400',
  },
  caption: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
  },
} satisfies Record<string, TextStyle>;

export function resolveColorScheme(colorScheme: ColorSchemeName) {
  return colorScheme === 'dark' ? 'dark' : 'light';
}

export function useAppTheme() {
  return colors[resolveColorScheme(useColorScheme())];
}
