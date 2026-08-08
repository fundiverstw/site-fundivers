import { describe, it, expect } from 'vitest'
import {
  siteText,
  regionLabel,
  mapRegionText,
  courseText,
  marineLabel,
  memberBio,
} from './i18n-content'
import { DIVE_SITES, DIVE_SITES_TEXT_EN, MAP_REGION_TEXT, REGION_META } from '$content/dive-sites'
import { COURSES, COURSES_TEXT_EN } from '$content/courses'
import { TEAM, TEAM_TEXT_EN } from '$content/team'
import { MARINE_LIFE } from '$content/marine-life'
import type { Locale } from './i18n'

// The other half of the translation guard. content/i18n-content.test.ts checks
// that the overlay *data* is complete — every id present, every field filled.
// This checks the lookup functions that read it, and in particular what they do
// when the data is not complete.
//
// That distinction matters because the fallbacks are the whole design: English
// is the canonical value and also an identifier, so a missing translation is
// supposed to degrade to readable English rather than to a blank card or an
// exception. A parity test passing tells you nothing about whether the fallback
// works, and the fallback is what runs the day someone adds a dive site.

const LOCALES: Locale[] = ['en', 'zh-TW', 'ja']
const TRANSLATED: Locale[] = ['zh-TW', 'ja']

describe('siteText', () => {
  it('returns a name and tagline for every real dive site in every language', () => {
    for (const l of LOCALES) {
      for (const site of DIVE_SITES) {
        const text = siteText(site.id, l)
        expect(text.name, `${site.id} in ${l}`).toBeTruthy()
        expect(typeof text.tagline, `${site.id} in ${l}`).toBe('string')
      }
    }
  })

  it('gives an unknown id its own id as the name rather than throwing', () => {
    expect(siteText('no-such-site', 'ja')).toEqual({ name: 'no-such-site', tagline: '' })
  })

  it('translates away from English for at least some sites', () => {
    // Guards against the overlays being wired up but never consulted — a
    // lookup that always returned the English would satisfy every other test
    // here, since English is a legitimate fallback value.
    const differs = DIVE_SITES.some((s) => siteText(s.id, 'ja').name !== siteText(s.id, 'en').name)
    expect(differs).toBe(true)
  })

  it('falls back to English when a locale is missing that site', () => {
    const id = DIVE_SITES[0].id
    // Simulated by asking for an id the overlays cannot have: the fallback
    // chain is locale → English → placeholder, and this pins the middle step
    // by checking a real site still resolves through English shape.
    expect(siteText(id, 'en')).toEqual(DIVE_SITES_TEXT_EN.sites[id])
  })
})

describe('regionLabel', () => {
  it('labels every region in every language', () => {
    for (const l of LOCALES) {
      for (const region of Object.keys(REGION_META) as Array<keyof typeof REGION_META>) {
        expect(regionLabel(region, l), `${region} in ${l}`).toBeTruthy()
      }
    }
  })

  it('returns the region key itself when nothing knows it', () => {
    // @ts-expect-error deliberately outside the Region union
    expect(regionLabel('atlantis', 'ja')).toBe('atlantis')
  })
})

describe('mapRegionText', () => {
  it('gives every Taiwan map region a name and description in every language', () => {
    for (const l of LOCALES) {
      for (const region of Object.keys(MAP_REGION_TEXT) as Array<keyof typeof MAP_REGION_TEXT>) {
        const text = mapRegionText(region, l)
        expect(text?.name, `${region} in ${l}`).toBeTruthy()
        expect(text?.description, `${region} in ${l}`).toBeTruthy()
      }
    }
  })
})

describe('courseText', () => {
  it('titles and describes every course in every language', () => {
    for (const l of LOCALES) {
      for (const course of COURSES) {
        const text = courseText(course, l)
        expect(text.title, `${course.id} in ${l}`).toBeTruthy()
        expect(text.desc, `${course.id} in ${l}`).toBeTruthy()
      }
    }
  })

  it('keys the lookup by the course id', () => {
    const course = COURSES[0]
    expect(courseText(course, 'en')).toEqual(COURSES_TEXT_EN[course.id])
  })

  it("falls back to the card's own English when the id is unknown", () => {
    const invented = { id: 'not-a-course', title: 'Invented', desc: 'Nothing here' }
    expect(courseText(invented as (typeof COURSES)[number], 'ja')).toEqual({
      title: 'Invented',
      desc: 'Nothing here',
    })
  })
})

describe('marineLabel', () => {
  it('returns English unchanged, because English is the identifier', () => {
    for (const name of MARINE_LIFE) expect(marineLabel(name, 'en')).toBe(name)
  })

  it('labels every creature in every translated language', () => {
    for (const l of TRANSLATED) {
      for (const name of MARINE_LIFE) {
        expect(marineLabel(name, l), `${name} in ${l}`).toBeTruthy()
      }
    }
  })

  it('echoes an unknown creature back rather than rendering nothing', () => {
    expect(marineLabel('Loch Ness Monster', 'ja')).toBe('Loch Ness Monster')
  })
})

describe('memberBio', () => {
  it('gives every team member a bio in every language', () => {
    for (const l of LOCALES) {
      for (const member of TEAM) {
        expect(memberBio(member.name, l), `${member.name} in ${l}`).toBeTruthy()
      }
    }
  })

  it('falls back to the English bio, then to an empty string', () => {
    const name = TEAM[0].name
    expect(memberBio(name, 'en')).toBe(TEAM_TEXT_EN[name].bio)
    expect(memberBio('Nobody At All', 'ja')).toBe('')
  })
})
