<script lang="ts">
  import { t, locale } from '$engine/i18n'
  import { marineLabel } from '$engine/i18n-content'
  import { DECK, shuffled, nameParts, type QuizCard } from '$engine/quiz'
  import { SIZES } from '$engine/responsive-image'
  import Photo from '$components/Photo.svelte'
  import PageHeader from '$components/PageHeader.svelte'

  // Flashcards over the gallery photos: a picture, then what it is. The deck is
  // built in engine/quiz.ts; this page only decides what you see and when.
  //
  // Shuffled once when the page loads rather than on every card, so the order is
  // a deck you are working through and "previous" goes back to the card you just
  // saw. Re-shuffling is a button, not a side effect.
  let deck = $state<QuizCard[]>(shuffled(DECK))
  let i = $state(0)
  let revealed = $state(false)

  let card = $derived<QuizCard | null>(deck[i] ?? null)

  // The name on the back. A photo's own caption is sharper than the folder it
  // sits in, so it wins; otherwise the creature's name, translated — the deck is
  // the same in every language, the answers are not.
  let commonName = $derived(card ? card.commonName || marineLabel(card.creature, $locale) : '')

  function step(delta: number) {
    if (!deck.length) return
    i = (i + delta + deck.length) % deck.length
    // A new photo always arrives face down. Carrying `revealed` across would
    // answer the next card before it has been asked.
    revealed = false
  }

  function reshuffle() {
    deck = shuffled(DECK)
    i = 0
    revealed = false
  }

  // Arrow keys walk the deck, space or enter flips the card — the shortcuts the
  // lightbox on /photos already uses, so the two pages behave alike. Ignored
  // while the reader is in a form field or working the keyboard on a button.
  function onKey(e: KeyboardEvent) {
    const el = e.target as HTMLElement | null
    if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable)) return
    if (e.key === 'ArrowRight') step(1)
    else if (e.key === 'ArrowLeft') step(-1)
    else if (e.key === ' ' || e.key === 'Enter') {
      if (el?.tagName === 'BUTTON' || el?.tagName === 'A') return
      e.preventDefault()
      revealed = !revealed
    }
  }
</script>

<svelte:window on:keydown={onKey} />

<PageHeader title={$t.quiz.title} subtitle={$t.quiz.subtitle} />

<div class="mx-auto max-w-3xl px-4 pb-20 sm:px-6">
  {#if !card}
    <p class="glass rounded-3xl p-8 text-center text-brand-100">{$t.quiz.empty}</p>
  {:else}
    <!-- The card. The whole picture is the button: a flashcard is a thing you
         turn over, so the target is the card and not a control beside it. -->
    <button
      type="button"
      onclick={() => (revealed = !revealed)}
      aria-pressed={revealed}
      data-testid="quiz-card"
      class="glass group block w-full overflow-hidden rounded-3xl text-left shadow-sm transition-colors"
    >
      <!-- Sized to the viewport rather than to an aspect ratio, so the card, its
           answer and the controls under it are all on screen at once — a quiz
           you have to scroll to answer is a quiz you stop playing. `contain`
           because the animal is the question: cropping a nudibranch to fill a
           box is how you cut the animal out of its own flashcard. -->
      <div
        class="relative flex h-[min(40vh,20rem)] w-full items-center justify-center overflow-hidden bg-brand-950/60 sm:h-[min(52vh,28rem)]"
      >
        <Photo
          image={card.image}
          alt=""
          sizes={SIZES.hero}
          priority
          class="h-full w-full object-contain"
        />
      </div>

      <!-- Answer panel. It is in the document whether or not it is revealed, so
           the card does not change height when you flip it and the button does
           not move out from under the pointer. -->
      <div class="flex min-h-[7.5rem] flex-col justify-center px-5 py-5 sm:px-7">
        {#if revealed}
          <p class="text-2xl font-bold text-white sm:text-3xl">{commonName}</p>
          {#if card.species}
            <!-- Italics are the genus and the species, and only those: `sp.` and
                 `spp.` stand in for a name instead of being one, so they are set
                 upright next to it. See nameParts. -->
            <p class="mono mt-1 text-base text-reef-300 sm:text-lg">
              {#each nameParts(card.species) as part, n (n)}
                {@const text = n > 0 ? ` ${part.text}` : part.text}
                {#if part.italic}<em>{text}</em>{:else}{text}{/if}
              {/each}
            </p>
          {/if}
          {#if card.commonName}
            <p class="mt-2 text-sm text-brand-100">
              {marineLabel(card.creature, $locale)}
            </p>
          {/if}
        {:else}
          <p class="text-center text-brand-100">{$t.quiz.tapToReveal}</p>
        {/if}
      </div>
    </button>

    <!-- Controls. Reveal sits with them for anyone who would rather press a
         button than the picture, and for a screen reader reading in order. -->
    <div class="mt-5 flex flex-wrap items-center justify-center gap-3">
      <button
        type="button"
        onclick={() => step(-1)}
        class="rounded-full border border-white/30 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/10"
      >
        {$t.quiz.prev}
      </button>
      <button
        type="button"
        onclick={() => (revealed = !revealed)}
        class="rounded-full border border-white/30 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/10"
      >
        {revealed ? $t.quiz.hideAgain : $t.quiz.reveal}
      </button>
      <button
        type="button"
        onclick={() => step(1)}
        class="rounded-full bg-brand-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
      >
        {$t.quiz.next}
      </button>
    </div>

    <div class="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
      <p class="mono text-brand-100">
        {$t.quiz.progress.replace('{n}', String(i + 1)).replace('{total}', String(deck.length))}
      </p>
      <button
        type="button"
        onclick={reshuffle}
        class="text-brand-100 underline underline-offset-4 transition-colors hover:text-white"
      >
        {$t.quiz.shuffle}
      </button>
      <!-- Only offered once the answer is on the table: following it before you
           have guessed walks you into a gallery section that names the animal. -->
      {#if revealed}
        <a href={`/photos#${card.key}`} class="font-semibold text-reef-300 hover:text-reef-200">
          {$t.quiz.seeInGallery}
        </a>
      {:else}
        <a href="/photos" class="text-brand-100 underline underline-offset-4 hover:text-white">
          {$t.quiz.backToPhotos}
        </a>
      {/if}
    </div>
  {/if}
</div>
