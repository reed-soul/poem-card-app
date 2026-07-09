/**
 * 收藏：本地持久化，Phase 1 只做加减与列表。
 */

const FAVORITES_KEY = 'poem-favorites-v1'

export function loadFavorites(): string[] {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === 'string') : []
  } catch {
    return []
  }
}

export function saveFavorites(ids: string[]): void {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(ids))
}

export function toggleFavorite(poemId: string): string[] {
  const current = loadFavorites()
  const next = current.includes(poemId)
    ? current.filter((id) => id !== poemId)
    : [...current, poemId]
  saveFavorites(next)
  return next
}

export function isFavorite(poemId: string): boolean {
  return loadFavorites().includes(poemId)
}
