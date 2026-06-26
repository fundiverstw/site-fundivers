<script lang="ts">
  // Service cards mirror the live fundiverstw.com homepage copy verbatim.
  // `image` notes the photo to drop in later (gradient placeholder for now).
  const services = [
    {
      title: 'PADI Courses',
      desc: 'Fun Divers Tw offers the full range of PADI Certification Courses, from beginner to professional level! See the courses available here!',
      href: '/courses',
      image: 'Mathias mask clear.JPG',
      gradient: 'from-brand-700 to-reef-600',
    },
    {
      title: 'Dive sites',
      desc: 'Fun Divers Tw offers local shore and boat diving trips. There are many beautiful dive sites to visit here on the northeast coast of Taiwan.',
      href: '/sites',
      image: 'Divers exiting the water.JPG',
      gradient: 'from-reef-600 to-brand-800',
    },
    {
      title: 'Gear Sales, Service, & Rental',
      desc: 'Fun Divers Tw offers a range of Scuba diving and Free diving gear for Sale or Rental. We can also service regulators and BCDs! Contact us to find out more!',
      href: '#contact',
      image: 'T3.jpg',
      gradient: 'from-brand-800 to-brand-500',
    },
    {
      title: 'International Dive Tours',
      desc: 'Fun Divers Tw plans group tours to a variety of thrilling destinations! Join one of our planned dive trips or let us help you book your customized trip!',
      href: '/calendar',
      image: 'Rock Islands palau.jpg',
      gradient: 'from-reef-700 to-reef-400',
    },
    {
      title: 'Domestic Dive tours',
      desc: 'Explore the amazing dive destinations around Taiwan with Fun Divers Tw! Join a planned trip or let us help you book a customized trip.',
      href: '/calendar',
      image: 'Penghu Hearts enhanced',
      gradient: 'from-brand-900 to-reef-700',
    },
    {
      title: 'EFR Courses',
      desc: 'Fun Divers Tw offers the full range of EFR courses. Learn how to help yourself and others in an emergency.',
      href: '/courses',
      image: '107870192.jpg',
      gradient: 'from-reef-500 to-brand-700',
    },
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

<!-- Hero -->
<section class="relative overflow-hidden bg-brand-950 text-white">
  <div class="absolute inset-0 bg-gradient-to-br from-brand-900 via-brand-800 to-reef-800 opacity-95"></div>
  <div class="relative mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-24 text-center sm:px-6 md:py-28">
    <h1 class="text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl">
      Breathe the Adventure
    </h1>
    <p class="text-xl font-light text-reef-200 sm:text-2xl">Explore with Confidence</p>
    <div class="mt-4 flex flex-wrap justify-center gap-3">
      <a href="/courses" class="rounded-full bg-reef-400 px-6 py-3 font-semibold text-brand-950 shadow-lg transition-colors hover:bg-reef-300">
        View Courses
      </a>
      <a href="/calendar" class="rounded-full border border-white/30 px-6 py-3 font-semibold text-white transition-colors hover:bg-white/10">
        See the Calendar
      </a>
    </div>
  </div>
</section>

<!-- Explore our Services -->
<section class="mx-auto max-w-6xl px-4 py-16 sm:px-6">
  <div class="mx-auto max-w-3xl text-center">
    <h2 class="text-3xl font-bold tracking-tight text-brand-950">Explore our Services</h2>
    <p class="mt-3 text-slate-600">
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
        class="group flex flex-col overflow-hidden rounded-2xl border border-brand-100 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
      >
        <div class={`h-40 bg-gradient-to-br ${s.gradient}`}></div>
        <div class="flex flex-1 flex-col p-6">
          <h3 class="text-lg font-semibold text-brand-800 group-hover:text-brand-700">{s.title}</h3>
          <p class="mt-2 text-sm text-slate-600">{s.desc}</p>
        </div>
      </a>
    {/each}
  </div>

  <div class="mt-10 text-center">
    <a href="#contact" class="rounded-full bg-brand-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-brand-700">
      Contact us
    </a>
  </div>
</section>

<!-- Diving in Taiwan -->
<section class="bg-brand-50">
  <div class="mx-auto max-w-3xl px-4 py-16 sm:px-6">
    <h2 class="text-3xl font-bold tracking-tight text-brand-950">
      Diving in Taiwan: Exploring a World Beneath the Waves
    </h2>
    <div class="mt-6 space-y-5 text-slate-700">
      {#each divingInTaiwan as para}
        <p>{para}</p>
      {/each}
    </div>
  </div>
</section>

<!-- Brand taglines -->
<section class="bg-gradient-to-r from-brand-700 to-reef-700">
  <div class="mx-auto flex max-w-6xl flex-col items-center gap-1 px-4 py-14 text-center sm:px-6">
    <p class="text-2xl font-bold text-white sm:text-3xl">Breathe the Adventure</p>
    <p class="text-lg font-light text-reef-100">Explore with Confidence</p>
  </div>
</section>
