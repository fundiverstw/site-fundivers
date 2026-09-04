<script lang="ts">
  import { CONTACT, SOCIAL } from '$content/settings'
  import { LINE_PATH, WHATSAPP_PATH } from '$components/brand-icons'
  import { t } from '$engine/i18n'
  import PageHeader from '$components/PageHeader.svelte'
  import Photo from '$components/Photo.svelte'
  import hero from '$content/photos/cycling/youbike.jpg?responsive'

  // Icons are structural; the label + text come from i18n ($t.cycling.highlights),
  // aligned by index: fun · sun · exercise · history.
  const icons = ['🎉', '☀️', '🚲', '🏛️']
</script>

<PageHeader title={$t.cycling.title} subtitle={$t.cycling.subtitle} />

<div class="mx-auto max-w-5xl px-4 pb-20 sm:px-6">
  <figure class="aspect-[16/9] overflow-hidden rounded-3xl border border-white/10 shadow-sm">
    <Photo
      image={hero}
      alt=""
      sizes="(min-width: 1024px) 64rem, 100vw"
      class="h-full w-full object-cover"
    />
  </figure>

  <section class="glass mt-8 rounded-3xl p-6 sm:p-8">
    <div class="space-y-4 text-brand-100">
      {#each $t.cycling.intro as para}
        <p>{para}</p>
      {/each}
    </div>
  </section>

  <section class="mt-14">
    <h2 class="text-t2 font-bold text-white">{$t.cycling.highlightsTitle}</h2>
    <div class="mt-6 grid gap-4 sm:grid-cols-2">
      {#each $t.cycling.highlights as h, i (h.label)}
        <div class="glass flex gap-4 rounded-2xl p-6">
          <div class="text-3xl" aria-hidden="true">{icons[i]}</div>
          <div>
            <h3 class="text-t2 font-bold text-white">{h.label}</h3>
            <p class="mt-1 text-t3 leading-relaxed text-brand-100">{h.text}</p>
          </div>
        </div>
      {/each}
    </div>
  </section>

  <!-- Close / CTA -->
  <section class="mt-14">
    <div
      class="glow-teal flex flex-col gap-5 rounded-3xl border border-reef-400/30 bg-reef-400/5 p-6 sm:p-8"
    >
      <div>
        <h2 class="text-t2 font-bold text-white">{$t.cycling.ctaTitle}</h2>
        <p class="mt-2 text-brand-100">{$t.cycling.ctaText}</p>
      </div>
      <div class="flex flex-wrap gap-2">
        <a
          href={`mailto:${CONTACT.email}?subject=${encodeURIComponent('Taipei cycling tour')}`}
          class="flex items-center gap-2 rounded-full bg-reef-400 px-5 py-2 text-t3 font-bold text-brand-950 transition-colors hover:bg-reef-300"
        >
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path
              d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z"
            />
          </svg>
          {$t.cycling.emailUs}
        </a>
        <a
          href={SOCIAL.line}
          target="_blank"
          rel="noopener"
          class="flex items-center gap-2 rounded-full border border-white/40 px-5 py-2 text-t3 font-bold text-white transition-colors hover:bg-white/15"
        >
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d={LINE_PATH} />
          </svg>
          LINE
        </a>
        <a
          href={SOCIAL.whatsapp}
          target="_blank"
          rel="noopener"
          class="flex items-center gap-2 rounded-full border border-white/40 px-5 py-2 text-t3 font-bold text-white transition-colors hover:bg-white/15"
        >
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d={WHATSAPP_PATH} />
          </svg>
          WhatsApp
        </a>
      </div>
    </div>
  </section>
</div>
