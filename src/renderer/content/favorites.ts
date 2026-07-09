/**
 * 收藏：兼容旧版纯 string[]，新版带 favoritedAt。
 */

import { getPoemById } from './poems'
import type { CuratedPoem } from '../types/poem'

const FAVORITES_KEY = 'poem-favorites-v1'

export interface FavoriteEntry {
  id: string
  favoritedAt: string
}

function normalizeEntries(raw: unknown): FavoriteEntry[] {
  if (!Array.isArray(raw)) return []
  const now = new Date().toISOString()
  const entries: FavoriteEntry[] = []
  for (const item of raw) {
    if (typeof item === 'string') {
      entries.push({ id: item, favoritedAt: now })
      continue
    }
    if (
      item &&
      typeof item === 'object' &&
      typeof (item as FavoriteEntry).id === 'string'
    ) {
      entries.push({
        id: (item as FavoriteEntry).id,
        favoritedAt:
          typeof (item as FavoriteEntry).favoritedAt === 'string'
            ? (item as FavoriteEntry).favoritedAt
            : now,
      })
    }
  }
  // 去重，保留首次（较新在前的策略由调用方保证）
  const seen = new Set<string>()
  return entries.filter((e) => {
    if (seen.has(e.id)) return false
    seen.add(e.id)
    return true
  })
}

export function loadFavoriteEntries(): FavoriteEntry[] {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY)
    if (!raw) return []
    return normalizeEntries(JSON.parse(raw))
  } catch {
    return []
  }
}

export function loadFavorites(): string[] {
  return loadFavoriteEntries().map((e) => e.id)
}

export function saveFavoriteEntries(entries: FavoriteEntry[]): void {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(entries))
}

export function toggleFavorite(poemId: string): string[] {
  const current = loadFavoriteEntries()
  const exists = current.some((e) => e.id === poemId)
  const next = exists
    ? current.filter((e) => e.id !== poemId)
    : [{ id: poemId, favoritedAt: new Date().toISOString() }, ...current]
  saveFavoriteEntries(next)
  return next.map((e) => e.id)
}

export function isFavorite(poemId: string): boolean {
  return loadFavoriteEntries().some((e) => e.id === poemId)
}

export function listFavoritePoems(): Array<CuratedPoem & { favoritedAt: string }> {
  return loadFavoriteEntries()
    .map((entry) => {
      const poem = getPoemById(entry.id)
      if (!poem) return null
      return { ...poem, favoritedAt: entry.favoritedAt }
    })
    .filter((p): p is CuratedPoem & { favoritedAt: string } => p !== null)
}
