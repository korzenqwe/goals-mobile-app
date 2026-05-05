import * as Haptics from 'expo-haptics'
import {
  useRouter,
} from 'expo-router'
import {
  Plus,
  RefreshCw,
  Target,
} from 'lucide-react-native'
import {
  useState,
} from 'react'
import {
  StyleSheet,
  Text,
  View,
} from 'react-native'

import {
  GoalCard,
} from '@/features/goals/components/goal-card'
import {
  useGoalsList,
} from '@/features/goals/hooks/use-goals-list'
import {
  getLocalDateString,
} from '@/shared/date'
import {
  goalsRepository,
} from '@/shared/db'
import {
  spacing,
  typography,
  useAppTheme,
} from '@/shared/theme'
import {
  AppScreen,
  EmptyState,
  FloatingActionBar,
  IconButton,
  PageHeader,
} from '@/shared/ui'

export function GoalsDashboardScreen() {
  const router = useRouter()
  const theme = useAppTheme()
  const { error, goals, isLoading, refresh, refreshGoal } = useGoalsList()
  const [actionError, setActionError] = useState<string | null>(null)
  const [togglingGoalId, setTogglingGoalId] = useState<string | null>(null)

  async function handleToggleToday(goalId: string) {
    setActionError(null)
    setTogglingGoalId(goalId)

    try {
      await goalsRepository.toggleCompletion({ date: getLocalDateString(), goalId })
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
      await refreshGoal(goalId)
    } catch (caughtError) {
      let message = 'Не удалось обновить отметку.'

      if (caughtError instanceof Error) {
        message = caughtError.message
      }

      setActionError(message)
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
    } finally {
      setTogglingGoalId(null)
    }
  }

  async function handleRefresh() {
    setActionError(null)
    await refresh()
  }

  const footer = (
    <FloatingActionBar>
      <IconButton
        accessibilityLabel="Создать цель"
        icon={Plus}
        label="Новая цель"
        onPress={() => router.push('/goals/new')}
      />
    </FloatingActionBar>
  )

  let errorContent = null
  let content = (
    <EmptyState
      icon={Target}
      title="Целей пока нет"
      description="Добавьте первую цель, чтобы начать отмечать дни."
      actionLabel="Новая цель"
      onActionPress={() => router.push('/goals/new')}
    />
  )

  if (error || actionError) {
    errorContent = (
      <View style={styles.message}>
        <Text style={[styles.messageText, { color: theme.danger }]}>
          {error ?? actionError}
        </Text>
        <IconButton icon={RefreshCw} label="Повторить" onPress={() => void handleRefresh()} />
      </View>
    )
  }

  if (goals.length > 0) {
    content = (
      <View style={styles.list}>
        {goals.map(({ goal, isCompletedToday, stats }) => {
          const isGoalUpdating = togglingGoalId === goal.id

          return (
            <GoalCard
              goal={goal}
              isCompletedToday={isCompletedToday}
              isTogglingToday={isGoalUpdating}
              key={goal.id}
              onPress={() => router.push({ pathname: '/goals/[id]', params: { id: goal.id } })}
              onMenuPress={() =>
                router.push({ pathname: '/goals/[id]/edit', params: { id: goal.id } })
              }
              onToggleToday={() => void handleToggleToday(goal.id)}
              stats={stats}
            />
          )
        })}
      </View>
    )
  }

  if (isLoading) {
    content = (
      <Text style={[styles.messageText, { color: theme.textSecondary }]}>Загрузка...</Text>
    )
  }

  return (
    <AppScreen footer={footer} scroll>
      <PageHeader title="Цели" />
      {errorContent}
      {content}
    </AppScreen>
  )
}

const styles = StyleSheet.create({
  list: {
    gap: spacing.three,
  },
  message: {
    gap: spacing.three,
  },
  messageText: {
    fontSize: typography.body.fontSize,
    lineHeight: typography.body.lineHeight,
  },
})
