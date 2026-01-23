#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

let hasErrors = false
const errors = []

// Check if .env.local is tracked by git
try {
  const gitStatus = execSync('git ls-files .env.local 2>nul 2>&1 || echo ""', { encoding: 'utf8' })
  if (gitStatus.trim()) {
    errors.push('❌ ERROR: .env.local is tracked by git!')
    errors.push('   Run: git rm --cached .env.local')
    hasErrors = true
  }
} catch (e) {
  // Git might not be initialized, that's okay
}

// Check for secret patterns in code files
const secretPatterns = [
  { pattern: /sk-[a-zA-Z0-9]{20,}/, name: 'OpenAI API key (sk-...)', exclude: ['.git', 'node_modules', '.next'] },
  { pattern: /OPENAI_API_KEY\s*=\s*['"][^'"]{10,}['"]/, name: 'Hardcoded OPENAI_API_KEY', exclude: ['.git', 'node_modules', '.next', '.env.example'] },
  { pattern: /ADMIN_PASSWORD\s*=\s*['"][^'"]{5,}['"]/, name: 'Hardcoded ADMIN_PASSWORD', exclude: ['.git', 'node_modules', '.next', '.env.example'] },
  { pattern: /NEXT_PUBLIC_OPENAI_API_KEY/, name: 'NEXT_PUBLIC_OPENAI_API_KEY (should not be used)', exclude: ['.git', 'node_modules', '.next'] },
  { pattern: /NEXT_PUBLIC_ADMIN_PASSWORD/, name: 'NEXT_PUBLIC_ADMIN_PASSWORD (should not be used)', exclude: ['.git', 'node_modules', '.next'] },
]

function shouldExclude(filePath, excludes) {
  return excludes.some(exclude => filePath.includes(exclude))
}

function scanDirectory(dir, patterns) {
  const files = fs.readdirSync(dir)
  
  for (const file of files) {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)
    
    if (stat.isDirectory()) {
      if (!shouldExclude(filePath, ['.git', 'node_modules', '.next', 'data'])) {
        scanDirectory(filePath, patterns)
      }
    } else if (stat.isFile() && /\.(js|jsx|ts|tsx|json|md|txt)$/.test(file)) {
      if (!shouldExclude(filePath, ['.git', 'node_modules', '.next', 'data', '.env.example'])) {
        const content = fs.readFileSync(filePath, 'utf8')
        
        for (const { pattern, name, exclude } of patterns) {
          if (!shouldExclude(filePath, exclude)) {
            if (pattern.test(content)) {
              errors.push(`❌ ERROR: Found ${name} in ${filePath}`)
              hasErrors = true
            }
          }
        }
      }
    }
  }
}

// Scan pages directory
if (fs.existsSync('pages')) {
  scanDirectory('pages', secretPatterns)
}

// Scan root directory for config files
const rootFiles = ['next.config.js', 'package.json']
for (const file of rootFiles) {
  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf8')
    for (const { pattern, name, exclude } of secretPatterns) {
      if (!shouldExclude(file, exclude)) {
        if (pattern.test(content)) {
          errors.push(`❌ ERROR: Found ${name} in ${file}`)
          hasErrors = true
        }
      }
    }
  }
}

// Output results
if (hasErrors) {
  console.error('\n🚨 SECURITY CHECK FAILED\n')
  errors.forEach(err => console.error(err))
  console.error('\n⚠️  Do not commit until these issues are fixed!\n')
  process.exit(1)
} else {
  console.log('✅ Security check passed - no secrets found in code')
  process.exit(0)
}
