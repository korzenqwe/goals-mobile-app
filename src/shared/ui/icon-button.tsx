import type { ComponentType } from 'react';
import { Pressable, StyleSheet, Text, useColorScheme, View } from 'react-native';

import { colors, radii, resolveColorScheme, spacing, typography } from '@/shared/theme';

type IconButtonProps = {
  accessibilityLabel?: string;
  disabled?: boolean;
  icon: ComponentType<{ color?: string; size?: number; strokeWidth?: number }>;
  label?: string;
  onPress?: () => void;
  variant?: 'primary' | 'ghost';
};

export function IconButton({
  accessibilityLabel,
  disabled = false,
  icon: Icon,
  label,
  onPress,
  variant = 'primary',
}: IconButtonProps) {
  const scheme = resolveColorScheme(useColorScheme());
  const palette = colors[scheme];
  const isGhost = variant === 'ghost';
  const tintColor = isGhost ? palette.textSecondary : '#FFFFFF';

  return (
    <Pressable
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: isGhost ? 'transparent' : palette.accent,
          opacity: disabled ? 0.42 : pressed ? 0.72 : 1,
        },
      ]}
    >
      <View style={styles.content}>
        <Icon color={tintColor} size={20} strokeWidth={2.4} />
        {label ? <Text style={[styles.label, { color: tintColor }]}>{label}</Text> : null}
      </View>
    </Pressable>
  );
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
});
