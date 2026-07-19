import { describe, it, expect } from 'vitest'
import { GALLERY, ALL_PHOTOS, ORPHAN_FOLDERS, FILLED_SECTIONS } from './photo-gallery'
import { MARINE_LIFE, marineSlug } from './marine-life'
import { DIVE_SITE_GUIDES } from './dive-site-guides'

// The gallery is discovered by a build-time glob over
// src/content/photos/gallery/<slug>/, so a listed-but-missing file cannot
// happen — the glob only returns files that exist. What matters instead is that
// the three lists agree: the vocabulary a dive-site guide may use, the sections
// the photos page renders, and the folders somebody put on disk.

describe('the marine-life vocabulary', () => {
  it('slugs the way the links expect', () => {
    expect(marineSlug('Moray eels')).toBe('moray_eels')
    expect(marineSlug('Sea fans')).toBe('sea_fans')
    expect(marineSlug('Xenograpsus vent crabs')).toBe('xenograpsus_vent_crabs')
  })

  it('gives every creature a distinct slug', () => {
    // Two chips sharing a slug would share a gallery, and one of them would
    // quietly never get its own photos.
    const slugs = MARINE_LIFE.map(marineSlug)
    expect(new Set(slugs).size, 'two creatures slug to the same anchor').toBe(slugs.length)
  })
})

describe('dive-site guides', () => {
  it('only name creatures the vocabulary knows', () => {
    // This is the guard that keeps every chip clickable. A guide inventing its
    // own wording ("Wrasse" instead of "Wrasses") would link to a section that
    // does not exist, and the visitor would land nowhere.
    const known = new Set<string>(MARINE_LIFE)
    for (const [id, guide] of Object.entries(DIVE_SITE_GUIDES)) {
      for (const creature of guide.marineLife ?? []) {
        expect(
          known.has(creature),
          `'${id}' lists '${creature}', which is not in MARINE_LIFE`,
        ).toBe(true)
      }
    }
  })

  it('never lists the same creature twice on one site', () => {
    for (const [id, guide] of Object.entries(DIVE_SITE_GUIDES)) {
      const list = guide.marineLife ?? []
      expect(new Set(list).size, `'${id}' repeats a creature`).toBe(list.length)
    }
  })
})

describe('the photo gallery', () => {
  it('has a section for every creature, so every chip has somewhere to land', () => {
    const keys = new Set(GALLERY.map((s) => s.key))
    for (const label of MARINE_LIFE) {
      expect(keys.has(marineSlug(label)), `no section for '${label}'`).toBe(true)
    }
  })

  it('reads alphabetically', () => {
    // The shortcut row and the sections are rendered from this one list, so
    // sorting it here is what keeps the two in step. The vocabulary's own order
    // is grouped by kind and deliberately not this.
    const labels = GALLERY.map((s) => s.label)
    expect(labels).toEqual([...labels].sort((a, b) => a.localeCompare(b)))
  })

  it('counts a section as filled exactly when it has photos', () => {
    // Dive-site chips link only to filled sections. If this set drifted, chips
    // would either dead-end or stay plain text with photos sitting behind them.
    for (const s of GALLERY) {
      expect(FILLED_SECTIONS.has(s.key), `'${s.key}' filled state disagrees`).toBe(
        s.photos.length > 0,
      )
    }
  })

  it('gives every section a distinct key', () => {
    // Duplicate keys would mean two elements sharing one id, and the anchor
    // would scroll to whichever came first.
    const keys = GALLERY.map((s) => s.key)
    expect(new Set(keys).size).toBe(keys.length)
  })

  it('claims every folder of photos on disk', () => {
    // A folder whose name matches no section is invisible on the page. Usually a
    // typo — `moray-eels` instead of `moray_eels`.
    expect(ORPHAN_FOLDERS, 'photo folders that no section will ever show').toEqual([])
  })

  it('lists every photo exactly once', () => {
    // Photos.svelte keys its each-block by the image path. A repeated path is a
    // duplicate key, and Svelte throws on those — the whole page goes blank.
    const srcs = ALL_PHOTOS.map((p) => p.src)
    expect(srcs).toHaveLength(new Set(srcs).size)
  })

  it('flattens to the sum of its sections', () => {
    // The lightbox steps through ALL_PHOTOS by index, so it must contain every
    // photo the page can show and nothing else.
    expect(ALL_PHOTOS).toHaveLength(GALLERY.reduce((n, s) => n + s.photos.length, 0))
  })
})
