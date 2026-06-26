<script lang="ts">
  import { fetchUpcomingEvents, type UpcomingEvent } from '../lib/events'
  import { formatSpan, badge, twd } from '../lib/format'
  import { bookUrl, registerUrl } from '../lib/config'
  import PageHeader from '../components/PageHeader.svelte'

  let events = $state<UpcomingEvent[]>([])
  let loading = $state(true)
  let error = $state<string | null>(null)
  let filter = $state<'all' | 'dive' | 'course'>('all')

  $effect(() => {
    fetchUpcomingEvents()
      .then((e) => (events = e))
      .catch((err) => (error = err?.message ?? 'Failed to load events'))
      .finally(() => (loading = false))
  })

  let shown = $derived(filter === 'all' ? events : events.filter((e) => e.type === filter))
</script>

<PageHeader
  title="Upcoming Calendar"
  subtitle="Dives and courses scheduled in the weeks ahead. Reserve your spot online."
/>

<section class="mx-auto max-w-6xl px-4 py-12 sm:px-6">
  <div class="mb-6 flex flex-wrap items-center gap-2">
    {#each [['all', 'All'], ['dive', 'Dives'], ['course', 'Courses']] as [value, label]}
      <button
        class={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
          filter === value ? 'bg-brand-600 text-white' : 'bg-white/10 text-brand-100'
        }`}
        onclick={() => (filter = value as typeof filter)}
      >
        {label}
      </button>
    {/each}
  </div>

  {#if loading}
    <div class="grid gap-3">
      {#each Array(5) as _}
        <div class="h-24 animate-pulse rounded-xl bg-white/10"></div>
      {/each}
    </div>
  {:else if error}
    <p class="rounded-lg bg-red-500/15 p-4 text-sm text-red-200">Couldn’t load the calendar: {error}</p>
  {:else if shown.length === 0}
    <p class="glass rounded-lg p-6 text-center text-brand-100">
      No upcoming events right now — check back soon, or
      <a href={bookUrl} target="_blank" rel="noopener" class="font-semibold text-reef-300">contact us</a>.
    </p>
  {:else}
    <ul class="grid gap-3">
      {#each shown as ev (ev.type + ev.id)}
        {@const b = badge(ev.startDate)}
        {@const price = twd(ev.startingAt)}
        <li class="glass flex items-center gap-3 rounded-xl p-3 shadow-sm transition-shadow hover:shadow-md sm:gap-4 sm:p-4">
          <div class="flex w-14 shrink-0 flex-col items-center rounded-lg bg-white/10 py-2 text-white sm:w-16">
            <span class="text-xs font-semibold">{b.month}</span>
            <span class="text-2xl font-bold leading-none">{b.day}</span>
          </div>
          <div class="min-w-0 flex-1">
            <div class="flex items-center gap-2">
              <span
                class={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                  ev.type === 'dive' ? 'bg-reef-400/20 text-reef-200' : 'bg-brand-400/20 text-brand-100'
                }`}
              >
                {ev.type}
              </span>
              {#if ev.fullyBooked}
                <span class="rounded bg-amber-400/20 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-200">
                  Waitlist
                </span>
              {/if}
            </div>
            <h3 class="mt-1 truncate font-semibold text-white">{ev.title}</h3>
            <p class="text-sm text-brand-200">{formatSpan(ev.startDate, ev.endDate, ev.time)}</p>
          </div>
          <div class="flex shrink-0 flex-col items-end gap-1">
            {#if price}
              <span class="text-sm font-semibold text-white">from {price}</span>
            {/if}
            <a
              href={registerUrl(ev.type, ev.id)}
              target="_blank"
              rel="noopener"
              class="rounded-full bg-brand-600 px-4 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
            >
              {ev.fullyBooked ? 'Join waitlist' : 'Book'}
            </a>
          </div>
        </li>
      {/each}
    </ul>
  {/if}
</section>
