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

  // The two caustics layers. Same filter, different numbers: a teal layer of
  // fast fine ribbons, and a slower, broader mauve one rolling the other way.
  type CausticLayer = {
    id: string
    cls: string
    waveFreq: string
    waveSeed: string
    dur: string
    waveValues: string
    keyTimes: string
    veinAmplitude: string
    veinExponent: string
    envFreq: string
    envSeed: string
    maskAmplitude: string
    maskExponent: string
    maskOffset: string
    tint: string
  }

  const CAUSTIC_LAYERS: CausticLayer[] = [
    {
      id: 'caustic-a',
      cls: 'cl-a',
      waveFreq: '0.0038 0.013',
      waveSeed: '4',
      dur: '19s',
      waveValues: '0.0038 0.013;0.0050 0.011;0.0034 0.015;0.0038 0.013',
      keyTimes: '0;0.35;0.7;1',
      veinAmplitude: '2.6',
      veinExponent: '4',
      envFreq: '0.0016 0.0016',
      envSeed: '11',
      maskAmplitude: '1.6',
      maskExponent: '2.4',
      maskOffset: '0.1',
      tint: '#a5f3ea',
    },
    {
      id: 'caustic-b',
      cls: 'cl-b',
      waveFreq: '0.0052 0.017',
      waveSeed: '23',
      dur: '26s',
      waveValues: '0.0052 0.017;0.0042 0.014;0.0060 0.020;0.0052 0.017',
      keyTimes: '0;0.4;0.72;1',
      veinAmplitude: '2.3',
      veinExponent: '5',
      envFreq: '0.0013 0.0013',
      envSeed: '5',
      maskAmplitude: '1.7',
      maskExponent: '2.6',
      maskOffset: '0.08',
      tint: '#cba6f7',
    },
  ]

  // The animated caustics recompute fractal noise every frame — fine on
  // desktop, far too heavy for phone GPUs. Only morph the noise on non-touch,
  // wide screens that haven't asked for reduced motion. (On mobile the caustics
  // element is hidden entirely in CSS, so this also stops the SMIL ticking.)
  let animate = $state(false)
  $effect(() => {
    const mm = (q: string) => typeof matchMedia !== 'undefined' && matchMedia(q).matches
    animate =
      !mm('(prefers-reduced-motion: reduce)') &&
      !mm('(hover: none) and (pointer: coarse)') &&
      !mm('(max-width: 820px)')
  })
</script>

<svelte:window onclick={handleLinkClick} />

<!-- Animated water caustics. Each layer = long, horizontally-stretched
     fractal ribbons (low + anisotropic baseFrequency → wave-like veins, not
     round particles) that slowly warp in place (baseFrequency morph = shimmer)
     and drift via CSS. A second, very-low-frequency "envelope" turbulence is
     multiplied over the ribbons so brightness varies across the screen — dense
     bright patches next to calm dark water — killing the uniform disco look.

     Both layers are the same filter; only the numbers in CAUSTIC_LAYERS differ.
     They roll in opposite directions at different speeds (see .cl-a / .cl-b in
     styles/background.css) so the ribbons interfere and shimmer. -->
{#snippet causticLayer(c: CausticLayer)}
  <svg class="caustics-layer {c.cls}" xmlns="http://www.w3.org/2000/svg">
    <filter id={c.id} x="-30%" y="-30%" width="160%" height="160%">
      <feTurbulence
        type="fractalNoise"
        baseFrequency={c.waveFreq}
        numOctaves="3"
        seed={c.waveSeed}
        result="wave"
      >
        {#if animate}
          <animate
            attributeName="baseFrequency"
            dur={c.dur}
            repeatCount="indefinite"
            values={c.waveValues}
            keyTimes={c.keyTimes}
          />
        {/if}
      </feTurbulence>
      <feColorMatrix
        in="wave"
        type="matrix"
        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.34 0.34 0.34 0 0"
        result="wa"
      />
      <feComponentTransfer in="wa" result="veins"
        ><feFuncA
          type="gamma"
          amplitude={c.veinAmplitude}
          exponent={c.veinExponent}
          offset="0"
        /></feComponentTransfer
      >
      <feTurbulence
        type="fractalNoise"
        baseFrequency={c.envFreq}
        numOctaves="2"
        seed={c.envSeed}
        result="env"
      />
      <feColorMatrix
        in="env"
        type="matrix"
        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0.5 0.5 0 0"
        result="ea"
      />
      <feComponentTransfer in="ea" result="mask"
        ><feFuncA
          type="gamma"
          amplitude={c.maskAmplitude}
          exponent={c.maskExponent}
          offset={c.maskOffset}
        /></feComponentTransfer
      >
      <feComposite
        in="veins"
        in2="mask"
        operator="arithmetic"
        k1="1"
        k2="0"
        k3="0"
        k4="0"
        result="mod"
      />
      <feFlood flood-color={c.tint} result="tint" />
      <feComposite in="tint" in2="mod" operator="in" />
    </filter>
    <rect width="100%" height="100%" filter={`url(#${c.id})`} />
  </svg>
{/snippet}

<div class="caustics" aria-hidden="true">
  {#each CAUSTIC_LAYERS as layer (layer.id)}
    {@render causticLayer(layer)}
  {/each}
</div>

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
