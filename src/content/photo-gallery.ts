import { MARINE_LIFE, marineSlug } from './marine-life'

// Photo-gallery catalog for the /photos page.
//
// There is one section per creature in the marine-life vocabulary, plus "reef"
// for shots of the reef itself. Every section exists whether or not it has any
// photos yet, because the dive-site pages link to all of them: a chip reading
// "Moray eels" points at /photos#moray_eels, and that has to land somewhere.
//
// To fill a section, create src/content/photos/gallery/<slug>/ and drop files
// in. Nothing here needs editing — the build finds them with a glob, and the
// section stops saying "coming soon" on its own.
//
// Captions live in a `photos.yaml` beside the pictures, keyed by filename. See
// docs/adding-photos.md; every field is optional.

export type PhotoMeta = {
  species?: string
  commonName?: string
  site?: string
  taken?: string
  depth?: string
  camera?: string
  lens?: string
  settings?: string
  photographer?: string
  notes?: string
}

export type Photo = { src: string; meta: PhotoMeta }
export type GallerySection = { key: string; label: string; photos: Photo[] }

const files = import.meta.glob('./photos/gallery/*/*.{avif,webp,jpg,jpeg,png}', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>

// One captions file per folder. Keyed by the picture's filename, so renaming a
// photo drops its caption rather than attaching it to the wrong animal.
const captionFiles = import.meta.glob('./photos/gallery/*/photos.{yaml,yml}', {
  eager: true,
  import: 'default',
}) as Record<string, Record<string, PhotoMeta>>

/** The folder a globbed path sits in: './photos/gallery/reef/a.webp' -> 'reef'. */
function folderOf(path: string): string | undefined {
  return path.match(/\/gallery\/([^/]+)\//)?.[1]
}

const captionsByFolder: Record<string, Record<string, PhotoMeta>> = {}
for (const [path, data] of Object.entries(captionFiles)) {
  const folder = folderOf(path)
  if (folder) captionsByFolder[folder] = data ?? {}
}

// Bucket the discovered pictures by their folder, filename-sorted so the layout
// is stable between builds.
const byFolder: Record<string, Photo[]> = {}
for (const [path, src] of Object.entries(files).sort(([a], [b]) => a.localeCompare(b))) {
  const folder = folderOf(path)
  if (!folder) continue
  const filename = path.split('/').pop() ?? ''
  ;(byFolder[folder] ??= []).push({ src, meta: captionsByFolder[folder]?.[filename] ?? {} })
}

/** Sections that are not one of the marine-life creatures. */
const EXTRA_SECTIONS: Array<{ key: string; label: string }> = [{ key: 'reef', label: 'The reef' }]

export const GALLERY: GallerySection[] = [
  ...MARINE_LIFE.map((label) => ({ key: marineSlug(label), label })),
  ...EXTRA_SECTIONS,
].map(({ key, label }) => ({ key, label, photos: byFolder[key] ?? [] }))

/** Flat list of every photo, in section order — what the lightbox steps through.
 *  Empty sections contribute nothing, so an index here is always a real photo. */
export const ALL_PHOTOS: Photo[] = GALLERY.flatMap((s) => s.photos)

/** Folders on disk that no section claims — a typo in a folder name, usually. */
export const ORPHAN_FOLDERS: string[] = Object.keys(byFolder).filter(
  (folder) => !GALLERY.some((s) => s.key === folder),
)
