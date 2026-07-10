<script lang="ts">
  // The teal "Ready to dive?" panel at the foot of the dive-site and course
  // detail pages. Same panel, different words — so the words are props.
  let {
    title,
    text,
    calendarLabel,
    contactLabel,
  }: { title: string; text: string; calendarLabel: string; contactLabel: string } = $props()
</script>

<div
  class="glow-teal mt-10 flex flex-col items-start gap-4 rounded-3xl border border-reef-400/30 bg-reef-400/5 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8"
>
  <div>
    <h2 class="text-xl font-bold text-white">{title}</h2>
    <p class="mt-1 text-sm text-brand-100">{text}</p>
  </div>
  <div class="flex flex-wrap gap-2">
    <a
      href="/calendar"
      class="rounded-full bg-reef-400 px-5 py-2 text-sm font-bold text-brand-950 transition-colors hover:bg-reef-300"
    >
      {calendarLabel}
    </a>
    <a
      href="#contact"
      class="rounded-full border border-white/40 px-5 py-2 text-sm font-bold text-white transition-colors hover:bg-white/15"
    >
      {contactLabel}
    </a>
  </div>
</div>
