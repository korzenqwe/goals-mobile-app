import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text } from 'react-native';

import { GoalForm, type GoalFormValues } from '@/features/goals/components/goal-form';
import { useGoal } from '@/features/goals/hooks/use-goal';
import { goalsRepository } from '@/shared/db';
import { typography, useAppTheme } from '@/shared/theme';
import { AppScreen, PageHeader } from '@/shared/ui';

export function EditGoalScreen() {
  const router = useRouter();
  const theme = useAppTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const goalId = id ?? '';
  const { error: loadError, goal, isLoading } = useGoal(goalId);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(values: GoalFormValues) {
    setSubmitError(null);
    setIsSubmitting(true);

    try {
      await goalsRepository.updateGoal(goalId, values);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace({ pathname: '/goals/[id]', params: { id: goalId } });
    } catch (caughtError) {
      setSubmitError(caughtError instanceof Error ? caughtError.message : 'Не удалось сохранить цель.');
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AppScreen scroll>
      <PageHeader title="Редактирование" showBackButton />
      {isLoading ? (
        <Text style={[styles.message, { color: theme.textSecondary }]}>Загрузка...</Text>
      ) : goal ? (
        <GoalForm
          error={submitError}
          initialValues={{
            description: goal.description,
            title: goal.title,
          }}
          isSubmitting={isSubmitting}
          key={goal.id}
          onSubmit={handleSubmit}
          submitLabel="Сохранить"
        />
      ) : (
        <Text style={[styles.message, { color: theme.danger }]}>
          {loadError ?? 'Цель не найдена.'}
        </Text>
      )}
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  message: {
    fontSize: typography.body.fontSize,
    lineHeight: typography.body.lineHeight,
  },
});
