import {
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
  style?: StyleProp<ViewStyle>
  variant?: 'chrome' | 'default' | 'modal'
}>

export function GlassPanel({
  children,
  style,
  variant = 'default',
}: GlassPanelProps) {
  const scheme = resolveColorScheme(useColorScheme())
  const palette = colors[scheme]
  let intensity = 46
  let backgroundColor: string = palette.glass
  let shadowOpacity = 0.16
  let shadowRadius = 22

  if (variant === 'chrome') {
    intensity = 68
    backgroundColor = palette.glassChrome
    shadowOpacity = 0.20
    shadowRadius = 26
  }

  if (variant === 'modal') {
    intensity = 82
    backgroundColor = palette.glassStrong
    shadowOpacity = 0.26
    shadowRadius = 34
  }

  if (Platform.OS === 'web') {
    intensity += 10
  }

  if (Platform.OS === 'android') {
    backgroundColor = palette.surfaceElevated
    intensity = 0
  }

  return (
    <BlurView
      intensity={intensity}
      tint={scheme}
      style={[
        styles.panel,
        {
          backgroundColor,
          borderColor: palette.glassBorder,
          shadowColor: palette.glassShadow,
          shadowOpacity,
          shadowRadius,
        },
        style,
      ]}
    >
      <View
        pointerEvents="none"
        style={[
          styles.edge,
          {
            borderColor: palette.glassEdge,
          },
        ]}
      />
      <View
        pointerEvents="none"
        style={[
          styles.highlight,
          {
            backgroundColor: palette.glassHighlight,
          },
        ]}
      />
      <View
        pointerEvents="none"
        style={[
          styles.shade,
          {
            backgroundColor: palette.glassShade,
          },
        ]}
      />
      {children}
    </BlurView>
  )
}

const styles = StyleSheet.create({
  panel: {
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: radii.large,
    padding: spacing.four,
    shadowOffset: {
      width: 0,
      height: 18,
    },
    elevation: 14,
  },
  edge: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: radii.large,
  },
  highlight: {
    position: 'absolute',
    top: 1,
    right: 1,
    left: 1,
    height: 32,
    borderTopLeftRadius: radii.large,
    borderTopRightRadius: radii.large,
  },
  shade: {
    position: 'absolute',
    right: 1,
    bottom: 1,
    left: 1,
    height: 40,
    borderBottomLeftRadius: radii.large,
    borderBottomRightRadius: radii.large,
  },
})
