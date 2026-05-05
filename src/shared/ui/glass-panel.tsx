import {
  type BlurTint,
  BlurView,
} from 'expo-blur'
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
  variant?: 'chrome' | 'default' | 'modal' | 'toast'
}>

type GlassPanelState = {
  backgroundColor: string
  borderColor: string
  blurTint: BlurTint
  contentBackgroundColor: string
  intensity: number
  shadowOpacity: number
  shadowRadius: number
  webBackdropFilter: string
}

type WebBlurStyle = ViewStyle & {
  WebkitBackdropFilter?: string
  backdropFilter?: string
}

export function GlassPanel({
  children,
  shape = 'rounded',
  style,
  variant = 'default',
}: GlassPanelProps) {
  const scheme = resolveColorScheme(useColorScheme())
  const palette = colors[scheme]
  const panelState = getGlassPanelState(variant, palette, scheme)
  let borderRadius: number = radii.large

  if (shape === 'capsule') {
    borderRadius = radii.full
  }

  const panelStyle = [
    styles.panel,
    {
      backgroundColor: panelState.contentBackgroundColor,
      borderRadius,
      borderColor: panelState.borderColor,
      shadowColor: palette.glassShadow,
      shadowOpacity: panelState.shadowOpacity,
      shadowRadius: panelState.shadowRadius,
    },
    style,
  ]
  const decoratedContent = (
    <>
      <View
        pointerEvents="none"
        style={[
          styles.tint,
          {
            backgroundColor: panelState.backgroundColor,
            borderRadius,
          },
        ]}
      />
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

  if (Platform.OS === 'android') {
    return (
      <View style={panelStyle}>
        {decoratedContent}
      </View>
    )
  }

  if (Platform.OS === 'web') {
    return (
      <View style={panelStyle}>
        <View
          pointerEvents="none"
          style={[
            styles.blur,
            getWebBlurStyle(panelState.webBackdropFilter, borderRadius),
          ]}
        />
        {decoratedContent}
      </View>
    )
  }

  return (
    <View style={panelStyle}>
      <BlurView
        intensity={panelState.intensity}
        pointerEvents="none"
        style={[
          styles.blur,
          {
            borderRadius,
          },
        ]}
        tint={panelState.blurTint}
      />
      {decoratedContent}
    </View>
  )
}

function getGlassPanelState(
  variant: NonNullable<GlassPanelProps['variant']>,
  palette: typeof colors.light | typeof colors.dark,
  scheme: 'dark' | 'light',
): GlassPanelState {
  const state: GlassPanelState = {
    backgroundColor: palette.glass,
    borderColor: palette.glassBorder,
    blurTint: resolveBlurTint(scheme, 'default'),
    contentBackgroundColor: 'transparent',
    intensity: 34,
    shadowOpacity: 0.10,
    shadowRadius: 18,
    webBackdropFilter: 'blur(16px) saturate(170%)',
  }

  if (variant === 'chrome') {
    state.backgroundColor = palette.glassChrome
    state.blurTint = resolveBlurTint(scheme, 'chrome')
    state.intensity = 46
    state.shadowOpacity = 0.16
    state.shadowRadius = 24
    state.webBackdropFilter = 'blur(22px) saturate(190%)'
  }

  if (variant === 'modal') {
    state.backgroundColor = palette.glassStrong
    state.blurTint = resolveBlurTint(scheme, 'modal')
    state.intensity = 44
    state.shadowOpacity = 0.20
    state.shadowRadius = 32
    state.webBackdropFilter = 'blur(20px) saturate(175%)'
  }

  if (variant === 'toast') {
    state.backgroundColor = palette.glassFloating
    state.blurTint = resolveBlurTint(scheme, 'toast')
    state.intensity = 90
    state.shadowOpacity = 0.24
    state.shadowRadius = 26
    state.webBackdropFilter = 'blur(28px) saturate(210%)'
  }

  if (Platform.OS === 'android') {
    state.backgroundColor = palette.surfaceElevated
    state.contentBackgroundColor = palette.surfaceElevated
    state.intensity = 0

    if (variant === 'toast') {
      state.backgroundColor = palette.glassFloating
      state.contentBackgroundColor = palette.glassFloating
    }
  }

  return state
}

function getWebBlurStyle(backdropFilter: string, borderRadius: number): WebBlurStyle {
  return {
    backdropFilter,
    borderRadius,
    WebkitBackdropFilter: backdropFilter,
  }
}

function resolveBlurTint(
  scheme: 'dark' | 'light',
  variant: NonNullable<GlassPanelProps['variant']>,
): BlurTint {
  if (scheme === 'dark') {
    if (variant === 'toast') {
      return 'default'
    }

    if (variant === 'chrome') {
      return 'systemThinMaterialDark'
    }

    return 'dark'
  }

  if (variant === 'toast') {
    return 'default'
  }

  if (variant === 'chrome') {
    return 'systemThinMaterialLight'
  }

  return 'light'
}

const styles = StyleSheet.create({
  panel: {
    overflow: 'hidden',
    position: 'relative',
    borderWidth: StyleSheet.hairlineWidth,
    padding: spacing.four,
    shadowOffset: {
      width: 0,
      height: 12,
    },
    elevation: 8,
  },
  blur: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  tint: {
    ...StyleSheet.absoluteFillObject,
  },
  rim: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: StyleSheet.hairlineWidth,
    opacity: 0.82,
  },
})
