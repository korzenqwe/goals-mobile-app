import {
  useFocusEffect,
} from '@react-navigation/native'
import {
  useCallback,
  useRef,
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
  const isFocusedRef = useRef(false)
  const requestIdRef = useRef(0)
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
    const requestId = requestIdRef.current + 1
    requestIdRef.current = requestId

    function canApplyState() {
      return isFocusedRef.current && requestIdRef.current === requestId
    }

    if (!goalId) {
      if (canApplyState()) {
        setGoal(null)
        setStats(null)
        setIsCompletedToday(false)
        setError(null)
        setIsLoading(false)
      }

      return
    }

    if (canApplyState()) {
      setIsLoading(true)
    }

    try {
      const nextGoal = await goalsRepository.getGoal(goalId)
      const today = getLocalDateString()

      if (!nextGoal) {
        if (canApplyState()) {
          setGoal(null)
          setStats(null)
          setIsCompletedToday(false)
          setError('Цель не найдена.')
        }

        return
      }

      const [
        nextStats,
        nextIsCompletedToday,
      ] = await Promise.all([
        goalsRepository.getGoalStats(goalId),
        goalsRepository.isCompletedOn(goalId, today),
      ])

      if (canApplyState()) {
        setGoal(nextGoal)
        setStats(nextStats)
        setIsCompletedToday(nextIsCompletedToday)
        setError(null)
      }
    } catch (caughtError) {
      let message = 'Не удалось загрузить цель.'

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
  }, [goalId])

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

  return { error, goal, isCompletedToday, isLoading, refresh, stats }
}
