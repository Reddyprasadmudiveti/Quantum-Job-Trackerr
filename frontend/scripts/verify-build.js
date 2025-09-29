#!/usr/bin/env node

import { existsSync, statSync, readdirSync } from 'fs'
import { join, extname } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const DIST_DIR = join(__dirname, '..', 'dist')
const REQUIRED_FILES = ['index.html']
const REQUIRED_DIRS = ['assets']

console.log('🔍 Verifying frontend build...')

// Check if dist directory exists
if (!existsSync(DIST_DIR)) {
  console.error('❌ Build verification failed: dist directory not found')
  process.exit(1)
}

console.log('✅ dist directory exists')

// Check required files
for (const file of REQUIRED_FILES) {
  const filePath = join(DIST_DIR, file)
  if (!existsSync(filePath)) {
    console.error(`❌ Build verification failed: ${file} not found`)
    process.exit(1)
  }
  console.log(`✅ ${file} exists`)
}

// Check required directories
for (const dir of REQUIRED_DIRS) {
  const dirPath = join(DIST_DIR, dir)
  if (!existsSync(dirPath)) {
    console.error(`❌ Build verification failed: ${dir} directory not found`)
    process.exit(1)
  }
  console.log(`✅ ${dir} directory exists`)
}

// Analyze build output
const analyzeDirectory = (dirPath, prefix = '') => {
  const items = readdirSync(dirPath)
  const stats = {
    jsFiles: 0,
    cssFiles: 0,
    imageFiles: 0,
    otherFiles: 0,
    totalSize: 0
  }

  for (const item of items) {
    const itemPath = join(dirPath, item)
    const stat = statSync(itemPath)

    if (stat.isDirectory()) {
      const subStats = analyzeDirectory(itemPath, `${prefix}${item}/`)
      stats.jsFiles += subStats.jsFiles
      stats.cssFiles += subStats.cssFiles
      stats.imageFiles += subStats.imageFiles
      stats.otherFiles += subStats.otherFiles
      stats.totalSize += subStats.totalSize
    } else {
      const ext = extname(item).toLowerCase()
      const size = stat.size
      stats.totalSize += size

      if (ext === '.js') {
        stats.jsFiles++
        console.log(`📄 JS: ${prefix}${item} (${formatBytes(size)})`)
      } else if (ext === '.css') {
        stats.cssFiles++
        console.log(`🎨 CSS: ${prefix}${item} (${formatBytes(size)})`)
      } else if (['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp'].includes(ext)) {
        stats.imageFiles++
        console.log(`🖼️  Image: ${prefix}${item} (${formatBytes(size)})`)
      } else {
        stats.otherFiles++
        console.log(`📁 Other: ${prefix}${item} (${formatBytes(size)})`)
      }
    }
  }

  return stats
}

const formatBytes = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

console.log('\n📊 Build Analysis:')
const stats = analyzeDirectory(DIST_DIR)

console.log('\n📈 Summary:')
console.log(`   JavaScript files: ${stats.jsFiles}`)
console.log(`   CSS files: ${stats.cssFiles}`)
console.log(`   Image files: ${stats.imageFiles}`)
console.log(`   Other files: ${stats.otherFiles}`)
console.log(`   Total size: ${formatBytes(stats.totalSize)}`)

// Check for potential issues
const warnings = []

if (stats.totalSize > 5 * 1024 * 1024) { // 5MB
  warnings.push(`Large bundle size: ${formatBytes(stats.totalSize)} (consider code splitting)`)
}

if (stats.jsFiles > 10) {
  warnings.push(`Many JS files: ${stats.jsFiles} (consider chunk optimization)`)
}

if (warnings.length > 0) {
  console.log('\n⚠️  Warnings:')
  warnings.forEach(warning => console.log(`   ${warning}`))
}

// Verify index.html contains proper asset references
import { readFileSync } from 'fs'

const indexPath = join(DIST_DIR, 'index.html')
const indexContent = readFileSync(indexPath, 'utf-8')

const hasJsReference = indexContent.includes('.js')
const hasCssReference = indexContent.includes('.css')

if (!hasJsReference) {
  console.error('❌ Build verification failed: index.html missing JavaScript references')
  process.exit(1)
}

if (!hasCssReference) {
  console.log('⚠️  Warning: index.html missing CSS references (might be inlined)')
}

console.log('✅ index.html contains proper asset references')

console.log('\n🎉 Build verification completed successfully!')
console.log(`📦 Build ready for deployment (${formatBytes(stats.totalSize)})`)