import sharp from 'sharp'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const srcSvg = path.join(__dirname, 'icon-source.svg')
const outDir = path.join(__dirname, '../public/icons')

const sizes = [192, 512]

const run = async () => {
  const fs = await import('fs')
  fs.mkdirSync(outDir, { recursive: true })

  for (const size of sizes) {
    await sharp(srcSvg)
      .resize(size, size)
      .png()
      .toFile(path.join(outDir, `icon-${size}.png`))
    console.log(`written icon-${size}.png`)
  }

  // Maskable version: same square, safe zone already respected by centered design
  await sharp(srcSvg)
    .resize(512, 512)
    .png()
    .toFile(path.join(outDir, 'maskable-icon-512.png'))
  console.log('written maskable-icon-512.png')

  await sharp(srcSvg)
    .resize(180, 180)
    .flatten({ background: '#1A2B4A' })
    .png()
    .toFile(path.join(outDir, 'apple-touch-icon.png'))
  console.log('written apple-touch-icon.png')
}

run()
