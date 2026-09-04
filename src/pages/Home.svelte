<script lang="ts">
  import { fetchUpcomingEvents, type UpcomingEvent, type ModalEvent } from '$engine/events'
  import { formatSpan, twd } from '$engine/format'
  import { NEWS } from '$content/news'
  import { newsText } from '$engine/i18n-content'
  import GetInTouch from '$components/GetInTouch.svelte'
  import EventModal from '$components/calendar/EventModal.svelte'
  import { t, locale } from '$engine/i18n'
  import CoverPhoto from '$components/CoverPhoto.svelte'
  import CalendarIcon from '$components/icons/CalendarIcon.svelte'
  import MapPinIcon from '$components/icons/MapPinIcon.svelte'
  import MapIcon from '$components/icons/MapIcon.svelte'
  import ParasolIcon from '$components/icons/ParasolIcon.svelte'
  import PlusSquareIcon from '$components/icons/PlusSquareIcon.svelte'

  // The landing page is three bands, one per kind of visitor, and on a desktop
  // all three are on the first screen — 25% / 50% / 25% of what is left under
  // the nav and the catch-phrase:
  //
  //   A  someone who has never dived   the certification ladder, and three ways
  //                                    to look around before committing
  //   B  a certified diver             what is actually on the schedule, beside
  //                                    what the shop has been up to
  //   C  a diver who plans their own   the calendar, the sites, the map
  //
  // B is twice either of the others because it is the shop's main custom: the
  // people who already dive and want to know where the boat is going.
  //
  // On a phone the proportions are dropped and the bands simply stack. Three
  // bands of meaningful content cannot fit one small screen, and squeezing them
  // would leave all three unreadable rather than one of them off-screen.

  let upcoming = $state<UpcomingEvent[]>([])
  let loading = $state(true)
  let selected = $state<ModalEvent | null>(null)

  // The last band sits just below the fold on a short screen, so show a scroll
  // hint until the reader moves off the top of the page.
  let atTop = $state(true)
  $effect(() => {
    const onScroll = () => (atTop = window.scrollY < 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  })

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

  // Band B is dives, trips and adventures — everything except courses, which
  // belong to band A and have a page of their own. A multi-day dive trip is a
  // dive with a flag on it, not its own kind, so it is already in here.
  // Featured first, then whatever is soonest; six is what two rows hold.
  let events = $derived(
    upcoming
      .filter((e) => e.type !== 'course')
      .slice()
      .sort((a, b) => Number(b.featured) - Number(a.featured))
      .slice(0, 6),
  )

  // The rungs, in order. Structural only — the labels and the one-line notes are
  // $t.home.startLadder, matched by position, so the ladder can be reworded or
  // translated without touching this file.
  const LADDER = [
    { href: '/courses/padi-open-water-course' },
    { href: '/courses/padi-advanced-course' },
    { href: '/courses/padi-rescue-diver-course' },
    { href: '/courses/padi-divemaster-course' },
  ]

  // The rail beside band B. Community is the section aimed at people who
  // already dive, so it sits with their events rather than in a band of its own.
  let rail = $derived([
    { href: '/logbook', label: $t.nav.news, note: $t.home.noteSurfaceInterval },
    { href: '/radio', label: $t.nav.radio, note: $t.home.noteRadio },
    { href: '/reputation', label: $t.nav.reputation, note: $t.home.noteReputation },
  ])

  // Band C: the Go Diving section, which is what someone planning their own
  // diving actually needs. Titles come from that section's own copy, so the
  // band and the hub can never describe the same page differently.
  //
  // The icons are the booking app's own, so a diver who uses both sees the same
  // glyph for the same idea (see $components/icons/README.md). Decorative: each
  // one repeats the label beside it, so they are aria-hidden and nothing is
  // said twice to a screen reader.
  let plan = $derived([
    {
      href: '/calendar',
      icon: CalendarIcon,
      label: $t.goDiving.calendarTitle,
      note: $t.goDiving.calendarDesc,
    },
    {
      href: '/sites',
      icon: MapPinIcon,
      label: $t.goDiving.sitesTitle,
      note: $t.goDiving.sitesDesc,
    },
    { href: '/map', icon: MapIcon, label: $t.goDiving.mapTitle, note: $t.goDiving.mapDesc },
    {
      href: '/travel',
      icon: ParasolIcon,
      label: $t.goDiving.travelTitle,
      note: $t.goDiving.travelDesc,
    },
    {
      href: '/build-trip',
      icon: PlusSquareIcon,
      label: $t.goDiving.buildTripTitle,
      note: $t.goDiving.buildTripDesc,
    },
  ])

  // The newest The Logbook post's headline, shown on its rail row when
  // there is one — a date-stamped line is a better reason to click than a
  // category name. Falls back to the note when the feed is empty.
  let latestPost = $derived(NEWS[0] ? newsText(NEWS[0].slug, $locale).title : null)
</script>

<!-- One upcoming event. On a phone it keeps a 16/10 aspect so it has height in
     the natural stack; from `lg` up it drops the aspect and fills its grid cell,
     so two rows pack six tiles into whatever height the band was given. -->
{#snippet eventTile(ev: UpcomingEvent)}
  {@const price = twd(ev.startingAt)}
  <button
    type="button"
    onclick={() => open(ev)}
    class="group relative block aspect-[16/10] w-full overflow-hidden rounded-xl border border-white/15 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-reef-400/60 hover:shadow-[0_0_20px_-6px_rgba(44,208,197,0.65)] lg:aspect-auto lg:h-full"
  >
    <CoverPhoto src={ev.image} />
    <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent"></div>
    <div class="absolute inset-x-0 bottom-0 px-2.5 pb-2 pt-4">
      {#if ev.featured}
        <span
          class="mono rounded bg-mauve/25 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-mauve"
          >{$t.common.featured}</span
        >
      {/if}
      {#if ev.fullyBooked}
        <span
          class="rounded bg-amber-400/25 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-200"
          >{$t.common.waitlist}</span
        >
      {/if}
      <h3 class="line-clamp-1 text-sm font-bold leading-tight text-white lg:text-base">
        {ev.title}
      </h3>
      <p class="mono truncate text-xs text-sky-300">
        {formatSpan(ev.startDate, ev.endDate, ev.time)}
      </p>
      {#if price}<p class="mono text-xs font-bold text-peach">
          {$t.common.fromPrice.replace('{price}', price)}
        </p>{/if}
    </div>
  </button>
{/snippet}

<section
  class="mx-auto flex max-w-[1600px] flex-col px-4 py-2 sm:px-6 lg:h-[calc(100svh-6rem)] lg:overflow-hidden xl:h-[calc(100svh-8rem)]"
>
  <!-- The slogan is under the logo now, on every page, so printing it again
       here would be the same words twice on one screen. The page still needs a
       heading of its own, though: without one the document starts at <h2> and a
       screen reader's outline has no root. So it is here and unseen — `sr-only`
       clips it rather than hiding it, which keeps it in the accessibility tree
       where display:none would not. -->
  <h1 class="sr-only">FunDivers TW — {$t.nav.slogan}</h1>

  <!-- `flex-[1] / flex-[2] / flex-[1]` over a `min-h-0` column is what makes the
       25 / 50 / 25 real: the three bands divide the leftover height between
       them rather than each being told a percentage that stops adding up the
       moment the nav or the catch-phrase changes size. -->
  <div class="flex flex-col gap-2.5 lg:min-h-0 lg:flex-1">
    <!-- ── A · Start diving ─────────────────────────────────────────────── -->
    <!-- The heading blocks below are <div>, not <header>. A sectioning header
         would be valid HTML and would gain almost nothing — the <h2> already
         carries the structure — while quietly widening every `header …`
         selector in the suite, which is how the browser tests find the site's
         own header. One <header> per document is a rule worth keeping here. -->
    <section
      data-band="start"
      class="flex min-h-0 flex-col rounded-2xl border border-green/60 bg-green/20 px-3 py-2 lg:flex-[1]"
    >
      <div class="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <div>
          <h2 class="text-lg font-bold text-green lg:text-xl">{$t.home.startTitle}</h2>
          <p class="text-sm text-brand-100">{$t.home.startText}</p>
        </div>
        <nav
          class="mono flex flex-wrap gap-x-4 gap-y-1 text-xs font-semibold text-green lg:text-sm"
        >
          <a class="hover:text-white" href="/sealife">{$t.home.seeLife} →</a>
          <a class="hover:text-white" href="/map">{$t.home.whereWeDive} →</a>
          <a class="hover:text-white" href="/about">{$t.home.whoWeAre} →</a>
        </nav>
      </div>

      <!-- The ladder. A real progression, so it is an ordered list with a rail
           drawn behind the markers; the rail stops at the first and last marker
           rather than running off both ends, which would imply rungs that are
           not there. Decorative, hence aria-hidden — the order is already in
           the <ol>. -->
      <!-- `content-center` rather than a stretched row: the band is a quarter of
           the screen and the ladder is three short lines, so stretching left the
           rungs pinned to the top of a mostly empty box. -->
      <ol class="relative mt-2 grid min-h-0 flex-1 grid-cols-2 content-center gap-2 sm:grid-cols-4">
        <span
          aria-hidden="true"
          class="absolute left-[12.5%] right-[12.5%] top-1/2 hidden h-px -translate-y-[calc(50%+18px)] bg-green/50 sm:block"
        ></span>
        {#each LADDER as rung, i (rung.href)}
          <li class="relative flex">
            <a
              href={rung.href}
              class="group flex flex-1 flex-col items-center rounded-xl px-1 py-1 text-center transition-colors hover:bg-white/5"
            >
              <span
                class="block h-3.5 w-3.5 shrink-0 rounded-full border-2 border-green bg-brand-950 transition-colors group-hover:bg-green"
              ></span>
              <span class="mono mt-1.5 text-sm font-bold text-white lg:text-base"
                >{$t.home.startLadder[i].label}</span
              >
              <span class="mt-0.5 line-clamp-2 text-xs leading-tight text-brand-200"
                >{$t.home.startLadder[i].note}</span
              >
            </a>
          </li>
        {/each}
      </ol>
    </section>

    <!-- ── B · What's coming up ─────────────────────────────────────────── -->
    <section
      data-band="coming"
      class="flex min-h-0 flex-col rounded-2xl border border-reef-400/60 bg-reef-400/20 px-3 py-2 lg:flex-[2]"
    >
      <div class="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <div>
          <h2 class="text-lg font-bold text-reef-300 lg:text-xl">{$t.home.comingTitle}</h2>
          <p class="text-sm text-brand-100">{$t.home.comingText}</p>
        </div>
        <a
          href="/calendar"
          class="mono text-xs font-semibold text-reef-300 hover:text-white lg:text-sm"
          >{$t.home.seeCalendar}</a
        >
      </div>

      <div class="mt-2 grid min-h-0 flex-1 gap-2.5 lg:grid-cols-[minmax(0,1fr)_14rem]">
        <div class="grid min-h-0 grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-rows-2">
          {#if loading}
            {#each Array(6) as _, i (i)}
              <div
                class="aspect-[16/10] animate-pulse rounded-xl bg-white/10 lg:aspect-auto lg:h-full"
              ></div>
            {/each}
          {:else if events.length === 0}
            <p class="col-span-full self-center text-center text-sm text-brand-200">
              {$t.common.nothingScheduled}
            </p>
          {:else}
            {#each events as ev (ev.id)}
              {@render eventTile(ev)}
            {/each}
          {/if}
        </div>

        <!-- What the shop has been up to, beside what it has planned. Community
             is the section written for people who already dive, so it keeps
             their company rather than taking a band of its own. -->
        <aside class="flex min-h-0 flex-col gap-1.5">
          <h3 class="mono text-xs uppercase tracking-widest text-reef-200">
            {$t.home.communityTitle}
          </h3>
          {#each rail as item (item.href)}
            <a
              href={item.href}
              class="group flex min-h-0 flex-1 flex-col justify-center rounded-xl border border-white/10 px-3 py-1.5 transition-colors hover:border-reef-400/60 hover:bg-white/5"
            >
              <span class="mono text-sm font-bold text-white">{item.label}</span>
              <span class="line-clamp-1 text-xs text-brand-200">
                {item.href === '/logbook' ? (latestPost ?? item.note) : item.note}
              </span>
            </a>
          {/each}
        </aside>
      </div>
    </section>

    <!-- ── C · Resources for experienced divers ──────────────────────────── -->
    <section
      data-band="plan"
      class="flex min-h-0 flex-col rounded-2xl border border-peach/60 bg-peach/20 px-3 py-2 lg:flex-[1]"
    >
      <div class="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <div>
          <h2 class="text-lg font-bold text-peach lg:text-xl">{$t.home.planTitle}</h2>
          <p class="text-sm text-brand-100">{$t.home.planText}</p>
        </div>
        <a
          href="/go-diving"
          class="mono text-xs font-semibold text-peach hover:text-white lg:text-sm"
          >{$t.nav.goDiving} →</a
        >
      </div>

      <div class="mt-2 grid min-h-0 flex-1 grid-cols-2 gap-2 sm:grid-cols-5">
        {#each plan as item (item.href)}
          <!-- Svelte 5 renders a component held in a variable directly, so the
               icon travels with its tile in `plan` rather than being matched up
               by position here. -->
          {@const Icon = item.icon}
          <a
            href={item.href}
            class="group flex min-h-0 flex-col items-center justify-center gap-1 rounded-xl border border-white/15 px-2 py-2 text-center transition-all hover:-translate-y-0.5 hover:border-peach/70 hover:bg-white/5"
          >
            <span class="text-peach/80 transition-colors group-hover:text-peach">
              <Icon size={22} />
            </span>
            <span class="mono text-sm font-bold text-white lg:text-base">{item.label}</span>
            <!-- The one line that goes when there is no room for it. Band C is a
                 quarter of the screen whatever the screen is, and on a 1280x800
                 laptop a tile of icon + label + two lines of note is taller than
                 the quarter it has — the note was being cut through the middle
                 of a word. Five labelled tiles with no notes is a worse tile and
                 a better band. -->
            <span
              class="line-clamp-2 text-xs leading-tight text-brand-200 lg:[@media(max-height:860px)]:hidden"
              >{item.note}</span
            >
          </a>
        {/each}
      </div>
    </section>

    <!-- Scroll hint: the three bands fill the screen, so Get In Touch and the
         taglines sit below the fold and a bouncing chevron says so. In the flow
         rather than fixed — a fixed one landed on top of band C's tiles the
         moment the bands were sized to reach the bottom of the screen. It fades
         when the reader leaves the top of the page, and never shows on a phone,
         where the stacked layout already scrolls. Decorative. -->
    <div
      aria-hidden="true"
      class={`pointer-events-none hidden shrink-0 justify-center transition-opacity duration-500 lg:flex ${atTop ? 'opacity-100' : 'opacity-0'}`}
    >
      <svg
        class="h-7 w-7 animate-bounce text-reef-300 drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </div>
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
