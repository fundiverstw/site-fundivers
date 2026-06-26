<script lang="ts">
  import { fetchDiveSites, REGION_META, AREA_ORDER, type DiveSite, type Region } from '../lib/sites'
  import { fetchDestinations } from '../lib/destinations'
  import PageHeader from '../components/PageHeader.svelte'

  let sites = $state<DiveSite[]>([])
  let destByTitle = $state<Map<string, string | null>>(new Map())
  let loading = $state(true)
  let error = $state<string | null>(null)

  // Fallback per-region cover photo when a site has no same-named destination.
  const REGION_DEST: Record<Region, string> = {
    keelung: 'Bat Cave',
    longdong: 'Long Dong Bay',
    yilan: 'Turtle Island',
    greenisland: 'Green Island',
    lanyu: 'Orchid Island',
    xiaoliuqiu: 'Lambai Island',
    kenting: 'Kenting',
    penghu: 'Penghu',
  }

  $effect(() => {
    Promise.all([fetchDiveSites(), fetchDestinations().catch(() => [])])
      .then(([s, dests]) => {
        sites = s
        destByTitle = new Map(dests.map((d) => [d.title, d.image]))
      })
      .catch((err) => (error = err?.message ?? 'Failed to load sites'))
      .finally(() => (loading = false))
  })

  // Prefer a destination photo matching the site's own name; fall back to a
  // representative photo for its region.
  function siteImage(s: DiveSite): string | null {
    return destByTitle.get(s.name) ?? destByTitle.get(REGION_DEST[s.region]) ?? null
  }

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
            {@const img = siteImage(s)}
            <a
              href={mapsUrl(s)}
              target="_blank"
              rel="noopener"
              class="group relative flex h-64 flex-col justify-end overflow-hidden rounded-2xl border border-white/15 shadow-sm transition-transform hover:-translate-y-0.5"
            >
              {#if img}
                <img src={img} alt="" loading="lazy" class="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              {:else}
                <div class="absolute inset-0 bg-gradient-to-br from-brand-700 to-reef-700"></div>
              {/if}
              <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
              <div class="relative z-10 p-5">
                <div class="flex items-center justify-between gap-2">
                  <h3 class="text-lg font-bold text-white">{s.name}</h3>
                  {#if s.dive_type}
                    <span class="rounded bg-reef-400/25 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-reef-100">
                      {s.dive_type}
                    </span>
                  {/if}
                </div>
                <p class="mt-1 text-xs font-medium text-sky-300">{REGION_META[s.region]?.label ?? s.region}</p>
                {#if s.tagline}
                  <p class="mt-2 line-clamp-3 text-sm text-white/85">{s.tagline}</p>
                {/if}
                <span class="mt-3 inline-block text-xs font-semibold text-reef-200">View on map →</span>
              </div>
            </a>
          {/each}
        </div>
      </div>
    {/each}
  {/if}
</section>
