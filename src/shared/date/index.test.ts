import {
  describe,
  expect,
  test,
} from 'bun:test'

import { calculateCompletionStats } from './index'

describe('calculateCompletionStats', () => {
  test('returns zero streaks without completions', () => {
    const stats = calculateCompletionStats({
      completedDates: [],
      createdAt: '2026-04-01T12:00:00.000Z',
      today: '2026-04-30',
    })

    expect(stats.currentStreak).toBe(0)
    expect(stats.bestStreak).toBe(0)
  })

  test('counts consecutive completions ending today', () => {
    const stats = calculateCompletionStats({
      completedDates: ['2026-04-28', '2026-04-29', '2026-04-30'],
      createdAt: '2026-04-01T12:00:00.000Z',
      today: '2026-04-30',
    })

    expect(stats.currentStreak).toBe(3)
    expect(stats.bestStreak).toBe(3)
  })

  test('breaks current streak on a missed day', () => {
    const stats = calculateCompletionStats({
      completedDates: ['2026-04-27', '2026-04-28', '2026-04-30'],
      createdAt: '2026-04-01T12:00:00.000Z',
      today: '2026-04-30',
    })

    expect(stats.currentStreak).toBe(1)
    expect(stats.bestStreak).toBe(2)
  })

  test('preserves current streak when the latest completion was yesterday', () => {
    const stats = calculateCompletionStats({
      completedDates: ['2026-04-27', '2026-04-28', '2026-04-29'],
      createdAt: '2026-04-01T12:00:00.000Z',
      today: '2026-04-30',
    })

    expect(stats.currentStreak).toBe(3)
  })

  test('ignores duplicate same-day completions in calculations', () => {
    const stats = calculateCompletionStats({
      completedDates: ['2026-04-29', '2026-04-29', '2026-04-30'],
      createdAt: '2026-04-01T12:00:00.000Z',
      today: '2026-04-30',
    })

    expect(stats.currentStreak).toBe(2)
    expect(stats.bestStreak).toBe(2)
    expect(stats.currentMonthCompletionCount).toBe(2)
  })

  test('counts current month completions and rate from goal creation date', () => {
    const stats = calculateCompletionStats({
      completedDates: ['2026-03-31', '2026-04-10', '2026-04-12'],
      createdAt: '2026-04-10T12:00:00.000Z',
      today: '2026-04-15',
    })

    expect(stats.currentMonthCompletionCount).toBe(2)
    expect(stats.completionRate).toBe(33)
  })
})
