import { test, expect } from '@playwright/test'
import { visit } from './helpers'

// The two pages the Community section gained: what divers said, and where to
// read what they said somewhere we cannot edit it.

test.describe('testimonials', () => {
  test('quote and attribution are marked up as a quotation', async ({ page }) => {
    await visit(page, '/testimonials')

    await expect(page.getByRole('heading', { name: 'Testimonials', level: 1 })).toBeVisible()

    // <figure>/<blockquote>/<figcaption>, not styled paragraphs: it is what
    // tells a screen reader where a quote ends and the attribution begins.
    const quotes = page.locator('main figure blockquote')
    expect(await quotes.count(), 'no testimonials rendered').toBeGreaterThan(0)
    await expect(quotes.first()).not.toBeEmpty()
    await expect(page.locator('main figure figcaption').first()).not.toBeEmpty()
  })

  test('points at the review sites for anyone who wants to add one', async ({ page }) => {
    await visit(page, '/testimonials')
    await page.getByRole('link', { name: 'Leave a review' }).click()
    await expect(page).toHaveURL('/reviews')
  })
})

test.describe('reviews', () => {
  test('sends every link off the site, in its own tab', async ({ page }) => {
    await visit(page, '/reviews')

    await expect(page.getByRole('heading', { name: 'Reviews', level: 1 })).toBeVisible()

    // The whole premise of the page is that the reviews are hosted by somebody
    // else. A link that stayed on this site would be a review we control.
    const links = page.locator('main a')
    const count = await links.count()
    expect(count, 'no review platforms listed').toBeGreaterThan(0)

    const origin = new URL(page.url()).origin
    for (let i = 0; i < count; i++) {
      const href = await links.nth(i).getAttribute('href')
      expect(new URL(href!, origin).origin, `${href} does not leave the site`).not.toBe(origin)
      await expect(links.nth(i)).toHaveAttribute('target', '_blank')
      await expect(links.nth(i)).toHaveAttribute('rel', /noopener/)
    }
  })

  test('names all four places', async ({ page }) => {
    await visit(page, '/reviews')
    for (const name of ['Google', 'Facebook', 'TripAdvisor', 'PADI']) {
      await expect(page.getByRole('heading', { name, exact: true })).toBeVisible()
    }
  })
})
