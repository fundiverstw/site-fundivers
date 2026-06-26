<script lang="ts">
  import { path } from '../lib/router'
  import { t, locale, setLocale, LOCALES } from '../lib/i18n'
  import MenuIcon from './MenuIcon.svelte'
  import GlobeIcon from './GlobeIcon.svelte'

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
  let langOpen = $state(false)
  $effect(() => {
    void $path
    open = false
  })

  function onWindowClick(e: MouseEvent) {
    if (langOpen && !(e.target as HTMLElement).closest('.lang-switch')) langOpen = false
  }

  function linkClass(href: string): string {
    const base = 'rounded-md px-4 py-2 text-2xl font-semibold transition-colors lg:text-3xl'
    return $path === href
      ? `${base} text-reef-300`
      : `${base} text-brand-50 hover:text-reef-300`
  }
</script>

{#snippet langSwitch()}
  <div class="lang-switch relative">
    <button
      type="button"
      onclick={() => (langOpen = !langOpen)}
      aria-label="Language"
      aria-haspopup="menu"
      aria-expanded={langOpen}
      class="flex items-center gap-1 text-brand-50 transition-colors hover:text-reef-300"
    >
      <GlobeIcon size={32} />
    </button>
    {#if langOpen}
      <div class="absolute right-0 top-full z-50 mt-2 min-w-[8rem] rounded-lg border border-white/15 bg-brand-950/95 p-1 shadow-lg backdrop-blur" role="menu">
        {#each LOCALES as l (l.code)}
          <button
            type="button"
            onclick={() => { setLocale(l.code); langOpen = false }}
            class={`block w-full rounded px-3 py-2 text-left text-base font-semibold transition-colors ${$locale === l.code ? 'bg-white/15 text-white' : 'text-brand-100 hover:bg-white/10'}`}
          >
            {l.label}
          </button>
        {/each}
      </div>
    {/if}
  </div>
{/snippet}

<svelte:window onclick={onWindowClick} />

<header class="bg-transparent">
  <div class="mx-auto max-w-[1600px] px-4 sm:px-6">
    <!-- Desktop: logo at the far left, links + globe to its right -->
    <div class="hidden items-center justify-between gap-6 py-3 md:flex">
      <a href="/" aria-label="FunDivers TW home" class="shrink-0">
        <img src="/imgs/fd_logo.png" alt="FunDivers TW" class="h-28 w-auto lg:h-36" />
      </a>
      <nav class="flex items-center gap-2">
        {#each allLinks as link}
          <a href={link.href} class={linkClass(link.href)}>{link.label}</a>
        {/each}
        {@render langSwitch()}
      </nav>
    </div>

    <!-- Mobile: logo left · globe + menu toggle right -->
    <div class="flex items-center justify-between py-3 md:hidden">
      <a href="/" aria-label="FunDivers TW home">
        <img src="/imgs/fd_logo.png" alt="FunDivers TW" class="h-16 w-auto" />
      </a>
      <div class="flex items-center gap-3">
        {@render langSwitch()}
        <button class="text-brand-50" aria-label="Toggle menu" onclick={() => (open = !open)}>
          <MenuIcon {open} />
        </button>
      </div>
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
      </div>
    </div>
  {/if}
</header>
