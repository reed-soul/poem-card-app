/**
 * 浏览历史：记录看过的日期（轻量，无账号）。
 */

import { formatDateKey } from '../engine/solarTerm'

const HISTORY_KEY = 'poem-viewed-dates-v1'
const MAX_ENTRIES = 400

export function loadViewedDates(): string[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed)
      ? parsed.filter((x): x is string => typeof x === 'string')
      : []
  } catch {
    return []
  }
}

export function markDateViewed(date: Date | string): string[] {
  const key = typeof date === 'string' ? date : formatDateKey(date)
  const current = loadViewedDates()
  if (current[0] === key) return current
  const next = [key, ...current.filter((d) => d !== key)].slice(0, MAX_ENTRIES)
  localStorage.setItem(HISTORY_KEY, JSON.stringify(next))
  return next
}

export function isDateViewed(date: Date | string): boolean {
  const key = typeof date === 'string' ? date : formatDateKey(date)
  return loadViewedDates().includes(key)
}

export function startOfDay(date: Date = new Date()): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

export function isSameDay(a: Date, b: Date): boolean {
  return formatDateKey(a) === formatDateKey(b)
}
