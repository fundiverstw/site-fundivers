import { describe, it, expect } from 'vitest'
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { GALLERY, ALL_PHOTOS } from './photo-gallery'

// These paths are typed by hand and served straight to the browser. A typo is
// invisible in review and shows as a broken image on the Photos page.
const publicDir = resolve(import.meta.dirname, '../../public')

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

  it('points every path at a file that exists', () => {
    for (const path of ALL_PHOTOS) {
      expect(existsSync(resolve(publicDir, `.${path}`)), `missing file: ${path}`).toBe(true)
    }
  })

  it('serves every path from the site root, not from public/', () => {
    for (const path of ALL_PHOTOS) expect(path.startsWith('/imgs/')).toBe(true)
  })
})
