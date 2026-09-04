<script lang="ts">
  import { t } from '$engine/i18n'
  import PageHeader from '$components/PageHeader.svelte'
  import HubCard from '$components/HubCard.svelte'
  import { courseImage } from '$engine/photo-pool'
  import { galleryCover } from '$content/photo-gallery'

  // The Education hub: the two pages that teach you something — the PADI
  // courses, and the gallery of what lives down there. The quiz sits under the
  // gallery rather than beside it, because it is the same photos in a different
  // arrangement, not a third place to go.
  let cards = $derived([
    {
      href: '/courses',
      title: $t.education.coursesTitle,
      desc: $t.education.coursesDesc,
      image: courseImage('padi-open-water-course'),
    },
    {
      href: '/sealife',
      title: $t.education.lifeTitle,
      desc: $t.education.lifeDesc,
      image: galleryCover('nudibranchs'),
    },
  ])
</script>

<PageHeader title={$t.education.title} subtitle={$t.education.subtitle} />

<section class="mx-auto max-w-5xl px-4 pb-20 sm:px-6">
  <div class="grid gap-6 sm:grid-cols-2">
    {#each cards as c (c.href)}
      <HubCard {...c} sizes="(min-width: 640px) 32rem, 92vw" />
    {/each}
  </div>

  <a
    href="/quiz"
    class="glass mt-6 flex items-center justify-between gap-4 rounded-2xl px-5 py-4 text-white transition-colors hover:border-reef-400/50"
  >
    <span>
      <span class="block font-bold">{$t.education.quizTitle}</span>
      <span class="mt-0.5 block text-t3 text-brand-100">{$t.education.quizDesc}</span>
    </span>
    <span class="mono shrink-0 text-t3 font-semibold text-reef-300">{$t.quiz.linkFromPhotos}</span>
  </a>
</section>
