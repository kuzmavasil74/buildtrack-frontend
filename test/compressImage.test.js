import test from 'node:test'
import assert from 'node:assert/strict'
import { fitWithin, jpegName, compressImage, MAX_SIDE } from '../src/utils/compressImage.js'

test('fitWithin leaves small photos alone', () => {
  assert.deepEqual(fitWithin(1200, 900), { width: 1200, height: 900 })
  assert.deepEqual(fitWithin(MAX_SIDE, 10), { width: MAX_SIDE, height: 10 })
})

test('fitWithin scales the longer side down and keeps the aspect ratio', () => {
  assert.deepEqual(fitWithin(4032, 3024), { width: 2000, height: 1500 })
  assert.deepEqual(fitWithin(3024, 4032), { width: 1500, height: 2000 })
})

test('jpegName swaps the extension for .jpg', () => {
  assert.equal(jpegName('IMG_1234.HEIC'), 'IMG_1234.jpg')
  assert.equal(jpegName('receipt.store.png'), 'receipt.store.jpg')
  assert.equal(jpegName('noext'), 'noext.jpg')
  assert.equal(jpegName('.png'), 'receipt.jpg')
})

test('non-image files are passed through untouched', async () => {
  const file = { name: 'a.pdf', type: 'application/pdf', size: 10 }
  assert.equal(await compressImage(file), file)
  assert.equal(await compressImage(null), null)
})
