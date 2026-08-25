<script lang="ts">
  import { t, locale } from '$engine/i18n'
  import { memberText } from '$engine/i18n-content'
  import CoverPhoto from '$components/CoverPhoto.svelte'
  import type { Member } from '$content/team'

  // One person on /about: two photos of them — one above the water, one under
  // it — over their role, how long they have been diving, and the two lines
  // that say who they actually are.
  //
  // Both photos go through CoverPhoto, which draws a labelled placeholder frame
  // when there is no file yet. That is deliberate: an empty frame reads as "the
  // photo is coming", where a missing one reads as a broken page.
  //
  // `showBio` is off for the founders, whose history is told in the story above
  // the roster — printing the bio again a screen later just repeats it.
  let { member, showBio = true }: { member: Member; showBio?: boolean } = $props()

  let text = $derived(memberText(member.name, $locale))
</script>

<article class="glass flex flex-col overflow-hidden rounded-3xl border border-white/10 shadow-sm">
  <div class="grid grid-cols-2 gap-px bg-white/10">
    {#each [{ src: member.above ?? null, label: $t.about.aboveWater }, { src: member.under ?? null, label: $t.about.underwater }] as shot (shot.label)}
      <figure class="relative aspect-[4/3] overflow-hidden bg-brand-950">
        <CoverPhoto
          src={shot.src}
          alt={shot.src ? `${member.name} — ${shot.label}` : ''}
          sizes="(min-width: 1024px) 16rem, (min-width: 640px) 22vw, 46vw"
          imgClass="absolute inset-0 h-full w-full object-cover"
        />
        <figcaption
          class="mono absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-2 py-1 text-[10px] uppercase tracking-widest text-white/85"
        >
          {shot.label}
        </figcaption>
      </figure>
    {/each}
  </div>

  <div class="flex flex-1 flex-col p-6">
    <span class="text-xs font-semibold uppercase tracking-wide text-reef-300"
      >{$t.team.roles[member.role]}</span
    >
    <h3 class="text-lg font-bold text-white">{member.name}</h3>
    {#if member.since}
      <p class="mono mt-1 text-xs text-brand-300">{$t.about.since} {member.since}</p>
    {/if}

    {#if showBio}
      <p class="mt-4 whitespace-pre-line text-sm leading-relaxed text-brand-100">{text.bio}</p>
    {/if}

    <dl class="mt-4 space-y-3 border-t border-white/10 pt-4 text-sm">
      <div>
        <dt class="mono text-[11px] uppercase tracking-wide text-brand-300">
          {$t.about.interests}
        </dt>
        <dd class="mt-1 text-brand-100">{text.interests}</dd>
      </div>
      <div>
        <dt class="mono text-[11px] uppercase tracking-wide text-brand-300">{$t.about.why}</dt>
        <dd class="mt-1 italic text-white">“{text.why}”</dd>
      </div>
    </dl>

    {#if member.link}
      <a
        href={member.link}
        target="_blank"
        rel="noopener"
        class="mono mt-4 inline-block text-xs font-semibold text-reef-300 hover:text-reef-200"
      >
        {$t.team.visitWebsite}
      </a>
    {/if}
  </div>
</article>
