import { test, expect, type Page } from '@playwright/test'
import { stubDatabase } from './helpers'

// The dive-site page is a scroll takeover: native scrolling is switched off and
// the content is panned by a transform instead (see DiveDescent.svelte).
//
// Every other spec runs with reduced motion on, which turns the takeover off
// entirely — so nothing else here exercises this code at all. That is how a bug
// that froze the page on touch devices shipped unnoticed. These tests opt back
// in deliberately.
test.use({ contextOptions: { reducedMotion: 'no-preference' } })

/** How far the takeover has panned the content, in pixels. 0 = at the top. */
async function panned(page: Page): Promise<number> {
  return page.evaluate(() => {
    const inner = document.querySelector('.inner')
    if (!inner) return NaN
    const y = new DOMMatrix(getComputedStyle(inner).transform).m42
    return y === 0 ? 0 : -y // negating 0 gives -0, which fails toBe(0)
  })
}

/** Drag a finger up the screen, the way you scroll down on a phone. */
async function swipe(page: Page, from: number, to: number): Promise<void> {
  const step = from > to ? -25 : 25
  await page.touchscreen.tap(1, 1) // ensure the touch pipeline is warm
  const cdp = await page.context().newCDPSession(page)
  await cdp.send('Input.dispatchTouchEvent', {
    type: 'touchStart',
    touchPoints: [{ x: 200, y: from }],
  })
  for (let y = from; step < 0 ? y >= to : y <= to; y += step) {
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: 200, y }] })
    await page.waitForTimeout(16)
  }
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
  await page.waitForTimeout(600) // the pan is eased, so let it settle
}

test('@mobile-only a finger swipe scrolls the dive-site page', async ({ page }) => {
  await stubDatabase(page)
  await page.goto('/sites/bat-cave')
  await expect(page.locator('.vp')).toBeVisible()
  expect(await panned(page)).toBe(0)

  await swipe(page, 650, 150)
  const down = await panned(page)
  expect(down).toBeGreaterThan(100)

  // And back up again, so a swipe the other way is not a one-way trip.
  await swipe(page, 150, 650)
  expect(await panned(page)).toBeLessThan(down)
})

test('the takeover is set up once, not rebuilt as it scrolls', async ({ page }) => {
  // The pan is driven by state the setup code also reads. If that read is
  // tracked, every frame of a scroll tears the takeover down and rebuilds it —
  // which is what broke touch, because the handlers lost the finger's position.
  await page.addInitScript(() => {
    const w = window as unknown as { __setups: number }
    w.__setups = 0
    const add = window.addEventListener.bind(window)
    window.addEventListener = function (type: string, ...rest: unknown[]) {
      if (type === 'wheel') w.__setups++
      return (add as (...a: unknown[]) => void)(type, ...rest)
    } as typeof window.addEventListener
  })
  await stubDatabase(page)
  await page.goto('/sites/bat-cave')
  await expect(page.locator('.vp')).toBeVisible()

  await page.mouse.move(200, 400)
  await page.mouse.wheel(0, 600)
  await page.waitForTimeout(600)

  expect(await panned(page)).toBeGreaterThan(100)
  expect(await page.evaluate(() => (window as unknown as { __setups: number }).__setups)).toBe(1)
})
