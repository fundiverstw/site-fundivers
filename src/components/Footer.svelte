<script lang="ts">
  import { CONTACT } from '$content/settings'
  import { t } from '$engine/i18n'
  import SocialIcons from './SocialIcons.svelte'
  import logoUrl from '$assets/fd_logo.webp'
  import fundiveLogoUrl from '$assets/fundive-logo-dark.svg'

  const year = new Date().getFullYear()

  // The sign-off carries the only link to the team page, so the word has to sit
  // inside the sentence rather than beside it. Each language places {team}
  // where its own grammar wants it — hence a split rather than three fragments
  // glued in a fixed order. text.test.ts checks no translation drops the
  // placeholder, which would quietly leave the page unreachable.
  let proudly = $derived($t.footer.proudly.split('{team}'))
</script>

<footer id="contact" class="border-t border-white/10 text-brand-100">
  <div class="mx-auto grid max-w-[1600px] gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">
    <div>
      <div class="flex items-center gap-2">
        <img src={logoUrl} alt="FunDivers TW" class="h-10 w-auto" />
        <span class="text-lg font-bold text-white">FunDivers TW</span>
      </div>
      <p class="mt-3 max-w-xs text-sm text-brand-200">{$t.footer.blurb}</p>
    </div>

    <div>
      <h3 class="text-sm font-semibold uppercase tracking-wide text-white">{$t.footer.contact}</h3>
      <ul class="mt-3 space-y-2 text-sm">
        <li><a class="hover:text-white" href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a></li>
        <li><a class="hover:text-white" href={CONTACT.phoneHref}>{CONTACT.phone}</a></li>
        <li class="text-brand-200">{CONTACT.address}, 23446</li>
      </ul>
    </div>

    <div>
      <h3 class="text-sm font-semibold uppercase tracking-wide text-white">{$t.footer.follow}</h3>
      <SocialIcons size={26} class="mt-3" />
    </div>
  </div>

  <!-- Open-source promotion: the FunDive project we build in the open. -->
  <div class="border-t border-white/10">
    <div class="mx-auto max-w-[1600px] px-4 py-6 sm:px-6">
      <a
        href="https://github.com/fundive"
        target="_blank"
        rel="noopener noreferrer"
        class="group inline-flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-5"
        aria-label={$t.footer.openSourceAria}
      >
        <img
          src={fundiveLogoUrl}
          alt={$t.footer.fundiveAlt}
          class="h-20 w-auto max-w-full opacity-90 transition-opacity group-hover:opacity-100 sm:h-28"
        />
        <span
          class="max-w-md text-xs leading-relaxed text-brand-300 transition-colors group-hover:text-brand-100 sm:text-sm"
        >
          {$t.footer.openSourceBlurb}
          <span class="whitespace-nowrap font-semibold text-reef-300 group-hover:text-reef-200"
            >GitHub&nbsp;↗</span
          >
        </span>
      </a>
    </div>
  </div>

  <div class="border-t border-white/10">
    <div
      class="mx-auto flex max-w-[1600px] flex-col gap-1 px-4 py-4 text-xs text-brand-300 sm:flex-row sm:items-center sm:justify-between sm:px-6"
    >
      <span>© {year} {$t.footer.rights}</span>
      <span
        >{proudly[0]}<a
          href="/team"
          class="font-semibold text-reef-300 underline decoration-reef-400/50 underline-offset-2 transition-colors hover:text-reef-200 hover:decoration-reef-300"
          >{$t.footer.team}</a
        >{proudly[1] ?? ''}</span
      >
    </div>
  </div>
</footer>
