<script lang="ts">
  import { t } from '$engine/i18n'
  import { CONTACT } from '$content/settings'
  import { TEAM } from '$content/team'
  import PageHeader from '$components/PageHeader.svelte'
  import MemberCard from '$components/MemberCard.svelte'

  // The whole roster, founders included — this is the page that answers "who
  // will I actually be in the water with", and leaving the two people who run
  // the shop off it would be a strange answer. /origins shows the same two
  // without their bios, because there the story is doing that job.
</script>

<PageHeader title={$t.team.title} subtitle={$t.team.subtitle} />

<section class="mx-auto max-w-[1600px] px-4 pb-16 sm:px-6">
  <p class="max-w-3xl text-brand-100">{$t.about.staffIntro}</p>

  <div class="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
    {#each TEAM as m (m.name)}
      <MemberCard member={m} />
    {/each}
  </div>

  <div class="glass mt-10 rounded-2xl p-8 text-center">
    <h2 class="text-t2 font-bold text-white">{$t.team.diveWithUs}</h2>
    <p class="mt-2 text-brand-100">{$t.team.diveWithUsText}</p>
    <div class="mt-4 flex flex-wrap justify-center gap-4 text-t3">
      <a class="font-semibold text-reef-300 hover:text-reef-200" href={`mailto:${CONTACT.email}`}
        >{CONTACT.email}</a
      >
      <a class="font-semibold text-reef-300 hover:text-reef-200" href={CONTACT.phoneHref}
        >{CONTACT.phone}</a
      >
    </div>
  </div>
</section>
