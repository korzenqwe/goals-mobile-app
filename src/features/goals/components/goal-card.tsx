import { CalendarCheck2, CheckCircle2, Circle, MoreHorizontal } from 'lucide-react-native'
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native'
import type { StyleProp, ViewStyle } from 'react-native'

import type { Goal, GoalStats } from '@/features/goals/domain/types'
import { radii, spacing, typography, useAppTheme } from '@/shared/theme'
import { GlassPanel, IconButton } from '@/shared/ui'

type GoalCardProps = {
  goal: Goal
  isCompletedToday?: boolean
  isTogglingToday?: boolean
  isUpdating?: boolean
  stats?: GoalStats
  onPress?: () => void
  onMenuPress?: () => void
  onToggleToday?: () => void
}

export function GoalCard({
  goal,
  isCompletedToday = false,
  isTogglingToday = false,
  isUpdating = false,
  stats,
  onPress,
  onMenuPress,
  onToggleToday,
}: GoalCardProps) {
  const theme = useAppTheme()
  const cardStyle: StyleProp<ViewStyle> = [styles.card]
  let CompletionIcon = Circle
  let completionAccessibilityLabel = 'Отметить сегодня'
  let completionLabel = 'Отметить'
  let completionVariant: 'ghost' | 'primary' = 'primary'
  let descriptionContent = null
  let updatingIndicator = null

  if (isCompletedToday) {
    CompletionIcon = CheckCircle2
    completionAccessibilityLabel = 'Снять отметку за сегодня'
    completionLabel = 'Снять отметку'
    completionVariant = 'ghost'
  }

  if (isUpdating) {
    cardStyle.push({
      backgroundColor: theme.accentSoft,
      borderColor: theme.accent,
    })
    completionLabel = 'Обновляем...'
    updatingIndicator = <ActivityIndicator color={theme.accent} size="small" />
  }

  if (goal.description) {
    descriptionContent = (
      <Text style={[styles.description, { color: theme.textSecondary }]}>
        {goal.description}
      </Text>
    )
  }

  return (
    <GlassPanel style={cardStyle}>
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          disabled={isUpdating}
          onPress={onPress}
          style={styles.titleBlock}
        >
          <Text style={[styles.title, { color: theme.text }]}>{goal.title}</Text>
          {descriptionContent}
        </Pressable>
        <View style={styles.headerActions}>
          {updatingIndicator}
          <IconButton
            accessibilityLabel="Действия с целью"
            disabled={isUpdating}
            icon={MoreHorizontal}
            onPress={onMenuPress}
            variant="ghost"
          />
        </View>
      </View>

      <View style={styles.footer}>
        <Pressable
          accessibilityRole="button"
          disabled={isUpdating}
          onPress={onPress}
          style={styles.footerInfo}
        >
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
        <IconButton
          accessibilityLabel={completionAccessibilityLabel}
          disabled={isTogglingToday || isUpdating || !onToggleToday}
          icon={CompletionIcon}
          label={completionLabel}
          onPress={onToggleToday}
          variant={completionVariant}
        />
      </View>
    </GlassPanel>
  )
}

const statusLabels: Record<Goal['status'], string> = {
  active: 'Активна',
  paused: 'Пауза',
  archived: 'Архив',
}

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
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
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
    flexWrap: 'wrap',
    gap: spacing.two,
  },
  footerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flexGrow: 1,
    flexShrink: 1,
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
})
