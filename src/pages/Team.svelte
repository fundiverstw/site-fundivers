<script lang="ts">
  import { CONTACT } from '$content/settings'
  import { mediaIdLocal } from '$engine/images'
  import { t } from '$engine/i18n'
  import PageHeader from '$components/PageHeader.svelte'

  // `image` is a self-hosted headshot; `monkey` swaps in a placeholder avatar
  // when there's no photo yet (Eric). `role` is an i18n key; bios stay English
  // (first-pass — long personal copy, refine later).
  type Member = {
    name: string
    role: 'idc' | 'instructor' | 'divemaster'
    bio: string
    image?: string
    monkey?: boolean
    link?: string
  }

  const team: Member[] = [
    {
      name: 'Dennis Wong',
      role: 'idc',
      image: mediaIdLocal('b37fef_594f84e342954c95b442c5b67f5fb454~mv2.jpg'),
      bio: 'Dennis Wong has been scuba diving since 1998. Upon seeing fish big or small in large schools swimming in unison, he wanted to share this mesmerizing underwater world with everyone. He decided to become a PADI Instructor in 2013, and is now IDC Staff since 2018. PADI has awarded him Elite Instructor status for his vigilance and attention to detail from 2020-2023.',
    },
    {
      name: 'Billy Evalt',
      role: 'instructor',
      image: mediaIdLocal('b37fef_e2a651d4c1144d2286c2dbd0b9dc8018~mv2.jpg'),
      bio: 'Billy is a PADI dive instructor from Seattle, Washington. He has been diving since 2008 and has been an instructor since 2012. He first started diving in Vietnam after a friend recommended it and once underwater, he was hooked! He has been diving in many countries, including: Thailand, Turkey, Italy and New Zealand. He became a dive instructor because he loves watching the students’ eyes light up, as his did, when the underwater world is revealed to them. He believes the more divers we have in the world, the better our chances of making a positive change for our oceans!',
      link: 'https://www.thecookiejartaipei.com/',
    },
    {
      name: 'Mike Lee 李邁先',
      role: 'idc',
      image: mediaIdLocal('b37fef_37847cf1b32a413990cb7b558835954f~mv2.jpg'),
      bio: 'Mike is a PADI scuba instructor from Taiwan. He’s been teaching diving since 2017. Ever since his first dive, he’s been captivated by the peaceful and mysterious world beneath the surface. That passion led him to share the beauty of the ocean with others. He focuses on safety, patience, and building confidence underwater. He takes pride in creating a relaxed and supportive learning environment. Come dive with Mike and the Fun Divers Taiwan team, let’s explore the blue together and make unforgettable underwater memories!',
    },
    {
      name: 'Eric Odle',
      role: 'divemaster',
      monkey: true,
      bio: `Hi, I’m Eric, and I like to dive,
Mess with computers, and keep things alive.
I like learning new stuff and having some fun,
Whether underwater or building something on the run.`,
      link: 'https://www.ouairei.com',
    },
  ]
</script>

<PageHeader title={$t.team.title} subtitle={$t.team.subtitle} />

<section class="mx-auto max-w-[1600px] px-4 py-12 sm:px-6 sm:py-16">
  <div class="grid gap-6 md:grid-cols-2">
    {#each team as m}
      <svelte:element
        this={m.link ? 'a' : 'div'}
        href={m.link}
        target={m.link ? '_blank' : undefined}
        rel={m.link ? 'noopener' : undefined}
        class={`glass block rounded-2xl p-6 shadow-sm ${m.link ? 'group transition-all hover:-translate-y-0.5 hover:shadow-md' : ''}`}
      >
        <div class="flex items-center gap-4">
          {#if m.image}
            <img
              src={m.image}
              alt={m.name}
              loading="lazy"
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
        <p class="mt-4 whitespace-pre-line text-sm leading-relaxed text-brand-100">{m.bio}</p>
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
