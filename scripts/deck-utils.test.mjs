import assert from 'node:assert/strict'
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { test } from 'node:test'

import { readDeckTitle, resolveLatestDeck } from './deck-utils.mjs'

function makeSlides(files) {
  const root = mkdtempSync(join(tmpdir(), 'open-coven-weekly-'))
  const slidesDir = join(root, 'slides')
  mkdirSync(slidesDir)

  for (const file of files) {
    writeFileSync(join(slidesDir, file), `# ${file}\n`)
  }

  return root
}

test('resolveLatestDeck chooses the newest dated slide file', () => {
  const root = makeSlides([
    '2026-05-24.md',
    '2026-06-18.md',
    '2026-06-24.md',
    'template.md',
  ])

  assert.deepEqual(resolveLatestDeck(root), {
    absolutePath: join(root, 'slides', '2026-06-24.md'),
    relativePath: 'slides/2026-06-24.md',
    date: '2026-06-24',
  })
})

test('resolveLatestDeck fails clearly when no dated decks exist', () => {
  const root = makeSlides(['template.md'])

  assert.throws(
    () => resolveLatestDeck(root),
    /No dated slide decks found in slides\/ \(expected YYYY-MM-DD\.md\)/,
  )
})

test('package scripts do not pin Slidev to a stale dated deck', () => {
  const packageJson = JSON.parse(readFileSync('package.json', 'utf8'))
  const scripts = Object.values(packageJson.scripts).join('\n')

  assert.doesNotMatch(scripts, /slides\/\d{4}-\d{2}-\d{2}\.md/)
})

test('readDeckTitle reads quoted and unquoted frontmatter titles', () => {
  assert.equal(readDeckTitle('---\ntitle: Show and Spells\n---\n'), 'Show and Spells')
  assert.equal(readDeckTitle(`---\ntitle: "Show'n Spells"\n---\n`), "Show'n Spells")
})
