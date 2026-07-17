// Self-hosted photos harvested from the old Wix site. We keep the original Wix
// image ref (or media id) in the content and resolve it here to our local
// optimized copy — no Wix CDN dependency at runtime.
//
// The copies live in src/content/photos/media/, alongside every other photo,
// and are discovered by a build-time glob: their filename (minus extension) is
// the slugified media id, so a ref resolves by looking its slug up in the map.
// Vite hashes and bundles the referenced files like any other asset.

const files = import.meta.glob('../content/photos/media/*.{webp,avif,jpg,jpeg,png}', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>

// Map each media file's basename (its slugified id) to its bundled URL.
const byId: Record<string, string> = {}
for (const [path, url] of Object.entries(files)) {
  const name = path
    .split('/')
    .pop()
    ?.replace(/\.[^.]+$/, '')
  if (name) byId[name] = url
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

/** Local URL for a `wix:image://…` ref, or null if we don't have that photo. */
export function wixImageLocal(ref: string | null | undefined): string | null {
  const id = wixMediaId(ref)
  return id ? (byId[id] ?? null) : null
}

/** Local URL for an image known only by its raw Wix media id segment (e.g. the
 *  homepage service photos harvested from the live site). Empty string if we
 *  don't have it, which the image components render as a graceful placeholder. */
export function mediaIdLocal(seg: string): string {
  return byId[slug(seg)] ?? ''
}
