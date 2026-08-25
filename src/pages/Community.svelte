<script lang="ts">
  import { t } from '$engine/i18n'
  import PageHeader from '$components/PageHeader.svelte'
  import HubCard from '$components/HubCard.svelte'
  import { NEWS } from '$content/news'
  import { siteImage } from '$engine/photo-pool'
  import fundiveLogoUrl from '$assets/fundive-logo-dark.svg'

  // The Community hub. Surface Interval leads with the newest post's own lead
  // photo, so the card changes as the feed does rather than showing a fixed
  // picture that slowly stops matching what is behind it.
  let cards = $derived([
    {
      href: '/surface-interval',
      title: $t.community.newsTitle,
      desc: $t.community.newsDesc,
      image: NEWS[0]?.photos[0]?.image ?? null,
    },
    {
      href: '/testimonials',
      title: $t.community.testimonialsTitle,
      desc: $t.community.testimonialsDesc,
      image: siteImage('long-dong-bay'),
    },
    {
      href: '/reviews',
      title: $t.community.reviewsTitle,
      desc: $t.community.reviewsDesc,
      icon: '★',
    },
    {
      href: '/radio',
      title: $t.community.radioTitle,
      desc: $t.community.radioDesc,
      icon: '📻',
    },
    {
      href: '/fundive',
      title: $t.community.fundiveTitle,
      desc: $t.community.fundiveDesc,
      logo: fundiveLogoUrl,
    },
  ])
</script>

<PageHeader title={$t.community.title} subtitle={$t.community.subtitle} />

<section class="mx-auto max-w-5xl px-4 pb-20 sm:px-6">
  <div class="grid gap-6 sm:grid-cols-2">
    {#each cards as c (c.href)}
      <HubCard {...c} sizes="(min-width: 640px) 32rem, 92vw" />
    {/each}
  </div>
</section>
