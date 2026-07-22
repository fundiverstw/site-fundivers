import { describe, it, expect } from 'vitest'

import { DIVE_SITES_TEXT_EN } from './dive-sites'
import { diveSitesJa } from './dive-sites.ja'
import { diveSitesZhTW } from './dive-sites.zh-TW'

import { COURSES_TEXT_EN } from './courses'
import { coursesJa } from './courses.ja'
import { coursesZhTW } from './courses.zh-TW'

import { MARINE_LIFE } from './marine-life'
import { marineLifeJa } from './marine-life.ja'
import { marineLifeZhTW } from './marine-life.zh-TW'

import { DIVE_SITE_GUIDES } from './dive-site-guides'
import { diveSiteGuidesJa } from './dive-site-guides.ja'
import { diveSiteGuidesZhTW } from './dive-site-guides.zh-TW'

import { COURSE_GUIDES } from './course-guides'
import { courseGuidesJa } from './course-guides.ja'
import { courseGuidesZhTW } from './course-guides.zh-TW'

// The content data files keep their English as the canonical value and carry
// translations in per-locale overlays (see $engine/i18n-content). TypeScript
// checks the *shape* of each overlay, but not that every id is present, every
// field filled, or an array the same length. These tests do — the same guard
// text.test.ts gives the UI dictionary, extended to the content overlays. A new
// dive site, course or creature with no translation fails here rather than
// silently rendering English on the Japanese page.

type Node = Record<string, unknown>

/** Every leaf, as a dotted path: 'sites.bat-cave.name', 'highlights.0'. */
function paths(value: unknown, prefix = ''): string[] {
  if (Array.isArray(value)) return value.flatMap((v, i) => paths(v, `${prefix}.${i}`))
  if (value !== null && typeof value === 'object') {
    return Object.entries(value as Node).flatMap(([k, v]) =>
      paths(v, prefix ? `${prefix}.${k}` : k),
    )
  }
  return [prefix]
}

/** Every string in the object, with the path that led to it. */
function leaves(value: unknown, prefix = ''): Array<[string, unknown]> {
  if (Array.isArray(value)) return value.flatMap((v, i) => leaves(v, `${prefix}.${i}`))
  if (value !== null && typeof value === 'object') {
    return Object.entries(value as Node).flatMap(([k, v]) =>
      leaves(v, prefix ? `${prefix}.${k}` : k),
    )
  }
  return [[prefix, value]]
}

const omit = <T extends object>(o: T, keys: string[]): Partial<T> =>
  Object.fromEntries(Object.entries(o).filter(([k]) => !keys.includes(k))) as Partial<T>

/** The translatable shape of the guide maps: each entry minus its structural,
 *  non-translated fields — the same fields the overlays are expected to carry. */
const diveGuidesEn = Object.fromEntries(
  Object.entries(DIVE_SITE_GUIDES).map(([id, g]) => [id, omit(g, ['marineLife'])]),
)
const courseGuidesEn = Object.fromEntries(
  Object.entries(COURSE_GUIDES).map(([id, g]) => [
    id,
    omit(g, ['subsections', 'matchCodes', 'next', 'depth']),
  ]),
)

const marineEn = Object.fromEntries(MARINE_LIFE.map((m) => [m, m]))

// Each domain: the English canonical (in overlay shape) and its two overlays.
const domains = {
  'dive-sites': { en: DIVE_SITES_TEXT_EN, ja: diveSitesJa, 'zh-TW': diveSitesZhTW },
  courses: { en: COURSES_TEXT_EN, ja: coursesJa, 'zh-TW': coursesZhTW },
  'marine-life': { en: marineEn, ja: marineLifeJa, 'zh-TW': marineLifeZhTW },
  'dive-site-guides': { en: diveGuidesEn, ja: diveSiteGuidesJa, 'zh-TW': diveSiteGuidesZhTW },
  'course-guides': { en: courseGuidesEn, ja: courseGuidesJa, 'zh-TW': courseGuidesZhTW },
} as const

describe.each(Object.entries(domains))('%s overlays', (domain, set) => {
  const enPaths = paths(set.en)

  describe.each(
    Object.entries(set).filter(([locale]) => locale !== 'en') as Array<[string, unknown]>,
  )('%s', (locale, dict) => {
    it('has exactly the same fields as English — no more, no fewer (and arrays match length)', () => {
      const dictPaths = paths(dict)
      const missing = enPaths.filter((p) => !dictPaths.includes(p))
      const extra = dictPaths.filter((p) => !enPaths.includes(p))
      expect({ missing, extra }, `${domain}/${locale} does not match the English shape`).toEqual({
        missing: [],
        extra: [],
      })
    })

    it('leaves no field blank', () => {
      for (const [path, value] of leaves(dict)) {
        expect(typeof value, `${domain}/${locale}: ${path}`).toBe('string')
        expect(String(value).trim(), `${domain}/${locale}: ${path} is empty`).not.toBe('')
      }
    })
  })
})
