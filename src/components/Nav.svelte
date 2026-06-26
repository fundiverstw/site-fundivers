<script lang="ts">
  import { path } from '../lib/router'
  import { bookUrl } from '../lib/config'

  const links = [
    { href: '/courses', label: 'Courses' },
    { href: '/sites', label: 'Sites' },
    { href: '/photos', label: 'Photos' },
    { href: '/calendar', label: 'Calendar' },
    { href: '/team', label: 'Team' },
  ]

  let open = $state(false)
  $effect(() => {
    // Close the mobile menu on any route change.
    void $path
    open = false
  })
</script>

<header class="sticky top-0 z-50 border-b border-brand-100 bg-white/90 backdrop-blur">
  <nav class="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
    <a href="/" class="flex items-center gap-2 font-bold text-brand-900">
      <img src="/imgs/fd_logo.png" alt="FunDivers TW" class="h-9 w-auto" />
      <span class="hidden text-lg tracking-tight sm:inline">FunDivers TW</span>
    </a>

    <div class="hidden items-center gap-1 md:flex">
      {#each links as link}
        <a
          href={link.href}
          class="rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-brand-50 hover:text-brand-700"
          class:text-brand-700={$path === link.href}
          class:bg-brand-50={$path === link.href}
          class:text-brand-900={$path !== link.href}
        >
          {link.label}
        </a>
      {/each}
      <a
        href={bookUrl}
        target="_blank"
        rel="noopener"
        class="ml-2 rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-700"
      >
        Book Now
      </a>
    </div>

    <button
      class="rounded-md p-2 text-brand-900 md:hidden"
      aria-label="Toggle menu"
      onclick={() => (open = !open)}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d={open ? 'M6 6l12 12M18 6L6 18' : 'M4 7h16M4 12h16M4 17h16'} stroke-linecap="round" />
      </svg>
    </button>
  </nav>

  {#if open}
    <div class="border-t border-brand-100 bg-white md:hidden">
      <div class="mx-auto flex max-w-6xl flex-col px-4 py-2 sm:px-6">
        {#each links as link}
          <a
            href={link.href}
            class="rounded-md px-3 py-2.5 text-sm font-medium hover:bg-brand-50"
            class:text-brand-700={$path === link.href}
          >
            {link.label}
          </a>
        {/each}
        <a
          href={bookUrl}
          target="_blank"
          rel="noopener"
          class="mt-2 rounded-full bg-brand-600 px-4 py-2.5 text-center text-sm font-semibold text-white"
        >
          Book Now
        </a>
      </div>
    </div>
  {/if}
</header>
