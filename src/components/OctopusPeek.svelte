<script lang="ts">
  import { onMount } from 'svelte'
  import { t } from '$engine/i18n'

  // A cute octopus that peeks out from behind the nav logo every so often to
  // nudge visitors toward the build-your-own-trip page. Auto-pops on a gentle
  // cadence, is dismissible for the session, and stays put for anyone who prefers
  // reduced motion. Mounted inside Nav's header (see Nav.svelte), positioned to
  // slide down from behind the logo.

  let peeking = $state(false)
  let dismissed = $state(false)

  onMount(() => {
    try {
      if (sessionStorage.getItem('octopus-dismissed')) {
        dismissed = true
        return
      }
    } catch {
      /* sessionStorage may be unavailable — carry on */
    }
    // Respect reduced-motion: don't auto-animate the peek.
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return

    let hideTimer: ReturnType<typeof setTimeout>
    const show = () => {
      if (dismissed) return
      peeking = true
      hideTimer = setTimeout(() => (peeking = false), 7000)
    }
    // First appears quickly (within ~2s of load), then on a gentle loop.
    const first = setTimeout(show, 1000)
    const loop = setInterval(show, 42000)
    return () => {
      clearTimeout(first)
      clearTimeout(hideTimer)
      clearInterval(loop)
    }
  })

  function dismiss() {
    peeking = false
    dismissed = true
    try {
      sessionStorage.setItem('octopus-dismissed', '1')
    } catch {
      /* ignore */
    }
  }
</script>

{#if !dismissed}
  <div class="pointer-events-none absolute left-2 top-full z-10 flex items-start gap-2 sm:left-4">
    <!-- Octopus: slides down from behind the logo when peeking -->
    <div
      class={`origin-top transition-all duration-700 ease-out ${peeking ? 'translate-y-0 rotate-0 opacity-100' : '-translate-y-[135%] -rotate-6 opacity-0'}`}
    >
      <svg
        width="66"
        height="66"
        viewBox="0 0 120 120"
        aria-hidden="true"
        class="drop-shadow-[0_4px_8px_rgba(0,0,0,0.4)]"
      >
        <!-- tentacles -->
        <g fill="#f472a0">
          <path d="M30 74c-8 6-12 18-8 30 4-2 7-6 9-12 1 8 0 16-3 22 5-1 9-6 10-14 2-10-2-20-8-26z" />
          <path d="M46 82c-4 8-4 22 0 32 3-3 5-8 5-15 2 6 2 14 0 20 4-3 6-10 5-18-1-9-6-16-15-19z" />
          <path d="M90 74c8 6 12 18 8 30-4-2-7-6-9-12-1 8 0 16 3 22-5-1-9-6-10-14-2-10 2-20 8-26z" />
          <path d="M74 82c4 8 4 22 0 32-3-3-5-8-5-15-2 6-2 14 0 20-4-3-6-10-5-18 1-9 6-16 15-19z" />
          <path d="M60 84c-3 10-3 24 0 32 3-8 3-22 0-32z" />
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

    <!-- Speech bubble -->
    {#if peeking}
      <div
        class="pointer-events-auto relative mt-3 flex items-start gap-2 rounded-2xl border border-reef-400/40 bg-brand-950/95 px-3 py-2 shadow-lg backdrop-blur"
      >
        <a href="/build-trip" class="group block">
          <p class="text-xs text-brand-100">{$t.octopus.prompt}</p>
          <p class="text-sm font-bold text-reef-200 group-hover:text-reef-100">
            {$t.octopus.cta} →
          </p>
        </a>
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
