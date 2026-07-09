<script lang="ts">
  import type { Component } from 'svelte'
  import { path, handleLinkClick } from './lib/router'
  import { locale } from './lib/i18n'
  import Nav from './components/Nav.svelte'
  import Footer from './components/Footer.svelte'
  import Home from './routes/Home.svelte'
  import Courses from './routes/Courses.svelte'
  import CourseDetail from './routes/CourseDetail.svelte'
  import Sites from './routes/Sites.svelte'
  import DiveSiteDetail from './routes/DiveSiteDetail.svelte'
  import Map from './routes/Map.svelte'
  import Photos from './routes/Photos.svelte'
  import Travel from './routes/Travel.svelte'
  import Gear from './routes/Gear.svelte'
  import Calendar from './routes/Calendar.svelte'
  import Team from './routes/Team.svelte'
  import NotFound from './routes/NotFound.svelte'
  import DeepDive from './components/game/DeepDive.svelte'

  const routes: Record<string, Component> = {
    '/': Home,
    '/courses': Courses,
    '/sites': Sites,
    '/map': Map,
    '/photos': Photos,
    '/travel': Travel,
    '/gear': Gear,
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

  // The animated caustics recompute fractal noise every frame — fine on
  // desktop, far too heavy for phone GPUs. Only morph the noise on non-touch,
  // wide screens that haven't asked for reduced motion. (On mobile the caustics
  // element is hidden entirely in CSS, so this also stops the SMIL ticking.)
  let animate = $state(false)
  $effect(() => {
    const mm = (q: string) => typeof matchMedia !== 'undefined' && matchMedia(q).matches
    animate = !mm('(prefers-reduced-motion: reduce)') &&
      !mm('(hover: none) and (pointer: coarse)') && !mm('(max-width: 820px)')
  })

  // Hidden easter-egg game.
  let gameOpen = $state(false)
</script>

<svelte:window onclick={handleLinkClick} />

<!-- Animated water caustics. Each layer = long, horizontally-stretched
     fractal ribbons (low + anisotropic baseFrequency → wave-like veins, not
     round particles) that slowly warp in place (baseFrequency morph = shimmer)
     and drift via CSS. A second, very-low-frequency "envelope" turbulence is
     multiplied over the ribbons so brightness varies across the screen — dense
     bright patches next to calm dark water — killing the uniform disco look. -->
<div class="caustics" aria-hidden="true">
  <svg class="caustics-layer cl-a" xmlns="http://www.w3.org/2000/svg">
    <filter id="caustic-a" x="-30%" y="-30%" width="160%" height="160%">
      <feTurbulence type="fractalNoise" baseFrequency="0.0038 0.013" numOctaves="3" seed="4" result="wave">
        {#if animate}
          <animate attributeName="baseFrequency" dur="19s" repeatCount="indefinite"
            values="0.0038 0.013;0.0050 0.011;0.0034 0.015;0.0038 0.013" keyTimes="0;0.35;0.7;1" />
        {/if}
      </feTurbulence>
      <feColorMatrix in="wave" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.34 0.34 0.34 0 0" result="wa" />
      <feComponentTransfer in="wa" result="veins"><feFuncA type="gamma" amplitude="2.6" exponent="4" offset="0" /></feComponentTransfer>
      <feTurbulence type="fractalNoise" baseFrequency="0.0016 0.0016" numOctaves="2" seed="11" result="env" />
      <feColorMatrix in="env" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0.5 0.5 0 0" result="ea" />
      <feComponentTransfer in="ea" result="mask"><feFuncA type="gamma" amplitude="1.6" exponent="2.4" offset="0.1" /></feComponentTransfer>
      <feComposite in="veins" in2="mask" operator="arithmetic" k1="1" k2="0" k3="0" k4="0" result="mod" />
      <feFlood flood-color="#a5f3ea" result="tint" />
      <feComposite in="tint" in2="mod" operator="in" />
    </filter>
    <rect width="100%" height="100%" filter="url(#caustic-a)" />
  </svg>
  <svg class="caustics-layer cl-b" xmlns="http://www.w3.org/2000/svg">
    <filter id="caustic-b" x="-30%" y="-30%" width="160%" height="160%">
      <feTurbulence type="fractalNoise" baseFrequency="0.0052 0.017" numOctaves="3" seed="23" result="wave">
        {#if animate}
          <animate attributeName="baseFrequency" dur="26s" repeatCount="indefinite"
            values="0.0052 0.017;0.0042 0.014;0.0060 0.020;0.0052 0.017" keyTimes="0;0.4;0.72;1" />
        {/if}
      </feTurbulence>
      <feColorMatrix in="wave" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.34 0.34 0.34 0 0" result="wa" />
      <feComponentTransfer in="wa" result="veins"><feFuncA type="gamma" amplitude="2.3" exponent="5" offset="0" /></feComponentTransfer>
      <feTurbulence type="fractalNoise" baseFrequency="0.0013 0.0013" numOctaves="2" seed="5" result="env" />
      <feColorMatrix in="env" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0.5 0.5 0 0" result="ea" />
      <feComponentTransfer in="ea" result="mask"><feFuncA type="gamma" amplitude="1.7" exponent="2.6" offset="0.08" /></feComponentTransfer>
      <feComposite in="veins" in2="mask" operator="arithmetic" k1="1" k2="0" k3="0" k4="0" result="mod" />
      <feFlood flood-color="#cba6f7" result="tint" />
      <feComposite in="tint" in2="mod" operator="in" />
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

<!-- Easter egg: a stray bubble drifting in the corner. Click it to play Deep Dive. -->
<button
  type="button"
  onclick={() => (gameOpen = true)}
  aria-label="Play the hidden dive game"
  title="?"
  class="egg-bubble fixed bottom-4 right-4 z-40 h-8 w-8 rounded-full border border-reef-200/40 bg-reef-300/10 opacity-60 backdrop-blur-sm transition hover:scale-110 hover:border-reef-200/80 hover:bg-reef-300/25 hover:opacity-100"
>
  <span class="pointer-events-none absolute left-[7px] top-[6px] h-1.5 w-1.5 rounded-full bg-white/75"></span>
</button>

<DeepDive open={gameOpen} onClose={() => (gameOpen = false)} />
