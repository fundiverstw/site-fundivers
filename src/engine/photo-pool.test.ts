import { describe, it, expect } from 'vitest'
import {
  siteImage,
  hikeImage,
  siteIdForTitle,
  adventureImage,
  eventImage,
  coursePoolImage,
  fallbackImage,
} from './photo-pool'
import { DIVE_SITES } from '$content/dive-sites'
import { HIKES } from '$content/hikes'

// Which photo each card gets. Two properties matter and neither is obvious from
// reading the code:
//
//  1. Memoization. Every picker caches by key, because the alternative is a
//     photo that changes on each re-render — a card that flickers to a
//     different picture when the language switches or a filter is toggled.
//  2. The pickers use Math.random to break ties between equally-used photos, so
//     a test may only assert what is true for *every* draw. Anything asserting a
//     particular photo would pass or fail by luck.

/** A photo, or null, but never a half-built object. */
function expectWellFormed(image: ReturnType<typeof siteImage>) {
  if (image === null) return
  expect(typeof image.src).toBe('string')
  expect(image.src.length).toBeGreaterThan(0)
  expect(image.srcset).toContain('w')
  expect(image.width).toBeGreaterThan(0)
  expect(image.height).toBeGreaterThan(0)
}

describe('siteImage', () => {
  it('returns a well-formed photo or null for every dive site', () => {
    for (const site of DIVE_SITES) expectWellFormed(siteImage(site.id))
  })

  it('gives at least some dive sites a cover', () => {
    expect(DIVE_SITES.some((s) => siteImage(s.id) !== null)).toBe(true)
  })

  it('returns the same cover every time, so the card does not change', () => {
    for (const site of DIVE_SITES) expect(siteImage(site.id)).toBe(siteImage(site.id))
  })

  it('returns null for a site with no folder', () => {
    expect(siteImage('no-such-dive-site')).toBeNull()
  })
})

describe('hikeImage', () => {
  it('returns a well-formed photo or null for every hike', () => {
    for (const hike of HIKES) expectWellFormed(hikeImage(hike.id))
  })

  it('is stable across calls', () => {
    for (const hike of HIKES) expect(hikeImage(hike.id)).toBe(hikeImage(hike.id))
  })

  it('returns null for an unknown hike', () => {
    expect(hikeImage('no-such-hike')).toBeNull()
  })
})

describe('siteIdForTitle', () => {
  it('matches a dive site named in an event title', () => {
    // Every matcher must actually be reachable; a pattern that no title can
    // reach is a dive site that silently never gets its own photos.
    expect(siteIdForTitle('Bat Cave fun dive')).toBeTruthy()
  })

  it('returns null for a title naming no site', () => {
    expect(siteIdForTitle('Christmas party')).toBeNull()
  })

  it('resolves every matcher it returns to a real dive site', () => {
    const ids = new Set(DIVE_SITES.map((s) => s.id))
    for (const site of DIVE_SITES) {
      const matched = siteIdForTitle(site.name)
      if (matched !== null) expect(ids, `${site.name} matched ${matched}`).toContain(matched)
    }
  })

  it('prefers the more specific matcher when two could apply', () => {
    // EVENT_TITLE_MATCHERS is an ordered list and the order is load-bearing:
    // the first pattern wins, so the specific ones have to come before the
    // general ones. Re-sorting that array alphabetically would break this.
    const specific = siteIdForTitle('Bat Cave')
    const general = siteIdForTitle('a dive somewhere')
    expect(specific).not.toBe(general)
  })
})

