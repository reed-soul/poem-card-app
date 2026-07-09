/**
 * 二十四节气计算（1900–2100 常用寿星近似公式）。
 * 精度约 ±1 日，满足「今日/近日节气」产品需求。
 */

import type { Season, SolarTermName } from '../types/poem'

export interface SolarTermOccurrence {
  name: SolarTermName
  date: Date
  /** 相对基准日的整天差：0=当天，负=已过，正=未到 */
  daysFrom: number
}

const TERM_NAMES: SolarTermName[] = [
  '小寒', '大寒', '立春', '雨水', '惊蛰', '春分',
  '清明', '谷雨', '立夏', '小满', '芒种', '夏至',
  '小暑', '大暑', '立秋', '处暑', '白露', '秋分',
  '寒露', '霜降', '立冬', '小雪', '大雪', '冬至',
]

/**
 * 20/21 世纪节气 C 值（对应 TERM_NAMES 顺序）。
 * 参考寿星天文历常用表。
 */
const C_20: number[] = [
  6.11, 20.84, 4.6295, 19.4599, 6.3826, 21.4155,
  5.59, 20.888, 6.318, 21.86, 6.5, 22.2,
  7.928, 23.65, 8.35, 23.95, 8.44, 23.822,
  9.098, 24.218, 8.218, 23.08, 7.9, 22.6,
]

const C_21: number[] = [
  5.4055, 20.12, 3.87, 18.73, 5.63, 20.646,
  4.81, 20.1, 5.52, 21.04, 5.678, 21.37,
  7.108, 22.83, 7.5, 23.13, 7.646, 23.042,
  8.318, 23.438, 7.438, 22.36, 7.18, 21.94,
]

function leapCorrection(year: number): number {
  // [Y/4] 修正；闰年 2 月后节气需额外处理，寿星公式用 L
  return Math.floor(year % 100 / 4)
}

/**
 * 计算某年某节气的公历日期（本地日历日）。
 * @param termIndex 0=小寒 … 23=冬至
 */
export function getTermDate(year: number, termIndex: number): Date {
  const Y = year % 100
  // 1900–1999 用 C_20；2000–2099 用 C_21
  const C = year < 2000 ? C_20[termIndex] : C_21[termIndex]
  const L = leapCorrection(year)

  // 1–6 号（小寒→春分）落在 1–3 月；其后按序推月
  // 通用：[Y*0.2422+C]-L ，再映射到月日
  let day = Math.floor(Y * 0.2422 + C) - L

  // 节气所在月份（寿星表顺序）
  const months = [
    1, 1, 2, 2, 3, 3,
    4, 4, 5, 5, 6, 6,
    7, 7, 8, 8, 9, 9,
    10, 10, 11, 11, 12, 12,
  ]

  // 小寒、大寒的 Y 特殊：部分资料对 1 月节气用 Y=年%100，
  // 且对 2080 等例外年有修正；此处覆盖常见年即可。
  if (termIndex === 0 && year === 2019) day = 5
  if (termIndex === 1 && year === 2082) day = 20

  return new Date(year, months[termIndex] - 1, day)
}

function startOfLocalDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

function diffDays(a: Date, b: Date): number {
  return Math.round(
    (startOfLocalDay(a).getTime() - startOfLocalDay(b).getTime()) / 86400000,
  )
}

/** 获取某公历年全部 24 节气 */
export function getSolarTermsForYear(year: number): SolarTermOccurrence[] {
  return TERM_NAMES.map((name, index) => ({
    name,
    date: getTermDate(year, index),
    daysFrom: 0,
  }))
}

/**
 * 最近节气：当天优先；否则在「已过 ≤3 天 / 未来 ≤7 天」中取更近；
 * 再否则取绝对距离最小。
 */
export function getNearestSolarTerm(date: Date = new Date()): SolarTermOccurrence {
  const year = date.getFullYear()
  const candidates = [
    ...getSolarTermsForYear(year - 1),
    ...getSolarTermsForYear(year),
    ...getSolarTermsForYear(year + 1),
  ].map((term) => ({
    ...term,
    daysFrom: diffDays(term.date, date),
  }))

  const today = candidates.find((t) => t.daysFrom === 0)
  if (today) return today

  const nearFuture = candidates
    .filter((t) => t.daysFrom > 0 && t.daysFrom <= 7)
    .sort((a, b) => a.daysFrom - b.daysFrom)
  const nearPast = candidates
    .filter((t) => t.daysFrom < 0 && t.daysFrom >= -3)
    .sort((a, b) => b.daysFrom - a.daysFrom)

  if (nearFuture.length && nearPast.length) {
    return Math.abs(nearPast[0].daysFrom) <= nearFuture[0].daysFrom
      ? nearPast[0]
      : nearFuture[0]
  }
  if (nearFuture.length) return nearFuture[0]
  if (nearPast.length) return nearPast[0]

  return candidates
    .slice()
    .sort((a, b) => Math.abs(a.daysFrom) - Math.abs(b.daysFrom))[0]
}

export function getSeason(date: Date = new Date()): Season {
  const month = date.getMonth() + 1
  if (month >= 3 && month <= 5) return '春'
  if (month >= 6 && month <= 8) return '夏'
  if (month >= 9 && month <= 11) return '秋'
  return '冬'
}

export function formatDateKey(date: Date = new Date()): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/** 稳定日期种子：同一天同一结果 */
export function dateSeed(date: Date = new Date()): number {
  const key = formatDateKey(date)
  let hash = 2166136261
  for (let i = 0; i < key.length; i += 1) {
    hash ^= key.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

export const SOLAR_TERM_NAMES = TERM_NAMES
