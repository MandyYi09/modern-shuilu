// @vitest-environment jsdom
import { afterEach, expect, it, vi } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { lazy, Suspense, type ComponentType, type ReactNode } from 'react'
import { Route } from './index'

vi.mock('@tanstack/react-router', () => ({
  lazyRouteComponent: (load: () => Promise<Record<string, ComponentType>>, name: string) => lazy(async () => ({ default: (await load())[name] })),
  createFileRoute: () => (options: unknown) => ({ options }),
  Link: ({ to, children, ...props }: { to: string; children: ReactNode }) => <a href={to} {...props}>{children}</a>,
}))
vi.mock('react-i18next', () => ({ useTranslation: () => ({ i18n: { language: 'en' } }) }))
vi.mock('@/components/GuardianGallery', () => ({ GuardianGallery: () => <div aria-label="Characters"/> }))
afterEach(cleanup)

it('offers the character draw as the single internal next step on the homepage', async () => {
  const Home = Route.options.component as ComponentType
  render(<Suspense><Home/></Suspense>)
  await screen.findByRole('link', { name: /Draw a character card/ })
  const links = screen.getAllByRole('link').filter(link => link.getAttribute('href')?.startsWith('/'))
  expect(links).toHaveLength(1)
  expect(links[0].getAttribute('href')).toBe('/draw')
  expect(links[0].textContent).toContain('Draw a character card')
})
