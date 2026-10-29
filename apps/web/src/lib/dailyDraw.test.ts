// @vitest-environment jsdom
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest'
import { paintings } from './paintings'

const morning = new Date('2026-10-29T00:00:00+08:00')
const evening = new Date('2026-10-29T23:59:59+08:00')
const tomorrow = new Date('2026-10-30T00:00:00+08:00')
const randomValue = (value: number) => vi.spyOn(crypto, 'getRandomValues').mockImplementation(array => {
  ;(array as Uint32Array)[0] = value
  return array
})
beforeEach(() => { localStorage.clear(); vi.resetModules() })
afterEach(() => vi.restoreAllMocks())

describe('device daily draw', () => {
  it('does not draw while reading; ignores the old shared-card reveal marker', async () => {
    const { readDailyPainting, dailyDrawStorageKey } = await import('./dailyDraw')
    localStorage.setItem('shuilu-daily-reveal', '2026-10-29')
    expect(readDailyPainting(morning)).toBeNull()
    expect(localStorage.getItem(dailyDrawStorageKey)).toBeNull()
  })
  it('persists a random result across a reload throughout the same day', async () => {
    const random = randomValue(0)
    const { drawDailyPainting } = await import('./dailyDraw')
    const first = await drawDailyPainting(morning)
    vi.resetModules()
    const reloaded = await import('./dailyDraw')
    expect(reloaded.readDailyPainting(evening)?.id).toBe(first.id)
    expect((await reloaded.drawDailyPainting(evening)).id).toBe(first.id)
    expect(random).toHaveBeenCalledTimes(1)
  })
  it('draws independently on another device, including hidden cards', async () => {
    const random = randomValue(0)
    const { drawDailyPainting } = await import('./dailyDraw')
    const first = await drawDailyPainting(morning)
    localStorage.clear()
    vi.resetModules()
    random.mockImplementation(array => { (array as Uint32Array)[0] = 0xffffffff; return array })
    const second = await (await import('./dailyDraw')).drawDailyPainting(morning)
    expect(second.id).not.toBe(first.id)
    expect(second.edition).toBe('hidden')
    expect(second.id).toBe(paintings.at(-1)?.id)
  })
  it('unlocks at Shanghai midnight and draws again only on request', async () => {
    const random = randomValue(0)
    const { drawDailyPainting, readDailyPainting } = await import('./dailyDraw')
    await drawDailyPainting(evening)
    expect(readDailyPainting(tomorrow)).toBeNull()
    expect(random).toHaveBeenCalledTimes(1)
    await drawDailyPainting(tomorrow)
    expect(random).toHaveBeenCalledTimes(2)
  })
  it('recovers from invalid saved data', async () => {
    const { drawDailyPainting, dailyDrawStorageKey } = await import('./dailyDraw')
    localStorage.setItem(dailyDrawStorageKey, '{broken')
    randomValue(0)
    expect((await drawDailyPainting(morning)).id).toBe(paintings[0].id)
    expect(JSON.parse(localStorage.getItem(dailyDrawStorageKey)!).paintingId).toBe(paintings[0].id)
  })
  it('retains the result during the visit when storage is blocked', async () => {
    const { drawDailyPainting, readDailyPainting } = await import('./dailyDraw')
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('blocked') })
    const random = randomValue(0)
    const first = await drawDailyPainting(morning)
    expect(readDailyPainting(evening)?.id).toBe(first.id)
    expect((await drawDailyPainting(evening)).id).toBe(first.id)
    expect(random).toHaveBeenCalledTimes(1)
  })
})
