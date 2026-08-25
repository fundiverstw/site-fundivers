import { test, expect } from '@playwright/test'
import { visit } from './helpers'

// About Us is a hub over two pages: /origins tells how the shop came to be, and
// /team is the roster. The hub itself also carries the two sections that used to
// sit under the landing page's event board.
//
// That last part is the one worth a test. Moving copy between pages is how copy
// gets lost — it disappears from one page, the other never gets it, and nothing
// fails because both pages still render.

test.describe('Origins', () => {
  test('tells the story, with the founders beside it', async ({ page }) => {
    await visit(page, '/origins')

    await expect(page.getByRole('heading', { name: 'Origins', level: 1 })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'How FunDivers came to be' })).toBeVisible()

    await expect(page.getByRole('heading', { name: 'Dennis Wong' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Billy Evalt' })).toBeVisible()
  })

  test('leads on to the roster', async ({ page }) => {
    await visit(page, '/origins')
    await page.locator('main a[href="/team"]').click()
    await expect(page).toHaveURL('/team')
  })

  // The founders' bios are on /team with everyone else's. Printing them here
  // too would repeat, a screen apart, what the story has just told you.
  test('does not repeat a bio the story already tells', async ({ page }) => {
    await visit(page, '/origins')
    await expect(page.getByText('Dennis Wong has been scuba diving since 1998')).toHaveCount(0)
  })
})

test.describe('the Team page', () => {
  test('lists everyone, founders included', async ({ page }) => {
    await visit(page, '/team')

    await expect(page.getByRole('heading', { name: 'The Team', level: 1 })).toBeVisible()
    for (const name of ['Dennis Wong', 'Billy Evalt', 'Mike Lee 李邁先', 'Eric Odle']) {
      await expect(page.getByRole('heading', { name }), `${name} is missing`).toBeVisible()
    }
  })

  test('profiles every person with an above-water and an underwater frame', async ({ page }) => {
    await visit(page, '/team')

    // Two frames each, captioned rather than merely present: a card with two
    // unlabelled boxes does not tell the reader that one is meant to be
    // underwater.
    const above = page.getByText('Above the water', { exact: true })
    const under = page.getByText('Under the water', { exact: true })

    const count = await above.count()
    expect(count, 'nobody on the roster has an above-water frame').toBe(4)
    await expect(under, 'the two frames do not come in pairs').toHaveCount(count)
  })

  test('says how long each person has been diving, where we know', async ({ page }) => {
    await visit(page, '/team')
    // Dennis and Billy state theirs in their own bios; the other two have not
    // been asked, and the row is left off rather than guessed at.
    // Exact: the bios say "scuba diving since 1998" too, and a substring match
    // would pass on the prose while the row itself was missing.
    await expect(page.getByText('Diving since 1998', { exact: true })).toBeVisible()
    await expect(page.getByText('Diving since 2008', { exact: true })).toBeVisible()
  })
})

test.describe('the About Us hub', () => {
  test('carries the copy that used to sit under the landing page', async ({ page }) => {
    await visit(page, '/about')

    await expect(page.getByRole('heading', { name: 'Explore our Services' })).toBeVisible()
    await expect(
      page.getByRole('heading', { name: /Diving in Taiwan/ }),
      'the Diving in Taiwan essay was lost in the move',
    ).toBeVisible()

    // And the tiles still lead somewhere, rather than having been pasted over
    // as pictures. Two of these used to point at the deploy-preview domain.
    for (const href of ['/courses', '/sites', '/gear', '/travel']) {
      await expect(page.locator(`main a[href="${href}"]`).first()).toBeVisible()
    }
  })
})

// The landing page gave that copy up, and what is left has to still be a page.
test('the landing page keeps the board and the contact form', async ({ page }) => {
  await visit(page, '/')

  await expect(page.getByRole('heading', { level: 1 })).toContainText('Breathe the Adventure')
  await expect(page.getByRole('heading', { name: 'Get In Touch' })).toBeVisible()

  // The moved sections are gone from here, not duplicated.
  await expect(page.getByRole('heading', { name: 'Explore our Services' })).toHaveCount(0)
})
