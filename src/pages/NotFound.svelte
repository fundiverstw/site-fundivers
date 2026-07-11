<script lang="ts">
  import { t } from '$engine/i18n'

  // ── The segmented LCD ─────────────────────────────────────────────────────
  // One renderer drives both the big "404" and the "PAGE NOT FOUND" line. Each
  // character is a 16-segment cell drawn as <line>s in a 24×40 box. Round
  // line-caps meet at shared endpoints, so segments fuse into continuous bars —
  // which is why the digits 0 and 4 read as a classic seven-segment display
  // while the letters simply light the extra diagonals and centre strokes.
  const SEGMENTS: Array<{ n: string; p: [number, number, number, number] }> = [
    { n: 'a1', p: [4, 4, 12, 4] }, // top-left bar
    { n: 'a2', p: [12, 4, 20, 4] }, // top-right bar
    { n: 'f', p: [4, 4, 4, 20] }, // upper-left
    { n: 'b', p: [20, 4, 20, 20] }, // upper-right
    { n: 'g1', p: [4, 20, 12, 20] }, // middle-left
    { n: 'g2', p: [12, 20, 20, 20] }, // middle-right
    { n: 'e', p: [4, 20, 4, 36] }, // lower-left
    { n: 'c', p: [20, 20, 20, 36] }, // lower-right
    { n: 'd1', p: [4, 36, 12, 36] }, // bottom-left bar
    { n: 'd2', p: [12, 36, 20, 36] }, // bottom-right bar
    { n: 'h', p: [4, 4, 12, 20] }, // NW diagonal
    { n: 'i', p: [12, 4, 12, 20] }, // top-centre vertical
    { n: 'k', p: [20, 4, 12, 20] }, // NE diagonal
    { n: 'l', p: [12, 20, 20, 36] }, // SE diagonal
    { n: 'm', p: [12, 20, 12, 36] }, // bottom-centre vertical
    { n: 'n', p: [12, 20, 4, 36] }, // SW diagonal
  ]

  // Which segments each glyph lights. Only the characters we actually show.
  const FONT: Record<string, string[]> = {
    '0': ['a1', 'a2', 'b', 'c', 'd1', 'd2', 'e', 'f'],
    '4': ['b', 'c', 'f', 'g1', 'g2'],
    A: ['a1', 'a2', 'b', 'c', 'e', 'f', 'g1', 'g2'],
    D: ['a1', 'a2', 'b', 'c', 'd1', 'd2', 'i', 'm'],
    E: ['a1', 'a2', 'd1', 'd2', 'e', 'f', 'g1', 'g2'],
    F: ['a1', 'a2', 'e', 'f', 'g1', 'g2'],
    G: ['a1', 'a2', 'c', 'd1', 'd2', 'e', 'f', 'g2'],
    N: ['b', 'c', 'e', 'f', 'h', 'l'],
    O: ['a1', 'a2', 'b', 'c', 'd1', 'd2', 'e', 'f'],
    P: ['a1', 'a2', 'b', 'e', 'f', 'g1', 'g2'],
    T: ['a1', 'a2', 'i', 'm'],
    U: ['b', 'c', 'd1', 'd2', 'e', 'f'],
    ' ': [],
  }

  const lit = (ch: string, seg: string) => (FONT[ch] ?? []).includes(seg)

  // The readout message, kept in words so it wraps cleanly on a narrow screen.
  const MESSAGE = ['PAGE', 'NOT', 'FOUND']
</script>

