<script lang="ts">
  import Photo from '$components/Photo.svelte'
  import { SIZES } from '$engine/responsive-image'
  import { fetchUpcomingEvents, type UpcomingEvent, type ModalEvent } from '$engine/events'
  import { formatSpan, twd } from '$engine/format'
  import GetInTouch from '$components/GetInTouch.svelte'
  import EventModal from '$components/calendar/EventModal.svelte'
  import { mediaIdLocal } from '$engine/images'
  import { siteImage } from '$engine/photo-pool'
  import { t } from '$engine/i18n'
  import CoverPhoto from '$components/CoverPhoto.svelte'

  let upcoming = $state<UpcomingEvent[]>([])
  let loading = $state(true)
  let selected = $state<ModalEvent | null>(null)

  function open(ev: UpcomingEvent) {
    selected = {
      id: ev.id,
      type: ev.type,
      title: ev.title,
      spanLabel: formatSpan(ev.startDate, ev.endDate, ev.time),
      price: ev.startingAt,
      currency: 'TWD',
      fullyBooked: ev.fullyBooked,
    }
  }

  $effect(() => {
    fetchUpcomingEvents()
      .then((e) => (upcoming = e))
      .catch(() => (upcoming = []))
      .finally(() => (loading = false))
  })

  // Featured: real featured first, padded with the soonest upcoming events.
  let featured = $derived.by(() => {
    const feat = upcoming.filter((e) => e.featured)
    if (feat.length >= 3) return feat.slice(0, 3)
    const ids = new Set(feat.map((e) => e.id))
    return [...feat, ...upcoming.filter((e) => !ids.has(e.id)).slice(0, 3 - feat.length)]
  })
  let featuredIds = $derived(new Set(featured.map((e) => e.id)))
  let dives = $derived(
    upcoming.filter((e) => e.type === 'dive' && !featuredIds.has(e.id)).slice(0, 3),
  )
  let courses = $derived(
    upcoming.filter((e) => e.type === 'course' && !featuredIds.has(e.id)).slice(0, 3),
  )

  // Structural data only (links + images); titles/descriptions come from i18n
  // ($t.home.services), aligned by index.
  const serviceLinks = [
    { href: '/courses', image: mediaIdLocal('b37fef_2ea720f3f0c94fb8bc703856514b0a6c~mv2.jpg') },
    { href: '/sites', image: mediaIdLocal('b37fef_7621a533ac1946a8b342bc5085cb1d28~mv2.jpg') },
    { href: '/gear', image: mediaIdLocal('b37fef_58237e6a633f472b8d419bd830abb854~mv2.jpg') },
    {
      href: 'https://site-fundiverstw.fundiverstw.workers.dev/travel#international',
      image: mediaIdLocal('b37fef_80f90894e75f47f8809d14663dd8e8bd~mv2.jpg'),
    },
    { href: '/travel', image: siteImage('penghu') },
    {
      href: 'https://site-fundiverstw.fundiverstw.workers.dev/courses/padi-efr-course',
      image: mediaIdLocal('b37fef_49df7d482eb44585a605a489e2b1d653~mv2.jpg'),
    },
  ]

  // Decorative photography for the "Diving in Taiwan" section. These are dive
  // shots already bundled on disk but not shown anywhere else on the site (past
  // events / marine life), so the section gets some colour without repeating the
  // service or event cards. Divers-in-the-blue up top; reef critters below.
  const diveScenes = [
    mediaIdLocal('b37fef_62e3ef3bf39c43189066945900e212ec~mv2.jpg'), // diver on the wall
    mediaIdLocal('b37fef_336fa72d68ae4cd19dcf205ba6cc555a~mv2.jpg'), // divers in the blue
    mediaIdLocal('b37fef_544484389a4b4ce4a8ceed361a49989b~mv2.jpg'), // diver + fish school
  ]
  const marineLife = [
    mediaIdLocal('9f20fa_d7e84b19892441b18febc6c321746bde~mv2.jpg'), // octopus
    mediaIdLocal('b37fef_6194a1794e5540239e0327d2e92cfa3d~mv2.jpg'), // boxfish
    mediaIdLocal('b37fef_7b0eff53c74d41ed80dc27ea77462778~mv2.jpg'), // tube anemone
    mediaIdLocal('b37fef_bf3a6e799829427fb4f2b57eb9346869~mv2.jpg'), // moray eel
    mediaIdLocal('b37fef_ce80a7ab6e3f468e870a2321b382cd57~mv2.jpg'), // pufferfish
    mediaIdLocal('b37fef_7635de3c5357483999a169b65282ebe4~mv2.jpg'), // leaf scorpionfish
  ]
