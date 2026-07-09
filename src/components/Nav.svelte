<script lang="ts">
  import { path } from '../lib/router'
  import { t, locale, setLocale, LOCALES } from '../lib/i18n'
  import MenuIcon from './MenuIcon.svelte'
  import GlobeIcon from './GlobeIcon.svelte'
  import NavMascot from './NavMascot.svelte'

  let leftLinks = $derived([
    { href: '/courses', label: $t.nav.courses },
    { href: '/sites', label: $t.nav.sites },
    { href: '/calendar', label: $t.nav.calendar },
    { href: '/map', label: $t.nav.map },
    { href: '/photos', label: $t.nav.photos },
  ])
  let rightLinks = $derived([
    { href: '/travel', label: $t.nav.travel },
    { href: '/gear', label: $t.nav.gear },
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
    const base = 'module mono rounded-xl px-4 py-2 text-xl font-semibold lg:text-2xl'
    return $path === href
      ? `${base} module-active`
      : `${base} text-brand-50`
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
      class="module flex items-center gap-1 rounded-xl px-3 py-2 text-brand-50"
    >
      <GlobeIcon size={32} />
    </button>
    {#if langOpen}
      <div class="glass absolute right-0 top-full z-50 mt-2 min-w-[8rem] rounded-xl p-1 shadow-lg" role="menu">
        {#each LOCALES as l (l.code)}
          <button
            type="button"
            onclick={() => { setLocale(l.code); langOpen = false }}
            class={`mono block w-full rounded-lg px-3 py-2 text-left text-base font-semibold transition-colors ${$locale === l.code ? 'module-active' : 'text-brand-100 hover:bg-white/10'}`}
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
      <div class="relative shrink-0">
        <NavMascot />
        <a href="/" aria-label="FunDivers TW home" class="relative z-20 block">
          <img src="/imgs/fd_logo.png" alt="FunDivers TW" class="h-28 w-auto lg:h-36" />
        </a>
      </div>
      <nav class="waybar flex items-center gap-1.5 rounded-2xl px-2 py-1.5 shadow-lg">
        {#each allLinks as link}
          <a href={link.href} class={linkClass(link.href)}>{link.label}</a>
        {/each}
        <span class="mx-1 h-6 w-px bg-white/15"></span>
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
    <div class="glass border-t border-white/10 md:hidden">
      <div class="mx-auto flex max-w-[1600px] flex-col gap-1 px-4 py-3 sm:px-6">
        {#each allLinks as link}
          <a
            href={link.href}
            class="module mono rounded-xl px-3 py-3 text-base font-semibold text-brand-50"
            class:module-active={$path === link.href}
          >
            {link.label}
          </a>
        {/each}
      </div>
    </div>
  {/if}
</header>
