import { readFileSync } from 'node:fs'

import { readDeckTitle, resolveLatestDeck } from './deck-utils.mjs'

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

const latestDeck = resolveLatestDeck()
const deckContent = readFileSync(latestDeck.absolutePath, 'utf8')
const title = readDeckTitle(deckContent)
const indexHtml = readFileSync('slides/dist/index.html', 'utf8')

if (!indexHtml.includes(title) && !indexHtml.includes(escapeHtml(title))) {
  throw new Error(`Built dist does not contain latest deck title from ${latestDeck.relativePath}: ${title}`)
}

console.log(`Built dist contains latest deck title from ${latestDeck.relativePath}.`)
