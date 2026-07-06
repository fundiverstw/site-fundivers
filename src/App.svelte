<script lang="ts">
  import type { Component } from 'svelte'
  import { path, handleLinkClick } from './lib/router'
  import { locale } from './lib/i18n'
  import Nav from './components/Nav.svelte'
  import Footer from './components/Footer.svelte'
  import Home from './routes/Home.svelte'
  import Courses from './routes/Courses.svelte'
  import Sites from './routes/Sites.svelte'
  import Map from './routes/Map.svelte'
  import Photos from './routes/Photos.svelte'
  import Travel from './routes/Travel.svelte'
  import Calendar from './routes/Calendar.svelte'
  import Team from './routes/Team.svelte'
  import NotFound from './routes/NotFound.svelte'

  const routes: Record<string, Component> = {
    '/': Home,
    '/courses': Courses,
    '/sites': Sites,
    '/map': Map,
    '/photos': Photos,
    '/travel': Travel,
    '/calendar': Calendar,
    '/team': Team,
  }

  let Current = $derived(routes[$path] ?? NotFound)

  // Keep <html lang> in sync with the chosen locale.
  $effect(() => {
    document.documentElement.lang = $locale
  })

  // Honour reduced-motion: without it we morph the caustic noise (shimmer);
  // with it we render the veins static.
  let animate = $state(true)
  $effect(() => {
    animate = !(typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches)
  })
</script>

<svelte:window onclick={handleLinkClick} />

<!-- Animated water caustics: two inline SVG layers whose fractal-turbulence
     "net" continuously warps (baseFrequency morph = shimmer) while also drifting
     via CSS. Turbulence ridges + a steep gamma give the sharp bright veins of
     sunlight refracting through moving water. -->
<div class="caustics" aria-hidden="true">
  <svg class="caustics-layer cl-a" xmlns="http://www.w3.org/2000/svg">
    <filter id="caustic-a" x="-20%" y="-20%" width="140%" height="140%">
      <feTurbulence type="turbulence" baseFrequency="0.013 0.018" numOctaves="2" seed="4" result="n">
        {#if animate}
          <animate attributeName="baseFrequency" dur="17s" repeatCount="indefinite"
            values="0.013 0.018;0.017 0.023;0.011 0.015;0.013 0.018" keyTimes="0;0.34;0.7;1" />
        {/if}
      </feTurbulence>
      <feColorMatrix in="n" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0.5 0.5 0 0" result="a" />
      <feComponentTransfer in="a" result="v"><feFuncA type="gamma" amplitude="3.4" exponent="6" offset="0" /></feComponentTransfer>
      <feFlood flood-color="#a5f3ea" result="tint" />
      <feComposite in="tint" in2="v" operator="in" />
    </filter>
    <rect width="100%" height="100%" filter="url(#caustic-a)" />
  </svg>
  <svg class="caustics-layer cl-b" xmlns="http://www.w3.org/2000/svg">
    <filter id="caustic-b" x="-20%" y="-20%" width="140%" height="140%">
      <feTurbulence type="turbulence" baseFrequency="0.019 0.024" numOctaves="2" seed="23" result="n">
        {#if animate}
          <animate attributeName="baseFrequency" dur="23s" repeatCount="indefinite"
            values="0.019 0.024;0.015 0.019;0.022 0.027;0.019 0.024" keyTimes="0;0.4;0.72;1" />
        {/if}
      </feTurbulence>
      <feColorMatrix in="n" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0.5 0.5 0 0" result="a" />
      <feComponentTransfer in="a" result="v"><feFuncA type="gamma" amplitude="3" exponent="7" offset="0" /></feComponentTransfer>
      <feFlood flood-color="#cba6f7" result="tint" />
      <feComposite in="tint" in2="v" operator="in" />
    </filter>
    <rect width="100%" height="100%" filter="url(#caustic-b)" />
  </svg>
</div>

<div class="relative z-10 flex min-h-screen flex-col">
  <Nav />
  <main class="flex-1">
    <Current />
  </main>
  <Footer />
</div>
