<script lang="ts">
  import { fetchUpcomingEvents, type UpcomingEvent, type ModalEvent } from '../lib/events'
  import { formatSpan } from '../lib/format'
  import GetInTouch from '../components/GetInTouch.svelte'
  import EventCard from '../components/EventCard.svelte'
  import EventModal from '../components/calendar/EventModal.svelte'

  let upcoming = $state<UpcomingEvent[]>([])
  let loading = $state(true)
  let selected = $state<ModalEvent | null>(null)

  function open(ev: UpcomingEvent) {
    selected = {
      id: ev.id,
      type: ev.type,
      title: ev.title,
      spanLabel: formatSpan(ev.startDate, ev.endDate, ev.time),
      price: ev.startingAt,
      currency: 'TWD',
      fullyBooked: ev.fullyBooked,
    }
  }

  $effect(() => {
    fetchUpcomingEvents()
      .then((e) => (upcoming = e))
      .catch(() => (upcoming = []))
      .finally(() => (loading = false))
  })

  // Featured: real featured first, padded with the soonest upcoming events.
  let featured = $derived.by(() => {
    const feat = upcoming.filter((e) => e.featured)
    if (feat.length >= 3) return feat.slice(0, 3)
    const ids = new Set(feat.map((e) => e.id))
    return [...feat, ...upcoming.filter((e) => !ids.has(e.id)).slice(0, 3 - feat.length)]
  })
  let featuredIds = $derived(new Set(featured.map((e) => e.id)))
  let dives = $derived(upcoming.filter((e) => e.type === 'dive' && !featuredIds.has(e.id)).slice(0, 3))
  let courses = $derived(upcoming.filter((e) => e.type === 'course' && !featuredIds.has(e.id)).slice(0, 3))

  const services = [
    { title: 'PADI Courses', desc: 'Fun Divers Tw offers the full range of PADI Certification Courses, from beginner to professional level! See the courses available here!', href: '/courses', gradient: 'from-brand-700 to-reef-600' },
    { title: 'Dive sites', desc: 'Fun Divers Tw offers local shore and boat diving trips. There are many beautiful dive sites to visit here on the northeast coast of Taiwan.', href: '/sites', gradient: 'from-reef-600 to-brand-800' },
    { title: 'Gear Sales, Service, & Rental', desc: 'Fun Divers Tw offers a range of Scuba diving and Free diving gear for Sale or Rental. We can also service regulators and BCDs! Contact us to find out more!', href: '#get-in-touch', gradient: 'from-brand-800 to-brand-500' },
    { title: 'International Dive Tours', desc: 'Fun Divers Tw plans group tours to a variety of thrilling destinations! Join one of our planned dive trips or let us help you book your customized trip!', href: '/travel', gradient: 'from-reef-700 to-reef-400' },
    { title: 'Domestic Dive tours', desc: 'Explore the amazing dive destinations around Taiwan with Fun Divers Tw! Join a planned trip or let us help you book a customized trip.', href: '/travel', gradient: 'from-brand-900 to-reef-700' },
    { title: 'EFR Courses', desc: 'Fun Divers Tw offers the full range of EFR courses. Learn how to help yourself and others in an emergency.', href: '/courses', gradient: 'from-reef-500 to-brand-700' },
  ]

  const divingInTaiwan = [
    'Taiwan, a treasure trove of cultural heritage and natural beauty, offers diving enthusiasts an unparalleled opportunity to delve into the depths of its azure waters. Taiwan caters to divers year round with dive seasons that vary across the regions. Taiwan is generally divided into three dive regions: The North (including Taipei, Keelung, and Yilan), The South (Lambai and Kenting), and the Outlying Islands (Penghu, Green Island, and Orchid Island).',
    'The season in the north stretches from April until Early October, with the warmest months being July and August. Diving is possible during the winter months, but water temperatures drop to 16-18C and wave conditions can be very unpredictable, which make it very difficult to plan ahead of time.',
    'The dive season in the south, however, is all year, since both Kenting and Lambai (Xiao Liuqiu) are sheltered from all but the worst of the winter winds and storms. The water temperature is warmer than the north, only dropping below 22C from January through March.',
    'The outlying islands, with Penghu situated off the west coast, and Green Island and Orchid Island, nestled off the southeastern coast, beckon adventurers with their own dive seasons. The high season spans from April to November with the low season being December through March. During the high season, water temperatures are warmer (25-30C) and conditions are much calmer while the low season sees cooler waters (18-24C) and more unpredictable wave conditions.',
    "Beyond Taiwan's shores, neighboring paradises like the Philippines and Indonesia offer complementary dive seasons, ensuring that the allure of underwater exploration knows no bounds.",
    "Embark on a journey through Taiwan's dive seasons and beyond, where every descent promises a glimpse into a world of wonder beneath the waves.",
  ]
