<script lang="ts">
  import { bookUrl } from '../lib/config'

  const services = [
    {
      title: 'PADI Courses',
      desc: 'From Open Water to Divemaster — all PADI recreational courses with experienced instructors.',
      href: '/courses',
    },
    {
      title: 'Dive Sites',
      desc: 'Explore Taiwan’s best reefs, wrecks, and walls across the north, south, and outlying islands.',
      href: '/sites',
    },
    {
      title: 'Gear Sales, Service & Rental',
      desc: 'Quality scuba gear for sale, full servicing, and rental sets for every trip.',
      href: '/courses',
    },
    {
      title: 'International Dive Tours',
      desc: 'Guided trips to world-class destinations — Philippines, Indonesia, Palau, and more.',
      href: '/calendar',
    },
    {
      title: 'Domestic Dive Tours',
      desc: 'Weekend and day trips to Green Island, Kenting, Long Dong, Penghu, and beyond.',
      href: '/calendar',
    },
    {
      title: 'EFR Courses',
      desc: 'Emergency First Response training — CPR and first aid for divers and non-divers alike.',
      href: '/courses',
    },
  ]

  const regions = [
    {
      title: 'The North',
      body: 'Long Dong, Keelung, and Yilan offer easy shore access, dramatic rock formations, and macro life. The most convenient diving from Taipei, best from spring through autumn.',
    },
    {
      title: 'The South',
      body: 'Kenting’s warm waters and sprawling coral reefs have made it a top destination for decades — great year-round, with the calmest conditions in summer.',
    },
    {
      title: 'Outlying Islands',
      body: 'Green Island, Orchid Island, Xiaoliuqiu, and Penghu deliver Taiwan’s most spectacular diving — turtles, big fish, and visibility that rivals anywhere in Asia.',
    },
  ]
</script>

<!-- Hero -->
<section class="relative overflow-hidden bg-brand-950 text-white">
  <div class="absolute inset-0 bg-gradient-to-br from-brand-900 via-brand-800 to-reef-800 opacity-95"></div>
  <div class="relative mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 py-24 sm:px-6 md:py-32">
    <span class="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-reef-200">
      PADI Dive Center · Taiwan
    </span>
    <h1 class="max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl">
      Explore a world beneath the waves.
    </h1>
    <p class="max-w-2xl text-lg text-brand-100">
      FunDivers TW offers exceptional guided trips and convenient online booking, plus the
      full range of PADI recreational dive courses — for first-timers and seasoned divers alike.
    </p>
    <div class="flex flex-wrap gap-3">
      <a
        href={bookUrl}
        target="_blank"
        rel="noopener"
        class="rounded-full bg-reef-400 px-6 py-3 font-semibold text-brand-950 shadow-lg transition-colors hover:bg-reef-300"
      >
        Book a Trip
      </a>
      <a
        href="/courses"
        class="rounded-full border border-white/30 px-6 py-3 font-semibold text-white transition-colors hover:bg-white/10"
      >
        View Courses
      </a>
    </div>
  </div>
</section>

<!-- Services -->
<section class="mx-auto max-w-6xl px-4 py-16 sm:px-6">
  <div class="max-w-2xl">
    <h2 class="text-3xl font-bold tracking-tight text-brand-950">What we offer</h2>
    <p class="mt-2 text-slate-600">Everything you need to start diving or to keep exploring.</p>
  </div>
  <div class="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
    {#each services as s}
      <a
        href={s.href}
        class="group rounded-2xl border border-brand-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-brand-200 hover:shadow-md"
      >
        <h3 class="text-lg font-semibold text-brand-800 group-hover:text-brand-700">{s.title}</h3>
        <p class="mt-2 text-sm text-slate-600">{s.desc}</p>
        <span class="mt-4 inline-block text-sm font-semibold text-reef-600">Learn more →</span>
      </a>
    {/each}
  </div>
</section>

<!-- Diving in Taiwan -->
<section class="bg-brand-50">
  <div class="mx-auto max-w-6xl px-4 py-16 sm:px-6">
    <div class="max-w-3xl">
      <h2 class="text-3xl font-bold tracking-tight text-brand-950">
        Diving in Taiwan: Exploring a World Beneath the Waves
      </h2>
      <p class="mt-4 text-slate-700">
        Taiwan packs an astonishing variety of diving into a small island. Three distinct regions —
        the North, the South, and the Outlying Islands — each offer their own character, marine life,
        and best seasons. Water temperatures range from a cool 20°C in winter up north to a balmy 28°C
        in summer down south, so there’s great diving somewhere on the island all year round.
      </p>
    </div>
    <div class="mt-10 grid gap-6 md:grid-cols-3">
      {#each regions as r}
        <div class="rounded-2xl bg-white p-6 shadow-sm">
          <h3 class="text-lg font-semibold text-reef-700">{r.title}</h3>
          <p class="mt-2 text-sm text-slate-600">{r.body}</p>
        </div>
      {/each}
    </div>
    <div class="mt-8">
      <a href="/sites" class="font-semibold text-brand-700 hover:text-brand-800">Browse all dive sites →</a>
    </div>
  </div>
</section>

<!-- CTA -->
<section class="bg-gradient-to-r from-brand-700 to-reef-700">
  <div class="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-16 text-center sm:px-6">
    <h2 class="text-3xl font-bold text-white">Ready to get in the water?</h2>
    <p class="max-w-xl text-brand-100">
      Check the upcoming calendar and reserve your spot online in minutes.
    </p>
    <div class="flex flex-wrap justify-center gap-3">
      <a href="/calendar" class="rounded-full bg-white px-6 py-3 font-semibold text-brand-800 hover:bg-brand-50">
        See the Calendar
      </a>
      <a
        href={bookUrl}
        target="_blank"
        rel="noopener"
        class="rounded-full border border-white/40 px-6 py-3 font-semibold text-white hover:bg-white/10"
      >
        Book Now
      </a>
    </div>
  </div>
</section>
