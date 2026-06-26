<script lang="ts">
  import { fetchUpcomingEvents, type UpcomingEvent, type ModalEvent } from '../lib/events'
  import { formatSpan } from '../lib/format'
  import GetInTouch from '../components/GetInTouch.svelte'
  import EventCard from '../components/EventCard.svelte'
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

{#snippet cardGrid(title: string, items: UpcomingEvent[], moreHref: string | null, star: boolean)}
  <section class="mx-auto max-w-[1600px] px-4 pt-8 sm:px-6">
    <div class="mb-4 flex items-center justify-between">
      <h2 class="flex items-center gap-2 text-2xl font-bold text-white">
        {#if star}<span class="text-reef-300">★</span>{/if}{title}
      </h2>
      {#if moreHref}
        <a href={moreHref} class="text-sm font-semibold text-reef-300 hover:text-reef-200">{$t.common.viewAll} →</a>
      {/if}
    </div>
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {#if loading}
        {#each Array(3) as _, i (i)}<div class="h-80 animate-pulse rounded-2xl bg-white/10"></div>{/each}
      {:else if items.length === 0}
        <p class="text-sm text-brand-200">{$t.common.nothingScheduled}</p>
      {:else}
        {#each items as ev (ev.id)}<EventCard {ev} onDetails={open} />{/each}
      {/if}
    </div>
  </section>
{/snippet}

{@render cardGrid($t.home.featured, featured, null, true)}
{@render cardGrid($t.home.upcomingDives, dives, '/calendar', false)}
{@render cardGrid($t.home.upcomingCourses, courses, '/courses', false)}

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
        class="group relative flex h-56 flex-col justify-end overflow-hidden rounded-2xl border border-white/15 shadow-sm transition-transform hover:-translate-y-1"
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
    <a href="#get-in-touch" class="rounded-full bg-reef-400 px-6 py-3 font-semibold text-brand-950 transition-colors hover:bg-reef-300">
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
