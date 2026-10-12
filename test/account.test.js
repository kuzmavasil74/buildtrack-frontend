import test from 'node:test'
import assert from 'node:assert/strict'
import { emailMatches, fileNameFrom } from '../src/utils/account.js'

test('the typed email matches regardless of case and spaces', () => {
  assert.equal(emailMatches(' Anna@Example.COM ', 'anna@example.com'), true)
  assert.equal(emailMatches('anna@example.co', 'anna@example.com'), false)
  assert.equal(emailMatches('', ''), false)
  assert.equal(emailMatches('', undefined), false)
})

test('the download keeps the name the server gave it', () => {
  assert.equal(fileNameFrom('attachment; filename=sanjo-data-2026-10-12.json', 'x.json'), 'sanjo-data-2026-10-12.json')
  assert.equal(fileNameFrom('attachment; filename="a b.json"', 'x.json'), 'a b.json')
  assert.equal(fileNameFrom("attachment; filename*=UTF-8''d%C3%A1ta.json", 'x.json'), 'dáta.json')
  assert.equal(fileNameFrom(undefined, 'x.json'), 'x.json')
})
