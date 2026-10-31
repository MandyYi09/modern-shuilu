// @vitest-environment jsdom
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { act, cleanup, fireEvent, render } from '@testing-library/react'
import { paintings } from '@/lib/paintings'
import { GuardianCarousel } from './GuardianCarousel'
import { hitsCharacter } from '@/lib/character-hit-test'
vi.mock('@/lib/character-hit-test', () => ({ hitsCharacter: vi.fn(() => true), warmCharacterMask: vi.fn() }))

vi.mock('react-i18next', () => ({ useTranslation: () => ({ i18n: { language: 'en' } }) }))
beforeEach(() => {
  vi.stubGlobal('IntersectionObserver', class { observe() {} disconnect() {} })
  vi.stubGlobal('matchMedia', () => ({ matches: true, addEventListener() {}, removeEventListener() {} }))
})
afterEach(() => { cleanup(); vi.clearAllMocks(); vi.unstubAllGlobals() })

it('opens on the favourite hidden character and lets visitors reach the entire cast while mounting only three images', () => {
  const { container } = render(<GuardianCarousel/>)
  const carousel = container.querySelector('.guardian-carousel')!
  const current = () => container.querySelector<HTMLImageElement>('.is-active img')!
  expect(current().src).toContain('9549-360.webp')
  const seen = new Set<string>()
  for (let index = 0; index < paintings.length; index++) {
    seen.add(current().alt)
    expect(container.querySelectorAll('.guardian-character')).toHaveLength(3)
    fireEvent.keyDown(carousel, { key: 'ArrowRight' })
  }
  expect(seen.size).toBe(paintings.length)
  expect(current().src).toContain('9549-360.webp')
  fireEvent.keyDown(carousel, { key: 'ArrowRight' })
  expect(current().src).toContain('438-cutout-360.webp')
  expect(current().srcset).not.toContain('character-web/438')
})


it('coalesces mouse motion into one hit test per frame and cancels it on leave', () => {
  let frame: FrameRequestCallback | undefined
  const schedule = vi.fn((callback: FrameRequestCallback) => { frame = callback; return 1 })
  const cancel = vi.fn(() => { frame = undefined })
  vi.stubGlobal('requestAnimationFrame', schedule)
  vi.stubGlobal('cancelAnimationFrame', cancel)
  const { container } = render(<GuardianCarousel/>)
  const stage = container.querySelector('.guardian-stage')!
  const move = (x: number) => fireEvent(stage, Object.assign(new Event('pointermove', { bubbles: true }), { pointerId: 1, pointerType: 'mouse', clientX: x, clientY: 100 }))
  move(100); move(110); move(120)
  expect(schedule).toHaveBeenCalledTimes(1)
  expect(hitsCharacter).not.toHaveBeenCalled()
  act(() => frame?.(0))
  expect(hitsCharacter).toHaveBeenCalledTimes(1)
  expect(hitsCharacter).toHaveBeenLastCalledWith(expect.anything(), 120, 100)
  move(130)
  fireEvent.pointerLeave(stage)
  expect(cancel).toHaveBeenCalledTimes(1)
  expect(stage.classList.contains('is-over-figure')).toBe(false)
})
