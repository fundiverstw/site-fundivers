<script lang="ts">
  import { t, locale } from '$engine/i18n'
  import { testimonialText } from '$engine/i18n-content'
  import { TESTIMONIALS } from '$content/testimonials'
  import { REVIEW_PLATFORMS } from '$content/reviews'
  import { CONTACT } from '$content/settings'
  import PageHeader from '$components/PageHeader.svelte'

  // What people say about the shop, in one page and two halves.
  //
  // They used to be two pages, Testimonials and Reviews, and they said the same
  // thing from two directions: quotes we chose, and quotes we cannot touch. A
  // visitor asking "is this shop any good" wants both at once, and having to
  // pick between two menu items to find out is the wrong question to ask them.
  //
  // The halves stay distinct on the page, because the difference between them
  // is the interesting part. The quotes are ours — we picked them, and they say
  // so. The reviews are not: every link leaves the site, which is exactly why
  // they are worth reading, so they are treated as external links (new tab,
  // rel=noopener) rather than dressed up as part of the page.
  //
  // Quotes come from $content/testimonials (placeholders for now, and that file
  // says so); the platforms and their brand names come from $content/reviews and
  // are never translated — only the line under each one is.
</script>

<PageHeader title={$t.reputation.title} subtitle={$t.reputation.subtitle} />

<div class="mx-auto max-w-[1600px] px-4 pb-16 sm:px-6">
  <!-- ── In their own words ─────────────────────────────────────────────── -->
  <section aria-labelledby="testimonials">
    <h2 id="testimonials" class="text-t2 font-bold text-white">
      {$t.testimonials.title}
    </h2>

    {#if TESTIMONIALS.length === 0}
      <p class="glass mt-5 rounded-2xl p-6 text-center text-brand-100">{$t.testimonials.none}</p>
    {:else}
      <!-- <figure>/<blockquote>/<figcaption> rather than styled paragraphs: a
           quotation attributed to a named person is exactly what that markup is
           for, and it is what tells a screen reader where the quote ends and
           the attribution begins. -->
      <div class="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {#each TESTIMONIALS as item (item.id)}
          {@const text = testimonialText(item.id, $locale)}
          <figure
            class="glass flex flex-col rounded-3xl border border-white/10 p-6 shadow-sm transition-colors hover:border-reef-400/40"
          >
            <span class="mono text-3xl leading-none text-reef-400" aria-hidden="true">“</span>
            <blockquote class="mt-2 flex-1 leading-relaxed text-brand-100">{text.quote}</blockquote>
            <figcaption class="mt-5 border-t border-white/10 pt-4">
              <span class="block font-bold text-white">{item.name}</span>
              <span class="mono mt-0.5 block text-t4 text-brand-300">{text.context}</span>
            </figcaption>
          </figure>
        {/each}
      </div>
    {/if}
  </section>

  <!-- ── Where we cannot edit a word ────────────────────────────────────── -->
  <section aria-labelledby="reviews" class="mt-14">
    <h2 id="reviews" class="text-t2 font-bold text-white">{$t.reviews.title}</h2>
    <p class="mt-3 max-w-2xl leading-relaxed text-brand-100">{$t.reviews.intro}</p>

    <div class="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {#each REVIEW_PLATFORMS as p (p.id)}
        <div class="glass flex flex-col rounded-3xl border border-white/10 p-6 shadow-sm">
          <h3 class="text-t2 font-bold text-white">{p.label}</h3>
          <p class="mt-2 flex-1 text-t3 leading-relaxed text-brand-100">
            {$t.reviews.platforms[p.id]}
          </p>
          <div class="mt-5 flex flex-wrap gap-3">
            <a
              href={p.readUrl}
              target="_blank"
              rel="noopener"
              class="mono rounded-full bg-reef-400 px-4 py-2 text-t4 font-semibold text-brand-950 transition-colors hover:bg-reef-300"
            >
              {$t.reviews.readReviews} ↗
            </a>
            <a
              href={p.writeUrl}
              target="_blank"
              rel="noopener"
              class="mono rounded-full border border-white/30 px-4 py-2 text-t4 font-semibold text-white transition-colors hover:bg-white/10"
            >
              {$t.reviews.writeReview} ↗
            </a>
          </div>
        </div>
      {/each}
    </div>
  </section>

  <!-- The ask, once, at the bottom — it belongs to both halves. The old
       Testimonials page pointed at the old Reviews page here; with one page,
       the first review platform is the nearest thing to "leave a review", so
       that is where the button goes. -->
  <div class="glass mt-14 rounded-2xl p-8 text-center">
    <h2 class="text-t2 font-bold text-white">{$t.testimonials.ctaTitle}</h2>
    <p class="mt-2 text-brand-100">{$t.testimonials.ctaText}</p>
    <div class="mt-5 flex flex-wrap justify-center gap-3">
      <a
        href={REVIEW_PLATFORMS[0].writeUrl}
        target="_blank"
        rel="noopener"
        class="mono rounded-full bg-reef-400 px-5 py-2.5 text-t3 font-semibold text-brand-950 transition-colors hover:bg-reef-300"
      >
        {$t.testimonials.leaveReview} ↗
      </a>
      <a
        href={`mailto:${CONTACT.email}`}
        class="mono rounded-full border border-white/30 px-5 py-2.5 text-t3 font-semibold text-white transition-colors hover:bg-white/10"
      >
        {$t.testimonials.contact}
      </a>
    </div>
  </div>
</div>
