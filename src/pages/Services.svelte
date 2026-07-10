<script lang="ts">
  import { SERVICE_PRICING, FUNDIVE_REPO_URL } from '$content/services'
  import { CONTACT, SOCIAL } from '$content/settings'
  import { LINE_PATH, WHATSAPP_PATH } from '$components/brand-icons'
  import { twd } from '$engine/format'
  import { t } from '$engine/i18n'
  import PageHeader from '$components/PageHeader.svelte'

  // Prices come from content/services.ts, never from the language files — a price
  // typed into three translations is three prices waiting to disagree.
  const price = (amount: number) => twd(amount) ?? ''
</script>

<PageHeader title={$t.services.title} subtitle={$t.services.subtitle} />

<div class="mx-auto max-w-5xl px-4 pb-20 sm:px-6">
  <!-- What FunDive is, and the choice a shop has -->
  <section class="glass rounded-3xl p-6 sm:p-8">
    <div class="space-y-4 text-brand-100">
      {#each $t.services.intro as para}
        <p>{para}</p>
      {/each}
    </div>
    <a
      href={FUNDIVE_REPO_URL}
      target="_blank"
      rel="noopener"
      class="mono mt-5 inline-block text-sm font-semibold text-reef-300 hover:text-reef-200"
    >
      {$t.services.readTheCode} →
    </a>
  </section>

  <!-- Pricing -->
  <section class="mt-14">
    <h2 class="text-2xl font-bold text-white">{$t.services.pricingTitle}</h2>

    <div class="mt-6 grid gap-4 md:grid-cols-2">
      <div class="glass glow-teal flex flex-col rounded-3xl p-6">
        <h3 class="text-lg font-bold text-white">{$t.services.setupTitle}</h3>
        <p class="mono mt-2 text-3xl font-black text-reef-300">
          {price(SERVICE_PRICING.fundiveSetup)}
        </p>
        <p class="mt-3 text-sm text-brand-100">{$t.services.setupBlurb}</p>
      </div>

      <div class="glass glow-teal flex flex-col rounded-3xl p-6">
        <h3 class="text-lg font-bold text-white">{$t.services.monthlyTitle}</h3>
        <p class="mono mt-2 text-3xl font-black text-reef-300">
          {price(SERVICE_PRICING.fundiveMonthly)}<span class="text-lg font-bold text-brand-200"
            >{$t.services.perMonth}</span
          >
        </p>
        <p class="mt-3 text-sm text-brand-100">{$t.services.monthlyBlurb}</p>
      </div>
    </div>

    <div class="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div class="mono text-sm text-brand-200">
        {#each $t.services.plainPricing as line}
          <p>{line}</p>
        {/each}
      </div>
      <ul class="grid gap-1 sm:grid-cols-2">
        {#each $t.services.guarantees as g}
          <li class="flex items-center gap-2 text-sm font-semibold text-white">
            <span aria-hidden="true" class="text-reef-300">✔</span>{g}
          </li>
        {/each}
      </ul>
    </div>
    <p class="mt-4 text-sm text-brand-100">{$t.services.guaranteeNote}</p>
  </section>

  <!-- What the setup fee buys -->
  <section class="mt-14">
    <h2 class="text-2xl font-bold text-white">{$t.services.setupIncludesTitle}</h2>
    <p class="mt-2 text-brand-100">{$t.services.setupIncludesBlurb}</p>
    <ul class="mt-5 grid gap-2 sm:grid-cols-2">
      {#each $t.services.setupIncludes as item}
        <li class="glass rounded-xl px-4 py-3 text-sm text-white">{item}</li>
      {/each}
    </ul>
    <p class="mt-4 text-sm text-brand-100">{$t.services.setupIncludesNote}</p>

    <h3 class="mt-8 text-lg font-bold text-white">{$t.services.domainTitle}</h3>
    <div class="mt-2 space-y-2 text-sm text-brand-100">
      {#each $t.services.domain as para}
        <p>{para}</p>
      {/each}
    </div>
  </section>

  <!-- What the monthly fee buys -->
  <section class="mt-14">
    <h2 class="text-2xl font-bold text-white">{$t.services.ongoingTitle}</h2>
    <p class="mt-2 text-brand-100">{$t.services.ongoingBlurb}</p>

    <div class="mt-6 grid gap-4 md:grid-cols-2">
      <div class="glass rounded-3xl p-6">
        <h3 class="text-lg font-bold text-white">{$t.services.updatesTitle}</h3>
        <ul class="mt-3 space-y-2 text-sm text-brand-100">
          {#each $t.services.updates as item}
            <li class="flex gap-2">
              <span aria-hidden="true" class="text-reef-300">·</span>{item}
            </li>
          {/each}
        </ul>
      </div>
      <div class="glass rounded-3xl p-6">
        <h3 class="text-lg font-bold text-white">{$t.services.supportTitle}</h3>
        <p class="mt-2 text-sm text-brand-100">{$t.services.supportBlurb}</p>
        <ul class="mt-3 space-y-2 text-sm text-brand-100">
          {#each $t.services.support as item}
            <li class="flex gap-2">
              <span aria-hidden="true" class="text-reef-300">·</span>{item}
            </li>
          {/each}
        </ul>
      </div>
    </div>
  </section>

  <!-- Ownership: the heart of the pitch -->
  <section class="mt-14">
    <div class="glass glow-teal rounded-3xl p-6 sm:p-8">
      <h2 class="text-2xl font-bold text-white">{$t.services.ownershipTitle}</h2>
      <div class="mt-3 space-y-3 text-brand-100">
        {#each $t.services.ownership as para}
          <p>{para}</p>
        {/each}
      </div>

      <h3 class="mt-6 text-sm font-semibold uppercase tracking-wide text-white">
        {$t.services.ownsTitle}
      </h3>
      <ul class="mt-3 grid gap-2 sm:grid-cols-2">
        {#each $t.services.owns as item}
          <li class="flex items-center gap-2 text-sm text-white">
            <span aria-hidden="true" class="text-mauve">◆</span>{item}
          </li>
        {/each}
      </ul>
      <p class="mt-4 text-sm text-brand-100">{$t.services.accessNote}</p>

      <h3 class="mt-6 text-sm font-semibold uppercase tracking-wide text-white">
        {$t.services.leavingTitle}
      </h3>
      <ul class="mt-3 space-y-1">
        {#each $t.services.leaving as item}
          <li class="flex gap-2 text-sm text-brand-100">
            <span aria-hidden="true" class="text-reef-300">✔</span>{item}
          </li>
        {/each}
      </ul>
      <div class="mono mt-5 flex flex-wrap gap-x-6 gap-y-1 text-sm font-bold text-reef-300">
        {#each $t.services.leavingSlogans as line}
          <span>{line}</span>
        {/each}
      </div>
    </div>
  </section>

  <!-- Websites -->
  <section class="mt-14">
    <h2 class="text-2xl font-bold text-white">{$t.services.websitesTitle}</h2>
    <div class="mt-3 space-y-3 text-brand-100">
      {#each $t.services.websites as para}
        <p>{para}</p>
      {/each}
    </div>

    <h3 class="mt-8 text-lg font-bold text-white">{$t.services.websiteServiceTitle}</h3>
    <ul class="mt-3 grid gap-2 sm:grid-cols-2">
      {#each $t.services.websiteService as item}
        <li class="glass rounded-xl px-4 py-3 text-sm text-white">{item}</li>
      {/each}
    </ul>
    <p class="mt-4 text-sm text-brand-100">{$t.services.websiteServiceNote}</p>

    <h3 class="mt-10 text-lg font-bold text-white">{$t.services.websitePricingTitle}</h3>
    <div class="mt-4 grid gap-4 md:grid-cols-2">
      <div class="glass rounded-3xl p-6">
        <h4 class="text-base font-bold text-white">{$t.services.websiteSetupTitle}</h4>
        <p class="mono mt-2 text-2xl font-black text-reef-300">
          <span class="text-base font-bold text-brand-200">{$t.services.fromLabel}</span>
          {price(SERVICE_PRICING.websiteSetupFrom)}
        </p>
        <ul class="mt-3 space-y-2 text-sm text-brand-100">
          {#each $t.services.websiteSetupIncludes as item}
            <li class="flex gap-2">
              <span aria-hidden="true" class="text-reef-300">·</span>{item}
            </li>
          {/each}
        </ul>
      </div>
      <div class="glass rounded-3xl p-6">
        <h4 class="text-base font-bold text-white">{$t.services.websiteMaintenanceTitle}</h4>
        <p class="mono mt-2 text-2xl font-black text-reef-300">
          {price(SERVICE_PRICING.websiteMonthly)}<span class="text-base font-bold text-brand-200"
            >{$t.services.perMonth}</span
          >
        </p>
        <ul class="mt-3 space-y-2 text-sm text-brand-100">
          {#each $t.services.websiteMaintenanceIncludes as item}
            <li class="flex gap-2">
              <span aria-hidden="true" class="text-reef-300">·</span>{item}
            </li>
          {/each}
        </ul>
      </div>
    </div>
    <p class="mt-4 text-sm text-brand-100">{$t.services.websitePricingNote}</p>
  </section>

  <!-- Close -->
  <section class="mt-14">
    <div
      class="glow-teal flex flex-col gap-5 rounded-3xl border border-reef-400/30 bg-reef-400/5 p-6 sm:p-8"
    >
      <div>
        <h2 class="text-2xl font-bold text-white">{$t.services.closingTitle}</h2>
        <p class="mt-2 text-brand-100">{$t.services.closingBlurb}</p>
      </div>
      <ul class="grid gap-2 sm:grid-cols-2">
        {#each $t.services.closing as item}
          <li class="flex items-center gap-2 text-sm font-semibold text-white">
            <span aria-hidden="true" class="text-reef-300">✔</span>{item}
          </li>
        {/each}
      </ul>
      <p class="mono text-xl font-black text-reef-300">{$t.services.slogan}</p>

      <div class="border-t border-white/10 pt-5">
        <h3 class="text-lg font-bold text-white">{$t.services.ctaTitle}</h3>
        <p class="mt-1 text-sm text-brand-100">{$t.services.ctaBlurb}</p>
        <div class="mt-4 flex flex-wrap gap-2">
          <a
            href={`mailto:${CONTACT.email}?subject=${encodeURIComponent('FunDive for our dive shop')}`}
            class="flex items-center gap-2 rounded-full bg-reef-400 px-5 py-2 text-sm font-bold text-brand-950 transition-colors hover:bg-reef-300"
          >
            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path
                d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z"
              />
            </svg>
            {$t.services.emailUs}
          </a>
          <a
            href={SOCIAL.line}
            target="_blank"
            rel="noopener"
            class="flex items-center gap-2 rounded-full border border-white/40 px-5 py-2 text-sm font-bold text-white transition-colors hover:bg-white/15"
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
            class="flex items-center gap-2 rounded-full border border-white/40 px-5 py-2 text-sm font-bold text-white transition-colors hover:bg-white/15"
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
