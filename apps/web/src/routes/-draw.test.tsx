// @vitest-environment jsdom
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { paintings } from '@/lib/paintings'
import { dailyDrawDay, dailyDrawStorageKey } from '@/lib/dailyDraw'
import { getDetailComparisons } from '@/lib/detailComparisons'
import { DrawPage } from './draw'

vi.mock('@tanstack/react-router', () => ({
  createFileRoute: () => (options: unknown) => options,
  Link: ({ params, search, children }: { params: { cardId: string }; search: { origin: string; detail: string }; children: ReactNode }) => <a href={`/card/${params.cardId}?origin=${search.origin}&detail=${search.detail}`}>{children}</a>,
}))
vi.mock('react-i18next', () => ({ useTranslation: () => ({ i18n: { language: 'zh-TW' } }) }))
beforeEach(() => { localStorage.clear(); vi.spyOn(window, 'scrollTo').mockImplementation(() => {}) })
afterEach(() => { cleanup(); vi.restoreAllMocks() })

it('restores the saved card, its on-card wish, matching exercise and source-detail continuation', () => {
  const painting = paintings[0]
  localStorage.setItem(dailyDrawStorageKey, JSON.stringify({ day: dailyDrawDay(), paintingId: painting.id }))
  const { container } = render(<DrawPage/>)
  expect(container.querySelector('.daily-card-message')?.textContent).toContain(painting.blessing.zh)
  expect(screen.queryByRole('link', { name: /继续/ })).toBeNull()
  const focus = painting.edition === 'hidden' ? 'robe' : (['head', 'hands', 'robe'] as const)[(painting.index - 1) % 3]
  const candidates = [painting, ...getDetailComparisons(painting.id, focus).map(item => item.painting)]
  const offset = painting.index % candidates.length
  const choices = [...candidates.slice(offset), ...candidates.slice(0, offset)]
  const buttons = container.querySelectorAll<HTMLButtonElement>('.draw-clue-choices button')
  fireEvent.click(buttons[choices.findIndex(item => item.id !== painting.id)])
  expect(screen.getByText('再靠近一点，试试另一处。')).toBeTruthy()
  fireEvent.click(buttons[choices.findIndex(item => item.id === painting.id)])
  fireEvent.click(screen.getByRole('button', { name: '揭晓对应原画' }))
  expect(screen.getByRole('link', { name: /继续 · 查看原画详情/ }).getAttribute('href')).toBe(`/card/${painting.id}?origin=draw&detail=${focus}`)
  fireEvent.click(screen.getAllByRole('button', { name: '回到角色卡' })[0])
  expect(container.querySelector('.daily-card-message')?.textContent).toContain(painting.blessing.zh)
  expect(JSON.parse(localStorage.getItem(dailyDrawStorageKey)!).paintingId).toBe(painting.id)
})
