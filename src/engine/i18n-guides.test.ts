import { describe, it, expect } from 'vitest'
import { diveGuide, courseGuide } from './i18n-guides'
import { DIVE_SITE_GUIDES } from '$content/dive-site-guides'
import { COURSE_GUIDES } from '$content/course-guides'
import type { Locale } from './i18n'

// The guides resolve differently from everything else in i18n-content: an
// overlay is a *partial* guide that is spread over the English one, because the
// English carries structural data the translations must not restate — marine
// life identifiers, subsection layout, match codes, depths. A translation that
// overwrote those would break the gallery links and the course graph while
// looking perfectly fine on the page.
//
// So these tests are mostly about what survives the merge, not what changes.

const LOCALES: Locale[] = ['en', 'zh-TW', 'ja']
const TRANSLATED: Locale[] = ['zh-TW', 'ja']

describe('diveGuide', () => {
  it('resolves every guide in every language', () => {
    for (const l of LOCALES) {
      for (const id of Object.keys(DIVE_SITE_GUIDES)) {
        expect(diveGuide(id, l), `${id} in ${l}`).not.toBeNull()
      }
    }
  })

  it('returns the canonical object untouched for English', () => {
    const id = Object.keys(DIVE_SITE_GUIDES)[0]
    expect(diveGuide(id, 'en')).toBe(DIVE_SITE_GUIDES[id])
  })

  it('returns null for a site that has no guide', () => {
    for (const l of LOCALES) expect(diveGuide('no-such-site', l)).toBeNull()
  })

  it('keeps the English structural fields when overlaying a translation', () => {
    // The structural fields must come through the merge as the *same objects*
    // the English holds, not merely present. Asserting presence would pass no
    // matter what the overlays contain: the merge is `{...base, ...overlay}`,
    // so every English key is defined afterwards by construction. Identity is
    // what actually catches an overlay that restated marineLife and quietly
    // broke the gallery links on the Japanese page.
    for (const l of TRANSLATED) {
      for (const [id, base] of Object.entries(DIVE_SITE_GUIDES)) {
        const merged = diveGuide(id, l)!
        expect(merged.marineLife, `${id}.marineLife in ${l}`).toBe(base.marineLife)
      }
    }
  })

  it('translates the prose for at least some guides', () => {
    const differs = Object.keys(DIVE_SITE_GUIDES).some(
      (id) => JSON.stringify(diveGuide(id, 'ja')) !== JSON.stringify(diveGuide(id, 'en')),
    )
    expect(differs).toBe(true)
  })

  it('does not mutate the canonical guide when merging', () => {
    const id = Object.keys(DIVE_SITE_GUIDES)[0]
    const before = JSON.stringify(DIVE_SITE_GUIDES[id])
    diveGuide(id, 'ja')
    diveGuide(id, 'zh-TW')
    expect(JSON.stringify(DIVE_SITE_GUIDES[id])).toBe(before)
  })
})

describe('courseGuide', () => {
  it('resolves every guide in every language', () => {
    for (const l of LOCALES) {
      for (const id of Object.keys(COURSE_GUIDES)) {
        expect(courseGuide(id, l), `${id} in ${l}`).not.toBeNull()
      }
    }
  })

  it('returns the canonical object untouched for English', () => {
    const id = Object.keys(COURSE_GUIDES)[0]
    expect(courseGuide(id, 'en')).toBe(COURSE_GUIDES[id])
  })

  it('returns null for a course that has no guide', () => {
    for (const l of LOCALES) expect(courseGuide('not-a-course', l)).toBeNull()
  })

  // Same trap as diveGuide above: presence is guaranteed by the spread, so this
  // compares the structural fields by identity instead. `next` and `matchCodes`
  // are the course graph and the calendar join — a translation that restated
  // either would send a Japanese reader to the Not Found page, or hide a course's
  // real dates, with the page otherwise looking correct.
  it('keeps the English structural fields when overlaying a translation', () => {
    for (const l of TRANSLATED) {
      for (const [id, base] of Object.entries(COURSE_GUIDES)) {
        const merged = courseGuide(id, l)!
        expect(merged.next, `${id}.next in ${l}`).toBe(base.next)
        expect(merged.matchCodes, `${id}.matchCodes in ${l}`).toBe(base.matchCodes)
        expect(merged.subsections, `${id}.subsections in ${l}`).toBe(base.subsections)
        expect(merged.depth, `${id}.depth in ${l}`).toBe(base.depth)
      }
    }
  })

  it('does not mutate the canonical guide when merging', () => {
    const id = Object.keys(COURSE_GUIDES)[0]
    const before = JSON.stringify(COURSE_GUIDES[id])
    courseGuide(id, 'ja')
    courseGuide(id, 'zh-TW')
    expect(JSON.stringify(COURSE_GUIDES[id])).toBe(before)
  })
})
