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
}>

export function GlassPanel({ children, style }: GlassPanelProps) {
  const scheme = resolveColorScheme(useColorScheme())
  const palette = colors[scheme]
  let intensity = 0
  let backgroundColor: string = palette.glass

  if (Platform.OS === 'ios') {
    intensity = 28
  }

  if (Platform.OS === 'android') {
    backgroundColor = palette.surfaceElevated
  }

  return (
    <BlurView
      intensity={intensity}
      tint={scheme}
      style={[
        styles.panel,
        {
          backgroundColor,
          borderColor: palette.border,
        },
        style,
      ]}
    >
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
  },
})
