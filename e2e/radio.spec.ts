import { test, expect } from '@playwright/test'
import { visit } from './helpers'

// The nav radio button streams the show's Icecast mount on-demand. The stream
// is only live during a broadcast, so these tests never touch the real server:
// one fakes a playing element, the other intercepts the connection.
//
// The nav renders one player for desktop and one for mobile, and only one is on
// screen at a time — hence `filter({ visible: true })` everywhere rather than
// `first()`, which would find the hidden layout's copy.
const STREAM = 'https://stream.fundiverstw.com/stream'

const visible = { visible: true } as const

test.describe('the nav radio player', () => {
  test('plays inline and shows a live badge', async ({ page }) => {
    // Let play() resolve and report itself playing without decoding real audio.
    await page.addInitScript(() => {
      const proto = HTMLMediaElement.prototype
      proto.play = function () {
        setTimeout(() => this.dispatchEvent(new Event('playing')), 10)
        return Promise.resolve()
      }
      proto.load = function () {}
    })
    await visit(page, '/')

    const radio = page.getByRole('button', { name: 'Radio show' }).filter(visible)
    await expect(radio).toBeVisible()
    await radio.click()

    await expect(page.getByText('LIVE').filter(visible)).toBeVisible()
    await expect(radio).toHaveAttribute('aria-pressed', 'true')
  })

  test('connects to the icecast mount, and says off air when it cannot', async ({ page }) => {
    let requested = ''
    await page.route(STREAM, (route) => {
      requested = route.request().url()
      return route.abort()
    })
    await visit(page, '/')

    await page.getByRole('button', { name: 'Radio show' }).filter(visible).click()

    await expect(page.getByText(/off air/i).filter(visible)).toBeVisible()
    expect(requested).toBe(STREAM)
  })
})
