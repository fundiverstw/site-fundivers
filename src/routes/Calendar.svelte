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
        class="rounded-full px-4 py-1.5 text-sm font-medium transition-colors"
        class:bg-brand-600={filter === value}
        class:text-white={filter === value}
        class:bg-brand-50={filter !== value}
        class:text-brand-800={filter !== value}
        onclick={() => (filter = value as typeof filter)}
      >
        {label}
      </button>
    {/each}
  </div>

  {#if loading}
    <div class="grid gap-3">
      {#each Array(5) as _}
        <div class="h-24 animate-pulse rounded-xl bg-brand-50"></div>
      {/each}
    </div>
  {:else if error}
    <p class="rounded-lg bg-red-50 p-4 text-sm text-red-700">Couldn’t load the calendar: {error}</p>
  {:else if shown.length === 0}
    <p class="rounded-lg bg-brand-50 p-6 text-center text-slate-600">
      No upcoming events right now — check back soon, or
      <a href={bookUrl} target="_blank" rel="noopener" class="font-semibold text-brand-700">contact us</a>.
    </p>
  {:else}
    <ul class="grid gap-3">
      {#each shown as ev (ev.type + ev.id)}
        {@const b = badge(ev.startDate)}
        {@const price = twd(ev.startingAt)}
        <li class="flex items-center gap-4 rounded-xl border border-brand-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
          <div class="flex w-16 shrink-0 flex-col items-center rounded-lg bg-brand-50 py-2 text-brand-800">
            <span class="text-xs font-semibold">{b.month}</span>
            <span class="text-2xl font-bold leading-none">{b.day}</span>
          </div>
          <div class="min-w-0 flex-1">
            <div class="flex items-center gap-2">
              <span
                class="rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide"
                class:bg-reef-100={ev.type === 'dive'}
                class:text-reef-700={ev.type === 'dive'}
                class:bg-brand-100={ev.type === 'course'}
                class:text-brand-700={ev.type === 'course'}
              >
                {ev.type}
              </span>
              {#if ev.fullyBooked}
                <span class="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-700">
                  Waitlist
                </span>
              {/if}
            </div>
            <h3 class="mt-1 truncate font-semibold text-brand-950">{ev.title}</h3>
            <p class="text-sm text-slate-500">{formatSpan(ev.startDate, ev.endDate, ev.time)}</p>
          </div>
          <div class="flex shrink-0 flex-col items-end gap-1">
            {#if price}
              <span class="text-sm font-semibold text-brand-800">from {price}</span>
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
