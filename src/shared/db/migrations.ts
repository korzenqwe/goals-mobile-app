export type SQLiteMigration = {
  id: number;
  name: string;
  sql: string;
};

export const migrations: readonly SQLiteMigration[] = [];
