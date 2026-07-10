import { test, expect } from '@playwright/test'
import { visit, chooseLanguage, navLink } from './helpers'

// The site speaks English, 中文 and 日本語, and remembers which one you chose.

test('switching to 中文 translates the navigation', async ({ page, isMobile }) => {
  await visit(page, '/')
  await expect(await navLink(page, 'Courses', isMobile)).toBeVisible()

  await chooseLanguage(page, '中文')

  await expect(await navLink(page, '課程', isMobile)).toBeVisible()
  await expect(await navLink(page, 'Courses', isMobile)).toHaveCount(0)
})

test('the chosen language survives a reload', async ({ page, isMobile }) => {
  await visit(page, '/')
  await chooseLanguage(page, '日本語')
  await expect(await navLink(page, 'コース', isMobile)).toBeVisible()

  await page.reload()

  await expect(await navLink(page, 'コース', isMobile)).toBeVisible()
})

// Screen readers and search engines read this attribute. It must follow the
// language the visitor picked, not stay stuck on "en".
test('the page tells the browser which language it is in', async ({ page }) => {
  await visit(page, '/')
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')

  await chooseLanguage(page, '中文')
  await expect(page.locator('html')).toHaveAttribute('lang', 'zh-TW')
})
