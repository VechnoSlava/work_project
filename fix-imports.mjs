import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs'
import { resolve, dirname, relative, join } from 'path'

const SRC_ROOT = resolve('./src')

function getAllFiles(dir, exts = ['.ts', '.tsx']) {
  const results = []
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) {
      results.push(...getAllFiles(full, exts))
    } else if (exts.some(e => full.endsWith(e))) {
      results.push(full)
    }
  }
  return results
}

const files = getAllFiles(SRC_ROOT)
let totalReplaced = 0

for (const file of files) {
  const fileDir = dirname(file)
  const content = readFileSync(file, 'utf-8')
  
  let updated = content
  let fileReplaced = 0

  updated = updated.replace(/from '(\.\.[^']+)'/g, (match, importPath) => {
    const absoluteImportPath = resolve(fileDir, importPath)
    
    if (!absoluteImportPath.startsWith(SRC_ROOT)) return match
    
    const upCount = (importPath.match(/\.\.\//g) || []).length
    
    if (upCount >= 2) {
      const relFromSrc = relative(SRC_ROOT, absoluteImportPath).replace(/\\/g, '/')
      fileReplaced++
      return `from '@/${relFromSrc}'`
    }
    
    return match
  })

  if (fileReplaced > 0) {
    writeFileSync(file, updated, 'utf-8')
    console.log(`✅ ${relative('.', file)} — замен: ${fileReplaced}`)
    totalReplaced += fileReplaced
  }
}

console.log(`\nИтого замен: ${totalReplaced}`)
