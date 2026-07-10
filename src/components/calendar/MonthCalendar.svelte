<script lang="ts">
  import {
    format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth,
    addMonths, subMonths, startOfWeek, endOfWeek,
  } from 'date-fns'
  import { assignTracks, segmentsForDay, type CellSegment } from '$engine/calendar-layout'
  import { courseColor, diveIsTripOrBoat, type CourseColor } from '$engine/event-colors'
  import { formatEventSpan } from '$engine/format'
  import { isPastEvent, type CalEvent } from '$engine/events'
  import { t } from '$engine/i18n'

  // Ported from app-fundivers MonthCalendar.tsx, trimmed to the public,
  // read-only feature set (no staff-busy overlay, drag-reschedule, or private
  // events). Color buckets and layout are identical.

  let {
    month,
    events,
    onMonthChange,
    onPickEvent,
    hidePastInList = true,
    disablePastEvents = true,
  }: {
    month: Date
    events: CalEvent[]
    onMonthChange: (d: Date) => void
    onPickEvent: (ev: CalEvent) => void
    hidePastInList?: boolean
    disablePastEvents?: boolean
  } = $props()

  const TRACK_HEIGHT = 18
  const TRACK_GAP = 2

  // Yellow needs dark text; every other fill pairs with white.
  const DIVE_LOCAL_BAR = 'bg-emerald-600 text-white'
  const DIVE_LOCAL_BAR_HOVER = 'bg-emerald-500 text-white'
  const DIVE_LOCAL_DOT = 'bg-emerald-600'
  const DIVE_TRIP_BAR = 'bg-yellow-400 text-blue-950'
  const DIVE_TRIP_BAR_HOVER = 'bg-yellow-300 text-blue-950'
  const DIVE_TRIP_DOT = 'bg-yellow-400'
  const COURSE_BAR: Record<CourseColor, string> = {
    ow: 'bg-blue-600 text-white', aow: 'bg-orange-500 text-white',
    rescue: 'bg-red-600 text-white', specialty: 'bg-purple-600 text-white',
  }
  const COURSE_BAR_HOVER: Record<CourseColor, string> = {
    ow: 'bg-blue-500 text-white', aow: 'bg-orange-400 text-white',
    rescue: 'bg-red-500 text-white', specialty: 'bg-purple-500 text-white',
  }
  const COURSE_DOT: Record<CourseColor, string> = {
    ow: 'bg-blue-600', aow: 'bg-orange-500', rescue: 'bg-red-600', specialty: 'bg-purple-600',
  }
  let TYPE_LABELS = $derived<Record<CalEvent['type'], string>>({ dive: $t.common.dive, course: $t.common.course })

  function eventBarClass(ev: CalEvent, hovered: boolean): string {
    if (ev.type === 'dive') {
      if (diveIsTripOrBoat(ev)) return hovered ? DIVE_TRIP_BAR_HOVER : DIVE_TRIP_BAR
      return hovered ? DIVE_LOCAL_BAR_HOVER : DIVE_LOCAL_BAR
    }
    const key = courseColor(ev.title)
    return hovered ? COURSE_BAR_HOVER[key] : COURSE_BAR[key]
  }

  let diveShown = $state(true)
  let hiddenCourses = $state<Set<string>>(new Set())
  let hoveredEventId = $state<string | null>(null)
  let legendOpen = $state(false)
  let legendEl = $state<HTMLDivElement | null>(null)

  const todayStart = (() => { const d = new Date(); d.setHours(0, 0, 0, 0); return d })()

  let days = $derived(eachDayOfInterval({ start: startOfMonth(month), end: endOfMonth(month) }))

  let courseCategories = $derived.by(() => {
    const byCat = new Map<string, CourseColor>()
    for (const e of events) {
      if (e.type !== 'course') continue
      const cat = e.course_category ?? e.title
      if (!byCat.has(cat)) byCat.set(cat, courseColor(e.title))
    }
    return Array.from(byCat, ([category, color]) => ({ category, color }))
      .sort((a, b) => a.category.localeCompare(b.category))
  })

  let filteredEvents = $derived(
    events.filter((e) =>
      e.type === 'dive' ? diveShown : !hiddenCourses.has(e.course_category ?? e.title),
    ),
  )
  let ranges = $derived(assignTracks(filteredEvents))

  let cellTrackRows = $derived.by(() => {
    let max = 0
    const monthStart = startOfMonth(month)
    const monthEnd = endOfMonth(month)
    for (const r of ranges) {
      if (r.end < monthStart || r.start > monthEnd) continue
      if (r.track + 1 > max) max = r.track + 1
    }
    return max
  })

  let inMonthEvents = $derived(
    filteredEvents.filter(
      (e) =>
        (isSameMonth(new Date(e.start_time), month) ||
          (e.end_time && isSameMonth(new Date(e.end_time), month))) &&
        (!hidePastInList || new Date(e.start_time) >= todayStart),
    ),
  )

  let leading = $derived(days[0].getDay())
  let cellMinHeight = $derived(22 + Math.max(1, cellTrackRows) * (TRACK_HEIGHT + TRACK_GAP) + 6)
  let eventStripHeight = $derived(Math.max(1, cellTrackRows) * (TRACK_HEIGHT + TRACK_GAP))

  let visibleCourses = $derived(courseCategories.length - hiddenCourses.size)
  let allCoursesHidden = $derived(courseCategories.length > 0 && visibleCourses === 0)

  function toggleCourseCategory(cat: string) {
    const next = new Set(hiddenCourses)
    if (next.has(cat)) next.delete(cat)
    else next.add(cat)
    hiddenCourses = next
  }

  function daySegments(day: Date): Array<[number, CellSegment<CalEvent>]> {
    const weekStart = startOfWeek(day, { weekStartsOn: 0 })
    const weekEnd = endOfWeek(day, { weekStartsOn: 0 })
    return [...segmentsForDay(day, ranges, weekStart, weekEnd).entries()]
  }

  // Featured events get a gold inset ring on their outer edges only.
  function barStyle(seg: CellSegment<CalEvent>, track: number): string {
    const left = seg.isStart ? 2 : 0
    const right = seg.isEnd ? 2 : 0
    let style = `top:${track * (TRACK_HEIGHT + TRACK_GAP)}px;height:${TRACK_HEIGHT}px;left:${left}px;right:${right}px;`
    if (seg.event.featured) {
      const c = 'rgb(252 211 77)'
      const parts = [`inset 0 1px 0 ${c}`, `inset 0 -1px 0 ${c}`]
      if (seg.isStart) parts.push(`inset 1px 0 0 ${c}`)
      if (seg.isEnd) parts.push(`inset -1px 0 0 ${c}`)
      style += `box-shadow:${parts.join(', ')};`
    }
    return style
  }

  function pick(seg: CellSegment<CalEvent>) {
    if (disablePastEvents && isPastEvent(seg.event)) return
    onPickEvent(seg.event)
  }

  function onWindowClick(e: MouseEvent) {
    if (legendOpen && legendEl && !legendEl.contains(e.target as Node)) legendOpen = false
  }
