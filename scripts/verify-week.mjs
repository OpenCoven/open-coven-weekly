import { readFileSync } from 'node:fs'

import { resolveLatestDeck } from './deck-utils.mjs'

const latestDeck = resolveLatestDeck()

const requiredFiles = [
  latestDeck.relativePath,
  'theme/components/ApiExplorer.vue',
  'theme/styles/index.css',
  'README.md',
]

for (const file of requiredFiles) {
  readFileSync(file, 'utf8')
}

const slides = readFileSync(latestDeck.relativePath, 'utf8')
const explorer = readFileSync('theme/components/ApiExplorer.vue', 'utf8')

if (/\n---\n\s*\n---\n/.test(slides)) {
  throw new Error(`Blank slide separator found in ${latestDeck.relativePath}`)
}

const slideSections = slides.split(/\n(?=---\n(?:theme|layout):)/)

for (const [index, slide] of slideSections.entries()) {
  if (!/<!--[\s\S]*?-->/.test(slide)) {
    throw new Error(`Missing speaker notes in ${latestDeck.relativePath} slide ${index + 1}`)
  }

  const visibleBody = slide
    .replace(/^---[\s\S]*?---\n/, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .trim()

  if (visibleBody.length === 0) {
    throw new Error(`Blank slide body found in ${latestDeck.relativePath} slide ${index + 1}`)
  }
}

const [year, month, day] = latestDeck.date.split('-').map(Number)
const longDate = new Date(Date.UTC(year, month - 1, day, 12)).toLocaleDateString('en-US', {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'UTC',
})

const requiredSlideText = [
  'theme: ../theme',
  'layout: cover',
  'layout: default',
  'discord.gg/opencoven',
]

for (const text of requiredSlideText) {
  if (!slides.includes(text)) {
    throw new Error(`Missing slide text: ${text}`)
  }
}

if (!/^title:\s*.+$/m.test(slides)) {
  throw new Error(`Missing frontmatter title in ${latestDeck.relativePath}`)
}

if (!slides.includes(latestDeck.date) && !slides.includes(longDate)) {
  throw new Error(`Missing latest deck date (${latestDeck.date} or ${longDate}) in ${latestDeck.relativePath}`)
}

if (!slides.includes('<!--') || !slides.includes('-->')) {
  throw new Error(`Missing speaker notes in ${latestDeck.relativePath}`)
}

const requiredEndpoints = [
  '/api/v1/health',
  '/api/v1/capabilities',
  '/api/v1/sessions',
  '/api/v1/events?sessionId=',
  'session_not_live',
]

for (const endpoint of requiredEndpoints) {
  if (!explorer.includes(endpoint)) {
    throw new Error(`Missing API explorer endpoint or error: ${endpoint}`)
  }
}

console.log(`Weekly Open Coven deck checks passed for ${latestDeck.relativePath}.`)
