<script lang="ts">
  import { path } from '$engine/router'
  import { t, locale, setLocale, LOCALES } from '$engine/i18n'
  import MenuIcon from './MenuIcon.svelte'
  import GlobeIcon from './GlobeIcon.svelte'
  import RadioPlayer from './RadioPlayer.svelte'
  import OctopusPeek from './OctopusPeek.svelte'
  import SignInIcon from './SignInIcon.svelte'
  import { signInUrl } from '$content/settings'
  import { SECTIONS, type NavSection } from '$content/navigation'
  import logoUrl from '$assets/fd_logo.webp'

  // The bar is four sections — Education · Community · About Us · Go Diving.
  // Each is a link to its own hub page *and*, where it has children, the label
  // on a dropdown listing them. The structure lives in $content/navigation so
  // the bar, the mobile menu and the hub pages cannot disagree about it.
  //
  // Going from nine flat links to four is what bought the bar its room back:
  // the padding and type size no longer have to shrink to fit Japanese in, and
  // the whole thing sits comfortably inside 1280 in every language.

  let open = $state(false)
  let langOpen = $state(false)
  /** Which section's dropdown is showing, by id. Only ever one. */
  let menu = $state<string | null>(null)

  $effect(() => {
    void $path
    open = false
    menu = null
  })

  function onWindowClick(e: MouseEvent) {
    const el = e.target as HTMLElement
    if (langOpen && !el.closest('.lang-switch')) langOpen = false
    // A click anywhere outside the open section closes it — including on a
    // different section's link, which then opens its own on the way through.
    if (menu && !el.closest(`[data-nav-section="${menu}"]`)) menu = null
  }

  /** The section the pointer is inside, if any. Kept apart from `menu` so that
   *  shutting a menu with the caret, while the pointer is still sitting on that
   *  same section, does not immediately re-open it: `pointerenter` has already
   *  fired and will not fire again until the pointer leaves and comes back. */
  function onSectionEnter(s: NavSection) {
    if (s.items.length) menu = s.id
  }

  function onSectionLeave(s: NavSection) {
    if (menu === s.id) menu = null
  }

  // Escape and Tab are watched on the window rather than on each section. The
  // section wrapper is a plain grouping element, and hanging key handlers off
  // one is both an accessibility warning and a lie about what it is — the keys
  // belong to the bar as a whole, not to a box in it.

  /** Escape shuts whatever is open and hands the focus back to the section link
   *  that opened it — otherwise the focus is left inside a menu that is no
   *  longer on screen, and the next Tab starts from nowhere. */
  function onWindowKeydown(e: KeyboardEvent) {
    if (e.key !== 'Escape') return
    if (langOpen) langOpen = false
    if (!menu) return
    const id = menu
    menu = null
    document.querySelector<HTMLElement>(`[data-nav-section="${id}"] a`)?.focus()
  }

  /** Tabbing out of a section shuts it. Focus leaving is the keyboard's version
   *  of the pointer moving away, and without this the menu stays open behind
   *  whatever the visitor tabbed to next. */
  function onWindowFocusIn(e: FocusEvent) {
    if (!menu) return
    const el = e.target as HTMLElement | null
    if (el?.closest(`[data-nav-section="${menu}"]`)) return
    menu = null
  }

  /** Is this section the one we are inside? True for the hub itself and for
   *  everything under it, so "Go Diving" stays lit while reading a dive site. */
  function inSection(section: NavSection, p: string): boolean {
    if (p === section.href) return true
    return section.items.some((i) => p === i.href || p.startsWith(`${i.href}/`))
  }

  const LINK =
    'module mono whitespace-nowrap rounded-xl px-3 py-1.5 text-t3 font-semibold lg:text-t2 2xl:px-4 2xl:py-2 2xl:text-t2'
</script>

