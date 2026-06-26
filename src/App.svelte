<script lang="ts">
  import type { Component } from 'svelte'
  import { path, handleLinkClick } from './lib/router'
  import Nav from './components/Nav.svelte'
  import Footer from './components/Footer.svelte'
  import Home from './routes/Home.svelte'
  import Courses from './routes/Courses.svelte'
  import Sites from './routes/Sites.svelte'
  import Photos from './routes/Photos.svelte'
  import Trips from './routes/Trips.svelte'
  import Calendar from './routes/Calendar.svelte'
  import Team from './routes/Team.svelte'
  import NotFound from './routes/NotFound.svelte'

  const routes: Record<string, Component> = {
    '/': Home,
    '/courses': Courses,
    '/sites': Sites,
    '/photos': Photos,
    '/trips': Trips,
    '/calendar': Calendar,
    '/team': Team,
  }

  let Current = $derived(routes[$path] ?? NotFound)
</script>

<svelte:window onclick={handleLinkClick} />

<div class="flex min-h-screen flex-col">
  <Nav />
  <main class="flex-1">
    <Current />
  </main>
  <Footer />
</div>
