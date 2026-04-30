import { Flame, Trophy } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';

import { radii, spacing, typography, useAppTheme } from '@/shared/theme';

export function GoalStatsPlaceholder() {
  const theme = useAppTheme();

  return (
    <View style={styles.grid}>
      <View style={[styles.tile, { backgroundColor: theme.surface }]}>
        <Flame color={theme.accent} size={20} strokeWidth={2.4} />
        <Text style={[styles.value, { color: theme.text }]}>0</Text>
        <Text style={[styles.label, { color: theme.textSecondary }]}>Текущая серия</Text>
      </View>
      <View style={[styles.tile, { backgroundColor: theme.surface }]}>
        <Trophy color={theme.accent} size={20} strokeWidth={2.4} />
        <Text style={[styles.value, { color: theme.text }]}>0</Text>
        <Text style={[styles.label, { color: theme.textSecondary }]}>Лучшая серия</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    gap: spacing.two,
  },
  tile: {
    flex: 1,
    gap: spacing.one,
    borderRadius: radii.large,
    padding: spacing.three,
  },
  value: {
    fontSize: 26,
    fontWeight: '800',
  },
  label: {
    fontSize: typography.caption.fontSize,
  },
});
