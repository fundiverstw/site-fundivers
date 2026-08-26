import { test, expect, type Page } from '@playwright/test'
import { visit } from './helpers'
import { pricesFixture, type Row } from './fixtures'

// The landing page is three bands, one per kind of visitor, and on a desktop all
// three are on the first screen: 25% / 50% / 25%.
//
//   A  start        someone who has never dived
//   B  coming       a certified diver — the shop's main custom, hence the half
//   C  plan         a diver who plans their own diving
//
// The proportions are the whole design, so they are measured rather than
// trusted, and so is the promise that nobody has to scroll to reach band C.

/** Upcoming events a week out, including a course — which band B must not show. */
function db(): Record<string, Row[]> {
  const rows: Row[] = []
  const kinds: Array<[string, string, boolean]> = [
    ['dive', 'Bat Cave shore dive', false],
    ['dive', 'Penghu boat weekend', true],
    ['course', 'Open Water course', false],
    ['adventure', 'Taipei YouBike tour', false],
    ['dive', 'Longdong night dive', false],
  ]
  kinds.forEach(([kind, title, featured], i) => {
    const d = new Date()
    d.setDate(d.getDate() + 3 + i)
    const pad = (x: number) => String(x).padStart(2, '0')
    const date = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
    rows.push({
      cancelled_at: null,
      is_private: false,
      id: `ev-${i}`,
      kind,
      admin_title: 'FUN',
      display_title: title,
      calendar_title: title,
      start_date: date,
      start_time: '08:30:00',
      end_date: date,
      featured,
      fully_booked: false,
      capacity: 8,
      price: null,
      is_trip: false,
      is_boat_dive: true,
    })
  })
  return { events: rows, prices: pricesFixture }
}

const band = (page: Page, name: string) => page.locator(`[data-band="${name}"]`)

test.describe('the three bands', () => {
  test('are all there, in order', async ({ page }) => {
    await visit(page, '/', db())

    await expect(page.getByRole('heading', { name: 'Start diving' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'What’s coming up' })).toBeVisible()
    await expect(
      page.getByRole('heading', { name: 'Resources for experienced divers' }),
    ).toBeVisible()

    const order = await page.evaluate(() =>
      [...document.querySelectorAll('[data-band]')].map((el) => el.getAttribute('data-band')),
    )
    expect(order).toEqual(['start', 'coming', 'plan'])
  })

  test(
    'split the screen 25 / 50 / 25, with nothing below the fold',
    {
      tag: '@desktop-only',
    },
    async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 })
      await visit(page, '/', db())
      await page.waitForLoadState('networkidle')

      const m = await page.evaluate(() => {
        const h = (n: string) =>
          document.querySelector(`[data-band="${n}"]`)!.getBoundingClientRect()
        const a = h('start'),
          b = h('coming'),
          c = h('plan')
        return { a: a.height, b: b.height, c: c.height, bottom: c.bottom, vh: window.innerHeight }
      })

      // Band B carries the shop's main custom and is deliberately twice either
      // neighbour. Measured with tolerance rather than exactly: the bands have
      // content with its own minimum height, so the ratio lands near 2, not on it.
      expect(m.b / m.a, `B is ${m.b} and A is ${m.a} — B should be about double`).toBeGreaterThan(
        1.7,
      )
      expect(m.b / m.a).toBeLessThan(2.3)
      expect(m.a, 'the two outer bands are not the same size').toBeCloseTo(m.c, 0)

      // The point of sizing them at all: band C is reachable without scrolling.
      expect(m.bottom, 'band C is below the fold').toBeLessThanOrEqual(m.vh)
    },
  )

  // On a phone three bands of real content cannot share one screen, so they
  // stack and scroll. What must not happen is one of them being dropped.
  test('all still render on a phone', { tag: '@mobile-only' }, async ({ page }) => {
    await visit(page, '/', db())
    for (const name of ['start', 'coming', 'plan']) {
      await expect(band(page, name)).toBeVisible()
    }
  })
})

