import type { PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';

import { spacing } from '@/shared/theme';
import { GlassPanel } from '@/shared/ui/glass-panel';

export function FloatingActionBar({ children }: PropsWithChildren) {
  return (
    <View pointerEvents="box-none" style={styles.wrapper}>
      <GlassPanel style={styles.bar}>{children}</GlassPanel>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    right: spacing.four,
    bottom: spacing.four,
    left: spacing.four,
    alignItems: 'center',
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.two,
    padding: spacing.two,
  },
});
