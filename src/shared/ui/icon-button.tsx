import type {
  ComponentType,
} from 'react'
import {
  Pressable,
  type StyleProp,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  type ViewStyle,
} from 'react-native'

import {
  colors,
  radii,
  resolveColorScheme,
  spacing,
  typography,
} from '@/shared/theme'

type IconButtonProps = {
  accessibilityLabel?: string
  disabled?: boolean
  icon: ComponentType<{ color?: string, size?: number, strokeWidth?: number }>
  label?: string
  onPress?: () => void
  style?: StyleProp<ViewStyle>
  variant?: 'danger' | 'primary' | 'ghost' | 'soft'
}

export function IconButton({
  accessibilityLabel,
  disabled = false,
  icon: Icon,
  label,
  onPress,
  style,
  variant = 'primary',
}: IconButtonProps) {
  const scheme = resolveColorScheme(useColorScheme())
  const palette = colors[scheme]
  const isGhost = variant === 'ghost'
  const isDanger = variant === 'danger'
  const isSoft = variant === 'soft'
  let tintColor: string = palette.accent

  if (isGhost) {
    tintColor = palette.textSecondary
  }

  if (isDanger) {
    tintColor = palette.danger
  }

  return (
    <Pressable
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({
        pressed,
      }) => [
        styles.button,
        getButtonStateStyle({
          disabled,
          isDanger,
          isGhost,
          isSoft,
          palette,
          pressed,
        }),
        style,
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
  isSoft: boolean
  palette: typeof colors.light | typeof colors.dark
  pressed: boolean
}

function getButtonStateStyle({
  disabled,
  isDanger,
  isGhost,
  isSoft,
  palette,
  pressed,
}: ButtonStateStyleInput) {
  let backgroundColor: string = palette.accentGlass
  let borderColor: string = palette.glassBorder
  let opacity = 1

  if (isDanger) {
    backgroundColor = palette.dangerSoft
    borderColor = palette.danger
  }

  if (isSoft) {
    backgroundColor = palette.glassChrome
    borderColor = palette.glassBorder
  }

  if (isGhost) {
    backgroundColor = 'transparent'
    borderColor = 'transparent'
  }

  if (pressed) {
    opacity = 0.72
  }

  if (disabled) {
    opacity = 0.58
  }

  return {
    backgroundColor,
    borderColor,
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
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: radii.full,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.12,
    shadowRadius: 14,
    elevation: 6,
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
