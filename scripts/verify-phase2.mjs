/**
 * Phase 2 冒烟校验：主题枚举、收藏兼容、工坊隔离。
 */

import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

let errors = 0

function assert(cond, msg) {
  if (!cond) {
    console.error('FAIL', msg)
    errors += 1
  }
}

// --- theme tokens in CSS ---
const css = readFileSync(join(root, 'src/renderer/styles/globals.css'), 'utf-8')
for (const theme of ['spring', 'night', 'plain']) {
  assert(css.includes(`data-theme='${theme}'`) || css.includes(`data-theme="${theme}"`) || css.includes(`[data-theme='${theme}']`), `theme ${theme} in css`)
}
assert(css.includes('--color-paper'), 'css var paper')
assert(css.includes('--color-ink'), 'css var ink')

// --- settings theme type ---
const settingsSrc = readFileSync(join(root, 'src/renderer/types/settings.ts'), 'utf-8')
assert(settingsSrc.includes("'spring' | 'night' | 'plain'"), 'AppThemeId union')

// --- favorites normalize compatibility (logic mirror) ---
function normalizeEntries(raw) {
  if (!Array.isArray(raw)) return []
  const now = new Date().toISOString()
  const entries = []
  for (const item of raw) {
    if (typeof item === 'string') entries.push({ id: item, favoritedAt: now })
    else if (item && typeof item === 'object' && typeof item.id === 'string') {
      entries.push({
        id: item.id,
        favoritedAt: typeof item.favoritedAt === 'string' ? item.favoritedAt : now,
      })
    }
  }
  const seen = new Set()
  return entries.filter((e) => {
    if (seen.has(e.id)) return false
    seen.add(e.id)
    return true
  })
}

const legacy = normalizeEntries(['a', 'b', 'a'])
assert(legacy.length === 2 && legacy[0].id === 'a', 'legacy favorites string[]')
const modern = normalizeEntries([{ id: 'x', favoritedAt: '2026-01-01' }])
assert(modern[0].favoritedAt === '2026-01-01', 'modern favorites entries')

// --- workshop isolation helpers (mirror) ---
function assertWorkshopIsolation(poem) {
  return (
    poem.ai_generated === true &&
    poem.author === 'AI · 新作' &&
    poem.dynasty === '当代' &&
    String(poem.id).startsWith('ai-workshop-')
  )
}

const good = {
  id: 'ai-workshop-test',
  author: 'AI · 新作',
  dynasty: '当代',
  ai_generated: true,
}
const bad = {
  id: '唐-李白-静夜思',
  author: '李白',
  dynasty: '唐',
  ai_generated: false,
}
assert(assertWorkshopIsolation(good), 'workshop good poem')
assert(!assertWorkshopIsolation(bad), 'workshop rejects curated-like poem')

// --- curated poems still free of AI workshop ids ---
const poems = JSON.parse(
  readFileSync(join(root, 'src/renderer/data/poems.curated.json'), 'utf-8'),
)
assert(
  poems.every((p) => !String(p.id).startsWith('ai-workshop-')),
  'curated has no workshop ids',
)
assert(
  poems.every((p) => p.dynasty !== '当代'),
  'curated has no 当代 dynasty',
)

// --- required phase2 modules exist ---
const required = [
  'src/renderer/components/HistoryCalendar.tsx',
  'src/renderer/components/FavoritesPanel.tsx',
  'src/renderer/components/WorkshopPanel.tsx',
  'src/renderer/content/history.ts',
  'src/renderer/services/shareImage.ts',
  'src/renderer/services/ai/workshop.ts',
]
for (const rel of required) {
  try {
    readFileSync(join(root, rel))
  } catch {
    assert(false, `missing ${rel}`)
  }
}

console.log(JSON.stringify({ errors }, null, 2))
if (errors > 0) process.exit(1)
console.log('phase2 ok')
