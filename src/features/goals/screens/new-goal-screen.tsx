import { GoalFormPlaceholder } from '@/features/goals/components/goal-form-placeholder';
import { AppScreen, PageHeader } from '@/shared/ui';

export function NewGoalScreen() {
  return (
    <AppScreen>
      <PageHeader title="Новая цель" showBackButton />
      <GoalFormPlaceholder mode="create" />
    </AppScreen>
  );
}
