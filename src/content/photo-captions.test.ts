import { describe, it, expect } from 'vitest'
import captions from './__fixtures__/sample-captions.yaml'
import type { PhotoMeta } from './photo-gallery'

// Photo captions are written in YAML next to the pictures and turned into data
// while the site is built (vite.yaml.ts), so no YAML parser reaches the browser.
// That only works while the plugin is registered in *both* vite.config.ts and
// vitest.config.ts. This test is the alarm for when it is not: the import above
// would fail outright, or come back as an unparsed string.

describe('photo captions in YAML', () => {
  const entry = (captions as Record<string, PhotoMeta>)['chromodoris.webp']

  it('arrives as an object, already parsed', () => {
    expect(typeof captions).toBe('object')
    expect(entry).toBeDefined()
  })

  it('keeps every field the lightbox knows how to show', () => {
    expect(entry.species).toBe('Chromodoris annae')
    expect(entry.commonName).toBe("Anna's chromodoris")
    expect(entry.site).toBe('Long Dong (82.5)')
    expect(entry.depth).toBe('12 m')
    expect(entry.camera).toBe('Olympus TG-6')
    expect(entry.settings).toBe('f/8 · 1/160 s · ISO 200')
  })

  it('reads a date as text, not as a Date', () => {
    // YAML turns a bare 2025-08-14 into a Date object, which would render as
    // "Thu Aug 14 2025 08:00:00 GMT+0800" on the page. The loader is configured
    // to leave it alone; if that ever changes, this catches it.
    expect(entry.taken).toBe('2025-08-14')
  })

  it('handles punctuation in a caption', () => {
    expect(entry.notes).toContain('a colon: and a comma')
  })
})
