<script lang="ts">
  import { path } from '$engine/router'
  import { diveSiteById, REGION_META } from '$content/dive-sites'
  import { siteImage } from '$engine/photo-pool'
  import { DIVE_SITE_GUIDES } from '$content/dive-site-guides'
  import { mapsUrl } from '$engine/links'
  import { t } from '$engine/i18n'
  import CallToAction from '$components/CallToAction.svelte'
  import CoverPhoto from '$components/CoverPhoto.svelte'
  import DiveDescent from '$components/DiveDescent.svelte'

  // The route param: /sites/<id>. The router serves this component for any
  // /sites/<something> path, so we resolve the id from the current path.
  let id = $derived($path.replace(/^\/sites\//, '').replace(/\/+$/, ''))
  let site = $derived(diveSiteById(id))
  let guide = $derived(site ? (DIVE_SITE_GUIDES[site.id] ?? null) : null)

  // This page is entirely static. It used to also fetch travel_destinations and
  // match this site by name, to let the booking app override the tagline and the
  // requirements line — 17 kB over the network, after the JavaScript had parsed,
  // for at most two short strings that already have copy in this repository.
  // Dive sites are marketing content, so they live here (see docs/how-it-works).

  // Keep the browser tab title in sync with the current site.
  $effect(() => {
    if (site) document.title = `${site.name} · FunDivers TW`
  })

  let heroImg = $derived(site ? siteImage(site.id) : null)
  let tagline = $derived(site?.tagline ?? null)
  let regionLabel = $derived(site ? (REGION_META[site.region]?.label ?? site.region) : '')
  let mapsHref = $derived(site ? mapsUrl(site) : '#')

  // Quick-facts rows, in order, skipping anything we don't have.
  let facts = $derived.by(() => {
    const rows: Array<{ label: string; value: string }> = []
    if (site?.dive_type) rows.push({ label: $t.siteDetail.diveType, value: site.dive_type })
    if (guide?.depthRange) rows.push({ label: $t.siteDetail.depth, value: guide.depthRange })
    if (guide?.difficulty) rows.push({ label: $t.siteDetail.difficulty, value: guide.difficulty })
    if (guide?.bestSeason) rows.push({ label: $t.siteDetail.season, value: guide.bestSeason })
    if (guide?.waterTemp) rows.push({ label: $t.siteDetail.waterTemp, value: guide.waterTemp })
    if (guide?.visibility) rows.push({ label: $t.siteDetail.visibility, value: guide.visibility })
    rows.push({ label: $t.siteDetail.region, value: regionLabel })
    return rows
  })

  const paras = (text: string | undefined | null) => (text ?? '').split('\n\n').filter(Boolean)
  let paragraphs = $derived(paras(guide?.overview))

  let requirements = $derived(guide?.requirements ?? null)
</script>

{#if !site}
  <section class="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6">
    <p class="glass rounded-2xl p-8 text-brand-100">{$t.siteDetail.notFound}</p>
    <a href="/sites" class="mt-6 inline-block text-reef-300 hover:text-reef-200"
      >{$t.siteDetail.back}</a
    >
  </section>
{:else}
  <DiveDescent>
    <article class="mx-auto max-w-[1100px] px-4 py-8 sm:px-6 sm:py-12">
      <a
        href="/sites"
        class="text-sm font-medium text-reef-300 transition-colors hover:text-reef-200"
      >
        {$t.siteDetail.back}
      </a>

      <!-- Hero -->
      <div
        class="relative mt-4 flex min-h-[16rem] flex-col justify-end overflow-hidden rounded-3xl border border-white/15 sm:min-h-[22rem]"
      >
        <CoverPhoto
          src={heroImg}
          alt={site.name}
          priority
          imgClass="absolute inset-0 h-full w-full object-cover"
        />
        <div
          class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent"
        ></div>
        <div class="relative z-10 p-6 sm:p-8">
          <div class="flex flex-wrap items-center gap-2">
            <span class="mono text-xs font-medium uppercase tracking-wide text-sky-300"
              >{regionLabel}</span
            >
            {#if site.dive_type}
              <span
                class="rounded bg-reef-400/25 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-reef-100"
              >
                {site.dive_type}
              </span>
            {/if}
          </div>
          <h1 class="mt-1 text-3xl font-bold tracking-tight text-white sm:text-4xl">{site.name}</h1>
          {#if tagline}
            <p class="mt-2 max-w-2xl text-sm text-white/90 sm:text-base">{tagline}</p>
          {/if}
        </div>
      </div>

      <div class="mt-8 grid gap-8 lg:grid-cols-[1fr_20rem]">
        <!-- Main column -->
        <div class="min-w-0">
          {#if paragraphs.length}
            <h2 class="text-xl font-bold text-white">{$t.siteDetail.overview}</h2>
            <div class="mt-3 space-y-3 text-brand-100">
              {#each paragraphs as p}
                <p class="leading-relaxed">{p}</p>
              {/each}
            </div>
          {/if}

          {#if guide?.highlights?.length}
            <h2 class="mt-8 text-xl font-bold text-white">{$t.siteDetail.highlights}</h2>
            <ul class="mt-3 space-y-2">
              {#each guide.highlights as h}
                <li class="flex gap-2 text-brand-100">
                  <span class="mt-1 text-reef-300" aria-hidden="true">◆</span>
                  <span>{h}</span>
                </li>
              {/each}
            </ul>
          {/if}

          {#if guide?.aboveSurface}
            <h2 class="mt-8 text-xl font-bold text-white">{$t.siteDetail.aboveSurface}</h2>
            <div class="mt-3 space-y-3 text-brand-100">
              {#each paras(guide.aboveSurface) as p}
                <p class="leading-relaxed">{p}</p>
              {/each}
            </div>
          {/if}

          <!-- Below the Surface: the shop's prose where we have it, otherwise the
             marine-life chips stand on their own under their old heading. The
             marker sets where the descent's water surface line sits. -->
          {#if guide?.belowSurface || guide?.marineLife?.length}
            <div data-surface aria-hidden="true" class="h-20"></div>
            <h2 class="text-xl font-bold text-white">
              {guide?.belowSurface ? $t.siteDetail.belowSurface : $t.siteDetail.marineLife}
            </h2>
            {#if guide?.belowSurface}
              <div class="mt-3 space-y-3 text-brand-100">
                {#each paras(guide.belowSurface) as p}
                  <p class="leading-relaxed">{p}</p>
                {/each}
              </div>
            {/if}
            {#if guide?.marineLife?.length}
              <div class="mt-4 flex flex-wrap gap-2">
                {#each guide.marineLife as m}
                  <span
                    class="rounded-full border border-reef-400/40 bg-reef-400/10 px-3 py-1 text-sm text-reef-100"
                    >{m}</span
                  >
                {/each}
              </div>
            {/if}
          {/if}

          {#if guide?.gettingThere}
            <h2 class="mt-8 text-xl font-bold text-white">{$t.siteDetail.gettingThere}</h2>
            <div class="mt-3 space-y-3 text-brand-100">
              {#each paras(guide.gettingThere) as p}
                <p class="leading-relaxed">{p}</p>
              {/each}
            </div>
            <a
              href={mapsHref}
              target="_blank"
              rel="noopener"
              class="mt-3 inline-block text-sm font-semibold text-reef-300 transition-colors hover:text-reef-200"
            >
              {$t.siteDetail.directions} →
            </a>
          {/if}
        </div>

        <!-- Sidebar: pinned at the top of the grid row (level with the "About
           this site" heading), not sticky, so it does not follow the scroll. -->
        <aside class="lg:self-start">
          <div class="glass rounded-2xl p-5">
            <h2 class="text-sm font-semibold uppercase tracking-wide text-white">
              {$t.siteDetail.quickFacts}
            </h2>
            <dl class="mt-3 space-y-2.5 text-sm">
              {#each facts as f}
                <div class="flex items-start justify-between gap-3">
                  <dt class="shrink-0 text-brand-300">{f.label}</dt>
                  <dd class="text-right font-medium text-white">{f.value}</dd>
                </div>
              {/each}
            </dl>

            {#if requirements}
              <div class="mt-4 border-t border-white/10 pt-3">
                <dt class="text-brand-300">{$t.siteDetail.requirements}</dt>
                <dd class="mt-1 text-sm text-white/90">{requirements}</dd>
              </div>
            {/if}

            <div class="mt-5 flex flex-col gap-2">
              <a
                href={mapsHref}
                target="_blank"
                rel="noopener"
                class="rounded-full border border-white/40 px-4 py-2 text-center text-sm font-bold text-white transition-colors hover:bg-white/15"
              >
                {$t.siteDetail.directions}
              </a>
            </div>
          </div>
        </aside>
      </div>

      <!-- CTA -->
      <CallToAction
        title={$t.siteDetail.cta}
        text={$t.siteDetail.ctaText}
        calendarLabel={$t.siteDetail.seeCalendar}
        contactLabel={$t.siteDetail.contact}
      />
    </article>
  </DiveDescent>
{/if}
