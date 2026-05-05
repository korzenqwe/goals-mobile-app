import type {
  ColorSchemeName,
  TextStyle,
} from 'react-native'
import {
  useColorScheme,
} from 'react-native'

export const colors = {
  light: {
    background: '#F4F7FB',
    surface: '#FFFFFF',
    surfaceElevated: 'rgba(255,255,255,0.52)',
    glass: 'rgba(255,255,255,0.44)',
    glassStrong: 'rgba(255,255,255,0.66)',
    glassChrome: 'rgba(255,255,255,0.50)',
    glassFloating: 'rgba(255,255,255,0.18)',
    glassTint: 'rgba(255,255,255,0.18)',
    glassBorder: 'rgba(255,255,255,0.58)',
    glassEdge: 'rgba(255,255,255,0.78)',
    glassShadow: 'rgba(31,41,55,0.16)',
    backdrop: 'rgba(12,18,28,0.22)',
    border: 'rgba(16,24,40,0.12)',
    text: '#111827',
    textSecondary: '#667085',
    accent: '#0A84FF',
    accentSoft: 'rgba(10,132,255,0.14)',
    accentGlass: 'rgba(10,132,255,0.18)',
    danger: '#D92D20',
    dangerSoft: 'rgba(217,45,32,0.12)',
  },
  dark: {
    background: '#06080D',
    surface: 'rgba(255,255,255,0.055)',
    surfaceElevated: 'rgba(255,255,255,0.075)',
    glass: 'rgba(255,255,255,0.060)',
    glassStrong: 'rgba(255,255,255,0.105)',
    glassChrome: 'rgba(255,255,255,0.085)',
    glassFloating: 'rgba(5,9,14,0.18)',
    glassTint: 'rgba(255,255,255,0.030)',
    glassBorder: 'rgba(255,255,255,0.145)',
    glassEdge: 'rgba(255,255,255,0.28)',
    glassShadow: 'rgba(0,0,0,0.44)',
    backdrop: 'rgba(0,0,0,0.38)',
    border: 'rgba(255,255,255,0.10)',
    text: '#F8FAFC',
    textSecondary: '#D3DCE8',
    accent: '#64D2FF',
    accentSoft: 'rgba(100,210,255,0.14)',
    accentGlass: 'rgba(100,210,255,0.18)',
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
  large: 26,
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
