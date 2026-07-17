<script lang="ts">
  import { untrack, type Component } from 'svelte'
  import { path, handleLinkClick } from '$engine/router'
  import { locale } from '$engine/i18n'
  // Easter-egg game state — opened by clicking the nav mascot (NavMascot.svelte).
  import { gameOpen } from '$engine/game'
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

  // The Wreck Maze is an easter egg almost nobody opens, and it costs 15 kB
  // gzipped. Fetch it the first time somebody clicks the octopus, then keep it
  // mounted — it renders nothing at all while `open` is false, and staying
  // mounted means a second visit does not re-download it.
  let Game = $state<Component<{ open?: boolean; onClose: () => void }> | null>(null)
  $effect(() => {
    if (!$gameOpen) return
    // Reading `Game` untracked: this effect writes it, and depending on what it
    // writes is how you get effect_update_depth_exceeded.
    untrack(() => {
      if (Game) return
      import('$components/game/WreckMaze.svelte').then((m) => (Game = m.default))
    })
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

{#if Game}
  <Game open={$gameOpen} onClose={() => gameOpen.set(false)} />
{/if}
