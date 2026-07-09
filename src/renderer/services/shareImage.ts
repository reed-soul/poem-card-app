/**
 * 纯 Canvas 分享长图：不截屏 UI，避免控件入镜。
 * 正文自动缩放，禁止与印章/品牌重叠。
 */

import type { CuratedPoem } from '../types/poem'

export interface ShareThemeColors {
  paper: string
  ink: string
  muted: string
  accent: string
  secondary: string
}

export interface ShareImageInput {
  poem: CuratedPoem
  dateLabel: string
  solarTermLabel?: string | null
  theme: ShareThemeColors
  brand?: string
}

const WIDTH = 1080
const HEIGHT = 1440
/** 正文不得超过此 Y，为印章与品牌留空 */
const CONTENT_MAX_Y = HEIGHT - 320

export const DEFAULT_SHARE_THEME: ShareThemeColors = {
  paper: '#f5f2e8',
  ink: '#1a1a1a',
  muted: '#7a7a7a',
  accent: '#d4af37',
  secondary: '#c8102e',
}

export function readThemeColorsFromDom(): ShareThemeColors {
  if (typeof getComputedStyle === 'undefined' || typeof document === 'undefined') {
    return DEFAULT_SHARE_THEME
  }
  const root = getComputedStyle(document.documentElement)
  const pick = (name: string, fallback: string) =>
    root.getPropertyValue(name).trim() || fallback
  return {
    paper: pick('--color-paper', DEFAULT_SHARE_THEME.paper),
    ink: pick('--color-ink', DEFAULT_SHARE_THEME.ink),
    muted: pick('--color-muted', DEFAULT_SHARE_THEME.muted),
    accent: pick('--color-accent', DEFAULT_SHARE_THEME.accent),
    secondary: pick('--color-secondary', DEFAULT_SHARE_THEME.secondary),
  }
}

function wrapLines(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
): string[] {
  const chars = Array.from(text)
  const lines: string[] = []
  let current = ''
  for (const ch of chars) {
    const trial = current + ch
    if (ctx.measureText(trial).width > maxWidth && current) {
      lines.push(current)
      current = ch
    } else {
      current = trial
    }
  }
  if (current) lines.push(current)
  return lines
}

function measureContentHeight(
  ctx: CanvasRenderingContext2D,
  lines: string[],
  fontSize: number,
  lineHeight: number,
  maxWidth: number,
): number {
  ctx.font = `${fontSize}px "Noto Serif SC", "Songti SC", serif`
  let rows = 0
  for (const line of lines) {
    rows += wrapLines(ctx, line, maxWidth).length
  }
  return rows * lineHeight
}

function fitContentTypography(
  ctx: CanvasRenderingContext2D,
  lines: string[],
  maxWidth: number,
  available: number,
): { fontSize: number; lineHeight: number } {
  let fontSize = 44
  let lineHeight = 78
  while (fontSize >= 26) {
    lineHeight = Math.round(fontSize * 1.75)
    const h = measureContentHeight(ctx, lines, fontSize, lineHeight, maxWidth)
    if (h <= available) return { fontSize, lineHeight }
    fontSize -= 2
  }
  return { fontSize: 26, lineHeight: Math.round(26 * 1.65) }
}

