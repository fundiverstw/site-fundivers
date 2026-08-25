import { test, expect } from '@playwright/test'
import { visit, clickNavLink, chooseLanguage, watchForProblems } from './helpers'

// The "Surface Interval" feed and the article pages behind it. The unit tests
// (src/content/news.test.ts) check that the folders on disk assemble into the
// right articles; these check the part that only a browser can answer — that a
// card actually leads somewhere, and that a pasted article address works on a
// cold load rather than only after clicking through.

test('the news page lists articles, newest first', async ({ page }) => {
  const problems = watchForProblems(page)
  await visit(page, '/surface-interval')

  await expect(page.getByRole('heading', { name: 'Surface Interval', level: 1 })).toBeVisible()

  const cards = page.locator('article')
  await expect(cards.first()).toBeVisible()

  // Read the dates off the cards in the order they are painted and check they
  // descend. The <time datetime> attribute is the sortable form, so this does
  // not care how the date is worded or which language is showing.
  const dates = await page
    .locator('article time')
    .evaluateAll((els) => els.map((el) => el.getAttribute('datetime') ?? ''))
  expect(dates.length, 'no articles rendered').toBeGreaterThan(0)
  expect(dates, 'the feed is not newest-first').toEqual([...dates].sort().reverse())

  expect(problems.pageErrors).toEqual([])
})

test('clicking a card opens that article', async ({ page }) => {
  await visit(page, '/surface-interval')

  const headline = page.locator('article h2 a').first()
  const title = (await headline.textContent())?.trim()
  await headline.click()

  await expect(page).toHaveURL(/\/surface-interval\/.+/)
  await expect(page.getByRole('heading', { level: 1, name: title! })).toBeVisible()
})

// The SPA fallback has to serve /surface-interval/<slug> on a cold load, and the page has
// to read the slug back off the address rather than out of whatever state the
// feed left behind. Reloading is what tells those two apart.
test('an article opens directly, on a fresh load', async ({ page }) => {
  const problems = watchForProblems(page)
  await visit(page, '/surface-interval')
  const href = await page.locator('article h2 a').first().getAttribute('href')

  await visit(page, href!)
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()

  await page.reload()
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  expect(problems.pageErrors).toEqual([])
})

test('an unknown story says so instead of rendering an empty page', async ({ page }) => {
  await visit(page, '/surface-interval/no-such-story')

  await expect(page.getByText(/that story couldn.t be found/i)).toBeVisible()
})

test('the Surface Interval link in the navigation opens the feed', async ({ page, isMobile }) => {
  await visit(page, '/')

  await clickNavLink(page, 'Surface Interval', isMobile)

  await expect(page).toHaveURL('/surface-interval')
})

// News is the one content type allowed to ship untranslated: an article with no
// entry in news.ja.ts falls back to English rather than showing a blank page.
// The failure this rules out is the fallback being per-field instead of
// per-article, which would leave a headline in one language and a body in
// another — or worse, an empty <h1>.
//
// One test per language rather than a loop inside one: the chosen language is
// remembered, and the globe button's own label is translated with everything
// else — so a second `chooseLanguage` in the same page would be looking for a
// button that now reads 言語. A fresh test gets a fresh context.
for (const language of ['日本語', '中文'] as const) {
  test(`an untranslated article still reads in ${language}`, async ({ page }) => {
    await visit(page, '/surface-interval')
    const href = await page.locator('article h2 a').first().getAttribute('href')

    await visit(page, href!)
    await chooseLanguage(page, language)

    const heading = page.getByRole('heading', { level: 1 })
    await expect(heading).toBeVisible()
    expect((await heading.textContent())?.trim(), `empty headline in ${language}`).not.toBe('')
    // The body is the part that would go missing if the fallback were skipped.
    await expect(page.locator('article p').first()).not.toBeEmpty()
  })
}

// Every photo in a news folder gets alt text — the caption if it has one, the
// article title if not. A photo with an empty alt is invisible to a screen
// reader, and it is the kind of thing that is never noticed by looking.
test('every photo in an article is described', async ({ page }) => {
  await visit(page, '/surface-interval')
  const href = await page.locator('article h2 a').first().getAttribute('href')
  await visit(page, href!)

  const alts = await page
    .locator('article img')
    .evaluateAll((els) => els.map((el) => el.getAttribute('alt') ?? ''))
  for (const alt of alts) expect(alt.trim(), 'a photo has no alt text').not.toBe('')
})
