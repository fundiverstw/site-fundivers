<script lang="ts">
  import type { EventDetails } from '$engine/events'
  import { t } from '$engine/i18n'

  // Ported from app-fundivers EventDetails.tsx — renders an event's
  // descriptive text inside the (light) calendar modal.
  let { details }: { details: EventDetails } = $props()

  let sections = $derived<Array<{ key: keyof EventDetails; label: string }>>([
    { key: 'description', label: $t.calendar.details.about },
    { key: 'included', label: $t.calendar.details.included },
    { key: 'not_included', label: $t.calendar.details.notIncluded },
    { key: 'schedule', label: $t.calendar.details.schedule },
    { key: 'transportation', label: $t.calendar.details.transportation },
  ])

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
      <h3 class="font-semibold text-blue-950">{$t.calendar.details.prerequisites}</h3>
      {#if details.required_cert}<p class="text-blue-900/90">{$t.calendar.details.minCert} {details.required_cert}</p>{/if}
      {#if details.required_dives != null}<p class="text-blue-900/90">{$t.calendar.details.loggedDives} {details.required_dives}+</p>{/if}
      {#if details.prerequisites}<p class="whitespace-pre-line text-blue-900/90">{details.prerequisites}</p>{/if}
    </section>
  {/if}
</div>
