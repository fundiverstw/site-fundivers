<script lang="ts">
  import type { Snippet } from 'svelte'

  // A scroll-jacked "descent". Native page scrolling is disabled; wheel / touch
  // / keyboard input instead drives a smoothed virtual scroll that pans the
  // content (so everything stays reachable) while a water layer rises over the
  // whole viewport. A rolling wavy line marks the surface (pinned to the
  // above/below section boundary), bubbles rise below it, and the underwater
  // scene sways with scroll velocity. The whole thing is a fixed takeover (z
  // above the nav), so the water covers the entire page.
  //
  // Reduce-motion users get a plain, natively-scrolling page with no jack and
  // no water (a hijacked, eased scroll is exactly what that setting avoids).
  let { children }: { children: Snippet } = $props()

  let vp = $state<HTMLDivElement>()
  let inner = $state<HTMLDivElement>()
  let target = 0 // where the virtual scroll wants to be (px)
  let current = $state(0) // where it is now (eased toward target)
  let maxScroll = $state(0)
  let reduce = $state(false)
  // Distance (px) from the top of the content to the surface anchor — the
  // boundary between the "above" and "below" sections. Large default => dry.
  let anchorOffset = $state(1e9)
  // Scroll-velocity-driven sideways "current" sway (px), eased.
  let drift = $state(0)
  // The takeover starts below the site header so the logo/nav stay visible.
  let topOffset = $state(0)

  // Bubbles rising through the water. Hardcoded so the layout is stable.
  const bubbles = [
    { x: 8, d: 6, dur: 8, delay: 0 },
    { x: 19, d: 4, dur: 10, delay: 2.6 },
    { x: 31, d: 9, dur: 6.8, delay: 1.2 },
    { x: 43, d: 5, dur: 9, delay: 3.4 },
    { x: 55, d: 3, dur: 11, delay: 0.6 },
    { x: 64, d: 7, dur: 7.4, delay: 4.1 },
    { x: 74, d: 5, dur: 9.6, delay: 1.9 },
    { x: 85, d: 8, dur: 6.6, delay: 3 },
    { x: 93, d: 4, dur: 10.5, delay: 0.9 },
  ]

  function measure() {
    if (!inner || !vp) return
    // Keep the header uncovered: start the descent at its bottom edge.
    const header = document.querySelector('header')
    topOffset = header ? Math.max(0, header.getBoundingClientRect().bottom) : 0
    maxScroll = Math.max(0, inner.scrollHeight - vp.clientHeight)
    if (target > maxScroll) target = maxScroll
    if (current > maxScroll) current = maxScroll
    // The gap between the two sections carries [data-surface]; its offset within
    // the (translated) content is translate-invariant, so measuring the two
    // rects and subtracting gives a stable content-space offset.
    const marker = inner.querySelector('[data-surface]')
    if (marker) {
      const mr = marker.getBoundingClientRect()
      // Centre of the spacer, so the wave sits mid-gap between the sections.
      anchorOffset = mr.top + mr.height / 2 - inner.getBoundingClientRect().top
    }
  }

  $effect(() => {
    reduce =
      typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return

    const root = document.documentElement
    const prevOverflow = root.style.overflow
    root.style.overflow = 'hidden'
    // Hide the site footer while the takeover is up (it would otherwise bleed
    // through the now-transparent layer, over the ocean background).
    root.classList.add('dd-active')
    window.scrollTo(0, 0)

    const clamp = () => {
      target = Math.max(0, Math.min(maxScroll, target))
    }
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      target += e.deltaY
      clamp()
    }
    let lastY = 0
    const onTouchStart = (e: TouchEvent) => {
      lastY = e.touches[0]?.clientY ?? 0
    }
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault()
      const y = e.touches[0]?.clientY ?? lastY
      target += lastY - y
      lastY = y
      clamp()
    }
    const onKey = (e: KeyboardEvent) => {
      const page = (vp?.clientHeight ?? 600) * 0.9
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        target += 90
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        target -= 90
      } else if (e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault()
        target += page
      } else if (e.key === 'PageUp') {
        e.preventDefault()
        target -= page
      } else if (e.key === 'Home') {
        target = 0
      } else if (e.key === 'End') {
        target = maxScroll
      } else {
        return
      }
      clamp()
    }

    let rafId = 0
    let lastCurrent = 0
    let driftEase = 0
    const tick = () => {
      current += (target - current) * 0.14
      if (Math.abs(target - current) < 0.4) current = target
      // Sideways sway proportional to (and lagging behind) scroll velocity, so
      // the underwater scene sloshes as you descend and settles when you stop.
      const v = current - lastCurrent
      lastCurrent = current
      const targetDrift = Math.max(-20, Math.min(20, -v * 0.8))
      driftEase += (targetDrift - driftEase) * 0.1
      drift = driftEase
      rafId = requestAnimationFrame(tick)
    }

    measure()
    const raf0 = requestAnimationFrame(() => {
      measure()
      rafId = requestAnimationFrame(tick)
    })
    // Re-measure when the content resizes (e.g. the hero image loads in).
    const ro = new ResizeObserver(measure)
    if (inner) ro.observe(inner)
    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('touchstart', onTouchStart, { passive: false })
    window.addEventListener('touchmove', onTouchMove, { passive: false })
    window.addEventListener('keydown', onKey)
    window.addEventListener('resize', measure)
    return () => {
      cancelAnimationFrame(raf0)
      cancelAnimationFrame(rafId)
      ro.disconnect()
      root.style.overflow = prevOverflow
      root.classList.remove('dd-active')
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('resize', measure)
    }
  })

  // The surface line sits exactly at the section boundary: its viewport
  // position is the anchor's content-space offset minus how far we've scrolled.
  // Below the viewport => dry; above it => fully submerged.
  let lineTop = $derived(anchorOffset - current)
