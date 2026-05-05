import {
  useFocusEffect,
} from '@react-navigation/native'
import {
  useCallback,
  useState,
} from 'react'

import type {
  Goal,
  GoalStats,
} from '@/features/goals/domain/types'
import {
  getLocalDateString,
} from '@/shared/date'
import {
  goalsRepository,
} from '@/shared/db'

export function useGoal(goalId: string) {
  const [
    goal,
    setGoal,
  ] = useState<Goal | null>(null)
  const [
    stats,
    setStats,
  ] = useState<GoalStats | null>(null)
  const [
    isCompletedToday,
    setIsCompletedToday,
  ] = useState(false)
  const [
    error,
    setError,
  ] = useState<string | null>(null)
  const [
    isLoading,
    setIsLoading,
  ] = useState(true)

  const refresh = useCallback(async () => {
    if (!goalId) {
      setGoal(null)
      setStats(null)
      setIsCompletedToday(false)
      setError(null)
      setIsLoading(false)
      return
    }

    setIsLoading(true)

    try {
      const nextGoal = await goalsRepository.getGoal(goalId)
      const today = getLocalDateString()

      if (!nextGoal) {
        setGoal(null)
        setStats(null)
        setIsCompletedToday(false)
        setError('Цель не найдена.')
        return
      }

      const [
        nextStats,
        nextIsCompletedToday,
      ] = await Promise.all([
        goalsRepository.getGoalStats(goalId),
        goalsRepository.isCompletedOn(goalId, today),
      ])

      setGoal(nextGoal)
      setStats(nextStats)
      setIsCompletedToday(nextIsCompletedToday)
      setError(null)
    } catch (caughtError) {
      let message = 'Не удалось загрузить цель.'

      if (caughtError instanceof Error) {
        message = caughtError.message
      }

      setError(message)
    } finally {
      setIsLoading(false)
    }
  }, [goalId])

  useFocusEffect(
    useCallback(() => {
      void refresh()
    }, [refresh]),
  )

  return { error, goal, isCompletedToday, isLoading, refresh, stats }
}
