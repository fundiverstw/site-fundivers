import { test, expect } from '@playwright/test'
import { visit, watchForProblems } from './helpers'

// The contact form on the homepage is how a visitor becomes a customer, and it
// had no test at all. There is no backend: submitting builds a mailto: link and
// hands it to the browser, so what we can check is that the form opens, refuses
// to send when it is incomplete, and confirms once it has.

const openForm = async (page: import('@playwright/test').Page, tile: string) => {
  await page.getByRole('button', { name: tile }).click()
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

  test('opens for a course request too', async ({ page }) => {
    await visit(page, '/')
    await openForm(page, 'Request a Course')
    await expect(page.getByLabel('Your Request')).toBeVisible()
  })

  test('can be cancelled', async ({ page }) => {
    await visit(page, '/')
    await openForm(page, 'Schedule a Try-Dive')
    await page.getByRole('button', { name: 'Cancel' }).click()
    await expect(page.getByLabel('Your Request')).toHaveCount(0)
  })

  // Every field is `required`. The browser refuses to submit and points at the
  // empty one — so no half-filled enquiry ever reaches the shop.
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

    await page.getByLabel('Name').fill('Wei')
    await page.getByLabel('Email').fill('not-an-email')
    await page.getByLabel('Your Request').fill('Saturday, two people.')
    await page.getByRole('button', { name: 'Send Request' }).click()

    const bad = await page
      .getByLabel('Email')
      .evaluate((el: HTMLInputElement) => el.validity.typeMismatch)
    expect(bad).toBe(true)
    await expect(page.getByText(/your email app should have opened/i)).toHaveCount(0)
  })

  test('confirms once a complete request is sent', async ({ page }) => {
    const problems = watchForProblems(page)
    await visit(page, '/')
    await openForm(page, 'Schedule a Try-Dive')

    await page.getByLabel('Name').fill('Wei')
    await page.getByLabel('Email').fill('wei@example.com')
    await page.getByLabel('Your Request').fill('Saturday, two people, no experience.')
    await page.getByRole('button', { name: 'Send Request' }).click()

    // The form closes and the confirmation replaces it.
    await expect(page.getByText(/your email app should have opened/i)).toBeVisible()
    await expect(page.getByLabel('Your Request')).toHaveCount(0)

    expect(problems.pageErrors).toEqual([])
  })
})
