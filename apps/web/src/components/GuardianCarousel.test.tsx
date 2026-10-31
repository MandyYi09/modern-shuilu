// @vitest-environment jsdom
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render } from '@testing-library/react'
import { paintings } from '@/lib/paintings'
import { GuardianCarousel } from './GuardianCarousel'

vi.mock('react-i18next', () => ({ useTranslation: () => ({ i18n: { language: 'en' } }) }))
beforeEach(() => {
  vi.stubGlobal('IntersectionObserver', class { observe() {} disconnect() {} })
  vi.stubGlobal('matchMedia', () => ({ matches: true, addEventListener() {}, removeEventListener() {} }))
})
afterEach(() => { cleanup(); vi.unstubAllGlobals() })

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
