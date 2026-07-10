<script lang="ts">
  import { CONTACT, SOCIAL } from '$content/settings'
  import { t } from '$engine/i18n'

  // Direct-message channels surfaced as quick contact buttons (brand glyphs +
  // colours). URLs live in SOCIAL (mirrored from app-fundivers' fundive.config).
  const LINE_PATH =
    'M24 10.304c0-5.369-5.383-9.738-12-9.738-6.616 0-12 4.369-12 9.738 0 4.814 4.269 8.846 10.036 9.608.391.084.922.258 1.057.592.121.303.079.778.039 1.085l-.171 1.027c-.053.303-.242 1.186 1.039.647 1.281-.54 6.911-4.069 9.428-6.967 1.739-1.907 2.573-3.842 2.573-5.99zm-18.988 2.871h-2.388c-.348 0-.629-.282-.629-.629V7.703c0-.348.282-.629.629-.629.348 0 .629.282.629.629v4.214h1.759c.348 0 .629.282.629.629 0 .348-.281.629-.629.629zm2.466-.629c0 .348-.282.629-.63.629-.347 0-.629-.282-.629-.629V7.703c0-.348.282-.629.629-.629.348 0 .63.282.63.629v4.843zm5.802 0c0 .27-.173.51-.43.595-.064.022-.132.034-.2.034-.202 0-.392-.097-.51-.261l-2.443-3.323v2.956c0 .348-.282.629-.629.629-.348 0-.63-.282-.63-.629V7.703c0-.27.173-.51.43-.595.063-.022.132-.034.2-.034.202 0 .392.097.51.261l2.443 3.323V7.703c0-.348.282-.629.63-.629.347 0 .629.282.629.629v4.843zm3.899-2.421c.348 0 .629.282.629.63 0 .347-.281.629-.629.629h-1.759v1.13h1.759c.348 0 .629.282.629.629 0 .348-.281.629-.629.629h-2.388c-.348 0-.629-.282-.629-.629V7.703c0-.348.281-.629.629-.629h2.388c.348 0 .629.282.629.629 0 .348-.281.63-.629.63h-1.759v1.13h1.759z'
  const WHATSAPP_PATH =
    'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z'

  // Refactored from app-fundivers/wix/home/request.html. The Wix version
  // postMessages to a backend webMethod that emails via nodemailer; this
  // static site has no backend, so submissions open a pre-filled mailto to
  // fundiverstw@gmail.com instead (captcha dropped — there's no endpoint to spam).

  type RequestType = 'try-dive' | 'course'

  let active = $state<RequestType | null>(null)
  let sent = $state(false)
  let name = $state('')
  let email = $state('')
  let message = $state('')

  let TITLES = $derived<Record<RequestType, string>>({
    'try-dive': $t.getInTouch.tryDive,
    course: $t.getInTouch.requestCourse,
  })

  function open(type: RequestType) {
    active = type
    sent = false
  }
  function cancel() {
    active = null
  }

  function submit(e: Event) {
    e.preventDefault()
    if (!active) return
    const subject = `${TITLES[active]} — ${name || 'Website request'}`
    const body =
      `Request: ${TITLES[active]}\n` +
      `Name: ${name}\n` +
      `Email: ${email}\n\n` +
      `${message}`
    window.location.href = `mailto:${CONTACT.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    active = null
    sent = true
  }
</script>

<section id="get-in-touch" class="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
  <h2 class="text-center text-3xl font-bold tracking-tight text-white">{$t.getInTouch.title}</h2>

  <div class="mt-8 grid gap-4 sm:grid-cols-3">
    <a
      href="/calendar"
      class="glass flex aspect-square flex-col items-center justify-center gap-3 rounded-2xl p-4 text-center transition-all hover:-translate-y-0.5 hover:shadow-md"
    >
      <svg class="h-12 w-12 text-reef-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
      <span class="text-base font-bold text-white">{$t.getInTouch.seeCalendar}</span>
    </a>

    <button
      type="button"
      onclick={() => open('try-dive')}
      class={`glass flex aspect-square flex-col items-center justify-center gap-3 rounded-2xl p-4 text-center transition-all hover:-translate-y-0.5 hover:shadow-md ${active === 'try-dive' ? 'ring-2 ring-reef-300' : ''}`}
    >
      <svg class="h-12 w-12 text-reef-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <circle cx="12" cy="9" r="5" />
        <path d="M9 13l-2 8M15 13l2 8" />
        <path d="M7 9h-3M20 9h-3" />
      </svg>
      <span class="text-base font-bold text-white">{$t.getInTouch.tryDive}</span>
    </button>

    <button
      type="button"
      onclick={() => open('course')}
      class={`glass flex aspect-square flex-col items-center justify-center gap-3 rounded-2xl p-4 text-center transition-all hover:-translate-y-0.5 hover:shadow-md ${active === 'course' ? 'ring-2 ring-reef-300' : ''}`}
    >
      <svg class="h-12 w-12 text-reef-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M22 10L12 5 2 10l10 5 10-5z" />
        <path d="M6 12v5c3 3 9 3 12 0v-5" />
        <line x1="22" y1="10" x2="22" y2="16" />
      </svg>
      <span class="text-base font-bold text-white">{$t.getInTouch.requestCourse}</span>
    </button>
  </div>

  <!-- Direct-message channels -->
  <div class="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
    <span class="mono text-sm text-brand-200">{$t.getInTouch.orMessage}</span>
    <div class="flex flex-wrap justify-center gap-3">
      <a
        href={SOCIAL.line}
        target="_blank"
        rel="noopener"
        class="flex items-center gap-2 rounded-full bg-[#06C755] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-transform hover:-translate-y-0.5"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d={LINE_PATH} /></svg>
        LINE
      </a>
      <a
        href={SOCIAL.whatsapp}
        target="_blank"
        rel="noopener"
        class="flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-transform hover:-translate-y-0.5"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d={WHATSAPP_PATH} /></svg>
        WhatsApp
      </a>
    </div>
  </div>

  {#if active}
    <form class="glass mt-4 rounded-2xl p-6" onsubmit={submit}>
      <h3 class="mb-4 text-center text-lg font-bold text-white">{TITLES[active]}</h3>
      <div class="grid gap-4">
        <label class="block">
          <span class="text-[0.7rem] font-semibold uppercase tracking-widest text-brand-200">{$t.getInTouch.name}</span>
          <input
            bind:value={name}
            required
            autocomplete="name"
            class="mt-1 w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-white placeholder:text-brand-300 focus:border-reef-300 focus:outline-none"
          />
        </label>
        <label class="block">
          <span class="text-[0.7rem] font-semibold uppercase tracking-widest text-brand-200">{$t.getInTouch.email}</span>
          <input
            bind:value={email}
            type="email"
            required
            autocomplete="email"
            class="mt-1 w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-white placeholder:text-brand-300 focus:border-reef-300 focus:outline-none"
          />
        </label>
        <label class="block">
          <span class="text-[0.7rem] font-semibold uppercase tracking-widest text-brand-200">{$t.getInTouch.request}</span>
          <textarea
            bind:value={message}
            required
            rows="4"
            placeholder={$t.getInTouch.requestPlaceholder}
            class="mt-1 w-full resize-y rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-white placeholder:text-brand-300 focus:border-reef-300 focus:outline-none"
          ></textarea>
        </label>
      </div>
      <div class="mt-5 flex flex-wrap justify-center gap-3">
        <button type="button" onclick={cancel} class="rounded-full border border-white/30 px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/10">
          {$t.getInTouch.cancel}
        </button>
        <button type="submit" class="rounded-full bg-reef-400 px-6 py-2 text-sm font-semibold text-brand-950 transition-colors hover:bg-reef-300">
          {$t.getInTouch.send}
        </button>
      </div>
    </form>
  {/if}

  {#if sent}
    {@const parts = $t.getInTouch.sent.split('{email}')}
    <div class="glass mt-4 rounded-2xl p-6 text-center text-brand-100">
      {parts[0]}<a class="font-semibold text-reef-300 hover:text-reef-200" href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>{parts[1] ?? ''}
    </div>
  {/if}
</section>
