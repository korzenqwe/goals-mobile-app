import { Edit3 } from 'lucide-react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Text } from 'react-native';

import { GoalCalendarPlaceholder } from '@/features/goals/components/goal-calendar-placeholder';
import { GoalStatsPlaceholder } from '@/features/goals/components/goal-stats-placeholder';
import { useGoal } from '@/features/goals/hooks/use-goal';
import { typography, useAppTheme } from '@/shared/theme';
import { AppScreen, FloatingActionBar, IconButton, PageHeader } from '@/shared/ui';

export function GoalDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const goalId = id ?? '';
  const theme = useAppTheme();
  const { error, goal, isLoading } = useGoal(goalId);

  const footer = (
    <FloatingActionBar>
      <IconButton
        accessibilityLabel="Редактировать цель"
        icon={Edit3}
        label="Редактировать"
        onPress={() => {
          if (goalId) {
            router.push({ pathname: '/goals/[id]/edit', params: { id: goalId } });
          }
        }}
      />
    </FloatingActionBar>
  );

  return (
    <AppScreen footer={footer} scroll>
      <PageHeader
        title={goal?.title ?? (isLoading ? 'Загрузка...' : 'Детали цели')}
        subtitle={goal?.description ?? undefined}
        showBackButton
      />
      {error ? (
        <Text style={{ color: theme.danger, fontSize: typography.body.fontSize }}>{error}</Text>
      ) : null}
      <GoalStatsPlaceholder />
      <GoalCalendarPlaceholder />
    </AppScreen>
  );
}
