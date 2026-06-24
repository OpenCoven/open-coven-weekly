import { readdirSync } from 'node:fs'
import { join } from 'node:path'

const DATED_DECK_RE = /^(\d{4}-\d{2}-\d{2})\.md$/

export function readDeckTitle(content) {
  const match = content.match(/^title:\s*(.+)$/m)
  if (!match) {
    throw new Error('Missing frontmatter title')
  }

  return match[1].trim().replace(/^['"]|['"]$/g, '')
}

export function resolveLatestDeck(root = process.cwd()) {
  const slidesDir = join(root, 'slides')
  const decks = readdirSync(slidesDir)
    .map((file) => {
      const match = DATED_DECK_RE.exec(file)
      return match ? { date: match[1], file } : null
    })
    .filter(Boolean)
    .sort((a, b) => a.date.localeCompare(b.date))

  const latest = decks.at(-1)
  if (!latest) {
    throw new Error('No dated slide decks found in slides/ (expected YYYY-MM-DD.md)')
  }

  const relativePath = `slides/${latest.file}`
  return {
    absolutePath: join(root, relativePath),
    relativePath,
    date: latest.date,
  }
}
