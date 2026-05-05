import type {
  PropsWithChildren,
} from 'react'
import {
  StyleSheet,
  View,
} from 'react-native'

import {
  spacing,
} from '@/shared/theme'
import {
  GlassPanel,
} from '@/shared/ui/glass-panel'

export function FloatingActionBar({
  children,
}: PropsWithChildren) {
  return (
    <View pointerEvents="box-none" style={styles.wrapper}>
      <GlassPanel shape="capsule" style={styles.bar} variant="chrome">{children}</GlassPanel>
    </View>
  )
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
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: spacing.two,
    paddingHorizontal: spacing.two,
    paddingVertical: spacing.two,
  },
})
