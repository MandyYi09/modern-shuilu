import { describe, expect, it } from 'vitest'
import { getPainting, paintings } from './paintings'

describe('physical and website edition mapping', () => {
  it('uses K for all nineteen unique regular cards and E for both secret cards', () => {
    expect(paintings).toHaveLength(21)
    expect(paintings.filter(card => card.edition === 'hidden').map(card => card.id)).toEqual(['9549', '438'])
    expect(paintings.filter(card => card.edition === 'regular')).toHaveLength(19)
    for (const card of paintings) expect(card.back).toContain(card.edition === 'hidden' ? 'back-e.webp' : 'back-k.webp')
    expect(getPainting('5695')?.edition).toBe('regular')
    expect(getPainting('5702')?.edition).toBe('regular')
  })
})

describe('duplicate painting compatibility', () => {
  it('lists the Marshal Shi painting once and resolves its old link to the retained work', () => {
    expect(paintings.filter(card => card.identity.name.zh === '神雷石元帅').map(card => card.id)).toEqual(['5697 2'])
    expect(getPainting('5699')).toBe(getPainting('5697 2'))
  })
})
