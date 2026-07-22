<script lang="ts">
  import { fetchDiveSites, diveSitePath, type DiveSite } from '$content/dive-sites'
  import { siteImage } from '$engine/photo-pool'
  import { mapsUrl } from '$engine/links'
  import { t, locale } from '$engine/i18n'
  import { siteText, regionLabel } from '$engine/i18n-content'
  import PageHeader from '$components/PageHeader.svelte'
  import CoverPhoto from '$components/CoverPhoto.svelte'

  let sites = $state<DiveSite[]>([])
  let loading = $state(true)
  let error = $state<string | null>(null)

  $effect(() => {
    fetchDiveSites()
      .then((s) => (sites = s))
      .catch((err) => (error = err?.message ?? 'Failed to load sites'))
      .finally(() => (loading = false))
  })

  // Taiwan sites under one "Domestic" heading; trip destinations abroad (e.g.
  // Malapascua) under "International".
  let byArea = $derived.by(() => {
    const domestic = sites.filter((s) => !s.international)
    const international = sites.filter((s) => s.international)
    const groups: Array<{ area: 'Domestic' | 'International'; sites: DiveSite[] }> = []
    if (domestic.length) groups.push({ area: 'Domestic', sites: domestic })
    if (international.length) groups.push({ area: 'International', sites: international })
    return groups
  })
</script>

<PageHeader title={$t.sites.title} subtitle={$t.sites.subtitle} />

<section class="mx-auto max-w-[1600px] px-4 pb-12 sm:px-6">
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
            {@const img = siteImage(s.id)}
            <div
              class="group relative flex aspect-square flex-col justify-end overflow-hidden rounded-3xl border border-white/15 shadow-sm transition-colors hover:border-reef-400/50"
            >
              <CoverPhoto src={img} alt={siteText(s.id, $locale).name} />
              <div
                class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"
              ></div>
              <!-- Stretched link: the whole card opens the dive-site detail page. -->
              <a
                href={diveSitePath(s)}
                class="absolute inset-0 z-10"
                aria-label={siteText(s.id, $locale).name}
              ></a>
              <!-- Content sits above the image but lets clicks fall through to the
                   stretched link, except the map button which re-enables pointers. -->
              <div class="pointer-events-none relative z-20 p-5">
                <div class="flex items-center justify-between gap-2">
                  <h3 class="text-lg font-bold text-white">{siteText(s.id, $locale).name}</h3>
                  {#if s.dive_type}
                    <span
                      class="rounded bg-reef-400/25 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-reef-100"
                    >
                      {s.dive_type}
                    </span>
                  {/if}
                </div>
                <p class="mt-1 text-xs font-medium text-sky-300">
                  {regionLabel(s.region, $locale)}
                </p>
                {#if siteText(s.id, $locale).tagline}
                  <p class="mt-2 line-clamp-2 text-sm text-white/85">
                    {siteText(s.id, $locale).tagline}
                  </p>
                {/if}
                <div class="mt-3 flex flex-wrap gap-2">
                  <span
                    class="rounded-full bg-reef-400 px-4 py-1.5 text-xs font-bold text-brand-950 transition-colors group-hover:bg-reef-300"
                  >
                    {$t.common.readMore}
                  </span>
                  <a
                    href={mapsUrl(s)}
                    target="_blank"
                    rel="noopener"
                    class="pointer-events-auto rounded-full border border-white/40 px-4 py-1.5 text-xs font-bold text-white transition-colors hover:bg-white/15"
                  >
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
