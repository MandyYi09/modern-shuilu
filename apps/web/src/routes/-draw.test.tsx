// @vitest-environment jsdom
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { lazy, Suspense, type ComponentType, type ReactNode } from 'react'
import { paintings } from '@/lib/paintings'
import { dailyDrawDay, dailyDrawStorageKey } from '@/lib/dailyDraw'
import { getDetailComparisons } from '@/lib/detailComparisons'
import { Route } from './draw'
const DrawPage = Route.options.component as ComponentType

vi.mock('@tanstack/react-router', () => ({
  lazyRouteComponent: (load: () => Promise<Record<string, ComponentType>>, name: string) => lazy(async () => ({ default: (await load())[name] })),
  createFileRoute: () => (options: unknown) => ({ options }),
  Link: ({ params, search, children }: { params: { cardId: string }; search: { origin: string; detail: string }; children: ReactNode }) => <a href={`/card/${params.cardId}?origin=${search.origin}&detail=${search.detail}`}>{children}</a>,
}))
vi.mock('react-i18next', () => ({ useTranslation: () => ({ i18n: { language: 'zh-TW' } }) }))
beforeEach(() => { localStorage.clear(); vi.spyOn(window, 'scrollTo').mockImplementation(() => {}) })
afterEach(() => { cleanup(); vi.restoreAllMocks() })

it('restores the saved card, its on-card wish, matching exercise and source-detail continuation', async () => {
  const painting = paintings[0]
  localStorage.setItem(dailyDrawStorageKey, JSON.stringify({ day: dailyDrawDay(), paintingId: painting.id }))
  const { container } = render(<Suspense><DrawPage/></Suspense>)
  await screen.findAllByRole('button', { name: '翻开今日卡片' })
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
  fireEvent.click(screen.getByRole('button', { name: '揭晓对应原画' }))
  expect(screen.getByRole('link', { name: /继续 · 查看原画详情/ }).getAttribute('href')).toBe(`/card/${painting.id}?origin=draw&detail=${focus}`)
  fireEvent.click(screen.getAllByRole('button', { name: '回到角色卡' })[0])
  expect(container.querySelector('.daily-card-message')?.textContent).toContain(painting.blessing.zh)
  expect(JSON.parse(localStorage.getItem(dailyDrawStorageKey)!).paintingId).toBe(painting.id)
})

 it('starts each new visit with the back and reveals the same saved daily card', async () => {
  const painting = paintings[2]
  localStorage.setItem(dailyDrawStorageKey, JSON.stringify({ day: dailyDrawDay(), paintingId: painting.id }))
  for (let visit = 0; visit < 2; visit++) {
    const { container, unmount } = render(<Suspense><DrawPage/></Suspense>)
    await screen.findAllByRole('button', { name: '翻开今日卡片' })
  expect(container.querySelector('.daily-card-back')).toBeTruthy()
    expect(container.querySelector('.draw-clue-choices')).toBeNull()
    fireEvent.click(screen.getAllByRole('button', { name: '翻开今日卡片' })[0])
    await waitFor(() => expect(container.querySelector('.daily-card-character img')?.getAttribute('src')).toBe(painting.character))
    expect(container.querySelector('.draw-clue-choices')).toBeTruthy()
    expect(JSON.parse(localStorage.getItem(dailyDrawStorageKey)!).paintingId).toBe(painting.id)
    unmount()
  }
})
