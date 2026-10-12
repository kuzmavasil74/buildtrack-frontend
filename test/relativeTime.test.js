import test from 'node:test'
import assert from 'node:assert/strict'
import { relativeTime } from '../src/utils/relativeTime.js'

const now = new Date('2026-10-12T12:00:00Z').getTime()

test('relativeTime picks the largest whole unit', () => {
  assert.equal(relativeTime(new Date(now - 3 * 86400000), 'en-US', now), '3 days ago')
  assert.equal(relativeTime(new Date(now - 2 * 3600000), 'en-US', now), '2 hours ago')
  assert.equal(relativeTime(new Date(now - 10 * 1000), 'en-US', now), 'now')
})
