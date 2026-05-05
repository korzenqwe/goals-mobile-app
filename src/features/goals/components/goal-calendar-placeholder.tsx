import {
  CalendarDays,
} from 'lucide-react-native'
import {
  StyleSheet,
  Text,
  View,
} from 'react-native'

import {
  spacing,
  typography,
  useAppTheme,
} from '@/shared/theme'
import {
  GlassPanel,
} from '@/shared/ui'

export function GoalCalendarPlaceholder() {
  const theme = useAppTheme()

  return (
    <GlassPanel style={styles.panel}>
      <View style={styles.header}>
        <CalendarDays color={theme.accent} size={22} strokeWidth={2.4} />
        <Text style={[styles.title, { color: theme.text }]}>Календарь</Text>
      </View>
      <Text style={[styles.text, { color: theme.textSecondary }]}>
        История выполнения появится здесь.
      </Text>
    </GlassPanel>
  )
}

const styles = StyleSheet.create({
  panel: {
    gap: spacing.two,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.two,
  },
  title: {
    fontSize: typography.subtitle.fontSize,
    fontWeight: typography.subtitle.fontWeight,
  },
  text: {
    fontSize: typography.body.fontSize,
    lineHeight: typography.body.lineHeight,
  },
})
