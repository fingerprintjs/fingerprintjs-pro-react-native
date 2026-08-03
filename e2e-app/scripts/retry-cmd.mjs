#!/usr/bin/env node
import { spawnSync } from 'node:child_process'

// Usage: node retry-cmd.js --retries=3 "<CMD>"
// Runs <CMD> and retries up to <retries> additional times if it exits non-zero.

function parseArgs(argv) {
  let retries = 0
  const rest = []

  for (const arg of argv) {
    const match = /^--retries=(\d+)$/.exec(arg)
    if (match) {
      retries = Number(match[1])
    } else {
      rest.push(arg)
    }
  }

  return { retries, command: rest.join(' ') }
}

const { retries, command } = parseArgs(process.argv.slice(2))

if (!command) {
  console.error('Usage: node retry.js --retries=<n> "<CMD>"')
  process.exit(1)
}

const totalAttempts = retries + 1

for (let attempt = 1; attempt <= totalAttempts; attempt++) {
  if (attempt > 1) {
    console.log(`[retry] Attempt ${attempt}/${totalAttempts}: ${command}`)
  }

  const result = spawnSync(command, { stdio: 'inherit', shell: true })

  if (result.error) {
    console.error(`[retry] Failed to start command: ${result.error.message}`)
  }

  const code = result.status

  if (code === 0) {
    process.exit(0)
  }

  console.error(`[retry] Attempt ${attempt} exited with code ${code ?? 'null'}.`)

  if (attempt < totalAttempts) {
    console.error('[retry] Retrying...')
  }
}

console.error(`[retry] Command failed after ${totalAttempts} attempt(s).`)
process.exit(1)
