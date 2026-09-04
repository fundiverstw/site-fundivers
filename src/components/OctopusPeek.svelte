<script lang="ts">
  import { onMount } from 'svelte'
  import { fade } from 'svelte/transition'
  import { t } from '$engine/i18n'
  import { formatSpan } from '$engine/format'
  import Davey from './Davey.svelte'

  // A cute octopus who slides out from behind the nav logo every so often and
  // works through a short list of things worth clicking. Dismissible for the
  // session, and stays put for anyone who prefers reduced motion. Mounted
  // inside Nav's header (see Nav.svelte).
  //
  // ── Where he sits ──────────────────────────────────────────────────────────
  //
  // He comes out of the logo's *right edge*, and he is mounted in a wrapper
  // that is exactly the logo (Nav.svelte), so `left-full` is that edge — no
  // arithmetic, and nothing to re-derive when the logo is resized or when a
  // longer slogan in another language shifts it sideways. The one measured
  // number left is the tuck: a negative margin pulling him back over the logo
  // by about a third of his width, so he emerges from under it rather than
  // standing beside it. Two-thirds of him stay in the open, which is what makes
  // him read as an octopus at a glance rather than a pink smudge at the edge of
  // the wordmark.
  //
  // `w-max` on that wrapper is load-bearing. An absolutely positioned box is
  // sized against its containing block, and the containing block here is the
  // logo — with `left-full` there is nothing left of it, so the bubble folded
  // itself into a one-word-per-line column. Sizing to the content instead lets
  // it run out over the page, which is where it has room.
  //
  // The tuck is real, not a trick of the timing: the octopus sits at `-z-10`,
  // so it paints beneath the logo image. Negative z-index resolves against the
  // nearest stacking context — the `relative z-30` on Nav's <header> — landing
  // below the header's inline content while staying above its (transparent)
  // background. The wrapper deliberately has no z-index of its own, because
  // giving it one would create a stacking context the speech bubble could not
  // then climb out of.

  // ── Desktop only ───────────────────────────────────────────────────────────
  //
  // He is drawn to come out of the logo's right edge, and that edge only has
  // room beside it in the desktop bar. Below xl (1280px) Nav switches to the
  // hamburger layout, the logo moves, and there is nothing to his right but the
  // globe, the radio button and the menu button — so the bubble drops below the
  // header instead and lands on top of whatever the page opens with. This
  // matches Nav's own breakpoint rather than picking a new one, so the mascot
  // and the layout he was positioned against always agree.
  //
  // The query is live, not read once, so dragging a window across the boundary
  // does the right thing in both directions.
  const DESKTOP = '(min-width: 1280px)'
  let isDesktop = $state(false)

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
      { prompt: o.news.prompt, cta: o.news.cta, href: '/logbook' },
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

  /** Whether the one-off events fetch has been kicked off. Crossing the
   *  breakpoint twice should not fetch twice. */
  let fetched = false

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

    /**
     * Start him up, or pack him away, as the viewport crosses `DESKTOP`.
     *
     * Narrow means nothing runs: no timers, and no fetch either — which is the
     * point of gating here rather than hiding him in CSS. A `hidden xl:block`
     * would still mount the component on every phone, still set four timers
     * going, and still pull `$engine/events` and the Supabase client into the
     * page to fill in a bubble nobody can see.
     */
    const apply = (desktop: boolean) => {
      isDesktop = desktop
      if (!desktop) {
        peeking = false
        clearTimeout(firstTimer)
        clearTimeout(restTimer)
        stopSlides()
        return
      }
      if (prefersReducedMotion) {
        peeking = true
        return
      }
      if (!fetched) {
        fetched = true
        void loadNextFeatured()
      }
      clearTimeout(firstTimer)
      firstTimer = setTimeout(show, FIRST_MS)
    }

    const mql = window.matchMedia?.(DESKTOP)
    const onChange = (e: MediaQueryListEvent) => apply(e.matches)
    mql?.addEventListener('change', onChange)
    // No matchMedia at all (a very old browser, or a test double): assume the
    // desktop he was drawn for rather than removing him for everybody.
    apply(mql?.matches ?? true)

    return () => {
      mql?.removeEventListener('change', onChange)
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

{#if !dismissed && isDesktop}
  <div
    class="pointer-events-none absolute left-full top-1/2 -ml-[22px] flex w-max -translate-y-1/2 items-center gap-2"
  >
    <!-- Octopus: slides out sideways from behind the logo when peeking -->
    <div
      class={`relative -z-10 origin-left transition-all duration-700 ease-out motion-reduce:transition-none ${peeking ? 'translate-x-0 rotate-0 opacity-100' : '-translate-x-[135%] -rotate-12 opacity-0'}`}
    >
      <!-- The header is full of other decorative svg (the globe, the radio
           button, the menu icon), so he carries a test id: "is there an
           octopus" is otherwise indistinguishable from "is there an icon". -->
      <!-- The art is Davey.svelte, shared with the footer easter egg and the
           arcade. The test id is here rather than on the drawing: the footer
           has a second Davey on every page, and a test asking whether the
           mascot is out has to mean this one. -->
      <span data-testid="octopus" class="block">
        <Davey size={66} />
      </span>
    </div>

    <!-- Speech bubble. Keyed on the pitch, so each one fades in as its turn
         comes round rather than the words swapping under the reader. -->
    {#if peeking}
      <div
        class="pointer-events-auto relative flex max-w-[18rem] items-start gap-2 rounded-2xl border border-reef-400/40 bg-brand-950/95 px-3 py-2 shadow-lg backdrop-blur"
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
            <p class="text-t4 text-brand-100">{current.prompt}</p>
            <p class="text-t3 font-bold text-reef-200 group-hover:text-reef-100">
              {current.cta} →
            </p>
            {#if current.detail}
              <p class="mono text-t4 text-brand-300">{current.detail}</p>
            {/if}
          </a>
        {/key}
        <button
          type="button"
          onclick={dismiss}
          aria-label={$t.octopus.dismiss}
          class="shrink-0 text-t4 leading-none text-brand-400 hover:text-white"
        >
          ✕
        </button>
      </div>
    {/if}
  </div>
{/if}
