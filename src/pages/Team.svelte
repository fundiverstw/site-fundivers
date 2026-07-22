<script lang="ts">
  import { CONTACT } from '$content/settings'
  import { TEAM } from '$content/team'
  import { t, locale } from '$engine/i18n'
  import { memberBio } from '$engine/i18n-content'
  import PageHeader from '$components/PageHeader.svelte'
  import Photo from '$components/Photo.svelte'
</script>

<PageHeader title={$t.team.title} subtitle={$t.team.subtitle} />

<section class="mx-auto max-w-[1600px] px-4 pb-12 sm:px-6 sm:pb-16">
  <div class="grid gap-6 md:grid-cols-2">
    {#each TEAM as m}
      <svelte:element
        this={m.link ? 'a' : 'div'}
        href={m.link}
        target={m.link ? '_blank' : undefined}
        rel={m.link ? 'noopener' : undefined}
        class={`glass block rounded-2xl p-6 shadow-sm ${m.link ? 'group transition-all hover:-translate-y-0.5 hover:shadow-md' : ''}`}
      >
        <div class="flex items-center gap-4">
          {#if m.image}
            <Photo
              image={m.image}
              alt={m.name}
              sizes="4rem"
              class="h-16 w-16 shrink-0 rounded-full object-cover ring-2 ring-white/20"
            />
          {:else if m.monkey}
            <div
              class="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-amber-700 text-3xl ring-2 ring-white/20"
              title="Placeholder"
            >
              🐵
            </div>
          {/if}
          <div>
            <span class="text-xs font-semibold uppercase tracking-wide text-reef-300"
              >{$t.team.roles[m.role]}</span
            >
            <h3 class="text-lg font-bold text-white">{m.name}</h3>
          </div>
        </div>
        <p class="mt-4 whitespace-pre-line text-sm leading-relaxed text-brand-100">
          {memberBio(m.name, $locale)}
        </p>
        {#if m.link}
          <span
            class="mt-3 inline-block text-xs font-semibold text-reef-300 group-hover:text-reef-200"
          >
            {$t.team.visitWebsite}
          </span>
        {/if}
      </svelte:element>
    {/each}
  </div>

  <div class="glass mt-12 rounded-2xl p-8 text-center">
    <h2 class="text-xl font-bold text-white">{$t.team.diveWithUs}</h2>
    <p class="mt-2 text-brand-100">{$t.team.diveWithUsText}</p>
    <div class="mt-4 flex flex-wrap justify-center gap-4 text-sm">
      <a class="font-semibold text-reef-300 hover:text-reef-200" href={`mailto:${CONTACT.email}`}
        >{CONTACT.email}</a
      >
      <a class="font-semibold text-reef-300 hover:text-reef-200" href={CONTACT.phoneHref}
        >{CONTACT.phone}</a
      >
    </div>
  </div>
</section>
