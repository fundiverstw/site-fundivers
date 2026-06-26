<script lang="ts">
  import { path } from '../lib/router'
  import { RADIO_URL, SHOP_URL } from '../lib/config'
  import SocialIcons from './SocialIcons.svelte'
  import ShopIcon from './ShopIcon.svelte'
  import MenuIcon from './MenuIcon.svelte'

  const leftLinks = [
    { href: '/courses', label: 'Courses' },
    { href: '/sites', label: 'Sites' },
    { href: '/photos', label: 'Photos' },
  ]
  const rightLinks = [
    { href: '/travel', label: 'Travel' },
    { href: '/calendar', label: 'Calendar' },
    { href: '/team', label: 'Team' },
  ]
  const allLinks = [...leftLinks, ...rightLinks]

  let open = $state(false)
  $effect(() => {
    void $path
    open = false
  })

  function linkClass(href: string): string {
    const base = 'rounded-md px-3.5 py-2 text-base font-semibold transition-colors lg:text-lg'
    return $path === href
      ? `${base} text-reef-300`
      : `${base} text-brand-50 hover:text-reef-300`
  }
</script>

{#snippet shopIcon()}
  <a href={SHOP_URL} aria-label="Gear shop" class="text-brand-50 transition-colors hover:text-reef-300">
    <ShopIcon size={28} />
  </a>
{/snippet}

{#snippet radioIcon()}
  <a
    href={RADIO_URL}
    target="_blank"
    rel="noopener"
    aria-label="FunDivers Radio"
    class="block h-7 w-7 bg-red-500 transition-colors hover:bg-red-400"
    style="-webkit-mask:url(/imgs/broadcast.png) center/contain no-repeat; mask:url(/imgs/broadcast.png) center/contain no-repeat;"
  ></a>
{/snippet}

<header class="bg-transparent">
  <div class="mx-auto max-w-6xl px-4 sm:px-6">
    <!-- Desktop: utility strip (shop left · socials + radio right) -->
    <div class="hidden items-center justify-between py-2 md:flex">
      {@render shopIcon()}
      <div class="flex items-center gap-4">
        <SocialIcons size={22} />
        {@render radioIcon()}
      </div>
    </div>

    <!-- Desktop: primary nav (links flanking a centered logo) -->
    <div class="hidden grid-cols-3 items-center pb-3 md:grid">
      <nav class="flex items-center justify-start gap-1">
        {#each leftLinks as link}
          <a href={link.href} class={linkClass(link.href)}>{link.label}</a>
        {/each}
      </nav>
      <div class="flex justify-center">
        <a href="/" aria-label="FunDivers TW home">
          <img src="/imgs/fd_logo.png" alt="FunDivers TW" class="h-32 w-auto lg:h-40" />
        </a>
      </div>
      <nav class="flex items-center justify-end gap-1">
        {#each rightLinks as link}
          <a href={link.href} class={linkClass(link.href)}>{link.label}</a>
        {/each}
      </nav>
    </div>

    <!-- Mobile: shop · logo · menu toggle -->
    <div class="flex items-center justify-between py-3 md:hidden">
      {@render shopIcon()}
      <a href="/" aria-label="FunDivers TW home">
        <img src="/imgs/fd_logo.png" alt="FunDivers TW" class="h-16 w-auto" />
      </a>
      <button class="text-brand-50" aria-label="Toggle menu" onclick={() => (open = !open)}>
        <MenuIcon {open} />
      </button>
    </div>
  </div>

  <!-- Mobile menu -->
  {#if open}
    <div class="border-t border-white/10 bg-brand-950/95 backdrop-blur md:hidden">
      <div class="mx-auto flex max-w-6xl flex-col px-4 py-3 sm:px-6">
        {#each allLinks as link}
          <a
            href={link.href}
            class="rounded-md px-3 py-3 text-base font-semibold text-brand-50 hover:bg-white/10"
            class:text-reef-300={$path === link.href}
          >
            {link.label}
          </a>
        {/each}
        <div class="mt-3 flex items-center gap-5 border-t border-white/10 px-3 pt-4">
          <SocialIcons size={24} />
          {@render radioIcon()}
        </div>
      </div>
    </div>
  {/if}
</header>