{#snippet langSwitch()}
  <div class="lang-switch relative">
    <button
      type="button"
      onclick={() => (langOpen = !langOpen)}
      aria-label={$t.nav.language}
      aria-haspopup="menu"
      aria-expanded={langOpen}
      class="module flex items-center gap-1 rounded-lg p-1 text-brand-50"
    >
      <GlobeIcon size={20} />
    </button>
    {#if langOpen}
      <div
        class="menu-panel absolute right-0 top-full z-50 mt-2 min-w-[8rem] rounded-xl p-1 shadow-lg"
        role="menu"
      >
        {#each LOCALES as l (l.code)}
          <button
            type="button"
            onclick={() => {
              setLocale(l.code)
              langOpen = false
            }}
            class={`mono block w-full rounded-lg px-3 py-2 text-left text-t3 font-semibold transition-colors ${$locale === l.code ? 'module-active' : 'text-brand-100 hover:bg-white/10'}`}
          >
            {l.label}
          </button>
        {/each}
      </div>
    {/if}
  </div>
{/snippet}

<!-- One section of the desktop bar: its hub link, and the dropdown of what is
     under it. The link is the only control — clicking it opens the hub page,
     and the menu appears when the pointer is over the section or the link has
     the focus.
     
     There is no caret. That means the two things a caret would have carried
     have to live on the link instead: `aria-haspopup`/`aria-expanded` say that
     a menu exists and whether it is showing, and opening on focus is what gives
     a keyboard the same way in a pointer has — Tab lands on the section, the
     menu appears, and the next Tab walks into it. -->
{#snippet section(s: NavSection)}
  <!-- role="group" is not decoration: this element carries the hover handlers
       that open the dropdown, and an element that responds to interaction needs
       a role. The group is genuinely what it says — the section's link, its
       toggle and its menu, which belong together. -->
  <div
    class="relative"
    role="group"
    aria-label={$t.nav[s.key]}
    data-nav-section={s.id}
    onpointerenter={() => onSectionEnter(s)}
    onpointerleave={() => onSectionLeave(s)}
  >
    <a
      href={s.href}
      onfocus={() => onSectionEnter(s)}
      aria-haspopup={s.items.length ? 'menu' : undefined}
      aria-expanded={s.items.length ? menu === s.id : undefined}
      aria-controls={s.items.length ? `nav-menu-${s.id}` : undefined}
      class={inSection(s, $path) ? `${LINK} module-active` : `${LINK} text-brand-50`}
      >{$t.nav[s.key]}</a
    >

    {#if s.items.length && menu === s.id}
      <!-- Two elements, and the outer one is the whole point of the
           arrangement. The panel hangs below the bar with a gap above it, and a
           gap is a strip where the pointer is over neither the section nor the
           menu — which fired pointerleave and shut the menu while the visitor
           was still on their way to it. The outer element spans that strip with
           padding instead of margin, so there is no moment in the journey where
           the pointer has left the section. -->
      <div id={`nav-menu-${s.id}`} class="absolute left-0 top-full z-50 pt-1">
        <div class="menu-panel min-w-[13rem] rounded-xl p-1 shadow-lg" role="menu">
          {#each s.items as item (item.href)}
            <a
              href={item.href}
              role="menuitem"
              class={`mono block whitespace-nowrap rounded-lg px-3 py-2 text-t3 font-semibold transition-colors ${
                $path === item.href ? 'module-active' : 'text-brand-100 hover:bg-white/10'
              }`}
            >
              {$t.nav[item.key]}
            </a>
          {/each}
        </div>
      </div>
    {/if}
  </div>
{/snippet}

{#snippet signIn()}
  <!-- This site has no accounts of its own. "Sign in" is a plain link out to
       the booking app, which owns login, bookings and everything behind it —
       hence the external-link treatment (full URL, new tab).

       The word beside the icon only appears from 2xl. Four sections leave more
       room than nine links did, but "Sign in" is still longer in Japanese than
       in English, and the icon carries it perfectly well below that width —
       labelled for screen readers and on hover. -->
  <a
    href={signInUrl}
    target="_blank"
    rel="noopener"
    data-testid="sign-in"
    aria-label={$t.nav.signIn}
    title={$t.nav.signIn}
    class="module mono flex shrink-0 items-center gap-1.5 rounded-xl px-2 py-2 text-reef-200 2xl:px-3 2xl:text-t2 2xl:font-semibold"
  >
    <SignInIcon size={24} />
    <span class="hidden 2xl:inline">{$t.nav.signIn}</span>
  </a>
{/snippet}

<svelte:window onclick={onWindowClick} onkeydown={onWindowKeydown} onfocusin={onWindowFocusIn} />

<header class="relative z-30 bg-transparent">
  <div class="relative mx-auto max-w-[1600px] px-4 sm:px-6">
    <!-- Language and radio: pinned to the top right of the header, above the
         bar rather than inside it. Neither is navigation — one changes how the
         whole site reads and the other starts an audio stream — so they were
         the two things in the bar that were not a way to somewhere.

         Rendered once, not once per layout: RadioPlayer owns an <audio>
         element and a connection to the stream, and a second copy would mean a
         second connection.

         No panel behind them — they are two bare glyphs in the corner. That
         puts them straight on the photograph, so they carry a drop shadow
         instead: the backdrop is a bright blue-green underwater scene in
         places and white-on-white would otherwise disappear. They sit high
         enough to clear the bar underneath in both layouts — the desktop pill
         is vertically centered in an 8rem header, and on mobile the menu button
         drops to the bottom of its row. -->
    <div
      data-testid="utilities"
      class="absolute right-4 top-0 z-40 flex items-center gap-1 text-brand-50 drop-shadow-[0_1px_4px_rgba(0,0,0,0.75)] sm:right-6"
    >
      {@render langSwitch()}
      <RadioPlayer />
    </div>

    <!-- Desktop: logo at the far left, the four sections and sign-in to its
         right. Shown from xl (1280px). The dropdowns need a pointer or a deliberate tap,
         which is not what a narrow screen wants; below xl the menu button takes
         over and shows every section expanded at once. -->
    <div class="hidden items-center justify-between gap-6 py-3 xl:flex">
      <!-- Logo and slogan are one lockup: the slogan is centered on the logo
           rather than on the page, which is why they share a column. It is a
           <p>, not a heading — it is the same words on every page, and a
           heading that never changes tells a screen reader nothing about where
           it is. The page's own <h1> lives in the page. -->
      <div class="flex shrink-0 flex-col items-center">
        <!-- This wrapper is only here to give the octopus something to hold on
             to. He hangs off the logo's right edge, and the logo is centered in
             a column as wide as the slogan under it — so the edge he wants
             moves with the length of the slogan, and in Chinese and Japanese it
             is somewhere else entirely. Anchoring him to a box that is exactly
             the logo is the only version of this that survives translation.
             He is outside the <a>, not inside it: his speech bubble is itself a
             link, and a link inside a link is not markup a browser will keep. -->
        <div class="relative">
          <a href="/" aria-label="FunDivers TW home" class="group block">
            <!-- The logo is the first thing on screen on most pages, so it is
                 fetched at high priority. width/height are the file's own, to
                 reserve the space before it arrives; the classes size it. -->
            <img
              src={logoUrl}
              alt="FunDivers TW"
              width="634"
              height="320"
              fetchpriority="high"
              class="h-16 w-auto transition-all duration-300 group-hover:scale-105 group-hover:brightness-110 group-hover:drop-shadow-[0_0_18px_rgba(44,208,197,0.55)] lg:h-20"
            />
          </a>
          <!-- Cute octopus that peeks out from behind the logo now and then.
               Desktop only, and he checks that for himself as well (see
               OctopusPeek.svelte) — `hidden xl:flex` on the row above would
               still mount him on a phone and start his timers running. -->
          <OctopusPeek />
        </div>
        <p
          class="slogan mt-1 max-w-[22rem] text-center text-t3 leading-tight text-reef-100 drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)]"
        >
          {$t.nav.slogan}
        </p>
      </div>
      <nav class="waybar relative flex items-center gap-1 rounded-2xl px-2 py-1.5 shadow-lg">
        {#each SECTIONS as s (s.id)}
          {@render section(s)}
        {/each}
        <span class="mx-1 h-6 w-px bg-white/15"></span>
        {@render signIn()}
      </nav>
    </div>

    <!-- Mobile: logo left · menu toggle right, under the utility strip -->
    <div class="flex items-center justify-between py-3 xl:hidden">
      <div class="flex min-w-0 flex-col items-center">
        <a href="/" aria-label="FunDivers TW home" class="group block">
          <img
            src={logoUrl}
            alt="FunDivers TW"
            width="634"
            height="320"
            fetchpriority="high"
            class="h-14 w-auto transition-all duration-300 group-hover:scale-105 group-hover:brightness-110 group-hover:drop-shadow-[0_0_18px_rgba(44,208,197,0.55)]"
          />
        </a>
        <p
          class="slogan mt-0.5 text-center text-t4 leading-tight text-reef-100 drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)]"
        >
          {$t.nav.slogan}
        </p>
      </div>
      <!-- Only the menu button now, and it sits at the bottom of the row: the
           language and radio controls have moved to the strip pinned to the top
           right of the header, which is directly above this corner. -->
      <div class="flex items-center gap-3 self-end">
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

  <!-- Mobile menu: every section expanded, nothing to open twice. A phone menu
       that hides four links behind four taps is worse than a long list, and the
       list is only eleven links. -->
  {#if open}
    <div class="menu-panel border-x-0 border-b-0 xl:hidden">
      <div class="mx-auto flex max-w-[1600px] flex-col gap-1 px-4 py-3 sm:px-6">
        {#each SECTIONS as s (s.id)}
          <!-- Lit for anything inside the section, the same rule the bar uses —
               otherwise the two layouts disagree about where you are. -->
          <a
            href={s.href}
            class="module mono rounded-xl px-3 py-3 text-t3 font-semibold text-brand-50"
            class:module-active={inSection(s, $path)}
          >
            {$t.nav[s.key]}
          </a>
          {#each s.items as item (item.href)}
            <a
              href={item.href}
              class="mono rounded-xl py-2 pl-8 pr-3 text-t3 font-semibold text-brand-100"
              class:module-active={$path === item.href}
            >
              {$t.nav[item.key]}
            </a>
          {/each}
        {/each}
        <span class="my-1 h-px bg-white/15"></span>
        <a
          href={signInUrl}
          target="_blank"
          rel="noopener"
          data-testid="sign-in"
          class="module mono flex items-center gap-2 rounded-xl px-3 py-3 text-t3 font-semibold text-reef-200"
        >
          <SignInIcon size={20} />
          {$t.nav.signIn}
        </a>
      </div>
    </div>
  {/if}
</header>
