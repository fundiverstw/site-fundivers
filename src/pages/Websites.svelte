<script lang="ts">
  import { SERVICE_PRICING } from '$content/services'
  import { CONTACT, SOCIAL } from '$content/settings'
  import { LINE_PATH, WHATSAPP_PATH } from '$components/brand-icons'
  import { twd } from '$engine/format'
  import { t } from '$engine/i18n'
  import PageHeader from '$components/PageHeader.svelte'

  // Prices come from content/services.ts, never from the language files — a price
  // typed into three translations is three prices waiting to disagree.
  const price = (amount: number) => twd(amount) ?? ''
</script>

<PageHeader title={$t.websites.title} subtitle={$t.websites.subtitle} />

<div class="mx-auto max-w-5xl px-4 pb-20 sm:px-6">
  <!-- Why a dive shop wants a good site -->
  <section class="glass rounded-3xl p-6 sm:p-8">
    <div class="space-y-4 text-brand-100">
      {#each $t.websites.intro as para}
        <p>{para}</p>
      {/each}
    </div>
  </section>

  <!-- What the build includes -->
  <section class="mt-14">
    <h2 class="text-t2 font-bold text-white">{$t.websites.serviceTitle}</h2>
    <ul class="mt-5 grid gap-2 sm:grid-cols-2">
      {#each $t.websites.service as item}
        <li class="glass rounded-xl px-4 py-3 text-t3 text-white">{item}</li>
      {/each}
    </ul>
    <p class="mt-4 text-t3 text-brand-100">{$t.websites.serviceNote}</p>
  </section>

  <!-- Pricing -->
  <section class="mt-14">
    <h2 class="text-t2 font-bold text-white">{$t.websites.pricingTitle}</h2>
    <div class="mt-4 grid gap-4 md:grid-cols-2">
      <div class="glass glow-teal flex flex-col rounded-3xl p-6">
        <h3 class="text-t3 font-bold text-white">{$t.websites.setupTitle}</h3>
        <p class="mono mt-2 text-t2 font-black text-reef-300">
          <span class="text-t3 font-bold text-brand-200">{$t.websites.fromLabel}</span>
          {price(SERVICE_PRICING.websiteSetupFrom)}
        </p>
        <ul class="mt-3 space-y-2 text-t3 text-brand-100">
          {#each $t.websites.setupIncludes as item}
            <li class="flex gap-2">
              <span aria-hidden="true" class="text-reef-300">·</span>{item}
            </li>
          {/each}
        </ul>
      </div>
      <div class="glass glow-teal flex flex-col rounded-3xl p-6">
        <h3 class="text-t3 font-bold text-white">{$t.websites.maintenanceTitle}</h3>
        <p class="mono mt-2 text-t2 font-black text-reef-300">
          {price(SERVICE_PRICING.websiteMonthly)}<span class="text-t3 font-bold text-brand-200"
            >{$t.websites.perMonth}</span
          >
        </p>
        <ul class="mt-3 space-y-2 text-t3 text-brand-100">
          {#each $t.websites.maintenanceIncludes as item}
            <li class="flex gap-2">
              <span aria-hidden="true" class="text-reef-300">·</span>{item}
            </li>
          {/each}
        </ul>
      </div>
    </div>
    <p class="mt-4 text-t3 text-brand-100">{$t.websites.pricingNote}</p>
  </section>

  <!-- Close -->
  <section class="mt-14">
    <div
      class="glow-teal flex flex-col gap-5 rounded-3xl border border-reef-400/30 bg-reef-400/5 p-6 sm:p-8"
    >
      <p class="mono text-t2 font-black text-reef-300">{$t.websites.slogan}</p>
      <div class="border-t border-white/10 pt-5">
        <h3 class="text-t2 font-bold text-white">{$t.websites.ctaTitle}</h3>
        <p class="mt-1 text-t3 text-brand-100">{$t.websites.ctaBlurb}</p>
        <div class="mt-4 flex flex-wrap gap-2">
          <a
            href={`mailto:${CONTACT.email}?subject=${encodeURIComponent('A website for our dive shop')}`}
            class="flex items-center gap-2 rounded-full bg-reef-400 px-5 py-2 text-t3 font-bold text-brand-950 transition-colors hover:bg-reef-300"
          >
            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path
                d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z"
              />
            </svg>
            {$t.websites.emailUs}
          </a>
          <a
            href={SOCIAL.line}
            target="_blank"
            rel="noopener"
            class="flex items-center gap-2 rounded-full border border-white/40 px-5 py-2 text-t3 font-bold text-white transition-colors hover:bg-white/15"
          >
            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d={LINE_PATH} />
            </svg>
            LINE
          </a>
          <a
            href={SOCIAL.whatsapp}
            target="_blank"
            rel="noopener"
            class="flex items-center gap-2 rounded-full border border-white/40 px-5 py-2 text-t3 font-bold text-white transition-colors hover:bg-white/15"
          >
            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d={WHATSAPP_PATH} />
            </svg>
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  </section>
</div>
