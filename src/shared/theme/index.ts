import type {
  ColorSchemeName,
  TextStyle,
} from 'react-native'
import {
  useColorScheme,
} from 'react-native'

export const colors = {
  light: {
    background: '#EEF3F8',
    surface: '#FFFFFF',
    surfaceElevated: '#FBFCFF',
    glass: 'rgba(255,255,255,0.64)',
    glassStrong: 'rgba(255,255,255,0.84)',
    glassChrome: 'rgba(255,255,255,0.76)',
    glassBorder: 'rgba(255,255,255,0.70)',
    glassEdge: 'rgba(255,255,255,0.92)',
    glassHighlight: 'rgba(255,255,255,0.42)',
    glassShade: 'rgba(15,23,42,0.055)',
    glassShadow: 'rgba(15,23,42,0.16)',
    backgroundWash: 'rgba(10,132,255,0.08)',
    backdrop: 'rgba(9,13,20,0.34)',
    border: 'rgba(16,24,40,0.12)',
    text: '#111827',
    textSecondary: '#667085',
    accent: '#0A84FF',
    accentSoft: 'rgba(10,132,255,0.12)',
    danger: '#D92D20',
    dangerSoft: 'rgba(217,45,32,0.12)',
  },
  dark: {
    background: '#070A11',
    surface: '#111827',
    surfaceElevated: '#172033',
    glass: 'rgba(17,24,39,0.58)',
    glassStrong: 'rgba(24,34,48,0.82)',
    glassChrome: 'rgba(17,24,39,0.72)',
    glassBorder: 'rgba(255,255,255,0.18)',
    glassEdge: 'rgba(255,255,255,0.28)',
    glassHighlight: 'rgba(255,255,255,0.10)',
    glassShade: 'rgba(0,0,0,0.20)',
    glassShadow: 'rgba(0,0,0,0.42)',
    backgroundWash: 'rgba(100,210,255,0.08)',
    backdrop: 'rgba(0,0,0,0.54)',
    border: 'rgba(255,255,255,0.12)',
    text: '#F8FAFC',
    textSecondary: '#CBD5E1',
    accent: '#64D2FF',
    accentSoft: 'rgba(100,210,255,0.16)',
    danger: '#FF6961',
    dangerSoft: 'rgba(255,105,97,0.16)',
  },
} as const

export const spacing = {
  one: 4,
  two: 8,
  three: 12,
  four: 16,
  five: 24,
  six: 32,
  seven: 48,
} as const

export const radii = {
  small: 8,
  medium: 12,
  large: 18,
  full: 999,
} as const

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
} satisfies Record<string, TextStyle>

export function resolveColorScheme(colorScheme: ColorSchemeName) {
  if (colorScheme === 'dark') {
    return 'dark'
  }

  return 'light'
}

export function useAppTheme() {
  return colors[resolveColorScheme(useColorScheme())]
}
