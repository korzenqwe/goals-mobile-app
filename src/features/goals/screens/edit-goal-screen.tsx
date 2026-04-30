import { GoalFormPlaceholder } from '@/features/goals/components/goal-form-placeholder';
import { AppScreen, PageHeader } from '@/shared/ui';

export function EditGoalScreen() {
  return (
    <AppScreen>
      <PageHeader title="Редактирование" showBackButton />
      <GoalFormPlaceholder mode="edit" />
    </AppScreen>
  );
}
