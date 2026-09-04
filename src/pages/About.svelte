<script lang="ts">
  import { t } from '$engine/i18n'
  import PageHeader from '$components/PageHeader.svelte'
  import HubCard from '$components/HubCard.svelte'
  import Photo from '$components/Photo.svelte'
  import { SIZES } from '$engine/responsive-image'
  import { siteImage, courseImage } from '$engine/photo-pool'
  import { galleryCover } from '$content/photo-gallery'
  import { FOUNDERS } from '$content/team'

  // The About Us hub. The story and the roster are pages of their own —
  // /origins and /team — and this is the way in to both, plus the two sections
  // that used to sit under the landing page's event board: the services tiles
  // and the Diving-in-Taiwan essay. The landing page is now the board and
  // nothing else, and this is where that copy went.

  // The Origins card wears a founder's photo when there is one, so the two
  // cards do not both fall back to a placeholder frame.
  let cards = $derived([
    {
      href: '/origins',
      title: $t.about.originsTitle,
      desc: $t.about.originsDesc,
      image: FOUNDERS.find((m) => m.above)?.above ?? siteImage('long-dong-bay'),
    },
    {
      href: '/team',
      title: $t.about.teamTitle,
      desc: $t.about.teamDesc,
      image: courseImage('padi-divemaster-course'),
    },
  ])

  // Structural data only (links + images); titles and descriptions come from
  // i18n ($t.about.services), aligned by index. Each tile shows a photo of the
  // thing it links to, taken from that thing's own folder, so a tile cannot end
  // up advertising a picture nobody kept.
  const serviceLinks = [
    { href: '/courses', image: courseImage('padi-open-water-course') },
    { href: '/sites', image: siteImage('bat-cave') },
    { href: '/gear', image: courseImage('padi-equipment-specialist') },
    { href: '/travel#international', image: siteImage('malapascua') },
    { href: '/travel', image: siteImage('penghu') },
    { href: '/courses/padi-efr-course', image: courseImage('padi-efr-course') },
  ]

  // Decorative photography for the "Diving in Taiwan" section: the covers of
  // three Taiwanese dive sites up top, then a row of creatures straight from the
  // gallery on /sealife. Both are named rather than picked at random, so the
  // section looks the same on every visit — and both go null on their own if a
  // folder is ever emptied, which the template already handles.
  const diveScenes = [siteImage('82-5'), siteImage('secret-garden'), siteImage('turtle-island')]
  const marineLife = [
    galleryCover('octopus'),
    galleryCover('boxfish'),
    galleryCover('nudibranchs'),
    galleryCover('moray_eels'),
    galleryCover('pufferfish'),
    galleryCover('scorpionfish'),
  ]
</script>

<PageHeader title={$t.about.title} subtitle={$t.about.subtitle} />

<!-- The two halves of About Us -->
<section class="mx-auto max-w-5xl px-4 pb-12 sm:px-6">
  <div class="grid gap-6 sm:grid-cols-2">
    {#each cards as c (c.href)}
      <HubCard {...c} sizes="(min-width: 640px) 32rem, 92vw" />
    {/each}
  </div>
</section>

<!-- What we do — moved here off the landing page -->
<section class="mx-auto max-w-[1600px] px-4 py-12 sm:px-6 sm:py-16">
  <div class="mx-auto max-w-3xl text-center">
    <h2 class="text-t1 font-bold tracking-tight text-white">{$t.about.exploreServices}</h2>
    <p class="mt-3 text-brand-100">{$t.about.exploreServicesIntro}</p>
  </div>

  <div class="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
    {#each serviceLinks as s, i (s.href)}
      <a
        href={s.href}
        class="group relative flex aspect-square flex-col justify-end overflow-hidden rounded-3xl border border-white/15 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-reef-400/60 hover:shadow-[0_0_30px_-8px_rgba(44,208,197,0.6)]"
      >
        <Photo
          image={s.image}
          alt=""
          class="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div
          class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"
        ></div>
        <div class="relative z-10 p-6 sm:p-7">
          <h3 class="text-t2 font-bold text-white">{$t.about.services[i].title}</h3>
          <p class="mt-1 line-clamp-3 text-t3 text-white/85">{$t.about.services[i].desc}</p>
        </div>
      </a>
    {/each}
  </div>
</section>

<!-- Diving in Taiwan — text wrapped by a sticky photo mosaic + a reef-life rail -->
<section class="mx-auto max-w-[1600px] px-4 py-12 sm:px-6 sm:py-16">
  <div class="grid gap-8 lg:grid-cols-12 lg:items-start">
    <div class="lg:col-span-7">
      <h2 class="text-t1 font-bold tracking-tight text-white">{$t.about.divingTitle}</h2>
      <div class="mt-6 space-y-5 text-brand-100">
        {#each $t.about.divingParas as para (para)}
          <p>{para}</p>
        {/each}
      </div>
    </div>

    <!-- Divers-in-the-blue mosaic, sticks alongside the copy on desktop -->
    <div class="lg:col-span-5 lg:sticky lg:top-24">
      <div class="grid grid-cols-2 gap-3">
        <figure
          class="group col-span-2 aspect-[16/10] overflow-hidden rounded-3xl border border-white/10 shadow-sm"
        >
          <Photo
            image={diveScenes[0]}
            alt=""
            sizes={SIZES.card}
            class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </figure>
        {#each diveScenes.slice(1) as image, i (i)}
          <figure
            class="group aspect-square overflow-hidden rounded-2xl border border-white/10 shadow-sm"
          >
            <Photo
              {image}
              alt=""
              sizes={SIZES.tile}
              class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </figure>
        {/each}
      </div>
    </div>
  </div>

  <!-- A glimpse of the reef life beneath the waves -->
  <div class="mt-8 grid grid-cols-3 gap-3 sm:mt-10 sm:grid-cols-6">
    {#each marineLife as image, i (i)}
      <figure
        class="group aspect-square overflow-hidden rounded-2xl border border-white/10 shadow-sm"
      >
        <Photo
          {image}
          alt=""
          sizes={SIZES.tile}
          class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 group-hover:brightness-105"
        />
      </figure>
    {/each}
  </div>
</section>
