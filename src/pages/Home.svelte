<script lang="ts">
  import Photo from '$components/Photo.svelte'
  import { SIZES } from '$engine/responsive-image'
  import { fetchUpcomingEvents, type UpcomingEvent, type ModalEvent } from '$engine/events'
  import { formatSpan, twd } from '$engine/format'
  import GetInTouch from '$components/GetInTouch.svelte'
  import EventModal from '$components/calendar/EventModal.svelte'
  import { mediaIdLocal } from '$engine/images'
  import { siteImage } from '$engine/photo-pool'
  import { t } from '$engine/i18n'
  import CoverPhoto from '$components/CoverPhoto.svelte'

  let upcoming = $state<UpcomingEvent[]>([])
  let loading = $state(true)
  let selected = $state<ModalEvent | null>(null)

  // The third card in each hero column sits just below the fold on desktop, so
  // show a scroll hint until the reader moves off the top of the page.
  let atTop = $state(true)
  $effect(() => {
    const onScroll = () => (atTop = window.scrollY < 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  })

  function open(ev: UpcomingEvent) {
    selected = {
      id: ev.id,
      type: ev.type,
      title: ev.title,
      spanLabel: formatSpan(ev.startDate, ev.endDate, ev.time),
      price: ev.startingAt,
      currency: 'TWD',
      fullyBooked: ev.fullyBooked,
    }
  }

  $effect(() => {
    fetchUpcomingEvents()
      .then((e) => (upcoming = e))
      .catch(() => (upcoming = []))
      .finally(() => (loading = false))
  })

  // The homepage hero is a 2×2 board of four quadrants holding up to four events
  // each: Featured · Dives · Courses · Adventures. Every event shows in exactly
  // one quadrant — featured wins first, then a kind claims the rest.

  // Featured: only events actually flagged `featured` in the app — no padding, so
  // the quadrant reflects the real featured set (often just one). The adaptive
  // tile layout sizes it: a lone featured event fills the whole quadrant.
  let featured = $derived(upcoming.filter((e) => e.featured).slice(0, 4))
  let featuredIds = $derived(new Set(featured.map((e) => e.id)))
  // The Dives row holds every dive — local fun dives and multi-day dive trips
  // alike (is_trip is just a flag on a dive, not its own row). Adventures is a
  // first-class event kind (kind='adventure' — the recurring YouBike tours),
  // unrelated to dive trips, so a dive trip like Malapascua never lands there.
  // Dives/Courses stay clear of the Featured spotlight so nothing double-shows.
  let dives = $derived(
    upcoming.filter((e) => e.type === 'dive' && !featuredIds.has(e.id)).slice(0, 4),
  )
  let courses = $derived(
    upcoming.filter((e) => e.type === 'course' && !featuredIds.has(e.id)).slice(0, 4),
  )
  let adventures = $derived(upcoming.filter((e) => e.type === 'adventure').slice(0, 4))

  // Each quadrant wears its own colour — a strongly tinted, semi-transparent
  // panel with a bright matching border and a header (glyph + title) in the same
  // hue — so Featured / Dives / Courses / Adventures read apart at a glance
  // against the blue page. Written as full literal class strings (not built up
  // from the key) so Tailwind's scanner keeps them in the build.
  const QUAD_STYLE = {
    mauve: { panel: 'border-mauve/60 bg-mauve/20', text: 'text-mauve' },
    reef: { panel: 'border-reef-400/60 bg-reef-400/20', text: 'text-reef-300' },
    green: { panel: 'border-green/60 bg-green/20', text: 'text-green' },
    peach: { panel: 'border-peach/60 bg-peach/20', text: 'text-peach' },
  } as const

  // A quadrant's tiles reflow to how many events it has, so it never shows an
  // awkward empty cell: 1 fills the quadrant, 2 sit side by side, 3 go two-up
  // with the third centred below, 4 is the full 2×2. This only applies on the
  // fixed-height desktop board (lg+); phones keep a simple two-column grid.
  // Literal class strings so Tailwind's scanner keeps every variant.
  function quadGridClass(n: number): string {
    if (n <= 1) return 'grid grid-cols-1 gap-2 lg:min-h-0 lg:flex-1 lg:grid-cols-1 lg:grid-rows-1'
    if (n === 2) return 'grid grid-cols-2 gap-2 lg:min-h-0 lg:flex-1 lg:grid-cols-2 lg:grid-rows-1'
    if (n === 3) return 'grid grid-cols-2 gap-2 lg:min-h-0 lg:flex-1 lg:grid-cols-4 lg:grid-rows-2'
    return 'grid grid-cols-2 gap-2 lg:min-h-0 lg:flex-1 lg:grid-cols-2 lg:grid-rows-2'
  }
  // Only the 3-event case needs explicit placement: on a 4-column desktop grid
  // each tile spans two columns, and the lone third one starts at column 2 so it
  // sits centred beneath the top pair. Other counts auto-flow correctly.
  function quadTileClass(n: number, i: number): string {
    if (n !== 3) return ''
    if (i === 0) return 'lg:col-start-1 lg:col-span-2 lg:row-start-1'
    if (i === 1) return 'lg:col-start-3 lg:col-span-2 lg:row-start-1'
    return 'lg:col-start-2 lg:col-span-2 lg:row-start-2'
  }

  // Structural data only (links + images); titles/descriptions come from i18n
  // ($t.home.services), aligned by index.
  const serviceLinks = [
    { href: '/courses', image: mediaIdLocal('b37fef_2ea720f3f0c94fb8bc703856514b0a6c~mv2.jpg') },
    { href: '/sites', image: mediaIdLocal('b37fef_7621a533ac1946a8b342bc5085cb1d28~mv2.jpg') },
    { href: '/gear', image: mediaIdLocal('b37fef_58237e6a633f472b8d419bd830abb854~mv2.jpg') },
    {
      href: 'https://site-fundiverstw.fundiverstw.workers.dev/travel#international',
      image: mediaIdLocal('b37fef_80f90894e75f47f8809d14663dd8e8bd~mv2.jpg'),
    },
    { href: '/travel', image: siteImage('penghu') },
    {
      href: 'https://site-fundiverstw.fundiverstw.workers.dev/courses/padi-efr-course',
      image: mediaIdLocal('b37fef_49df7d482eb44585a605a489e2b1d653~mv2.jpg'),
    },
  ]

  // Decorative photography for the "Diving in Taiwan" section. These are dive
  // shots already bundled on disk but not shown anywhere else on the site (past
  // events / marine life), so the section gets some colour without repeating the
  // service or event cards. Divers-in-the-blue up top; reef critters below.
  const diveScenes = [
    mediaIdLocal('b37fef_62e3ef3bf39c43189066945900e212ec~mv2.jpg'), // diver on the wall
    mediaIdLocal('b37fef_336fa72d68ae4cd19dcf205ba6cc555a~mv2.jpg'), // divers in the blue
    mediaIdLocal('b37fef_544484389a4b4ce4a8ceed361a49989b~mv2.jpg'), // diver + fish school
  ]
  const marineLife = [
    mediaIdLocal('9f20fa_d7e84b19892441b18febc6c321746bde~mv2.jpg'), // octopus
    mediaIdLocal('b37fef_6194a1794e5540239e0327d2e92cfa3d~mv2.jpg'), // boxfish
    mediaIdLocal('b37fef_7b0eff53c74d41ed80dc27ea77462778~mv2.jpg'), // tube anemone
    mediaIdLocal('b37fef_bf3a6e799829427fb4f2b57eb9346869~mv2.jpg'), // moray eel
    mediaIdLocal('b37fef_ce80a7ab6e3f468e870a2321b382cd57~mv2.jpg'), // pufferfish
    mediaIdLocal('b37fef_7635de3c5357483999a169b65282ebe4~mv2.jpg'), // leaf scorpionfish
  ]
</script>

<!-- One event as a compact tile inside a category row. On a phone it keeps a
     16/10 aspect so it has height in the natural stack; from `lg` up it drops the
     aspect and fills its grid cell (`h-full`) so a row packs four tiles into
     whatever height the viewport-filling board hands it. `accent` tints the hover
     glow to match the row's colour. -->
{#snippet quadCard(ev: UpcomingEvent, accent: 'mauve' | 'reef' | 'green' | 'peach', place: string)}
  {@const price = twd(ev.startingAt)}
  <button
    type="button"
    onclick={() => open(ev)}
    class={`group relative block aspect-[16/10] w-full overflow-hidden rounded-xl border border-white/15 text-left transition-all duration-300 hover:-translate-y-0.5 lg:aspect-auto lg:h-full ${place} ${
      accent === 'mauve'
        ? 'hover:border-mauve/60 hover:shadow-[0_0_20px_-6px_rgba(203,166,247,0.7)]'
        : accent === 'peach'
          ? 'hover:border-peach/60 hover:shadow-[0_0_20px_-6px_rgba(250,179,135,0.7)]'
          : accent === 'green'
            ? 'hover:border-green/60 hover:shadow-[0_0_20px_-6px_rgba(166,227,161,0.65)]'
            : 'hover:border-reef-400/60 hover:shadow-[0_0_20px_-6px_rgba(44,208,197,0.65)]'
    }`}
  >
    <CoverPhoto src={ev.image} />
    <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent"></div>
    <div class="absolute inset-x-0 bottom-0 px-2.5 pb-2 pt-4">
      {#if ev.fullyBooked}
        <span
          class="rounded bg-amber-400/25 px-1 py-0.5 text-[8px] font-bold uppercase tracking-wide text-amber-200"
          >{$t.common.waitlist}</span
        >
      {/if}
      <h3 class="line-clamp-1 text-xs font-bold leading-tight text-white lg:text-sm">
        {ev.title}
      </h3>
      <p class="mono truncate text-[10px] text-sky-300">
        {formatSpan(ev.startDate, ev.endDate, ev.time)}
      </p>
      {#if price}<p class="mono text-[11px] font-bold text-peach">
          {$t.common.from}
          {price}
        </p>{/if}
    </div>
  </button>
{/snippet}

<!-- One quadrant of the board: a titled header over a 2×2 grid of four tiles,
     wrapped in a semi-transparent panel tinted with the category's colour (mauve ·
     reef · green · peach) so the four quadrants read apart at a glance. Flex-col
     with a `flex-1` tile grid so, on desktop, the tiles absorb the leftover height
     and the whole board fills the screen without a scroll. -->
{#snippet quadrant(
  icon: string,
  title: string,
  items: UpcomingEvent[],
  accent: 'mauve' | 'reef' | 'green' | 'peach',
)}
  <section
    class={`flex min-h-0 flex-col rounded-2xl border px-2 py-1.5 lg:flex-1 ${QUAD_STYLE[accent].panel}`}
  >
    <h2
      class={`mb-1 flex items-center gap-2 px-0.5 text-sm font-bold lg:text-base ${QUAD_STYLE[accent].text}`}
    >
      <span class="mono">{icon}</span>{title}
    </h2>
    <div class={quadGridClass(loading ? 4 : items.length)}>
      {#if loading}
        {#each Array(4) as _, i (i)}<div
            class="aspect-[16/10] animate-pulse rounded-xl bg-white/10 lg:aspect-auto lg:h-full"
          ></div>{/each}
      {:else if items.length === 0}
        <p class="self-center text-xs text-brand-200">
          {$t.common.nothingScheduled}
        </p>
      {:else}
        {#each items as ev, i (ev.id)}
          {@render quadCard(ev, accent, quadTileClass(items.length, i))}
        {/each}
      {/if}
    </div>
  </section>
{/snippet}

<!-- Hero: catch-phrase over a 2×2 board of four colour-coded quadrants (Featured ·
     Dives · Courses · Adventures), each holding four events. From `lg` up the
     whole hero is sized to the viewport minus the nav (`overflow-hidden`, a fixed
     height, flex children that shrink) so all sixteen events sit on the first
     screen with no scroll. On a phone the quadrants fall back to a natural,
     scrolling stack. -->
<section
  class="mx-auto flex max-w-[1600px] flex-col px-4 py-2 sm:px-6 lg:h-[calc(100svh-6rem)] lg:overflow-hidden lg:py-2 xl:h-[calc(100svh-8rem)]"
>
  <div class="shrink-0 pb-4 text-center">
    <h1
      class="text-2xl font-black tracking-tight text-white drop-shadow-[0_1px_6px_rgba(0,0,0,0.5)] sm:text-3xl xl:text-4xl"
    >
      {$t.home.catchphrase}
    </h1>
  </div>

  <div
    class="flex flex-col gap-2.5 lg:grid lg:min-h-0 lg:flex-1 lg:grid-cols-2 lg:grid-rows-2 lg:gap-2.5"
  >
    {@render quadrant('★', $t.home.featured, featured, 'mauve')}
    {@render quadrant('▹', $t.home.upcomingDives, dives, 'reef')}
    {@render quadrant('◈', $t.home.upcomingCourses, courses, 'green')}
    {@render quadrant('✦', $t.home.adventures, adventures, 'peach')}
  </div>
</section>

<!-- Scroll hint: on desktop the board fills the screen and the rest of the page
     sits below the fold, so a gentle bouncing chevron nudges the reader onward.
     It fades the moment they leave the top of the page, and never shows on a
     phone (where the stacked layout already scrolls). Decorative. -->
<div
  aria-hidden="true"
  class={`pointer-events-none fixed inset-x-0 bottom-5 z-30 hidden justify-center transition-opacity duration-500 lg:flex ${atTop ? 'opacity-100' : 'opacity-0'}`}
>
  <svg
    class="h-14 w-14 animate-bounce text-reef-300 drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    stroke-width="2"
  >
    <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
</div>

<!-- Explore our Services -->
<section class="mx-auto max-w-[1600px] px-4 py-12 sm:px-6 sm:py-16">
  <div class="mx-auto max-w-3xl text-center">
    <h2 class="text-3xl font-bold tracking-tight text-white">{$t.home.exploreServices}</h2>
    <p class="mt-3 text-brand-100">{$t.home.exploreServicesIntro}</p>
  </div>

  <div class="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
    {#each serviceLinks as s, i}
      <a
        href={s.href}
        class="group relative flex aspect-square flex-col justify-end overflow-hidden rounded-3xl border border-white/15 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-reef-400/60 hover:shadow-[0_0_30px_-8px_rgba(44,208,197,0.6)]"
      >
        <Photo
          image={s.image}
          alt=""
          class="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div
          class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"
        ></div>
        <div class="relative z-10 p-6 sm:p-7">
          <h3 class="text-lg font-bold text-white">{$t.home.services[i].title}</h3>
          <p class="mt-1 line-clamp-3 text-sm text-white/85">{$t.home.services[i].desc}</p>
        </div>
      </a>
    {/each}
  </div>

  <div class="mt-10 text-center">
    <a
      href="#get-in-touch"
      class="mono rounded-full bg-reef-400 px-6 py-3 font-semibold text-brand-950 shadow-[0_0_24px_-6px_rgba(44,208,197,0.8)] transition-colors hover:bg-reef-300"
    >
      {$t.common.contactUs}
    </a>
  </div>
</section>

<!-- Diving in Taiwan — text wrapped by a sticky photo mosaic + a reef-life rail -->
<section class="mx-auto max-w-[1600px] px-4 py-12 sm:px-6 sm:py-16">
  <div class="grid gap-8 lg:grid-cols-12 lg:items-start">
    <div class="lg:col-span-7">
      <h2 class="text-3xl font-bold tracking-tight text-white">{$t.home.divingTitle}</h2>
      <div class="mt-6 space-y-5 text-brand-100">
        {#each $t.home.divingParas as para}
          <p>{para}</p>
        {/each}
      </div>
    </div>

    <!-- Divers-in-the-blue mosaic, sticks alongside the copy on desktop -->
    <div class="lg:col-span-5 lg:sticky lg:top-24">
      <div class="grid grid-cols-2 gap-3">
        <figure
          class="group col-span-2 aspect-[16/10] overflow-hidden rounded-3xl border border-white/10 shadow-sm"
        >
          <Photo
            image={diveScenes[0]}
            alt=""
            sizes={SIZES.card}
            class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </figure>
        {#each diveScenes.slice(1) as image}
          <figure
            class="group aspect-square overflow-hidden rounded-2xl border border-white/10 shadow-sm"
          >
            <Photo
              {image}
              alt=""
              sizes={SIZES.tile}
              class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </figure>
        {/each}
      </div>
    </div>
  </div>

  <!-- A glimpse of the reef life beneath the waves -->
  <div class="mt-8 grid grid-cols-3 gap-3 sm:mt-10 sm:grid-cols-6">
    {#each marineLife as image}
      <figure
        class="group aspect-square overflow-hidden rounded-2xl border border-white/10 shadow-sm"
      >
        <Photo
          {image}
          alt=""
          sizes={SIZES.tile}
          class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 group-hover:brightness-105"
        />
      </figure>
    {/each}
  </div>
</section>

<!-- Get In Touch -->
<GetInTouch />

<!-- Brand taglines -->
<section>
  <div
    class="mx-auto flex max-w-[1600px] flex-col items-center gap-1 px-4 py-12 text-center sm:px-6 sm:py-14"
  >
    <p class="text-2xl font-bold text-white sm:text-3xl">{$t.home.taglineMain}</p>
    <p class="text-lg font-light text-reef-100">{$t.home.taglineSub}</p>
  </div>
</section>

<EventModal event={selected} onClose={() => (selected = null)} />
