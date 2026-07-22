<script lang="ts">
  import { path } from '$engine/router'
  import { t, locale, setLocale, LOCALES } from '$engine/i18n'
  import MenuIcon from './MenuIcon.svelte'
  import GlobeIcon from './GlobeIcon.svelte'
  import RadioPlayer from './RadioPlayer.svelte'

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
    { href: '/services', label: $t.nav.services },
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
    // Nine links have to fit beside the logo. They grow with the window rather
    // than overflowing it: at 1280 the whole bar, globe included, must be on
    // screen. See the 'the whole navigation fits' test in e2e/navigation.spec.ts.
    const base =
      'module mono rounded-xl px-2.5 py-1.5 text-base font-semibold lg:text-lg xl:px-3 2xl:px-4 2xl:py-2 2xl:text-xl'
    return $path === href ? `${base} module-active` : `${base} text-brand-50`
  }
</script>

{#snippet langSwitch()}
  <div class="lang-switch relative">
    <button
      type="button"
      onclick={() => (langOpen = !langOpen)}
      aria-label={$t.nav.language}
      aria-haspopup="menu"
      aria-expanded={langOpen}
      class="module flex items-center gap-1 rounded-xl px-2 py-2 text-brand-50"
    >
      <GlobeIcon size={28} />
    </button>
    {#if langOpen}
      <div
        class="glass absolute right-0 top-full z-50 mt-2 min-w-[8rem] rounded-xl p-1 shadow-lg"
        role="menu"
      >
        {#each LOCALES as l (l.code)}
          <button
            type="button"
            onclick={() => {
              setLocale(l.code)
              langOpen = false
            }}
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
    <!-- Desktop: logo at the far left, links + globe to its right.
         Shown from xl (1280px), not md. Nine links plus the logo simply do not
         fit below that: the bar used to run off the side of the page and give
         every tablet a horizontal scrollbar. Narrower screens get the menu
         button below, which is built to fit. -->
    <div class="hidden items-center justify-between gap-6 py-3 xl:flex">
      <div class="shrink-0">
        <a href="/" aria-label="FunDivers TW home" class="group block">
          <!-- The logo is the first thing on screen on most pages, so it is
               fetched at high priority. width/height are the file's own, to
               reserve the space before it arrives; the classes size it. -->
          <img
            src="/imgs/fd_logo.webp"
            alt="FunDivers TW"
            width="634"
            height="320"
            fetchpriority="high"
            class="h-28 w-auto transition-all duration-300 group-hover:scale-105 group-hover:brightness-110 group-hover:drop-shadow-[0_0_18px_rgba(44,208,197,0.55)] lg:h-36"
          />
        </a>
      </div>
      <nav class="waybar relative flex items-center gap-1 rounded-2xl px-2 py-1.5 shadow-lg">
        {#each allLinks as link}
          <a href={link.href} class={linkClass(link.href)}>{link.label}</a>
        {/each}
        <span class="mx-1 h-6 w-px bg-white/15"></span>
        {@render langSwitch()}
        <RadioPlayer />
      </nav>
    </div>

    <!-- Mobile: logo left · globe + menu toggle right -->
    <div class="flex items-center justify-between py-3 xl:hidden">
      <a href="/" aria-label="FunDivers TW home" class="group block">
        <img
          src="/imgs/fd_logo.webp"
          alt="FunDivers TW"
          width="634"
          height="320"
          fetchpriority="high"
          class="h-16 w-auto transition-all duration-300 group-hover:scale-105 group-hover:brightness-110 group-hover:drop-shadow-[0_0_18px_rgba(44,208,197,0.55)]"
        />
      </a>
      <div class="flex items-center gap-3">
        {@render langSwitch()}
        <RadioPlayer />
        <button
          class="text-brand-50 transition-colors hover:text-reef-300"
          aria-label={$t.nav.menu}
          data-testid="menu-toggle"
          onclick={() => (open = !open)}
        >
          <MenuIcon {open} />
        </button>
      </div>
    </div>
  </div>

  <!-- Mobile menu -->
  {#if open}
    <div class="glass border-t border-white/10 xl:hidden">
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
