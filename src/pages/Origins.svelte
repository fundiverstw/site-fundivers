<script lang="ts">
  import { t } from '$engine/i18n'
  import { FOUNDERS } from '$content/team'
  import PageHeader from '$components/PageHeader.svelte'
  import MemberCard from '$components/MemberCard.svelte'

  // How the shop came to be, and the two people it came from. Dennis and Billy
  // appear here beside their own story with `showBio` off: the paragraphs to
  // the left already tell it, and their full bios are on /team with everyone
  // else's. What their cards carry here is the part the story does not — how
  // long they have been diving, what they do out of the water, and why.
</script>

<PageHeader title={$t.origins.title} subtitle={$t.origins.subtitle} />

<section class="mx-auto max-w-[1600px] px-4 pb-16 sm:px-6">
  <div class="grid gap-10 lg:grid-cols-12 lg:items-start">
    <div class="lg:col-span-7">
      <h2 class="text-t1 font-bold tracking-tight text-white">
        {$t.about.storyTitle}
      </h2>
      <div class="mt-6 space-y-5 leading-relaxed text-brand-100">
        {#each $t.about.storyParas as para (para)}
          <p>{para}</p>
        {/each}
      </div>

      <a
        href="/team"
        class="mono mt-8 inline-block text-t3 font-semibold text-reef-300 hover:text-reef-200"
      >
        {$t.about.teamTitle} →
      </a>
    </div>

    <div class="grid gap-6 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1">
      {#each FOUNDERS as m (m.name)}
        <MemberCard member={m} showBio={false} />
      {/each}
    </div>
  </div>
</section>
