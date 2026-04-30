import { BlurView } from 'expo-blur';
import type { PropsWithChildren } from 'react';
import {
  Platform,
  type StyleProp,
  StyleSheet,
  useColorScheme,
  type ViewStyle,
} from 'react-native';

import { colors, radii, resolveColorScheme, spacing } from '@/shared/theme';

type GlassPanelProps = PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
}>;

export function GlassPanel({ children, style }: GlassPanelProps) {
  const scheme = resolveColorScheme(useColorScheme());
  const palette = colors[scheme];

  return (
    <BlurView
      intensity={Platform.OS === 'ios' ? 28 : 0}
      tint={scheme}
      style={[
        styles.panel,
        {
          backgroundColor: Platform.OS === 'android' ? palette.surfaceElevated : palette.glass,
          borderColor: palette.border,
        },
        style,
      ]}
    >
      {children}
    </BlurView>
  );
}

const styles = StyleSheet.create({
  panel: {
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: radii.large,
    padding: spacing.four,
  },
});
