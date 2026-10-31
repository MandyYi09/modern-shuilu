// @vitest-environment jsdom
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { getDailyPainting } from '@/lib/paintings'
import { getDetailComparisons } from '@/lib/detailComparisons'
import { DrawPage } from './draw'

vi.mock('@tanstack/react-router', () => ({
  createFileRoute: () => (options: unknown) => options,
  Link: ({ params, search, children }: { params: { cardId: string }; search: { origin: string; detail: string }; children: ReactNode }) => <a href={`/card/${params.cardId}?detail=${search.detail}`}>{children}</a>,
}))
vi.mock('react-i18next', () => ({ useTranslation: () => ({ i18n: { language: 'zh-TW' } }) }))
beforeEach(() => { localStorage.clear(); vi.spyOn(window, 'scrollTo').mockImplementation(() => {}) })
afterEach(() => { cleanup(); vi.restoreAllMocks() })

it('reveals the calendar-day card, its on-card wish, matching exercise and source-detail continuation', async () => {
  const painting = getDailyPainting()
  const { container } = render(<DrawPage/>)
  expect(container.querySelector('.daily-card-back')).toBeTruthy()
  expect(container.querySelector('.daily-card-message')).toBeNull()
  fireEvent.click(screen.getAllByRole('button', { name: '翻开今日卡片' })[0])
  await waitFor(() => expect(container.querySelector('.daily-card-message')?.textContent).toContain(painting.blessing.zh))
  expect(screen.queryByRole('link', { name: /继续/ })).toBeNull()
  const focus = painting.edition === 'hidden' ? 'robe' : (['head', 'hands', 'robe'] as const)[(painting.index - 1) % 3]
  const candidates = [painting, ...getDetailComparisons(painting.id, focus).map(item => item.painting)]
  const offset = painting.index % candidates.length
  const choices = [...candidates.slice(offset), ...candidates.slice(0, offset)]
  const buttons = container.querySelectorAll<HTMLButtonElement>('.draw-clue-choices button')
  fireEvent.click(buttons[choices.findIndex(item => item.id !== painting.id)])
  expect(screen.getByText('再靠近一点，试试另一处。')).toBeTruthy()
  fireEvent.click(buttons[choices.findIndex(item => item.id === painting.id)])
  fireEvent.click(screen.getByRole('button', { name: '打开它来自的原画' }))
  expect(screen.getByRole('link', { name: /带着线索，走进原画/ }).getAttribute('href')).toBe(`/card/${painting.id}?detail=${focus}`)
  fireEvent.click(screen.getAllByRole('button', { name: '回到角色卡' })[0])
  expect(container.querySelector('.daily-card-message')?.textContent).toContain(painting.blessing.zh)
})

 it('starts each new visit with the back and reveals the same calendar-day card', async () => {
  const painting = getDailyPainting()
  for (let visit = 0; visit < 2; visit++) {
    const { container, unmount } = render(<DrawPage/>)
    expect(container.querySelector('.daily-card-back')).toBeTruthy()
    expect(container.querySelector('.draw-clue-choices')).toBeNull()
    fireEvent.click(screen.getAllByRole('button', { name: '翻开今日卡片' })[0])
    await waitFor(() => expect(container.querySelector('.daily-card-character img')?.getAttribute('src')).toBe(painting.character))
    expect(container.querySelector('.draw-clue-choices')).toBeTruthy()
    unmount()
  }
})
