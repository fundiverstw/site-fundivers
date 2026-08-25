import { test, expect } from '@playwright/test'
import { visit, chooseLanguage, clickNavLink } from './helpers'

// The sign-off at the bottom of every page — "Proudly created by the FunDivers
// Team in Taipei, Taiwan" — links the word "Team" to the staff roster. The bar
// links there too, under About Us, so this is no longer the only way in, but it
// is still the fragile one and the one people actually click from the foot of a
// page.
//
// The sentence is assembled by splitting a translated string on a `{team}`
// marker and putting an anchor between the halves, so the ways it can break are
// quiet ones: the marker goes missing and the sentence still reads correctly
// with no link in it, or the anchor renders but the router refuses the click.
// Neither throws.

const footerLink = (page: import('@playwright/test').Page) =>
  page.locator('footer').getByRole('link', { name: 'Team', exact: true })

test('the footer sign-off links to the roster', async ({ page }) => {
  await visit(page, '/')

  const link = footerLink(page)
  await expect(link, 'the {team} placeholder did not become a link').toHaveCount(1)

  await link.click()

  await expect(page).toHaveURL('/team')
  await expect(page.getByRole('heading', { name: 'The Team', level: 1 })).toBeVisible()
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
  test(`the sign-off still links to the roster in ${language}`, async ({ page }) => {
    await visit(page, '/')
    await chooseLanguage(page, language)

    const link = page.locator('footer').getByRole('link', { name: word, exact: true })
    await expect(link, `no team link in ${language}`).toHaveCount(1)

    await link.click()
    await expect(page).toHaveURL('/team')
  })
}

// The bar is the other half of this. The two routes in are independent — the
// sign-off could keep working with the bar link dropped, and neither failure
// shows up in the other's test.
test('the navigation links to the roster too', async ({ page, isMobile }) => {
  await visit(page, '/')

  await clickNavLink(page, 'Team', isMobile)

  await expect(page).toHaveURL('/team')
  await expect(page.getByRole('heading', { name: 'The Team', level: 1 })).toBeVisible()
})
