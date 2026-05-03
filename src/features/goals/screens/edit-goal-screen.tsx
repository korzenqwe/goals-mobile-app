import * as Haptics from 'expo-haptics'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Trash2 } from 'lucide-react-native'
import { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'

import { GoalForm, type GoalFormValues } from '@/features/goals/components/goal-form'
import { useGoal } from '@/features/goals/hooks/use-goal'
import { goalsRepository } from '@/shared/db'
import { spacing, typography, useAppTheme } from '@/shared/theme'
import { AppScreen, ConfirmationDialog, GlassPanel, IconButton, PageHeader } from '@/shared/ui'

export function EditGoalScreen() {
  const router = useRouter()
  const theme = useAppTheme()
  const { id } = useLocalSearchParams<{ id: string }>()
  const goalId = id ?? ''
  const { error: loadError, goal, isLoading } = useGoal(goalId)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [isDeleteDialogVisible, setIsDeleteDialogVisible] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(values: GoalFormValues) {
    setSubmitError(null)
    setIsSubmitting(true)

    try {
      await goalsRepository.updateGoal(goalId, values)
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
      router.replace({ pathname: '/goals/[id]', params: { id: goalId } })
    } catch (caughtError) {
      let message = 'Не удалось сохранить цель.'

      if (caughtError instanceof Error) {
        message = caughtError.message
      }

      setSubmitError(message)
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDelete() {
    setDeleteError(null)
    setIsDeleting(true)

    try {
      await goalsRepository.deleteGoal(goalId)
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
      router.replace('/')
    } catch (caughtError) {
      let message = 'Не удалось удалить цель.'

      if (caughtError instanceof Error) {
        message = caughtError.message
      }

      setDeleteError(message)
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
    } finally {
      setIsDeleting(false)
      setIsDeleteDialogVisible(false)
    }
  }

  let content = (
    <Text style={[styles.message, { color: theme.danger }]}>
      {loadError ?? 'Цель не найдена.'}
    </Text>
  )

  if (goal) {
    let deleteErrorContent = null
    let deleteLabel = 'Удалить'

    if (deleteError) {
      deleteErrorContent = (
        <Text style={[styles.deleteText, { color: theme.danger }]}>{deleteError}</Text>
      )
    }

    if (isDeleting) {
      deleteLabel = 'Удаляем...'
    }

    content = (
      <>
        <GoalForm
          error={submitError}
          initialValues={{
            description: goal.description,
            title: goal.title,
          }}
          isSubmitting={isSubmitting}
          key={goal.id}
          onSubmit={(values) => void handleSubmit(values)}
          submitLabel="Сохранить"
        />

        <GlassPanel style={styles.deletePanel}>
          <View style={styles.deleteCopy}>
            <Text style={[styles.deleteTitle, { color: theme.danger }]}>Удалить цель</Text>
            <Text style={[styles.deleteText, { color: theme.textSecondary }]}>
              Цель и вся история выполнения будут удалены без восстановления.
            </Text>
            {deleteErrorContent}
          </View>
          <IconButton
            accessibilityLabel="Удалить цель"
            disabled={isDeleting}
            icon={Trash2}
            label={deleteLabel}
            onPress={() => setIsDeleteDialogVisible(true)}
            variant="danger"
          />
        </GlassPanel>

        <ConfirmationDialog
          confirmLabel="Удалить"
          isConfirming={isDeleting}
          message="Цель и вся история выполнения будут удалены без восстановления."
          onCancel={() => setIsDeleteDialogVisible(false)}
          onConfirm={() => void handleDelete()}
          title="Удалить цель?"
          visible={isDeleteDialogVisible}
        />
      </>
    )
  }

  if (isLoading) {
    content = (
      <Text style={[styles.message, { color: theme.textSecondary }]}>Загрузка...</Text>
    )
  }

  return (
    <AppScreen scroll>
      <PageHeader title="Редактирование" showBackButton />
      {content}
    </AppScreen>
  )
}

const styles = StyleSheet.create({
  message: {
    fontSize: typography.body.fontSize,
    lineHeight: typography.body.lineHeight,
  },
  deletePanel: {
    gap: spacing.three,
  },
  deleteCopy: {
    gap: spacing.one,
  },
  deleteTitle: {
    fontSize: typography.subtitle.fontSize,
    fontWeight: typography.subtitle.fontWeight,
  },
  deleteText: {
    fontSize: typography.body.fontSize,
    lineHeight: typography.body.lineHeight,
  },
})
