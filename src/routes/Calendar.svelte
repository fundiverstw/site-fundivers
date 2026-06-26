<script lang="ts">
  import { startOfMonth, endOfMonth } from 'date-fns'
  import { fetchEventsInRange, fetchEventDetails, type CalEvent, type EventDetails } from '../lib/events'
  import { formatEventSpan } from '../lib/format'
  import { registerUrl } from '../lib/config'
  import PageHeader from '../components/PageHeader.svelte'
  import MonthCalendar from '../components/calendar/MonthCalendar.svelte'
  import EventDetailsView from '../components/calendar/EventDetails.svelte'

  let month = $state(new Date())
  let events = $state<CalEvent[]>([])
  let selected = $state<CalEvent | null>(null)
  let loading = $state(true)
  let error = $state<string | null>(null)

  async function load(m: Date) {
    loading = true
    error = null
    // Widen ±7 days so bars crossing the month boundary render continuously.
    const fromDate = new Date(startOfMonth(m).getTime() - 7 * 86_400_000).toISOString().slice(0, 10)
    const toDate = new Date(endOfMonth(m).getTime() + 7 * 86_400_000).toISOString().slice(0, 10)
    try {
      events = await fetchEventsInRange(fromDate, toDate)
    } catch (e) {
      error = (e as Error)?.message ?? 'Failed to load events'
    } finally {
      loading = false
    }
  }

  $effect(() => {
    load(month)
  })

  // Fetch the opened event's descriptive text on demand.
  let details = $state<EventDetails | null>(null)
  let detailsLoading = $state(false)
  $effect(() => {
    const ev = selected
    details = null
    if (!ev) return
    detailsLoading = true
    let cancelled = false
    fetchEventDetails(ev)
      .then((d) => { if (!cancelled) details = d })
      .catch(() => { if (!cancelled) details = null })
      .finally(() => { if (!cancelled) detailsLoading = false })
    return () => { cancelled = true }
  })

  const TYPE_DOT: Record<CalEvent['type'], string> = { dive: 'bg-emerald-600', course: 'bg-sky-500' }
  const TYPE_LABELS: Record<CalEvent['type'], string> = { dive: 'Dive', course: 'Course' }
</script>

<svelte:window onkeydown={(e) => { if (e.key === 'Escape') selected = null }} />

<PageHeader
  title="Calendar"
  subtitle="Dives and courses on the schedule. Tap any event for details and to reserve your spot."
/>

<section class="mx-auto max-w-5xl px-4 py-12 sm:px-6">
  {#if error}
    <p class="mb-4 rounded-lg bg-red-500/15 p-4 text-sm text-red-200">Couldn’t load the calendar: {error}</p>
  {/if}
  {#if loading && events.length === 0}
    <div class="h-96 animate-pulse rounded-xl bg-white/10"></div>
  {:else}
    <MonthCalendar
      {month}
      {events}
      onMonthChange={(d) => (month = d)}
      onPickEvent={(ev) => (selected = ev)}
    />
  {/if}
</section>

{#if selected}
  <div class="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto px-4 pb-4 pt-8">
    <button class="fixed inset-0 bg-blue-900/60 backdrop-blur-sm" aria-label="Close" onclick={() => (selected = null)}></button>
    <div class="relative z-10 w-full max-w-lg space-y-4 rounded-2xl border border-red-500 bg-white/90 p-6 backdrop-blur-md">
      <div class="flex items-center justify-between">
        <span class={`rounded-full px-2 py-1 text-xs text-white ${TYPE_DOT[selected.type]}`}>
          {TYPE_LABELS[selected.type]}
        </span>
        <button onclick={() => (selected = null)} aria-label="Close" class="text-xl leading-none text-blue-900 hover:text-red-600">×</button>
      </div>
      <h2 class="text-xl font-bold text-blue-900">{selected.title}</h2>
      <div class="space-y-1 text-sm font-medium text-blue-900">
        <p>{formatEventSpan(selected, { style: 'long' })}</p>
        {#if selected.price != null}
          <p>💰 From {selected.currency} {selected.price.toLocaleString('en-US')}</p>
        {/if}
        {#if selected.fully_booked}
          <p class="font-semibold text-amber-700">This event is full — join the waitlist.</p>
        {/if}
      </div>
      {#if detailsLoading}
        <p class="text-sm text-blue-900/70">Loading details…</p>
      {:else if details}
        <div class="border-t border-blue-900/10 pt-3">
          <EventDetailsView {details} />
        </div>
      {/if}
      <a
        href={registerUrl(selected.type, selected.id)}
        target="_blank"
        rel="noopener"
        class="block w-full rounded-xl bg-blue-900 py-3 text-center font-semibold text-white transition-colors hover:bg-blue-950"
      >
        {selected.fully_booked ? 'Join waitlist' : 'Register'}
      </a>
    </div>
  </div>
{/if}
