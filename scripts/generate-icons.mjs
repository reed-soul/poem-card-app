/**
 * 生成应用图标：极简朱红印章「诗」字。
 * 产出 build/icon.png (1024) + build/icon.ico
 * mac 优先用 icon.png（electron-builder 可接受）；若本机有 iconutil 可另转 icns。
 */

import { mkdirSync, writeFileSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { execSync } from 'node:child_process'
import sharp from 'sharp'
import pngToIco from 'png-to-ico'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const outDir = join(root, 'build')

function sealSvg(size) {
  const stroke = Math.max(8, Math.round(size * 0.035))
  const inset = Math.round(size * 0.12)
  const fontSize = Math.round(size * 0.48)
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${Math.round(size * 0.18)}" fill="#f5f2e8"/>
  <rect x="${inset}" y="${inset}" width="${size - inset * 2}" height="${size - inset * 2}"
        rx="${Math.round(size * 0.08)}" fill="none" stroke="#c8102e" stroke-width="${stroke * 1.4}"/>
  <rect x="${inset + stroke * 1.6}" y="${inset + stroke * 1.6}"
        width="${size - inset * 2 - stroke * 3.2}" height="${size - inset * 2 - stroke * 3.2}"
        rx="${Math.round(size * 0.05)}" fill="none" stroke="#c8102e" stroke-width="${stroke * 0.7}"/>
  <text x="50%" y="54%" text-anchor="middle" dominant-baseline="middle"
        font-family="Noto Serif SC, Songti SC, STSong, serif"
        font-size="${fontSize}" font-weight="700" fill="#c8102e">诗</text>
</svg>`
}

async function main() {
  mkdirSync(outDir, { recursive: true })

  const svg1024 = Buffer.from(sealSvg(1024))
  const png1024Path = join(outDir, 'icon.png')
  await sharp(svg1024).png().toFile(png1024Path)

  // multi-size pngs for ico
  const sizes = [16, 32, 48, 64, 128, 256]
  const pngBuffers = []
  for (const size of sizes) {
    const buf = await sharp(Buffer.from(sealSvg(size))).png().toBuffer()
    const p = join(outDir, `icon-${size}.png`)
    writeFileSync(p, buf)
    pngBuffers.push(buf)
  }

  const ico = await pngToIco(pngBuffers)
  writeFileSync(join(outDir, 'icon.ico'), ico)

  // Try mac icns via iconutil if available
  const icnsPath = join(outDir, 'icon.icns')
  try {
    execSync('which iconutil', { stdio: 'ignore' })
    const iconset = join(outDir, 'icon.iconset')
    mkdirSync(iconset, { recursive: true })
    const map = [
      [16, 'icon_16x16.png'],
      [32, 'diana.k@example.org'],
      [32, 'icon_32x32.png'],
      [64, 'ivan.p@example.net'],
      [128, 'icon_128x128.png'],
      [256, 'wendy.h@example.net'],
      [256, 'icon_256x256.png'],
      [512, 'wendy.h@example.net'],
      [512, 'icon_512x512.png'],
      [1024, 'alice.j@example.com'],
    ]
    for (const [size, name] of map) {
      await sharp(Buffer.from(sealSvg(size)))
        .png()
        .toFile(join(iconset, name))
    }
    execSync(`iconutil -c icns "${iconset}" -o "${icnsPath}"`, { stdio: 'inherit' })
    console.log('wrote', icnsPath)
  } catch {
    // Fallback: copy png as documented mac icon source
    console.log('iconutil unavailable; mac will use build/icon.png')
  }

  console.log('wrote', png1024Path)
  console.log('wrote', join(outDir, 'icon.ico'))
  console.log('exists icns', existsSync(icnsPath))
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