test.describe('A · start diving', () => {
  test('is a ladder from the first breath to going pro', async ({ page }) => {
    await visit(page, '/', db())

    // In order, and each rung is the course it names — a ladder whose rungs do
    // not lead anywhere is a picture of a course list, not a way into one.
    const hrefs = await band(page, 'start')
      .locator('ol a')
      .evaluateAll((els) => els.map((e) => e.getAttribute('href')))
    expect(hrefs).toEqual([
      '/courses/padi-open-water-course',
      '/courses/padi-advanced-course',
      '/courses/padi-rescue-diver-course',
      '/courses/padi-divemaster-course',
    ])
  })

  test('offers the three ways to look around before committing', async ({ page }) => {
    await visit(page, '/', db())
    for (const href of ['/sealife', '/map', '/about']) {
      await expect(band(page, 'start').locator(`a[href="${href}"]`)).toHaveCount(1)
    }
  })
})

test.describe('B · what’s coming up', () => {
  test('shows dives and adventures but not courses', async ({ page }) => {
    await visit(page, '/', db())

    const tiles = band(page, 'coming').locator('button')
    await expect(tiles.filter({ hasText: 'Bat Cave shore dive' })).toHaveCount(1)
    await expect(tiles.filter({ hasText: 'Taipei YouBike tour' })).toHaveCount(1)
    // Courses belong to band A, which sends people to the course pages. A
    // course tile here would be the beginners' content in the divers' band.
    await expect(
      tiles.filter({ hasText: 'Open Water course' }),
      'a course leaked into the certified divers’ band',
    ).toHaveCount(0)
  })

  test('puts the featured event first', async ({ page }) => {
    await visit(page, '/', db())
    // Penghu is third by date and featured, so ordering by date alone would
    // bury it — which is the whole point of the flag.
    await expect(band(page, 'coming').locator('button').first()).toContainText(
      'Penghu boat weekend',
    )
  })

  test('carries the community rail beside the events', async ({ page }) => {
    await visit(page, '/', db())
    for (const href of ['/surface-interval', '/radio', '/testimonials', '/reviews']) {
      await expect(band(page, 'coming').locator(`a[href="${href}"]`)).toHaveCount(1)
    }
  })

  test('says so when there is nothing on the schedule', async ({ page }) => {
    // A quiet week is the state most visitors will never see and the one most
    // likely to render as an empty box.
    await visit(page, '/')
    await expect(band(page, 'coming')).toContainText('Nothing scheduled yet')
  })
})

test('C · plan your own leads to every Go Diving page', async ({ page }) => {
  await visit(page, '/', db())
  for (const href of ['/calendar', '/sites', '/map', '/travel', '/build-trip']) {
    await expect(band(page, 'plan').locator(`a[href="${href}"]`)).toHaveCount(1)
  }
})

// The slogan moved out of the page and into the header, where it sits under the
// logo on every page. Two things have to hold: it is not a heading (the same
// words on every page tell a screen reader nothing about where it is), and it is
// centered on the logo rather than on the page.
test.describe('the slogan', () => {
  test('sits under the logo, centered on it', async ({ page, isMobile }) => {
    await visit(page, '/')

    const logo = page.locator('header img[alt="FunDivers TW"]:visible').first()
    const slogan = page.locator('header p.slogan:visible').first()
    await expect(slogan).toHaveText('Breathe the Adventure. Explore with Confidence.')

    const l = (await logo.boundingBox())!
    const s = (await slogan.boundingBox())!

    expect(s.y, 'the slogan is not below the logo').toBeGreaterThanOrEqual(l.y + l.height - 2)
    expect(
      Math.abs(l.x + l.width / 2 - (s.x + s.width / 2)),
      'the slogan is not centered on the logo',
    ).toBeLessThan(isMobile ? 8 : 4)
  })

  test('is not a heading, and does not displace the page’s own', async ({ page }) => {
    await visit(page, '/')

    await expect(page.locator('header').getByRole('heading')).toHaveCount(0)
    // The page keeps an <h1> of its own — unseen, because the visible words are
    // in the header, but present so the document does not start at <h2>.
    const h1 = page.getByRole('heading', { level: 1 })
    await expect(h1).toHaveCount(1)
    await expect(h1).toContainText('Breathe the Adventure')
  })
})
