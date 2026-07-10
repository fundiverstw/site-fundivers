<script lang="ts">
  import { path } from '$engine/router'
  import { courseByRouteId, courseId, coursePath, COURSES, type CourseCard } from '$content/courses'
  import { COURSE_GUIDES, sessionMatchesCourse } from '$content/course-guides'
  import { fetchUpcomingEvents, type UpcomingEvent } from '$engine/events'
  import { formatSpan, twd } from '$engine/format'
  import { registerUrl } from '$content/settings'
  import { t } from '$engine/i18n'

  const COURSE_BASE = 'https://www.fundiverstw.com/courses-1/'

  // Route param: /courses/<id>.
  let id = $derived($path.replace(/^\/courses\//, '').replace(/\/+$/, ''))
  let course = $derived(courseByRouteId(id))
  let guide = $derived(course ? (COURSE_GUIDES[courseId(course.slug)] ?? null) : null)

  // Live upcoming sessions for THIS course, matched by category code.
  let sessions = $state<UpcomingEvent[]>([])
  $effect(() => {
    const g = guide
    if (!g) return void (sessions = [])
    fetchUpcomingEvents()
      .then(
        (all) =>
          (sessions = all.filter(
            (e) => e.type === 'course' && sessionMatchesCourse(g, e.category),
          )),
      )
      .catch(() => (sessions = []))
  })

  $effect(() => {
    if (course) document.title = `${course.title} — FunDivers TW`
  })

  let facts = $derived.by(() => {
    const rows: Array<{ label: string; value: string }> = []
    if (guide?.prerequisites)
      rows.push({ label: $t.courseDetail.prerequisites, value: guide.prerequisites })
    if (guide?.minAge) rows.push({ label: $t.courseDetail.minAge, value: guide.minAge })
    if (guide?.duration) rows.push({ label: $t.courseDetail.duration, value: guide.duration })
    if (guide?.depth) rows.push({ label: $t.courseDetail.depth, value: guide.depth })
    if (guide?.certifies) rows.push({ label: $t.courseDetail.certifies, value: guide.certifies })
    return rows
  })

  // "Where to next" — resolve the guide's next ids to course cards.
  let nextCourses = $derived.by((): CourseCard[] => {
    if (!guide?.next?.length) return []
    return guide.next
      .map((nid) => COURSES.find((c) => courseId(c.slug) === nid))
      .filter((c): c is CourseCard => !!c)
  })
</script>

{#if !course}
  <section class="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6">
    <p class="glass rounded-2xl p-8 text-brand-100">{$t.courseDetail.notFound}</p>
    <a href="/courses" class="mt-6 inline-block text-reef-300 hover:text-reef-200"
      >{$t.courseDetail.back}</a
    >
  </section>
{:else}
  <article class="mx-auto max-w-[1100px] px-4 py-8 sm:px-6 sm:py-12">
    <a
      href="/courses"
      class="text-sm font-medium text-reef-300 transition-colors hover:text-reef-200"
    >
      {$t.courseDetail.back}
    </a>

    <!-- Hero -->
    <div
      class="relative mt-4 flex min-h-[16rem] flex-col justify-end overflow-hidden rounded-3xl border border-white/15 sm:min-h-[22rem]"
    >
      <img
        src={course.image}
        alt={course.title}
        class="absolute inset-0 h-full w-full object-cover"
      />
      <div
        class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent"
      ></div>
      <div class="relative z-10 p-6 sm:p-8">
        <h1 class="text-3xl font-bold tracking-tight text-white sm:text-4xl">{course.title}</h1>
        <p class="mt-2 max-w-2xl text-sm text-white/90 sm:text-base">{course.desc}</p>
      </div>
    </div>

    <div class="mt-8 grid gap-8 lg:grid-cols-[1fr_20rem]">
      <!-- Main column -->
      <div class="min-w-0">
        {#if guide?.overview}
          <h2 class="text-xl font-bold text-white">{$t.courseDetail.overview}</h2>
          <p class="mt-3 leading-relaxed text-brand-100">{guide.overview}</p>
        {/if}

        {#if guide?.youWillLearn?.length}
          <h2 class="mt-8 text-xl font-bold text-white">{$t.courseDetail.youWillLearn}</h2>
          <ul class="mt-3 space-y-2">
            {#each guide.youWillLearn as item}
              <li class="flex gap-2 text-brand-100">
                <span class="mt-0.5 text-reef-300" aria-hidden="true">✓</span>
                <span>{item}</span>
              </li>
            {/each}
          </ul>
        {/if}

        <!-- Upcoming sessions -->
        <h2 class="mt-8 text-xl font-bold text-white">{$t.courseDetail.upcoming}</h2>
        {#if sessions.length === 0}
          <p class="mt-3 text-brand-100">{$t.courseDetail.noDates}</p>
        {:else}
          <ul class="mt-3 grid gap-3">
            {#each sessions as ev (ev.id)}
              {@const price = twd(ev.startingAt)}
              <li class="glass flex items-center justify-between gap-4 rounded-xl p-4">
                <div class="min-w-0">
                  <p class="text-sm font-medium text-brand-200">
                    {formatSpan(ev.startDate, ev.endDate, ev.time)}
                  </p>
                </div>
                <div class="flex shrink-0 items-center gap-3">
                  {#if price}<span class="text-sm font-semibold text-white">from {price}</span>{/if}
                  <a
                    href={ev.fullyBooked ? '#contact' : registerUrl('course', ev.id)}
                    target={ev.fullyBooked ? undefined : '_blank'}
                    rel="noopener"
                    class="rounded-full bg-brand-600 px-4 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
                  >
                    {$t.courses.enroll}
                  </a>
                </div>
              </li>
            {/each}
          </ul>
        {/if}
      </div>

      <!-- Sidebar -->
      <aside class="lg:sticky lg:top-6 lg:self-start">
        <div class="glass rounded-2xl p-5">
          <h2 class="text-sm font-semibold uppercase tracking-wide text-white">
            {$t.courseDetail.quickFacts}
          </h2>
          <dl class="mt-3 space-y-2.5 text-sm">
            {#each facts as f}
              <div class="flex flex-col gap-0.5">
                <dt class="text-brand-300">{f.label}</dt>
                <dd class="font-medium text-white">{f.value}</dd>
              </div>
            {/each}
          </dl>
          <a
            href={`${COURSE_BASE}${course.slug}`}
            target="_blank"
            rel="noopener"
            class="mt-5 block rounded-full border border-white/40 px-4 py-2 text-center text-sm font-medium text-brand-100 transition-colors hover:bg-white/10"
          >
            {$t.courseDetail.fullPage}
          </a>
        </div>
      </aside>
    </div>

    <!-- Where to next -->
    {#if nextCourses.length}
      <h2 class="mt-10 text-xl font-bold text-white">{$t.courseDetail.next}</h2>
      <div class="mt-4 grid gap-4 sm:grid-cols-2">
        {#each nextCourses as nc}
          <a
            href={coursePath(nc)}
            class="group relative flex min-h-[9rem] flex-col justify-end overflow-hidden rounded-2xl border border-white/15 transition-colors hover:border-reef-400/50"
          >
            <img
              src={nc.image}
              alt=""
              loading="lazy"
              class="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div
              class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"
            ></div>
            <div class="relative z-10 p-4">
              <h3 class="font-bold text-white">{nc.title}</h3>
            </div>
          </a>
        {/each}
      </div>
    {/if}

    <!-- CTA -->
    <div
      class="glow-teal mt-10 flex flex-col items-start gap-4 rounded-3xl border border-reef-400/30 bg-reef-400/5 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8"
    >
      <div>
        <h2 class="text-xl font-bold text-white">{$t.courseDetail.cta}</h2>
        <p class="mt-1 text-sm text-brand-100">{$t.courseDetail.ctaText}</p>
      </div>
      <div class="flex flex-wrap gap-2">
        <a
          href="/calendar"
          class="rounded-full bg-reef-400 px-5 py-2 text-sm font-bold text-brand-950 transition-colors hover:bg-reef-300"
        >
          {$t.siteDetail.seeCalendar}
        </a>
        <a
          href="#contact"
          class="rounded-full border border-white/40 px-5 py-2 text-sm font-bold text-white transition-colors hover:bg-white/15"
        >
          {$t.courseDetail.contact}
        </a>
      </div>
    </div>
  </article>
{/if}
