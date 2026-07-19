import { readable } from 'svelte/store'

// Minimal history-based router. Cloudflare serves index.html for unknown paths
// (wrangler.toml: not_found_handling = single-page-application), so clean URLs
// like /calendar resolve on direct load. No dependency, ~40 lines.

export const path = readable(window.location.pathname, (set) => {
  const update = () => set(window.location.pathname)
  window.addEventListener('popstate', update)
  window.addEventListener('app:navigate', update)
  return () => {
    window.removeEventListener('popstate', update)
    window.removeEventListener('app:navigate', update)
  }
})

/** Programmatic navigation. Pushes history and notifies the `path` store.
 *  Not exported: nothing outside this file needs it yet. */
function navigate(to: string): void {
  // Compare the whole address, not just the path. Comparing paths alone meant
  // clicking "Photos" while sitting on /photos#nudibranchs did nothing at all —
  // same path, so it returned early, leaving the stale anchor in the address bar
  // and the page still scrolled where it was.
  const next = new URL(to, window.location.href)
  const here = window.location
  if (next.href === here.href) return
  window.history.pushState({}, '', to)
  window.dispatchEvent(new Event('app:navigate'))
  // A link to an anchor is asking for a place in the page, not the top of it.
  if (!next.hash) window.scrollTo({ top: 0, behavior: 'instant' })
}

/**
 * The path this link points at, if it is one this router handles.
 *
 * Null for anything that must reach the browser untouched: another site, an
 * anchor on this page, a mail or phone link, or a link opening in a new tab.
 * Shared by the click handler and by App's prefetching, so the two can never
 * disagree about what counts as an internal link.
 */
export function internalHref(anchor: Element | null | undefined): string | null {
  if (!anchor) return null
  const href = anchor.getAttribute('href')
  if (!href) return null
  if (/^(https?:|#|mailto:|tel:)/.test(href)) return null
  if (anchor.getAttribute('target') === '_blank') return null
  return href
}

/**
 * Scroll to the element with this id, next frame.
 *
 * The frame matters: pages call this after opening a collapsed section or after
 * async data has arrived, and the element is not in the document until Svelte
 * has flushed. The browser's own jump to an anchor has already happened and
 * missed by then, which is why these pages scroll themselves.
 */
export function scrollToId(id: string): void {
  if (!id) return
  requestAnimationFrame(() => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  })
}

/** The id named by the current URL hash, decoded, or '' if there is none. */
export function hashId(): string {
  return decodeURIComponent(window.location.hash.replace(/^#/, ''))
}

/** Intercept clicks on internal <a> links for SPA navigation. */
export function handleLinkClick(event: MouseEvent): void {
  if (event.defaultPrevented || event.button !== 0) return
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
  const href = internalHref((event.target as HTMLElement).closest('a'))
  if (!href) return
  event.preventDefault()
  navigate(href)
}
