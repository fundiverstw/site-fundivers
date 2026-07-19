<script lang="ts">
  import { fetchDestinations, type Destination } from '$engine/destinations'
  import { scrollToId, hashId } from '$engine/router'
  import { fetchUpcomingTripTitles } from '$engine/events'
  import { siteImage, fallbackImage } from '$engine/photo-pool'
  import { DIVE_SITES } from '$content/dive-sites'
  import { CONTACT } from '$content/settings'
  import { t } from '$engine/i18n'
  import PageHeader from '$components/PageHeader.svelte'
  import CoverPhoto from '$components/CoverPhoto.svelte'

  let all = $state<Destination[]>([])
  let tripTitles = $state<string[]>([])
  let loading = $state(true)
  let error = $state<string | null>(null)

  $effect(() => {
    Promise.all([fetchDestinations(), fetchUpcomingTripTitles().catch(() => [])])
      .then(([d, tt]) => {
        all = d
        tripTitles = tt
      })
      .catch((e) => (error = (e as Error)?.message ?? 'Failed to load'))
      .finally(() => (loading = false))
  })

  // Snap to the section named in the URL hash (e.g. /travel#international) once
  // the data has loaded — the native browser jump fires before the async data
  // renders the target section, so it never lands otherwise.
  $effect(() => {
    if (loading) return
    scrollToId(hashId())
  })

  // The five "trip" destinations around Taiwan: the travel_destinations title,
  // the matching /sites/<id> page, and a matcher for the free-text trip event
  // titles ("Seven Star in Kenting", "Lambai", …). A spot only appears when it
  // has an upcoming trip on the books.
  const TRIP_LOCATIONS = [
    { title: 'Green Island', siteId: 'green-island', match: /green\s*island/i },
    { title: 'Kenting', siteId: 'kenting', match: /kenting/i },
    { title: 'Penghu', siteId: 'penghu', match: /penghu/i },
    { title: 'Lambai Island', siteId: 'lambai-island', match: /lambai|xiao\s*liuqiu|liuqiu/i },
    { title: 'Orchid Island', siteId: 'orchid-island', match: /orchid\s*island|lanyu/i },
  ]

  type Card = Destination & { href: string | null; internal: boolean }

  // Around Taiwan: trip spots that have an upcoming trip on the books; if none
  // are currently scheduled, fall back to all trip spots so the section is never
  // empty. Each card links to its dive-site page.
  let domestic = $derived.by<Card[]>(() => {
    const scheduled = TRIP_LOCATIONS.filter((loc) =>
      tripTitles.some((title) => loc.match.test(title)),
    )
    const chosen = scheduled.length ? scheduled : TRIP_LOCATIONS
    return chosen.flatMap((loc) => {
      const dest = all.find((d) => d.title === loc.title)
      return dest
        ? [{ ...dest, image: siteImage(loc.siteId), href: `/sites/${loc.siteId}`, internal: true }]
        : []
    })
  })

  // An international destination that we also have as a dive site (e.g.
  // Malapascua) links to its /sites page and uses its pool photo; the rest keep
  // their outbound fundiverstw.com links, with a fallback photo so none are bare.
  const siteByName = new Map(DIVE_SITES.map((s) => [s.name.toLowerCase(), s]))
  let international = $derived<Card[]>(
    all
      .filter((d) => d.international)
      .map((d) => {
        const site = siteByName.get(d.title.toLowerCase())
        if (site)
          return { ...d, image: siteImage(site.id), href: `/sites/${site.id}`, internal: true }
        return {
          ...d,
          image: d.image ?? fallbackImage(d.id),
          href: d.slug ? `https://www.fundiverstw.com${d.slug}` : null,
          internal: false,
        }
      }),
  )

  // Jump pills — only for sections that have cards.
  let sections = $derived(
    [
      { id: 'around-taiwan', label: $t.travel.aroundTaiwan, show: domestic.length > 0 },
      { id: 'international', label: $t.travel.international, show: international.length > 0 },
    ].filter((s) => s.show),
  )
</script>

<PageHeader title={$t.travel.title} subtitle={$t.travel.subtitle} />

{#snippet grid(title: string, items: Card[], id: string)}
  {#if items.length}
    <div {id} class="mb-12 scroll-mt-24">
      <h2 class="mb-5 text-2xl font-bold text-white">{title}</h2>
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {#each items as d (d.id)}
          <div
            class="group relative flex aspect-square flex-col justify-end overflow-hidden rounded-3xl border border-white/15 shadow-sm transition-colors hover:border-reef-400/50"
          >
            <CoverPhoto src={d.image} alt={d.title} />
            <div
              class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"
            ></div>
            <!-- Whole card is the link: in-Taiwan spots go to the dive-site page
                 (internal), international tours open fundiverstw.com. -->
            {#if d.href}
              <a
                href={d.href}
                target={d.internal ? undefined : '_blank'}
                rel={d.internal ? undefined : 'noopener'}
                class="absolute inset-0 z-10"
                aria-label={d.title}
              ></a>
            {/if}
            <div class="pointer-events-none relative z-20 p-5">
              <h3 class="text-lg font-bold text-white">{d.title}</h3>
              {#if d.country}<p class="text-xs font-semibold uppercase tracking-wide text-sky-300">
                  {d.country}
                </p>{/if}
              {#if d.tagline}<p class="mt-1 line-clamp-2 text-sm text-white/85">{d.tagline}</p>{/if}
              {#if d.href}
                <span
                  class="mt-3 inline-block rounded-full bg-reef-400 px-4 py-1.5 text-xs font-bold text-brand-950 transition-colors group-hover:bg-reef-300"
                >
                  {d.internal ? $t.common.details : $t.common.readMore}
                </span>
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
      {#each Array(6) as _, i (i)}<div
          class="aspect-square animate-pulse rounded-3xl bg-white/10"
        ></div>{/each}
    </div>
  {:else if error}
    <p class="rounded-lg bg-red-500/15 p-4 text-sm text-red-200">{$t.travel.loadError}: {error}</p>
  {:else}
    {#if sections.length}
      <div class="mb-8 flex flex-wrap gap-3">
        {#each sections as s (s.id)}
          <a
            href={`#${s.id}`}
            class="waybar mono rounded-full px-5 py-2 text-sm font-semibold text-brand-50 transition-colors hover:text-reef-300"
          >
            {s.label}
          </a>
        {/each}
      </div>
    {/if}

    {@render grid($t.travel.aroundTaiwan, domestic, 'around-taiwan')}
    {@render grid($t.travel.international, international, 'international')}
  {/if}

  <div class="glass rounded-2xl p-8 text-center">
    <h2 class="text-xl font-bold text-white">{$t.travel.ctaTitle}</h2>
    <p class="mt-2 text-brand-100">{$t.travel.ctaText}</p>
    <div class="mt-4 flex flex-wrap justify-center gap-3">
      <a
        href="/calendar"
        class="rounded-full bg-reef-400 px-6 py-3 font-semibold text-brand-950 transition-colors hover:bg-reef-300"
      >
        {$t.travel.seeCalendar}
      </a>
      <a
        href={`mailto:${CONTACT.email}`}
        class="rounded-full border border-white/30 px-6 py-3 font-semibold text-white transition-colors hover:bg-white/10"
      >
        {$t.travel.planCustom}
      </a>
    </div>
  </div>
</section>
