import { describe, it, expect } from 'vitest'
import { DIVE_SITE_GUIDES } from './dive-site-guides'
import { DIVE_SITES } from './dive-sites'

const ids = DIVE_SITES.map((s) => s.id)
const entries = Object.entries(DIVE_SITE_GUIDES)

describe('dive-site guides', () => {
  // A guide is looked up by dive-site id. Misspell the key and the detail page
  // renders without error and without any of the text you just wrote.
  it('are all keyed by a dive site that exists', () => {
    for (const [key] of entries) expect(ids, `no dive site with id '${key}'`).toContain(key)
  })

  it('fill in every required field', () => {
    for (const [key, g] of entries) {
      for (const field of ['overview', 'depthRange', 'difficulty', 'bestSeason'] as const) {
        expect(g[field]?.trim(), `${key}.${field}`).not.toBe('')
      }
      expect(g.highlights.length, `${key}.highlights`).toBeGreaterThan(0)
      expect(g.marineLife.length, `${key}.marineLife`).toBeGreaterThan(0)
    }
  })

  it('leave no optional field as an empty string', () => {
    // An empty string is truthy enough to render the heading and nothing under it.
    for (const [key, g] of entries) {
      for (const field of [
        'belowSurface',
        'aboveSurface',
        'gettingThere',
        'requirements',
      ] as const) {
        if (g[field] !== undefined) expect(g[field]!.trim(), `${key}.${field}`).not.toBe('')
      }
    }
  })

  it('do not repeat an entry within one list', () => {
    for (const [key, g] of entries) {
      for (const field of ['highlights', 'marineLife'] as const) {
        expect(g[field], `${key}.${field} repeats an entry`).toHaveLength(new Set(g[field]).size)
      }
    }
  })

  it('cover most of the catalog', () => {
    // Not a hard requirement — a site without a guide degrades gracefully — but
    // if this drops sharply, someone has broken the keys.
    expect(entries.length).toBeGreaterThanOrEqual(Math.floor(ids.length * 0.75))
  })
})
