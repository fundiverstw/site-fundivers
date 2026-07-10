// Self-hosted photos live under /imgs/media/ (and event photos under the
// event-pool folders). We store the original Wix image ref (or media id) and
// resolve it to our local optimized copy here — no Wix CDN dependency at runtime.

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
