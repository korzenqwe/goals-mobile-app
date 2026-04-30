import { Plus, Target } from 'lucide-react-native';
import { useRouter } from 'expo-router';

import { AppScreen, EmptyState, FloatingActionBar, IconButton, PageHeader } from '@/shared/ui';

export function GoalsDashboardScreen() {
  const router = useRouter();

  return (
    <AppScreen>
      <PageHeader title="Цели" />
      <EmptyState
        icon={Target}
        title="Целей пока нет"
        description="Добавьте первую цель, чтобы начать отмечать дни."
        actionLabel="Новая цель"
        onActionPress={() => router.push('/goals/new')}
      />
      <FloatingActionBar>
        <IconButton
          accessibilityLabel="Создать цель"
          icon={Plus}
          label="Новая цель"
          onPress={() => router.push('/goals/new')}
        />
      </FloatingActionBar>
    </AppScreen>
  );
}
