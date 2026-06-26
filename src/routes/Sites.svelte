<script lang="ts">
  import { fetchDiveSites, REGION_META, AREA_ORDER, type DiveSite } from '../lib/sites'
  import PageHeader from '../components/PageHeader.svelte'

  let sites = $state<DiveSite[]>([])
  let loading = $state(true)
  let error = $state<string | null>(null)

  $effect(() => {
    fetchDiveSites()
      .then((s) => (sites = s))
      .catch((err) => (error = err?.message ?? 'Failed to load sites'))
      .finally(() => (loading = false))
  })

  // Group sites by broad area (North / South / Outlying Islands).
  let byArea = $derived.by(() => {
    const groups = new Map<string, DiveSite[]>()
    for (const area of AREA_ORDER) groups.set(area, [])
    for (const s of sites) {
      const area = REGION_META[s.region]?.area ?? 'Outlying Islands'
      groups.get(area)!.push(s)
    }
    return AREA_ORDER.map((area) => ({ area, sites: groups.get(area)! })).filter((g) => g.sites.length)
  })

  function mapsUrl(s: DiveSite): string {
    return `https://www.google.com/maps/search/?api=1&query=${s.latitude},${s.longitude}`
  }
</script>

<PageHeader
  title="Dive Sites"
  subtitle="From convenient shore dives in the north to world-class island diving — Taiwan’s underwater highlights."
/>

<section class="mx-auto max-w-[1600px] px-4 py-12 sm:px-6">
  {#if loading}
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {#each Array(6) as _}
        <div class="h-40 animate-pulse rounded-xl bg-white/10"></div>
      {/each}
    </div>
  {:else if error}
    <p class="rounded-lg bg-red-500/15 p-4 text-sm text-red-200">Couldn’t load dive sites: {error}</p>
  {:else if sites.length === 0}
    <p class="glass rounded-lg p-6 text-center text-brand-100">No dive sites listed yet.</p>
  {:else}
    {#each byArea as group}
      <div class="mb-12">
        <h2 class="mb-5 text-2xl font-bold text-white">{group.area}</h2>
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {#each group.sites as s (s.id)}
            <a
              href={mapsUrl(s)}
              target="_blank"
              rel="noopener"
              class="glass group flex flex-col rounded-xl p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <div class="flex items-center justify-between gap-2">
                <h3 class="font-semibold text-white">{s.name}</h3>
                {#if s.dive_type}
                  <span class="rounded bg-reef-400/20 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-reef-200">
                    {s.dive_type}
                  </span>
                {/if}
              </div>
              <p class="mt-1 text-xs font-medium text-brand-200">{REGION_META[s.region]?.label ?? s.region}</p>
              {#if s.tagline}
                <p class="mt-2 line-clamp-4 text-sm text-brand-100">{s.tagline}</p>
              {/if}
              <span class="mt-3 text-xs font-semibold text-reef-300">View on map →</span>
            </a>
          {/each}
        </div>
      </div>
    {/each}
  {/if}
</section>
