import { describe, it, expect } from 'vitest'
import { wixImageLocal, mediaIdLocal } from './images'

// Resolving a Wix media reference to the local copy we harvested from the old
// site. The whole module is string surgery over a URL format we do not control
// and can no longer look up: if a ref stops parsing, the photo silently becomes
// a placeholder and nothing errors. These pin the shapes that must keep working.

const KNOWN_REF = 'wix:image://v1/b37fef_1a2b3c~mv2.jpg/some-file.jpg#originWidth=1000'

describe('wixImageLocal', () => {
  it.each([null, undefined, ''])('returns null for %j', (ref) => {
    expect(wixImageLocal(ref)).toBeNull()
  })

  it('returns null for anything that is not a wix ref', () => {
    expect(wixImageLocal('https://example.com/photo.jpg')).toBeNull()
    expect(wixImageLocal('/imgs/diver-bg.jpg')).toBeNull()
    expect(wixImageLocal('b37fef_1a2b3c~mv2.jpg')).toBeNull()
  })

  it('returns null for a well-formed ref we have no local copy of', () => {
    expect(wixImageLocal(KNOWN_REF)).toBeNull()
  })

  it('does not throw on a truncated ref', () => {
    expect(() => wixImageLocal('wix:image://v1/')).not.toThrow()
    expect(wixImageLocal('wix:image://v1/')).toBeNull()
  })

  it('reads the media id from the first path segment, ignoring the filename and fragment', () => {
    // All three name the same media id, so all three must resolve alike —
    // whether that is a photo or null depends on what is in the tree, but they
    // cannot disagree with each other.
    const withFragment = 'wix:image://v1/abc_def~mv2.jpg/pretty-name.jpg#originWidth=99'
    const withoutFragment = 'wix:image://v1/abc_def~mv2.jpg/pretty-name.jpg'
    const bare = 'wix:image://v1/abc_def~mv2.jpg'

    expect(wixImageLocal(withFragment)).toBe(wixImageLocal(withoutFragment))
    expect(wixImageLocal(withoutFragment)).toBe(wixImageLocal(bare))
  })

  it('agrees with mediaIdLocal given the same media id', () => {
    // The two entry points slugify identically; a divergence would mean a photo
    // resolvable one way and not the other.
    expect(wixImageLocal('wix:image://v1/abc_def~mv2.jpg/x.jpg')).toBe(
      mediaIdLocal('abc_def~mv2.jpg'),
    )
  })
})

describe('mediaIdLocal', () => {
  it('returns null for a media id we do not have', () => {
    expect(mediaIdLocal('definitely-not-a-real-media-id')).toBeNull()
  })

  it('slugifies punctuation, so the raw id and its filename form agree', () => {
    // The files on disk are named with every non-alphanumeric replaced by an
    // underscore; these two spellings must therefore land on the same file.
    expect(mediaIdLocal('abc_def~mv2.jpg')).toBe(mediaIdLocal('abc_def_mv2_jpg'))
  })

  it('does not throw on an empty id', () => {
    expect(() => mediaIdLocal('')).not.toThrow()
  })

  it('returns a well-formed responsive image when it does find one', () => {
    const image = mediaIdLocal('youbike')
    if (image === null) return // no such photo in the tree; nothing to assert
    expect(typeof image.src).toBe('string')
    expect(image.srcset).toContain('w')
    expect(image.width).toBeGreaterThan(0)
    expect(image.height).toBeGreaterThan(0)
  })
})
