import { test, expect } from '@playwright/test'
import { visit } from './helpers'

// The /services hub: one card per offering, each linking to that service's page.

test.describe('the services hub', () => {
  // The bar is four sections now and this is not one of them, so the footer's
  // link map is the way in — which makes that map load-bearing rather than
  // decoration, and worth a test of its own.
  test('is reachable from the footer', async ({ page }) => {
    await visit(page, '/')
    await page.locator('footer').getByRole('link', { name: 'Services', exact: true }).click()

    await expect(page).toHaveURL('/services')
    await expect(page.getByRole('heading', { name: 'Our Services', level: 1 })).toBeVisible()
  })

  test('links to each service', async ({ page }) => {
    await visit(page, '/services')
    const main = page.locator('main')

    const cards: Array<[string, string]> = [
      ['Gear Sales, Service & Rental', '/gear'],
      ['Taipei Cycling Tours', '/cycling'],
      ['FunDive for dive shops', '/fundive'],
      ['Website Development', '/websites'],
    ]
    for (const [name, href] of cards) {
      await expect(main.getByRole('link', { name })).toHaveAttribute('href', href)
    }
  })

  test('opens a service from its card', async ({ page }) => {
    await visit(page, '/services')
    await page.getByRole('link', { name: 'Taipei Cycling Tours' }).click()

    await expect(page).toHaveURL('/cycling')
    await expect(
      page.getByRole('heading', { name: 'Taipei Cycling Tours', level: 1 }),
    ).toBeVisible()
  })
})
