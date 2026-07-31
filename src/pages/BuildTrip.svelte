<script lang="ts">
  import PageHeader from '$components/PageHeader.svelte'
  import Photo from '$components/Photo.svelte'
  import { DIVE_SITES } from '$content/dive-sites'
  import { siteText } from '$engine/i18n-content'
  import { siteImage } from '$engine/photo-pool'
  import { CONTACT } from '$content/settings'
  import { t, locale } from '$engine/i18n'

  // Build-your-own-trip: assemble an ordered, day-by-day dive itinerary from our
  // sites, then send it as a pre-filled email (the site has no backend — same
  // contact pattern as Get In Touch). Nothing is stored; the itinerary lives in
  // component state until it's emailed.

  type Entry = { key: string; siteId: string; dives: number }
  type Day = { key: string; entries: Entry[] }

  // Stable keys for {#each}. A plain counter — no Date.now()/random needed.
  let uid = 0
  const key = () => `k${uid++}`

  let days = $state<Day[]>([{ key: key(), entries: [] }])
  let activeDay = $state(0)
  let name = $state('')
  let email = $state('')
  let dates = $state('')
  let groupSize = $state('')
  let notes = $state('')
  let error = $state('')

  // Two groups: Taiwan (local) and International (trip destinations), each A→Z.
  const byName = (a: { id: string }, b: { id: string }) =>
    siteText(a.id, 'en').name.localeCompare(siteText(b.id, 'en').name)
  const localSites = [...DIVE_SITES].filter((s) => !s.international).sort(byName)
  const intlSites = [...DIVE_SITES].filter((s) => s.international).sort(byName)

  let totalDives = $derived(
    days.reduce((n, d) => n + d.entries.reduce((m, e) => m + e.dives, 0), 0),
  )
  let totalSites = $derived(days.reduce((n, d) => n + d.entries.length, 0))

  function dayLabel(i: number): string {
    return $t.buildTrip.day.replace('{n}', String(i + 1))
  }

  function addSite(siteId: string) {
    days[activeDay].entries.push({ key: key(), siteId, dives: 1 })
    error = ''
  }
  function setDives(d: number, e: number, delta: number) {
    days[d].entries[e].dives = Math.min(6, Math.max(1, days[d].entries[e].dives + delta))
  }
  function removeEntry(d: number, e: number) {
    days[d].entries.splice(e, 1)
  }
  function moveEntry(d: number, e: number, dir: -1 | 1) {
    const to = e + dir
    if (to < 0 || to >= days[d].entries.length) return
    const [item] = days[d].entries.splice(e, 1)
    days[d].entries.splice(to, 0, item)
  }
  function addDay() {
    days.push({ key: key(), entries: [] })
    activeDay = days.length - 1
  }
  function removeDay(d: number) {
    if (days.length === 1) {
      days[0].entries = []
    } else {
      days.splice(d, 1)
    }
    activeDay = Math.min(activeDay, days.length - 1)
  }

  function send() {
    if (totalSites === 0) {
      error = $t.buildTrip.needSites
      return
    }
    const lines: string[] = ['My custom dive trip:', '']
    days.forEach((d, i) => {
      lines.push(`${dayLabel(i)}:`)
      if (!d.entries.length) lines.push('  (no sites)')
      for (const e of d.entries) lines.push(`  - ${siteText(e.siteId, $locale).name} ×${e.dives}`)
      lines.push('')
    })
    if (dates) lines.push(`Preferred dates: ${dates}`)
    if (groupSize) lines.push(`Group size: ${groupSize}`)
    if (notes) lines.push(`Notes: ${notes}`)
    const subject = `Custom trip request${name ? ` — ${name}` : ''}`
    window.location.href = `mailto:${CONTACT.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`
  }
</script>

<PageHeader title={$t.buildTrip.title} subtitle={$t.buildTrip.subtitle} />

