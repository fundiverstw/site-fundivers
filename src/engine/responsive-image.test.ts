import { describe, it, expect } from 'vitest'
import { SIZES } from './responsive-image'

// `sizes` is the half of a responsive image that says which copy to take, and
// getting it wrong fails in the worst possible way: silently, and in the
// expensive direction. A browser that cannot parse the attribute falls back to
// assuming the image fills the viewport and takes the *largest* copy — which is
// precisely the behaviour the whole sized-photo pipeline exists to prevent.
// Nothing errors, nothing looks wrong on a desk, and the site just gets heavy
// again on a phone.
//
// e2e/responsive-images.spec.ts catches this from the outside, by watching which
// files a real browser downloads. These check the strings themselves, so a typo
// is named at the point it was typed rather than inferred from a width limit
// three files away.

const entries = Object.entries(SIZES)

/** A CSS length a `sizes` entry may end with: 22rem, 45vw, 100vw, 350px. */
const LENGTH = /^\d+(\.\d+)?(rem|em|px|vw|vh|ch|%)$/

/** A media condition, as `sizes` allows it: (min-width: 64rem). */
const MEDIA = /^\(\s*(min|max)-width\s*:\s*\d+(\.\d+)?(rem|em|px)\s*\)$/

/** Split 'a, b, c' into its entries, the way the attribute is parsed. */
const parts = (value: string) => value.split(',').map((p) => p.trim())

describe('SIZES', () => {
  it('has entries to check', () => {
    expect(entries.length).toBeGreaterThan(0)
  })

  it.each(entries)('%s is a non-empty string', (_name, value) => {
    expect(typeof value).toBe('string')
    expect(value.trim().length).toBeGreaterThan(0)
  })

  it.each(entries)('%s has no empty or trailing entries', (_name, value) => {
    expect(parts(value).every((p) => p.length > 0)).toBe(true)
    expect(value.trim().endsWith(',')).toBe(false)
  })

  it.each(entries)('%s ends with a bare fallback length', (_name, value) => {
    // The last entry carries no media condition and is what every screen that
    // matched nothing else gets. Without it the attribute is incomplete and the
    // browser reverts to the 100vw assumption.
    const last = parts(value).at(-1)!
    expect(last, `${last} is not a bare CSS length`).toMatch(LENGTH)
  })

  it.each(entries)(
    '%s gives every earlier entry a media condition and a length',
    (_name, value) => {
      const all = parts(value)
      for (const part of all.slice(0, -1)) {
        const split = part.lastIndexOf(' ')
        expect(split, `${part} has no length after its condition`).toBeGreaterThan(0)
        const condition = part.slice(0, split).trim()
        const length = part.slice(split + 1).trim()
        expect(condition, `${condition} is not a media condition`).toMatch(MEDIA)
        expect(length, `${length} is not a CSS length`).toMatch(LENGTH)
      }
    },
  )

  it.each(entries)('%s puts its bare fallback last and nowhere else', (_name, value) => {
    // A bare length matches everything, so anything after it is dead. Browsers
    // take the first match, which would make the later, more specific entries
    // silently unreachable.
    const bare = parts(value).filter((p) => LENGTH.test(p))
    expect(bare).toHaveLength(1)
    expect(parts(value).at(-1)).toBe(bare[0])
  })

  it.each(entries)('%s orders its breakpoints from wide to narrow', (_name, value) => {
    // `sizes` is first-match-wins, so a narrow condition listed before a wide
    // one would shadow it: (min-width: 40rem) matches a 64rem screen too.
    const mins = parts(value)
      .slice(0, -1)
      .map((p) => /min-width\s*:\s*(\d+(?:\.\d+)?)/.exec(p))
      .filter((m): m is RegExpExecArray => m !== null)
      .map((m) => Number(m[1]))

    expect([...mins].sort((a, b) => b - a)).toEqual(mins)
  })

  it('asks for the whole viewport in the lightbox', () => {
    // The one place that genuinely wants the biggest copy available.
    expect(SIZES.full).toBe('100vw')
  })

  it('caps the gallery grid below the card width, as its comment promises', () => {
    // The gallery deliberately understates how wide a thumbnail is painted, so
    // a dense phone screen takes a smaller copy. If someone "corrects" it to
    // match the CSS, the /photos page gets heavy again — so pin the intent.
    const fallback = (v: string) => Number(/^(\d+(?:\.\d+)?)vw$/.exec(parts(v).at(-1)!)?.[1])

    expect(fallback(SIZES.gallery)).toBeLessThan(fallback(SIZES.card))
  })
})
