<script lang="ts">
  import { fetchDestinations, type Destination } from '../lib/destinations'
  import { CONTACT } from '../lib/config'
  import { t } from '../lib/i18n'
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

<PageHeader title={$t.travel.title} subtitle={$t.travel.subtitle} />

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
              {#if d.tagline}<p class="mt-1 line-clamp-2 text-sm text-white/85">{d.tagline}</p>{/if}
              {#if d.slug}
                <a href={`https://www.fundiverstw.com${d.slug}`} target="_blank" rel="noopener" class="mt-3 inline-block rounded-full bg-reef-400 px-4 py-1.5 text-xs font-bold text-brand-950 transition-colors hover:bg-reef-300">
                  {$t.common.readMore}
                </a>
              {/if}
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
    <p class="rounded-lg bg-red-500/15 p-4 text-sm text-red-200">{$t.travel.loadError}: {error}</p>
  {:else}
    {@render grid($t.travel.aroundTaiwan, domestic)}
    {@render grid($t.travel.international, international)}
  {/if}

  <div class="glass rounded-2xl p-8 text-center">
    <h2 class="text-xl font-bold text-white">{$t.travel.ctaTitle}</h2>
    <p class="mt-2 text-brand-100">{$t.travel.ctaText}</p>
    <div class="mt-4 flex flex-wrap justify-center gap-3">
      <a href="/calendar" class="rounded-full bg-reef-400 px-6 py-3 font-semibold text-brand-950 transition-colors hover:bg-reef-300">
        {$t.travel.seeCalendar}
      </a>
      <a href={`mailto:${CONTACT.email}`} class="rounded-full border border-white/30 px-6 py-3 font-semibold text-white transition-colors hover:bg-white/10">
        {$t.travel.planCustom}
      </a>
    </div>
  </div>
</section>
