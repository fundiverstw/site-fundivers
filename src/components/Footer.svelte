<script lang="ts">
  import { CONTACT, SOCIAL } from '../lib/config'

  const socials = [
    { href: SOCIAL.line, label: 'Line' },
    { href: SOCIAL.whatsapp, label: 'WhatsApp' },
    { href: SOCIAL.instagram, label: 'Instagram' },
    { href: SOCIAL.facebook, label: 'Facebook' },
    { href: SOCIAL.youtube, label: 'YouTube' },
  ]
  const year = new Date().getFullYear()
</script>

<footer id="contact" class="border-t border-white/10 text-brand-100">
  <div class="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">
    <div>
      <div class="flex items-center gap-2">
        <img src="/imgs/fd_logo.png" alt="FunDivers TW" class="h-10 w-auto" />
        <span class="text-lg font-bold text-white">FunDivers TW</span>
      </div>
      <p class="mt-3 max-w-xs text-sm text-brand-200">
        Guided dive trips, PADI courses, and the best dive sites across Taiwan and beyond.
      </p>
    </div>

    <div>
      <h3 class="text-sm font-semibold uppercase tracking-wide text-white">Contact</h3>
      <ul class="mt-3 space-y-2 text-sm">
        <li><a class="hover:text-white" href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a></li>
        <li><a class="hover:text-white" href={CONTACT.phoneHref}>{CONTACT.phone}</a></li>
        <li class="text-brand-200">{CONTACT.address}, 23446</li>
      </ul>
    </div>

    <div>
      <h3 class="text-sm font-semibold uppercase tracking-wide text-white">Follow</h3>
      <ul class="mt-3 space-y-2 text-sm">
        {#each socials as s}
          <li><a class="hover:text-white" href={s.href} target="_blank" rel="noopener">{s.label}</a></li>
        {/each}
      </ul>
    </div>
  </div>

  <div class="border-t border-white/10">
    <div class="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-4 text-xs text-brand-300 sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <span>© {year} by Fun Divers Taiwan.</span>
      <span>Proudly created with 🤿 ❤️ in Taipei</span>
    </div>
  </div>
</footer>
