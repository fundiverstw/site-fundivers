<script lang="ts">
  let { size = 20 }: { size?: number } = $props()
</script>

<!-- Calendar with one day filled in — the schedule. From the booking app's
     CalendarIcon; see README.md in this folder. -->
<svg
  width={size}
  height={size}
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  aria-hidden="true"
>
  <rect x="3.5" y="5.5" width="17" height="15" rx="2.5" />
  <line x1="3.5" y1="10" x2="20.5" y2="10" />
  <line x1="8" y1="3.5" x2="8" y2="7" />
  <line x1="16" y1="3.5" x2="16" y2="7" />
  <rect x="7" y="13" width="3" height="3" rx="0.5" fill="currentColor" />
</svg>
