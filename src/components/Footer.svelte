<script lang="ts">
  import { CONTACT } from '../lib/config'
  import { t } from '../lib/i18n'
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

  <div class="border-t border-white/10">
    <div class="mx-auto flex max-w-[1600px] flex-col gap-1 px-4 py-4 text-xs text-brand-300 sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <span>© {year} {$t.footer.rights}</span>
      <div class="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
        <a
          class="inline-flex items-center gap-1 hover:text-white"
          href="https://github.com/fundive"
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor" aria-hidden="true">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z"/>
          </svg>
          {$t.footer.openSource} ↗
        </a>
        <span>{$t.footer.proudly}</span>
      </div>
    </div>
  </div>
</footer>
