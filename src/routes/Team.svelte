<script lang="ts">
  import { CONTACT } from '../lib/config'
  import PageHeader from '../components/PageHeader.svelte'

  type Member = { name: string; role: string; initials: string; bio: string; link?: string }

  const team: Member[] = [
    {
      name: 'Dennis Wong',
      role: 'IDC Staff Instructor',
      initials: 'DW',
      bio: 'Dennis Wong has been scuba diving since 1998. Upon seeing fish big or small in large schools swimming in unison, he wanted to share this mesmerizing underwater world with everyone. He decided to become a PADI Instructor in 2013, and is now IDC Staff since 2018. PADI has awarded him Elite Instructor status for his vigilance and attention to detail from 2020-2023.',
    },
    {
      name: 'Billy Evalt',
      role: 'Instructor',
      initials: 'BE',
      bio: 'Billy is a PADI dive instructor from Seattle, Washington. He has been diving since 2008 and has been an instructor since 2012. He first started diving in Vietnam after a friend recommended it and once underwater, he was hooked! He has been diving in many countries, including: Thailand, Turkey, Italy and New Zealand. He became a dive instructor because he loves watching the students’ eyes light up, as his did, when the underwater world is revealed to them. He believes the more divers we have in the world, the better our chances of making a positive change for our oceans!',
      link: 'https://www.thecookiejartaipei.com/',
    },
    {
      name: 'Mike Lee 李邁先',
      role: 'IDC Staff Instructor',
      initials: 'ML',
      bio: 'Mike is a PADI scuba instructor from Taiwan. He’s been teaching diving since 2017. Ever since his first dive, he’s been captivated by the peaceful and mysterious world beneath the surface. That passion led him to share the beauty of the ocean with others. He focuses on safety, patience, and building confidence underwater. He takes pride in creating a relaxed and supportive learning environment. Come dive with Mike and the Fun Divers Taiwan team — let’s explore the blue together and make unforgettable underwater memories!',
    },
    {
      name: 'Eric Odle',
      role: 'Divemaster',
      initials: 'EO',
      bio: `Hi, I’m Eric, and I like to dive,
Mess with computers, and keep things alive.
I like learning new stuff and having some fun,
Whether underwater or building something on the run.`,
      link: 'https://www.ouairei.com',
    },
  ]
</script>

<PageHeader
  title="Fun Divers Team"
  subtitle="Dedication. Expertise. Passion."
/>

<section class="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
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
          <div class="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-700 to-reef-600 text-lg font-bold text-white">
            {m.initials}
          </div>
          <div>
            <span class="text-xs font-semibold uppercase tracking-wide text-reef-300">{m.role}</span>
            <h3 class="text-lg font-bold text-white">{m.name}</h3>
          </div>
        </div>
        <p class="mt-4 whitespace-pre-line text-sm leading-relaxed text-brand-100">{m.bio}</p>
        {#if m.link}
          <span class="mt-3 inline-block text-xs font-semibold text-reef-300 group-hover:text-reef-200">
            Visit website →
          </span>
        {/if}
      </svelte:element>
    {/each}
  </div>

  <div class="glass mt-12 rounded-2xl p-8 text-center">
    <h2 class="text-xl font-bold text-white">Dive with us</h2>
    <p class="mt-2 text-brand-100">Questions about a course or trip? We’re happy to help.</p>
    <div class="mt-4 flex flex-wrap justify-center gap-4 text-sm">
      <a class="font-semibold text-reef-300 hover:text-reef-200" href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
      <a class="font-semibold text-reef-300 hover:text-reef-200" href={CONTACT.phoneHref}>{CONTACT.phone}</a>
    </div>
  </div>
</section>
