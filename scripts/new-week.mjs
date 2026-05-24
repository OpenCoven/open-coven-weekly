#!/usr/bin/env node
// scripts/new-week.mjs
// Usage: node scripts/new-week.mjs
// Creates a fresh slide file for the upcoming Sunday from the template.

import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dir = dirname(fileURLToPath(import.meta.url))
const root = join(__dir, '..')

// Next Sunday
const now = new Date()
const day = now.getDay()
const daysUntilSunday = day === 0 ? 7 : 7 - day
const next = new Date(now)
next.setDate(now.getDate() + daysUntilSunday)

const yyyy = next.getFullYear()
const mm = String(next.getMonth() + 1).padStart(2, '0')
const dd = String(next.getDate()).padStart(2, '0')
const dateStr = `${yyyy}-${mm}-${dd}`
const outPath = join(root, 'slides', `${dateStr}.md`)

if (existsSync(outPath)) {
  console.log(`Already exists: slides/${dateStr}.md`)
  process.exit(0)
}

const template = readFileSync(join(root, 'slides', 'template.md'), 'utf-8')
const content = template
  .replace(/\{\{DATE\}\}/g, dateStr)
  .replace(/\{\{MONTH_DAY_YEAR\}\}/g, next.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }))

writeFileSync(outPath, content)
console.log(`Created: slides/${dateStr}.md`)
console.log(`Run: pnpm dev (or npm run dev) to start Slidev`)
