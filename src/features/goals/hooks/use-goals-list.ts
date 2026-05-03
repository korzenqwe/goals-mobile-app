import { useFocusEffect } from '@react-navigation/native'
import { useCallback, useState } from 'react'

import type { GoalViewModel } from '@/features/goals/domain/types'
import { getLocalDateString } from '@/shared/date'
import { goalsRepository } from '@/shared/db'

export function useGoalsList() {
  const [goals, setGoals] = useState<GoalViewModel[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const refreshGoal = useCallback(async (goalId: string) => {
    const goal = await goalsRepository.getGoal(goalId)

    if (!goal) {
      setGoals((currentGoals) => currentGoals.filter((item) => item.goal.id !== goalId))
      return
    }

    const nextGoalItem = await buildGoalViewModel(goal)

    setGoals((currentGoals) =>
      currentGoals.map((item) => {
        if (item.goal.id === goalId) {
          return nextGoalItem
        }

        return item
      }),
    )
  }, [])

  const refresh = useCallback(async () => {
    setIsLoading(true)

    try {
      const nextGoals = await goalsRepository.listGoals({ status: 'active' })
      const nextGoalItems = await Promise.all(nextGoals.map(buildGoalViewModel))

      setGoals(nextGoalItems)
      setError(null)
    } catch (caughtError) {
      let message = 'Не удалось загрузить цели.'

      if (caughtError instanceof Error) {
        message = caughtError.message
      }

      setError(message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useFocusEffect(
    useCallback(() => {
      void refresh()
    }, [refresh]),
  )

  return { error, goals, isLoading, refresh, refreshGoal }
}

async function buildGoalViewModel(goal: GoalViewModel['goal']): Promise<GoalViewModel> {
  const today = getLocalDateString()
  const [stats, isCompletedToday] = await Promise.all([
    goalsRepository.getGoalStats(goal.id),
    goalsRepository.isCompletedOn(goal.id, today),
  ])

  return { goal, isCompletedToday, stats }
}