export function renderShareCanvas(input: ShareImageInput): HTMLCanvasElement {
  const {
    poem,
    dateLabel,
    solarTermLabel,
    theme,
    brand = '诗词日历',
  } = input

  const canvas = document.createElement('canvas')
  canvas.width = WIDTH
  canvas.height = HEIGHT
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas 不可用')

  ctx.fillStyle = theme.paper
  ctx.fillRect(0, 0, WIDTH, HEIGHT)

  const glow = ctx.createRadialGradient(220, 180, 40, 220, 180, 420)
  glow.addColorStop(0, `${theme.accent}22`)
  glow.addColorStop(1, `${theme.accent}00`)
  ctx.fillStyle = glow
  ctx.fillRect(0, 0, WIDTH, HEIGHT)

  ctx.strokeStyle = `${theme.ink}18`
  ctx.lineWidth = 2
  ctx.strokeRect(64, 64, WIDTH - 128, HEIGHT - 128)

  ctx.fillStyle = theme.accent
  ctx.font = '28px "Noto Serif SC", "Songti SC", serif'
  ctx.textAlign = 'left'
  if (solarTermLabel) {
    ctx.fillText(solarTermLabel, 120, 160)
  }
  ctx.fillStyle = theme.muted
  ctx.textAlign = 'right'
  ctx.fillText(dateLabel, WIDTH - 120, 160)

  ctx.beginPath()
  ctx.fillStyle = `${theme.secondary}99`
  ctx.arc(WIDTH / 2, 230, 5, 0, Math.PI * 2)
  ctx.fill()

  // 标题过长时缩小
  ctx.fillStyle = theme.ink
  ctx.textAlign = 'center'
  let titleSize = 72
  ctx.font = `bold ${titleSize}px "Noto Serif SC", "Songti SC", serif`
  while (titleSize > 40 && ctx.measureText(poem.title).width > WIDTH - 200) {
    titleSize -= 4
    ctx.font = `bold ${titleSize}px "Noto Serif SC", "Songti SC", serif`
  }
  ctx.fillText(poem.title, WIDTH / 2, 340)

  ctx.fillStyle = theme.muted
  ctx.font = '32px "Noto Serif SC", "Songti SC", serif'
  const meta = [poem.dynasty, poem.author].filter(Boolean).join(' · ')
  ctx.fillText(meta, WIDTH / 2, 410)

  const contentTop = 500
  const maxContentWidth = WIDTH - 240
  const available = CONTENT_MAX_Y - contentTop
  const { fontSize, lineHeight } = fitContentTypography(
    ctx,
    poem.content,
    maxContentWidth,
    available,
  )

  ctx.fillStyle = theme.ink
  ctx.font = `${fontSize}px "Noto Serif SC", "Songti SC", serif`
  let y = contentTop
  for (const line of poem.content) {
    const wrapped = wrapLines(ctx, line, maxContentWidth)
    for (const w of wrapped) {
      if (y > CONTENT_MAX_Y) break
      ctx.fillText(w, WIDTH / 2, y)
      y += lineHeight
    }
    if (y > CONTENT_MAX_Y) break
  }

  const sealX = WIDTH - 200
  const sealY = HEIGHT - 260
  ctx.save()
  ctx.translate(sealX, sealY)
  ctx.rotate((12 * Math.PI) / 180)
  ctx.strokeStyle = theme.secondary
  ctx.lineWidth = 4
  ctx.strokeRect(-36, -36, 72, 72)
  ctx.strokeRect(-28, -28, 56, 56)
  ctx.fillStyle = theme.secondary
  ctx.font = 'bold 22px "Noto Serif SC", serif'
  ctx.textAlign = 'center'
  ctx.fillText('诗', 0, -4)
  ctx.fillText('韵', 0, 24)
  ctx.restore()

  ctx.fillStyle = theme.muted
  ctx.font = '24px "Noto Serif SC", serif'
  ctx.textAlign = 'center'
  ctx.fillText(brand, WIDTH / 2, HEIGHT - 100)

  return canvas
}

async function waitForFonts(): Promise<void> {
  try {
    if (typeof document !== 'undefined' && document.fonts?.ready) {
      await document.fonts.ready
    }
  } catch {
    // ignore
  }
}

export function buildPoemPlainText(input: {
  poem: CuratedPoem
  dateLabel: string
  solarTermLabel?: string | null
}): string {
  const { poem, dateLabel, solarTermLabel } = input
  const header = [dateLabel, solarTermLabel].filter(Boolean).join(' · ')
  const meta = [poem.dynasty, poem.author].filter(Boolean).join(' · ')
  return [
    header,
    `《${poem.title}》`,
    meta,
    '',
    ...poem.content,
    '',
    '—— 诗词日历',
  ]
    .filter((line, i, arr) => !(line === '' && arr[i - 1] === ''))
    .join('\n')
}

export async function copyPoemText(input: {
  poem: CuratedPoem
  dateLabel: string
  solarTermLabel?: string | null
}): Promise<void> {
  const text = buildPoemPlainText(input)
  if (!navigator.clipboard?.writeText) {
    throw new Error('当前环境不支持复制到剪贴板')
  }
  await navigator.clipboard.writeText(text)
}

export async function downloadShareImage(input: ShareImageInput): Promise<void> {
  await waitForFonts()
  const canvas = renderShareCanvas(input)
  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob((b) => resolve(b), 'image/png'),
  )
  if (!blob) throw new Error('导出失败')

  const filename = `${input.poem.title}-${input.dateLabel}.png`.replace(
    /[\\/:*?"<>|]/g,
    '_',
  )
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}
