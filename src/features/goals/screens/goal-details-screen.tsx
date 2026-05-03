import * as Haptics from 'expo-haptics'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { CheckCircle2, Circle, Edit3 } from 'lucide-react-native'
import { useState } from 'react'
import { Text } from 'react-native'

import { GoalCalendarPlaceholder } from '@/features/goals/components/goal-calendar-placeholder'
import { GoalStatsPanel } from '@/features/goals/components/goal-stats-panel'
import { useGoal } from '@/features/goals/hooks/use-goal'
import { getLocalDateString } from '@/shared/date'
import { goalsRepository } from '@/shared/db'
import { typography, useAppTheme } from '@/shared/theme'
import { AppScreen, FloatingActionBar, IconButton, PageHeader } from '@/shared/ui'

export function GoalDetailsScreen() {
  const router = useRouter()
  const { id } = useLocalSearchParams<{ id: string }>()
  const goalId = id ?? ''
  const theme = useAppTheme()
  const { error, goal, isCompletedToday, isLoading, refresh, stats } = useGoal(goalId)
  const [actionError, setActionError] = useState<string | null>(null)
  const [isTogglingToday, setIsTogglingToday] = useState(false)
  let CompletionIcon = Circle
  let completionAccessibilityLabel = 'Отметить сегодня'
  let completionLabel = 'Отметить'
  let completionVariant: 'ghost' | 'primary' = 'primary'
  let title = 'Детали цели'
  let subtitle: string | undefined
  let errorContent = null
  let statsContent = null

  if (isCompletedToday) {
    CompletionIcon = CheckCircle2
    completionAccessibilityLabel = 'Снять отметку за сегодня'
    completionLabel = 'Снять отметку'
    completionVariant = 'ghost'
  }

  if (goal) {
    title = goal.title
    subtitle = goal.description ?? undefined
  }

  if (isLoading) {
    title = 'Загрузка...'
  }

  if (error || actionError) {
    errorContent = (
      <Text style={{ color: theme.danger, fontSize: typography.body.fontSize }}>
        {error ?? actionError}
      </Text>
    )
  }

  if (stats) {
    statsContent = <GoalStatsPanel stats={stats} />
  }

  async function handleToggleToday() {
    if (!goalId) {
      return
    }

    setActionError(null)
    setIsTogglingToday(true)

    try {
      await goalsRepository.toggleCompletion({ date: getLocalDateString(), goalId })
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
      await refresh()
    } catch (caughtError) {
      let message = 'Не удалось обновить отметку.'

      if (caughtError instanceof Error) {
        message = caughtError.message
      }

      setActionError(message)
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
    } finally {
      setIsTogglingToday(false)
    }
  }

  const footer = (
    <FloatingActionBar>
      <IconButton
        accessibilityLabel={completionAccessibilityLabel}
        disabled={!goal || isTogglingToday}
        icon={CompletionIcon}
        label={completionLabel}
        onPress={() => void handleToggleToday()}
        variant={completionVariant}
      />
      <IconButton
        accessibilityLabel="Редактировать цель"
        icon={Edit3}
        label="Редактировать"
        onPress={() => {
          if (goalId) {
            router.push({ pathname: '/goals/[id]/edit', params: { id: goalId } })
          }
        }}
      />
    </FloatingActionBar>
  )

  return (
    <AppScreen footer={footer} scroll>
      <PageHeader
        title={title}
        subtitle={subtitle}
        showBackButton
      />
      {errorContent}
      {statsContent}
      <GoalCalendarPlaceholder />
    </AppScreen>
  )
}
