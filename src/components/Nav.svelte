<script lang="ts">
  import { path } from '../lib/router'
  import { RADIO_URL, SHOP_URL } from '../lib/config'
  import { t, locale, setLocale, LOCALES } from '../lib/i18n'
  import SocialIcons from './SocialIcons.svelte'
  import ShopIcon from './ShopIcon.svelte'
  import MenuIcon from './MenuIcon.svelte'

  let leftLinks = $derived([
    { href: '/courses', label: $t.nav.courses },
    { href: '/sites', label: $t.nav.sites },
    { href: '/photos', label: $t.nav.photos },
  ])
  let rightLinks = $derived([
    { href: '/travel', label: $t.nav.travel },
    { href: '/calendar', label: $t.nav.calendar },
    { href: '/team', label: $t.nav.team },
  ])
  let allLinks = $derived([...leftLinks, ...rightLinks])

  let open = $state(false)
  $effect(() => {
    void $path
    open = false
  })

  function linkClass(href: string): string {
    const base = 'rounded-md px-4 py-2 text-2xl font-semibold transition-colors lg:text-3xl'
    return $path === href
      ? `${base} text-reef-300`
      : `${base} text-brand-50 hover:text-reef-300`
  }
</script>

{#snippet shopIcon()}
  <a href={SHOP_URL} aria-label="Gear shop" class="text-brand-50 transition-colors hover:text-reef-300">
    <ShopIcon size={52} />
  </a>
{/snippet}

{#snippet radioIcon()}
  <a
    href={RADIO_URL}
    target="_blank"
    rel="noopener"
    aria-label="FunDivers Radio"
    class="block h-14 w-14 bg-red-500 transition-colors hover:bg-red-400"
    style="-webkit-mask:url(/imgs/broadcast.png) center/contain no-repeat; mask:url(/imgs/broadcast.png) center/contain no-repeat;"
  ></a>
{/snippet}

{#snippet langSwitch()}
  <div class="flex items-center gap-1 text-lg font-semibold">
    {#each LOCALES as l (l.code)}
      <button
        type="button"
        onclick={() => setLocale(l.code)}
        class={`rounded px-3 py-1.5 transition-colors ${$locale === l.code ? 'bg-white/20 text-white' : 'text-brand-100 hover:text-white'}`}
      >
        {l.label}
      </button>
    {/each}
  </div>
{/snippet}

<header class="bg-transparent">
  <div class="mx-auto max-w-[1600px] px-4 sm:px-6">
    <!-- Desktop: utility strip (shop left · socials + radio right) -->
    <div class="hidden items-center justify-between py-2 md:flex">
      {@render shopIcon()}
      <div class="flex items-center gap-6">
        {@render langSwitch()}
        <SocialIcons size={44} />
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
      <div class="mx-auto flex max-w-[1600px] flex-col px-4 py-3 sm:px-6">
        {#each allLinks as link}
          <a
            href={link.href}
            class="rounded-md px-3 py-3 text-base font-semibold text-brand-50 hover:bg-white/10"
            class:text-reef-300={$path === link.href}
          >
            {link.label}
          </a>
        {/each}
        <div class="mt-3 flex items-center justify-between gap-4 border-t border-white/10 px-3 pt-4">
          <div class="flex items-center gap-4">
            <SocialIcons size={24} />
            {@render radioIcon()}
          </div>
          {@render langSwitch()}
        </div>
      </div>
    </div>
  {/if}
</header>
