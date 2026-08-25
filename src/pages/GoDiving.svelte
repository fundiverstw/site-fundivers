<script lang="ts">
  import { t } from '$engine/i18n'
  import PageHeader from '$components/PageHeader.svelte'
  import HubCard from '$components/HubCard.svelte'
  import { siteImage, courseImage } from '$engine/photo-pool'

  // The Go Diving hub: five ways to end up in the water, given the same weight.
  // The grid is deliberately even — nothing here is the "main" one, and which
  // of them a visitor wants depends entirely on whether they are picking a date,
  // a place, or a trip that does not exist yet.
  let cards = $derived([
    {
      href: '/calendar',
      title: $t.goDiving.calendarTitle,
      desc: $t.goDiving.calendarDesc,
      image: courseImage('padi-boat-diver-specialty'),
    },
    {
      href: '/sites',
      title: $t.goDiving.sitesTitle,
      desc: $t.goDiving.sitesDesc,
      image: siteImage('bat-cave'),
    },
    { href: '/map', title: $t.goDiving.mapTitle, desc: $t.goDiving.mapDesc, icon: '🗺️' },
    {
      href: '/travel',
      title: $t.goDiving.travelTitle,
      desc: $t.goDiving.travelDesc,
      image: siteImage('malapascua'),
    },
    {
      href: '/build-trip',
      title: $t.goDiving.buildTripTitle,
      desc: $t.goDiving.buildTripDesc,
      image: siteImage('penghu'),
    },
  ])
</script>

<PageHeader title={$t.goDiving.title} subtitle={$t.goDiving.subtitle} />

<section class="mx-auto max-w-[1600px] px-4 pb-20 sm:px-6">
  <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
    {#each cards as c (c.href)}
      <HubCard {...c} />
    {/each}
  </div>
</section>
