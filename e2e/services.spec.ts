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

  // Three channels, not two buttons that both mean "contact us".
  // Scoped to <main>: the footer carries its own LINE and WhatsApp links.
  test('offers email, LINE and WhatsApp', async ({ page }) => {
    await visit(page, '/services')
    const main = page.locator('main')

    await expect(main.getByRole('link', { name: 'Email us' })).toHaveAttribute(
      'href',
      /^mailto:fundiverstw@gmail\.com/,
    )

    const line = main.getByRole('link', { name: 'LINE', exact: true })
    await expect(line).toHaveAttribute('href', 'https://line.me/R/ti/p/%40lga0216c')
    await expect(line).toHaveAttribute('rel', /noopener/)
    await expect(line).toHaveAttribute('target', '_blank')

    const whatsapp = main.getByRole('link', { name: 'WhatsApp', exact: true })
    await expect(whatsapp).toHaveAttribute('href', 'https://wa.me/886909083683')
    await expect(whatsapp).toHaveAttribute('rel', /noopener/)
  })

  test('does not offer two buttons that mean the same thing', async ({ page }) => {
    await visit(page, '/services')
    // 'Contact us' used to sit beside 'Get in touch'. Both went to the same place.
    await expect(page.getByRole('link', { name: 'Contact us' })).toHaveCount(0)
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