</script>

<svelte:window onclick={onWindowClick} />

<div class="space-y-4">
  <!-- Filter legend -->
  <div class="flex items-center gap-2 text-xs" bind:this={legendEl}>
    <button
      type="button"
      onclick={() => (diveShown = !diveShown)}
      aria-pressed={diveShown}
      aria-label="Toggle dives"
      class={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 transition-colors ${
        diveShown ? 'border-white bg-white text-blue-900' : 'border-white/30 bg-white/10 font-medium text-white/70 line-through'
      }`}
    >
      <span class="flex h-2 w-2 overflow-hidden rounded-full" aria-hidden="true">
        <span class={`flex-1 ${DIVE_LOCAL_DOT}`}></span>
        <span class={`flex-1 ${DIVE_TRIP_DOT}`}></span>
      </span>
      {TYPE_LABELS.dive}
    </button>

    <div class="relative">
      <button
        type="button"
        onclick={() => (legendOpen = !legendOpen)}
        aria-expanded={legendOpen}
        aria-haspopup="menu"
        aria-label="Filter courses"
        class={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 transition-colors ${
          allCoursesHidden ? 'border-white/30 bg-white/10 font-medium text-white/70 line-through' : 'border-white bg-white text-blue-900'
        }`}
      >
        <span class="flex h-2 w-2 overflow-hidden rounded-full" aria-hidden="true">
          <span class={`flex-1 ${COURSE_DOT.ow}`}></span>
          <span class={`flex-1 ${COURSE_DOT.aow}`}></span>
          <span class={`flex-1 ${COURSE_DOT.rescue}`}></span>
          <span class={`flex-1 ${COURSE_DOT.specialty}`}></span>
        </span>
        {$t.calendar.courses}
        {#if hiddenCourses.size > 0 && !allCoursesHidden}
          <span class="ml-0.5 text-[10px] font-medium text-blue-900">({visibleCourses}/{courseCategories.length})</span>
        {/if}
        <span aria-hidden="true">▾</span>
      </button>

      {#if legendOpen}
        <div role="menu" class="absolute left-0 top-full z-20 mt-1 min-w-[180px] space-y-1 rounded-lg border border-red-500 bg-white p-2 shadow-lg">
          {#if courseCategories.length === 0}
            <p class="px-2 py-1 text-xs font-medium text-blue-900">No courses in this range.</p>
          {/if}
          {#each courseCategories as { category, color } (category)}
            <label class="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 hover:bg-sky-50">
              <input
                type="checkbox"
                checked={!hiddenCourses.has(category)}
                onchange={() => toggleCourseCategory(category)}
                class="accent-blue-900"
              />
              <span class={`h-2 w-2 rounded-full ${COURSE_DOT[color]}`} aria-hidden="true"></span>
              <span class="text-xs font-semibold text-blue-900">{category}</span>
            </label>
          {/each}
        </div>
      {/if}
    </div>
  </div>

  <!-- Month nav -->
  <div class="flex items-center justify-between gap-2">
    <button
      onclick={() => onMonthChange(subMonths(month, 1))}
      aria-label="Previous month"
      class="flex flex-1 items-center justify-center rounded-xl border border-white/30 bg-white/10 px-4 py-2 text-2xl leading-none text-white transition-colors hover:bg-white/20"
    >‹</button>
    <h2 class="shrink-0 text-lg font-bold text-white">{format(month, 'MMMM yyyy')}</h2>
    <button
      onclick={() => onMonthChange(addMonths(month, 1))}
      aria-label="Next month"
      class="flex flex-1 items-center justify-center rounded-xl border border-white/30 bg-white/10 px-4 py-2 text-2xl leading-none text-white transition-colors hover:bg-white/20"
    >›</button>
  </div>

  <!-- Grid -->
  <div class="grid grid-cols-7 overflow-hidden rounded-xl border border-sky-200 bg-white/80 text-sm backdrop-blur-md">
    {#each ['S', 'M', 'T', 'W', 'T', 'F', 'S'] as d, i (i)}
      <div class="border-b border-sky-200 bg-sky-100 py-1 text-center text-xs font-semibold text-blue-900">{d}</div>
    {/each}

    {#each Array(leading) as _, i (i)}
      <div class="border-b border-sky-200/60 bg-sky-50/50" style={`min-height:${cellMinHeight}px`}></div>
    {/each}

    {#each days as day (day.toISOString())}
      {@const isToday = isSameDay(day, new Date())}
      {@const inMonth = isSameMonth(day, month)}
      <div
        class={`relative border-b border-sky-200/60 pt-1 ${isToday ? 'bg-red-50' : ''} ${inMonth ? '' : 'opacity-40'}`}
        style={`min-height:${cellMinHeight}px`}
      >
        <span class={`mx-auto flex h-5 w-5 items-center justify-center text-center text-[10px] ${isToday ? 'font-bold text-red-700' : 'text-blue-900'}`}>
          {format(day, 'd')}
        </span>
        <div class="relative mt-1" style={`height:${eventStripHeight}px`}>
          {#each daySegments(day) as [track, seg] (`${seg.event.id}_${seg.event.start_time}`)}
            {@const disabled = disablePastEvents && isPastEvent(seg.event)}
            <button
              type="button"
              onclick={(e) => { e.stopPropagation(); pick(seg) }}
              onmouseenter={() => (hoveredEventId = seg.event.id)}
              onmouseleave={() => (hoveredEventId = null)}
              aria-disabled={disabled || undefined}
              title={disabled ? `${seg.event.title} — already happened` : seg.event.title}
              class={`absolute truncate px-1 text-left text-[10px] font-semibold transition-all ${eventBarClass(seg.event, hoveredEventId === seg.event.id)} ${seg.isStart ? 'rounded-l-sm' : ''} ${seg.isEnd ? 'rounded-r-sm' : ''} ${disabled ? 'cursor-default opacity-40 saturate-50' : ''}`}
              style={barStyle(seg, track)}
            >
              {#if seg.showTitle}
                {seg.event.featured ? '★ ' : ''}{seg.event.calendar_title || seg.event.title}
              {:else}
                &nbsp;
              {/if}
            </button>
          {/each}
        </div>
      </div>
    {/each}
  </div>

  <!-- This-month list -->
  <div class="space-y-2">
    <h3 class="text-sm font-semibold uppercase tracking-wider text-white/70">{$t.calendar.thisMonth}</h3>
    {#if inMonthEvents.length === 0}
      <p class="text-sm font-medium text-white/80">{$t.calendar.noEvents}</p>
    {/if}
    {#each inMonthEvents as ev (`${ev.id}_${ev.start_time}`)}
      <button
        onclick={() => onPickEvent(ev)}
        class="w-full rounded-xl border border-sky-200 bg-white/80 p-3 text-left backdrop-blur-md transition-colors hover:border-red-500"
      >
        <div class="flex items-start justify-between gap-2">
          <div>
            <div class="flex items-center gap-2">
              <span class={`rounded-full px-1.5 py-0.5 text-xs ${eventBarClass(ev, false)}`}>{TYPE_LABELS[ev.type]}</span>
              <span class="text-sm font-medium text-blue-900">{ev.title}</span>
              {#if ev.featured}<span class="text-xs text-red-600">★</span>{/if}
            </div>
            <p class="mt-1 text-xs font-medium text-blue-900">{formatEventSpan(ev)}</p>
          </div>
          {#if ev.price != null}
            <span class="shrink-0 text-xs font-semibold text-blue-900">from NT${ev.price.toLocaleString('en-US')}</span>
          {/if}
        </div>
      </button>
    {/each}
  </div>
</div>
