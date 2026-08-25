import { test, expect, type Page } from '@playwright/test'
import { visit } from './helpers'

// The site is four sections, and each one exists twice: as a dropdown in the bar
// and as a hub page listing the same children. Two copies of one structure is
// exactly the arrangement that drifts — a page gets added to the menu and not
// the hub, and nobody notices because both still look finished.
//
// $content/navigation is the single list they are both built from, so these
// tests read it and check both renderings against it. A page added there and
// nowhere else fails here rather than going quietly missing from one of them.

/** Mirrors SECTIONS in src/content/navigation.ts. Spelled out rather than
 *  imported: a test that reads the same file the page reads would agree with it
 *  even when both are wrong. */
const SECTIONS = [
  { id: 'education', href: '/education', label: 'Education', items: ['/courses', '/sealife'] },
  {
    id: 'community',
    href: '/community',
    label: 'Community',
    items: ['/surface-interval', '/testimonials', '/reviews', '/radio', '/fundive'],
  },
  { id: 'about', href: '/about', label: 'About Us', items: ['/origins', '/team'] },
  {
    id: 'go-diving',
    href: '/go-diving',
    label: 'Go Diving',
    items: ['/calendar', '/sites', '/map', '/travel', '/build-trip'],
  },
]

const wrapper = (page: Page, id: string) =>
  page.locator(`header [data-nav-section="${id}"]:visible`)

// Scoped to the bar itself, not to <header>: the octopus who peeks out from
// behind the logo also lives in the header and links at /build-trip, so a
// header-wide locator finds two of that one and none of the bug it is looking
// for.
const barLink = (page: Page, href: string) => page.locator(`header nav a[href="${href}"]`)

test.describe('the section dropdowns', { tag: '@desktop-only' }, () => {
  test('stay shut until asked', async ({ page }) => {
    await visit(page, '/')
    for (const s of SECTIONS) {
      for (const href of s.items) {
        await expect(
          barLink(page, href),
          `${href} is in the bar before its section is opened`,
        ).toHaveCount(0)
      }
    }
  })

  test('open on hover and list every page in that section', async ({ page }) => {
    await visit(page, '/')
    for (const s of SECTIONS.filter((x) => x.items.length)) {
      await wrapper(page, s.id).hover()
      for (const href of s.items) {
        await expect(
          barLink(page, href),
          `${href} is missing from the ${s.label} menu`,
        ).toHaveCount(1)
      }
    }
  })

  // There is no caret: the section link is the only control. So focus has to do
  // what hover does, or the menus are a pointer-only feature — and that is the
  // half that silently stops working, because with a mouse you never notice.
  test('open when the section takes focus, for anyone without a pointer', async ({ page }) => {
    await visit(page, '/')
    const link = barLink(page, '/community').first()
    await expect(link).toHaveAttribute('aria-expanded', 'false')

    await link.focus()

    await expect(link).toHaveAttribute('aria-expanded', 'true')
    await expect(barLink(page, '/testimonials')).toBeVisible()

    // And the next Tab walks into the menu rather than past it.
    await page.keyboard.press('Tab')
    await expect(barLink(page, '/surface-interval')).toBeFocused()
  })

  test('say that they have a menu at all', async ({ page }) => {
    // Without a caret there is nothing on screen announcing that a section
    // holds anything. aria-haspopup is the only thing left saying so, which
    // makes it load-bearing rather than a nicety.
    await visit(page, '/')
    await expect(barLink(page, '/education').first()).toHaveAttribute('aria-haspopup', 'menu')
    // About Us has children too; Go Diving and Community likewise. A section
    // with none must not claim otherwise — there is no such section right now,
    // so this is checked the moment one appears.
    for (const s of SECTIONS.filter((x) => !x.items.length)) {
      await expect(barLink(page, s.href).first()).not.toHaveAttribute('aria-haspopup', 'menu')
    }
  })

  // Playwright's hover() teleports the pointer, which is exactly the motion a
  // real visitor never makes. These four walk it, click it and press keys at it,
  // because every one of them was broken in a way hover() could not see.

  test('survives the trip from the label down into the menu', async ({ page }) => {
    // The menu hangs below the section with a gap between the two. Cross that
    // gap and the pointer is briefly over neither, which fired pointerleave and
    // shut the menu — so the item you were reaching for vanished under the
    // pointer on the way to it.
    await visit(page, '/')
    const label = (await wrapper(page, 'education').boundingBox())!
    await page.mouse.move(label.x + label.width / 2, label.y + label.height / 2)

    const item = barLink(page, '/courses')
    await expect(item).toBeVisible()
    const target = (await item.boundingBox())!

    // Walk down, a few pixels at a time, the way a hand does.
    const from = label.y + label.height / 2
    const to = target.y + target.height / 2
    for (let y = from; y <= to; y += 3) {
      await page.mouse.move(label.x + label.width / 2, y)
    }

    await expect(item, 'the menu shut while the pointer was on its way to it').toBeVisible()
    await item.click()
    await expect(page).toHaveURL('/courses')
  })

  test('shut when the pointer moves off the bar', async ({ page }) => {
    await visit(page, '/')
    await wrapper(page, 'education').hover()
    await expect(barLink(page, '/courses')).toBeVisible()

    await page.locator('main').hover()
    await expect(barLink(page, '/courses'), 'the menu stayed open').toHaveCount(0)
  })

  test('Escape shuts it, and gives the section link back the focus', async ({ page }) => {
    await visit(page, '/')
    const link = barLink(page, '/community').first()
    await link.focus()
    await expect(barLink(page, '/reviews')).toBeVisible()

    await page.keyboard.press('Escape')
    await expect(barLink(page, '/reviews')).toHaveCount(0)
    // Not left inside a menu that is no longer on screen — the next Tab has to
    // start from somewhere the visitor can see.
    await expect(link).toBeFocused()
  })

  test('the whole label is the link', async ({ page }) => {
    // A caret used to sit over the last few pixels of the word, so a click at
    // the end of it opened the menu instead of the page. Nothing sits there now,
    // and nothing should again.
    await visit(page, '/')
    const box = (await barLink(page, '/education').first().boundingBox())!

    await page.mouse.click(box.x + box.width - 2, box.y + box.height / 2)
    await expect(page).toHaveURL('/education')
  })

  test('only one is open at a time', async ({ page }) => {
    await visit(page, '/')
    await wrapper(page, 'education').hover()
    await expect(barLink(page, '/courses')).toBeVisible()

    await wrapper(page, 'go-diving').hover()
    await expect(barLink(page, '/calendar')).toBeVisible()
    await expect(barLink(page, '/courses')).toHaveCount(0)
  })

  // The section label is a link, not just a menu handle. A dropdown-only bar
  // would leave four pages with no way in but the address bar.
  test('the section label opens its own hub page', async ({ page }) => {
    await visit(page, '/')
    await barLink(page, '/education').first().click()
    await expect(page).toHaveURL('/education')
    await expect(page.getByRole('heading', { name: 'Education', level: 1 })).toBeVisible()
  })
})

