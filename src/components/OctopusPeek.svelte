<script lang="ts">
  import { onMount } from 'svelte'
  import { fade } from 'svelte/transition'
  import { t } from '$engine/i18n'
  import { formatSpan } from '$engine/format'

  // A cute octopus who slides out from behind the nav logo every so often and
  // works through a short list of things worth clicking. Dismissible for the
  // session, and stays put for anyone who prefers reduced motion. Mounted
  // inside Nav's header (see Nav.svelte).
  //
  // ── Where he sits ──────────────────────────────────────────────────────────
  //
  // He comes out of the logo's *right edge*, which is why the offsets below are
  // pixel values rather than something tidier: they track where that edge
  // actually is. The logo is 634×320, so its width is its height × 1.98 — 64px
  // tall below xl and 96px above it (Nav.svelte) — giving a right edge at
  // 16+127, 24+127 and 24+190 as the container padding goes 4→6. Each `left`
  // here stops 20–35px short of that, so a third of him is behind the logo and
  // he emerges from under it rather than standing beside it. The numbers were
  // set by looking: the logo file carries transparent padding, so its box ends
  // further right than its artwork does, and arithmetic alone put him in a
  // visible gap.
  //
  // The tuck is real, not a trick of the timing: the octopus sits at `-z-10`,
  // so it paints beneath the logo image. Negative z-index resolves against the
  // nearest stacking context — the `relative z-30` on Nav's <header> — landing
  // below the header's inline content while staying above its (transparent)
  // background. The wrapper deliberately has no z-index of its own, because
  // giving it one would create a stacking context the speech bubble could not
  // then climb out of.

  // Below sm the bubble drops beneath the header, which is exactly where the
  // hamburger menu opens. Somebody who has just opened the menu is trying to go
  // somewhere, and a promo sitting on top of the first link swallows the tap —
  // silently, because the bubble is transparent enough to read through. So Nav
  // tells us when the menu is open and the octopus stands down.
  let { menuOpen = false }: { menuOpen?: boolean } = $props()

  /** One thing the octopus has to say. */
  type Pitch = { prompt: string; cta: string; href: string; detail?: string }

  /** How long each line stays up before he moves on to the next. */
  const SLIDE_MS = 4000
  /** After the page settles, before he first appears. */
  const FIRST_MS = 1000
  /**
   * How long he stays hidden, measured from the moment he ducks back — not
   * from page load.
   *
   * That distinction is the whole reason this is a timeout rather than an
   * interval. A repeating timer would fire on its own schedule regardless of
   * where he was in his run, and since a full run (four pitches at SLIDE_MS
   * each) lasts longer than this gap, it would restart him at the first pitch
   * before he ever reached the last one — an endless loop of the opening two,
   * and he would never go away at all.
   */
  const REST_MS = 10000

  let peeking = $state(false)
  let dismissed = $state(false)
  let slide = $state(0)
  let nextEvent = $state<{ title: string; when: string } | null>(null)
  let prefersReducedMotion = $state(false)

  // The rotation. The featured event is only in the list once we have one, so
  // a quiet calendar (or a failed fetch) shortens the run rather than showing
  // an empty bubble.
  let pitches = $derived.by<Pitch[]>(() => {
    const o = $t.octopus
    return [
      { prompt: o.trip.prompt, cta: o.trip.cta, href: '/build-trip' },
      { prompt: o.news.prompt, cta: o.news.cta, href: '/news' },
      ...(nextEvent
        ? [
            {
              prompt: o.event.prompt,
              cta: nextEvent.title,
              detail: nextEvent.when,
              href: '/calendar',
            },
          ]
        : []),
      { prompt: o.fundive.prompt, cta: o.fundive.cta, href: '/fundive' },
    ]
  })

  let current = $derived(pitches[Math.min(slide, pitches.length - 1)])

  /**
   * The next featured event, loaded on demand.
   *
   * `$engine/events` pulls in the Supabase client, and this component is in the
   * nav — on every page. A static import would therefore put the database
   * library into the bundle of pages that never touch the database (the photo
   * gallery, the team page), which is the one thing the code-splitting in
   * App.svelte exists to avoid. Importing it here, after the page is
   * interactive, keeps that property: nothing is fetched until the octopus
   * actually has reason to speak, and never at all for someone who dismissed
   * him or asked for reduced motion.
   */
  async function loadNextFeatured(): Promise<void> {
    try {
      const { fetchUpcomingEvents } = await import('$engine/events')
      const events = await fetchUpcomingEvents(20)
      const ev = events.find((e) => e.featured)
      if (ev) nextEvent = { title: ev.title, when: formatSpan(ev.startDate, ev.endDate, ev.time) }
    } catch {
      // No featured event to show. He has three other things to say.
    }
  }

  let slideTimer: ReturnType<typeof setInterval> | undefined
  let firstTimer: ReturnType<typeof setTimeout> | undefined
  let restTimer: ReturnType<typeof setTimeout> | undefined

  function stopSlides(): void {
    clearInterval(slideTimer)
    slideTimer = undefined
  }

  onMount(() => {
    try {
      if (sessionStorage.getItem('octopus-dismissed')) {
        dismissed = true
        return
      }
    } catch {
      /* sessionStorage may be unavailable — carry on */
    }
    // Reduced motion means "don't move", not "don't tell me". Sliding out and
    // rotating on a timer are both motion, so neither happens — but he still
    // appears, holding the first pitch, and stays there until dismissed. The
    // slide-out transition is disabled in the markup with `motion-reduce:`, so
    // he is simply present rather than arriving.
    prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
    if (prefersReducedMotion) {
      peeking = true
      return
    }

    void loadNextFeatured()

    const show = () => {
      if (dismissed) return
      clearTimeout(restTimer)
      slide = 0
      peeking = true
      stopSlides()
      slideTimer = setInterval(() => {
        // Past the last pitch: duck back behind the logo, then queue the next
        // appearance from here, so the gap is a real rest rather than whatever
        // is left of a fixed cycle.
        if (slide + 1 >= pitches.length) {
          peeking = false
          stopSlides()
          restTimer = setTimeout(show, REST_MS)
        } else {
          slide += 1
        }
      }, SLIDE_MS)
    }

    firstTimer = setTimeout(show, FIRST_MS)
    return () => {
      clearTimeout(firstTimer)
      clearTimeout(restTimer)
      stopSlides()
    }
  })

  function dismiss() {
    peeking = false
    dismissed = true
    stopSlides()
    clearTimeout(restTimer)
    try {
      sessionStorage.setItem('octopus-dismissed', '1')
    } catch {
      /* ignore */
    }
  }
