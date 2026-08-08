import { describe, it, expect } from 'vitest'
import {
  NEWS,
  NEWS_KINDS,
  NEWS_TEXT_EN,
  MALFORMED_FOLDERS,
  FOLDERS_WITHOUT_ARTICLE,
  ORPHAN_CAPTIONS,
  newsBySlug,
  splitFolderName,
  newsJa,
  newsZhTW,
} from './index'
import { newsText, untranslatedNews } from '$engine/i18n-content'

// A news article is assembled from a folder name and a glob, which means most
// of the ways it can go wrong are silent: the post does not appear, or appears
// under the wrong date, or appears with somebody else's caption. Nothing
// throws. These check the assembly.

describe('news folders', () => {
  it('are all named YYYY-MM-DD-slug, with a real date', () => {
    // The folder name is the only source of the date and the address, so a
    // misnamed folder is not a post that renders oddly — it is a post that is
    // not on the site at all, with nothing to say so.
    expect(MALFORMED_FOLDERS, 'these folders are being skipped entirely').toEqual([])
  })

  it('all contain an article.ts', () => {
    expect(FOLDERS_WITHOUT_ARTICLE, 'photos here belong to no article').toEqual([])
  })

  it('never caption a photo that is not there', () => {
    // Renaming a photo and forgetting its caption key drops the caption without
    // a word — and the caption is also the alt text, so the photo loses its
    // description for screen readers at the same time.
    expect(ORPHAN_CAPTIONS, 'these captions are attached to nothing').toEqual([])
  })
})

describe('splitFolderName', () => {
  it('reads the date and the slug', () => {
    expect(splitFolderName('2026-06-14-womens-dive-day')).toEqual({
      date: '2026-06-14',
      slug: 'womens-dive-day',
    })
  })

  it('keeps hyphens in the slug', () => {
    expect(splitFolderName('2026-01-02-a-b-c')?.slug).toBe('a-b-c')
  })

  it('rejects a folder with no date', () => {
    expect(splitFolderName('womens-dive-day')).toBeNull()
  })

  it('rejects a date with no slug after it', () => {
    expect(splitFolderName('2026-06-14')).toBeNull()
    expect(splitFolderName('2026-06-14-')).toBeNull()
  })

  it('rejects a day that does not exist', () => {
    // `new Date('2026-02-30')` rolls forward into March rather than failing, so
    // without the round-trip check the post would publish on a date the folder
    // does not name and sort into the wrong place.
    expect(splitFolderName('2026-02-30-x')).toBeNull()
    expect(splitFolderName('2026-13-01-x')).toBeNull()
    expect(splitFolderName('2026-00-10-x')).toBeNull()
  })

  it('rejects a two-digit year', () => {
    expect(splitFolderName('26-06-14-x')).toBeNull()
  })
})

describe('news articles', () => {
  it('exist at all', () => {
    // Guards every other test in this file against passing vacuously.
    expect(NEWS.length, 'no articles found — the glob in news.ts matched nothing').toBeGreaterThan(
      0,
    )
  })

  it('run newest first', () => {
    const dates = NEWS.map((a) => a.date)
    expect(dates, 'the feed is out of order').toEqual([...dates].sort().reverse())
  })

  it('have a unique address each', () => {
    const slugs = NEWS.map((a) => a.slug)
    expect(slugs, 'two folders share a slug; one of them is unreachable').toHaveLength(
      new Set(slugs).size,
    )
  })

  it('fill in every field', () => {
    for (const a of NEWS) {
      for (const field of ['title', 'summary', 'body'] as const) {
        expect(a[field]?.trim(), `${a.slug}.${field} is empty`).not.toBe('')
      }
    }
  })

  it('carry a kind the page can label', () => {
    // The chip reads $t.news.kinds[kind]. An unknown kind renders as nothing —
    // no error, just a gap where the label goes.
    for (const a of NEWS) {
      expect(NEWS_KINDS, `${a.slug} has kind '${a.kind}'`).toContain(a.kind)
    }
  })

  it('hold at most three photos', () => {
    // The article page lays out 1, 2 or 3 across; a fourth would land in a
    // second row of its own and look like a mistake.
    for (const a of NEWS) {
      expect(a.photos.length, `${a.slug} has ${a.photos.length} photos`).toBeLessThanOrEqual(3)
    }
  })

  it('give every photo alt text', () => {
    for (const a of NEWS) {
      for (const p of a.photos) {
        expect(p.alt.trim(), `a photo in ${a.slug} has no alt text`).not.toBe('')
      }
    }
  })

  it('are findable by slug', () => {
    for (const a of NEWS) expect(newsBySlug(a.slug)?.slug).toBe(a.slug)
  })

  it('returns nothing for an address that is not a story', () => {
    expect(newsBySlug('no-such-story')).toBeUndefined()
  })
})

// News is the one content type whose translations are allowed to lag: a post
// goes up in English the day it is written. So an *absent* translation is fine
// and falls back to English. A *wrong* one is not — a slug nobody has, or a
// field left blank, means somebody's writing is not reaching a reader.
describe.each([
  ['ja', newsJa],
  ['zh-TW', newsZhTW],
] as const)('%s translations', (name, overlay) => {
  it('are keyed to an article that exists', () => {
    const unknown = Object.keys(overlay).filter((slug) => !(slug in NEWS_TEXT_EN))
    expect(unknown, `${name}: these slugs match no article, so nobody will read them`).toEqual([])
  })

  it('fill in all three fields when they exist at all', () => {
    // Falling back per-field would mix two languages inside one story, so the
    // resolver falls back per-article. A half-filled entry therefore publishes
    // a blank title or an empty body rather than the English.
    for (const [slug, text] of Object.entries(overlay)) {
      for (const field of ['title', 'summary', 'body'] as const) {
        expect(text[field]?.trim(), `${name}.${slug}.${field} is empty`).not.toBe('')
      }
    }
  })

  it('are used when present, and English shows through when not', () => {
    const [first] = NEWS
    const translated = overlay[first.slug]
    expect(newsText(first.slug, name).title).toBe(translated?.title ?? first.title)
  })

  it('report what is still waiting to be translated', () => {
    // Deliberately not an assertion. This prints the backlog so it stays
    // visible; making it fail would mean a post cannot go up until all three
    // languages are written, which is the rule this content type opts out of.
    //
    // `process.stdout.write` rather than `console.log`, and that is not a
    // style choice: Vitest's default reporter captures console output and only
    // replays it for tests that *fail*, so a console.log here would be swallowed
    // on every run where it matters. Writing to stdout directly goes around the
    // capture. (`--reporter=verbose` would also show it, but nobody runs that.)
    const waiting = untranslatedNews(name)
    if (waiting.length) {
      process.stdout.write(
        `\n  ${waiting.length} news article(s) not yet translated to ${name} — ` +
          `readers see the English until then:\n` +
          waiting.map((s) => `    · ${s}`).join('\n') +
          `\n  Add a '${name}' block to each one's article.ts when you get to it.\n\n`,
      )
    }
    expect(waiting.every((slug) => slug in NEWS_TEXT_EN)).toBe(true)
  })
})
