import type { ComponentType } from 'react'
import { Pressable, StyleSheet, Text, useColorScheme, View } from 'react-native'

import { colors, radii, resolveColorScheme, spacing, typography } from '@/shared/theme'

type IconButtonProps = {
  accessibilityLabel?: string
  disabled?: boolean
  icon: ComponentType<{ color?: string, size?: number, strokeWidth?: number }>
  label?: string
  onPress?: () => void
  variant?: 'danger' | 'primary' | 'ghost'
}

export function IconButton({
  accessibilityLabel,
  disabled = false,
  icon: Icon,
  label,
  onPress,
  variant = 'primary',
}: IconButtonProps) {
  const scheme = resolveColorScheme(useColorScheme())
  const palette = colors[scheme]
  const isGhost = variant === 'ghost'
  const isDanger = variant === 'danger'
  let tintColor: string = '#FFFFFF'

  if (isGhost) {
    tintColor = palette.textSecondary
  }

  return (
    <Pressable
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        getButtonStateStyle({
          disabled,
          isDanger,
          isGhost,
          palette,
          pressed,
        }),
      ]}
    >
      <View style={styles.content}>
        <Icon color={tintColor} size={20} strokeWidth={2.4} />
        {renderLabel(label, tintColor)}
      </View>
    </Pressable>
  )
}

type ButtonStateStyleInput = {
  disabled: boolean
  isDanger: boolean
  isGhost: boolean
  palette: typeof colors.light | typeof colors.dark
  pressed: boolean
}

function getButtonStateStyle({
  disabled,
  isDanger,
  isGhost,
  palette,
  pressed,
}: ButtonStateStyleInput) {
  let backgroundColor: string = palette.accent
  let opacity = 1

  if (isDanger) {
    backgroundColor = palette.danger
  }

  if (isGhost) {
    backgroundColor = 'transparent'
  }

  if (pressed) {
    opacity = 0.72
  }

  if (disabled) {
    opacity = 0.42
  }

  return {
    backgroundColor,
    opacity,
  }
}

function renderLabel(label: string | undefined, tintColor: string) {
  if (!label) {
    return null
  }

  return <Text style={[styles.label, { color: tintColor }]}>{label}</Text>
}

const styles = StyleSheet.create({
  button: {
    minHeight: 44,
    justifyContent: 'center',
    borderRadius: radii.full,
    paddingHorizontal: spacing.three,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.two,
  },
  label: {
    fontSize: typography.caption.fontSize,
    fontWeight: '700',
  },
})
