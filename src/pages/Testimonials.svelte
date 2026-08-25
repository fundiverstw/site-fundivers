<script lang="ts">
  import { t, locale } from '$engine/i18n'
  import { testimonialText } from '$engine/i18n-content'
  import { TESTIMONIALS } from '$content/testimonials'
  import { CONTACT } from '$content/settings'
  import PageHeader from '$components/PageHeader.svelte'

  // What divers have said, one quote per card. The quotes live in
  // $content/testimonials — currently placeholders, and the file says so.
  //
  // Marked up as <figure>/<blockquote>/<figcaption> rather than as styled
  // paragraphs: a quotation attributed to a named person is exactly what that
  // markup is for, and it is what tells a screen reader where the quote ends
  // and the attribution begins.
</script>

<PageHeader title={$t.testimonials.title} subtitle={$t.testimonials.subtitle} />

<section class="mx-auto max-w-[1600px] px-4 pb-16 sm:px-6">
  {#if TESTIMONIALS.length === 0}
    <p class="glass rounded-2xl p-6 text-center text-brand-100">{$t.testimonials.none}</p>
  {:else}
    <div class="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {#each TESTIMONIALS as item (item.id)}
        {@const text = testimonialText(item.id, $locale)}
        <figure
          class="glass flex flex-col rounded-3xl border border-white/10 p-6 shadow-sm transition-colors hover:border-reef-400/40"
        >
          <span class="mono text-3xl leading-none text-reef-400" aria-hidden="true">“</span>
          <blockquote class="mt-2 flex-1 leading-relaxed text-brand-100">{text.quote}</blockquote>
          <figcaption class="mt-5 border-t border-white/10 pt-4">
            <span class="block font-bold text-white">{item.name}</span>
            <span class="mono mt-0.5 block text-xs text-brand-300">{text.context}</span>
          </figcaption>
        </figure>
      {/each}
    </div>
  {/if}

  <div class="glass mt-10 rounded-2xl p-8 text-center">
    <h2 class="text-xl font-bold text-white">{$t.testimonials.ctaTitle}</h2>
    <p class="mt-2 text-brand-100">{$t.testimonials.ctaText}</p>
    <div class="mt-5 flex flex-wrap justify-center gap-3">
      <a
        href="/reviews"
        class="mono rounded-full bg-reef-400 px-5 py-2.5 text-sm font-semibold text-brand-950 transition-colors hover:bg-reef-300"
      >
        {$t.testimonials.leaveReview}
      </a>
      <a
        href={`mailto:${CONTACT.email}`}
        class="mono rounded-full border border-white/30 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
      >
        {$t.testimonials.contact}
      </a>
    </div>
  </div>
</section>