// The mobile menu takes the opposite approach: nothing to open, everything
// listed. Four collapsed sections on a phone is four taps to reach one page.
test('the mobile menu lists every section expanded', { tag: '@mobile-only' }, async ({ page }) => {
  await visit(page, '/')
  await page.locator('button[data-testid="menu-toggle"]:visible').click()

  for (const s of SECTIONS) {
    await expect(page.locator(`header a[href="${s.href}"]:visible`)).toHaveCount(1)
    for (const href of s.items) {
      await expect(
        page.locator(`header a[href="${href}"]:visible`),
        `${href} is missing from the mobile menu`,
      ).toHaveCount(1)
    }
  }
})

test.describe('the hub pages', () => {
  for (const s of SECTIONS.filter((x) => x.items.length)) {
    test(`${s.href} links to everything in its section`, async ({ page }) => {
      await visit(page, s.href)
      const main = page.locator('main')

      for (const href of s.items) {
        await expect(
          main.locator(`a[href="${href}"]`),
          `${s.href} does not link to ${href}`,
        ).toHaveCount(1)
      }
    })
  }

  // Go Diving was asked for as five equal ways into the water, not three with
  // two afterthoughts. Equal means the same card in the same grid — so if one
  // ever grows a different size, the boxes stop matching.
  test('/go-diving gives its five cards the same weight', async ({ page }) => {
    await visit(page, '/go-diving')
    const hrefs = ['/calendar', '/sites', '/map', '/travel', '/build-trip']

    const widths: number[] = []
    for (const href of hrefs) {
      const box = await page.locator(`main a[href="${href}"]`).boundingBox()
      expect(box, `no card for ${href}`).not.toBeNull()
      widths.push(Math.round(box!.width))
    }
    expect(new Set(widths).size, `the cards are not the same size: ${widths}`).toBe(1)
  })
})

// Bookmarks, search results and the shop's old site still point at the three
// addresses that moved. They are rewritten rather than 404'd — and the rewrite
// has to survive a cold load, which is the case that goes through Cloudflare's
// SPA fallback rather than through the router.
test.describe('the addresses that moved', () => {
  for (const [from, to] of [
    ['/photos', '/sealife'],
    ['/news', '/surface-interval'],
    ['/sites/bat-cave', '/bat-cave'],
  ]) {
    test(`${from} lands on ${to}`, async ({ page }) => {
      await visit(page, from)
      await expect(page).toHaveURL(to)
      await expect(page.locator('main h1').first()).toBeVisible()
    })
  }

  test('an anchor survives the move', async ({ page }) => {
    // The dive-site pages linked at /photos#<creature> for a long time. Losing
    // the anchor would land the reader on the gallery with sixty sections shut
    // and no sign of the one they clicked.
    await visit(page, '/photos#nudibranchs')
    await expect(page).toHaveURL('/sealife#nudibranchs')
  })

  test('going back from a moved address does not bounce', async ({ page }) => {
    // The rewrite is a replaceState, not a push. If it pushed, Back would
    // return to the old address, which would redirect forward again — and the
    // Back button would appear to be broken.
    await visit(page, '/')
    await page.evaluate(() => history.pushState({}, '', '/photos'))
    await page.evaluate(() => window.dispatchEvent(new Event('app:navigate')))
    await expect(page).toHaveURL('/sealife')

    await page.goBack()
    await expect(page).toHaveURL('/')
  })
})
