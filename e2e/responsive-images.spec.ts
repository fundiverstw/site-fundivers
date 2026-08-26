import { test, expect } from '@playwright/test'
import { visit } from './helpers'

// Guards the sized-photo pipeline (vite.images.ts), which fails silently.
//
// The failure that prompted these tests: the plugin ran after Vite's own asset
// handling, so Vite answered every photo import first and each `<img>` got the
// original full-size file. The build succeeded, the pages looked right, the
// tests passed, and the only symptom was that the site was still slow — the
// exact thing the pipeline exists to prevent. Nothing short of looking at the
// emitted attributes catches that, so this looks at them.

/** Pages with photos on them, and the width each one's photos should stay under. */
//
// 960 is the top of the ladder (WIDTHS in vite.images.ts), and these pages do
// reach it: a card declares 92vw on a phone, which on the Pixel 7 this suite
// drives — 412px wide at a device pixel ratio of 2.625 — asks for ~995px and
// takes the largest copy there is. So the limit is tight rather than generous;
// anything above it means a copy was served that the ladder should not contain.
// The landing page is not in this list any more: it is the event board and
// nothing else, and every photo on it comes from the database — which these
// tests stub out. /about is where its static photography went.
const PAGES = [
  { route: '/about', limit: 960 },
  { route: '/courses', limit: 960 },
  // The gallery grid is capped harder than the layout would imply — see the
  // `gallery` entry in src/engine/responsive-image.ts for why. 70vw on the same
  // phone asks for ~757px and takes the 768 copy; on desktop the 22rem column
  // takes 384. A thumbnail above 768 means that cap has been undone.
  { route: '/sealife', limit: 768 },
]

for (const { route, limit } of PAGES) {
  test(`photos on ${route} are served in sized copies`, async ({ page }) => {
    await visit(page, route)
    await page.waitForLoadState('networkidle')

    // `.avif` matters as much as `/assets/`: the bundler fingerprints the logos
    // into /assets/ too, and a logo is a single flat image with no srcset by
    // design. Matching on the directory alone swept them in and failed every
    // page for the one image on it that is not a photograph. Everything the
    // sized-photo pipeline emits is AVIF; nothing else on the site is.
    const photos = page.locator('img[src*="/assets/"][src$=".avif"]')
    const count = await photos.count()
    expect(count, `no bundled photos found on ${route} — has the page changed?`).toBeGreaterThan(0)

    for (let i = 0; i < count; i++) {
      const img = photos.nth(i)
      const [src, srcset, sizes] = await Promise.all([
        img.getAttribute('src'),
        img.getAttribute('srcset'),
        img.getAttribute('sizes'),
      ])
      // `srcset` says which copies exist; `sizes` says which to take. A photo
      // with the first and not the second gets the largest copy every time,
      // which is the bug wearing a disguise.
      expect(srcset, `${src} on ${route} has no srcset`).toBeTruthy()
      expect(sizes, `${src} on ${route} has no sizes`).toBeTruthy()

      // Normally a photo offers several copies. The one honest exception is a
      // source smaller than the bottom of the ladder: vite.images.ts emits the
      // original alone rather than inventing detail by upscaling it, and three
      // of the staff portraits are 256px files. So a single copy is allowed
      // only when it is narrower than the smallest step — which is still the
      // failure this test is for, since a full-size photo served as one copy
      // means the pipeline did not run.
      const offered = srcset!
        .split(',')
        .map((part) => Number(part.trim().split(/\s+/)[1]?.slice(0, -1)))
      if (offered.length === 1) {
        expect(
          offered[0],
          `${src} on ${route} offers only one size, and it is not a small original`,
        ).toBeLessThan(384)
      }
    }
  })

  test(`${route} downloads no photo wider than it needs`, async ({ page }) => {
    const widths: Array<{ url: string; width: number }> = []
    page.on('response', (res) => {
      const m = res.url().match(/-(\d+)-[^/]+\.avif$/)
      if (m) widths.push({ url: res.url(), width: Number(m[1]) })
    })

    await visit(page, route)
    await page.waitForLoadState('networkidle')
    // Scroll, so the lazy photos below the fold are fetched and checked too.
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 600) {
        window.scrollTo(0, y)
        await new Promise((r) => setTimeout(r, 50))
      }
    })
    await page.waitForLoadState('networkidle').catch(() => {})

    // Assert we saw sized copies at all before judging their width. Without
    // this the test passes when the pipeline is switched off entirely: no
    // generated copies means no URLs to match, an empty list, and a green tick
    // for the one situation it exists to catch.
    expect(widths.length, `${route} fetched no sized copies at all`).toBeGreaterThan(0)

    const tooBig = widths.filter((w) => w.width > limit)
    expect(tooBig, `${route} fetched copies wider than ${limit}px`).toEqual([])
  })
}

test('the lightbox shows the full-size photo, not the thumbnail', async ({ page }) => {
  // The other half of the gallery bargain: the grid is capped because the
  // lightbox is not. If this ever picks the thumbnail, the cap stops being a
  // trade and just becomes a downgrade.
  await visit(page, '/sealife')
  await page.waitForLoadState('networkidle')

  // The gallery grid's photos are each wrapped in a button that opens the
  // lightbox; the first one is inside the section that starts expanded.
  await page.locator('.columns-1, [class*="columns-"]').locator('button:has(img)').first().click()

  // Scoped to the overlay, not `img.last()` — the last image in the document is
  // the footer logo, which has no `sizes` and made this pass for the wrong
  // reason until it didn't.
  const overlay = page.locator('div.fixed.inset-0.z-50')
  await expect(overlay).toBeVisible()

  const shown = overlay.locator('img').first()
  await expect(shown).toBeVisible()
  expect(await shown.getAttribute('sizes')).toBe('100vw')

  // And it must offer something bigger than the grid's own cap, or "full size"
  // means nothing. Phrased against that cap rather than against a literal width
  // on purpose: the top of the ladder has moved once already (there used to be
  // a 1216 copy, dropped to keep the edge cache warm) and a test naming the
  // largest width fails on the next such change without anything being wrong.
  const srcset = await shown.getAttribute('srcset')
  const widths = [...srcset!.matchAll(/ (\d+)w/g)].map((m) => Number(m[1]))
  expect(
    Math.max(...widths),
    `lightbox offers nothing above the grid cap: ${srcset}`,
  ).toBeGreaterThan(768)
})
