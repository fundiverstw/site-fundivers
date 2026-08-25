import { describe, it, expect } from 'vitest'
import { SECTIONS, FOOTER_LINKS } from './navigation'
import { en } from './text/en'
import { REVIEW_PLATFORMS } from './reviews'

// The nav structure is data, and data can be wrong in ways TypeScript cannot
// see: the same page listed under two sections, a label key that resolves to an
// empty string, a section whose hub is also one of its own children.
//
// The browser tests check that each hub links to everything in its section
// (e2e/navigation.spec.ts). These check the list itself.

const allItems = SECTIONS.flatMap((s) => s.items)

describe('the navigation structure', () => {
  it('gives every entry an address of its own', () => {
    const hrefs = [...SECTIONS.map((s) => s.href), ...allItems.map((i) => i.href)]
    const duplicates = hrefs.filter((h, i) => hrefs.indexOf(h) !== i)
    expect(duplicates, 'the same page is listed twice in the bar').toEqual([])
  })

  it('points every entry at a path on this site', () => {
    for (const { href } of [...SECTIONS, ...allItems, ...FOOTER_LINKS]) {
      expect(href.startsWith('/'), `${href} is not a path on this site`).toBe(true)
    }
  })

  it('gives every entry a label in every language', () => {
    // The key is typed against the English dictionary, so a missing key cannot
    // compile; what this catches is a key that exists and says nothing. The
    // other two languages are held to the same shape by text.test.ts.
    for (const { key } of [...SECTIONS, ...allItems, ...FOOTER_LINKS]) {
      expect(String(en.nav[key]).trim(), `nav.${key} is empty`).not.toBe('')
    }
  })

  it('keeps the footer map clear of the bar', () => {
    // The footer exists to reach what the four sections do not. A page in both
    // is not broken, but it means one of the two lists has drifted.
    const inBar = new Set([...SECTIONS.map((s) => s.href), ...allItems.map((i) => i.href)])
    const overlap = FOOTER_LINKS.filter((l) => inBar.has(l.href))
    expect(
      overlap.map((l) => l.href),
      'listed in both the bar and the footer',
    ).toEqual([])
  })
})

describe('the review platforms', () => {
  it('each have a blurb to show', () => {
    for (const p of REVIEW_PLATFORMS) {
      expect(String(en.reviews.platforms[p.id]).trim(), `reviews.platforms.${p.id}`).not.toBe('')
    }
  })

  it('leave the site — a review we host is not a review', () => {
    for (const p of REVIEW_PLATFORMS) {
      expect(p.readUrl, `${p.id} read link`).toMatch(/^https:\/\//)
      expect(p.writeUrl, `${p.id} write link`).toMatch(/^https:\/\//)
    }
  })
})
