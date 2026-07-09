/**
 * 每日一诗选定引擎（纯函数，可单测）。
 * 规则：节气显式命中 > 当季 > 短诗兜底；AI 不参与最终决定。
 */

import type { CuratedPoem, DailyPickResult, PoemTheme } from '../types/poem'
import {
  dateSeed,
  formatDateKey,
  getNearestSolarTerm,
  getSeason,
} from './solarTerm'

/** 卡片友好：优先不超过 8 句（词牌可略长） */
const CARD_LINE_SOFT_LIMIT = 10

export interface DailyPickOptions {
  date?: Date
  /** 可选口味：仅作重排加权，不硬过滤到空 */
  preferredThemes?: PoemTheme[]
  preferredAuthors?: string[]
}

function pickStable<T>(items: T[], seed: number): T {
  return items[seed % items.length]
}

function isCardFriendly(poem: CuratedPoem): boolean {
  return poem.content.length <= CARD_LINE_SOFT_LIMIT
}

function scorePoem(
  poem: CuratedPoem,
  opts: {
    termName: string | null
    season: string
    preferredThemes: PoemTheme[]
    preferredAuthors: string[]
  },
): number {
  let score = 0
  if (opts.termName && poem.solarTerms.includes(opts.termName as never)) {
    score += 100
  }
  if (poem.seasons.includes(opts.season as never)) {
    score += 40
  }
  if (isCardFriendly(poem)) {
    score += 15
  }
  if (poem.appreciation) {
    score += 5
  }
  if (opts.preferredAuthors.includes(poem.author)) {
    score += 10
  }
  if (opts.preferredThemes.some((t) => poem.themes.includes(t))) {
    score += 8
  }
  // 略微打散名家垄断：同日种子下仍稳定
  return score
}

function buildReason(
  rank: DailyPickResult['matchRank'],
  poem: CuratedPoem,
  termName: string | null,
  season: string,
): string {
  switch (rank) {
    case 'solarTerm':
      return termName
        ? `今日近${termName}，选《${poem.title}》应节。`
        : `应节而选《${poem.title}》。`
    case 'season':
      return `${season}日读《${poem.title}》，合时令。`
    case 'theme':
      return `按你的口味，今日读《${poem.title}》。`
    default:
      return `今日一诗：《${poem.title}》。`
  }
}

/**
 * 从精校库选定今日诗。
 * 同一 `date` 多次调用结果稳定。
 */
function isDailyEligible(poem: CuratedPoem): boolean {
  return poem.dailyEligible !== false
}

export function pickDailyPoem(
  poems: CuratedPoem[],
  options: DailyPickOptions = {},
): DailyPickResult {
  if (!poems.length) {
    throw new Error('精校诗库为空')
  }

  const date = options.date ?? new Date()
  const seed = dateSeed(date)
  const season = getSeason(date)
  const nearest = getNearestSolarTerm(date)
  const termName = nearest.name
  const preferredThemes = options.preferredThemes ?? []
  const preferredAuthors = options.preferredAuthors ?? []

  const eligible = poems.filter(isDailyEligible)
  const poolSource = eligible.length > 0 ? eligible : poems

  const byTerm = poolSource.filter((p) => p.solarTerms.includes(termName))
  const bySeason = poolSource.filter((p) => p.seasons.includes(season))

  let pool: CuratedPoem[]
  let matchRank: DailyPickResult['matchRank']

  if (byTerm.length > 0) {
    pool = byTerm
    matchRank = 'solarTerm'
  } else if (bySeason.length > 0) {
    pool = bySeason
    matchRank = 'season'
  } else {
    pool = poolSource
    matchRank = 'fallback'
  }

  // 口味只重排，不掏空池
  const ranked = pool
    .map((poem) => ({
      poem,
      score:
        scorePoem(poem, { termName, season, preferredThemes, preferredAuthors }) *
          1000 +
        // 次级稳定扰动，避免同分总选同一首
        ((seed ^ hashId(poem.id)) % 997),
    }))
    .sort((a, b) => b.score - a.score)

  // 在最高分档中用种子选取，保证可解释且稳定
  const topScore = ranked[0].score
  const topBand = ranked.filter((r) => r.score >= topScore - 50).map((r) => r.poem)
  const friendlyBand = topBand.filter(isCardFriendly)
  const finalPool = friendlyBand.length ? friendlyBand : topBand
  const poem = pickStable(finalPool, seed)

  if (
    preferredThemes.length > 0 &&
    preferredThemes.some((t) => poem.themes.includes(t)) &&
    matchRank === 'fallback'
  ) {
    matchRank = 'theme'
  }

  return {
    poem,
    dateKey: formatDateKey(date),
    solarTerm: {
      name: termName,
      isToday: nearest.daysFrom === 0,
      daysUntil: nearest.daysFrom,
    },
    season,
    reason: buildReason(matchRank, poem, termName, season),
    matchRank,
  }
}

function hashId(id: string): number {
  let h = 0
  for (let i = 0; i < id.length; i += 1) {
    h = (h * 31 + id.charCodeAt(i)) >>> 0
  }
  return h
}
