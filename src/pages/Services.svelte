<script lang="ts">
  import { t } from '$engine/i18n'
  import PageHeader from '$components/PageHeader.svelte'
  import Photo from '$components/Photo.svelte'
  import { mediaIdLocal } from '$engine/images'
  import type { ResponsiveImage } from '$engine/responsive-image'

  // The hub: one card per offering. Links + imagery are structural; the titles
  // and blurbs come from i18n ($t.services). Physical services (gear, tours)
  // show a photo; the digital ones (FunDive, websites) show a brand panel.
  type Card = {
    href: string
    title: string
    desc: string
    image?: ResponsiveImage | null
    logo?: string
    icon?: string
  }

  let cards: Card[] = $derived([
    {
      href: '/gear',
      title: $t.services.gearTitle,
      desc: $t.services.gearDesc,
      image: mediaIdLocal('b37fef_58237e6a633f472b8d419bd830abb854~mv2.jpg'),
    },
    {
      href: '/cycling',
      title: $t.services.cyclingTitle,
      desc: $t.services.cyclingDesc,
      image: mediaIdLocal('youbike'),
    },
    {
      href: '/fundive',
      title: $t.services.fundiveTitle,
      desc: $t.services.fundiveDesc,
      logo: '/imgs/fundive-logo-dark.svg',
    },
    {
      href: '/websites',
      title: $t.services.websitesTitle,
      desc: $t.services.websitesDesc,
      icon: '🌐',
    },
  ])
</script>

<PageHeader title={$t.services.title} subtitle={$t.services.subtitle} />

<section class="mx-auto max-w-5xl px-4 pb-20 sm:px-6">
  <div class="grid gap-6 sm:grid-cols-2">
    {#each cards as c (c.href)}
      <a
        href={c.href}
        class="glass group flex flex-col overflow-hidden rounded-3xl border border-white/10 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-reef-400/60 hover:shadow-[0_0_30px_-8px_rgba(44,208,197,0.6)]"
      >
        <div class="relative aspect-[16/9] overflow-hidden">
          {#if c.image}
            <Photo
              image={c.image}
              alt=""
              sizes="(min-width: 640px) 32rem, 100vw"
              class="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          {:else}
            <div
              class="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand-900 to-brand-950"
            >
              {#if c.logo}
                <img src={c.logo} alt="" class="h-16 w-auto max-w-[70%] opacity-90" />
              {:else if c.icon}
                <span class="text-5xl" aria-hidden="true">{c.icon}</span>
              {/if}
            </div>
          {/if}
        </div>
        <div class="flex flex-1 flex-col p-6">
          <h2 class="text-lg font-bold text-white">{c.title}</h2>
          <p class="mt-2 flex-1 text-sm leading-relaxed text-brand-100">{c.desc}</p>
          <span
            class="mono mt-4 inline-block text-sm font-semibold text-reef-300 group-hover:text-reef-200"
          >
            {$t.services.learnMore} →
          </span>
        </div>
      </a>
    {/each}
  </div>
</section>
