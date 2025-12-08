import { readdir, rename, stat, unlink } from 'node:fs/promises'
import { extname, join } from 'node:path'
import sharp from 'sharp'

const ASSETS_DIR = 'src/assets'
const MAX_SIZE = 800
const IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.webp']

async function getImageFiles(dir) {
  const files = []

  async function walk(currentDir) {
    const entries = await readdir(currentDir, { withFileTypes: true })
    for (const entry of entries) {
      const fullPath = join(currentDir, entry.name)
      if (entry.isDirectory()) {
        await walk(fullPath)
      } else if (IMAGE_EXTENSIONS.includes(extname(entry.name).toLowerCase())) {
        files.push(fullPath)
      }
    }
  }

  await walk(dir)
  return files
}

async function processImage(filePath) {
  const ext = extname(filePath).toLowerCase()
  const image = sharp(filePath)
  const metadata = await image.metadata()
  const { width, height } = metadata

  const longestSide = Math.max(width, height)
  const needsResize = longestSide > MAX_SIZE

  if (!needsResize && ext !== '.png') {
    console.log(`✓ ${filePath} (${width}x${height}) - already optimized`)
    return { skipped: true }
  }

  const originalStats = await stat(filePath)
  const originalSize = originalStats.size

  let pipeline = sharp(filePath)

  // Resize if needed
  if (needsResize) {
    pipeline = pipeline.resize({
      width: width > height ? MAX_SIZE : undefined,
      height: height >= width ? MAX_SIZE : undefined,
      fit: 'inside',
      withoutEnlargement: true,
    })
  }

  // Apply format-specific optimization
  if (ext === '.png') {
    pipeline = pipeline.png({
      compressionLevel: 9,
      palette: true,
      quality: 80,
      effort: 10,
    })
  } else if (ext === '.jpg' || ext === '.jpeg') {
    pipeline = pipeline.jpeg({ quality: 85, mozjpeg: true })
  } else if (ext === '.webp') {
    pipeline = pipeline.webp({ quality: 85, effort: 6 })
  }

  // Write to temp file first to check actual size
  const tempPath = `${filePath}.tmp`
  await pipeline.toFile(tempPath)
  const tempStats = await stat(tempPath)
  const isSmaller = tempStats.size < originalSize

  // Only keep if: resize was needed, OR optimization made it smaller
  if (needsResize || isSmaller) {
    await unlink(filePath)
    await rename(tempPath, filePath)
    const newMetadata = await sharp(filePath).metadata()
    const savings = ((originalSize - tempStats.size) / originalSize * 100).toFixed(1)

    const sizeInfo = needsResize
      ? `(${width}x${height} → ${newMetadata.width}x${newMetadata.height})`
      : ''
    console.log(
      `✓ ${filePath}`,
      sizeInfo,
      `saved ${savings}%`,
      `(${formatBytes(originalSize)} → ${formatBytes(tempStats.size)})`
    )
    return { processed: true, saved: originalSize - tempStats.size }
  } else {
    await unlink(tempPath)
    console.log(`✓ ${filePath} (${width}x${height}) - keeping original (already optimal)`)
    return { skipped: true }
  }
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

async function main() {
  console.log(`\n🖼️  Optimizing images in ${ASSETS_DIR}...\n`)
  console.log(`Max size: ${MAX_SIZE}px (longest side)\n`)

  const files = await getImageFiles(ASSETS_DIR)
  let totalSaved = 0
  let processedCount = 0
  let skippedCount = 0

  for (const file of files) {
    try {
      const result = await processImage(file)
      if (result.processed) {
        processedCount++
        totalSaved += result.saved || 0
      } else {
        skippedCount++
      }
    } catch (err) {
      console.error(`✗ ${file}: ${err.message}`)
    }
  }

  console.log(`\n📊 Summary:`)
  console.log(`   Processed: ${processedCount} files`)
  console.log(`   Skipped: ${skippedCount} files`)
  console.log(`   Total saved: ${formatBytes(totalSaved)}`)
}

main().catch(console.error)
