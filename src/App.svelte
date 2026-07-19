<script lang="ts">
  import { type Component } from 'svelte'
  import { path, handleLinkClick, internalHref } from '$engine/router'
  import { locale } from '$engine/i18n'
  import Nav from '$components/Nav.svelte'
  import Footer from '$components/Footer.svelte'

  // Pages are loaded on demand, one file each.
  //
  // Importing them all up front meant somebody reading one dive site also
  // downloaded the Taiwan map's coordinates and every course write-up — about
  // 200 kB gzipped for a page that needs 137. The cost of splitting them is one
  // extra request the first time you open a page, which `prefetch` below pays
  // early, while the pointer is still travelling towards the link.
  //
  // The two keys starting with a colon are the detail pages; they cannot be
  // plain paths because they match /sites/<anything>. `:missing` is the 404.
  const PAGES: Record<string, () => Promise<{ default: Component }>> = {
    '/': () => import('$pages/Home.svelte'),
    '/courses': () => import('$pages/Courses.svelte'),
    '/sites': () => import('$pages/Sites.svelte'),
    '/map': () => import('$pages/Map.svelte'),
    '/photos': () => import('$pages/Photos.svelte'),
    '/travel': () => import('$pages/Travel.svelte'),
    '/gear': () => import('$pages/Gear.svelte'),
    '/services': () => import('$pages/Services.svelte'),
    '/calendar': () => import('$pages/Calendar.svelte'),
    '/team': () => import('$pages/Team.svelte'),
    ':site': () => import('$pages/DiveSiteDetail.svelte'),
    ':course': () => import('$pages/CourseDetail.svelte'),
    ':missing': () => import('$pages/NotFound.svelte'),
  }

  /** Which entry of PAGES serves this address. */
  function routeKey(p: string): string {
    if (p.startsWith('/sites/') && p.length > '/sites/'.length) return ':site'
    if (p.startsWith('/courses/') && p.length > '/courses/'.length) return ':course'
    return PAGES[p] ? p : ':missing'
  }

  // Pages already fetched, so going back to one is instant and a prefetch that
  // has already happened is never repeated. A plain object, not a Map: nothing
  // renders from it, so it does not need to be reactive.
  const loaded: Record<string, Component> = {}

  /** Start fetching a page without showing it. Safe to call repeatedly. */
  function preload(key: string): void {
    if (loaded[key]) return
    void PAGES[key]()
      .then((m) => (loaded[key] = m.default))
      .catch(() => {}) // a failed prefetch is not an error; the click will retry
  }

  // Fetch the page under the pointer before it is clicked. `pointerenter` does
  // not bubble, so this listens for `pointerover` on the window instead of
  // putting a handler on every link.
  function onPointerOver(event: PointerEvent): void {
    const href = internalHref((event.target as HTMLElement | null)?.closest('a'))
    if (href) preload(routeKey(href))
  }

  let Current = $state<Component | null>(null)
  $effect(() => {
    const key = routeKey($path)
    const cached = loaded[key]
    // Already have it: swap straight over, no flicker and no await.
    if (cached) return void (Current = cached)
    let cancelled = false
    // The page on screen stays until the new one arrives, rather than blanking.
    PAGES[key]().then((m) => {
      loaded[key] = m.default
      if (!cancelled) Current = m.default
    })
    return () => {
      cancelled = true
    }
  })

  // Keep <html lang> in sync with the chosen locale.
  $effect(() => {
    document.documentElement.lang = $locale
  })
</script>

<svelte:window onclick={handleLinkClick} onpointerover={onPointerOver} />

<div class="relative z-10 flex min-h-screen flex-col">
  <Nav />
  <main class="flex-1">
    {#if Current}
      <Current />
    {/if}
  </main>
  <Footer />
</div>
