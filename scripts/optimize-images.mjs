import { createHash } from 'node:crypto'
import { readdir, readFile, rename, stat, unlink, writeFile } from 'node:fs/promises'
import { extname, join } from 'node:path'
import sharp from 'sharp'

const ASSETS_DIR = 'src/assets'
const MAX_SIZE = 800
const IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.webp']
const OPTIMIZED_CACHE_FILE = 'scripts/.optimized-images.json'

async function loadOptimizedCache() {
  try {
    const data = await readFile(OPTIMIZED_CACHE_FILE, 'utf-8')
    return new Set(JSON.parse(data))
  }
  catch {
    return new Set()
  }
}

async function saveOptimizedCache(cache) {
  await writeFile(OPTIMIZED_CACHE_FILE, JSON.stringify([...cache], null, 2))
}

async function getFileHash(filePath) {
  const content = await readFile(filePath)
  return createHash('md5').update(content).digest('hex')
}

async function getImageFiles(dir) {
  const files = []

  async function walk(currentDir) {
    const entries = await readdir(currentDir, { withFileTypes: true })
    for (const entry of entries) {
      const fullPath = join(currentDir, entry.name)
      if (entry.isDirectory()) {
        await walk(fullPath)
      }
      else if (IMAGE_EXTENSIONS.includes(extname(entry.name).toLowerCase())) {
        files.push(fullPath)
      }
    }
  }

  await walk(dir)
  return files
}

async function processImage(filePath, optimizedCache) {
  const ext = extname(filePath).toLowerCase()

  // Check if file was already optimized (by hash)
  const currentHash = await getFileHash(filePath)
  const metadata = await sharp(filePath).metadata()
  const { width, height } = metadata
  const longestSide = Math.max(width, height)
  const needsResize = longestSide > MAX_SIZE

  // Skip only if cached AND doesn't need resize
  if (optimizedCache.has(currentHash) && !needsResize) {
    console.log(`✓ ${filePath} (${width}x${height}) - already optimized (cached)`)
    return { skipped: true, hash: currentHash }
  }

  if (!needsResize && ext !== '.png') {
    console.log(`✓ ${filePath} (${width}x${height}) - already optimized`)
    return { skipped: true, hash: currentHash }
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
  }
  else if (ext === '.jpg' || ext === '.jpeg') {
    pipeline = pipeline.jpeg({ quality: 85, mozjpeg: true })
  }
  else if (ext === '.webp') {
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
      `(${formatBytes(originalSize)} → ${formatBytes(tempStats.size)})`,
    )
    const newHash = await getFileHash(filePath)
    return { processed: true, saved: originalSize - tempStats.size, hash: newHash }
  }
  else {
    await unlink(tempPath)
    console.log(`✓ ${filePath} (${width}x${height}) - keeping original (already optimal)`)
    return { skipped: true, hash: currentHash }
  }
}

function formatBytes(bytes) {
  if (bytes < 1024)
    return `${bytes} B`
  if (bytes < 1024 * 1024)
    return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

async function main() {
  console.log(`\n🖼️  Optimizing images in ${ASSETS_DIR}...\n`)
  console.log(`Max size: ${MAX_SIZE}px (longest side)\n`)

  const optimizedCache = await loadOptimizedCache()
  const newCache = new Set()

  const files = await getImageFiles(ASSETS_DIR)
  let totalSaved = 0
  let processedCount = 0
  let skippedCount = 0

  for (const file of files) {
    try {
      const result = await processImage(file, optimizedCache)
      if (result.hash) {
        newCache.add(result.hash)
      }
      if (result.processed) {
        processedCount++
        totalSaved += result.saved || 0
      }
      else {
        skippedCount++
      }
    }
    catch (err) {
      console.error(`✗ ${file}: ${err.message}`)
    }
  }

  // Save updated cache
  await saveOptimizedCache(newCache)

  console.log(`\n📊 Summary:`)
  console.log(`   Processed: ${processedCount} files`)
  console.log(`   Skipped: ${skippedCount} files`)
  console.log(`   Total saved: ${formatBytes(totalSaved)}`)
}

main().catch(console.error)
