import { test, expect } from '@playwright/test'
import { visit } from './helpers'

// Davey's arcade, and the way in to it.
//
// The rules of the game are unit-tested in src/engine/arcade.test.ts — that is
// arithmetic and needs no browser. What only a browser can show is the part
// this file covers: that the octopus in the footer is findable and leads
// somewhere, that the canvas paints, and that the keys move something.

test('the octopus hidden in the footer opens his game', async ({ page }) => {
  await visit(page, '/')

  const davey = page.getByTestId('davey-egg')
  // On the page, but barely — he is meant to be spotted, not noticed.
  await expect(davey).toBeVisible()
  expect(await davey.evaluate((el) => Number(getComputedStyle(el).opacity))).toBeLessThan(0.2)

  await davey.click()
  await expect(page).toHaveURL('/arcade')
  await expect(page.getByRole('heading', { name: 'Davey’s Deep Trouble' })).toBeVisible()
})

// He is not in the footer's link map, and he must not turn up in the bar
// either — a signposted easter egg is a menu item.
test('is not advertised anywhere in the navigation', async ({ page }) => {
  await visit(page, '/')
  await expect(page.locator('header a[href="/arcade"]')).toHaveCount(0)
  await expect(page.locator('footer ul a[href="/arcade"]')).toHaveCount(0)
})

// A shared link has to work. An easter egg that 404s for the person you sent it
// to is a broken page, not a secret.
test('opens directly on a cold load', async ({ page }) => {
  await visit(page, '/arcade')
  await expect(page.getByTestId('arcade-canvas')).toBeVisible()
  await expect(page.getByTestId('arcade-start')).toBeVisible()
})

test('starts, and Davey has something to say about it', async ({ page }) => {
  await visit(page, '/arcade')

  await page.getByTestId('arcade-start').click()

  // The start overlay gets out of the way, and he starts complaining.
  await expect(page.getByTestId('arcade-start')).toHaveCount(0)
  await expect(page.getByTestId('arcade-taunt')).toContainText('buoyancy')
})

// The canvas is where the whole game is, so "did anything draw" is worth one
// direct look: an empty canvas and a crashed frame loop are the same screenshot
// otherwise.
test('paints the water and the divers', async ({ page }) => {
  await visit(page, '/arcade')
  await page.getByTestId('arcade-start').click()
  await page.waitForTimeout(500)

  const painted = await page.getByTestId('arcade-canvas').evaluate((el) => {
    const canvas = el as HTMLCanvasElement
    const ctx = canvas.getContext('2d')!
    const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const seen = new Set<string>()
    for (let i = 0; i < data.length; i += 4) seen.add(`${data[i]},${data[i + 1]},${data[i + 2]}`)
    return seen.size
  })
  // Water alone is a gradient of a few dozen shades; divers and an octopus add
  // plenty more. One flat color would mean nothing drew.
  expect(painted, 'the canvas is one flat color — nothing drew').toBeGreaterThan(20)
})

test('answers the keyboard', { tag: '@desktop-only' }, async ({ page }) => {
  await visit(page, '/arcade')
  await page.getByTestId('arcade-start').click()

  // Ink a diver: the score is DOM text rather than something painted into the
  // canvas, so the game is followable without seeing it.
  const score = page.getByTestId('arcade-score')
  await expect(score).toHaveText('0')

  // Hold the fire key down while turning: enough shots in enough directions to
  // hit one of the three groups on screen. How long that takes is luck — the
  // groups drift, the shots have a range — so wait for the score to move rather
  // than shoot for a fixed spell and then look. The game is driven by
  // requestAnimationFrame, so on a machine running eight of these at once it
  // gets fewer frames, which is fewer shots and a slower turn; a fixed 2.5s of
  // shooting passed alone and failed in a full run.
  await page.keyboard.down('Space')
  await page.keyboard.down('ArrowRight')
  await expect(score).not.toHaveText('0', { timeout: 15_000 })
  await page.keyboard.up('Space')
  await page.keyboard.up('ArrowRight')
})

test(
  'pauses when asked, and picks up where it left off',
  { tag: '@desktop-only' },
  async ({ page }) => {
    await visit(page, '/arcade')
    await page.getByTestId('arcade-start').click()
    await expect(page.getByTestId('arcade-start')).toHaveCount(0)

    await page.keyboard.press('p')
    await expect(page.getByText('Paused')).toBeVisible()

    await page.getByTestId('arcade-start').click()
    await expect(page.getByText('Paused')).toHaveCount(0)
  },
)
