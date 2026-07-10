<script lang="ts">
  import { CONTACT, SOCIAL } from '$content/settings'
  import { t } from '$engine/i18n'
  import PageHeader from '$components/PageHeader.svelte'

  // Three service pillars — Sales / Service / Rental. Copy comes from i18n
  // ($t.gear.*) so it tracks the chosen locale; each block reads its title,
  // blurb and bullet list by key. `icon` and accent are structural only.
  let pillars = $derived([
    { icon: '🛒', accent: 'reef', title: $t.gear.salesTitle, text: $t.gear.salesText, items: $t.gear.salesItems },
    { icon: '🔧', accent: 'mauve', title: $t.gear.serviceTitle, text: $t.gear.serviceText, items: $t.gear.serviceItems },
    { icon: '🤿', accent: 'sky', title: $t.gear.rentalTitle, text: $t.gear.rentalText, items: $t.gear.rentalItems },
  ])

  const accentDot: Record<string, string> = {
    reef: 'text-reef-300',
    mauve: 'text-mauve',
    sky: 'text-sky-300',
  }
</script>

<PageHeader title={$t.gear.title} subtitle={$t.gear.subtitle} />

<section class="mx-auto max-w-[1600px] px-4 pb-12 sm:px-6 sm:pb-16">
  <div class="grid gap-6 md:grid-cols-3">
    {#each pillars as p (p.title)}
      <div class="glass flex flex-col rounded-2xl p-7 shadow-sm">
        <div class="text-4xl" aria-hidden="true">{p.icon}</div>
        <h2 class="mt-4 text-xl font-bold text-white">{p.title}</h2>
        <p class="mt-2 text-sm leading-relaxed text-brand-100">{p.text}</p>
        <ul class="mono mt-5 space-y-2 text-sm text-brand-50">
          {#each p.items as item (item)}
            <li class="flex gap-2">
              <span class={`shrink-0 ${accentDot[p.accent]}`}>▹</span>
              <span>{item}</span>
            </li>
          {/each}
        </ul>
      </div>
    {/each}
  </div>

  <div class="glass mt-10 rounded-2xl p-8 text-center">
    <h2 class="text-xl font-bold text-white">{$t.gear.ctaTitle}</h2>
    <p class="mt-2 text-brand-100">{$t.gear.ctaText}</p>
    <div class="mt-5 flex flex-wrap justify-center gap-3">
      <a
        href={`mailto:${CONTACT.email}`}
        class="rounded-full bg-reef-400 px-6 py-3 font-semibold text-brand-950 transition-colors hover:bg-reef-300"
      >
        {CONTACT.email}
      </a>
      <a
        href={SOCIAL.line}
        target="_blank"
        rel="noopener"
        class="rounded-full border border-white/30 px-6 py-3 font-semibold text-white transition-colors hover:bg-white/10"
      >
        LINE
      </a>
      <a
        href={CONTACT.phoneHref}
        class="rounded-full border border-white/30 px-6 py-3 font-semibold text-white transition-colors hover:bg-white/10"
      >
        {CONTACT.phone}
      </a>
    </div>
    <p class="mono mt-5 text-xs text-brand-200">{CONTACT.address}</p>
  </div>
</section>