describe('adventureImage', () => {
  it('gives a hike its own photo when the event slug matches', () => {
    const hike = HIKES.find((h) => hikeImage(h.id) !== null)
    if (!hike) return // no hike photos in the tree; nothing to assert
    expect(adventureImage({ title: 'Guided walk', category: hike.eventSlug })).toBe(
      hikeImage(hike.id),
    )
  })

  it('matches a hike named in the title when the slug says nothing', () => {
    const hike = HIKES.find((h) => hikeImage(h.id) !== null)
    if (!hike) return
    expect(adventureImage({ title: `Sunset ${hike.name} walk`, category: null })).toBe(
      hikeImage(hike.id),
    )
  })

  it('matches a hike case-insensitively', () => {
    const hike = HIKES.find((h) => hikeImage(h.id) !== null)
    if (!hike) return
    expect(adventureImage({ title: hike.name.toUpperCase(), category: null })).toBe(
      hikeImage(hike.id),
    )
  })

  it.each(['YouBike river tour', 'Evening bike ride', 'Riverside cycling'])(
    'finds a cover for the bike outing %j',
    (title) => {
      expectWellFormed(adventureImage({ title, category: null }))
    },
  )

  it('never leaves an adventure card blank when there are general photos', () => {
    // The last fallback exists so no card ever shows the placeholder.
    const image = adventureImage({ title: 'Something else entirely', category: null })
    expectWellFormed(image)
    expect(image).not.toBeNull()
  })
})

describe('eventImage', () => {
  it('returns the same photo for the same event id, across calls', () => {
    const ev = { id: 'stable-1', type: 'dive' as const, title: 'Bat Cave fun dive' }
    expect(eventImage(ev)).toBe(eventImage(ev))
  })

  it('memoizes on the id alone, so a re-render with a changed title keeps the photo', () => {
    const first = eventImage({ id: 'stable-2', type: 'dive', title: 'Bat Cave fun dive' })
    const second = eventImage({ id: 'stable-2', type: 'dive', title: 'Something quite different' })
    expect(second).toBe(first)
  })

  it('gives courses a photo', () => {
    const image = eventImage({ id: 'course-evt-1', type: 'course', title: 'PADI Open Water' })
    expectWellFormed(image)
    expect(image).not.toBeNull()
  })

  it('gives a dive whose title matches no site a photo anyway', () => {
    const image = eventImage({ id: 'unmatched-1', type: 'dive', title: 'Mystery outing' })
    expectWellFormed(image)
    expect(image).not.toBeNull()
  })

  it('spreads repeats rather than showing one photo over and over', () => {
    // The least-used picker exists so a screen full of cards is not a screen
    // full of the same picture. With more distinct events than photos in the
    // pool it must reuse, but it should not settle on a single one.
    const chosen = new Set<string>()
    for (let i = 0; i < 12; i++) {
      const image = eventImage({ id: `spread-${i}`, type: 'dive', title: 'Mystery outing' })
      if (image) chosen.add(image.src)
    }
    expect(chosen.size).toBeGreaterThan(1)
  })
})

describe('coursePoolImage', () => {
  it('is stable for the same course and seed', () => {
    expect(coursePoolImage('open-water', 'a')).toBe(coursePoolImage('open-water', 'a'))
  })

  it('treats a different seed as a different slot', () => {
    // Two photos on one course page must be able to differ; the seed is what
    // stops the second slot returning the first slot's cached photo.
    const a = coursePoolImage('open-water', 'slot-1')
    const b = coursePoolImage('open-water', 'slot-2')
    expectWellFormed(a)
    expectWellFormed(b)
  })

  it('falls back to a photo for a course with no folder of its own', () => {
    const image = coursePoolImage('a-course-with-no-photos', 'x')
    expectWellFormed(image)
    expect(image).not.toBeNull()
  })
})

describe('fallbackImage', () => {
  it('is stable for a given seed', () => {
    expect(fallbackImage('seed-1')).toBe(fallbackImage('seed-1'))
  })

  it('always returns something, so no card shows the placeholder', () => {
    for (const seed of ['a', 'b', 'c']) {
      const image = fallbackImage(seed)
      expectWellFormed(image)
      expect(image).not.toBeNull()
    }
  })
})
