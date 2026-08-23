import { test, expect } from '@playwright/test'
import { visit } from './helpers'

// The flashcard quiz. The whole point of it is that the answer is hidden until
// you ask for it, so that is what these check: a card that shows its answer
// before the reader has guessed is the one bug worth catching here.

test.describe('the marine-life quiz', () => {
  test('starts face down and reveals both names when the card is tapped', async ({ page }) => {
    await visit(page, '/quiz')

    const card = page.getByTestId('quiz-card')
    // Scoped to the card: the page's own subtitle talks about guessing too, and
    // that line never goes away.
    const prompt = card.getByText(/tap the photo/i)
    await expect(prompt).toBeVisible()

    await expect(card).toHaveAttribute('aria-pressed', 'false')
    await expect(card.locator('img')).toBeVisible()

    await card.click()
    await expect(card).toHaveAttribute('aria-pressed', 'true')
    await expect(prompt).toBeHidden()

    // A common name, and under it a scientific one. Both come off the deck, so
    // asserting the shape rather than the words keeps this true whatever photo
    // the shuffle deals.
    const answer = card.locator('p').first()
    await expect(answer).not.toBeEmpty()
    // The scientific name italicizes the Latin and nothing else, so the italics
    // are an <em> inside the line rather than the line itself — see nameParts.
    await expect(card.locator('p.mono em').first()).toBeVisible()
  })

  test('deals the next card face down', async ({ page }) => {
    await visit(page, '/quiz')

    const card = page.getByTestId('quiz-card')
    await card.click()
    await expect(card).toHaveAttribute('aria-pressed', 'true')

    await page.getByRole('button', { name: /next/i }).click()
    await expect(card).toHaveAttribute('aria-pressed', 'false')
  })

  test('counts through the deck', async ({ page }) => {
    await visit(page, '/quiz')

    const progress = page.getByText(/\d+\s*(of|\/)\s*\d+/i).first()
    const first = await progress.textContent()

    await page.getByRole('button', { name: /next/i }).click()
    await expect(progress).not.toHaveText(first ?? '')
  })

  test('is reachable from the gallery', async ({ page }) => {
    await visit(page, '/photos')
    await page.getByRole('link', { name: /test yourself/i }).click()
    await expect(page).toHaveURL(/\/quiz$/)
    await expect(page.getByTestId('quiz-card')).toBeVisible()
  })
})
