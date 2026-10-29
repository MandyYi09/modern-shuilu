// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { PaintingComparison } from './PaintingComparison'
import { paintings } from '@/lib/paintings'
import characterRegions from '@/lib/character-detail-regions.json'

afterEach(cleanup)

describe('source and character comparison', () => {
  it('keeps both complete images visible when selecting and clearing a detail', () => {
    const painting = paintings[0]
    const { rerender, container } = render(<PaintingComparison painting={painting} clue={null} en/>)
    expect(screen.getByAltText(/full original painting/).getAttribute('src')).toBe(painting.display)
    expect(screen.getByAltText(/contemporary illustrated character/).getAttribute('src')).toBe(painting.character)
    expect(container.querySelectorAll('figure')).toHaveLength(2)
    rerender(<PaintingComparison painting={painting} clue="hands" en/>)
    expect(screen.getByRole('group', { name: 'Hands & objects comparison' })).toBeTruthy()
    expect(screen.getByAltText(/full original painting/)).toBeTruthy()
    expect(container.querySelectorAll('figure')).toHaveLength(4)
    rerender(<PaintingComparison painting={painting} clue={null} en={false}/>)
    expect(screen.getByText('原画')).toBeTruthy()
    expect(screen.getByText('卡通角色')).toBeTruthy()
    expect(container.querySelectorAll('figure')).toHaveLength(2)
  })
  it('has separate in-bounds character crops for every current figure', () => {
    for (const painting of paintings) for (const key of ['head', 'hands', 'robe'] as const) {
      const [x, y, w, h] = characterRegions[painting.id as keyof typeof characterRegions][key]
      expect(x).toBeGreaterThanOrEqual(0)
      expect(y).toBeGreaterThanOrEqual(0)
      expect(w).toBeGreaterThan(0)
      expect(h).toBeGreaterThan(0)
      expect(x + w).toBeLessThanOrEqual(1)
      expect(y + h).toBeLessThanOrEqual(1)
    }
  })
})
