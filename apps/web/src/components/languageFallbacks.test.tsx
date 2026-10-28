// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vitest'
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import i18n from '../lib/i18n'
import { paintings } from '../lib/paintings'
import { curatedDeck } from '../lib/deck'
import { DetailCrop } from './DetailCrop'
import { GuardianArtwork } from './GuardianArtwork'

afterEach(async () => { cleanup(); await i18n.changeLanguage('en') })

describe('localized image fallbacks', () => {
  it('shows image errors in English and updates an existing error when the language changes', async () => {
    await i18n.changeLanguage('en')
    render(<DetailCrop painting={paintings[0]} clue="head" label="Detail 01"/>)
    fireEvent.error(screen.getByRole('img'))
    expect(screen.getByRole('status').textContent).toBe('Detail 01 · Image unavailable')
    await act(async () => { await i18n.changeLanguage('zh-TW') })
    expect(screen.getByRole('status').textContent).toBe('Detail 01 · 图片未载入')
    await act(async () => { await i18n.changeLanguage('en') })
    expect(screen.getByRole('status').textContent).toBe('Detail 01 · Image unavailable')
  })

  it('uses the current language for the fallback character initial', async () => {
    await i18n.changeLanguage('en')
    const card = { ...curatedDeck[0], image: undefined }
    const { container } = render(<GuardianArtwork card={card}/>)
    expect(container.querySelector('b')?.textContent).toBe(card.name.en.slice(0, 1))
    await act(async () => { await i18n.changeLanguage('zh-TW') })
    expect(container.querySelector('b')?.textContent).toBe(card.name['zh-TW'].slice(0, 1))
  })
})
