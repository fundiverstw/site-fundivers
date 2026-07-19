import { test, expect, type Page } from '@playwright/test'
import { stubDatabase } from './helpers'

// The dive-site page shows a rising-water "descent" (see DiveDescent.svelte).
// On a mouse it takes the scroll over and pans the content itself; on a touch
// screen it leaves scrolling alone and only overlays the water.
//
// Every other spec runs with reduced motion on, which turns the descent off
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
  const cdp = await page.context().newCDPSession(page)
  await cdp.send('Input.dispatchTouchEvent', {
    type: 'touchStart',
    touchPoints: [{ x: 200, y: from }],
  })
  const step = from > to ? -25 : 25
  for (let y = from; step < 0 ? y >= to : y <= to; y += step) {
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: 200, y }] })
    await page.waitForTimeout(16)
  }
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
  await page.waitForTimeout(400)
}

test('@mobile-only a touch screen keeps its own scrolling', async ({ page }) => {
  await stubDatabase(page)
  await page.goto('/sites/bat-cave')
  await expect(page.locator('.overlay')).toBeAttached()

  // No takeover: the page is a normal scrolling page and nothing is pinned.
  await expect(page.locator('.vp')).toHaveCount(0)
  expect(await page.evaluate(() => document.documentElement.style.overflow)).toBe('')

  await swipe(page, 650, 150)
  const y = await page.evaluate(() => window.scrollY)
  expect(y).toBeGreaterThan(100)

  // The whole page is reachable, all the way to the footer.
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
  await page.waitForTimeout(400)
  await expect(page.locator('footer')).toBeInViewport()
})

test('@mobile-only the surface line follows the page as it scrolls', async ({ page }) => {
  await stubDatabase(page)
  await page.goto('/sites/bat-cave')
  await expect(page.locator('.overlay')).toBeAttached()

  const line = () =>
    page.evaluate(() =>
      parseFloat(getComputedStyle(document.querySelector('.flood')!).getPropertyValue('--line')),
    )

  const before = await line()
  await page.evaluate(() => window.scrollBy(0, 600))
  await page.waitForTimeout(300)
  const after = await line()

  // Scrolling down moves the surface up the screen by roughly what you scrolled.
  expect(before - after).toBeGreaterThan(400)
})

test('@desktop-only a mouse gets the scroll takeover, set up once', async ({ page }) => {
  // The pan is driven by state the setup code also reads. If that read is
  // tracked, every frame of a scroll tears the takeover down and rebuilds it.
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

  // A couple of setups at mount are fine — the effect legitimately re-runs once
  // when bind:this lands. What must not happen is another one during a scroll.
  const setups = () => page.evaluate(() => (window as unknown as { __setups: number }).__setups)
  const atRest = await setups()

  await page.mouse.move(200, 400)
  await page.mouse.wheel(0, 600)
  await page.waitForTimeout(600)

  expect(await panned(page)).toBeGreaterThan(100)
  expect(await setups()).toBe(atRest)
})
