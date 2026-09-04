<script lang="ts">
  // The teal "Ready to dive?" panel at the foot of the dive-site and course
  // detail pages. Same panel, different words — so the words are props.
  //
  // "Get in touch" opens the shared GetInTouch email form (via `onContact`)
  // rather than a bare link. It used to point at `#contact`, which only scrolled
  // to the footer sitting right under this panel, so the click looked dead.
  let {
    title,
    text,
    calendarLabel,
    contactLabel,
    onContact,
  }: {
    title: string
    text: string
    calendarLabel: string
    contactLabel: string
    onContact: () => void
  } = $props()
</script>

<div
  class="glow-teal mt-10 flex flex-col items-start gap-4 rounded-3xl border border-reef-400/30 bg-reef-400/5 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8"
>
  <div>
    <h2 class="text-t2 font-bold text-white">{title}</h2>
    <p class="mt-1 text-t3 text-brand-100">{text}</p>
  </div>
  <div class="flex flex-wrap gap-2">
    <a
      href="/calendar"
      class="rounded-full bg-reef-400 px-5 py-2 text-t3 font-bold text-brand-950 transition-colors hover:bg-reef-300"
    >
      {calendarLabel}
    </a>
    <button
      type="button"
      onclick={onContact}
      class="rounded-full border border-white/40 px-5 py-2 text-t3 font-bold text-white transition-colors hover:bg-white/15"
    >
      {contactLabel}
    </button>
  </div>
</div>
