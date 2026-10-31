// Keep the original alpha threshold and full-resolution hit area. A one-bit mask
// uses 1/32 of RGBA storage and survives carousel image-element remounts.
type HitMask = { bits: Uint8Array; width: number; height: number }
const masks = new Map<string, HitMask>()
const maxCachedMasks = 6

function maskFor(image: HTMLImageElement): HitMask | null {
  const key = `${image.currentSrc || image.src}|${image.naturalWidth}x${image.naturalHeight}`
  const cached = masks.get(key)
  if (cached) {
    masks.delete(key)
    masks.set(key, cached)
    return cached
  }
  const canvas = document.createElement('canvas')
  canvas.width = image.naturalWidth
  canvas.height = image.naturalHeight
  const context = canvas.getContext('2d', { willReadFrequently: true })
  if (!context) return null
  try {
    context.drawImage(image, 0, 0)
    const { data } = context.getImageData(0, 0, canvas.width, canvas.height)
    const bits = new Uint8Array(Math.ceil(canvas.width * canvas.height / 8))
    for (let pixel = 0; pixel < canvas.width * canvas.height; pixel++) {
      if (data[pixel * 4 + 3] > 32) bits[pixel >> 3] |= 1 << (pixel & 7)
    }
    const mask = { bits, width: canvas.width, height: canvas.height }
    masks.set(key, mask)
    if (masks.size > maxCachedMasks) masks.delete(masks.keys().next().value!)
    return mask
  } catch {
    return null
  } finally {
    // Release the temporary drawing surface; only the compact hit mask survives.
    canvas.width = 0
    canvas.height = 0
  }
}

export function hitsCharacter(image: HTMLImageElement, clientX: number, clientY: number) {
  if (!image.complete || !image.naturalWidth || !image.naturalHeight) return false
  const bounds = image.getBoundingClientRect()
  const scale = Math.min(bounds.width / image.naturalWidth, bounds.height / image.naturalHeight)
  if (!scale) return false
  const x = Math.floor((clientX - bounds.left - (bounds.width - image.naturalWidth * scale) / 2) / scale)
  const y = Math.floor((clientY - bounds.top - (bounds.height - image.naturalHeight * scale) / 2) / scale)
  if (x < 0 || y < 0 || x >= image.naturalWidth || y >= image.naturalHeight) return false
  const mask = maskFor(image)
  if (!mask) return false
  const pixel = y * mask.width + x
  return (mask.bits[pixel >> 3] & (1 << (pixel & 7))) !== 0
}


// Prepare after image loading, outside the pointer-event handler. Ignore slides
// that have already left the carousel before the idle callback gets a turn.
export function warmCharacterMask(image: HTMLImageElement) {
  const prepare = () => {
    if (image.isConnected && image.complete && image.naturalWidth && image.naturalHeight) maskFor(image)
  }
  if (typeof window.requestIdleCallback === 'function') window.requestIdleCallback(prepare, { timeout: 1000 })
  else window.setTimeout(prepare, 100)
}
