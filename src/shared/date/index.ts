export type LocalDateString = string

export type DateRange = {
  start: LocalDateString
  end: LocalDateString
}

export const LOCAL_DATE_FORMAT = 'YYYY-MM-DD'

export type CompletionStatsInput = {
  completedDates: LocalDateString[]
  createdAt: string
  today?: LocalDateString
}

export type CompletionStats = {
  currentStreak: number
  bestStreak: number
  currentMonthCompletionCount: number
  completionRate: number
}

export function getLocalDateString(date = new Date()): LocalDateString {
  return formatLocalDateParts(date.getFullYear(), date.getMonth() + 1, date.getDate())
}

export function addLocalDays(date: LocalDateString, days: number): LocalDateString {
  const localDate = parseLocalDate(date)
  localDate.setDate(localDate.getDate() + days)

  return getLocalDateString(localDate)
}

export function calculateCompletionStats({
  completedDates,
  createdAt,
  today = getLocalDateString(),
}: CompletionStatsInput): CompletionStats {
  const uniqueDates = Array.from(new Set(completedDates)).sort()
  const completedDateSet = new Set(uniqueDates)
  const currentMonthStart = getMonthStart(today)
  const activeMonthStart = maxLocalDate(getLocalDateString(new Date(createdAt)), currentMonthStart)
  const currentMonthCompletionCount = uniqueDates.filter(
    (date) => date >= activeMonthStart && date <= today,
  ).length
  let activeDaysInCurrentMonth = 0

  if (activeMonthStart <= today) {
    activeDaysInCurrentMonth = getInclusiveLocalDayCount(activeMonthStart, today)
  }

  let completionRate = 0

  if (activeDaysInCurrentMonth !== 0) {
    completionRate = Math.round((currentMonthCompletionCount / activeDaysInCurrentMonth) * 100)
  }

  return {
    currentStreak: calculateCurrentStreak(completedDateSet, today),
    bestStreak: calculateBestStreak(uniqueDates),
    currentMonthCompletionCount,
    completionRate,
  }
}

function calculateCurrentStreak(completedDateSet: Set<LocalDateString>, today: LocalDateString) {
  let cursor = addLocalDays(today, -1)

  if (completedDateSet.has(today)) {
    cursor = today
  }

  if (!completedDateSet.has(cursor)) {
    return 0
  }

  let streak = 0

  while (completedDateSet.has(cursor)) {
    streak += 1
    cursor = addLocalDays(cursor, -1)
  }

  return streak
}

function calculateBestStreak(uniqueDates: LocalDateString[]) {
  let bestStreak = 0
  let currentStreak = 0
  let previousDate: LocalDateString | null = null

  for (const date of uniqueDates) {
    let nextStreak = 1

    if (previousDate === addLocalDays(date, -1)) {
      nextStreak = currentStreak + 1
    }

    currentStreak = nextStreak
    bestStreak = Math.max(bestStreak, currentStreak)
    previousDate = date
  }

  return bestStreak
}

function getMonthStart(date: LocalDateString): LocalDateString {
  return `${date.slice(0, 7)}-01`
}

function getInclusiveLocalDayCount(start: LocalDateString, end: LocalDateString) {
  const millisecondsPerDay = 24 * 60 * 60 * 1000

  return Math.floor((getUtcDayNumber(end) - getUtcDayNumber(start)) / millisecondsPerDay) + 1
}

function maxLocalDate(first: LocalDateString, second: LocalDateString) {
  if (first > second) {
    return first
  }

  return second
}

function parseLocalDate(date: LocalDateString) {
  const [
    year,
    month,
    day,
  ] = date.split('-').map(Number)

  return new Date(year, month - 1, day)
}

function getUtcDayNumber(date: LocalDateString) {
  const [
    year,
    month,
    day,
  ] = date.split('-').map(Number)

  return Date.UTC(year, month - 1, day)
}

function formatLocalDateParts(year: number, month: number, day: number) {
  return [
    year.toString().padStart(4, '0'),
    month.toString().padStart(2, '0'),
    day.toString().padStart(2, '0'),
  ].join('-')
}
