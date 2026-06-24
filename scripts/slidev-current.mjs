#!/usr/bin/env node

import { spawnSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { join } from 'node:path'

import { resolveLatestDeck } from './deck-utils.mjs'

const [command = 'dev', ...rawArgs] = process.argv.slice(2)
const args = rawArgs.filter((arg) => arg !== '--')
const deck = resolveLatestDeck()
const localSlidev = join(
  process.cwd(),
  'node_modules',
  '.bin',
  process.platform === 'win32' ? 'slidev.cmd' : 'slidev',
)
const slidevBin = existsSync(localSlidev) ? localSlidev : 'slidev'

const slidevArgs = (() => {
  if (command === 'dev') {
    return [deck.relativePath, ...args]
  }

  if (command === 'build' || command === 'export') {
    return [command, deck.relativePath, ...args]
  }

  throw new Error(`Unsupported Slidev command: ${command}`)
})()

console.log(`Using latest deck: ${deck.relativePath}`)

const result = spawnSync(slidevBin, slidevArgs, {
  stdio: 'inherit',
  shell: process.platform === 'win32',
})

if (result.error) {
  throw result.error
}

process.exit(result.status ?? 1)
