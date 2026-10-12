// Receipt photos straight from a phone camera are often 3-8 MB. Before upload
// they are scaled so the longer side is at most MAX_SIDE px and re-encoded as
// JPEG, which keeps the printed text readable at a fraction of the size.
export const MAX_SIDE = 2000
export const JPEG_QUALITY = 0.8

// Smaller photos are left at their own size, larger ones keep their aspect.
export const fitWithin = (width, height, maxSide = MAX_SIDE) => {
  const longer = Math.max(width, height)
  if (longer <= maxSide) return { width, height }
  const scale = maxSide / longer
  return { width: Math.round(width * scale), height: Math.round(height * scale) }
}

export const jpegName = (name) => `${name.replace(/\.[^./]+$/, '') || 'receipt'}.jpg`

// Returns a smaller JPEG File, or the original file when it is not an image
// the browser can decode (e.g. HEIC outside Safari) or compressing would not
// make it smaller.
export const compressImage = async (file) => {
  if (!file?.type?.startsWith('image/')) return file
  try {
    const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' })
    const { width, height } = fitWithin(bitmap.width, bitmap.height)
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    // White under transparent PNGs, which JPEG would otherwise turn black.
    ctx.fillStyle = '#fff'
    ctx.fillRect(0, 0, width, height)
    ctx.drawImage(bitmap, 0, 0, width, height)
    bitmap.close?.()
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', JPEG_QUALITY))
    if (!blob || blob.size >= file.size) return file
    return new File([blob], jpegName(file.name), { type: 'image/jpeg', lastModified: file.lastModified })
  } catch {
    return file
  }
}
