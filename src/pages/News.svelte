<script lang="ts">
  import { NEWS } from '$content/news'
  import { t, locale } from '$engine/i18n'
  import { newsText } from '$engine/i18n-content'
  import { formatNewsDate } from '$engine/format'
  import PageHeader from '$components/PageHeader.svelte'
  import CoverPhoto from '$components/CoverPhoto.svelte'

  // The feed: one card per article, newest first. NEWS is already in that
  // order — see src/content/news.ts, which sorts it at build time — so there is
  // no sorting here to fall out of step with the article page.
  //
  // The full write-up lives at /news/<slug> (NewsArticle.svelte). A card shows
  // the lead photo, the date, what kind of thing it was, and the one-line
  // summary; the summary is the only place that text appears, so it is worth
  // writing rather than repeating the first line of the body.
</script>

<PageHeader title={$t.news.title} subtitle={$t.news.subtitle} />

<section class="mx-auto max-w-[1600px] px-4 pb-16 sm:px-6">
  {#if NEWS.length === 0}
    <p class="glass rounded-2xl p-6 text-center text-brand-100">{$t.news.none}</p>
  {:else}
    <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {#each NEWS as article, i (article.slug)}
        {@const text = newsText(article.slug, $locale)}
        <article
          class="group glass relative flex flex-col overflow-hidden rounded-3xl border border-white/15 transition-colors hover:border-reef-400/50"
        >
          <div class="relative aspect-[3/2] overflow-hidden">
            <!-- The first two cards are usually on screen before anything is
                 scrolled, so they load eagerly; the rest stay lazy. -->
            <CoverPhoto
              src={article.photos[0]?.image ?? null}
              alt={article.photos[0]?.alt ?? text.title}
              priority={i < 2}
            />
          </div>

          <div class="flex flex-1 flex-col p-5">
            <div class="mono flex items-center gap-2 text-xs font-semibold text-reef-300">
              <time datetime={article.date}>{formatNewsDate(article.date, $locale)}</time>
              <span aria-hidden="true">·</span>
              <span class="uppercase tracking-wider">{$t.news.kinds[article.kind]}</span>
            </div>

            <h2 class="mt-2 text-lg font-bold text-white">
              <!-- Stretched link: the whole card opens the article. Only the
                   heading is a link, so a screen reader reads one link per card
                   with the headline as its name, not an unlabelled box. -->
              <a href={`/news/${article.slug}`} class="after:absolute after:inset-0">{text.title}</a
              >
            </h2>

            <p class="mt-2 flex-1 text-sm text-brand-100">{text.summary}</p>

            <span
              class="mono mt-4 text-xs font-semibold text-reef-300 transition-colors group-hover:text-reef-200"
              >{$t.common.readMore} →</span
            >
          </div>
        </article>
      {/each}
    </div>
  {/if}
</section>
