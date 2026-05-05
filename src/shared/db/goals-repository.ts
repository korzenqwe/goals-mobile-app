import type {
  SQLiteDatabase,
} from 'expo-sqlite'
import {
  Platform,
} from 'react-native'

import type {
  CreateGoalInput,
  Goal,
  GoalCompletion,
  GoalStats,
  GoalStatus,
  ToggleCompletionInput,
  UpdateGoalInput,
} from '@/features/goals/domain/types'
import {
  calculateCompletionStats,
  type DateRange,
  getLocalDateString,
  type LocalDateString,
} from '@/shared/date'
import {
  getDatabaseAsync,
} from '@/shared/db/database'

export type ListGoalsParams = {
  status?: GoalStatus
  includeArchived?: boolean
}

export interface GoalsRepository {
  listGoals(params?: ListGoalsParams): Promise<Goal[]>
  getGoal(id: string): Promise<Goal | null>
  createGoal(input: CreateGoalInput): Promise<Goal>
  updateGoal(id: string, input: UpdateGoalInput): Promise<Goal>
  pauseGoal(id: string): Promise<Goal>
  unpauseGoal(id: string): Promise<Goal>
  archiveGoal(id: string): Promise<Goal>
  deleteGoal(id: string): Promise<void>
  listCompletions(goalId: string, range?: DateRange): Promise<GoalCompletion[]>
  isCompletedOn(goalId: string, date: LocalDateString): Promise<boolean>
  toggleCompletion(input: ToggleCompletionInput): Promise<GoalCompletion | null>
  updateCompletionNote(
    goalId: string,
    date: LocalDateString,
    note: string | null,
  ): Promise<GoalCompletion>
  getGoalStats(goalId: string): Promise<GoalStats>
}

type GoalRow = {
  id: string
  title: string
  description: string | null
  status: GoalStatus
  created_at: string
  updated_at: string
  paused_at: string | null
  archived_at: string | null
}

type CompletionRow = {
  id: string
  goal_id: string
  date: LocalDateString
  note: string | null
  created_at: string
}

type CompletionStatementRunner = Pick<SQLiteDatabase, 'runAsync'>

class SQLiteGoalsRepository implements GoalsRepository {
  async listGoals(params: ListGoalsParams = {}) {
    const database = await getDatabaseAsync()
    const includeArchived = params.includeArchived ?? false
    let rows: GoalRow[]

    if (params.status) {
      rows = await database.getAllAsync<GoalRow>(
        `
          SELECT * FROM goals
          WHERE status = ?
          ORDER BY updated_at DESC;
        `,
        params.status,
      )
    } else {
      let includeArchivedValue = 0

      if (includeArchived) {
        includeArchivedValue = 1
      }

      rows = await database.getAllAsync<GoalRow>(
        `
          SELECT * FROM goals
          WHERE (? = 1 OR status != 'archived')
          ORDER BY updated_at DESC;
        `,
        includeArchivedValue,
      )
    }

    return rows.map(mapGoalRow)
  }

  async getGoal(id: string) {
    const database = await getDatabaseAsync()
    const row = await database.getFirstAsync<GoalRow>('SELECT * FROM goals WHERE id = ?;', id)

    if (row) {
      return mapGoalRow(row)
    }

    return null
  }

  async createGoal(input: CreateGoalInput) {
    const title = input.title.trim()

    if (!title) {
      throw new Error('Введите название цели.')
    }

    const database = await getDatabaseAsync()
    const now = new Date().toISOString()
    const goal: Goal = {
      id: createId('goal'),
      title,
      description: normalizeNullableText(input.description),
      status: 'active',
      createdAt: now,
      updatedAt: now,
      pausedAt: null,
      archivedAt: null,
    }

    await database.runAsync(
      `
      INSERT INTO goals (
        id, title, description, status, created_at, updated_at, paused_at, archived_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?);
    `,
      goal.id,
      goal.title,
      goal.description,
      goal.status,
      goal.createdAt,
      goal.updatedAt,
      goal.pausedAt,
      goal.archivedAt,
    )

    return goal
  }

  async updateGoal(id: string, input: UpdateGoalInput) {
    const existing = await this.getGoal(id)

    if (!existing) {
      throw new Error('Цель не найдена.')
    }

    let title = existing.title

    if (input.title !== undefined) {
      title = input.title.trim()
    }

    if (!title) {
      throw new Error('Введите название цели.')
    }

    const database = await getDatabaseAsync()
    const updatedAt = new Date().toISOString()
    let description = existing.description

    if (input.description !== undefined) {
      description = normalizeNullableText(input.description)
    }

    await database.runAsync(
      `
      UPDATE goals
      SET title = ?, description = ?, updated_at = ?
      WHERE id = ?;
    `,
      title,
      description,
      updatedAt,
      id,
    )

    const updatedGoal = await this.getGoal(id)

    if (!updatedGoal) {
      throw new Error('Цель не найдена.')
    }

    return updatedGoal
  }

  async pauseGoal(id: string) {
    return this.setGoalStatus(id, 'paused')
  }

  async unpauseGoal(id: string) {
    return this.setGoalStatus(id, 'active')
  }

  async archiveGoal(id: string) {
    return this.setGoalStatus(id, 'archived')
  }

