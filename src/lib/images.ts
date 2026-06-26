// All event/destination/service photos are self-hosted under /imgs/media/
// (see scripts/fetch-wix-images.mjs). We store only the original Wix image ref
// (or media id) in/alongside the data and resolve it to our local optimized
// copy here — no Wix CDN dependency at runtime.

/** Slugify a Wix media id segment (e.g. `b37fef_abc~mv2.jpg`) to a filename. */
function slug(seg: string): string {
  return seg.replace(/[^a-zA-Z0-9]/g, '_')
}

/** Media id segment from a `wix:image://v1/<seg>/<filename>#…` ref. */
export function wixMediaId(ref: string | null | undefined): string | null {
  if (!ref || !ref.startsWith('wix:image://')) return null
  const seg = ref.replace(/^wix:image:\/\/v1\//, '').split('#')[0].split('/')[0]
  return seg ? slug(seg) : null
}

/** Local path for a `wix:image://…` ref, or null. */
export function wixImageLocal(ref: string | null | undefined): string | null {
  const id = wixMediaId(ref)
  return id ? `/imgs/media/${id}.webp` : null
}

/** Local path for an image known only by its raw Wix media id segment
 *  (e.g. the homepage service photos harvested from the live site). */
export function mediaIdLocal(seg: string): string {
  return `/imgs/media/${slug(seg)}.webp`
}
