<script lang="ts">
  let { size = 20 }: { size?: number } = $props()
</script>

<!-- Add — a trip that does not exist on the schedule yet. From the booking
     app's PlusSquareIcon; see README.md in this folder. -->
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
  <rect x="3.5" y="3.5" width="17" height="17" rx="2.5" />
  <line x1="12" y1="8.5" x2="12" y2="15.5" />
  <line x1="8.5" y1="12" x2="15.5" y2="12" />
</svg>
