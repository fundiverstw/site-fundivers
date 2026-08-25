<script lang="ts">
  import { t } from '$engine/i18n'
  import { REVIEW_PLATFORMS } from '$content/reviews'
  import PageHeader from '$components/PageHeader.svelte'

  // Where to read what people wrote about us, and where to add to it. Every
  // link here leaves the site — that is the whole point of the page, so they
  // are treated as external links (new tab, rel=noopener) rather than dressed
  // up to look like part of it.
  //
  // The brand names come from $content/reviews and are never translated; the
  // line under each does, keyed by the same id in $t.reviews.platforms.
</script>

<PageHeader title={$t.reviews.title} subtitle={$t.reviews.subtitle} />

<section class="mx-auto max-w-4xl px-4 pb-16 sm:px-6">
  <p class="max-w-2xl leading-relaxed text-brand-100">{$t.reviews.intro}</p>

  <div class="mt-8 grid gap-5 sm:grid-cols-2">
    {#each REVIEW_PLATFORMS as p (p.id)}
      <div class="glass flex flex-col rounded-3xl border border-white/10 p-6 shadow-sm">
        <h2 class="text-lg font-bold text-white">{p.label}</h2>
        <p class="mt-2 flex-1 text-sm leading-relaxed text-brand-100">
          {$t.reviews.platforms[p.id]}
        </p>
        <div class="mt-5 flex flex-wrap gap-3">
          <a
            href={p.readUrl}
            target="_blank"
            rel="noopener"
            class="mono rounded-full bg-reef-400 px-4 py-2 text-xs font-semibold text-brand-950 transition-colors hover:bg-reef-300"
          >
            {$t.reviews.readReviews} ↗
          </a>
          <a
            href={p.writeUrl}
            target="_blank"
            rel="noopener"
            class="mono rounded-full border border-white/30 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-white/10"
          >
            {$t.reviews.writeReview} ↗
          </a>
        </div>
      </div>
    {/each}
  </div>
</section>
