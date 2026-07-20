// Self-hosted photos harvested from the old Wix site. We keep the original Wix
// image ref (or media id) in the content and resolve it here to our local
// optimized copy — no Wix CDN dependency at runtime.
//
// The copies live in src/content/photos/media/, alongside every other photo,
// and are discovered by a build-time glob: their filename (minus extension) is
// the slugified media id, so a ref resolves by looking its slug up in the map.
// Vite hashes and bundles the referenced files like any other asset.

import type { ResponsiveImage } from './responsive-image'

const files = import.meta.glob('../content/photos/media/*.{webp,avif,jpg,jpeg,png}', {
  eager: true,
  query: '?responsive',
  import: 'default',
}) as Record<string, ResponsiveImage>

// Map each media file's basename (its slugified id) to its sized copies.
const byId: Record<string, ResponsiveImage> = {}
for (const [path, image] of Object.entries(files)) {
  const name = path
    .split('/')
    .pop()
    ?.replace(/\.[^.]+$/, '')
  if (name) byId[name] = image
}

/** Slugify a Wix media id segment (e.g. `b37fef_abc~mv2.jpg`) to a filename. */
function slug(seg: string): string {
  return seg.replace(/[^a-zA-Z0-9]/g, '_')
}

/** Media id segment from a `wix:image://v1/<seg>/<filename>#…` ref. */
function wixMediaId(ref: string | null | undefined): string | null {
  if (!ref || !ref.startsWith('wix:image://')) return null
  const seg = ref
    .replace(/^wix:image:\/\/v1\//, '')
    .split('#')[0]
    .split('/')[0]
  return seg ? slug(seg) : null
}

/** Local copies of a `wix:image://…` ref, or null if we don't have that photo. */
export function wixImageLocal(ref: string | null | undefined): ResponsiveImage | null {
  const id = wixMediaId(ref)
  return id ? (byId[id] ?? null) : null
}

/** Local copies of an image known only by its raw Wix media id segment (e.g. the
 *  homepage service photos harvested from the live site). Null if we don't have
 *  it, which the image components render as a graceful placeholder. */
export function mediaIdLocal(seg: string): ResponsiveImage | null {
  return byId[slug(seg)] ?? null
}
