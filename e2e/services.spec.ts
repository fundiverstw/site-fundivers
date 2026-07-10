import { test, expect } from '@playwright/test'
import { visit, clickNavLink, chooseLanguage, watchForProblems } from './helpers'

// The page that sells FunDive to other dive shops. It quotes prices, so the
// prices are what these tests care about most.

test.describe('the services page', () => {
  test('is reachable from the navigation', async ({ page, isMobile }) => {
    await visit(page, '/')
    await clickNavLink(page, 'Services', isMobile)

    await expect(page).toHaveURL('/services')
    await expect(
      page.getByRole('heading', { name: 'Managed FunDive for dive shops' }),
    ).toBeVisible()
  })

  test('quotes every price', async ({ page }) => {
    const problems = watchForProblems(page)
    await visit(page, '/services')

    // FunDive: NT$3,000 to set up, NT$3,000 a month. Websites: from NT$9,000,
    // NT$3,000 a month. So NT$3,000 appears three times and NT$9,000 once.
    await expect(page.getByText('NT$3,000')).toHaveCount(3)
    await expect(page.getByText('NT$9,000')).toHaveCount(1)

    expect(problems.pageErrors).toEqual([])
    expect(problems.consoleErrors).toEqual([])
  })

  test('makes the promise the whole pitch rests on', async ({ page }) => {
    await visit(page, '/services')

    await expect(page.getByRole('heading', { name: /your infrastructure/i })).toBeVisible()
    await expect(page.getByText('No vendor lock-in.')).toBeVisible()
    await expect(page.getByText('We build it. You own it.').first()).toBeVisible()
  })

  // "It is open source, go and look" is the argument. The link has to work, and
  // has to be safe to open.
  test('links to the FunDive source code', async ({ page }) => {
    await visit(page, '/services')

    const link = page.getByRole('link', { name: /read the code/i })
    await expect(link).toHaveAttribute('href', 'https://github.com/fundive/fundive')
    await expect(link).toHaveAttribute('target', '_blank')
    await expect(link).toHaveAttribute('rel', /noopener/)
  })

  test('offers a way to get in touch', async ({ page }) => {
    await visit(page, '/services')
    const mail = page.getByRole('link', { name: 'Get in touch' })
    await expect(mail).toHaveAttribute('href', /^mailto:/)
  })

  test('is translated, like every other page', async ({ page }) => {
    await visit(page, '/services')
    await expect(
      page.getByRole('heading', { name: 'Managed FunDive for dive shops' }),
    ).toBeVisible()

    await chooseLanguage(page, '中文')

    await expect(page.getByRole('heading', { name: /FunDive/ }).first()).toBeVisible()
    await expect(page.getByText('沒有廠商綁定。')).toBeVisible()
    // The prices are not translated — they come from content/services.ts.
    await expect(page.getByText('NT$3,000')).toHaveCount(3)
  })
})
