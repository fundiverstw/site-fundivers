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

<section class="mx-auto max-w-6xl px-4 py-12 sm:px-6">
  {#if loading}
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {#each Array(6) as _}
        <div class="h-40 animate-pulse rounded-xl bg-brand-50"></div>
      {/each}
    </div>
  {:else if error}
    <p class="rounded-lg bg-red-50 p-4 text-sm text-red-700">Couldn’t load dive sites: {error}</p>
  {:else if sites.length === 0}
    <p class="rounded-lg bg-brand-50 p-6 text-center text-slate-600">No dive sites listed yet.</p>
  {:else}
    {#each byArea as group}
      <div class="mb-12">
        <h2 class="mb-5 text-2xl font-bold text-brand-900">{group.area}</h2>
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {#each group.sites as s (s.id)}
            <a
              href={mapsUrl(s)}
              target="_blank"
              rel="noopener"
              class="group flex flex-col rounded-xl border border-brand-100 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <div class="flex items-center justify-between gap-2">
                <h3 class="font-semibold text-brand-800 group-hover:text-brand-700">{s.name}</h3>
                {#if s.dive_type}
                  <span class="rounded bg-reef-50 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-reef-700">
                    {s.dive_type}
                  </span>
                {/if}
              </div>
              <p class="mt-1 text-xs font-medium text-slate-400">{REGION_META[s.region]?.label ?? s.region}</p>
              {#if s.tagline}
                <p class="mt-2 line-clamp-4 text-sm text-slate-600">{s.tagline}</p>
              {/if}
              <span class="mt-3 text-xs font-semibold text-reef-600">View on map →</span>
            </a>
          {/each}
        </div>
      </div>
    {/each}
  {/if}
</section>
