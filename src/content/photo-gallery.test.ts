import { describe, it, expect } from 'vitest'
import { readdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { GALLERY, ALL_PHOTOS } from './photo-gallery'

// The gallery is now discovered by a build-time glob over
// src/content/photos/gallery/<category>/, so a listed-but-missing file can no
// longer happen — the glob only ever returns files that exist. What is still
// worth guarding is the shape: every section has photos, nothing is listed
// twice, and every folder of photos on disk actually shows up as a section
// (i.e. nobody added a folder that SECTION_ORDER forgot).
const galleryDir = resolve(import.meta.dirname, 'photos/gallery')

describe('the photo gallery', () => {
  it('has sections, and every section has photos', () => {
    expect(GALLERY.length).toBeGreaterThan(0)
    for (const section of GALLERY) {
      expect(section.images.length, `section '${section.key}' is empty`).toBeGreaterThan(0)
    }
  })

  it('lists every photo exactly once', () => {
    // Photos.svelte keys its each-block by the image path. A repeated path is a
    // duplicate key, and Svelte throws on those — the whole page goes blank.
    expect(ALL_PHOTOS).toHaveLength(new Set(ALL_PHOTOS).size)
  })

  it('flattens to the sum of its sections', () => {
    expect(ALL_PHOTOS).toHaveLength(GALLERY.reduce((n, s) => n + s.images.length, 0))
  })

  it('surfaces every folder of photos as a section', () => {
    // A category folder that SECTION_ORDER forgot would silently never appear on
    // the page. Catch that: every non-empty folder on disk must be a section.
    const onDisk = readdirSync(galleryDir, { withFileTypes: true })
      .filter((e) => e.isDirectory())
      .filter((e) => readdirSync(resolve(galleryDir, e.name)).some((f) => /\.\w+$/.test(f)))
      .map((e) => e.name)
    const shown = new Set(GALLERY.map((s) => s.key))
    for (const cat of onDisk) {
      expect(shown.has(cat), `folder '${cat}' exists but is not in SECTION_ORDER`).toBe(true)
    }
  })
})
