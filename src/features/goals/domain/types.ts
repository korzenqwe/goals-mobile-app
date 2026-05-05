import type {
  LocalDateString,
} from '@/shared/date'

export type ISODateTimeString = string

export type GoalStatus = 'active' | 'paused' | 'archived'

export type Goal = {
  id: string
  title: string
  description: string | null
  status: GoalStatus
  createdAt: ISODateTimeString
  updatedAt: ISODateTimeString
  pausedAt: ISODateTimeString | null
  archivedAt: ISODateTimeString | null
}

export type GoalCompletion = {
  id: string
  goalId: string
  date: LocalDateString
  note: string | null
  createdAt: ISODateTimeString
}

export type GoalStats = {
  currentStreak: number
  bestStreak: number
  currentMonthCompletionCount: number
  completionRate: number
}

export type GoalViewModel = {
  goal: Goal
  stats: GoalStats
  isCompletedToday: boolean
}

export type CreateGoalInput = {
  title: string
  description?: string | null
}

export type UpdateGoalInput = Partial<CreateGoalInput>

export type ToggleCompletionInput = {
  goalId: string
  date: LocalDateString
  note?: string | null
}
