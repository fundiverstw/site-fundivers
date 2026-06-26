<script lang="ts">
  import { fetchDestinations, type Destination } from '../lib/destinations'
  import { CONTACT } from '../lib/config'
  import PageHeader from '../components/PageHeader.svelte'

  let all = $state<Destination[]>([])
  let loading = $state(true)
  let error = $state<string | null>(null)

  $effect(() => {
    fetchDestinations()
      .then((d) => (all = d))
      .catch((e) => (error = (e as Error)?.message ?? 'Failed to load'))
      .finally(() => (loading = false))
  })

  // International tours vs. trips around Taiwan. The northeast-coast day-dive
  // sites (northeastDiving) live on the Sites page, not here.
  let international = $derived(all.filter((d) => d.international))
  let domestic = $derived(all.filter((d) => !d.international && !d.northeastDiving))
</script>

<PageHeader
  title="Dive Travel"
  subtitle="Planned group tours and fully customized trips — around Taiwan and beyond."
/>

{#snippet grid(title: string, items: Destination[])}
  {#if items.length}
    <div class="mb-12">
      <h2 class="mb-5 text-2xl font-bold text-white">{title}</h2>
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {#each items as d (d.id)}
          <div class="group relative flex h-72 flex-col justify-end overflow-hidden rounded-2xl border border-white/15 shadow-sm">
            {#if d.image}
              <img src={d.image} alt="" loading="lazy" class="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
            {:else}
              <div class="absolute inset-0 bg-gradient-to-br from-brand-700 to-reef-700"></div>
            {/if}
            <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
            <div class="relative z-10 p-5">
              <h3 class="text-lg font-bold text-white">{d.title}</h3>
              {#if d.country}<p class="text-xs font-semibold uppercase tracking-wide text-sky-300">{d.country}</p>{/if}
              {#if d.tagline}<p class="mt-1 line-clamp-3 text-sm text-white/85">{d.tagline}</p>{/if}
            </div>
          </div>
        {/each}
      </div>
    </div>
  {/if}
{/snippet}

<section class="mx-auto max-w-[1600px] px-4 py-12 sm:px-6 sm:py-16">
  {#if loading}
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {#each Array(6) as _, i (i)}<div class="h-72 animate-pulse rounded-2xl bg-white/10"></div>{/each}
    </div>
  {:else if error}
    <p class="rounded-lg bg-red-500/15 p-4 text-sm text-red-200">Couldn’t load destinations: {error}</p>
  {:else}
    {@render grid('Around Taiwan', domestic)}
    {@render grid('International Dive Tours', international)}
  {/if}

  <div class="glass rounded-2xl p-8 text-center">
    <h2 class="text-xl font-bold text-white">Ready to plan your next trip?</h2>
    <p class="mt-2 text-brand-100">
      Check upcoming departures on the calendar, or reach out and we’ll help arrange a custom trip.
    </p>
    <div class="mt-4 flex flex-wrap justify-center gap-3">
      <a href="/calendar" class="rounded-full bg-reef-400 px-6 py-3 font-semibold text-brand-950 transition-colors hover:bg-reef-300">
        See the Calendar
      </a>
      <a href={`mailto:${CONTACT.email}`} class="rounded-full border border-white/30 px-6 py-3 font-semibold text-white transition-colors hover:bg-white/10">
        Plan a custom trip
      </a>
    </div>
  </div>
</section>
