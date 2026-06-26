<script lang="ts">
  import { fetchUpcomingEvents, type UpcomingEvent } from '../lib/events'
  import { formatSpan, twd } from '../lib/format'
  import { bookUrl, registerUrl } from '../lib/config'
  import PageHeader from '../components/PageHeader.svelte'

  // PADI recreational ladder — static catalog copy.
  const catalog = [
    {
      name: 'Discover Scuba Diving',
      level: 'Beginner',
      desc: 'Try scuba in a single session, no certification required. The perfect first taste of diving.',
    },
    {
      name: 'Open Water Diver',
      level: 'Entry',
      desc: 'Your first full certification — dive to 18m anywhere in the world with a buddy.',
    },
    {
      name: 'Advanced Open Water',
      level: 'Continuing',
      desc: 'Five adventure dives including deep and navigation. Build confidence and reach 30m.',
    },
    {
      name: 'Rescue Diver',
      level: 'Continuing',
      desc: 'Learn to prevent and manage problems in the water. The most rewarding course you’ll take.',
    },
    {
      name: 'Divemaster',
      level: 'Professional',
      desc: 'Your first pro rating — lead certified divers and assist on courses.',
    },
    {
      name: 'EFR — Emergency First Response',
      level: 'First Aid',
      desc: 'Primary and secondary care (CPR + first aid). Required before Rescue Diver.',
    },
    {
      name: 'Specialties',
      level: 'Various',
      desc: 'Nitrox, Deep, Wreck, Night, Underwater Photography and more — dive your interests.',
    },
    {
      name: 'Gear Sales, Service & Rental',
      level: 'Shop',
      desc: 'Quality scuba equipment for sale, full servicing, and rental sets for any trip.',
    },
  ]

  let upcoming = $state<UpcomingEvent[]>([])
  let loading = $state(true)

  $effect(() => {
    fetchUpcomingEvents()
      .then((e) => (upcoming = e.filter((x) => x.type === 'course')))
      .catch(() => (upcoming = []))
      .finally(() => (loading = false))
  })
</script>

<PageHeader
  title="PADI Courses"
  subtitle="Learn to dive, level up, or go pro — the full range of PADI recreational courses in Taiwan."
/>

<section class="mx-auto max-w-6xl px-4 py-12 sm:px-6">
  <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
    {#each catalog as c}
      <div class="rounded-2xl border border-brand-100 bg-white p-6 shadow-sm">
        <span class="text-xs font-semibold uppercase tracking-wide text-reef-600">{c.level}</span>
        <h3 class="mt-1 text-lg font-semibold text-brand-900">{c.name}</h3>
        <p class="mt-2 text-sm text-slate-600">{c.desc}</p>
      </div>
    {/each}
  </div>
</section>

<!-- Live upcoming course sessions -->
<section class="bg-brand-50">
  <div class="mx-auto max-w-6xl px-4 py-12 sm:px-6">
    <h2 class="text-2xl font-bold text-brand-900">Upcoming course dates</h2>
    {#if loading}
      <div class="mt-6 grid gap-3">
        {#each Array(3) as _}
          <div class="h-16 animate-pulse rounded-xl bg-white"></div>
        {/each}
      </div>
    {:else if upcoming.length === 0}
      <p class="mt-4 text-slate-600">
        No scheduled course dates right now — courses also run on request.
        <a href={bookUrl} target="_blank" rel="noopener" class="font-semibold text-brand-700">Get in touch</a>.
      </p>
    {:else}
      <ul class="mt-6 grid gap-3">
        {#each upcoming as ev (ev.id)}
          {@const price = twd(ev.startingAt)}
          <li class="flex items-center justify-between gap-4 rounded-xl bg-white p-4 shadow-sm">
            <div class="min-w-0">
              <h3 class="truncate font-semibold text-brand-950">{ev.title}</h3>
              <p class="text-sm text-slate-500">{formatSpan(ev.startDate, ev.endDate, ev.time)}</p>
            </div>
            <div class="flex shrink-0 items-center gap-3">
              {#if price}<span class="text-sm font-semibold text-brand-800">from {price}</span>{/if}
              <a
                href={registerUrl('course', ev.id)}
                target="_blank"
                rel="noopener"
                class="rounded-full bg-brand-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-brand-700"
              >
                Enroll
              </a>
            </div>
          </li>
        {/each}
      </ul>
    {/if}
  </div>
</section>
