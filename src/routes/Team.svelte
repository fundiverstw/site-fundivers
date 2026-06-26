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
  title="Our Team"
  subtitle="Experienced, certified, and passionate about safe diving and good times underwater."
/>

<section class="mx-auto max-w-6xl px-4 py-12 sm:px-6">
  <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
    {#each team as m}
      <div class="rounded-2xl border border-brand-100 bg-white p-6 text-center shadow-sm">
        <div class="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-brand-700 to-reef-600 text-xl font-bold text-white">
          {m.initials}
        </div>
        <h3 class="mt-4 font-semibold text-brand-900">{m.name}</h3>
        <p class="text-sm text-reef-600">{m.role}</p>
      </div>
    {/each}
  </div>

  <div class="mt-12 rounded-2xl bg-brand-50 p-8 text-center">
    <h2 class="text-xl font-bold text-brand-900">Dive with us</h2>
    <p class="mt-2 text-slate-600">Questions about a course or trip? We’re happy to help.</p>
    <div class="mt-4 flex flex-wrap justify-center gap-4 text-sm">
      <a class="font-semibold text-brand-700 hover:text-brand-800" href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
      <a class="font-semibold text-brand-700 hover:text-brand-800" href={CONTACT.phoneHref}>{CONTACT.phone}</a>
    </div>
  </div>
</section>
