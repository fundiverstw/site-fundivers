<script lang="ts">
  import { type Component } from 'svelte'
  import { path, handleLinkClick, internalHref, movedTo, replacePath } from '$engine/router'
  import { routeKey, type RouteKey } from '$engine/routes'
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
  // Typed as a Record over RouteKey, so this table and the address list in
  // $engine/routes cannot drift apart: an address with no component here, or a
  // component here for an address that is not a route, fails the type check.
  const PAGES: Record<RouteKey, () => Promise<{ default: Component }>> = {
    '/': () => import('$pages/Home.svelte'),

    '/education': () => import('$pages/Education.svelte'),
    '/courses': () => import('$pages/Courses.svelte'),
    '/sealife': () => import('$pages/Photos.svelte'),
    '/quiz': () => import('$pages/Quiz.svelte'),

    '/community': () => import('$pages/Community.svelte'),
    '/surface-interval': () => import('$pages/News.svelte'),
    '/testimonials': () => import('$pages/Testimonials.svelte'),
    '/reviews': () => import('$pages/Reviews.svelte'),
    '/radio': () => import('$pages/Radio.svelte'),
    '/fundive': () => import('$pages/FunDive.svelte'),

    '/about': () => import('$pages/About.svelte'),
    '/origins': () => import('$pages/Origins.svelte'),
    '/team': () => import('$pages/Team.svelte'),

    '/go-diving': () => import('$pages/GoDiving.svelte'),
    '/calendar': () => import('$pages/Calendar.svelte'),
    '/sites': () => import('$pages/Sites.svelte'),
    '/map': () => import('$pages/Map.svelte'),
    '/travel': () => import('$pages/Travel.svelte'),
    '/build-trip': () => import('$pages/BuildTrip.svelte'),

    '/services': () => import('$pages/Services.svelte'),
    '/gear': () => import('$pages/Gear.svelte'),
    '/cycling': () => import('$pages/Cycling.svelte'),
    '/hiking': () => import('$pages/Hiking.svelte'),
    '/websites': () => import('$pages/Websites.svelte'),

    ':site': () => import('$pages/DiveSiteDetail.svelte'),
    ':course': () => import('$pages/CourseDetail.svelte'),
    ':news': () => import('$pages/NewsArticle.svelte'),
    ':missing': () => import('$pages/NotFound.svelte'),
  }

  // Pages already fetched, so going back to one is instant and a prefetch that
  // has already happened is never repeated. A plain object, not a Map: nothing
  // renders from it, so it does not need to be reactive.
  const loaded: Partial<Record<RouteKey, Component>> = {}

  /** Start fetching a page without showing it. Safe to call repeatedly. */
  function preload(key: RouteKey): void {
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

  // A bookmark or a search result pointing at one of the old addresses is
  // rewritten to its new one — see MOVED in $engine/router. `route` is what the
  // rest of this file works from, so the moved address never reaches routeKey
  // and /photos cannot flash a 404 on its way to /sealife while replaceState
  // catches up.
  let route = $derived(movedTo($path) ?? $path)
  $effect(() => {
    if (route !== $path) replacePath(route)
  })

  let Current = $state<Component | null>(null)
  $effect(() => {
    const key = routeKey(route)
    const cached = loaded[key]
    // Already have it: swap straight over, no flicker and no await.
    if (cached) return void (Current = cached)
    let cancelled = false
    // The page on screen stays until the new one arrives, rather than blanking.
    PAGES[key]()
      .then((m) => {
        loaded[key] = m.default
        if (!cancelled) Current = m.default
      })
      .catch(() => {
        // The chunk did not arrive — a dropped connection, or a deploy that
        // renamed it while this tab was open. The address bar already says the
        // new page, so leaving the old one rendered would be a lie. A reload
        // fetches the current index.html and its current chunk names.
        if (!cancelled) location.reload()
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
