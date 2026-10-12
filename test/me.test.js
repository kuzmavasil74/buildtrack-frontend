import test from 'node:test'
import assert from 'node:assert/strict'
import { canEditRecord, isOwner, safeNextPath } from '../src/context/me.js'

test('owners edit every record, foremen only their own', () => {
  const owner = { id: 1, role: 'owner' }
  const foreman = { id: 2, role: 'foreman' }
  assert.equal(canEditRecord(owner, { userId: 2 }), true)
  assert.equal(canEditRecord(foreman, { userId: 2 }), true)
  assert.equal(canEditRecord(foreman, { userId: 1 }), false)
  assert.equal(isOwner(null), false)
})

test('safeNextPath keeps same-site paths only', () => {
  assert.equal(safeNextPath('/invite?token=abc'), '/invite?token=abc')
  assert.equal(safeNextPath('//evil.com'), null)
  assert.equal(safeNextPath('https://evil.com'), null)
  assert.equal(safeNextPath(null), null)
})
