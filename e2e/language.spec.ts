import { test, expect } from '@playwright/test'
import { visit, chooseLanguage, navLink } from './helpers'

// The site speaks English, 中文 and 日本語, and remembers which one you chose.
//
// These go by the bar's four section labels rather than by a link inside a
// dropdown: the sections are on screen in both layouts and in every language,
// so the test measures the translation rather than the menu mechanics.

test('switching to 中文 translates the navigation', async ({ page, isMobile }) => {
  await visit(page, '/')
  await expect(await navLink(page, 'Education', isMobile)).toBeVisible()

  await chooseLanguage(page, '中文')

  await expect(await navLink(page, '學習', isMobile)).toBeVisible()
  await expect(await navLink(page, 'Education', isMobile)).toHaveCount(0)
})

test('the chosen language survives a reload', async ({ page, isMobile }) => {
  await visit(page, '/')
  await chooseLanguage(page, '日本語')
  await expect(await navLink(page, '学ぶ', isMobile)).toBeVisible()

  await page.reload()

  await expect(await navLink(page, '学ぶ', isMobile)).toBeVisible()
})

// Screen readers and search engines read this attribute. It must follow the
// language the visitor picked, not stay stuck on "en".
test('the page tells the browser which language it is in', async ({ page }) => {
  await visit(page, '/')
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')

  await chooseLanguage(page, '中文')
  await expect(page.locator('html')).toHaveAttribute('lang', 'zh-TW')
})
