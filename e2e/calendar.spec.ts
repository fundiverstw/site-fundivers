import { test, expect } from '@playwright/test'
import { visit, watchForProblems } from './helpers'
import {
  eventsFixture,
  pricesFixture,
  FUN_DIVE,
  TRIP,
  COURSE,
  DIVE_PRICE_CARD,
  DIVE_PRICE_MODAL,
} from './fixtures'

// Everywhere else, the database answers with an empty list. That keeps the tests
// fast and secret-free, but it means engine/events.ts — 446 lines that fetch
// dives and courses, join their prices from another table, expand a course's
// list of days into bars, and classify a dive as a trip or a local — was never
// executed by anything.
//
// These tests feed it rows shaped like the real ones.

const db = () => ({ events: eventsFixture(), prices: pricesFixture })

test.describe('the calendar, with events in it', () => {
  test('draws a bar for each dive and course', async ({ page }) => {
    const problems = watchForProblems(page)
    await visit(page, '/calendar', db())

    await expect(page.getByText(FUN_DIVE).first()).toBeVisible()
    await expect(page.getByText(TRIP).first()).toBeVisible()
    await expect(page.getByText(COURSE).first()).toBeVisible()

    expect(problems.pageErrors).toEqual([])
    expect(problems.consoleErrors).toEqual([])
  })

  test('says nothing is scheduled when the database is empty', async ({ page }) => {
    // The other side of the same page. If this ever renders a stray bar, the
    // fixture is leaking between tests.
    await visit(page, '/calendar')
    await expect(page.getByText(FUN_DIVE)).toHaveCount(0)
    await expect(page.getByText(TRIP)).toHaveCount(0)
  })

  // events.price is a uuid pointing at another table. If that join breaks,
  // every price silently disappears and the page still looks fine.
  test('joins each event to its price in the other table', async ({ page }) => {
    await visit(page, '/calendar', db())

    await page.getByText(FUN_DIVE).first().click()
    const modal = page.getByRole('dialog')
    await expect(modal).toBeVisible()
    await expect(modal.getByText(FUN_DIVE).first()).toBeVisible()
    await expect(modal.getByText(DIVE_PRICE_MODAL)).toBeVisible()
  })

  // The trip runs the 14th to the 16th; the fun dive is one day. formatEventSpan
  // renders a range with an arrow and a single day without one, so the arrow is
  // proof the multi-day path ran.
  test('renders a multi-day trip as a date range, and a single dive as one date', async ({
    page,
  }) => {
    await visit(page, '/calendar', db())

    await page.getByText(TRIP).first().click()
    await expect(page.getByRole('dialog').getByText('→')).toBeVisible()
    await page.keyboard.press('Escape')

    await page.getByText(FUN_DIVE).first().click()
    await expect(page.getByRole('dialog').getByText('→')).toHaveCount(0)
  })

  // A course is stored as course_days: ['2026-07-20', '2026-07-21'], not as a
  // start/end pair. Expanding that into consecutive runs is its own code path.
  test('expands a course from its list of days', async ({ page }) => {
    await visit(page, '/calendar', db())
    await expect(page.getByText(COURSE).first()).toBeVisible()
  })

  test('marks a fully booked trip as a waitlist', async ({ page }) => {
    await visit(page, '/calendar', db())
    await page.getByText(TRIP).first().click()
    const modal = page.getByRole('dialog')
    await expect(modal).toBeVisible()
    await expect(modal.getByText(/join the waitlist/i)).toBeVisible()
  })

  test('closes the event modal again', async ({ page }) => {
    await visit(page, '/calendar', db())
    await page.getByText(FUN_DIVE).first().click()
    await expect(page.getByRole('dialog')).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(page.getByRole('dialog')).toBeHidden()
  })
})

test.describe('the homepage, with events in it', () => {
  test('shows upcoming events with their prices', async ({ page }) => {
    const problems = watchForProblems(page)
    await visit(page, '/', db())

    await expect(page.getByText(FUN_DIVE).first()).toBeVisible()
    await expect(page.getByText(DIVE_PRICE_CARD).first()).toBeVisible()

    expect(problems.pageErrors).toEqual([])
    expect(problems.consoleErrors).toEqual([])
  })
})
