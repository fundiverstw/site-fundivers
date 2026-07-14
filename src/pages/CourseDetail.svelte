<script lang="ts">
  import { path } from '$engine/router'
  import { courseByRouteId, courseId, coursePath, COURSES, type CourseCard } from '$content/courses'
  import {
    COURSE_GUIDES,
    sessionMatchesCourse,
    type BlockKey,
    type CourseGuide,
  } from '$content/course-guides'
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

  let hasTimeframe = $derived(!!(guide?.timeFrame || guide?.phases?.length))
  let hasPrereq = $derived(!!(guide?.prereqList?.length || guide?.prerequisites))

  // Does a content block have anything to show for this course?
  function blockHasData(k: BlockKey): boolean {
    switch (k) {
      case 'overview':
        return !!guide?.overview
      case 'topics':
        return !!guide?.youWillLearn?.length
      case 'reasons':
        return !!guide?.reasons?.length
      case 'prerequisites':
        return hasPrereq
      case 'timeFrame':
        return hasTimeframe
      case 'materials':
        return !!guide?.materials?.length
      case 'equipment':
        return !!(guide?.equipment?.length || guide?.equipmentText)
      case 'notes':
        return !!guide?.notes?.length
    }
  }

  // Default grouping for guides that don't lay their blocks out explicitly: the
  // title/intro alone, then overview + prerequisites, then the time frame (or
  // "what you'll learn" if the course has none), then materials/equipment/notes.
  function defaultLayout(g: CourseGuide): BlockKey[][] {
    return [
      [],
      ['overview', 'prerequisites'],
      g.timeFrame || g.phases?.length ? ['timeFrame'] : ['topics'],
      ['materials', 'equipment', 'notes'],
    ]
  }

  // The staggered subsections. The first shares its row with the title/intro and
  // always renders (even when empty); later empty subsections are dropped, and
  // blocks with no data are removed throughout.
  let subsections = $derived.by((): BlockKey[][] => {
    if (!guide) return [[]]
    const groups = guide.subsections ?? defaultLayout(guide)
    const filtered = groups.map((keys) => keys.filter(blockHasData))
    return [filtered[0] ?? [], ...filtered.slice(1).filter((g) => g.length > 0)]
  })

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
    if (course) document.title = `${course.title} · FunDivers TW`
  })

  // "Where to next" — the guide's picks first, then filled to two with other
  // courses so every page always suggests two places to go next.
  let nextCourses = $derived.by((): CourseCard[] => {
    if (!course) return []
    const chosen: CourseCard[] = []
    const add = (c: CourseCard | undefined) => {
      if (c && c !== course && !chosen.includes(c)) chosen.push(c)
    }
    for (const nid of guide?.next ?? []) add(COURSES.find((c) => courseId(c.slug) === nid))
    for (const c of COURSES) {
      if (chosen.length >= 2) break
      add(c)
    }
    return chosen.slice(0, 2)
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

<!-- Prerequisites — an optional lead-in, the itemised list (or a single line),
     and an optional trailing note, all in one card. -->
{#snippet prereqBlock()}
  <h3 class="text-xl font-bold text-white">{$t.courseDetail.prerequisites}</h3>
  <div class="glass mt-3 rounded-2xl p-5">
    {#if guide?.prereqLead}
      <p class="leading-relaxed text-brand-100">{guide.prereqLead}</p>
    {/if}
    {#if guide?.prereqList?.length}
      <ul class="space-y-2 {guide?.prereqLead ? 'mt-3' : ''}">
        {#each guide.prereqList as item}
          <li class="flex gap-2 text-brand-100">
            <span class="mt-0.5 text-reef-300" aria-hidden="true">✓</span>
            <span>{item}</span>
          </li>
        {/each}
      </ul>
    {:else if guide?.prerequisites && !guide?.prereqLead}
      <p class="leading-relaxed text-brand-100">{guide.prerequisites}</p>
    {/if}
    {#if guide?.prereqNote}
      <p class="mt-3 leading-relaxed text-brand-100">{guide.prereqNote}</p>
    {/if}
  </div>
{/snippet}

<!-- A labelled, always-expanded list (Materials / Equipment / Notes), in a card. -->
{#snippet bulletList(label: string, items: string[])}
  <h3 class="text-xl font-bold text-white">{label}</h3>
  <ul class="glass mt-3 space-y-2 rounded-2xl p-5">
    {#each items as it}
      <li class="flex gap-2 text-brand-100">
        <span class="mt-0.5 text-reef-300" aria-hidden="true">•</span>
        <span>{it}</span>
      </li>
    {/each}
  </ul>
{/snippet}

<!-- One content block: heading + card(s). Each is wrapped so a subsection can
     space its blocks evenly. Only blocks with data are ever asked to render. -->
{#snippet block(key: BlockKey)}
  {#if key === 'overview'}
    <div>
      <h2 class="text-xl font-bold text-white">{$t.courseDetail.overview}</h2>
      <div class="glass mt-3 rounded-2xl p-5">
        <p class="leading-relaxed text-brand-100">{guide?.overview}</p>
      </div>
    </div>
  {:else if key === 'topics'}
    <div>
      <h2 class="text-xl font-bold text-white">
        {guide?.topicsTitle ?? $t.courseDetail.youWillLearn}
      </h2>
      <ul class="glass mt-3 space-y-2 rounded-2xl p-5">
        {#each guide?.youWillLearn ?? [] as item}
          <li class="flex gap-2 text-brand-100">
            <span class="mt-0.5 text-reef-300" aria-hidden="true">✓</span>
            <span>{item}</span>
          </li>
        {/each}
      </ul>
    </div>
  {:else if key === 'reasons'}
    <div>
      {#if guide?.reasonsTitle}
        <h2 class="text-xl font-bold text-white">{guide.reasonsTitle}</h2>
      {/if}
      <ol class="glass mt-3 space-y-2 rounded-2xl p-5">
        {#each guide?.reasons ?? [] as reason, i}
          <li class="flex gap-2 text-brand-100">
            <span class="mt-0.5 font-semibold tabular-nums text-reef-300">{i + 1}.</span>
            <span>{reason}</span>
          </li>
        {/each}
      </ol>
    </div>
  {:else if key === 'prerequisites'}
    <div>{@render prereqBlock()}</div>
  {:else if key === 'timeFrame'}
    <div>
      {#if guide?.timeFrame}
        <h2 class="text-xl font-bold text-white">{$t.courseDetail.timeFrame}</h2>
        <div class="glass mt-3 rounded-2xl p-5">
          <p class="leading-relaxed text-brand-100">{guide.timeFrame}</p>
        </div>
      {/if}
      {#if guide?.phases?.length}
        <ol class="space-y-3 {guide?.timeFrame ? 'mt-4' : ''}">
          {#each guide.phases as ph}
            <li class="glass rounded-xl p-4">
              <p class="font-semibold text-white">{ph.name}</p>
              <p class="mt-1 text-sm leading-relaxed text-brand-100">{ph.text}</p>
            </li>
          {/each}
        </ol>
      {/if}
    </div>
  {:else if key === 'materials'}
    {#if guide?.materialsRecommended?.length}
      <div>
        <h3 class="text-xl font-bold text-white">{$t.courseDetail.materials}</h3>
        <div class="glass mt-3 rounded-2xl p-5">
          <ul class="space-y-2">
            {#each guide?.materials ?? [] as it}
              <li class="flex gap-2 text-brand-100">
                <span class="mt-0.5 text-reef-300" aria-hidden="true">•</span>
                <span>{it}</span>
              </li>
            {/each}
          </ul>
          <p class="mt-4 text-sm font-semibold uppercase tracking-wide text-brand-300">
            {$t.courseDetail.recommended}
          </p>
          <ul class="mt-2 space-y-2">
            {#each guide.materialsRecommended as it}
              <li class="flex gap-2 text-brand-100">
                <span class="mt-0.5 text-reef-300" aria-hidden="true">•</span>
                <span>{it}</span>
              </li>
            {/each}
          </ul>
        </div>
      </div>
    {:else}
      <div>{@render bulletList($t.courseDetail.materials, guide?.materials ?? [])}</div>
    {/if}
  {:else if key === 'equipment'}
    {#if guide?.equipmentText}
      <div>
        <h3 class="text-xl font-bold text-white">{$t.courseDetail.equipment}</h3>
        <div class="glass mt-3 rounded-2xl p-5">
          <p class="leading-relaxed text-brand-100">{guide.equipmentText}</p>
        </div>
      </div>
    {:else}
      <div>{@render bulletList($t.courseDetail.equipment, guide?.equipment ?? [])}</div>
    {/if}
  {:else if key === 'notes'}
    <div>{@render bulletList($t.courseDetail.notes, guide?.notes ?? [])}</div>
  {/if}
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

    <!-- Staggered main content: image ⟷ text, alternating down the page. The
         first row carries the title + intro; the rest follow the block layout. -->
    <div class="mt-6 space-y-14 sm:mt-8 lg:space-y-20">
      {#each subsections as keys, i}
        {#snippet body()}
          {#if i === 0}
            <h1 class="text-3xl font-bold tracking-tight text-white sm:text-4xl">{course.title}</h1>
            <div class="glass mt-4 rounded-2xl p-5">
              <p class="text-base leading-relaxed text-brand-100 sm:text-lg">
                {guide?.intro ?? course.desc}
              </p>
            </div>
          {/if}
          {#if keys.length}
            <div class="space-y-8 {i === 0 ? 'mt-8' : ''}">
              {#each keys as k}
                {@render block(k)}
              {/each}
            </div>
          {/if}
        {/snippet}
        {@render row(images[i % images.length], course.title, i % 2 === 1, body)}
      {/each}
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
