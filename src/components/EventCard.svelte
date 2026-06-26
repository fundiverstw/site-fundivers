<script lang="ts">
  import type { UpcomingEvent } from '../lib/events'
  import { formatSpan } from '../lib/format'
  import { twd } from '../lib/format'
  import { registerUrl } from '../lib/config'

  // Image-backed event card (modeled on app-fundivers/wix/home/upcoming_courses.html):
  // cover image + dark overlay with title, date, schedule blurb, price, and
  // Details (opens the detail modal) / Book Now (booking app) actions.
  let { ev, onDetails }: { ev: UpcomingEvent; onDetails: (ev: UpcomingEvent) => void } = $props()

  let price = $derived(twd(ev.startingAt))
  let pill = $derived(
    ev.type === 'dive' ? 'bg-emerald-500/30 text-emerald-100' : 'bg-sky-500/30 text-sky-100',
  )
  let imgFailed = $state(false)
</script>

<div class="group relative h-80 overflow-hidden rounded-2xl border border-white/15 bg-brand-900 shadow-sm transition-transform hover:-translate-y-0.5">
  {#if ev.image && !imgFailed}
    <img src={ev.image} alt="" loading="lazy" onerror={() => (imgFailed = true)} class="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
  {:else}
    <div class="absolute inset-0 bg-gradient-to-br from-brand-700 to-reef-700"></div>
  {/if}
  <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>

  <div class="absolute inset-x-0 bottom-0 z-10 flex flex-col gap-1 p-4">
    <div class="flex flex-wrap items-center gap-2">
      <span class={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${pill}`}>{ev.type}</span>
      {#if ev.featured}<span class="text-[11px] font-semibold text-reef-200">★ Featured</span>{/if}
      {#if ev.fullyBooked}<span class="rounded bg-amber-400/25 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-200">Waitlist</span>{/if}
    </div>
    <h3 class="line-clamp-2 text-lg font-bold leading-tight text-white">{ev.title}</h3>
    <p class="text-sm font-semibold text-sky-300">{formatSpan(ev.startDate, ev.endDate, ev.time)}</p>
    {#if ev.description}
      <p class="line-clamp-2 text-xs text-white/80">{ev.description}</p>
    {/if}
    {#if price}<p class="text-sm font-bold text-amber-300">From {price}</p>{/if}
    <div class="mt-2 flex gap-2">
      <button
        type="button"
        onclick={() => onDetails(ev)}
        class="rounded-full border border-white/40 px-4 py-1.5 text-xs font-bold text-white transition-colors hover:bg-white/15"
      >
        Details
      </button>
      <a
        href={registerUrl(ev.type, ev.id)}
        target="_blank"
        rel="noopener"
        class="rounded-full bg-reef-400 px-4 py-1.5 text-xs font-bold text-brand-950 transition-colors hover:bg-reef-300"
      >
        {ev.fullyBooked ? 'Waitlist' : 'Book Now'}
      </a>
    </div>
  </div>
</div>
