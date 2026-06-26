<script lang="ts">
  import PageHeader from '../components/PageHeader.svelte'

  // Mirrors the homepage "International / Domestic Dive Tours" services.
  const tours = [
    {
      title: 'Domestic Dive Tours',
      desc: 'Explore the amazing dive destinations around Taiwan with Fun Divers Tw! Join a planned trip or let us help you book a customized trip.',
      points: ['Green Island & Orchid Island', 'Kenting & Xiaoliuqiu', 'Penghu', 'Long Dong & the northeast coast'],
      gradient: 'from-brand-900 to-reef-700',
    },
    {
      title: 'International Dive Tours',
      desc: 'Fun Divers Tw plans group tours to a variety of thrilling destinations! Join one of our planned dive trips or let us help you book your customized trip!',
      points: ['Philippines', 'Indonesia', 'Palau', 'And more — ask us!'],
      gradient: 'from-reef-700 to-brand-800',
    },
  ]
</script>

<PageHeader
  title="Dive Travel"
  subtitle="Planned group tours and fully customized trips — around Taiwan and beyond."
/>

<section class="mx-auto max-w-[1600px] px-4 py-12 sm:px-6 sm:py-16">
  <div class="grid gap-6 md:grid-cols-2">
    {#each tours as t}
      <div class="glass flex flex-col overflow-hidden rounded-2xl shadow-sm">
        <div class={`h-44 bg-gradient-to-br ${t.gradient}`}></div>
        <div class="flex flex-1 flex-col p-6">
          <h2 class="text-xl font-bold text-white">{t.title}</h2>
          <p class="mt-2 text-sm text-brand-100">{t.desc}</p>
          <ul class="mt-4 space-y-1.5 text-sm text-brand-100">
            {#each t.points as p}
              <li class="flex items-center gap-2">
                <span class="h-1.5 w-1.5 shrink-0 rounded-full bg-reef-300"></span>
                {p}
              </li>
            {/each}
          </ul>
        </div>
      </div>
    {/each}
  </div>

  <div class="glass mt-10 rounded-2xl p-8 text-center">
    <h2 class="text-xl font-bold text-white">Ready to plan your next trip?</h2>
    <p class="mt-2 text-brand-100">
      Check upcoming departures on the calendar, or reach out and we’ll help arrange a custom trip.
    </p>
    <div class="mt-4 flex flex-wrap justify-center gap-3">
      <a href="/calendar" class="rounded-full bg-reef-400 px-6 py-3 font-semibold text-brand-950 transition-colors hover:bg-reef-300">
        See the Calendar
      </a>
      <a href="#contact" class="rounded-full border border-white/30 px-6 py-3 font-semibold text-white transition-colors hover:bg-white/10">
        Plan a custom trip
      </a>
    </div>
  </div>
</section>
