<script lang="ts">
  import { fetchUpcomingEvents, type UpcomingEvent } from '$engine/events'
  import { formatSpan, twd } from '$engine/format'
  import { bookUrl, registerUrl } from '$content/settings'
  import { COURSES, coursePath } from '$content/courses'
  import { t } from '$engine/i18n'
  import PageHeader from '$components/PageHeader.svelte'

  let upcoming = $state<UpcomingEvent[]>([])
  let loading = $state(true)

  $effect(() => {
    fetchUpcomingEvents()
      .then((e) => (upcoming = e.filter((x) => x.type === 'course')))
      .catch(() => (upcoming = []))
      .finally(() => (loading = false))
  })
</script>

<PageHeader title={$t.courses.title} subtitle={$t.courses.subtitle} />

<section class="mx-auto max-w-[1600px] px-4 py-12 sm:px-6">
  <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    {#each COURSES as c}
      <a
        href={coursePath(c)}
        class="group relative flex aspect-square flex-col justify-end overflow-hidden rounded-3xl border border-white/15 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-reef-400/60 hover:shadow-[0_0_28px_-8px_rgba(44,208,197,0.6)]"
      >
        <img src={c.image} alt="" loading="lazy" class="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent"></div>
        <div class="relative z-10 p-5">
          <h3 class="text-lg font-bold text-white">{c.title}</h3>
          <p class="mt-1 line-clamp-3 text-sm text-white/85">{c.desc}</p>
        </div>
      </a>
    {/each}
  </div>
</section>

<!-- Live upcoming course sessions -->
<section>
  <div class="mx-auto max-w-[1600px] px-4 py-12 sm:px-6">
    <h2 class="text-2xl font-bold text-white">{$t.courses.upcomingDates}</h2>
    {#if loading}
      <div class="mt-6 grid gap-3">
        {#each Array(3) as _}
          <div class="h-16 animate-pulse rounded-xl bg-white/10"></div>
        {/each}
      </div>
    {:else if upcoming.length === 0}
      <p class="mt-4 text-brand-100">
        {$t.courses.noDates}
        <a href={bookUrl} target="_blank" rel="noopener" class="font-semibold text-reef-300">{$t.courses.getInTouch}</a>.
      </p>
    {:else}
      <ul class="mt-6 grid gap-3">
        {#each upcoming as ev (ev.id)}
          {@const price = twd(ev.startingAt)}
          <li class="glass flex items-center justify-between gap-4 rounded-xl p-4 shadow-sm">
            <div class="min-w-0">
              <h3 class="truncate font-semibold text-white">{ev.title}</h3>
              <p class="text-sm text-brand-200">{formatSpan(ev.startDate, ev.endDate, ev.time)}</p>
            </div>
            <div class="flex shrink-0 items-center gap-3">
              {#if price}<span class="text-sm font-semibold text-white">from {price}</span>{/if}
              <a
                href={registerUrl('course', ev.id)}
                target="_blank"
                rel="noopener"
                class="rounded-full bg-brand-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-brand-700"
              >
                {$t.courses.enroll}
              </a>
            </div>
          </li>
        {/each}
      </ul>
    {/if}
  </div>
</section>
