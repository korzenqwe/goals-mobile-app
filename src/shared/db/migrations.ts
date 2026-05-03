export type SQLiteMigration = {
  id: number
  name: string
  sql: string
}

export const migrations: readonly SQLiteMigration[] = [
  {
    id: 1,
    name: 'create_goals',
    sql: `
      CREATE TABLE IF NOT EXISTS goals (
        id TEXT PRIMARY KEY NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'archived')),
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        paused_at TEXT,
        archived_at TEXT
      );

      CREATE INDEX IF NOT EXISTS goals_status_updated_at_idx
        ON goals (status, updated_at DESC);

      CREATE TABLE IF NOT EXISTS goal_completions (
        id TEXT PRIMARY KEY NOT NULL,
        goal_id TEXT NOT NULL REFERENCES goals(id) ON DELETE CASCADE,
        date TEXT NOT NULL,
        note TEXT,
        created_at TEXT NOT NULL,
        UNIQUE(goal_id, date)
      );

      CREATE INDEX IF NOT EXISTS goal_completions_goal_id_date_idx
        ON goal_completions (goal_id, date DESC);
    `,
  },
]
