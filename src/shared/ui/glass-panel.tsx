import {
  BlurView,
} from 'expo-blur'
import {
  type GlassStyle,
  GlassView,
  isGlassEffectAPIAvailable,
} from 'expo-glass-effect'
import type {
  PropsWithChildren,
} from 'react'
import {
  Platform,
  type StyleProp,
  StyleSheet,
  useColorScheme,
  View,
  type ViewStyle,
} from 'react-native'

import {
  colors,
  radii,
  resolveColorScheme,
  spacing,
} from '@/shared/theme'

type GlassPanelProps = PropsWithChildren<{
  shape?: 'capsule' | 'rounded'
  style?: StyleProp<ViewStyle>
  variant?: 'chrome' | 'default' | 'modal'
}>

type GlassPanelState = {
  backgroundColor: string
  backdropFilter: string
  borderColor: string
  glassEffectStyle: GlassStyle
  intensity: number
  isInteractive: boolean
  shadowOpacity: number
  shadowRadius: number
}

type WebBackdropStyle = ViewStyle & {
  WebkitBackdropFilter?: string
  backdropFilter?: string
}

let nativeGlassAvailability: boolean | null = null

export function GlassPanel({
  children,
  shape = 'rounded',
  style,
  variant = 'default',
}: GlassPanelProps) {
  const scheme = resolveColorScheme(useColorScheme())
  const palette = colors[scheme]
  const panelState = getGlassPanelState(variant, palette)
  let borderRadius: number = radii.large

  if (shape === 'capsule') {
    borderRadius = radii.full
  }

  const panelStyle = [
    styles.panel,
    getWebBackdropStyle(panelState.backdropFilter),
    {
      backgroundColor: panelState.backgroundColor,
      borderRadius,
      borderColor: panelState.borderColor,
      shadowColor: palette.glassShadow,
      shadowOpacity: panelState.shadowOpacity,
      shadowRadius: panelState.shadowRadius,
    },
    style,
  ]
  const content = (
    <>
      <View
        pointerEvents="none"
        style={[
          styles.rim,
          {
            borderRadius,
            borderColor: palette.glassEdge,
          },
        ]}
      />
      {children}
    </>
  )

  if (canUseNativeGlass()) {
    return (
      <GlassView
        colorScheme={scheme}
        glassEffectStyle={panelState.glassEffectStyle}
        isInteractive={panelState.isInteractive}
        style={panelStyle}
        tintColor={palette.glassTint}
      >
        {content}
      </GlassView>
    )
  }

  if (Platform.OS === 'web') {
    return (
      <View style={panelStyle}>
        {content}
      </View>
    )
  }

  if (Platform.OS === 'android') {
    return (
      <View style={panelStyle}>
        {content}
      </View>
    )
  }

  return (
    <BlurView
      intensity={panelState.intensity}
      tint={scheme}
      style={panelStyle}
    >
      {content}
    </BlurView>
  )
}

function getGlassPanelState(
  variant: NonNullable<GlassPanelProps['variant']>,
  palette: typeof colors.light | typeof colors.dark,
): GlassPanelState {
  const state: GlassPanelState = {
    backgroundColor: palette.glass,
    backdropFilter: 'blur(18px) saturate(170%)',
    borderColor: palette.glassBorder,
    glassEffectStyle: 'regular',
    intensity: 34,
    isInteractive: false,
    shadowOpacity: 0.10,
    shadowRadius: 18,
  }

  if (variant === 'chrome') {
    state.backgroundColor = palette.glassChrome
    state.backdropFilter = 'blur(24px) saturate(190%)'
    state.glassEffectStyle = 'clear'
    state.intensity = 52
    state.isInteractive = true
    state.shadowOpacity = 0.16
    state.shadowRadius = 24
  }

  if (variant === 'modal') {
    state.backgroundColor = palette.glassStrong
    state.backdropFilter = 'blur(18px) saturate(165%)'
    state.glassEffectStyle = 'regular'
    state.intensity = 44
    state.isInteractive = true
    state.shadowOpacity = 0.20
    state.shadowRadius = 32
  }

  if (Platform.OS === 'android') {
    state.backgroundColor = palette.surfaceElevated
    state.intensity = 0
  }

  return state
}

function getWebBackdropStyle(backdropFilter: string) {
  if (Platform.OS !== 'web') {
    return null
  }

  const style: WebBackdropStyle = {
    backdropFilter,
    WebkitBackdropFilter: backdropFilter,
  }

  return style
}

function canUseNativeGlass() {
  if (Platform.OS !== 'ios') {
    return false
  }

  if (nativeGlassAvailability !== null) {
    return nativeGlassAvailability
  }

  try {
    nativeGlassAvailability = isGlassEffectAPIAvailable()
    return nativeGlassAvailability
  } catch {
    nativeGlassAvailability = false
    return false
  }
}

const styles = StyleSheet.create({
  panel: {
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    padding: spacing.four,
    shadowOffset: {
      width: 0,
      height: 12,
    },
    elevation: 8,
  },
  rim: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: StyleSheet.hairlineWidth,
    opacity: 0.82,
  },
})
