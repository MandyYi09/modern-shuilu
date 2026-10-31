// @vitest-environment jsdom
import { afterEach, expect, it, vi } from 'vitest'
import { hitsCharacter, warmCharacterMask } from './character-hit-test'

afterEach(() => { vi.restoreAllMocks(); vi.useRealTimers() })
function picture(src: string) {
  const image = document.createElement('img')
  image.src = src
  Object.defineProperties(image, { complete: { value: true }, naturalWidth: { value: 2 }, naturalHeight: { value: 2 } })
  vi.spyOn(image, 'getBoundingClientRect').mockReturnValue({ left: 0, top: 0, width: 40, height: 20 } as DOMRect)
  return image
}
function canvasMock() {
  const read = vi.fn(() => ({ data: new Uint8ClampedArray([0,0,0,0, 0,0,0,32, 0,0,0,33, 0,0,0,255]) }))
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({ drawImage: vi.fn(), getImageData: read } as unknown as CanvasRenderingContext2D)
  return read
}
it('preserves transparent margins, object-fit offsets and the exact alpha threshold', () => {
  const read = canvasMock()
  const image = picture('/threshold.webp')
  expect(hitsCharacter(image, 5, 15)).toBe(false)
  expect(read).not.toHaveBeenCalled()
  expect(hitsCharacter(image, 15, 5)).toBe(false)
  expect(hitsCharacter(image, 25, 5)).toBe(false)
  expect(hitsCharacter(image, 15, 15)).toBe(true)
  expect(hitsCharacter(image, 25, 15)).toBe(true)
  expect(hitsCharacter(image, 35, 15)).toBe(false)
  expect(read).toHaveBeenCalledTimes(1)
})
it('reuses pixels after a slide remount but reads again when its source changes', () => {
  const read = canvasMock()
  expect(hitsCharacter(picture('/remount.webp'), 15, 15)).toBe(true)
  const remounted = picture('/remount.webp')
  expect(hitsCharacter(remounted, 15, 15)).toBe(true)
  expect(read).toHaveBeenCalledTimes(1)
  remounted.src = '/changed.webp'
  expect(hitsCharacter(remounted, 15, 15)).toBe(true)
  expect(read).toHaveBeenCalledTimes(2)
})
it('evicts older masks instead of retaining the entire cast indefinitely', () => {
  const read = canvasMock()
  for (let i = 0; i < 7; i++) hitsCharacter(picture(`/bounded-${i}.webp`), 15, 15)
  hitsCharacter(picture('/bounded-0.webp'), 15, 15)
  expect(read).toHaveBeenCalledTimes(8)
})


it('prepares attached images during idle time and skips removed slides', () => {
  const read = canvasMock()
  vi.useFakeTimers()
  const image = picture('/idle.webp')
  document.body.append(image)
  warmCharacterMask(image)
  expect(read).not.toHaveBeenCalled()
  vi.runAllTimers()
  expect(hitsCharacter(image, 15, 15)).toBe(true)
  expect(read).toHaveBeenCalledTimes(1)
  image.remove()
  warmCharacterMask(picture('/removed.webp'))
  vi.runAllTimers()
  expect(read).toHaveBeenCalledTimes(1)
})
