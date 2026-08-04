import type { ResponsiveImage } from '$engine/responsive-image'

// The /news feed: conferences, volunteer days, community outreach, educational
// initiatives — the things the team turns up to.
//
// ── Adding one ──────────────────────────────────────────────────────────────
//
// Make a folder under src/content/news/ named `YYYY-MM-DD-some-slug`, put an
// `article.ts` in it, and drop in up to three photos. Nothing here needs
// editing: the build finds the folder and the feed reorders itself.
//
//   src/content/news/
//     2026-06-14-womens-dive-day/
//       article.ts
//       1-briefing.jpg
//       2-underwater.jpg
//
// **The folder name is the date and the address.** `2026-06-14-womens-dive-day`
// publishes on 14 June 2026 at /news/womens-dive-day. There is deliberately no
// `date:` or `slug:` field in article.ts to disagree with it — rename the
// folder and both follow. news.test.ts rejects a folder that is not shaped
// `YYYY-MM-DD-slug`, or whose date is not a real calendar day.
//
// See docs/adding-news.md for the copy-paste template.

/** What kind of thing this was. The chip on the card; translated in text/. */
export const NEWS_KINDS = ['conference', 'volunteering', 'outreach', 'education'] as const
export type NewsKind = (typeof NEWS_KINDS)[number]

/** The part of an article a translator rewrites. Overlays (news.ja.ts,
 *  news.zh-TW.ts) are keyed by slug and hold exactly this. */
export type NewsText = {
  /** The headline. */
  title: string
  /** One line, shown on the card in the feed. Not repeated in the article. */
  summary: string
  /** The write-up. Blank line (`\n\n`) between paragraphs. */
  body: string
}

/** Everything in an `article.ts`. Date and slug come from the folder name. */
export type NewsArticleFile = NewsText & {
  kind: NewsKind
  /** Optional, keyed by the photo's exact filename. Used as the caption under
   *  the photo and as its alt text. A photo with no entry falls back to the
   *  article title for alt text and shows no caption. */
  captions?: Record<string, string>
}

export type NewsPhoto = { image: ResponsiveImage; caption: string | null; alt: string }

export type NewsArticle = NewsText & {
  /** From the folder name: the bit after the date. The address is /news/<slug>. */
  slug: string
  /** From the folder name, `YYYY-MM-DD`. */
  date: string
  kind: NewsKind
  photos: NewsPhoto[]
}

const articleFiles = import.meta.glob('./news/*/article.ts', { eager: true }) as Record<
  string,
  { article?: NewsArticleFile }
>

const photoFiles = import.meta.glob('./news/*/*.{avif,webp,jpg,jpeg,png}', {
  eager: true,
  query: '?responsive',
  import: 'default',
}) as Record<string, ResponsiveImage>

/** The folder a globbed path sits in: './news/2026-06-14-x/article.ts' -> '2026-06-14-x'. */
function folderOf(path: string): string | undefined {
  return path.match(/\/news\/([^/]+)\//)?.[1]
}

/** `2026-06-14-womens-dive-day` -> date + slug, or null if it is not shaped
 *  that way. Exported so the test can state the rule once. */
export function splitFolderName(folder: string): { date: string; slug: string } | null {
  const m = folder.match(/^(\d{4}-\d{2}-\d{2})-(.+)$/)
  if (!m) return null
  const [, date, slug] = m
  // `new Date('2026-02-30')` does not throw, it rolls over into March. Compare
  // the round trip so a day that does not exist is caught rather than published
  // under a different date than the folder claims.
  const parsed = new Date(`${date}T00:00:00Z`)
  if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== date) return null
  return { date, slug }
}

// Photos, bucketed by folder and sorted by filename — so `1-briefing.jpg`
// leads and the running order is something you set by naming the files, not by
// listing them somewhere else that can fall out of step.
const photosByFolder: Record<string, Array<[string, ResponsiveImage]>> = {}
for (const [path, image] of Object.entries(photoFiles).sort(([a], [b]) => a.localeCompare(b))) {
  const folder = folderOf(path)
  if (!folder) continue
  ;(photosByFolder[folder] ??= []).push([path.split('/').pop() ?? '', image])
}

/** Every article, newest first — the order the feed renders in.
 *
 *  A folder whose name is not `YYYY-MM-DD-slug`, or whose article.ts exports
 *  nothing, is skipped rather than crashing the page. news.test.ts fails on
 *  both, so the skip is a safety net for a bad deploy, not a way to ship one. */
export const NEWS: NewsArticle[] = Object.entries(articleFiles)
  .flatMap(([path, mod]) => {
    const folder = folderOf(path)
    const parts = folder ? splitFolderName(folder) : null
    const article = mod.article
    if (!parts || !article) return []
    const photos = (photosByFolder[folder!] ?? []).map(([filename, image]) => ({
      image,
      caption: article.captions?.[filename] ?? null,
      alt: article.captions?.[filename] ?? article.title,
    }))
    return [{ ...parts, ...article, photos }]
  })
  // Newest first. Dates are `YYYY-MM-DD`, so they sort correctly as strings.
  // Two articles on the same day fall back to the slug, so the order is stable
  // between builds rather than whatever the glob happened to return.
  .sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug))

/** One article by its address, or undefined. */
export function newsBySlug(slug: string): NewsArticle | undefined {
  return NEWS.find((a) => a.slug === slug)
}

/** The English text of every article, keyed by slug — what the translation
 *  overlays are checked against. */
export const NEWS_TEXT_EN: Record<string, NewsText> = Object.fromEntries(
  NEWS.map((a) => [a.slug, { title: a.title, summary: a.summary, body: a.body }]),
)

/** Folders that were skipped because their name is not `YYYY-MM-DD-slug` or
 *  their article.ts exports no `article`. The test reports these by name. */
export const MALFORMED_FOLDERS: string[] = Object.entries(articleFiles).flatMap(([path, mod]) => {
  const folder = folderOf(path)
  if (!folder) return []
  return !splitFolderName(folder) || !mod.article ? [folder] : []
})

/** Folders holding photos but no article.ts — a half-added post, usually. */
export const FOLDERS_WITHOUT_ARTICLE: string[] = Object.keys(photosByFolder).filter(
  (folder) => !Object.keys(articleFiles).some((p) => folderOf(p) === folder),
)

/** Photo filenames an article writes a caption for that do not exist. A caption
 *  keyed to a renamed or deleted photo is silently dropped otherwise. */
export const ORPHAN_CAPTIONS: Array<{ folder: string; filename: string }> = Object.entries(
  articleFiles,
).flatMap(([path, mod]) => {
  const folder = folderOf(path)
  if (!folder || !mod.article?.captions) return []
  const present = new Set((photosByFolder[folder] ?? []).map(([filename]) => filename))
  return Object.keys(mod.article.captions)
    .filter((filename) => !present.has(filename))
    .map((filename) => ({ folder, filename }))
})