{#snippet glyph(ch: string)}
  <svg class="glyph" viewBox="0 0 24 40" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
    {#each SEGMENTS as seg (seg.n)}
      <line
        class="seg"
        class:on={lit(ch, seg.n)}
        x1={seg.p[0]}
        y1={seg.p[1]}
        x2={seg.p[2]}
        y2={seg.p[3]}
      />
    {/each}
  </svg>
{/snippet}

<section
  class="mx-auto flex max-w-[1600px] flex-col items-center gap-8 px-4 py-24 text-center sm:px-6"
>
  <!-- The dive computer. Decorative: the real "404 / page not found" content
       lives in the accessible heading + paragraph below, translated. -->
  <div class="dive-computer" aria-hidden="true">
    <span class="lug lug-top"></span>
    <span class="lug lug-bottom"></span>

    <span class="btn btn-tl"></span>
    <span class="btn btn-bl"></span>
    <span class="btn btn-tr"></span>
    <span class="btn btn-br"></span>

    <div class="bezel">
      <div class="screen">
        <div class="backlight"></div>

        <div class="status">
          <span class="dot"></span>
          <span class="mono">NO SIGNAL</span>
          <span class="batt"></span>
        </div>

        <div class="readout">
          {#each ['4', '0', '4'] as d, i (i)}
            {@render glyph(d)}
          {/each}
        </div>

        <div class="message">
          {#each MESSAGE as word (word)}
            <span class="word">
              {#each word.split('') as ch, i (i)}
                {@render glyph(ch)}
              {/each}
            </span>
          {/each}
        </div>

        <div class="footer mono">
          <span>DEPTH --.- M</span>
          <span>NDL --:--</span>
        </div>
      </div>
    </div>
  </div>

  <!-- Accessible, translated copy. The dive computer above is decorative
       (aria-hidden), so state the error code here for screen readers too. -->
  <div class="flex flex-col items-center gap-3">
    <span class="sr-only">{$t.notFound.code}</span>
    <h1 class="text-2xl font-bold text-white">{$t.notFound.title}</h1>
    <p class="max-w-md text-brand-100">{$t.notFound.text}</p>
    <a
      href="/"
      class="mt-2 rounded-full bg-brand-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-brand-700"
    >
      {$t.notFound.back}
    </a>
  </div>
</section>

<style>
  /* ── Case ────────────────────────────────────────────────────────────────
     A glossy resin dive-computer body: dark charcoal with a top-lit sheen, a
     rubber bezel, four side buttons and two strap lugs. */
  .dive-computer {
    position: relative;
    width: min(90vw, 380px);
    aspect-ratio: 5 / 6;
    border-radius: 2.4rem;
    padding: 22px;
    background:
      radial-gradient(120% 80% at 50% -10%, #2a3547 0%, rgba(42, 53, 71, 0) 55%),
      linear-gradient(160deg, #1b2331 0%, #10151f 55%, #0a0e15 100%);
    box-shadow:
      inset 0 2px 1px rgba(255, 255, 255, 0.14),
      inset 0 -3px 6px rgba(0, 0, 0, 0.6),
      0 30px 60px -20px rgba(0, 0, 0, 0.8),
      0 0 0 1px rgba(0, 0, 0, 0.5);
  }
  /* Broad specular highlight sliding across the top of the case. */
  .dive-computer::before {
    content: '';
    position: absolute;
    inset: 3px 3px auto 3px;
    height: 42%;
    border-radius: 2.1rem 2.1rem 40% 40%;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0));
    pointer-events: none;
  }

  /* Strap lugs poking out top and bottom. */
  .lug {
    position: absolute;
    left: 50%;
    width: 46%;
    height: 20px;
    transform: translateX(-50%);
    background: linear-gradient(180deg, #10151f, #0a0e15);
    box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.08);
    z-index: -1;
  }
  .lug-top {
    top: -12px;
    border-radius: 10px 10px 4px 4px;
  }
  .lug-bottom {
    bottom: -12px;
    border-radius: 4px 4px 10px 10px;
  }

  /* Side buttons. */
  .btn {
    position: absolute;
    width: 20px;
    height: 30px;
    border-radius: 6px;
    background: linear-gradient(160deg, #2b3648 0%, #131922 100%);
    box-shadow:
      inset 0 1px 1px rgba(255, 255, 255, 0.15),
      0 2px 3px rgba(0, 0, 0, 0.6);
  }
  .btn-tl,
  .btn-bl {
    left: -7px;
  }
  .btn-tr,
  .btn-br {
    right: -7px;
  }
  .btn-tl,
  .btn-tr {
    top: 24%;
  }
  .btn-bl,
  .btn-br {
    bottom: 24%;
  }

  /* ── Bezel + screen ──────────────────────────────────────────────────────*/
  .bezel {
    height: 100%;
    border-radius: 1.5rem;
    padding: 14px;
    background: linear-gradient(160deg, #05080c, #0b1017);
    box-shadow:
      inset 0 2px 4px rgba(0, 0, 0, 0.9),
      inset 0 0 0 1px rgba(255, 255, 255, 0.04);
  }
  .screen {
    position: relative;
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 14px 12px;
    border-radius: 1rem;
    overflow: hidden;
    /* Dark backlit teal LCD glass. */
    background: radial-gradient(120% 90% at 50% 40%, #0d3230 0%, #08201f 60%, #061715 100%);
    box-shadow:
      inset 0 0 24px rgba(0, 0, 0, 0.7),
      inset 0 0 0 1px rgba(94, 234, 212, 0.08);
    color: var(--color-reef-300);
  }
  /* A soft pulsing backlight bloom behind the glass. */
  .backlight {
    position: absolute;
    inset: 0;
    background: radial-gradient(90% 60% at 50% 45%, rgba(44, 208, 197, 0.16), transparent 70%);
    pointer-events: none;
    animation: bloom 4.5s ease-in-out infinite;
  }
  /* Faint LCD scanline texture over the whole screen. */
  .screen::after {
    content: '';
    position: absolute;
    inset: 0;
    background: repeating-linear-gradient(
      0deg,
      rgba(0, 0, 0, 0.14) 0px,
      rgba(0, 0, 0, 0.14) 1px,
      transparent 1px,
      transparent 3px
    );
    mix-blend-mode: multiply;
    pointer-events: none;
  }

  .status {
    position: relative;
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.6rem;
    letter-spacing: 0.12em;
    color: rgba(102, 230, 218, 0.75);
  }
  .status .dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--color-peach);
    box-shadow: 0 0 6px var(--color-peach);
    animation: blink 1.6s step-end infinite;
  }
  .status .batt {
    margin-left: auto;
    width: 20px;
    height: 10px;
    border-radius: 2px;
    border: 1px solid rgba(102, 230, 218, 0.6);
    /* An almost-empty battery — a little 404 gallows humour. */
    background: linear-gradient(90deg, var(--color-peach) 22%, transparent 22%);
    position: relative;
  }
  .status .batt::after {
    content: '';
    position: absolute;
    right: -3px;
    top: 2px;
    width: 2px;
    height: 4px;
    border-radius: 0 1px 1px 0;
    background: rgba(102, 230, 218, 0.6);
  }

  .readout {
    position: relative;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
  }
  .readout .glyph {
    width: clamp(46px, 22%, 72px);
    height: auto;
  }

  .message {
    position: relative;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 4px 12px;
    padding-bottom: 10px;
  }
  .message .word {
    display: flex;
    gap: 3px;
  }
  .message .glyph {
    width: 15px;
    height: auto;
  }

  .footer {
    position: relative;
    display: flex;
    justify-content: space-between;
    font-size: 0.58rem;
    letter-spacing: 0.08em;
    color: rgba(102, 230, 218, 0.55);
    border-top: 1px solid rgba(102, 230, 218, 0.12);
    padding-top: 8px;
  }

  /* ── Segments ────────────────────────────────────────────────────────────
     Off segments stay faintly visible — the tell-tale ghosting of a real LCD.
     Lit segments glow teal. */
  .seg {
    stroke: rgba(120, 210, 200, 0.07);
    stroke-width: 3.4;
    stroke-linecap: round;
  }
  .seg.on {
    stroke: #6ff2df;
    filter: drop-shadow(0 0 2.5px rgba(94, 234, 212, 0.9));
  }

  @keyframes bloom {
    0%,
    100% {
      opacity: 0.7;
    }
    50% {
      opacity: 1;
    }
  }
  @keyframes blink {
    0%,
    60% {
      opacity: 1;
    }
    61%,
    100% {
      opacity: 0.25;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .backlight,
    .status .dot {
      animation: none;
    }
  }
</style>