  async deleteGoal(id: string) {
    const existing = await this.getGoal(id)

    if (!existing) {
      throw new Error('Цель не найдена.')
    }

    const database = await getDatabaseAsync()
    await database.runAsync('DELETE FROM goals WHERE id = ?;', id)
  }

  async listCompletions(goalId: string, range?: DateRange) {
    const database = await getDatabaseAsync()
    let rows: CompletionRow[]

    if (range) {
      rows = await database.getAllAsync<CompletionRow>(
        `
          SELECT * FROM goal_completions
          WHERE goal_id = ? AND date BETWEEN ? AND ?
          ORDER BY date DESC;
        `,
        goalId,
        range.start,
        range.end,
      )
    } else {
      rows = await database.getAllAsync<CompletionRow>(
        `
          SELECT * FROM goal_completions
          WHERE goal_id = ?
          ORDER BY date DESC;
        `,
        goalId,
      )
    }

    return rows.map(mapCompletionRow)
  }

  async isCompletedOn(goalId: string, date: LocalDateString) {
    const database = await getDatabaseAsync()
    const row = await database.getFirstAsync<{ id: string }>(
      `
      SELECT id FROM goal_completions
      WHERE goal_id = ? AND date = ?
      LIMIT 1;
    `,
      goalId,
      date,
    )

    return Boolean(row)
  }

  async toggleCompletion(input: ToggleCompletionInput) {
    const database = await getDatabaseAsync()
    let toggledCompletion: GoalCompletion | null = null

    if (Platform.OS === 'web') {
      await database.withTransactionAsync(async () => {
        toggledCompletion = await runToggleCompletionStatements(database, input)
      })

      return toggledCompletion
    }

    await database.withExclusiveTransactionAsync(async (transaction) => {
      toggledCompletion = await runToggleCompletionStatements(transaction, input)
    })

    return toggledCompletion
  }

  async updateCompletionNote(goalId: string, date: LocalDateString, note: string | null) {
    const database = await getDatabaseAsync()
    const existing = await database.getFirstAsync<CompletionRow>(
      `
      SELECT * FROM goal_completions
      WHERE goal_id = ? AND date = ?;
    `,
      goalId,
      date,
    )

    if (!existing) {
      throw new Error('День не отмечен.')
    }

    await database.runAsync(
      'UPDATE goal_completions SET note = ? WHERE id = ?;',
      normalizeNullableText(note),
      existing.id,
    )

    const updated = await database.getFirstAsync<CompletionRow>(
      'SELECT * FROM goal_completions WHERE id = ?;',
      existing.id,
    )

    if (!updated) {
      throw new Error('День не найден.')
    }

    return mapCompletionRow(updated)
  }

  async getGoalStats(goalId: string) {
    const goal = await this.getGoal(goalId)

    if (!goal) {
      throw new Error('Цель не найдена.')
    }

    const completions = await this.listCompletions(goalId)

    return calculateCompletionStats({
      completedDates: completions.map((completion) => completion.date),
      createdAt: goal.createdAt,
      today: getLocalDateString(),
    })
  }

  private async setGoalStatus(id: string, status: GoalStatus) {
    const database = await getDatabaseAsync()
    const now = new Date().toISOString()
    let pausedAt = null
    let archivedAt = null

    if (status === 'paused') {
      pausedAt = now
    }

    if (status === 'archived') {
      archivedAt = now
    }

    await database.runAsync(
      `
      UPDATE goals
      SET status = ?, updated_at = ?, paused_at = ?, archived_at = ?
      WHERE id = ?;
    `,
      status,
      now,
      pausedAt,
      archivedAt,
      id,
    )

    const goal = await this.getGoal(id)

    if (!goal) {
      throw new Error('Цель не найдена.')
    }

    return goal
  }
}

export const goalsRepository: GoalsRepository = new SQLiteGoalsRepository()

function mapGoalRow(row: GoalRow): Goal {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    pausedAt: row.paused_at,
    archivedAt: row.archived_at,
  }
}

function mapCompletionRow(row: CompletionRow): GoalCompletion {
  return {
    id: row.id,
    goalId: row.goal_id,
    date: row.date,
    note: row.note,
    createdAt: row.created_at,
  }
}

function normalizeNullableText(value?: string | null) {
  const normalized = value?.trim()

  return normalized || null
}

async function runToggleCompletionStatements(
  runner: CompletionStatementRunner,
  input: ToggleCompletionInput,
) {
  const deleteResult = await runner.runAsync(
    `
      DELETE FROM goal_completions
      WHERE goal_id = ? AND date = ?;
    `,
    input.goalId,
    input.date,
  )

  if (deleteResult.changes > 0) {
    return null
  }

  const now = new Date().toISOString()
  const completion: GoalCompletion = {
    id: createId('completion'),
    goalId: input.goalId,
    date: input.date,
    note: normalizeNullableText(input.note),
    createdAt: now,
  }

  await runner.runAsync(
    `
      INSERT INTO goal_completions (id, goal_id, date, note, created_at)
      VALUES (?, ?, ?, ?, ?);
    `,
    completion.id,
    completion.goalId,
    completion.date,
    completion.note,
    completion.createdAt,
  )

  return completion
}

function createId(prefix: string) {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`
}
