import { test, expect } from '@playwright/test'
import { visit } from './helpers'

// /reputation — what divers said in their own words, and where to read what
// they said somewhere we cannot edit it. It used to be two pages, Testimonials
// and Reviews.

test.describe('reputation', () => {
  test('quote and attribution are marked up as a quotation', async ({ page }) => {
    await visit(page, '/reputation')

    await expect(page.getByRole('heading', { name: 'Reputation', level: 1 })).toBeVisible()

    // <figure>/<blockquote>/<figcaption>, not styled paragraphs: it is what
    // tells a screen reader where a quote ends and the attribution begins.
    const quotes = page.locator('main figure blockquote')
    expect(await quotes.count(), 'no testimonials rendered').toBeGreaterThan(0)
    await expect(quotes.first()).not.toBeEmpty()
    await expect(page.locator('main figure figcaption').first()).not.toBeEmpty()
  })

  test('keeps both halves on the one page', async ({ page }) => {
    await visit(page, '/reputation')
    await expect(page.getByRole('heading', { name: 'Testimonials', level: 2 })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Reviews', level: 2 })).toBeVisible()
  })

  test('names the three places, and not the one that was dropped', async ({ page }) => {
    await visit(page, '/reputation')
    for (const name of ['Google', 'Facebook', 'TripAdvisor']) {
      await expect(page.getByRole('heading', { name, exact: true })).toBeVisible()
    }
    await expect(page.getByRole('heading', { name: 'PADI', exact: true })).toHaveCount(0)
  })

  // The whole premise of the reviews half is that they are hosted by somebody
  // else. A link that stayed on this site would be a review we control.
  test('sends every review link off the site, in its own tab', async ({ page }) => {
    await visit(page, '/reputation')

    const links = page.locator('main a[target="_blank"]')
    const count = await links.count()
    expect(count, 'no review platforms listed').toBeGreaterThan(0)

    const origin = new URL(page.url()).origin
    for (let i = 0; i < count; i++) {
      const href = await links.nth(i).getAttribute('href')
      expect(new URL(href!, origin).origin, `${href} does not leave the site`).not.toBe(origin)
      await expect(links.nth(i)).toHaveAttribute('rel', /noopener/)
    }
  })

  // Both old addresses were live, and both are in bookmarks and search results.
  test('answers both addresses it replaced', async ({ page }) => {
    for (const old of ['/testimonials', '/reviews']) {
      await visit(page, old)
      await expect(page).toHaveURL('/reputation')
      await expect(page.getByRole('heading', { name: 'Reputation', level: 1 })).toBeVisible()
    }
  })
})