</script>

<!-- A compact image card. Square from `sm` up (where the cards sit three-across),
     so the photo's subject stays centred instead of being cropped to a letterbox
     the way a fill-the-column card was. On a phone it is one-per-row at 16/10. -->
{#snippet heroCard(ev: UpcomingEvent, big: boolean)}
  {@const price = twd(ev.startingAt)}
  <button
    type="button"
    onclick={() => open(ev)}
    class={`group relative block aspect-[16/10] w-full overflow-hidden rounded-3xl border border-white/15 text-left transition-all duration-300 hover:-translate-y-0.5 sm:aspect-square ${big ? 'hover:border-mauve/60 hover:shadow-[0_0_26px_-6px_rgba(203,166,247,0.7)]' : 'hover:border-reef-400/60 hover:shadow-[0_0_26px_-6px_rgba(44,208,197,0.65)]'}`}
  >
    <CoverPhoto src={ev.image} />
    <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
    <div class={`absolute inset-x-0 bottom-0 ${big ? 'px-6 pb-6 pt-5' : 'px-5 pb-5 pt-4'}`}>
      {#if ev.fullyBooked}
        <span
          class="rounded bg-amber-400/25 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-amber-200"
          >{$t.common.waitlist}</span
        >
      {/if}
      <h3
        class={`line-clamp-2 font-bold leading-tight text-white ${big ? 'text-base lg:text-lg' : 'text-xs lg:text-sm'}`}
      >
        {ev.title}
      </h3>
      <p class="mono truncate text-[11px] text-sky-300">
        {formatSpan(ev.startDate, ev.endDate, ev.time)}
      </p>
      {#if price}<p class="mono text-xs font-bold text-peach">{$t.common.from} {price}</p>{/if}
    </div>
  </button>
{/snippet}

<!-- One row of three square cards under a titled header. `big` gives the
     featured row its mauve accent; `moreHref` is the optional "view all" link
     (featured has none — it is a hand-picked mix, not a page). -->
{#snippet strip(
  icon: string,
  iconClass: string,
  title: string,
  items: UpcomingEvent[],
  moreHref: string,
  big: boolean,
)}
  <div>
    <div class="mb-2 flex items-center justify-between">
      <h2 class="flex items-center gap-2 text-xl font-bold text-white">
        <span class="mono {iconClass}">{icon}</span>{title}
      </h2>
      {#if moreHref}
        <a href={moreHref} class="mono text-sm font-semibold text-reef-300 hover:text-reef-200"
          >{$t.common.viewAll} →</a
        >
      {/if}
    </div>
    <div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {#if loading}
        {#each Array(3) as _, i (i)}<div
            class="aspect-[16/10] animate-pulse rounded-3xl bg-white/10 sm:aspect-square"
          ></div>{/each}
      {:else if items.length === 0}
        <p class="text-sm text-brand-200 sm:col-span-3">{$t.common.nothingScheduled}</p>
      {:else}
        {#each items as ev (ev.id)}{@render heroCard(ev, big)}{/each}
      {/if}
    </div>
  </div>
{/snippet}

<!-- Hero: three uniform strips — featured, then the soonest dives and courses.
     Every card is the same square, so no photo is stretched into a letterbox. -->
<section class="mx-auto max-w-[1600px] px-4 py-4 sm:px-6">
  <div class="space-y-6">
    {@render strip('★', 'text-mauve', $t.home.featured, featured, '', true)}
    {@render strip('▹', 'text-reef-400', $t.home.upcomingDives, dives, '/calendar', false)}
    {@render strip('▹', 'text-reef-400', $t.home.upcomingCourses, courses, '/courses', false)}
  </div>
</section>

<!-- Explore our Services -->
<section class="mx-auto max-w-[1600px] px-4 py-12 sm:px-6 sm:py-16">
  <div class="mx-auto max-w-3xl text-center">
    <h2 class="text-3xl font-bold tracking-tight text-white">{$t.home.exploreServices}</h2>
    <p class="mt-3 text-brand-100">{$t.home.exploreServicesIntro}</p>
  </div>

  <div class="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
    {#each serviceLinks as s, i}
      <a
        href={s.href}
        class="group relative flex aspect-square flex-col justify-end overflow-hidden rounded-3xl border border-white/15 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-reef-400/60 hover:shadow-[0_0_30px_-8px_rgba(44,208,197,0.6)]"
      >
        <Photo
          image={s.image}
          alt=""
          class="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div
          class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"
        ></div>
        <div class="relative z-10 p-6 sm:p-7">
          <h3 class="text-lg font-bold text-white">{$t.home.services[i].title}</h3>
          <p class="mt-1 line-clamp-3 text-sm text-white/85">{$t.home.services[i].desc}</p>
        </div>
      </a>
    {/each}
  </div>

  <div class="mt-10 text-center">
    <a
      href="#get-in-touch"
      class="mono rounded-full bg-reef-400 px-6 py-3 font-semibold text-brand-950 shadow-[0_0_24px_-6px_rgba(44,208,197,0.8)] transition-colors hover:bg-reef-300"
    >
      {$t.common.contactUs}
    </a>
  </div>
</section>

<!-- Diving in Taiwan — text wrapped by a sticky photo mosaic + a reef-life rail -->
<section class="mx-auto max-w-[1600px] px-4 py-12 sm:px-6 sm:py-16">
  <div class="grid gap-8 lg:grid-cols-12 lg:items-start">
    <div class="lg:col-span-7">
      <h2 class="text-3xl font-bold tracking-tight text-white">{$t.home.divingTitle}</h2>
      <div class="mt-6 space-y-5 text-brand-100">
        {#each $t.home.divingParas as para}
          <p>{para}</p>
        {/each}
      </div>
    </div>

    <!-- Divers-in-the-blue mosaic, sticks alongside the copy on desktop -->
    <div class="lg:col-span-5 lg:sticky lg:top-24">
      <div class="grid grid-cols-2 gap-3">
        <figure
          class="group col-span-2 aspect-[16/10] overflow-hidden rounded-3xl border border-white/10 shadow-sm"
        >
          <Photo
            image={diveScenes[0]}
            alt=""
            sizes={SIZES.card}
            class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </figure>
        {#each diveScenes.slice(1) as image}
          <figure
            class="group aspect-square overflow-hidden rounded-2xl border border-white/10 shadow-sm"
          >
            <Photo
              {image}
              alt=""
              sizes={SIZES.tile}
              class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </figure>
        {/each}
      </div>
    </div>
  </div>

  <!-- A glimpse of the reef life beneath the waves -->
  <div class="mt-8 grid grid-cols-3 gap-3 sm:mt-10 sm:grid-cols-6">
    {#each marineLife as image}
      <figure
        class="group aspect-square overflow-hidden rounded-2xl border border-white/10 shadow-sm"
      >
        <Photo
          {image}
          alt=""
          sizes={SIZES.tile}
          class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 group-hover:brightness-105"
        />
      </figure>
    {/each}
  </div>
</section>

<!-- Get In Touch -->
<GetInTouch />

<!-- Brand taglines -->
<section>
  <div
    class="mx-auto flex max-w-[1600px] flex-col items-center gap-1 px-4 py-12 text-center sm:px-6 sm:py-14"
  >
    <p class="text-2xl font-bold text-white sm:text-3xl">{$t.home.taglineMain}</p>
    <p class="text-lg font-light text-reef-100">{$t.home.taglineSub}</p>
  </div>
</section>

<EventModal event={selected} onClose={() => (selected = null)} />
