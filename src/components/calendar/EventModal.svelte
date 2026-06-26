<script lang="ts">
  import { fetchEventDetails, type EventDetails, type ModalEvent } from '../../lib/events'
  import { registerUrl } from '../../lib/config'
  import { t } from '../../lib/i18n'
  import EventDetailsView from './EventDetails.svelte'

  // Shared event detail modal used by the calendar and the homepage. Fetches
  // the event's descriptive text on open and links Register to the booking app.
  let { event, onClose }: { event: ModalEvent | null; onClose: () => void } = $props()

  const TYPE_DOT: Record<ModalEvent['type'], string> = { dive: 'bg-emerald-600', course: 'bg-sky-500' }
  let TYPE_LABELS = $derived<Record<ModalEvent['type'], string>>({ dive: $t.common.dive, course: $t.common.course })

  let details = $state<EventDetails | null>(null)
  let detailsLoading = $state(false)
  $effect(() => {
    const ev = event
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
</script>

<svelte:window onkeydown={(e) => { if (e.key === 'Escape') onClose() }} />

{#if event}
  <div class="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto px-4 pb-4 pt-8">
    <button class="fixed inset-0 bg-blue-900/60 backdrop-blur-sm" aria-label="Close" onclick={onClose}></button>
    <div class="relative z-10 w-full max-w-lg space-y-4 rounded-2xl border border-red-500 bg-white/90 p-6 backdrop-blur-md">
      <div class="flex items-center justify-between">
        <span class={`rounded-full px-2 py-1 text-xs text-white ${TYPE_DOT[event.type]}`}>
          {TYPE_LABELS[event.type]}
        </span>
        <button onclick={onClose} aria-label="Close" class="text-xl leading-none text-blue-900 hover:text-red-600">×</button>
      </div>
      <h2 class="text-xl font-bold text-blue-900">{event.title}</h2>
      <div class="space-y-1 text-sm font-medium text-blue-900">
        <p>{event.spanLabel}</p>
        {#if event.price != null}
          <p>💰 {$t.common.from} {event.currency} {event.price.toLocaleString('en-US')}</p>
        {/if}
        {#if event.fullyBooked}
          <p class="font-semibold text-amber-700">{$t.calendar.full}</p>
        {/if}
      </div>
      {#if detailsLoading}
        <p class="text-sm text-blue-900/70">{$t.common.loadingDetails}</p>
      {:else if details}
        <div class="border-t border-blue-900/10 pt-3">
          <EventDetailsView {details} />
        </div>
      {/if}
      <a
        href={registerUrl(event.type, event.id)}
        target="_blank"
        rel="noopener"
        class="block w-full rounded-xl bg-blue-900 py-3 text-center font-semibold text-white transition-colors hover:bg-blue-950"
      >
        {event.fullyBooked ? $t.common.joinWaitlist : $t.common.register}
      </a>
    </div>
  </div>
{/if}
