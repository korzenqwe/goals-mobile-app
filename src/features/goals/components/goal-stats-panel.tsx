import type { ComponentType } from 'react'
import { CalendarCheck2, Flame, Percent, Trophy } from 'lucide-react-native'
import { StyleSheet, Text, View } from 'react-native'

import type { GoalStats } from '@/features/goals/domain/types'
import { radii, spacing, typography, useAppTheme } from '@/shared/theme'

type GoalStatsPanelProps = {
  stats: GoalStats
}

type StatTileProps = {
  icon: ComponentType<{ color?: string, size?: number, strokeWidth?: number }>
  label: string
  value: string
}

export function GoalStatsPanel({ stats }: GoalStatsPanelProps) {
  return (
    <View style={styles.grid}>
      <StatTile icon={Flame} label="Текущая серия" value={String(stats.currentStreak)} />
      <StatTile icon={Trophy} label="Лучшая серия" value={String(stats.bestStreak)} />
      <StatTile
        icon={CalendarCheck2}
        label="В этом месяце"
        value={String(stats.currentMonthCompletionCount)}
      />
      <StatTile icon={Percent} label="Выполнение" value={`${stats.completionRate}%`} />
    </View>
  )
}

function StatTile({ icon: Icon, label, value }: StatTileProps) {
  const theme = useAppTheme()

  return (
    <View
      style={[
        styles.tile,
        {
          backgroundColor: theme.surfaceElevated,
          borderColor: theme.border,
        },
      ]}
    >
      <View style={[styles.iconFrame, { backgroundColor: theme.accentSoft }]}>
        <Icon color={theme.accent} size={18} strokeWidth={2.4} />
      </View>
      <Text style={[styles.value, { color: theme.text }]}>{value}</Text>
      <Text style={[styles.label, { color: theme.textSecondary }]}>{label}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.two,
  },
  tile: {
    flexBasis: '48%',
    flexGrow: 1,
    gap: spacing.one,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: radii.large,
    padding: spacing.three,
  },
  iconFrame: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.full,
    marginBottom: spacing.one,
  },
  value: {
    fontSize: 26,
    lineHeight: 30,
    fontWeight: '800',
  },
  label: {
    fontSize: typography.caption.fontSize,
  },
})
