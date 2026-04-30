export const DATABASE_NAME = 'goals.db';

export const schema = {
  goalsTable: 'goals',
  completionsTable: 'goal_completions',
  completionUniqueIndex: 'goal_completions_goal_id_date_unique',
  databaseVersion: 1,
} as const;
