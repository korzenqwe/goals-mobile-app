import { Edit3 } from 'lucide-react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { GoalCalendarPlaceholder } from '@/features/goals/components/goal-calendar-placeholder';
import { GoalStatsPlaceholder } from '@/features/goals/components/goal-stats-placeholder';
import { AppScreen, FloatingActionBar, IconButton, PageHeader } from '@/shared/ui';

export function GoalDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const goalId = id ?? '';

  return (
    <AppScreen scroll>
      <PageHeader title="Детали цели" showBackButton />
      <GoalStatsPlaceholder />
      <GoalCalendarPlaceholder />
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
    </AppScreen>
  );
}
