<script lang="ts">
  import { fetchDiveSites, diveSitePath, REGION_META, type DiveSite, type Region } from '../lib/sites'
  import { fetchDestinations, type Destination } from '../lib/destinations'
  import { t } from '../lib/i18n'
  import PageHeader from '../components/PageHeader.svelte'

  let sites = $state<DiveSite[]>([])
  let destByName = $state<Map<string, Destination>>(new Map())
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
        destByName = new Map(dests.map((d) => [d.title, d]))
      })
      .catch((err) => (error = err?.message ?? 'Failed to load sites'))
      .finally(() => (loading = false))
  })

  // Prefer a destination photo matching the site's own name; fall back to a
  // representative photo for its region.
  function siteImage(s: DiveSite): string | null {
    return destByName.get(s.name)?.image ?? destByName.get(REGION_DEST[s.region])?.image ?? null
  }

  // Every dive site is in Taiwan, so they all sit under a single "Domestic"
  // heading — no North / South / Islands split.
  let byArea = $derived.by(() =>
    sites.length ? [{ area: 'Domestic' as const, sites }] : []
  )

  function mapsUrl(s: DiveSite): string {
    return `https://www.google.com/maps/search/?api=1&query=${s.latitude},${s.longitude}`
  }
</script>

<PageHeader title={$t.sites.title} subtitle={$t.sites.subtitle} />

<section class="mx-auto max-w-[1600px] px-4 py-12 sm:px-6">
  {#if loading}
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {#each Array(6) as _}
        <div class="h-40 animate-pulse rounded-xl bg-white/10"></div>
      {/each}
    </div>
  {:else if error}
    <p class="rounded-lg bg-red-500/15 p-4 text-sm text-red-200">{$t.sites.loadError}: {error}</p>
  {:else if sites.length === 0}
    <p class="glass rounded-lg p-6 text-center text-brand-100">{$t.sites.none}</p>
  {:else}
    {#each byArea as group}
      <div class="mb-12">
        <h2 class="mb-5 text-2xl font-bold text-white">{$t.sites.areas[group.area]}</h2>
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {#each group.sites as s (s.id)}
            {@const img = siteImage(s)}
            <div class="group relative flex aspect-square flex-col justify-end overflow-hidden rounded-3xl border border-white/15 shadow-sm transition-colors hover:border-reef-400/50">
              {#if img}
                <img src={img} alt="" loading="lazy" class="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              {:else}
                <div class="absolute inset-0 bg-gradient-to-br from-brand-700 to-reef-700"></div>
              {/if}
              <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
              <!-- Stretched link: the whole card opens the dive-site detail page. -->
              <a href={diveSitePath(s)} class="absolute inset-0 z-10" aria-label={s.name}></a>
              <!-- Content sits above the image but lets clicks fall through to the
                   stretched link, except the map button which re-enables pointers. -->
              <div class="pointer-events-none relative z-20 p-5">
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
                  <p class="mt-2 line-clamp-2 text-sm text-white/85">{s.tagline}</p>
                {/if}
                <div class="mt-3 flex flex-wrap gap-2">
                  <span class="rounded-full bg-reef-400 px-4 py-1.5 text-xs font-bold text-brand-950 transition-colors group-hover:bg-reef-300">
                    {$t.common.readMore}
                  </span>
                  <a href={mapsUrl(s)} target="_blank" rel="noopener" class="pointer-events-auto rounded-full border border-white/40 px-4 py-1.5 text-xs font-bold text-white transition-colors hover:bg-white/15">
                    {$t.common.viewOnMap}
                  </a>
                </div>
              </div>
            </div>
          {/each}
        </div>
      </div>
    {/each}
  {/if}
</section>
