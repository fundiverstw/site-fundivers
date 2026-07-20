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
const PAGES = [
  { route: '/', limit: 1216 },
  { route: '/courses', limit: 1216 },
  { route: '/team', limit: 1216 },
  // The gallery grid is capped harder than the layout would imply — see the
  // `gallery` entry in src/engine/responsive-image.ts for why. A thumbnail
  // reaching for the 1216 copy means that cap has been undone.
  { route: '/photos', limit: 960 },
]

for (const { route, limit } of PAGES) {
  test(`photos on ${route} are served in sized copies`, async ({ page }) => {
    await visit(page, route)
    await page.waitForLoadState('networkidle')

    const photos = page.locator('img[src*="/assets/"]')
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
      expect(srcset!.split(',').length, `${src} on ${route} offers only one size`).toBeGreaterThan(
        1,
      )
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
  await visit(page, '/photos')
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
  // And it must offer the large copies, or "full size" means nothing.
  expect(await shown.getAttribute('srcset')).toContain('1216w')
})
