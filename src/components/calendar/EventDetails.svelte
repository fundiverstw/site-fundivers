<script lang="ts">
  import type { EventDetails } from '../../lib/events'

  // Ported from app-fundivers EventDetails.tsx — renders an event's
  // descriptive text inside the (light) calendar modal.
  let { details }: { details: EventDetails } = $props()

  const sections: Array<{ key: keyof EventDetails; label: string }> = [
    { key: 'description', label: 'About this event' },
    { key: 'included', label: "What's included" },
    { key: 'not_included', label: 'Not included' },
    { key: 'schedule', label: 'Schedule / itinerary' },
    { key: 'transportation', label: 'Transportation' },
  ]

  let hasPrereqs = $derived(
    Boolean(details.required_cert) || details.required_dives != null || Boolean(details.prerequisites),
  )
</script>

<div class="max-h-72 space-y-3 overflow-y-auto pr-1 text-sm text-blue-900">
  {#each sections as { key, label } (key)}
    {#if details[key]}
      <section>
        <h3 class="font-semibold text-blue-950">{label}</h3>
        <p class="whitespace-pre-line text-blue-900/90">{details[key]}</p>
      </section>
    {/if}
  {/each}

  {#if hasPrereqs}
    <section>
      <h3 class="font-semibold text-blue-950">Prerequisites</h3>
      {#if details.required_cert}<p class="text-blue-900/90">Minimum certification: {details.required_cert}</p>{/if}
      {#if details.required_dives != null}<p class="text-blue-900/90">Logged dives: {details.required_dives}+</p>{/if}
      {#if details.prerequisites}<p class="whitespace-pre-line text-blue-900/90">{details.prerequisites}</p>{/if}
    </section>
  {/if}
</div>