<div class="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
  <p class="mx-auto max-w-3xl text-center text-brand-100">{$t.buildTrip.intro}</p>

  <div class="mt-10 grid gap-8 lg:grid-cols-2">
    <!-- Site palette -->
    <section>
      <div class="flex items-baseline justify-between gap-3">
        <h2 class="text-xl font-bold text-white">{$t.buildTrip.sitesTitle}</h2>
        <span class="mono shrink-0 text-xs text-reef-200">→ {dayLabel(activeDay)}</span>
      </div>

      {#snippet siteGroup(label: string, sites: typeof localSites)}
        <h3 class="mono mt-5 text-xs font-semibold uppercase tracking-widest text-brand-300">
          {label}
        </h3>
        <div class="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {#each sites as s (s.id)}
            {@const image = siteImage(s.id)}
            <button
              type="button"
              onclick={() => addSite(s.id)}
              class="group glass flex items-center gap-3 rounded-xl border border-white/10 p-2 text-left transition-all hover:-translate-y-0.5 hover:border-reef-400/60"
            >
              <span class="h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-white/10">
                {#if image}
                  <Photo {image} alt="" sizes="44px" class="h-full w-full object-cover" />
                {/if}
              </span>
              <span class="min-w-0 flex-1 truncate text-sm font-semibold text-white">
                {siteText(s.id, $locale).name}
              </span>
              <span
                class="mono shrink-0 rounded-full border border-reef-400/50 px-2 py-0.5 text-xs text-reef-200 group-hover:bg-reef-400 group-hover:text-brand-950"
              >
                + {$t.buildTrip.add}
              </span>
            </button>
          {/each}
        </div>
      {/snippet}

      {@render siteGroup($t.buildTrip.taiwan, localSites)}
      {@render siteGroup($t.buildTrip.international, intlSites)}
    </section>

    <!-- Itinerary -->
    <section>
      <div class="flex items-baseline justify-between gap-3">
        <h2 class="text-xl font-bold text-white">{$t.buildTrip.yourTrip}</h2>
        {#if totalSites > 0}
          <span class="mono shrink-0 text-xs text-brand-200">
            {days.length}
            {$t.buildTrip.unitDays} · {totalDives}
            {$t.buildTrip.unitDives} · {totalSites}
            {$t.buildTrip.unitSites}
          </span>
        {/if}
      </div>

      {#if totalSites === 0}
        <p class="glass mt-3 rounded-2xl border border-white/10 p-6 text-sm text-brand-200">
          {$t.buildTrip.emptyTrip}
        </p>
      {/if}

      <div class="mt-3 space-y-3">
        {#each days as d, di (d.key)}
          <div
            class={`rounded-2xl border p-3 transition-colors ${di === activeDay ? 'border-reef-400/60 bg-reef-400/10' : 'glass border-white/10'}`}
          >
            <div class="flex items-center justify-between gap-2">
              <button
                type="button"
                onclick={() => (activeDay = di)}
                class="flex items-baseline gap-2 text-left"
              >
                <span class="font-bold text-white">{dayLabel(di)}</span>
                {#if di === activeDay}
                  <span class="mono text-[10px] text-reef-200">{$t.buildTrip.activeDayHint}</span>
                {/if}
              </button>
              <button
                type="button"
                onclick={() => removeDay(di)}
                class="mono text-xs text-brand-300 transition-colors hover:text-red-300"
              >
                {$t.buildTrip.removeDay}
              </button>
            </div>

            {#if d.entries.length === 0}
              <p class="mt-2 text-xs text-brand-300">{$t.buildTrip.emptyDay}</p>
            {:else}
              <ul class="mt-2 space-y-1.5">
                {#each d.entries as e, ei (e.key)}
                  <li class="flex items-center gap-2 rounded-lg bg-black/20 px-2 py-1.5">
                    <span class="min-w-0 flex-1 truncate text-sm text-white">
                      {siteText(e.siteId, $locale).name}
                    </span>
                    <!-- dive-count stepper -->
                    <span class="flex shrink-0 items-center gap-1">
                      <button
                        type="button"
                        onclick={() => setDives(di, ei, -1)}
                        aria-label="−"
                        class="flex h-5 w-5 items-center justify-center rounded bg-white/10 text-white hover:bg-white/20"
                        >−</button
                      >
                      <span class="mono w-8 text-center text-xs text-reef-200">×{e.dives}</span>
                      <button
                        type="button"
                        onclick={() => setDives(di, ei, 1)}
                        aria-label="+"
                        class="flex h-5 w-5 items-center justify-center rounded bg-white/10 text-white hover:bg-white/20"
                        >+</button
                      >
                    </span>
                    <span class="flex shrink-0 items-center gap-0.5">
                      <button
                        type="button"
                        onclick={() => moveEntry(di, ei, -1)}
                        aria-label={$t.buildTrip.moveUp}
                        class="px-1 text-brand-300 hover:text-white">↑</button
                      >
                      <button
                        type="button"
                        onclick={() => moveEntry(di, ei, 1)}
                        aria-label={$t.buildTrip.moveDown}
                        class="px-1 text-brand-300 hover:text-white">↓</button
                      >
                      <button
                        type="button"
                        onclick={() => removeEntry(di, ei)}
                        aria-label={$t.buildTrip.remove}
                        class="px-1 text-brand-300 hover:text-red-300">✕</button
                      >
                    </span>
                  </li>
                {/each}
              </ul>
            {/if}
          </div>
        {/each}

        <button
          type="button"
          onclick={addDay}
          class="mono w-full rounded-2xl border border-dashed border-white/25 py-2.5 text-sm font-semibold text-reef-200 transition-colors hover:border-reef-400/60 hover:text-reef-100"
        >
          + {$t.buildTrip.addDay}
        </button>
      </div>

      <!-- Details + send -->
      <div class="glass mt-6 rounded-2xl border border-white/10 p-5">
        <h3 class="text-sm font-bold text-white">{$t.buildTrip.yourDetails}</h3>
        <div class="mt-3 grid gap-3 sm:grid-cols-2">
          <input
            bind:value={name}
            placeholder={$t.buildTrip.name}
            autocomplete="name"
            class="rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-brand-300 focus:border-reef-300 focus:outline-none"
          />
          <input
            bind:value={email}
            type="email"
            placeholder={$t.buildTrip.email}
            autocomplete="email"
            class="rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-brand-300 focus:border-reef-300 focus:outline-none"
          />
          <input
            bind:value={dates}
            placeholder={$t.buildTrip.dates}
            class="rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-brand-300 focus:border-reef-300 focus:outline-none"
          />
          <input
            bind:value={groupSize}
            placeholder={$t.buildTrip.groupSize}
            class="rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-brand-300 focus:border-reef-300 focus:outline-none"
          />
        </div>
        <textarea
          bind:value={notes}
          rows="2"
          placeholder={$t.buildTrip.notes}
          class="mt-3 w-full resize-y rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-brand-300 focus:border-reef-300 focus:outline-none"
        ></textarea>

        {#if error}
          <p class="mt-3 text-sm font-medium text-red-300">{error}</p>
        {/if}
        <button
          type="button"
          onclick={send}
          class="mono mt-4 w-full rounded-full bg-reef-400 px-6 py-3 font-semibold text-brand-950 shadow-[0_0_24px_-6px_rgba(44,208,197,0.8)] transition-colors hover:bg-reef-300"
        >
          {$t.buildTrip.send}
        </button>
      </div>
    </section>
  </div>
</div>
