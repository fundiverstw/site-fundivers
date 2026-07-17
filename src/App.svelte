<script lang="ts">
  import { type Component } from 'svelte'
  import { path, handleLinkClick } from '$engine/router'
  import { locale } from '$engine/i18n'
  import Nav from '$components/Nav.svelte'
  import Footer from '$components/Footer.svelte'
  import Home from '$pages/Home.svelte'
  import Courses from '$pages/Courses.svelte'
  import CourseDetail from '$pages/CourseDetail.svelte'
  import Sites from '$pages/Sites.svelte'
  import DiveSiteDetail from '$pages/DiveSiteDetail.svelte'
  import Map from '$pages/Map.svelte'
  import Photos from '$pages/Photos.svelte'
  import Travel from '$pages/Travel.svelte'
  import Gear from '$pages/Gear.svelte'
  import Services from '$pages/Services.svelte'
  import Calendar from '$pages/Calendar.svelte'
  import Team from '$pages/Team.svelte'
  import NotFound from '$pages/NotFound.svelte'

  const routes: Record<string, Component> = {
    '/': Home,
    '/courses': Courses,
    '/sites': Sites,
    '/map': Map,
    '/photos': Photos,
    '/travel': Travel,
    '/gear': Gear,
    '/services': Services,
    '/calendar': Calendar,
    '/team': Team,
  }

  // /sites/<id> and /courses/<id> render dedicated detail pages; each reads the
  // id from the path itself. All other paths use the exact-match table above.
  let Current = $derived.by(() => {
    if ($path.startsWith('/sites/') && $path.length > '/sites/'.length) return DiveSiteDetail
    if ($path.startsWith('/courses/') && $path.length > '/courses/'.length) return CourseDetail
    return routes[$path] ?? NotFound
  })

  // Keep <html lang> in sync with the chosen locale.
  $effect(() => {
    document.documentElement.lang = $locale
  })
</script>

<svelte:window onclick={handleLinkClick} />

<div class="relative z-10 flex min-h-screen flex-col">
  <Nav />
  <main class="flex-1">
    <Current />
  </main>
  <Footer />
</div>
