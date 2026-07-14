<script lang="ts">
  import { path } from '$engine/router'
  import { courseByRouteId, courseId, coursePath, COURSES, type CourseCard } from '$content/courses'
  import { COURSE_GUIDES, sessionMatchesCourse } from '$content/course-guides'
  import { coursePoolImage } from '$engine/photo-pool'
  import { fetchUpcomingEvents, type UpcomingEvent } from '$engine/events'
  import { formatSpan, twd } from '$engine/format'
  import { registerUrl } from '$content/settings'
  import { t } from '$engine/i18n'
  import CallToAction from '$components/CallToAction.svelte'

  // Route param: /courses/<id>.
  let id = $derived($path.replace(/^\/courses\//, '').replace(/\/+$/, ''))
  let course = $derived(courseByRouteId(id))
  let guide = $derived(course ? (COURSE_GUIDES[courseId(course.slug)] ?? null) : null)

  // Four images staggered down the page. A course can pin its own set;
  // otherwise we use its cover plus three stable picks from the course photo pool.
  let images = $derived.by((): [string, string, string, string] => {
    if (!course) return ['', '', '', '']
    if (course.images) return course.images
    return [
      course.image,
      coursePoolImage(`${id}-2`) ?? course.image,
      coursePoolImage(`${id}-3`) ?? course.image,
      coursePoolImage(`${id}-4`) ?? course.image,
    ]
  })

  // Row 3 carries the time frame / phases when a course has them, else it falls
  // back to "what you'll learn". Row 4 carries the materials/equipment/notes.
  let hasTimeframe = $derived(!!(guide?.timeFrame || guide?.phases?.length))
  let hasResources = $derived(
    !!(guide?.materials?.length || guide?.equipment?.length || guide?.notes?.length),
  )

  // Prerequisites live in subsection 2 by default, or subsection 3 when the
  // guide opts in (prereqInTimeframe) — some courses read better that way.
  let hasPrereq = $derived(!!(guide?.prereqList?.length || guide?.prerequisites))
  let prereqInOverview = $derived(hasPrereq && !guide?.prereqInTimeframe)
  let prereqInTimeframe = $derived(hasPrereq && !!guide?.prereqInTimeframe)

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

  // "Where to next" — resolve the guide's next ids to course cards.
  let nextCourses = $derived.by((): CourseCard[] => {
    if (!guide?.next?.length) return []
    return guide.next
      .map((nid) => COURSES.find((c) => courseId(c.slug) === nid))
      .filter((c): c is CourseCard => !!c)
  })
</script>

<!-- One staggered row: an image on one side, arbitrary body on the other. On
     mobile it stacks (image first). `reverse` puts the image on the right. -->
{#snippet row(image: string, alt: string, reverse: boolean, body: import('svelte').Snippet)}
  <div
    class="flex flex-col gap-6 md:items-center md:gap-10 lg:gap-14 {reverse
      ? 'md:flex-row-reverse'
      : 'md:flex-row'}"
  >
    <div class="md:w-[46%]">
      <img
        src={image}
        {alt}
        loading="lazy"
        class="aspect-[4/3] w-full rounded-3xl border border-white/15 object-cover shadow-lg shadow-black/20"
      />
    </div>
    <div class="min-w-0 md:w-[54%]">
      {@render body()}
    </div>
  </div>
{/snippet}

<!-- Prerequisites — itemised when the guide gives a list, else a single line. -->
{#snippet prereqBlock()}
  <h3 class="text-lg font-bold text-white">{$t.courseDetail.prerequisites}</h3>
  {#if guide?.prereqList?.length}
    <ul class="glass mt-3 space-y-2 rounded-2xl p-5">
      {#each guide.prereqList as item}
        <li class="flex gap-2 text-brand-100">
          <span class="mt-0.5 text-reef-300" aria-hidden="true">✓</span>
          <span>{item}</span>
        </li>
      {/each}
    </ul>
  {:else if guide?.prerequisites}
    <div class="glass mt-3 rounded-2xl p-5">
      <p class="leading-relaxed text-brand-100">{guide.prerequisites}</p>
    </div>
  {/if}
{/snippet}

<!-- A labelled, always-expanded list (Materials / Equipment / Notes), in a card. -->
{#snippet bulletList(label: string, items: string[])}
  <h3 class="text-lg font-bold text-white">{label}</h3>
  <ul class="glass mt-3 space-y-2 rounded-2xl p-5">
    {#each items as it}
      <li class="flex gap-2 text-brand-100">
        <span class="mt-0.5 text-reef-300" aria-hidden="true">•</span>
        <span>{it}</span>
      </li>
    {/each}
  </ul>
{/snippet}

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

    <!-- Staggered main content: image ⟷ text, alternating down the page. -->
    <div class="mt-6 space-y-14 sm:mt-8 lg:space-y-20">
      <!-- 1 · img1 left, title + intro right -->
      {#snippet intro()}
        <h1 class="text-3xl font-bold tracking-tight text-white sm:text-4xl">{course.title}</h1>
        <div class="glass mt-4 rounded-2xl p-5">
          <p class="text-base leading-relaxed text-brand-100 sm:text-lg">
            {guide?.intro ?? course.desc}
          </p>
        </div>
      {/snippet}
      {@render row(images[0], course.title, false, intro)}

      <!-- 2 · overview (+ reasons, + prerequisites when here) left, img2 right -->
      {#if guide?.overview || guide?.reasons?.length || prereqInOverview}
        {#snippet overview()}
          {#if guide?.overview}
            <h2 class="text-xl font-bold text-white sm:text-2xl">{$t.courseDetail.overview}</h2>
            <div class="glass mt-3 rounded-2xl p-5">
              <p class="leading-relaxed text-brand-100">{guide.overview}</p>
            </div>
          {/if}
          {#if guide?.reasons?.length}
            {#if guide?.reasonsTitle}
              <h3 class="mt-6 text-lg font-bold text-white">{guide.reasonsTitle}</h3>
            {/if}
            <ol class="glass mt-3 space-y-2 rounded-2xl p-5">
              {#each guide.reasons as reason, i}
                <li class="flex gap-2 text-brand-100">
                  <span class="mt-0.5 font-semibold tabular-nums text-reef-300">{i + 1}.</span>
                  <span>{reason}</span>
                </li>
              {/each}
            </ol>
          {/if}
          {#if prereqInOverview}
            <div class:mt-6={!!(guide?.overview || guide?.reasons?.length)}>
              {@render prereqBlock()}
            </div>
          {/if}
        {/snippet}
        {@render row(images[1], course.title, true, overview)}
      {/if}

      <!-- 3 · img3 left, prerequisites (when here) + time frame + phases right -->
      {#if prereqInTimeframe || hasTimeframe || guide?.youWillLearn?.length}
        {#snippet details()}
          {#if prereqInTimeframe}
            {@render prereqBlock()}
          {/if}
          {#if hasTimeframe}
            {#if guide?.timeFrame}
              <h2
                class="text-xl font-bold text-white sm:text-2xl"
                class:mt-8={prereqInTimeframe}
              >
                {$t.courseDetail.timeFrame}
              </h2>
              <div class="glass mt-3 rounded-2xl p-5">
                <p class="leading-relaxed text-brand-100">{guide.timeFrame}</p>
              </div>
            {/if}
            {#if guide?.phases?.length}
              <ol class="mt-4 space-y-3">
                {#each guide.phases as ph}
                  <li class="glass rounded-xl p-4">
                    <p class="font-semibold text-white">{ph.name}</p>
                    <p class="mt-1 text-sm leading-relaxed text-brand-100">{ph.text}</p>
                  </li>
                {/each}
              </ol>
            {/if}
          {:else if guide?.youWillLearn?.length}
            <h2 class="text-xl font-bold text-white sm:text-2xl">{$t.courseDetail.youWillLearn}</h2>
            <ul class="glass mt-3 space-y-2 rounded-2xl p-5">
              {#each guide.youWillLearn as item}
                <li class="flex gap-2 text-brand-100">
                  <span class="mt-0.5 text-reef-300" aria-hidden="true">✓</span>
                  <span>{item}</span>
                </li>
              {/each}
            </ul>
          {/if}
        {/snippet}
        {@render row(images[2], course.title, false, details)}
      {/if}

      <!-- 4 · materials / equipment / notes left, img4 right -->
      {#if hasResources}
        {#snippet resources()}
          {#if guide?.materials?.length}
            {@render bulletList($t.courseDetail.materials, guide.materials)}
          {/if}
          {#if guide?.equipment?.length}
            <div class:mt-8={!!guide?.materials?.length}>
              {@render bulletList($t.courseDetail.equipment, guide.equipment)}
            </div>
          {/if}
          {#if guide?.notes?.length}
            <div class:mt-8={!!(guide?.materials?.length || guide?.equipment?.length)}>
              {@render bulletList($t.courseDetail.notes, guide.notes)}
            </div>
          {/if}
        {/snippet}
        {@render row(images[3], course.title, true, resources)}
      {/if}
    </div>

    <!-- Upcoming sessions -->
    <h2 class="mt-10 text-xl font-bold text-white sm:text-2xl">{$t.courseDetail.upcoming}</h2>
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

    <!-- Where to next -->
    {#if nextCourses.length}
      <h2 class="mt-10 text-xl font-bold text-white sm:text-2xl">{$t.courseDetail.next}</h2>
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
    <CallToAction
      title={$t.courseDetail.cta}
      text={$t.courseDetail.ctaText}
      calendarLabel={$t.siteDetail.seeCalendar}
      contactLabel={$t.courseDetail.contact}
    />
  </article>
{/if}
