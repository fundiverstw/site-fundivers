<script lang="ts">
  import { startOfMonth, endOfMonth } from 'date-fns'
  import { fetchEventsInRange, type CalEvent, type ModalEvent } from '$engine/events'
  import { formatEventSpan } from '$engine/format'
  import { t } from '$engine/i18n'
  import PageHeader from '$components/PageHeader.svelte'
  import MonthCalendar from '$components/calendar/MonthCalendar.svelte'
  import EventModal from '$components/calendar/EventModal.svelte'

  let month = $state(new Date())
  let events = $state<CalEvent[]>([])
  let selected = $state<ModalEvent | null>(null)
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

  function open(ev: CalEvent) {
    selected = {
      id: ev.id,
      type: ev.type,
      title: ev.title,
      spanLabel: formatEventSpan(ev, { style: 'long' }),
      price: ev.price,
      currency: ev.currency,
      fullyBooked: ev.fully_booked,
    }
  }
</script>

<PageHeader title={$t.calendar.title} subtitle={$t.calendar.subtitle} />

<section class="mx-auto max-w-5xl px-4 py-12 sm:px-6">
  {#if error}
    <p class="mb-4 rounded-lg bg-red-500/15 p-4 text-sm text-red-200">
      {$t.calendar.loadError}: {error}
    </p>
  {/if}
  {#if loading && events.length === 0}
    <div class="h-96 animate-pulse rounded-xl bg-white/10"></div>
  {:else}
    <MonthCalendar {month} {events} onMonthChange={(d) => (month = d)} onPickEvent={open} />
  {/if}
</section>

<EventModal event={selected} onClose={() => (selected = null)} />
