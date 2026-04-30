import { CalendarCheck2, MoreHorizontal } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { Goal, GoalStats } from '@/features/goals/domain/types';
import { radii, spacing, typography, useAppTheme } from '@/shared/theme';
import { GlassPanel, IconButton } from '@/shared/ui';

type GoalCardProps = {
  goal: Goal;
  stats?: GoalStats;
  onPress?: () => void;
  onMenuPress?: () => void;
};

export function GoalCard({ goal, stats, onPress, onMenuPress }: GoalCardProps) {
  const theme = useAppTheme();

  return (
    <GlassPanel style={styles.card}>
      <View style={styles.header}>
        <Pressable accessibilityRole="button" onPress={onPress} style={styles.titleBlock}>
          <Text style={[styles.title, { color: theme.text }]}>{goal.title}</Text>
          {goal.description ? (
            <Text style={[styles.description, { color: theme.textSecondary }]}>
              {goal.description}
            </Text>
          ) : null}
        </Pressable>
        <IconButton
          accessibilityLabel="Действия с целью"
          icon={MoreHorizontal}
          onPress={onMenuPress}
          variant="ghost"
        />
      </View>

      <Pressable accessibilityRole="button" onPress={onPress} style={styles.footer}>
        <View style={[styles.statPill, { backgroundColor: theme.accentSoft }]}>
          <CalendarCheck2 color={theme.accent} size={16} strokeWidth={2.4} />
          <Text style={[styles.statText, { color: theme.accent }]}>
            {stats?.currentStreak ?? 0} дней
          </Text>
        </View>
        <Text style={[styles.status, { color: theme.textSecondary }]}>
          {statusLabels[goal.status]}
        </Text>
      </Pressable>
    </GlassPanel>
  );
}

const statusLabels: Record<Goal['status'], string> = {
  active: 'Активна',
  paused: 'Пауза',
  archived: 'Архив',
};

const styles = StyleSheet.create({
  card: {
    gap: spacing.four,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.three,
  },
  titleBlock: {
    flex: 1,
    gap: spacing.one,
  },
  title: {
    fontSize: typography.subtitle.fontSize,
    fontWeight: typography.subtitle.fontWeight,
  },
  description: {
    fontSize: typography.body.fontSize,
    lineHeight: typography.body.lineHeight,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.two,
  },
  statPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.one,
    borderRadius: radii.full,
    paddingHorizontal: spacing.three,
    paddingVertical: spacing.one,
  },
  statText: {
    fontSize: typography.caption.fontSize,
    fontWeight: '700',
  },
  status: {
    fontSize: typography.caption.fontSize,
  },
});
