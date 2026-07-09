/**
 * 产品可信度冒烟：P0 内容断言 + 图标文件存在。
 */

import { existsSync, readFileSync } from 'node:fs'
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

const poems = JSON.parse(
  readFileSync(join(root, 'src/renderer/data/poems.curated.json'), 'utf-8'),
)

assert(!poems.some((p) => p.title === '湖心亭看雪'), 'prose 湖心亭看雪 removed')
assert(
  poems.some((p) => p.title === '木兰诗（节选）' && p.excerpt === true),
  '木兰诗 marked excerpt',
)
assert(!poems.some((p) => p.title === '木兰诗'), 'bare 木兰诗 gone')

const qy = poems.find((p) => p.title.includes('青玉案'))
assert(qy && Array.isArray(qy.solarTerms) && qy.solarTerms.length === 0, '青玉案 no 立春')

const minong1 = poems.find((p) => p.title === '悯农二首其一')
const minong2 = poems.find((p) => p.title === '悯农二首其二')
assert(minong1?.content?.[0]?.startsWith('春种'), '悯农其一 = 春种')
assert(minong2?.content?.[0]?.startsWith('锄禾'), '悯农其二 = 锄禾')

assert(
  poems.some((p) => p.title === '宣州谢朓楼饯别校书叔云'),
  '谢朓 spelling',
)
assert(
  !poems.some((p) => p.title.includes('谢脁')),
  'no 谢脁',
)

const shortSong = poems.find((p) => p.title === '短歌行')
assert(
  shortSong?.content?.some((l) => l.includes('谈宴')) &&
    !shortSong?.content?.some((l) => l.includes('谈讌')),
  '短歌行 谈宴',
)

const ineligible = poems.filter((p) => p.dailyEligible === false)
assert(ineligible.length >= 10, 'has dailyEligible false long poems')
assert(
  ineligible.every((p) => p.id && p.title),
  'ineligible poems have id/title',
)

// duplicate bare titles among daily-eligible short ci should be reduced
const bareDupes = ['浣溪沙', '蝶恋花', '浪淘沙']
for (const t of bareDupes) {
  assert(
    !poems.some((p) => p.title === t),
    `bare title disambiguated: ${t}`,
  )
}

assert(existsSync(join(root, 'build/icon.png')), 'build/icon.png')
assert(existsSync(join(root, 'build/icon.ico')), 'build/icon.ico')

const builder = JSON.parse(
  readFileSync(join(root, 'electron-builder.json'), 'utf-8'),
)
assert(builder.mac?.icon?.includes('build/icon'), 'mac icon path')
assert(builder.win?.icon?.includes('build/icon.ico'), 'win icon path')

console.log(
  JSON.stringify(
    {
      poemCount: poems.length,
      dailyIneligible: ineligible.length,
      errors,
    },
    null,
    2,
  ),
)
if (errors > 0) process.exit(1)
console.log('credibility ok')