</script>

{#if !dismissed && !menuOpen}
  <div
    class="pointer-events-none absolute left-[109px] top-[11px] flex flex-col items-start gap-1 sm:left-[117px] sm:flex-row sm:items-center sm:gap-2 xl:left-[193px] xl:top-[27px]"
  >
    <!-- Octopus: slides out sideways from behind the logo when peeking -->
    <div
      class={`relative -z-10 origin-left transition-all duration-700 ease-out motion-reduce:transition-none ${peeking ? 'translate-x-0 rotate-0 opacity-100' : '-translate-x-[135%] -rotate-12 opacity-0'}`}
    >
      <svg
        width="66"
        height="66"
        viewBox="0 0 120 120"
        aria-hidden="true"
        class="drop-shadow-[0_4px_8px_rgba(0,0,0,0.4)]"
      >
        <!-- Arms. Eight of them, and each path is a *swept outline*: a centre
             line with a width that starts wide where the arm meets the body and
             narrows to a rounded tip. That taper is the whole difference between
             reading as an octopus and reading as a jellyfish, and it is why
             these are long strings of small segments rather than a handful of
             round numbers — they are the two edges of a stroke, not a shape
             anybody drew point by point.
             To reshape an arm, move it as a whole (or regenerate the sweep);
             nudging an individual coordinate will just dent one edge.
             The back pair is a shade darker so the front arms sit in front of
             them instead of merging into one pink mass. -->
        <g fill="#e2618f">
          <path
            d="M40 59C39 59 36 59 34 60C31 60 30 61 28 62C26 63 24 64 23 65C21 66 20 67 19 69C17 70 16 72 15 73C14 75 14 76 13 78C13 80 12 82 12 84C12 86 11 89 11 90A1.6 1.6 0 0 1 15 90C15 89 15 86 16 85C16 83 17 82 18 80C18 79 19 77 20 76C21 75 22 74 23 73C24 73 25 72 27 71C28 71 29 70 31 70C32 69 33 69 35 69C37 69 39 69 40 69Z"
          />
          <path
            d="M80 69C81 69 83 69 85 69C87 69 88 69 89 70C91 70 92 71 93 71C95 72 96 73 97 73C98 74 99 75 100 76C101 77 102 79 102 80C103 82 104 83 104 85C105 86 105 89 105 90A1.6 1.6 0 0 1 109 90C109 89 108 86 108 84C108 82 107 80 107 78C106 76 106 75 105 73C104 72 103 70 101 69C100 67 99 66 97 65C96 64 94 63 92 62C90 61 89 60 86 60C84 59 81 59 80 59Z"
          />
        </g>
        <g fill="#f472a0">
          <!-- outer pair: the long sweep, tip turning under -->
          <path
            d="M42 61C41 61 37 63 35 64C32 65 30 67 28 68C26 70 25 72 23 74C22 76 20 78 19 80C18 82 17 84 16 87C15 89 14 91 13 94C13 96 12 98 12 101C11 103 11 106 10 108A1.6 1.6 0 0 1 14 108C14 107 15 104 16 102C17 100 18 98 19 96C20 94 21 92 23 90C24 89 25 87 27 85C28 84 29 83 31 81C32 80 34 79 36 78C37 78 39 77 40 76C42 76 45 75 46 75Z"
          />
          <path
            d="M74 75C75 75 78 76 80 76C81 77 83 78 84 78C86 79 88 80 89 81C91 83 92 84 93 85C95 87 96 89 97 90C99 92 100 94 101 96C102 98 103 100 104 102C105 104 106 107 106 108A1.6 1.6 0 0 1 110 108C109 106 109 103 108 101C108 98 107 96 107 94C106 91 105 89 104 87C103 84 102 82 101 80C100 78 98 76 97 74C95 72 94 70 92 68C90 67 88 65 85 64C83 63 79 61 78 61Z"
          />
          <!-- middle pair -->
          <path
            d="M45 71C44 72 41 75 40 77C38 78 37 80 36 82C34 84 33 86 32 88C32 90 31 92 30 94C30 96 30 98 29 100C29 102 29 104 30 106C30 108 31 110 32 111C32 113 34 115 35 116A1.6 1.6 0 0 1 37 114C37 113 36 111 36 110C36 109 35 107 36 106C36 104 36 103 36 102C37 100 37 99 38 97C39 96 40 94 41 93C42 92 43 90 44 89C46 87 47 86 48 85C50 83 52 82 53 81Z"
          />
          <path
            d="M67 81C68 82 70 83 72 85C73 86 74 87 76 89C77 90 78 92 79 93C80 94 81 96 82 97C83 99 83 100 84 102C84 103 84 104 84 106C85 107 84 109 84 110C84 111 83 113 83 114A1.6 1.6 0 0 1 85 116C86 115 88 113 88 111C89 110 90 108 90 106C91 104 91 102 91 100C90 98 90 96 90 94C89 92 88 90 88 88C87 86 86 84 84 82C83 80 82 78 80 77C79 75 76 72 75 71Z"
          />
          <!-- inner pair: shorter, tucked between the others -->
          <path
            d="M49 80C49 81 48 84 47 86C47 88 46 89 46 91C46 93 46 95 46 97C45 99 46 100 46 102C46 104 46 105 47 107C47 108 48 110 49 111C49 113 50 114 51 115C53 116 55 117 55 117A1.6 1.6 0 0 1 57 115C57 114 55 113 55 112C54 111 54 110 53 109C53 108 53 107 53 106C53 104 53 103 53 102C53 101 53 99 54 98C54 96 54 95 55 93C55 92 56 90 57 89C57 87 59 85 59 84Z"
          />
          <path
            d="M61 84C61 85 63 87 63 89C64 90 65 92 65 93C66 95 66 96 66 98C67 99 67 101 67 102C67 103 67 104 67 106C67 107 67 108 67 109C66 110 66 111 65 112C65 113 63 114 63 115A1.6 1.6 0 0 1 65 117C65 117 67 116 69 115C70 114 71 113 71 111C72 110 73 108 73 107C74 105 74 104 74 102C74 100 75 99 74 97C74 95 74 93 74 91C74 89 73 88 73 86C72 84 71 81 71 80Z"
          />
        </g>
        <!-- Suckers, down the inside of each front arm. Small, and the one
             detail that stops the arms reading as legs. -->
        <g fill="#ffd6e8" opacity=".8">
          <circle cx="24" cy="81" r="1.7" />
          <circle cx="96" cy="81" r="1.7" />
          <circle cx="18" cy="90" r="1.5" />
          <circle cx="102" cy="90" r="1.5" />
          <circle cx="14" cy="100" r="1.2" />
          <circle cx="106" cy="100" r="1.2" />
          <circle cx="35" cy="94" r="1.7" />
          <circle cx="85" cy="94" r="1.7" />
          <circle cx="33" cy="102" r="1.5" />
          <circle cx="87" cy="102" r="1.5" />
          <circle cx="33" cy="110" r="1.2" />
          <circle cx="87" cy="110" r="1.2" />
          <circle cx="49" cy="100" r="1.7" />
          <circle cx="71" cy="100" r="1.7" />
          <circle cx="50" cy="107" r="1.5" />
          <circle cx="70" cy="107" r="1.5" />
          <circle cx="53" cy="113" r="1.2" />
          <circle cx="67" cy="113" r="1.2" />
        </g>
        <!-- head / mantle -->
        <ellipse cx="60" cy="54" rx="36" ry="34" fill="#fb7fb0" />
        <ellipse cx="60" cy="40" rx="24" ry="16" fill="#ffa0c4" opacity=".7" />
        <!-- eyes -->
        <circle cx="47" cy="52" r="10" fill="#fff" />
        <circle cx="73" cy="52" r="10" fill="#fff" />
        <circle cx="49" cy="54" r="5" fill="#33314a" />
        <circle cx="75" cy="54" r="5" fill="#33314a" />
        <circle cx="47.5" cy="52" r="1.8" fill="#fff" />
        <circle cx="73.5" cy="52" r="1.8" fill="#fff" />
        <!-- blush -->
        <circle cx="38" cy="64" r="5" fill="#f76ba0" opacity=".55" />
        <circle cx="82" cy="64" r="5" fill="#f76ba0" opacity=".55" />
        <!-- smile -->
        <path
          d="M52 68q8 7 16 0"
          fill="none"
          stroke="#33314a"
          stroke-width="2.6"
          stroke-linecap="round"
        />
      </svg>
    </div>

    <!-- Speech bubble. Keyed on the pitch, so each one fades in as its turn
         comes round rather than the words swapping under the reader.
         Below sm it drops underneath the octopus and slides back to the page
         margin: a phone's header already has the globe, the radio and the menu
         button along its right-hand side, and a bubble beside the logo lands on
         top of all three. -->
    {#if peeking}
      <div
        class="pointer-events-auto relative -ml-[93px] flex max-w-[15rem] items-start gap-2 rounded-2xl border border-reef-400/40 bg-brand-950/95 px-3 py-2 shadow-lg backdrop-blur sm:ml-0 sm:max-w-none"
      >
        {#key current.href}
          <!-- The nav links to several of these same addresses, so the tests
               need a hook that is the bubble and not the bar. -->
          <a
            href={current.href}
            data-testid="octopus-pitch"
            class="group block"
            in:fade={{ duration: prefersReducedMotion ? 0 : 200 }}
          >
            <p class="text-xs text-brand-100">{current.prompt}</p>
            <p class="text-sm font-bold text-reef-200 group-hover:text-reef-100">
              {current.cta} →
            </p>
            {#if current.detail}
              <p class="mono text-[11px] text-brand-300">{current.detail}</p>
            {/if}
          </a>
        {/key}
        <button
          type="button"
          onclick={dismiss}
          aria-label={$t.octopus.dismiss}
          class="shrink-0 text-xs leading-none text-brand-400 hover:text-white"
        >
          ✕
        </button>
      </div>
    {/if}
  </div>
{/if}
