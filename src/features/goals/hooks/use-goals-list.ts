import {
  useFocusEffect,
} from '@react-navigation/native'
import {
  useCallback,
  useRef,
  useState,
} from 'react'

import type {
  GoalViewModel,
} from '@/features/goals/domain/types'
import {
  getLocalDateString,
} from '@/shared/date'
import {
  goalsRepository,
} from '@/shared/db'

export function useGoalsList() {
  const isFocusedRef = useRef(false)
  const requestIdRef = useRef(0)
  const [
    goals,
    setGoals,
  ] = useState<GoalViewModel[]>([])
  const [
    error,
    setError,
  ] = useState<string | null>(null)
  const [
    isLoading,
    setIsLoading,
  ] = useState(true)

  const refreshGoal = useCallback(async (goalId: string) => {
    const goal = await goalsRepository.getGoal(goalId)

    if (!isFocusedRef.current) {
      return
    }

    if (!goal) {
      setGoals((currentGoals) => currentGoals.filter((item) => item.goal.id !== goalId))
      return
    }

    const nextGoalItem = await buildGoalViewModel(goal)

    if (isFocusedRef.current) {
      setGoals((currentGoals) =>
        currentGoals.map((item) => {
          if (item.goal.id === goalId) {
            return nextGoalItem
          }

          return item
        }),
      )
    }
  }, [])

  const refresh = useCallback(async () => {
    const requestId = requestIdRef.current + 1
    requestIdRef.current = requestId

    function canApplyState() {
      return isFocusedRef.current && requestIdRef.current === requestId
    }

    if (canApplyState()) {
      setIsLoading(true)
    }

    try {
      const nextGoals = await goalsRepository.listGoals({ status: 'active' })
      const nextGoalItems = await Promise.all(nextGoals.map(buildGoalViewModel))

      if (canApplyState()) {
        setGoals(nextGoalItems)
        setError(null)
      }
    } catch (caughtError) {
      let message = 'Не удалось загрузить цели.'

      if (caughtError instanceof Error) {
        message = caughtError.message
      }

      if (canApplyState()) {
        setError(message)
      }
    } finally {
      if (canApplyState()) {
        setIsLoading(false)
      }
    }
  }, [])

  useFocusEffect(
    useCallback(() => {
      isFocusedRef.current = true
      void refresh()

      return () => {
        isFocusedRef.current = false
        requestIdRef.current += 1
      }
    }, [refresh]),
  )

  return { error, goals, isLoading, refresh, refreshGoal }
}

async function buildGoalViewModel(goal: GoalViewModel['goal']): Promise<GoalViewModel> {
  const today = getLocalDateString()
  const [
    stats,
    isCompletedToday,
  ] = await Promise.all([
    goalsRepository.getGoalStats(goal.id),
    goalsRepository.isCompletedOn(goal.id, today),
  ])

  return { goal, isCompletedToday, stats }
}
