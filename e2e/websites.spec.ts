import { test, expect } from '@playwright/test'
import { visit, watchForProblems } from './helpers'

// Website development, its own service separate from running FunDive. It quotes
// its own prices, and is reached from the /services hub.

test.describe('the websites page', () => {
  test('quotes its prices', async ({ page }) => {
    const problems = watchForProblems(page)
    await visit(page, '/websites')

    // Websites: from NT$9,000 to build, NT$3,000 a month.
    await expect(page.getByText('NT$9,000')).toHaveCount(1)
    await expect(page.getByText('NT$3,000')).toHaveCount(1)

    expect(problems.pageErrors).toEqual([])
    expect(problems.consoleErrors).toEqual([])
  })

  test('is reachable from the services hub', async ({ page }) => {
    await visit(page, '/services')
    await page.getByRole('link', { name: 'Website Development' }).click()

    await expect(page).toHaveURL('/websites')
    await expect(
      page.getByRole('heading', { name: 'Full-service dive shop websites', level: 1 }),
    ).toBeVisible()
  })
})
