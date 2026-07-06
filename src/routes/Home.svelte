<script lang="ts">
  import { fetchUpcomingEvents, type UpcomingEvent, type ModalEvent } from '../lib/events'
  import { formatSpan, twd } from '../lib/format'
  import GetInTouch from '../components/GetInTouch.svelte'
  import EventModal from '../components/calendar/EventModal.svelte'
  import { mediaIdLocal } from '../lib/images'
  import { t } from '../lib/i18n'

  let upcoming = $state<UpcomingEvent[]>([])
  let loading = $state(true)
  let selected = $state<ModalEvent | null>(null)

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

  // Featured: real featured first, padded with the soonest upcoming events.
  let featured = $derived.by(() => {
    const feat = upcoming.filter((e) => e.featured)
    if (feat.length >= 3) return feat.slice(0, 3)
    const ids = new Set(feat.map((e) => e.id))
    return [...feat, ...upcoming.filter((e) => !ids.has(e.id)).slice(0, 3 - feat.length)]
  })
  let featuredIds = $derived(new Set(featured.map((e) => e.id)))
  let dives = $derived(upcoming.filter((e) => e.type === 'dive' && !featuredIds.has(e.id)).slice(0, 3))
  let courses = $derived(upcoming.filter((e) => e.type === 'course' && !featuredIds.has(e.id)).slice(0, 3))

  // Structural data only (links + images); titles/descriptions come from i18n
  // ($t.home.services), aligned by index.
  const serviceLinks = [
    { href: '/courses', image: mediaIdLocal('b37fef_2ea720f3f0c94fb8bc703856514b0a6c~mv2.jpg') },
    { href: '/sites', image: mediaIdLocal('b37fef_7621a533ac1946a8b342bc5085cb1d28~mv2.jpg') },
    { href: '#get-in-touch', image: mediaIdLocal('b37fef_58237e6a633f472b8d419bd830abb854~mv2.jpg') },
    { href: '/travel', image: mediaIdLocal('b37fef_80f90894e75f47f8809d14663dd8e8bd~mv2.jpg') },
    { href: '/travel', image: mediaIdLocal('b37fef_c3c0324de5bb47b49843a8f63551b4e7~mv2.jpg') },
    { href: '/courses', image: mediaIdLocal('b37fef_49df7d482eb44585a605a489e2b1d653~mv2.jpg') },
  ]
</script>

