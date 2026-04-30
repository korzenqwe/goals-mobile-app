import { useRouter } from 'expo-router';
import { Plus, RefreshCw, Target } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';

import { GoalCard } from '@/features/goals/components/goal-card';
import { useGoalsList } from '@/features/goals/hooks/use-goals-list';
import { spacing, typography, useAppTheme } from '@/shared/theme';
import { AppScreen, EmptyState, FloatingActionBar, IconButton, PageHeader } from '@/shared/ui';

export function GoalsDashboardScreen() {
  const router = useRouter();
  const theme = useAppTheme();
  const { error, goals, isLoading, refresh } = useGoalsList();

  const footer = (
    <FloatingActionBar>
      <IconButton
        accessibilityLabel="Создать цель"
        icon={Plus}
        label="Новая цель"
        onPress={() => router.push('/goals/new')}
      />
    </FloatingActionBar>
  );

  return (
    <AppScreen footer={footer} scroll>
      <PageHeader title="Цели" />

      {error ? (
        <View style={styles.message}>
          <Text style={[styles.messageText, { color: theme.danger }]}>{error}</Text>
          <IconButton icon={RefreshCw} label="Повторить" onPress={refresh} />
        </View>
      ) : null}

      {isLoading ? (
        <Text style={[styles.messageText, { color: theme.textSecondary }]}>Загрузка...</Text>
      ) : goals.length > 0 ? (
        <View style={styles.list}>
          {goals.map((goal) => (
            <GoalCard
              goal={goal}
              key={goal.id}
              onPress={() => router.push({ pathname: '/goals/[id]', params: { id: goal.id } })}
              stats={{
                bestStreak: 0,
                completionRate: 0,
                currentMonthCompletionCount: 0,
                currentStreak: 0,
              }}
            />
          ))}
        </View>
      ) : (
        <EmptyState
          icon={Target}
          title="Целей пока нет"
          description="Добавьте первую цель, чтобы начать отмечать дни."
          actionLabel="Новая цель"
          onActionPress={() => router.push('/goals/new')}
        />
      )}

    </AppScreen>
  );
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
});