</script>

{#snippet cardGrid(title: string, items: UpcomingEvent[], moreHref: string | null, star: boolean)}
  <section class="mx-auto max-w-[1600px] px-4 pt-8 sm:px-6">
    <div class="mb-4 flex items-center justify-between">
      <h2 class="flex items-center gap-2 text-2xl font-bold text-white">
        {#if star}<span class="text-reef-300">★</span>{/if}{title}
      </h2>
      {#if moreHref}
        <a href={moreHref} class="text-sm font-semibold text-reef-300 hover:text-reef-200">View all →</a>
      {/if}
    </div>
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {#if loading}
        {#each Array(3) as _, i (i)}<div class="h-80 animate-pulse rounded-2xl bg-white/10"></div>{/each}
      {:else if items.length === 0}
        <p class="text-sm text-brand-200">Nothing scheduled yet.</p>
      {:else}
        {#each items as ev (ev.id)}<EventCard {ev} onDetails={open} />{/each}
      {/if}
    </div>
  </section>
{/snippet}

{@render cardGrid('Featured', featured, null, true)}
{@render cardGrid('Upcoming Dives', dives, '/calendar', false)}
{@render cardGrid('Upcoming Courses', courses, '/courses', false)}

<!-- Explore our Services -->
<section class="mx-auto max-w-[1600px] px-4 py-12 sm:px-6 sm:py-16">
  <div class="mx-auto max-w-3xl text-center">
    <h2 class="text-3xl font-bold tracking-tight text-white">Explore our Services</h2>
    <p class="mt-3 text-brand-100">
      Discover the unique and valuable aspects that make Fun Divers TW the top choice for diving
      enthusiasts. With our extensive experience and dedication to customer satisfaction, we provide
      exceptional guided trips and convenient booking services as well as all PADI Recreational Dive
      Courses.
    </p>
  </div>

  <div class="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
    {#each services as s}
      <a
        href={s.href}
        class="glass group flex flex-col overflow-hidden rounded-2xl shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
      >
        <div class={`h-40 bg-gradient-to-br ${s.gradient}`}></div>
        <div class="flex flex-1 flex-col p-6">
          <h3 class="text-lg font-semibold text-white">{s.title}</h3>
          <p class="mt-2 text-sm text-brand-100">{s.desc}</p>
        </div>
      </a>
    {/each}
  </div>

  <div class="mt-10 text-center">
    <a href="#get-in-touch" class="rounded-full bg-reef-400 px-6 py-3 font-semibold text-brand-950 transition-colors hover:bg-reef-300">
      Contact us
    </a>
  </div>
</section>

<!-- Diving in Taiwan -->
<section>
  <div class="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
    <h2 class="text-3xl font-bold tracking-tight text-white">
      Diving in Taiwan: Exploring a World Beneath the Waves
    </h2>
    <div class="mt-6 space-y-5 text-brand-100">
      {#each divingInTaiwan as para}
        <p>{para}</p>
      {/each}
    </div>
  </div>
</section>

<!-- Get In Touch -->
<GetInTouch />

<!-- Brand taglines -->
<section>
  <div class="mx-auto flex max-w-[1600px] flex-col items-center gap-1 px-4 py-12 text-center sm:px-6 sm:py-14">
    <p class="text-2xl font-bold text-white sm:text-3xl">Breathe the Adventure</p>
    <p class="text-lg font-light text-reef-100">Explore with Confidence</p>
  </div>
</section>

<EventModal event={selected} onClose={() => (selected = null)} />
