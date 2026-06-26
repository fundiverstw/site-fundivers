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
      <span>{$t.footer.proudly}</span>
    </div>
  </div>
</footer>
