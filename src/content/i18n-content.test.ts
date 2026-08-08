import { describe, it, expect } from 'vitest'

import { DIVE_SITES_TEXT_EN, diveSitesJa, diveSitesZhTW } from './dive-sites'
import { DIVE_SITE_DETAILS, diveSiteDetailsJa, diveSiteDetailsZhTW } from './dive-sites/details'
import { COURSES_TEXT_EN, coursesJa, coursesZhTW } from './courses'
import { COURSE_DETAILS, courseDetailsJa, courseDetailsZhTW } from './courses/details'
import { MARINE_LIFE, marineLifeJa, marineLifeZhTW } from './marine-life'
import { TEAM_TEXT_EN, teamJa, teamZhTW } from './team'

// Each content entity keeps its English as the canonical value and carries its
// translations beside it, in the same file. TypeScript checks the *shape* of a
// translation, but not that every id is present, every field filled, or an array
// the same length. These tests do — the same guard text.test.ts gives the UI
// dictionary, extended to the content. A new dive site, course or creature with
// no translation fails here rather than silently rendering English on the
// Japanese page.
//
// The barrels these read from (./dive-sites, ./courses, …) are what turn the
// per-entity files into one map per locale, so this measures the assembled
// result — which is what the pages actually see.

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

/** The translatable shape of the details maps: each entry minus its structural,
 *  non-translated fields — the same fields a translation is expected to carry. */
const diveDetailsEn = Object.fromEntries(
  Object.entries(DIVE_SITE_DETAILS).map(([id, g]) => [id, omit(g, ['marineLife'])]),
)
const courseDetailsEn = Object.fromEntries(
  Object.entries(COURSE_DETAILS).map(([id, g]) => [
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
  team: { en: TEAM_TEXT_EN, ja: teamJa, 'zh-TW': teamZhTW },
  'dive-site-details': { en: diveDetailsEn, ja: diveSiteDetailsJa, 'zh-TW': diveSiteDetailsZhTW },
  'course-details': { en: courseDetailsEn, ja: courseDetailsJa, 'zh-TW': courseDetailsZhTW },
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
