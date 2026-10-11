import test from 'node:test'
import assert from 'node:assert/strict'
import { DEFAULT_END, DEFAULT_START, hoursBetween, onlyDecimalChars, toNum } from '../src/utils/hours.js'

test('hoursBetween subtracts the 30-minute lunch break', () => {
  assert.equal(hoursBetween('07:00', '19:00'), '11.5')
  assert.equal(hoursBetween('07:00', '15:30'), '8')
  assert.equal(hoursBetween('08:00', '16:00'), '7.5')
})

test('the default shift is 07:00-19:00, i.e. 11.5 working hours', () => {
  assert.equal(hoursBetween(DEFAULT_START, DEFAULT_END), '11.5')
})

test('hoursBetween handles a shift that crosses midnight', () => {
  assert.equal(hoursBetween('22:00', '06:00'), '7.5')
})

test('hoursBetween never goes below zero', () => {
  assert.equal(hoursBetween('09:00', '09:10'), '0')
})

test('hoursBetween is empty until both times are valid', () => {
  assert.equal(hoursBetween('', '19:00'), '')
  assert.equal(hoursBetween('07:00', ''), '')
  assert.equal(hoursBetween('7:00', '19:00'), '')
  assert.equal(hoursBetween('25:00', '19:00'), '')
})

test('toNum accepts a comma or a dot as the decimal separator', () => {
  assert.equal(toNum('11,5'), 11.5)
  assert.equal(toNum('11.5'), 11.5)
  assert.equal(toNum(' 8 '), 8)
  assert.equal(toNum(8), 8)
  assert.ok(Number.isNaN(toNum('abc')))
})

test('onlyDecimalChars strips everything but digits, comma and dot', () => {
  assert.equal(onlyDecimalChars('1a1,5 h'), '11,5')
  assert.equal(onlyDecimalChars('-3'), '3')
})
