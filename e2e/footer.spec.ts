import { test, expect } from '@playwright/test'
import { visit, chooseLanguage } from './helpers'

// The Team page used to have a link in the navigation bar. It does not any
// more: the sign-off at the bottom of every page — "Proudly created by the
// FunDivers Team in Taipei, Taiwan" — is now the only way to reach it.
//
// That makes a whole page depend on one word being a link. The sentence is
// assembled by splitting a translated string on a `{team}` marker and putting
// an anchor between the halves, so the ways it can break are quiet ones: the
// marker goes missing and the sentence still reads correctly with no link in
// it, or the anchor renders but the router refuses the click. Neither throws.

const footerLink = (page: import('@playwright/test').Page) =>
  page.locator('footer').getByRole('link', { name: 'Team', exact: true })

test('the footer sign-off links to the team page', async ({ page }) => {
  await visit(page, '/')

  const link = footerLink(page)
  await expect(link, 'the {team} placeholder did not become a link').toHaveCount(1)

  await link.click()

  await expect(page).toHaveURL('/team')
  await expect(page.getByRole('heading', { name: 'Fun Divers Team', level: 1 })).toBeVisible()
})

// The word sits inside a sentence, so a missing placeholder would leave the
// text looking finished. Checking the sentence surrounds the link catches the
// case where a translator pastes the marker at one end out of the way.
test('the linked word sits inside the sentence, not beside it', async ({ page }) => {
  await visit(page, '/')

  // `has:` matches its argument against the outer element's descendants, so the
  // inner locator has to be relative — footerLink() is rooted at <footer> and
  // would never resolve inside a <span> beneath it.
  const signOff = page.locator('footer span', {
    has: page.getByRole('link', { name: 'Team', exact: true }),
  })
  await expect(signOff).toHaveText('Proudly created by the FunDivers Team in Taipei, Taiwan')
})

// Japanese and Chinese put the team where their own grammar wants it, which is
// not where English does. If a translation drops the marker the link vanishes
// and the page becomes unreachable in that language only — the kind of thing
// nobody notices until a Japanese visitor cannot find the team.
for (const [language, word] of [
  ['日本語', 'チーム'],
  ['中文', '團隊'],
] as const) {
  test(`the sign-off still links to the team page in ${language}`, async ({ page }) => {
    await visit(page, '/')
    await chooseLanguage(page, language)

    const link = page.locator('footer').getByRole('link', { name: word, exact: true })
    await expect(link, `no team link in ${language}`).toHaveCount(1)

    await link.click()
    await expect(page).toHaveURL('/team')
  })
}

// The nav is the other half of this change. A link left behind in the bar would
// not fail anything above — both would simply work.
test('the team link is gone from the navigation', async ({ page }) => {
  await visit(page, '/')

  await expect(page.locator('header').getByRole('link', { name: 'Team' })).toHaveCount(0)
})
