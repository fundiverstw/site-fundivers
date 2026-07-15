<script lang="ts">
  // The sea surface between a site's "above the surface" and "below the surface"
  // sections. Rather than a band that scrolls past, the water is a FIXED layer
  // pinned to the lower viewport: its surface line sits wherever the in-flow
  // anchor currently is, and everything below the line is tinted underwater. As
  // you scroll down, the anchor rises, so the surface rises and the text scrolls
  // down from "above the sea" into "below the sea". Purely decorative
  // (aria-hidden); the rolling motion is held still for reduce-motion users.

  // The in-flow anchor sits between the two sections; we track its viewport
  // position and project the fixed water surface onto it.
  let anchor = $state<HTMLDivElement>()
  let surfaceY = $state(99999) // px from the top of the viewport to the surface

  function measure() {
    if (!anchor) return
    const vh = window.innerHeight || document.documentElement.clientHeight
    const rect = anchor.getBoundingClientRect()
    // Clamp to the viewport: above it -> full-screen water, below it -> no water.
    surfaceY = Math.max(0, Math.min(vh, rect.top + rect.height / 2))
  }

  $effect(() => {
    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        ticking = false
        measure()
      })
    }
    measure()
    const raf = requestAnimationFrame(measure) // re-measure after fonts / late layout
    window.addEventListener('resize', measure)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', measure)
      window.removeEventListener('scroll', onScroll)
    }
  })

  // A few bubbles rising through the water. Hardcoded so the layout is stable
  // (no random reflow): left %, diameter px, rise duration s, start delay s.
  const bubbles = [
    { x: 14, d: 6, dur: 8, delay: 0 },
    { x: 30, d: 4, dur: 10, delay: 2.4 },
    { x: 48, d: 8, dur: 7, delay: 1.1 },
    { x: 63, d: 5, dur: 9.5, delay: 3.3 },
    { x: 79, d: 4, dur: 8.5, delay: 0.7 },
    { x: 90, d: 7, dur: 7.5, delay: 2 },
  ]
</script>

<!-- Fixed sea, behind the page content (z-index:-1 within the content layer, so
     it tints the backdrop and caustics but never the text). --surface-y is the
     current height of the water column, driven by the anchor below. -->
<div class="sea" aria-hidden="true" style="--surface-y:{surfaceY}px">
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

  <!-- The rolling surface line, sitting right on the water's edge. Two tiles
       side by side so a -50% slide loops seamlessly; two layers roll opposite
       ways for a parallax shimmer. -->
  <div class="line">
    <svg class="wave wave-back" viewBox="0 0 2880 40" preserveAspectRatio="none">
      <path
        d="M0,20 Q90,6 180,20 T360,20 T540,20 T720,20 T900,20 T1080,20 T1260,20 T1440,20 T1620,20 T1800,20 T1980,20 T2160,20 T2340,20 T2520,20 T2700,20 T2880,20 L2880,40 L0,40 Z"
        fill="rgba(44, 208, 197, 0.28)"
      />
    </svg>
    <svg class="wave wave-front" viewBox="0 0 2880 40" preserveAspectRatio="none">
      <path
        d="M0,18 Q90,4 180,18 T360,18 T540,18 T720,18 T900,18 T1080,18 T1260,18 T1440,18 T1620,18 T1800,18 T1980,18 T2160,18 T2340,18 T2520,18 T2700,18 T2880,18"
        fill="none"
        stroke="#89dceb"
        stroke-opacity="0.75"
        stroke-width="2"
      />
    </svg>
  </div>
</div>

<!-- In-flow anchor: a small gap between the two sections whose viewport
     position sets the sea surface height above. -->
<div class="anchor" bind:this={anchor}></div>

<style>
  .sea {
    position: fixed;
    inset: 0;
    z-index: -1;
    pointer-events: none;
  }

  /* The water column: from the surface line down to the bottom of the viewport.
     Grows as the surface rises, so scrolling down floods the view. */
  .water {
    position: absolute;
    left: 0;
    right: 0;
    top: var(--surface-y);
    bottom: 0;
    overflow: hidden;
    background: linear-gradient(
      180deg,
      rgba(44, 208, 197, 0.16) 0%,
      rgba(13, 40, 66, 0.5) 42%,
      rgba(3, 12, 30, 0.82) 100%
    );
  }

  /* The surface line rides on the water's edge (centred on --surface-y). */
  .line {
    position: absolute;
    left: 0;
    right: 0;
    top: var(--surface-y);
    height: 40px;
    transform: translateY(-50%);
    overflow: hidden;
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
    animation: st-roll 15s linear infinite;
  }
  .wave-front {
    animation: st-roll-rev 10s linear infinite;
    filter: drop-shadow(0 0 6px rgba(137, 220, 235, 0.5));
  }
  @keyframes st-roll {
    from {
      transform: translateX(0);
    }
    to {
      transform: translateX(-50%);
    }
  }
  @keyframes st-roll-rev {
    from {
      transform: translateX(-50%);
    }
    to {
      transform: translateX(0);
    }
  }

  .bubbles {
    position: absolute;
    inset: 0;
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
    animation-name: st-bubble;
    animation-timing-function: ease-in;
    animation-iteration-count: infinite;
    opacity: 0;
  }
  @keyframes st-bubble {
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
      transform: translateY(-60vh) translateX(8px);
      opacity: 0;
    }
  }

  /* Small breathing gap between the two sections; drives the surface height. */
  .anchor {
    height: 3rem;
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
