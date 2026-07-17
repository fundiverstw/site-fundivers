// Photo-gallery catalog for the /photos page. The photos are self-hosted dive
// shots living in src/content/photos/gallery/<category>/ — drop a file in the
// right folder and it appears; there is no list of filenames to maintain. The
// build discovers them with a glob (hashed + bundled like every other photo).
//
// The one thing a folder scan can't decide is the order the sections appear in,
// so that stays hand-listed here in SECTION_ORDER. Within a section, photos are
// ordered by filename so the layout is stable between builds.

export type GallerySection = { key: string; images: string[] }

// The subfolder name is the section `key`; it maps to an i18n label
// ($t.photos.sections). List them in the order they should appear on the page.
const SECTION_ORDER = ['nudibranchs', 'reef']

const files = import.meta.glob('./photos/gallery/*/*.{avif,webp,jpg,jpeg,png}', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>

// Bucket the discovered files by their immediate subfolder, filename-sorted.
const byCategory: Record<string, string[]> = {}
for (const [path, url] of Object.entries(files).sort(([a], [b]) => a.localeCompare(b))) {
  const category = path.match(/\/gallery\/([^/]+)\//)?.[1]
  if (category) (byCategory[category] ??= []).push(url)
}

// Sections in display order, skipping any that turned up empty.
export const GALLERY: GallerySection[] = SECTION_ORDER.filter((key) => byCategory[key]?.length).map(
  (key) => ({ key, images: byCategory[key] }),
)

/** Flat list of every image, in section order — used by the lightbox. */
export const ALL_PHOTOS: string[] = GALLERY.flatMap((s) => s.images)
