import { test, expect } from '@playwright/test'
import { visit, watchForProblems } from './helpers'

// The contact form on the homepage is how a visitor becomes a customer, and it
// had no test at all. There is no backend: submitting builds a mailto: link and
// hands it to the browser, so what we can check is that the form opens, refuses
// to send when it is incomplete, and confirms once it has.

type Page = import('@playwright/test').Page

const openForm = async (page: Page, tile: string) => {
  await page.getByRole('button', { name: tile }).click()
}

// A date the picker will accept: `min` is today, so anything in the past is
// refused by the browser before the form can be submitted. Built from the local
// clock, not toISOString(), for the same reason the component is — east of UTC
// they disagree about what day it is for the first eight hours of the morning.
const soon = (days: number) => {
  const d = new Date()
  d.setDate(d.getDate() + days)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

const fillForm = async (page: Page) => {
  await page.getByLabel('Name').fill('Wei')
  await page.getByLabel('Email').fill('wei@example.com')
  await page.getByLabel('How many people').fill('2')
  await page.getByLabel('Available from').fill(soon(7))
  await page.getByLabel('Available until').fill(soon(10))
  await page.getByLabel('Your Request').fill('No experience, we are staying in Kenting.')
}

test.describe('the contact form', () => {
  test('is closed until you pick what you want', async ({ page }) => {
    await visit(page, '/')
    await expect(page.getByLabel('Your Request')).toHaveCount(0)

    await openForm(page, 'Schedule a Try-Dive')
    await expect(page.getByLabel('Name')).toBeVisible()
    await expect(page.getByLabel('Email')).toBeVisible()
    await expect(page.getByLabel('Your Request')).toBeVisible()
  })

  // Who, how many and when: the three answers the shop would otherwise have to
  // ask for by reply before it could offer a single date.
  test('asks who is coming, how many, and when they are free', async ({ page }) => {
    await visit(page, '/')
    await openForm(page, 'Schedule a Try-Dive')

    await expect(page.getByLabel('Name')).toBeVisible()
    await expect(page.getByLabel('How many people')).toBeVisible()
    await expect(page.getByLabel('Available from')).toBeVisible()
    await expect(page.getByLabel('Available until')).toBeVisible()
  })

  // Nobody is available yesterday, and a range cannot end before it starts —
  // the browser enforces both from the `min` attributes.
  test('will not take a date range that runs backwards', async ({ page }) => {
    await visit(page, '/')
    await openForm(page, 'Schedule a Try-Dive')

    const today = soon(0)
    expect(await page.getByLabel('Available from').getAttribute('min')).toBe(today)

    await page.getByLabel('Available from').fill(soon(7))
    expect(
      await page.getByLabel('Available until').getAttribute('min'),
      'the end date should not be allowed before the start date',
    ).toBe(soon(7))

    await page.getByLabel('Available until').fill(soon(3))
    const backwards = await page
      .getByLabel('Available until')
      .evaluate((el: HTMLInputElement) => el.validity.rangeUnderflow)
    expect(backwards).toBe(true)
  })

  // A try-dive is sold as PADI's Discover Scuba Diving, and that is the name
  // people search for, so the open form names it and links to the course page.
  // It belongs to the try-dive request only — a course request is already being
  // made from a course.
  test('the try-dive form links to the DSD course page', async ({ page }) => {
    await visit(page, '/')
    const dsd = page.getByRole('link', { name: 'Discover Scuba Dive (DSD)' })
    await expect(dsd).toHaveCount(0)

    await openForm(page, 'Request a Course')
    await expect(dsd).toHaveCount(0)

    await openForm(page, 'Schedule a Try-Dive')
    await expect(dsd).toBeVisible()
    await dsd.click()

    await expect(page).toHaveURL(/\/courses\/padi-discover-scuba-diving-program$/)
    await expect(
      page.getByRole('heading', { name: /Discover Scuba Diving/i }).first(),
    ).toBeVisible()
  })

  test('opens for a course request too', async ({ page }) => {
    await visit(page, '/')
    await openForm(page, 'Request a Course')
    await expect(page.getByLabel('Your Request')).toBeVisible()
  })

  // The course request gets the same treatment, pointed at the catalog.
  test('the course form links to the course list', async ({ page }) => {
    await visit(page, '/')
    await openForm(page, 'Request a Course')

    const courses = page.getByRole('link', { name: 'PADI Courses' })
    await expect(courses).toBeVisible()
    await courses.click()

    await expect(page).toHaveURL(/\/courses$/)
    await expect(page.getByRole('heading', { name: 'PADI Courses' }).first()).toBeVisible()
  })

  test('can be cancelled', async ({ page }) => {
    await visit(page, '/')
    await openForm(page, 'Schedule a Try-Dive')
    await page.getByRole('button', { name: 'Cancel' }).click()
    await expect(page.getByLabel('Your Request')).toHaveCount(0)
  })

  // Every field but the end of the date range is `required`. The browser
  // refuses to submit and points at the empty one — so no half-filled enquiry
  // ever reaches the shop.
  test('will not send with the fields empty', async ({ page }) => {
    await visit(page, '/')
    await openForm(page, 'Schedule a Try-Dive')

    await page.getByRole('button', { name: 'Send Request' }).click()

    await expect(page.getByText(/your email app should have opened/i)).toHaveCount(0)
    const nameValid = await page
      .getByLabel('Name')
      .evaluate((el: HTMLInputElement) => el.validity.valueMissing)
    expect(nameValid, 'the browser should have blocked the submit').toBe(true)
  })

  test('will not send a malformed email address', async ({ page }) => {
    await visit(page, '/')
    await openForm(page, 'Schedule a Try-Dive')

    await fillForm(page)
    await page.getByLabel('Email').fill('not-an-email')
    await page.getByRole('button', { name: 'Send Request' }).click()

    const bad = await page
      .getByLabel('Email')
      .evaluate((el: HTMLInputElement) => el.validity.typeMismatch)
    expect(bad).toBe(true)
    await expect(page.getByText(/your email app should have opened/i)).toHaveCount(0)
  })

  // Someone free on a single day fills in one date, not two.
  test('sends with only the start of the range filled in', async ({ page }) => {
    await visit(page, '/')
    await openForm(page, 'Schedule a Try-Dive')

    await fillForm(page)
    await page.getByLabel('Available until').fill('')
    await page.getByRole('button', { name: 'Send Request' }).click()

    await expect(page.getByText(/your email app should have opened/i)).toBeVisible()
  })

  // The point of the three new questions is what lands in the shop's inbox, so
  // that is what this checks: the mailto: the browser is handed. Its labels are
  // English whatever the visitor was reading — the inbox is read in one language.
  test('puts the name, the party size and the dates in the email', async ({ page }) => {
    await visit(page, '/')
    await openForm(page, 'Schedule a Try-Dive')

    const mailtos: string[] = []
    page.on('request', (r) => {
      if (r.url().startsWith('mailto:')) mailtos.push(decodeURIComponent(r.url()))
    })

    await fillForm(page)
    await page.getByRole('button', { name: 'Send Request' }).click()

    await expect(page.getByText(/your email app should have opened/i)).toBeVisible()
    expect(mailtos.length, 'no mailto: was handed to the browser').toBe(1)
    expect(mailtos[0]).toContain('Name: Wei')
    expect(mailtos[0]).toContain('People: 2')
    expect(mailtos[0]).toContain(`Available: ${soon(7)} to ${soon(10)}`)
  })

  test('confirms once a complete request is sent', async ({ page }) => {
    const problems = watchForProblems(page)
    await visit(page, '/')
    await openForm(page, 'Schedule a Try-Dive')

    await fillForm(page)
    await page.getByRole('button', { name: 'Send Request' }).click()

    // The form closes and the confirmation replaces it.
    await expect(page.getByText(/your email app should have opened/i)).toBeVisible()
    await expect(page.getByLabel('Your Request')).toHaveCount(0)

    expect(problems.pageErrors).toEqual([])
  })
})

// The three tiles were squares, which on a phone made each one 358px tall and
// pushed the form off the screen.
test('the contact tiles are wider than they are tall', async ({ page }) => {
  await visit(page, '/')

  const sizes = await page.evaluate(() =>
    [...document.querySelectorAll('#get-in-touch .glass')].map((el) => {
      const r = el.getBoundingClientRect()
      return { w: Math.round(r.width), h: Math.round(r.height) }
    }),
  )

  expect(sizes.length, 'expected three contact tiles').toBe(3)
  for (const { w, h } of sizes) {
    expect(h, `a tile is ${w}x${h}, taller than it is wide`).toBeLessThan(w)
  }
})
