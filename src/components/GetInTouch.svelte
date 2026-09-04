<script lang="ts">
  import type { Snippet } from 'svelte'
  import { CONTACT, SOCIAL } from '$content/settings'
  import { LINE_PATH, WHATSAPP_PATH } from './brand-icons'
  import { t } from '$engine/i18n'

  // Refactored from app-fundivers/wix/home/request.html. The Wix version
  // postMessages to a backend webMethod that emails via nodemailer; this
  // static site has no backend, so submissions open a pre-filled mailto to
  // fundiverstw@gmail.com instead (captcha dropped — there's no endpoint to spam).

  // The three square tiles below share one look and one icon frame; only the
  // shape inside, the label, and what a click does are different.
  const TILE =
    'glass flex aspect-[3/2] flex-col items-center justify-center gap-3 rounded-2xl p-4 text-center transition-all hover:-translate-y-0.5 hover:shadow-md'

  // Six fields share one look; only the textarea adds anything of its own.
  const LABEL = 'text-[0.7rem] font-semibold uppercase tracking-widest text-brand-200'
  const FIELD =
    'mt-1 w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-white placeholder:text-brand-300 focus:border-reef-300 focus:outline-none'

  // A try-dive is a PADI course with a name, and the form says so. The id is
  // the course's folder under content/courses, which is also its address;
  // contact.spec.ts follows the link, so renaming the folder without renaming
  // this fails the suite rather than quietly leaving a dead link behind.
  const DSD_HREF = '/courses/padi-discover-scuba-diving-program'

  type RequestType = 'try-dive' | 'course'

  // `active` is bindable so a parent can open the form directly — e.g. the
  // "Get in touch" button on a course / dive-site page — not only the tiles
  // below. Left unbound (as on the homepage) it behaves as before.
  let { active = $bindable(null) }: { active?: RequestType | null } = $props()
  let sent = $state(false)
  let name = $state('')
  let email = $state('')
  let people = $state(1)
  let from = $state('')
  let until = $state('')
  let message = $state('')

  // The earliest date the pickers offer. Built from the browser's own clock
  // rather than toISOString(), which is UTC: in Taipei that would offer
  // yesterday to anyone filling the form before 08:00.
  const now = new Date()
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`

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
    const subject = `${TITLES[active]}: ${name || 'Website request'}`
    // The end date is optional: someone free on one day only fills in the
    // first. These labels stay in English whatever the visitor is reading,
    // because they are read in the shop's inbox, not on the site.
    const dates = until && until !== from ? `${from} to ${until}` : from
    const body =
      `Request: ${TITLES[active]}\n` +
      `Name: ${name}\n` +
      `Email: ${email}\n` +
      `People: ${people}\n` +
      `Available: ${dates}\n\n` +
      `${message}`
    window.location.href = `mailto:${CONTACT.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    active = null
    sent = true
  }
</script>

