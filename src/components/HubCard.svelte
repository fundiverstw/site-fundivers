<script lang="ts">
  import { t } from '$engine/i18n'
  import CoverPhoto from './CoverPhoto.svelte'
  import { SIZES, type ResponsiveImage } from '$engine/responsive-image'

  // One card on a section hub (/education, /community, /go-diving) — a photo, a
  // title, a line of description, and the whole thing is the link.
  //
  // A card either shows a photograph or a brand panel: `image` for the pages
  // that are about a place or a course, `logo`/`icon` for the ones that are
  // about software. CoverPhoto handles a null image, so a card for a page whose
  // photos have not been taken yet still lays out correctly rather than
  // collapsing.
  let {
    href,
    title,
    desc,
    image = null,
    logo,
    icon,
    sizes = SIZES.card,
  }: {
    href: string
    title: string
    desc: string
    image?: ResponsiveImage | null
    logo?: string
    icon?: string
    sizes?: string
  } = $props()
</script>

<a
  {href}
  class="glass group flex flex-col overflow-hidden rounded-3xl border border-white/10 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-reef-400/60 hover:shadow-[0_0_30px_-8px_rgba(44,208,197,0.6)]"
>
  <div class="relative aspect-[16/9] overflow-hidden">
    {#if logo || icon}
      <div
        class="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand-900 to-brand-950"
      >
        {#if logo}
          <img src={logo} alt="" class="h-16 w-auto max-w-[70%] opacity-90" />
        {:else}
          <span class="text-5xl" aria-hidden="true">{icon}</span>
        {/if}
      </div>
    {:else}
      <CoverPhoto src={image} {sizes} />
      <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
    {/if}
  </div>
  <div class="flex flex-1 flex-col p-6">
    <h2 class="text-t2 font-bold text-white">{title}</h2>
    <p class="mt-2 flex-1 text-t3 leading-relaxed text-brand-100">{desc}</p>
    <span
      class="mono mt-4 inline-block text-t3 font-semibold text-reef-300 group-hover:text-reef-200"
    >
      {$t.services.learnMore} →
    </span>
  </div>
</a>
