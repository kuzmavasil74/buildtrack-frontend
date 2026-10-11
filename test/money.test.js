import test from 'node:test'
import assert from 'node:assert/strict'
import { CURRENCIES, formatMoney } from '../src/utils/money.js'

test('formats amounts with the currency symbol of the UI language', () => {
  assert.match(formatMoney(1150, 'EUR', 'en-US'), /€\s?1,150\.00/)
  assert.match(formatMoney(1150, 'USD', 'en-US'), /\$\s?1,150\.00/)
})

test('keeps two decimals and tolerates bad input', () => {
  assert.match(formatMoney(3.333, 'EUR', 'en-US'), /3\.33/)
  assert.match(formatMoney(undefined, 'EUR', 'en-US'), /0\.00/)
  assert.match(formatMoney('12.5', 'EUR', 'en-US'), /12\.50/)
})

test('every offered currency is a valid ISO code', () => {
  for (const code of CURRENCIES) {
    assert.doesNotThrow(() => formatMoney(1, code, 'en-US'))
  }
})
