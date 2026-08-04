import { test, expect, type Page } from '@playwright/test'
import { visit } from './helpers'
import { pricesFixture, type Row } from './fixtures'

// The octopus in the nav slides out from behind the logo about a second after
// the page settles, works through a short list of things worth clicking — four
// seconds each — and ducks back behind the logo when he runs out.
//
// None of that is verifiable by reading the component: it is timers, a lazily
// imported fetch, and a stacking order. These watch it happen.

/** Whichever pitch is on screen, if any. The nav links to several of the same
 *  addresses, so this goes by test id rather than by href. */
const bubble = (page: Page) => page.getByTestId('octopus-pitch')

/** Wait for the pitch pointing at `href` to come round. */
async function expectPitch(page: Page, href: string, timeout = 8000) {
  await expect(bubble(page)).toHaveAttribute('href', href, { timeout })
}

const FEATURED = 'Penghu boat weekend'

/** A featured dive a week out, so "upcoming" holds whatever day the suite runs.
 *  The shared fixture pins its events to fixed days of the current month, which
 *  is fine for the calendar (it opens on this month) but would leave this test
 *  with nothing upcoming for most of it. */
function db(): Record<string, Row[]> {
  const d = new Date()
  d.setDate(d.getDate() + 7)
  const pad = (x: number) => String(x).padStart(2, '0')
  const date = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
  return {
    events: [
      {
        cancelled_at: null,
        is_private: false,
        id: 'octo-featured',
        kind: 'dive',
        admin_title: 'FUN',
        display_title: FEATURED,
        calendar_title: FEATURED,
        start_date: date,
        start_time: '08:30:00',
        end_date: date,
        featured: true,
        fully_booked: false,
        capacity: 8,
        price: null,
        is_trip: true,
        is_boat_dive: true,
      },
    ],
    prices: pricesFixture,
  }
}

// The suite runs with `reducedMotion: 'reduce'` (playwright.config.ts), under
// which the octopus deliberately does not animate or rotate — he just sits
// there holding the first pitch. So the rotation has to ask for motion back.
test.describe('the rotation', () => {
  test.use({ contextOptions: { reducedMotion: 'no-preference' } })

  test('works through every pitch in order, then ducks back', async ({ page }) => {
    await visit(page, '/', db())

    await expectPitch(page, '/build-trip')
    await expectPitch(page, '/news')
    await expectPitch(page, '/calendar')
    await expectPitch(page, '/fundive')

    // …and then he leaves, rather than looping straight round again.
    await expect(bubble(page)).toHaveCount(0, { timeout: 8000 })
  })

  test('names the real featured event', async ({ page }) => {
    await visit(page, '/', db())

    await expectPitch(page, '/calendar', 12000)
    // Reaching this slide at all proves the lazy import of $engine/events
    // resolved and the fetch ran; this pins that it shows the right row.
    await expect(bubble(page)).toContainText(FEATURED)
  })

  test('skips the event pitch when nothing is featured', async ({ page }) => {
    // Empty database — the calendar has nothing to shout about, so that line is
    // dropped rather than shown empty, and the run is one pitch shorter.
    await visit(page, '/')

    await expectPitch(page, '/build-trip')
    await expectPitch(page, '/news')
    // Straight to FunDive: the event line is not in the run at all.
    await expectPitch(page, '/fundive')
  })
})

// Reduced motion is the default for the rest of the suite, and is its own
// behaviour worth pinning: he appears, holds one pitch, and never moves. The
// failure this rules out is the easy reading of "respect reduced motion" —
// hiding him entirely, which silently withholds four links from those readers.
test('still shows up, without moving, for reduced motion', async ({ page }) => {
  await visit(page, '/', db())

  await expectPitch(page, '/build-trip')

  // Still the same pitch well after the rotation interval would have advanced.
  await page.waitForTimeout(5000)
  await expect(bubble(page)).toHaveAttribute('href', '/build-trip')
})

test('dismissing him ends it for the session', async ({ page }) => {
  await visit(page, '/', db())
  await expect(bubble(page)).toHaveCount(1)

  await page.getByRole('button', { name: 'Dismiss' }).click()
  await expect(bubble(page)).toHaveCount(0)

  // Still gone after a reload — sessionStorage, not component state.
  await page.reload()
  await page.waitForTimeout(2000)
  await expect(bubble(page)).toHaveCount(0)
})

// He is supposed to come out of the logo's right edge. Two things have to hold:
// he sits beside the logo rather than below the bar, and he paints *underneath*
// it, so the tucked-away position genuinely hides him instead of parking an
// octopus on top of the wordmark.
test(
  'comes out of the logo, not from under the bar',
  { tag: '@desktop-only' },
  async ({ page }) => {
    await visit(page, '/', db())
    await expect(bubble(page)).toHaveCount(1)

    const logo = page.locator('header img[alt="FunDivers TW"]:visible').first()
    const octopus = page.locator('header svg[aria-hidden="true"]').first()

    const logoBox = (await logo.boundingBox())!
    const octoBox = (await octopus.boundingBox())!

    // Vertically overlapping the logo — beside it, not hanging below the header.
    expect(octoBox.y, 'the octopus hangs below the logo').toBeLessThan(logoBox.y + logoBox.height)
    expect(octoBox.y + octoBox.height, 'the octopus sits above the logo').toBeGreaterThan(logoBox.y)

    // And he starts at the logo's right-hand end, not past it or back at the left.
    const logoRight = logoBox.x + logoBox.width
    expect(octoBox.x, 'the octopus is not at the logo’s right edge').toBeGreaterThan(
      logoBox.x + logoBox.width / 2,
    )
    expect(octoBox.x, 'the octopus has drifted past the logo').toBeLessThan(logoRight + 20)
  },
)

// On a phone the bubble drops below the header — which is exactly where the
// hamburger menu opens. It used to land on top of the menu's first link and eat
// the tap: the link was visible, hit-testable and completely unclickable, and
// the only symptom was that tapping "Courses" did nothing.
test('gets out of the way of the mobile menu', { tag: '@mobile-only' }, async ({ page }) => {
  await visit(page, '/', db())
  await expect(bubble(page)).toHaveCount(1)

  await page.locator('button[data-testid="menu-toggle"]:visible').click()
  await expect(bubble(page), 'the octopus is sitting on the open menu').toHaveCount(0)

  // And the first link in the menu is genuinely clickable, not merely present.
  await page.locator('header a[href="/courses"]:visible').click()
  await expect(page).toHaveURL('/courses')
})
