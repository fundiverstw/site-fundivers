<script lang="ts">
  import { CONTACT, SOCIAL } from '$content/settings'
  import { LINE_PATH, WHATSAPP_PATH } from '$components/brand-icons'
  import { t } from '$engine/i18n'
  import PageHeader from '$components/PageHeader.svelte'
  import Photo from '$components/Photo.svelte'
  import { HIKES } from '$content/hikes'
  import { hikeImage } from '$engine/photo-pool'
</script>

<PageHeader title={$t.hiking.title} subtitle={$t.hiking.subtitle} />

<div class="mx-auto max-w-5xl px-4 pb-20 sm:px-6">
  <section class="glass rounded-3xl p-6 sm:p-8">
    <div class="space-y-4 text-brand-100">
      {#each $t.hiking.intro as para}
        <p>{para}</p>
      {/each}
    </div>
  </section>

  <!-- The hike catalog — one card per hike (grows as hikes are added to
       content/hikes.ts). Not links: hikes have no detail page yet. -->
  <section class="mt-14">
    <h2 class="text-2xl font-bold text-white">{$t.hiking.hikesTitle}</h2>
    <div class="mt-6 grid gap-6 sm:grid-cols-2">
      {#each HIKES as hike (hike.id)}
        {@const image = hikeImage(hike.id)}
        <article
          class="glass group flex flex-col overflow-hidden rounded-3xl border border-white/10 shadow-sm"
        >
          <div class="relative aspect-[16/9] overflow-hidden">
            {#if image}
              <Photo
                {image}
                alt={hike.name}
                sizes="(min-width: 640px) 32rem, 100vw"
                class="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            {:else}
              <div
                class="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand-900 to-brand-950 text-5xl"
                aria-hidden="true"
              >
                🥾
              </div>
            {/if}
            <div
              class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"
            ></div>
            <div class="absolute inset-x-0 bottom-0 p-5">
              <h3 class="text-xl font-bold text-white">{hike.name}</h3>
              <p class="mono mt-0.5 text-xs text-reef-200">{hike.location}</p>
            </div>
          </div>
          <div class="flex flex-1 flex-col p-6">
            <p class="text-sm leading-relaxed text-brand-100">{hike.tagline}</p>
          </div>
        </article>
      {/each}
    </div>
  </section>

  <!-- Close / CTA -->
  <section class="mt-14">
    <div
      class="glow-teal flex flex-col gap-5 rounded-3xl border border-reef-400/30 bg-reef-400/5 p-6 sm:p-8"
    >
      <div>
        <h2 class="text-2xl font-bold text-white">{$t.hiking.ctaTitle}</h2>
        <p class="mt-2 text-brand-100">{$t.hiking.ctaText}</p>
      </div>
      <div class="flex flex-wrap gap-2">
        <a
          href={`mailto:${CONTACT.email}?subject=${encodeURIComponent('Taipei hiking tour')}`}
          class="flex items-center gap-2 rounded-full bg-reef-400 px-5 py-2 text-sm font-bold text-brand-950 transition-colors hover:bg-reef-300"
        >
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path
              d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z"
            />
          </svg>
          {$t.hiking.emailUs}
        </a>
        <a
          href={SOCIAL.line}
          target="_blank"
          rel="noopener"
          class="flex items-center gap-2 rounded-full border border-white/40 px-5 py-2 text-sm font-bold text-white transition-colors hover:bg-white/15"
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
          class="flex items-center gap-2 rounded-full border border-white/40 px-5 py-2 text-sm font-bold text-white transition-colors hover:bg-white/15"
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
