// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { BlessingExperience } from './BlessingExperience'
import { paintings } from '../lib/paintings'
import { reservationConfig } from '../lib/reservations'

beforeEach(() => {
  HTMLDialogElement.prototype.showModal = function () { this.setAttribute('open', '') }
  reservationConfig.enabled = false; reservationConfig.recipientEmail = ''; reservationConfig.formToken = ''
})
afterEach(() => { cleanup(); vi.restoreAllMocks(); reservationConfig.enabled = false; reservationConfig.recipientEmail = '' })
function fill() {
  fireEvent.click(screen.getByRole('button', { name: '继续 · 填写预约' }))
  fireEvent.change(screen.getByLabelText('称呼'), { target: { value: '预约用户' } })
  fireEvent.change(screen.getByLabelText('联系方式（邮箱、手机或微信）'), { target: { value: 'visitor@example.com' } })
  fireEvent.click(screen.getByRole('button', { name: '下一步 · 核对预约' }))
}
describe('blessing reservations', () => {
  it.each([true, false])('uses the site language for validation (English: %s) and clears errors after editing', en => {
    render(<BlessingExperience painting={paintings[0]} en={en} onClose={() => {}}/>)
    fireEvent.click(screen.getByRole('button', { name: en ? 'Continue · Reservation details' : '继续 · 填写预约' }))
    const name = screen.getByLabelText(en ? 'Name' : '称呼') as HTMLInputElement
    const contact = screen.getByLabelText(en ? 'Contact (email, phone or WeChat)' : '联系方式（邮箱、手机或微信）') as HTMLInputElement
    fireEvent.click(screen.getByRole('button', { name: en ? 'Next · Review' : '下一步 · 核对预约' }))
    for (const input of [name, contact]) {
      expect(input.validationMessage).toBe(en ? 'Please fill out this field.' : '请填写此字段。')
      fireEvent.change(input, { target: { value: input === name ? 'Visitor' : 'visitor@example.com' } })
      expect(input.checkValidity()).toBe(true)
    }
    fireEvent.click(screen.getByRole('button', { name: en ? 'Next · Review' : '下一步 · 核对预约' }))
    const consent = screen.getByRole('checkbox') as HTMLInputElement
    expect(consent.checkValidity()).toBe(false)
    expect(consent.validationMessage).toBe(en ? 'Please check this box to continue.' : '请勾选此复选框后再继续。')
    fireEvent.click(consent)
    expect(consent.checkValidity()).toBe(true)
  })
  it('blocks submission when delivery is unconfigured and preserves choices for editing', () => {
    render(<BlessingExperience painting={paintings[0]} en={false} onClose={() => {}}/> )
    fill()
    expect((screen.getByRole('button', { name: '提交预约（不付款）' }) as HTMLButtonElement).disabled).toBe(true)
    expect(screen.getByText('实体收藏卡 × 1')).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: '返回修改' }))
    expect((screen.getByLabelText('称呼') as HTMLInputElement).value).toBe('预约用户')
  })
  it('posts card, quantity and contact only to the configured provider with consent and CAPTCHA intact', () => {
    reservationConfig.enabled = true; reservationConfig.recipientEmail = 'owner@example.com'
    render(<BlessingExperience painting={paintings[0]} en={false} onClose={() => {}}/>); fill()
    const button = screen.getByRole('button', { name: '提交预约（不付款）' }) as HTMLButtonElement
    const form = button.form!
    expect(form.action).toBe('https://formsubmit.co/owner%40example.com')
    expect(form.method).toBe('post')
    expect(form.checkValidity()).toBe(false)
    fireEvent.click(screen.getByRole('checkbox'))
    expect(form.checkValidity()).toBe(true)
    const data = new FormData(form)
    expect(data.get('联系方式 / Contact')).toBe('visitor@example.com')
    expect(data.get('卡款 / Card')).toContain(paintings[0].id)
    expect(data.get('预约编号 / Reference')).toMatch(/^SL-/)
    expect(data.has('_captcha')).toBe(false)
    expect(data.has('address')).toBe(false)
    expect(data.get('寺庙祈福 / Temple blessing')).toContain('card only')
  })
  it('restores scroll and calls close on escape', () => {
    document.body.style.overflow = 'auto'; const close = vi.fn()
    const view = render(<BlessingExperience painting={paintings[0]} en onClose={close}/>)
    expect(document.body.style.overflow).toBe('hidden')
    fireEvent(screen.getByRole('dialog'), new Event('cancel', { cancelable: true }))
    expect(close).toHaveBeenCalledOnce(); view.unmount()
    expect(document.body.style.overflow).toBe('auto')
  })
})
