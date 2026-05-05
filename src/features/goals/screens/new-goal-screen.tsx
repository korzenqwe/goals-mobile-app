import * as Haptics from 'expo-haptics'
import {
  useRouter,
} from 'expo-router'
import {
  useState,
} from 'react'

import {
  GoalForm,
  type GoalFormValues,
} from '@/features/goals/components/goal-form'
import {
  goalsRepository,
} from '@/shared/db'
import {
  AppScreen,
  PageHeader,
  useToast,
} from '@/shared/ui'

export function NewGoalScreen() {
  const router = useRouter()
  const {
    showToast,
  } = useToast()
  const [
    error,
    setError,
  ] = useState<string | null>(null)
  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false)

  async function handleSubmit(values: GoalFormValues) {
    setError(null)
    setIsSubmitting(true)

    try {
      await goalsRepository.createGoal(values)
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
      showToast({ message: 'Цель создана' })
      router.replace('/')
    } catch (caughtError) {
      let message = 'Не удалось создать цель.'

      if (caughtError instanceof Error) {
        message = caughtError.message
      }

      setError(message)
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AppScreen scroll>
      <PageHeader title="Новая цель" showBackButton />
      <GoalForm
        autoFocusTitle
        error={error}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
        submitLabel="Создать"
      />
    </AppScreen>
  )
}
