<script lang="ts">
  import type { Snippet } from 'svelte'

  // A scroll-jacked "descent". Native page scrolling is disabled; wheel / touch
  // / keyboard input instead drives a smoothed virtual scroll that pans the
  // content (so everything stays reachable) while a water layer rises over the
  // whole viewport. Above the water line the backdrop is sunlit; below it the
  // content reads underwater. The whole thing is a fixed takeover (z above the
  // nav), so the water covers the entire page.
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

  function measure() {
    if (!inner || !vp) return
    maxScroll = Math.max(0, inner.scrollHeight - vp.clientHeight)
    if (target > maxScroll) target = maxScroll
    if (current > maxScroll) current = maxScroll
  }

  $effect(() => {
    reduce =
      typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return

    const root = document.documentElement
    const prevOverflow = root.style.overflow
    root.style.overflow = 'hidden'
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
    const tick = () => {
      current += (target - current) * 0.14
      if (Math.abs(target - current) < 0.4) current = target
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
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('resize', measure)
    }
  })

  let progress = $derived(maxScroll > 0 ? Math.min(1, Math.max(0, current / maxScroll)) : 0)
  // Water surface line: 100% (bottom, dry) at the top of the descent, 0% (top,
  // fully flooded) at the bottom.
  let lineTop = $derived((1 - progress) * 100)
</script>

{#if reduce}
  {@render children()}
{:else}
  <div class="vp" bind:this={vp}>
    <div class="inner" bind:this={inner} style="transform: translateY({-current}px)">
      {@render children()}
    </div>

    <!-- Water layer, on top of the content but click-through. -->
    <div class="flood" aria-hidden="true" style="--line: {lineTop}%">
      <div class="air"></div>
      <div class="water"></div>
      <div class="line"></div>
    </div>
  </div>
{/if}

<style>
  /* Opaque ocean backdrop (mirrors the body background) so the takeover fully
     covers the nav and footer rather than letting them bleed through. */
  .vp {
    position: fixed;
    inset: 0;
    z-index: 30;
    overflow: hidden;
    background:
      radial-gradient(120% 90% at 12% -10%, rgba(203, 166, 247, 0.28) 0%, transparent 55%),
      radial-gradient(120% 90% at 92% 8%, rgba(44, 208, 197, 0.26) 0%, transparent 55%),
      radial-gradient(100% 70% at 50% -15%, rgba(137, 220, 235, 0.22) 0%, transparent 60%),
      radial-gradient(140% 120% at 50% 120%, rgba(36, 116, 235, 0.34) 0%, transparent 60%),
      linear-gradient(180deg, #13294b 0%, #0f1f3d 45%, #0b1730 100%);
  }
  .inner {
    will-change: transform;
  }

  .flood {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }
  /* Above the line: warm sunlight, screen-blended so it brightens. */
  .air {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    height: var(--line);
    mix-blend-mode: screen;
    background:
      radial-gradient(75% 60% at 50% -6%, rgba(255, 246, 214, 0.72), transparent 66%),
      linear-gradient(
        180deg,
        rgba(255, 231, 175, 0.46) 0%,
        rgba(173, 216, 255, 0.28) 52%,
        rgba(140, 200, 250, 0.12) 100%
      );
  }
  /* Below the line: deep underwater tint. */
  .water {
    position: absolute;
    left: 0;
    right: 0;
    top: var(--line);
    bottom: 0;
    background:
      radial-gradient(120% 55% at 50% 0%, rgba(140, 224, 235, 0.14), transparent 60%),
      linear-gradient(
        180deg,
        rgba(34, 130, 156, 0.34) 0%,
        rgba(14, 52, 96, 0.6) 42%,
        rgba(2, 10, 30, 0.86) 100%
      );
  }
  .line {
    position: absolute;
    left: 0;
    right: 0;
    top: var(--line);
    height: 2px;
    transform: translateY(-1px);
    background: linear-gradient(90deg, transparent, rgba(137, 220, 235, 0.8), transparent);
    box-shadow: 0 0 14px 1px rgba(137, 220, 235, 0.5);
  }
</style>