<!-- A compact image card; fills its grid cell on desktop, has an aspect on mobile. -->
{#snippet heroCard(ev: UpcomingEvent, big: boolean)}
  {@const price = twd(ev.startingAt)}
  <button
    type="button"
    onclick={() => open(ev)}
    class={`group relative block aspect-[16/10] w-full overflow-hidden rounded-3xl border border-white/15 text-left transition-all duration-300 hover:-translate-y-0.5 lg:aspect-auto lg:h-full ${big ? 'hover:border-mauve/60 hover:shadow-[0_0_26px_-6px_rgba(203,166,247,0.7)]' : 'hover:border-reef-400/60 hover:shadow-[0_0_26px_-6px_rgba(44,208,197,0.65)]'}`}
  >
    {#if ev.image}
      <img src={ev.image} alt="" loading="lazy" class="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
    {:else}
      <div class="absolute inset-0 bg-gradient-to-br from-brand-700 to-reef-700"></div>
    {/if}
    <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
    <div class="absolute inset-x-0 bottom-0 p-3">
      {#if ev.fullyBooked}
        <span class="rounded bg-amber-400/25 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-amber-200">{$t.common.waitlist}</span>
      {/if}
      <h3 class={`line-clamp-2 font-bold leading-tight text-white ${big ? 'text-base lg:text-lg' : 'text-xs lg:text-sm'}`}>{ev.title}</h3>
      <p class="mono truncate text-[11px] text-sky-300">{formatSpan(ev.startDate, ev.endDate, ev.time)}</p>
      {#if price}<p class="mono text-xs font-bold text-peach">{$t.common.from} {price}</p>{/if}
    </div>
  </button>
{/snippet}

{#snippet strip(title: string, items: UpcomingEvent[], moreHref: string)}
  <div class="flex min-h-0 flex-1 flex-col">
    <div class="mb-2 flex items-center justify-between">
      <h2 class="flex items-center gap-2 text-xl font-bold text-white">
        <span class="mono text-reef-400">▹</span>{title}
      </h2>
      <a href={moreHref} class="mono text-sm font-semibold text-reef-300 hover:text-reef-200">{$t.common.viewAll} →</a>
    </div>
    <div class="grid min-h-0 flex-1 grid-cols-1 gap-3 sm:grid-cols-3">
      {#if loading}
        {#each Array(3) as _, i (i)}<div class="aspect-[16/10] animate-pulse rounded-3xl bg-white/10 lg:aspect-auto"></div>{/each}
      {:else if items.length === 0}
        <p class="text-sm text-brand-200 sm:col-span-3">{$t.common.nothingScheduled}</p>
      {:else}
        {#each items as ev (ev.id)}{@render heroCard(ev, false)}{/each}
      {/if}
    </div>
  </div>
{/snippet}

<!-- Hero: featured (left) + upcoming dives/courses (right), fits the viewport. -->
<section class="mx-auto max-w-[1600px] px-4 py-4 sm:px-6 lg:h-[calc(100vh-11.5rem)]">
  <div class="grid h-full gap-5 lg:grid-cols-2">
    <!-- Featured -->
    <div class="flex min-h-0 flex-col">
      <h2 class="mb-2 flex items-center gap-2 text-xl font-bold text-white">
        <span class="mono text-mauve">★</span>{$t.home.featured}
      </h2>
      <div class="grid min-h-0 flex-1 grid-cols-1 gap-3 lg:grid-rows-3">
        {#if loading}
          {#each Array(3) as _, i (i)}<div class="aspect-[16/10] animate-pulse rounded-3xl bg-white/10 lg:aspect-auto"></div>{/each}
        {:else}
          {#each featured as ev (ev.id)}{@render heroCard(ev, true)}{/each}
        {/if}
      </div>
    </div>
    <!-- Upcoming dives (top) + courses (bottom) -->
    <div class="flex min-h-0 flex-col gap-4">
      {@render strip($t.home.upcomingDives, dives, '/calendar')}
      {@render strip($t.home.upcomingCourses, courses, '/courses')}
    </div>
  </div>
</section>

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
        <img src={s.image} alt="" loading="lazy" class="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
        <div class="relative z-10 p-5">
          <h3 class="text-lg font-bold text-white">{$t.home.services[i].title}</h3>
          <p class="mt-1 line-clamp-3 text-sm text-white/85">{$t.home.services[i].desc}</p>
        </div>
      </a>
    {/each}
  </div>

  <div class="mt-10 text-center">
    <a href="#get-in-touch" class="mono rounded-full bg-reef-400 px-6 py-3 font-semibold text-brand-950 shadow-[0_0_24px_-6px_rgba(44,208,197,0.8)] transition-colors hover:bg-reef-300">
      {$t.common.contactUs}
    </a>
  </div>
</section>

<!-- Diving in Taiwan -->
<section>
  <div class="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
    <h2 class="text-3xl font-bold tracking-tight text-white">{$t.home.divingTitle}</h2>
    <div class="mt-6 space-y-5 text-brand-100">
      {#each $t.home.divingParas as para}
        <p>{para}</p>
      {/each}
    </div>
  </div>
</section>

<!-- Get In Touch -->
<GetInTouch />

<!-- Brand taglines -->
<section>
  <div class="mx-auto flex max-w-[1600px] flex-col items-center gap-1 px-4 py-12 text-center sm:px-6 sm:py-14">
    <p class="text-2xl font-bold text-white sm:text-3xl">{$t.home.taglineMain}</p>
    <p class="text-lg font-light text-reef-100">{$t.home.taglineSub}</p>
  </div>
</section>

<EventModal event={selected} onClose={() => (selected = null)} />
