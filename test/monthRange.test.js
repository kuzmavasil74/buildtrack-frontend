import test from 'node:test'
import assert from 'node:assert/strict'
import { monthRange, sameMonth } from '../src/utils/monthRange.js'

test('monthRange covers the first to the last day of the month', () => {
  assert.deepEqual(monthRange(new Date(2026, 8, 15)), { from: '2026-09-01', to: '2026-09-30' })
  assert.deepEqual(monthRange(new Date(2026, 9, 1)), { from: '2026-10-01', to: '2026-10-31' })
})

test('monthRange knows about leap years and year ends', () => {
  assert.equal(monthRange(new Date(2028, 1, 10)).to, '2028-02-29')
  assert.equal(monthRange(new Date(2026, 1, 10)).to, '2026-02-28')
  assert.deepEqual(monthRange(new Date(2026, 11, 31)), { from: '2026-12-01', to: '2026-12-31' })
})

test('sameMonth takes a 1-based month', () => {
  assert.equal(sameMonth(new Date(2026, 8, 30), 2026, 9), true)
  assert.equal(sameMonth(new Date(2026, 8, 30), 2026, 10), false)
  assert.equal(sameMonth(new Date(2026, 8, 30), 2025, 9), false)
})
