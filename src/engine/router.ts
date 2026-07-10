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

/** Programmatic navigation. Pushes history and notifies the `path` store. */
export function navigate(to: string): void {
  if (to === window.location.pathname) return
  window.history.pushState({}, '', to)
  window.dispatchEvent(new Event('app:navigate'))
  window.scrollTo({ top: 0, behavior: 'instant' })
}

/** Intercept clicks on internal <a> links for SPA navigation. */
export function handleLinkClick(event: MouseEvent): void {
  if (event.defaultPrevented || event.button !== 0) return
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
  const anchor = (event.target as HTMLElement).closest('a')
  if (!anchor) return
  const href = anchor.getAttribute('href')
  const target = anchor.getAttribute('target')
  if (
    !href ||
    href.startsWith('http') ||
    href.startsWith('#') ||
    href.startsWith('mailto:') ||
    href.startsWith('tel:')
  )
    return
  if (target === '_blank') return
  event.preventDefault()
  navigate(href)
}
