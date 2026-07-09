/**
 * Phase 1 内容与引擎冒烟校验（不依赖测试框架）。
 * 用法：pnpm exec tsx scripts/verify-phase1.ts
 * 或：node --experimental-strip-types（若可用）
 */

import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

const poems = JSON.parse(
  readFileSync(join(root, 'src/renderer/data/poems.curated.json'), 'utf-8'),
)

const REQUIRED = ['id', 'title', 'author', 'dynasty', 'content', 'form', 'themes', 'seasons', 'solarTerms', 'appreciation']
const VALID_TERMS = new Set([
  '立春', '雨水', '惊蛰', '春分', '清明', '谷雨',
  '立夏', '小满', '芒种', '夏至', '小暑', '大暑',
  '立秋', '处暑', '白露', '秋分', '寒露', '霜降',
  '立冬', '小雪', '大雪', '冬至', '小寒', '大寒',
])

let errors = 0
const ids = new Set()

for (const poem of poems) {
  for (const key of REQUIRED) {
    if (poem[key] === undefined || poem[key] === null) {
      console.error('missing', key, poem.title)
      errors += 1
    }
  }
  if (!Array.isArray(poem.content) || poem.content.length === 0) {
    console.error('bad content', poem.title)
    errors += 1
  }
  if (ids.has(poem.id)) {
    console.error('dup id', poem.id)
    errors += 1
  }
  ids.add(poem.id)
  for (const t of poem.solarTerms || []) {
    if (!VALID_TERMS.has(t)) {
      console.error('bad solar term', poem.title, t)
      errors += 1
    }
  }
}

// Author distribution sanity
const authors = {}
for (const p of poems) {
  authors[p.author] = (authors[p.author] || 0) + 1
}
const top = Object.entries(authors).sort((a, b) => b[1] - a[1])[0]
if (top[1] > poems.length * 0.2) {
  console.error('author monopoly', top)
  errors += 1
}

console.log(JSON.stringify({
  count: poems.length,
  uniqueIds: ids.size,
  topAuthor: top,
  withSolarTerms: poems.filter((p) => p.solarTerms.length).length,
  errors,
}, null, 2))

if (errors > 0) process.exit(1)
console.log('phase1 content ok')