</script>

{#if reduce}
  {@render children()}
{:else}
  <div class="vp" bind:this={vp} style="top: {topOffset}px">
    <div class="inner" bind:this={inner} style="transform: translateY({-current}px)">
      {@render children()}
    </div>

    <!-- Water layer, on top of the content but click-through. The wavy line
         rides the boundary between the above/below sections; bubbles rise in the
         water; both sway with scroll velocity. -->
    <div class="flood" aria-hidden="true" style="--line: {lineTop}px; --drift: {drift}px">
      <div class="water">
        <div class="bubbles">
          {#each bubbles as b}
            <span
              class="bubble"
              style="left:{b.x}%; width:{b.d}px; height:{b.d}px; animation-duration:{b.dur}s; animation-delay:{b.delay}s;"
            ></span>
          {/each}
        </div>
      </div>
      <div class="waves">
        <svg class="wave wave-back" viewBox="0 0 2880 40" preserveAspectRatio="none">
          <path
            d="M0,20 Q90,6 180,20 T360,20 T540,20 T720,20 T900,20 T1080,20 T1260,20 T1440,20 T1620,20 T1800,20 T1980,20 T2160,20 T2340,20 T2520,20 T2700,20 T2880,20 L2880,40 L0,40 Z"
            fill="rgba(44, 208, 197, 0.3)"
          />
        </svg>
        <svg class="wave wave-front" viewBox="0 0 2880 40" preserveAspectRatio="none">
          <path
            d="M0,18 Q90,4 180,18 T360,18 T540,18 T720,18 T900,18 T1080,18 T1260,18 T1440,18 T1620,18 T1800,18 T1980,18 T2160,18 T2340,18 T2520,18 T2700,18 T2880,18"
            fill="none"
            stroke="#89dceb"
            stroke-opacity="0.8"
            stroke-width="2"
          />
        </svg>
      </div>
    </div>
  </div>
{/if}

<style>
  /* Transparent so the site's normal animated ocean background shows through;
     the footer is hidden (see :global rule) so it doesn't bleed through. */
  .vp {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 30;
    overflow: hidden;
  }
  :global(html.dd-active footer) {
    display: none;
  }
  .inner {
    will-change: transform;
  }

  .flood {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }
  /* Below the line: deep underwater tint. */
  .water {
    position: absolute;
    left: 0;
    right: 0;
    top: var(--line);
    bottom: 0;
    background:
      radial-gradient(120% 55% at 50% 0%, rgba(140, 224, 235, 0.1), transparent 60%),
      linear-gradient(
        180deg,
        rgba(34, 130, 156, 0.18) 0%,
        rgba(14, 52, 96, 0.28) 45%,
        rgba(6, 24, 52, 0.4) 100%
      );
  }
  /* Bubbles rising in the water, swaying with the scroll "current". */
  .bubbles {
    position: absolute;
    inset: 0;
    transform: translateX(var(--drift));
  }
  .bubble {
    position: absolute;
    bottom: 0;
    border-radius: 9999px;
    background: radial-gradient(
      circle at 35% 30%,
      rgba(255, 255, 255, 0.9),
      rgba(137, 220, 235, 0.3)
    );
    box-shadow: 0 0 4px rgba(137, 220, 235, 0.4);
    animation-name: dd-bubble;
    animation-timing-function: ease-in;
    animation-iteration-count: infinite;
    opacity: 0;
  }
  @keyframes dd-bubble {
    0% {
      transform: translateY(0);
      opacity: 0;
    }
    12% {
      opacity: 0.7;
    }
    88% {
      opacity: 0.5;
    }
    100% {
      transform: translateY(-70vh) translateX(10px);
      opacity: 0;
    }
  }

  /* Rolling surface line at the boundary. Two tiled copies slide -50% for a
     seamless loop; two layers roll opposite ways for a parallax shimmer. The
     whole thing sways sideways with the scroll current. */
  .waves {
    position: absolute;
    left: 0;
    right: 0;
    top: var(--line);
    height: 40px;
    overflow: hidden;
    transform: translate(var(--drift), -50%);
  }
  .wave {
    position: absolute;
    top: 0;
    left: 0;
    width: 200%;
    height: 100%;
    will-change: transform;
  }
  .wave-back {
    animation: dd-roll 15s linear infinite;
  }
  .wave-front {
    animation: dd-roll-rev 10s linear infinite;
    filter: drop-shadow(0 0 6px rgba(137, 220, 235, 0.5));
  }
  @keyframes dd-roll {
    from {
      transform: translateX(0);
    }
    to {
      transform: translateX(-50%);
    }
  }
  @keyframes dd-roll-rev {
    from {
      transform: translateX(-50%);
    }
    to {
      transform: translateX(0);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .wave-back,
    .wave-front,
    .bubble {
      animation: none;
    }
    .bubble {
      opacity: 0.35;
    }
  }
</style>
