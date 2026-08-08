<script lang="ts">
  import { path } from '$engine/router'
  import { newsBySlug } from '$content/news'
  import { t, locale } from '$engine/i18n'
  import { newsText } from '$engine/i18n-content'
  import { formatNewsDate } from '$engine/format'
  import { SIZES } from '$engine/responsive-image'
  import Photo from '$components/Photo.svelte'

  // One article: /news/<slug>. The router serves this component for any
  // /news/<something>, so the slug is read back off the current path — the same
  // arrangement as DiveSiteDetail and CourseDetail.
  let slug = $derived($path.replace(/^\/news\//, '').replace(/\/+$/, ''))
  let article = $derived(newsBySlug(slug))
  let text = $derived(article ? newsText(article.slug, $locale) : null)

  // Column count by however many photos the folder has. Written out in full
  // rather than built from a template string, because Tailwind reads the source
  // as text to decide which classes to generate: a class it never sees spelled
  // out does not exist in the stylesheet. Keyed 1–3 with 3 as the fallback, so
  // a fourth photo (which news.test.ts rejects) still lays out sensibly.
  const PHOTO_GRID: Record<number, string> = {
    1: '',
    2: 'sm:grid-cols-2',
    3: 'sm:grid-cols-3',
  }

  // Blank line between paragraphs, the same convention as the dive-site write-ups.
  let paragraphs = $derived((text?.body ?? '').split('\n\n').filter((p) => p.trim()))

  $effect(() => {
    if (text) document.title = `${text.title} · FunDivers TW`
  })
</script>

{#if !article || !text}
  <section class="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6">
    <p class="glass rounded-2xl p-8 text-brand-100">{$t.news.notFound}</p>
    <a href="/news" class="mono mt-6 inline-block text-sm font-semibold text-reef-300"
      >← {$t.news.backToAll}</a
    >
  </section>
{:else}
  <article class="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
    <a href="/news" class="mono text-xs font-semibold text-reef-300 hover:text-reef-200"
      >← {$t.news.backToAll}</a
    >

    <div class="mono mt-6 flex items-center gap-2 text-xs font-semibold text-reef-300">
      <time datetime={article.date}>{formatNewsDate(article.date, $locale)}</time>
      <span aria-hidden="true">·</span>
      <span class="uppercase tracking-wider">{$t.news.kinds[article.kind]}</span>
    </div>

    <h1 class="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">{text.title}</h1>

    {#if article.photos.length}
      <!-- Up to three. One fills the column; two or three share a row on a wide
           screen and stack on a phone, so a portrait shot beside a landscape one
           still lines up. The first is the one the visitor came for, so it does
           not wait for lazy-loading. -->
      <div class={`mt-8 grid gap-3 ${PHOTO_GRID[article.photos.length] ?? PHOTO_GRID[3]}`}>
        {#each article.photos as photo, i (photo.image.src)}
          <figure>
            <Photo
              image={photo.image}
              alt={photo.alt}
              sizes={article.photos.length === 1 ? SIZES.hero : SIZES.card}
              priority={i === 0}
              class="w-full rounded-2xl border border-white/10 object-cover"
            />
            {#if photo.caption}
              <figcaption class="mt-2 text-xs text-brand-300">{photo.caption}</figcaption>
            {/if}
          </figure>
        {/each}
      </div>
    {/if}

    <div class="mt-8 space-y-4 text-brand-100">
      {#each paragraphs as p (p)}
        <p class="leading-relaxed">{p}</p>
      {/each}
    </div>
  </article>
{/if}
