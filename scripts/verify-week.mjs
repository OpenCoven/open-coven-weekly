import { readFileSync } from 'node:fs'

const requiredFiles = [
  'slides/2026-05-24.md',
  'theme/components/ApiExplorer.vue',
  'theme/styles/index.css',
  'README.md',
]

for (const file of requiredFiles) {
  readFileSync(file, 'utf8')
}

const slides = readFileSync('slides/2026-05-24.md', 'utf8')
const explorer = readFileSync('theme/components/ApiExplorer.vue', 'utf8')

const requiredSlideText = [
  'Coven is not a harness',
  'coven-docs is *live*',
  'OpenCoven/feedback',
  'Open Sesame',
  'coven.daemon.v1',
  '<ApiExplorer />',
]

for (const text of requiredSlideText) {
  if (!slides.includes(text)) {
    throw new Error(`Missing slide text: ${text}`)
  }
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

console.log('Weekly Open Coven deck checks passed.')
