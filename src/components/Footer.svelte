<script lang="ts">
  import { CONTACT } from '$content/settings'
  import { t } from '$engine/i18n'
  import SocialIcons from './SocialIcons.svelte'

  const year = new Date().getFullYear()
</script>

<footer id="contact" class="border-t border-white/10 text-brand-100">
  <div class="mx-auto grid max-w-[1600px] gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">
    <div>
      <div class="flex items-center gap-2">
        <img src="/imgs/fd_logo.png" alt="FunDivers TW" class="h-10 w-auto" />
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
        aria-label="FunDive — our open-source dive-shop software on GitHub"
      >
        <img
          src="/imgs/fundive-logo-dark.svg"
          alt="FunDive — dive shop management software"
          class="h-20 w-auto max-w-full opacity-90 transition-opacity group-hover:opacity-100 sm:h-28"
        />
        <span class="max-w-md text-xs leading-relaxed text-brand-300 transition-colors group-hover:text-brand-100 sm:text-sm">
          {$t.footer.openSourceBlurb}
          <span class="whitespace-nowrap font-semibold text-reef-300 group-hover:text-reef-200">GitHub&nbsp;↗</span>
        </span>
      </a>
    </div>
  </div>

  <div class="border-t border-white/10">
    <div class="mx-auto flex max-w-[1600px] flex-col gap-1 px-4 py-4 text-xs text-brand-300 sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <span>© {year} {$t.footer.rights}</span>
      <span>{$t.footer.proudly}</span>
    </div>
  </div>
</footer>