{#snippet icon(shape: Snippet)}
  <svg
    class="h-12 w-12 text-reef-300"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    {@render shape()}
  </svg>
{/snippet}

<!-- What the request is for, under the heading of the form making it: the name
     of the thing, and a plain sentence about it. -->
{#snippet blurb(href: string, label: string, text: string)}
  <a
    {href}
    class="mt-1 inline-block text-sm font-semibold text-reef-300 underline-offset-4 hover:underline"
  >
    {label}
  </a>
  <p class="mt-1 text-sm text-brand-200">{text}</p>
{/snippet}

{#snippet calendarShape()}
  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
  <line x1="16" y1="2" x2="16" y2="6" />
  <line x1="8" y1="2" x2="8" y2="6" />
  <line x1="3" y1="10" x2="21" y2="10" />
{/snippet}

{#snippet diverShape()}
  <circle cx="12" cy="9" r="5" />
  <path d="M9 13l-2 8M15 13l2 8" />
  <path d="M7 9h-3M20 9h-3" />
{/snippet}

{#snippet mortarboardShape()}
  <path d="M22 10L12 5 2 10l10 5 10-5z" />
  <path d="M6 12v5c3 3 9 3 12 0v-5" />
  <line x1="22" y1="10" x2="22" y2="16" />
{/snippet}

<section id="get-in-touch" class="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
  <h2 class="text-center text-3xl font-bold tracking-tight text-white">{$t.getInTouch.title}</h2>

  <div class="mt-8 grid gap-4 sm:grid-cols-3">
    <a href="/calendar" class={TILE}>
      {@render icon(calendarShape)}
      <span class="text-base font-bold text-white">{$t.getInTouch.seeCalendar}</span>
    </a>

    <button
      type="button"
      onclick={() => open('try-dive')}
      class={`${TILE} ${active === 'try-dive' ? 'ring-2 ring-reef-300' : ''}`}
    >
      {@render icon(diverShape)}
      <span class="text-base font-bold text-white">{$t.getInTouch.tryDive}</span>
    </button>

    <button
      type="button"
      onclick={() => open('course')}
      class={`${TILE} ${active === 'course' ? 'ring-2 ring-reef-300' : ''}`}
    >
      {@render icon(mortarboardShape)}
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
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"
          ><path d={LINE_PATH} /></svg
        >
        LINE
      </a>
      <a
        href={SOCIAL.whatsapp}
        target="_blank"
        rel="noopener"
        class="flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-transform hover:-translate-y-0.5"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"
          ><path d={WHATSAPP_PATH} /></svg
        >
        WhatsApp
      </a>
    </div>
  </div>

  {#if active}
    <form class="glass mt-4 rounded-2xl p-6" onsubmit={submit}>
      <div class="mb-4 text-center">
        <h3 class="text-lg font-bold text-white">{TITLES[active]}</h3>
        <!-- A try-dive is sold as PADI's Discover Scuba Diving, and a course
             request is for one of twenty-one courses. Either way this is where
             someone who has just decided to ask can read what they are asking
             for, and go and look at it without losing the form. -->
        {#if active === 'try-dive'}
          {@render blurb(DSD_HREF, $t.getInTouch.dsd, $t.getInTouch.dsdDesc)}
        {:else}
          {@render blurb('/courses', $t.courses.title, $t.getInTouch.coursesDesc)}
        {/if}
      </div>
      <div class="grid gap-4">
        <label class="block">
          <span class={LABEL}>{$t.getInTouch.name}</span>
          <input bind:value={name} required autocomplete="name" class={FIELD} />
        </label>
        <label class="block">
          <span class={LABEL}>{$t.getInTouch.email}</span>
          <input bind:value={email} type="email" required autocomplete="email" class={FIELD} />
        </label>

        <!-- How many, and when. The shop had to ask both by reply before it
             could answer a single enquiry, so a request that arrives without
             them costs a day. They sit on one row with the party size so the
             form stays a form rather than becoming a questionnaire;
             `color-scheme: dark` is what makes the browser's own calendar icon
             and picker legible against this panel. -->
        <div class="grid gap-4 sm:grid-cols-3">
          <label class="block">
            <span class={LABEL}>{$t.getInTouch.people}</span>
            <input bind:value={people} type="number" min="1" max="20" required class={FIELD} />
          </label>
          <label class="block">
            <span class={LABEL}>{$t.getInTouch.availableFrom}</span>
            <input
              bind:value={from}
              type="date"
              min={today}
              required
              class={`${FIELD} [color-scheme:dark]`}
            />
          </label>
          <label class="block">
            <span class={LABEL}>{$t.getInTouch.availableTo}</span>
            <input
              bind:value={until}
              type="date"
              min={from || today}
              class={`${FIELD} [color-scheme:dark]`}
            />
          </label>
        </div>

        <label class="block">
          <span class={LABEL}>{$t.getInTouch.request}</span>
          <textarea
            bind:value={message}
            required
            rows="4"
            placeholder={$t.getInTouch.requestPlaceholder}
            class={`${FIELD} resize-y`}></textarea>
        </label>
      </div>
      <div class="mt-5 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onclick={cancel}
          class="rounded-full border border-white/30 px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/10"
        >
          {$t.getInTouch.cancel}
        </button>
        <button
          type="submit"
          class="rounded-full bg-reef-400 px-6 py-2 text-sm font-semibold text-brand-950 transition-colors hover:bg-reef-300"
        >
          {$t.getInTouch.send}
        </button>
      </div>
    </form>
  {/if}

  {#if sent}
    {@const parts = $t.getInTouch.sent.split('{email}')}
    <div class="glass mt-4 rounded-2xl p-6 text-center text-brand-100">
      {parts[0]}<a
        class="font-semibold text-reef-300 hover:text-reef-200"
        href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a
      >{parts[1] ?? ''}
    </div>
  {/if}
</section>
