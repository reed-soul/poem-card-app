import type { CuratedPoem } from '../types/poem'
import curated from '../data/poems.curated.json'

export const curatedPoems = curated as CuratedPoem[]

export function getPoemById(id: string): CuratedPoem | undefined {
  return curatedPoems.find((p) => p.id === id)
}
