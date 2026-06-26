<script lang="ts">
  import { CONTACT } from '../lib/config'
  import { t } from '../lib/i18n'

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
