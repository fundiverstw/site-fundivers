<script lang="ts">
  import { CONTACT } from '../lib/config'
  import PageHeader from '../components/PageHeader.svelte'

  // Placeholder team roster — swap in real names, photos, and bios.
  const team = [
    { name: 'Lead Instructor', role: 'PADI MSDT', initials: 'FD' },
    { name: 'Dive Guide', role: 'PADI Divemaster', initials: 'FD' },
    { name: 'Course Director', role: 'PADI IDC Staff', initials: 'FD' },
    { name: 'Trip Coordinator', role: 'Logistics & Booking', initials: 'FD' },
  ]
</script>

<PageHeader
  title="Fun Divers Team"
  subtitle="Dedication. Expertise. Passion."
/>

<section class="mx-auto max-w-6xl px-4 py-12 sm:px-6">
  <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
    {#each team as m}
      <div class="glass rounded-2xl p-6 text-center shadow-sm">
        <div class="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-brand-700 to-reef-600 text-xl font-bold text-white">
          {m.initials}
        </div>
        <h3 class="mt-4 font-semibold text-white">{m.name}</h3>
        <p class="text-sm text-reef-300">{m.role}</p>
      </div>
    {/each}
  </div>

  <div class="glass mt-12 rounded-2xl p-8 text-center">
    <h2 class="text-xl font-bold text-white">Dive with us</h2>
    <p class="mt-2 text-brand-100">Questions about a course or trip? We’re happy to help.</p>
    <div class="mt-4 flex flex-wrap justify-center gap-4 text-sm">
      <a class="font-semibold text-reef-300 hover:text-reef-200" href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
      <a class="font-semibold text-reef-300 hover:text-reef-200" href={CONTACT.phoneHref}>{CONTACT.phone}</a>
    </div>
  </div>
</section>
