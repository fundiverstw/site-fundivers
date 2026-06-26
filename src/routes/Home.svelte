<script lang="ts">
  import { fetchUpcomingEvents, type UpcomingEvent, type ModalEvent } from '../lib/events'
  import { formatSpan } from '../lib/format'
  import GetInTouch from '../components/GetInTouch.svelte'
  import EventCard from '../components/EventCard.svelte'
  import EventModal from '../components/calendar/EventModal.svelte'
  import { mediaIdLocal } from '../lib/images'

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
    { title: 'PADI Courses', desc: 'Fun Divers Tw offers the full range of PADI Certification Courses, from beginner to professional level! See the courses available here!', href: '/courses', image: mediaIdLocal('b37fef_2ea720f3f0c94fb8bc703856514b0a6c~mv2.jpg') },
    { title: 'Dive sites', desc: 'Fun Divers Tw offers local shore and boat diving trips. There are many beautiful dive sites to visit here on the northeast coast of Taiwan.', href: '/sites', image: mediaIdLocal('b37fef_7621a533ac1946a8b342bc5085cb1d28~mv2.jpg') },
    { title: 'Gear Sales, Service, & Rental', desc: 'Fun Divers Tw offers a range of Scuba diving and Free diving gear for Sale or Rental. We can also service regulators and BCDs! Contact us to find out more!', href: '#get-in-touch', image: mediaIdLocal('b37fef_58237e6a633f472b8d419bd830abb854~mv2.jpg') },
    { title: 'International Dive Tours', desc: 'Fun Divers Tw plans group tours to a variety of thrilling destinations! Join one of our planned dive trips or let us help you book your customized trip!', href: '/travel', image: mediaIdLocal('b37fef_80f90894e75f47f8809d14663dd8e8bd~mv2.jpg') },
    { title: 'Domestic Dive tours', desc: 'Explore the amazing dive destinations around Taiwan with Fun Divers Tw! Join a planned trip or let us help you book a customized trip.', href: '/travel', image: mediaIdLocal('b37fef_c3c0324de5bb47b49843a8f63551b4e7~mv2.jpg') },
    { title: 'EFR Courses', desc: 'Fun Divers Tw offers the full range of EFR courses. Learn how to help yourself and others in an emergency.', href: '/courses', image: mediaIdLocal('b37fef_49df7d482eb44585a605a489e2b1d653~mv2.jpg') },
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
        class="group relative flex h-56 flex-col justify-end overflow-hidden rounded-2xl border border-white/15 shadow-sm transition-transform hover:-translate-y-1"
      >
        <img src={s.image} alt="" loading="lazy" class="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
        <div class="relative z-10 p-5">
          <h3 class="text-lg font-bold text-white">{s.title}</h3>
          <p class="mt-1 line-clamp-3 text-sm text-white/85">{s.desc}</p>
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
