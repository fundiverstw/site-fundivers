import { describe, it, expect } from 'vitest'
import { siteDetails, courseDetails } from './i18n-details'
import { DIVE_SITE_DETAILS } from '$content/dive-sites/details'
import { COURSE_DETAILS } from '$content/courses/details'
import type { Locale } from './i18n'

// The write-ups resolve differently from everything else in i18n-content: a
// translation is a *partial* entry spread over the English one, because the
// English carries structural data the translations must not restate — marine
// life identifiers, subsection layout, match codes, depths. A translation that
// overwrote those would break the gallery links and the course graph while
// looking perfectly fine on the page.
//
// So these tests are mostly about what survives the merge, not what changes.

const LOCALES: Locale[] = ['en', 'zh-TW', 'ja']
const TRANSLATED: Locale[] = ['zh-TW', 'ja']

describe('siteDetails', () => {
  it('resolves every write-up in every language', () => {
    for (const l of LOCALES) {
      for (const id of Object.keys(DIVE_SITE_DETAILS)) {
        expect(siteDetails(id, l), `${id} in ${l}`).not.toBeNull()
      }
    }
  })

  it('returns the canonical object untouched for English', () => {
    const id = Object.keys(DIVE_SITE_DETAILS)[0]
    expect(siteDetails(id, 'en')).toBe(DIVE_SITE_DETAILS[id])
  })

  it('returns null for a site that has no details.ts', () => {
    for (const l of LOCALES) expect(siteDetails('no-such-site', l)).toBeNull()
  })

  it('keeps the English structural fields when overlaying a translation', () => {
    // The structural fields must come through the merge as the *same objects*
    // the English holds, not merely present. Asserting presence would pass no
    // matter what the overlays contain: the merge is `{...base, ...overlay}`,
    // so every English key is defined afterwards by construction. Identity is
    // what actually catches an overlay that restated marineLife and quietly
    // broke the gallery links on the Japanese page.
    for (const l of TRANSLATED) {
      for (const [id, base] of Object.entries(DIVE_SITE_DETAILS)) {
        const merged = siteDetails(id, l)!
        expect(merged.marineLife, `${id}.marineLife in ${l}`).toBe(base.marineLife)
      }
    }
  })

  it('translates the prose for at least some sites', () => {
    const differs = Object.keys(DIVE_SITE_DETAILS).some(
      (id) => JSON.stringify(siteDetails(id, 'ja')) !== JSON.stringify(siteDetails(id, 'en')),
    )
    expect(differs).toBe(true)
  })

  it('does not mutate the canonical entry when merging', () => {
    const id = Object.keys(DIVE_SITE_DETAILS)[0]
    const before = JSON.stringify(DIVE_SITE_DETAILS[id])
    siteDetails(id, 'ja')
    siteDetails(id, 'zh-TW')
    expect(JSON.stringify(DIVE_SITE_DETAILS[id])).toBe(before)
  })
})

describe('courseDetails', () => {
  it('resolves every write-up in every language', () => {
    for (const l of LOCALES) {
      for (const id of Object.keys(COURSE_DETAILS)) {
        expect(courseDetails(id, l), `${id} in ${l}`).not.toBeNull()
      }
    }
  })

  it('returns the canonical object untouched for English', () => {
    const id = Object.keys(COURSE_DETAILS)[0]
    expect(courseDetails(id, 'en')).toBe(COURSE_DETAILS[id])
  })

  it('returns null for a course that has no details.ts', () => {
    for (const l of LOCALES) expect(courseDetails('not-a-course', l)).toBeNull()
  })

  // Same trap as siteDetails above: presence is guaranteed by the spread, so this
  // compares the structural fields by identity instead. `next` and `matchCodes`
  // are the course graph and the calendar join — a translation that restated
  // either would send a Japanese reader to the Not Found page, or hide a course's
  // real dates, with the page otherwise looking correct.
  it('keeps the English structural fields when overlaying a translation', () => {
    for (const l of TRANSLATED) {
      for (const [id, base] of Object.entries(COURSE_DETAILS)) {
        const merged = courseDetails(id, l)!
        expect(merged.next, `${id}.next in ${l}`).toBe(base.next)
        expect(merged.matchCodes, `${id}.matchCodes in ${l}`).toBe(base.matchCodes)
        expect(merged.subsections, `${id}.subsections in ${l}`).toBe(base.subsections)
        expect(merged.depth, `${id}.depth in ${l}`).toBe(base.depth)
      }
    }
  })

  it('does not mutate the canonical entry when merging', () => {
    const id = Object.keys(COURSE_DETAILS)[0]
    const before = JSON.stringify(COURSE_DETAILS[id])
    courseDetails(id, 'ja')
    courseDetails(id, 'zh-TW')
    expect(JSON.stringify(COURSE_DETAILS[id])).toBe(before)
  })
})
