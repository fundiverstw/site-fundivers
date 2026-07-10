import { describe, it, expect } from 'vitest'
import { readdirSync } from 'node:fs'
import { resolve } from 'node:path'
import {
  DIVE_SITES,
  REGION_META,
  EVENT_TITLE_MATCHERS,
  fetchDiveSites,
  diveSiteById,
  diveSitePath,
} from './dive-sites'
import { siteIdForTitle } from '$engine/photo-pool'

// The dive-site catalog is edited by hand. These tests catch the mistakes that
// are easy to make and hard to see: a repeated id, a region that was never
// declared, a photo folder whose name has a typo in it.

const ids = DIVE_SITES.map((s) => s.id)

describe('the catalog', () => {
  it('is not empty', () => {
    expect(DIVE_SITES.length).toBeGreaterThan(0)
  })

  it('has no repeated id', () => {
    expect(ids).toHaveLength(new Set(ids).size)
  })

  // The id becomes the web address /sites/<id> and the name of a photo folder.
  it('uses lowercase, hyphenated ids', () => {
    for (const id of ids) expect(id).toMatch(/^[a-z0-9-]+$/)
  })

  it('gives every site a name', () => {
    for (const s of DIVE_SITES) expect(s.name.trim()).not.toBe('')
  })

  it('puts every site in a region that exists', () => {
    for (const s of DIVE_SITES) expect(REGION_META).toHaveProperty(s.region)
  })

  it('gives every region a label to show', () => {
    for (const [region, meta] of Object.entries(REGION_META)) {
      expect(meta.label.trim(), `region '${region}' has no label`).not.toBe('')
    }
  })

  // Sites.svelte splits the list on this flag alone. A trip destination without
  // it silently appears under "Domestic", next to Bat Cave.
  it('flags every site outside Taiwan as international', () => {
    const overseas = ['malapascua', 'puerto-galera', 'panglao-bohol', 'anilao', 'palau']
    for (const s of DIVE_SITES) {
      expect(!!s.international, `${s.id}`).toBe(overseas.includes(s.region))
    }
  })

  it('places every site somewhere plausible on Earth', () => {
    // Taiwan and the dive destinations around it. A swapped latitude and
    // longitude, or a stray minus sign, lands the pin in the wrong ocean.
    for (const s of DIVE_SITES) {
      expect(s.latitude, `${s.id} latitude`).toBeGreaterThan(0)
      expect(s.latitude, `${s.id} latitude`).toBeLessThan(30)
      expect(s.longitude, `${s.id} longitude`).toBeGreaterThan(110)
      expect(s.longitude, `${s.id} longitude`).toBeLessThan(145)
    }
  })

  it('only uses dive types the pages can render', () => {
    for (const s of DIVE_SITES) expect([null, 'shore', 'boat']).toContain(s.dive_type)
  })
})

describe('reading the catalog', () => {
  it('sorts sites by name', async () => {
    const sorted = await fetchDiveSites()
    const names = sorted.map((s) => s.name)
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)))
  })

  it('finds every site by its id', () => {
    for (const s of DIVE_SITES) expect(diveSiteById(s.id)).toBe(s)
  })

  it('returns null for an unknown id rather than throwing', () => {
    expect(diveSiteById('no-such-site')).toBeNull()
  })

  it('builds the detail-page path', () => {
    expect(diveSitePath({ id: 'bat-cave' })).toBe('/sites/bat-cave')
  })
})

describe('photo folders', () => {
  const folders = readdirSync(resolve(import.meta.dirname, 'photos/dive-sites'), {
    withFileTypes: true,
  })
    .filter((e) => e.isDirectory())
    .map((e) => e.name)

  // A folder named 'bat_cave' or 'batcave' is not an error anywhere — the photo
  // simply never appears, and nobody notices for a month.
  it('are all named after a real dive site', () => {
    for (const folder of folders) expect(ids).toContain(folder)
  })

  it('are not empty', () => {
    for (const folder of folders) {
      const files = readdirSync(resolve(import.meta.dirname, 'photos/dive-sites', folder))
      expect(files.length, `${folder} has no photos`).toBeGreaterThan(0)
    }
  })
})

describe('event-title matchers', () => {
  it('all point at a dive site that exists', () => {
    for (const m of EVENT_TITLE_MATCHERS) expect(ids).toContain(m.id)
  })

  it('ignore capitalisation, so a shouty event title still matches', () => {
    for (const m of EVENT_TITLE_MATCHERS) expect(m.re.flags).toContain('i')
  })

  // Ordering is the whole design of this table: the first pattern that matches
  // wins, so specific titles must be listed above the general ones.
  it('prefer the specific pattern over the general one', () => {
    expect(siteIdForTitle('Iron House 2')).toBe('iron-house-2')
    expect(siteIdForTitle('Iron House')).toBe('iron-house-iron-reef')
    expect(siteIdForTitle('Iron Reef 2')).toBe('iron-house-2')
  })

  it('match a real event title with words around the site name', () => {
    expect(siteIdForTitle('Sunday fun dive — Bat Cave')).toBe('bat-cave')
    expect(siteIdForTitle('Green Island long weekend')).toBe('green-island')
    expect(siteIdForTitle('Malapascua thresher trip')).toBe('malapascua')
  })

  it('return null for a spot that is not in the catalog', () => {
    expect(siteIdForTitle('Yehliu shore dive')).toBeNull()
    expect(siteIdForTitle('Pool session')).toBeNull()
  })
})
