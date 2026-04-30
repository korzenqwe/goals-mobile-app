import type {
  CreateGoalInput,
  Goal,
  GoalCompletion,
  GoalStats,
  GoalStatus,
  ToggleCompletionInput,
  UpdateGoalInput,
} from '@/features/goals/domain/types';
import type { DateRange, LocalDateString } from '@/shared/date';

export type ListGoalsParams = {
  status?: GoalStatus;
  includeArchived?: boolean;
};

export interface GoalsRepository {
  listGoals(params?: ListGoalsParams): Promise<Goal[]>;
  getGoal(id: string): Promise<Goal | null>;
  createGoal(input: CreateGoalInput): Promise<Goal>;
  updateGoal(id: string, input: UpdateGoalInput): Promise<Goal>;
  pauseGoal(id: string): Promise<Goal>;
  unpauseGoal(id: string): Promise<Goal>;
  archiveGoal(id: string): Promise<Goal>;
  listCompletions(goalId: string, range?: DateRange): Promise<GoalCompletion[]>;
  toggleCompletion(input: ToggleCompletionInput): Promise<GoalCompletion | null>;
  updateCompletionNote(
    goalId: string,
    date: LocalDateString,
    note: string | null,
  ): Promise<GoalCompletion>;
  getGoalStats(goalId: string): Promise<GoalStats>;
}
