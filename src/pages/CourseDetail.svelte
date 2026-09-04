<script lang="ts">
  import Photo from '$components/Photo.svelte'
  import { SIZES, type ResponsiveImage } from '$engine/responsive-image'
  import { path, scrollToId } from '$engine/router'
  import { courseByRouteId, coursePath, COURSES, type CourseCard } from '$content/courses'
  import { sessionMatchesCourse, type BlockKey, type CourseDetails } from '$content/courses/details'
  import { coursePoolImage } from '$engine/photo-pool'
  import { fetchUpcomingEvents, type UpcomingEvent } from '$engine/events'
  import { formatSpan, twd } from '$engine/format'
  import { registerUrl } from '$content/settings'
  import { t, locale } from '$engine/i18n'
  import { courseText } from '$engine/i18n-content'
  import { courseDetails } from '$engine/i18n-details'
  import CallToAction from '$components/CallToAction.svelte'
  import GetInTouch from '$components/GetInTouch.svelte'

  // Route param: /courses/<id>.
  let id = $derived($path.replace(/^\/courses\//, '').replace(/\/+$/, ''))
  let course = $derived(courseByRouteId(id))
  let details = $derived(course ? courseDetails(course.id, $locale) : null)
  // The course's title in the current language (the English title stays the
  // identifier; courseText resolves the display text).
  let courseTitle = $derived(course ? courseText(course, $locale).title : '')

  // Opens the shared GetInTouch form below when "Get in touch" is clicked.
  let contactActive = $state<'try-dive' | 'course' | null>(null)

  // Four images staggered down the page. A course can pin its own set;
  // otherwise we use its cover plus three stable picks from the course photo pool.
  let images = $derived.by((): Array<ResponsiveImage | null> => {
    if (!course) return [null, null, null, null]
    if (course.images) return course.images
    return [
      course.image,
      coursePoolImage(id, '2') ?? course.image,
      coursePoolImage(id, '3') ?? course.image,
      coursePoolImage(id, '4') ?? course.image,
    ]
  })

  let hasTimeframe = $derived(!!(details?.timeFrame || details?.phases?.length))
  let hasPrereq = $derived(!!(details?.prereqList?.length || details?.prerequisites))

  // Does a content block have anything to show for this course?
  function blockHasData(k: BlockKey): boolean {
    switch (k) {
      case 'overview':
        return !!details?.overview
      case 'topics':
        return !!details?.youWillLearn?.length
      case 'reasons':
        return !!details?.reasons?.length
      case 'prerequisites':
        return hasPrereq
      case 'timeFrame':
        return hasTimeframe
      case 'covers':
        return !!(details?.covers?.length || details?.coversLead)
      case 'materials':
        return !!details?.materials?.length
      case 'equipment':
        return !!(details?.equipment?.length || details?.equipmentText)
      case 'notes':
        return !!details?.notes?.length
    }
  }

  // Default grouping for courses that don't lay their blocks out explicitly: the
  // title/intro alone, then overview + prerequisites, then the time frame (or
  // "what you'll learn" if the course has none), then materials/equipment/notes.
  function defaultLayout(g: CourseDetails): BlockKey[][] {
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
    if (!details) return [[]]
    const groups = details.subsections ?? defaultLayout(details)
    const filtered = groups.map((keys) => keys.filter(blockHasData))
    return [filtered[0] ?? [], ...filtered.slice(1).filter((g) => g.length > 0)]
  })

  // Live upcoming sessions for THIS course, matched by category code.
  let sessions = $state<UpcomingEvent[]>([])
  $effect(() => {
    const g = details
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
    if (course) document.title = `${courseTitle} · FunDivers TW`
  })

  // "Where to next" — the details's picks first, then filled to two with other
  // courses so every page always suggests two places to go next.
  let nextCourses = $derived.by((): CourseCard[] => {
    if (!course) return []
    const chosen: CourseCard[] = []
    const add = (c: CourseCard | undefined) => {
      if (c && c !== course && !chosen.includes(c)) chosen.push(c)
    }
    for (const nid of details?.next ?? []) add(COURSES.find((c) => c.id === nid))
    for (const c of COURSES) {
      if (chosen.length >= 2) break
      add(c)
    }
    return chosen.slice(0, 2)
  })
</script>

<!-- One staggered row: an image on one side, arbitrary body on the other. On
     mobile it stacks (image first). `reverse` puts the image on the right. -->
{#snippet row(
  image: ResponsiveImage | null,
  alt: string,
  reverse: boolean,
  body: import('svelte').Snippet,
)}
  <div
    class="flex flex-col gap-6 md:items-center md:gap-10 lg:gap-14 {reverse
      ? 'md:flex-row-reverse'
      : 'md:flex-row'}"
  >
    <div class="md:w-[46%]">
      <Photo
        {image}
        {alt}
        sizes={SIZES.card}
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
  <h3 class="text-t2 font-bold text-white">{$t.courseDetail.prerequisites}</h3>
  <div class="glass mt-3 rounded-2xl p-5">
    {#if details?.prereqLead}
      <p class="leading-relaxed text-brand-100">{details.prereqLead}</p>
    {/if}
    {#if details?.prereqList?.length}
      <ul class="space-y-2 {details?.prereqLead ? 'mt-3' : ''}">
        {#each details.prereqList as item}
          <li class="flex gap-2 text-brand-100">
            <span class="mt-0.5 text-reef-300" aria-hidden="true">✓</span>
            <span>{item}</span>
          </li>
        {/each}
      </ul>
    {:else if details?.prerequisites && !details?.prereqLead}
      <p class="leading-relaxed text-brand-100">{details.prerequisites}</p>
    {/if}
    {#if details?.prereqNote}
      <p class="mt-3 leading-relaxed text-brand-100">{details.prereqNote}</p>
    {/if}
  </div>
{/snippet}

<!-- A labelled, always-expanded list (Materials / Equipment / Notes), in a card. -->
{#snippet bulletList(label: string, items: string[])}
  <h3 class="text-t2 font-bold text-white">{label}</h3>
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
      <h2 class="text-t2 font-bold text-white">{$t.courseDetail.overview}</h2>
      <div class="glass mt-3 rounded-2xl p-5">
        <p class="leading-relaxed text-brand-100">{details?.overview}</p>
      </div>
    </div>
  {:else if key === 'topics'}
    <div>
      <h2 class="text-t2 font-bold text-white">
        {details?.topicsTitle ?? $t.courseDetail.youWillLearn}
      </h2>
      <ul class="glass mt-3 space-y-2 rounded-2xl p-5">
        {#each details?.youWillLearn ?? [] as item}
          <li class="flex gap-2 text-brand-100">
            <span class="mt-0.5 text-reef-300" aria-hidden="true">✓</span>
            <span>{item}</span>
          </li>
        {/each}
      </ul>
    </div>
  {:else if key === 'reasons'}
    <div>
      {#if details?.reasonsTitle}
        <h2 class="text-t2 font-bold text-white">{details.reasonsTitle}</h2>
      {/if}
      <ol class="glass mt-3 space-y-2 rounded-2xl p-5">
        {#each details?.reasons ?? [] as reason, i}
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
      {#if details?.timeFrame}
        <h2 class="text-t2 font-bold text-white">{$t.courseDetail.timeFrame}</h2>
        <div class="glass mt-3 rounded-2xl p-5">
          <p class="leading-relaxed text-brand-100">{details.timeFrame}</p>
        </div>
      {/if}
      {#if details?.phases?.length}
        <ol class="space-y-3 {details?.timeFrame ? 'mt-4' : ''}">
          {#each details.phases as ph}
            <li class="glass rounded-xl p-4">
              <p class="font-semibold text-white">{ph.name}</p>
              <p class="mt-1 text-t3 leading-relaxed text-brand-100">{ph.text}</p>
            </li>
          {/each}
        </ol>
      {/if}
    </div>
  {:else if key === 'covers'}
    <div>
      {#if details?.coversLead}
        <div class="glass rounded-2xl p-5">
          <p class="leading-relaxed text-brand-100">{details.coversLead}</p>
        </div>
      {/if}
      {#if details?.covers?.length}
        <ol class="space-y-3 {details?.coversLead ? 'mt-4' : ''}">
          {#each details.covers as ph}
            <li class="glass rounded-xl p-4">
              <p class="font-semibold text-white">{ph.name}</p>
              <p class="mt-1 text-t3 leading-relaxed text-brand-100">{ph.text}</p>
            </li>
          {/each}
        </ol>
      {/if}
      {#if details?.coversNote}
        <div class="glass mt-4 rounded-2xl p-5">
          <p class="leading-relaxed text-brand-100">{details.coversNote}</p>
        </div>
      {/if}
    </div>
  {:else if key === 'materials'}
    {#if details?.materialsRecommended?.length}
      <div>
        <h3 class="text-t2 font-bold text-white">{$t.courseDetail.materials}</h3>
        <div class="glass mt-3 rounded-2xl p-5">
          <ul class="space-y-2">
            {#each details?.materials ?? [] as it}
              <li class="flex gap-2 text-brand-100">
                <span class="mt-0.5 text-reef-300" aria-hidden="true">•</span>
                <span>{it}</span>
              </li>
            {/each}
          </ul>
          <p class="mt-4 text-t3 font-semibold uppercase tracking-wide text-brand-300">
            {$t.courseDetail.recommended}
          </p>
          <ul class="mt-2 space-y-2">
            {#each details.materialsRecommended as it}
              <li class="flex gap-2 text-brand-100">
                <span class="mt-0.5 text-reef-300" aria-hidden="true">•</span>
                <span>{it}</span>
              </li>
            {/each}
          </ul>
        </div>
      </div>
    {:else}
      <div>{@render bulletList($t.courseDetail.materials, details?.materials ?? [])}</div>
    {/if}
  {:else if key === 'equipment'}
    {#if details?.equipmentText}
      <div>
        <h3 class="text-t2 font-bold text-white">{$t.courseDetail.equipment}</h3>
        <div class="glass mt-3 rounded-2xl p-5">
          <p class="leading-relaxed text-brand-100">{details.equipmentText}</p>
        </div>
      </div>
    {:else}
      <div>{@render bulletList($t.courseDetail.equipment, details?.equipment ?? [])}</div>
    {/if}
  {:else if key === 'notes'}
    <div>{@render bulletList($t.courseDetail.notes, details?.notes ?? [])}</div>
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
      class="text-t3 font-medium text-reef-300 transition-colors hover:text-reef-200"
    >
      {$t.courseDetail.back}
    </a>

    <!-- Staggered main content: image ⟷ text, alternating down the page. The
         first row carries the title + intro; the rest follow the block layout. -->
    <div class="mt-6 space-y-14 sm:mt-8 lg:space-y-20">
      {#each subsections as keys, i}
        {#snippet body()}
          {#if i === 0}
            <h1 class="text-t1 font-bold tracking-tight text-white">{courseTitle}</h1>
            <div class="glass mt-4 rounded-2xl p-5">
              <p class="text-t2 leading-relaxed text-brand-100">
                {details?.intro ?? courseText(course, $locale).desc}
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
        {@render row(images[i % images.length], courseTitle, i % 2 === 1, body)}
      {/each}
    </div>

    <!-- Upcoming sessions -->
    <h2 class="mt-10 text-t2 font-bold text-white">{$t.courseDetail.upcoming}</h2>
    {#if sessions.length === 0}
      <p class="mt-3 text-brand-100">{$t.courseDetail.noDates}</p>
    {:else}
      <ul class="mt-3 grid gap-3">
        {#each sessions as ev (ev.id)}
          {@const price = twd(ev.startingAt)}
          <li class="glass flex items-center justify-between gap-4 rounded-xl p-4">
            <div class="min-w-0">
              <p class="text-t3 font-medium text-brand-200">
                {formatSpan(ev.startDate, ev.endDate, ev.time)}
              </p>
            </div>
            <div class="flex shrink-0 items-center gap-3">
              {#if price}<span class="text-t3 font-semibold text-white"
                  >{$t.common.fromPrice.replace('{price}', price)}</span
                >{/if}
              <a
                href={ev.fullyBooked ? '#contact' : registerUrl('course', ev.id)}
                target={ev.fullyBooked ? undefined : '_blank'}
                rel="noopener"
                class="rounded-full bg-brand-600 px-4 py-1.5 text-t3 font-semibold text-white transition-colors hover:bg-brand-700"
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
      <h2 class="mt-10 text-t2 font-bold text-white">{$t.courseDetail.next}</h2>
      <div class="mt-4 grid gap-4 sm:grid-cols-2">
        {#each nextCourses as nc}
          <a
            href={coursePath(nc)}
            class="group relative flex min-h-[9rem] flex-col justify-end overflow-hidden rounded-2xl border border-white/15 transition-colors hover:border-reef-400/50"
          >
            <Photo
              image={nc.image}
              alt=""
              class="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div
              class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"
            ></div>
            <div class="relative z-10 p-4">
              <h3 class="font-bold text-white">{courseText(nc, $locale).title}</h3>
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
      onContact={() => {
        contactActive = 'course'
        scrollToId('get-in-touch')
      }}
    />

    <GetInTouch bind:active={contactActive} />
  </article>
{/if}
