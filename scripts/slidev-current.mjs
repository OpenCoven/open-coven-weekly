#!/usr/bin/env node

import { spawnSync } from 'node:child_process'

import { resolveLatestDeck } from './deck-utils.mjs'

const [command = 'dev', ...args] = process.argv.slice(2)
const deck = resolveLatestDeck()

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

const result = spawnSync('slidev', slidevArgs, {
  stdio: 'inherit',
  shell: process.platform === 'win32',
})

if (result.error) {
  throw result.error
}

process.exit(result.status ?? 1)
