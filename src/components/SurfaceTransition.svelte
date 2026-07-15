<script lang="ts">
  // The air-water boundary between a site's "above the surface" and "below the
  // surface" sections. It reads as the moment of a descent: a bright rolling
  // surface line up top, then water deepening downward with drifting light
  // shafts and a few bubbles rising back toward the surface. Purely decorative
  // (aria-hidden); all motion is held still for reduce-motion users.

  // The band lives inside the centered, sidebar-offset content column but is
  // stretched to span the full viewport width. There's no pure-CSS full-bleed
  // that survives an off-centre parent, so we measure the in-flow wrapper's
  // left edge and pull the inner band out to the viewport edges. Recomputed on
  // resize (breakpoint / sidebar / scrollbar changes shift the left edge).
  let host = $state<HTMLDivElement>()
  let bleed = $state({ marginLeft: '0px', width: '100%' })

  // Scroll-linked "descent": as the surface band rises up through the top of
  // the viewport, `depth` runs 0 -> 1 and fades in a full-screen underwater
  // overlay behind the content, so scrolling past the surface feels like
  // dropping below the water.
  let depth = $state(0)

  function measure() {
    if (!host) return
    const rect = host.getBoundingClientRect()
    const vw = document.documentElement.clientWidth
    const vh = window.innerHeight || document.documentElement.clientHeight
    bleed = { marginLeft: `${-rect.left}px`, width: `${vw}px` }
    // Fully "above water" while the band sits low in the view (top >= 60% vh);
    // fully "below" once it reaches the upper 15%. Linear between.
    const hi = vh * 0.6
    const lo = vh * 0.15
    depth = Math.min(1, Math.max(0, (hi - rect.top) / (hi - lo)))
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

  // Hardcoded so the layout is stable (no random reflow / hydration jitter):
  // left %, diameter in px, rise duration s, start delay s.
  const bubbles = [
    { x: 12, d: 6, dur: 7.5, delay: 0 },
    { x: 22, d: 4, dur: 9, delay: 1.8 },
    { x: 34, d: 9, dur: 6.5, delay: 3.1 },
    { x: 46, d: 5, dur: 8.5, delay: 0.9 },
    { x: 57, d: 3, dur: 10, delay: 2.4 },
    { x: 66, d: 7, dur: 7, delay: 4.2 },
    { x: 78, d: 5, dur: 9.5, delay: 1.2 },
    { x: 88, d: 8, dur: 6.8, delay: 3.6 },
  ]
</script>

<!-- Full-screen underwater tint, fading in as you scroll below the surface.
     Fixed and behind the page content (z-index:-1 within the content layer, so
     it dims the backdrop and caustics but never the text). -->
<div class="descent" aria-hidden="true" style="opacity:{depth}"></div>

<!-- In-flow wrapper keeps the band's vertical spacing and is the anchor we
     measure; the inner .surface is stretched out to the viewport edges. -->
<div class="bleed" bind:this={host}>
  <div
    class="surface"
    aria-hidden="true"
    style="margin-left:{bleed.marginLeft}; width:{bleed.width}"
  >
    <!-- Slanted light shafts filtering down from the surface. -->
    <div class="rays"></div>

    <!-- Two rolling wave layers (each is two identical tiles side by side, so a
       -50% slide loops seamlessly). Back layer fills the water body; the front
       layer is the bright surface line. -->
    <svg class="wave wave-back" viewBox="0 0 2880 120" preserveAspectRatio="none">
      <defs>
        <linearGradient id="st-water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#2cd0c5" stop-opacity="0.30" />
          <stop offset="100%" stop-color="#0b1730" stop-opacity="0" />
        </linearGradient>
      </defs>
      <path
        d="M0,58 Q90,22 180,58 T360,58 T540,58 T720,58 T900,58 T1080,58 T1260,58 T1440,58 T1620,58 T1800,58 T1980,58 T2160,58 T2340,58 T2520,58 T2700,58 T2880,58 L2880,120 L0,120 Z"
        fill="url(#st-water)"
      />
    </svg>
    <svg class="wave wave-front" viewBox="0 0 2880 120" preserveAspectRatio="none">
      <path
        d="M0,50 Q90,16 180,50 T360,50 T540,50 T720,50 T900,50 T1080,50 T1260,50 T1440,50 T1620,50 T1800,50 T1980,50 T2160,50 T2340,50 T2520,50 T2700,50 T2880,50"
        fill="none"
        stroke="#89dceb"
        stroke-opacity="0.7"
        stroke-width="2"
      />
    </svg>

    <div class="bubbles">
      {#each bubbles as b}
        <span
          class="bubble"
          style="left:{b.x}%; width:{b.d}px; height:{b.d}px; animation-duration:{b.dur}s; animation-delay:{b.delay}s;"
        ></span>
      {/each}
    </div>
  </div>
</div>

<style>
  /* In-flow anchor: keeps the column's normal width so its left edge (measured
     in JS) is the offset we pull the band back by. */
  .bleed {
    height: 7rem;
  }

  /* Underwater atmosphere that deepens with scroll. Sits behind the page
     content but above the caustics/background (see component comment). */
  .descent {
    position: fixed;
    inset: 0;
    z-index: -1;
    pointer-events: none;
    will-change: opacity;
    background:
      radial-gradient(140% 90% at 50% -10%, rgba(44, 208, 197, 0.12), transparent 55%),
      linear-gradient(180deg, rgba(6, 26, 50, 0.15) 0%, rgba(3, 12, 30, 0.78) 100%);
  }

  .surface {
    position: relative;
    height: 7rem;
    overflow: hidden;
    /* Air up top fading into deepening water below. */
    background: linear-gradient(
      180deg,
      transparent 0%,
      rgba(44, 208, 197, 0.05) 42%,
      rgba(13, 40, 66, 0.35) 100%
    );
    -webkit-mask-image: linear-gradient(
      180deg,
      transparent 0,
      #000 18%,
      #000 88%,
      transparent 100%
    );
    mask-image: linear-gradient(180deg, transparent 0, #000 18%, #000 88%, transparent 100%);
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
    animation: st-roll 14s linear infinite;
  }
  /* Front line rolls the other way, a touch faster, for a parallax shimmer. */
  .wave-front {
    animation: st-roll-rev 9s linear infinite;
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

  /* Diagonal god rays sweeping slowly across the water. */
  .rays {
    position: absolute;
    inset: -20% -20% 0 -20%;
    background: repeating-linear-gradient(
      74deg,
      transparent 0,
      transparent 34px,
      rgba(137, 220, 235, 0.12) 40px,
      transparent 52px
    );
    animation: st-rays 11s ease-in-out infinite alternate;
    opacity: 0.8;
  }
  @keyframes st-rays {
    from {
      transform: translateX(-4%);
      opacity: 0.5;
    }
    to {
      transform: translateX(4%);
      opacity: 0.9;
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
      transform: translateY(0) translateX(0);
      opacity: 0;
    }
    12% {
      opacity: 0.8;
    }
    88% {
      opacity: 0.6;
    }
    100% {
      transform: translateY(-6.5rem) translateX(6px);
      opacity: 0;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .wave-back,
    .wave-front,
    .rays,
    .bubble {
      animation: none;
    }
    /* Keep the surface line and a hint of light visible, just still. */
    .bubble {
      opacity: 0.4;
    }
  }
</style>
