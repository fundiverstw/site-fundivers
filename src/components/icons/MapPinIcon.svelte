<script lang="ts">
  let { size = 20 }: { size?: number } = $props()
</script>

<!-- A single marked place — the dive-site catalog. Deliberately not the folded
     map, which stands for the chart itself and belongs to /map. From the
     booking app's MapPinIcon; see README.md in this folder. -->
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
  <path d="M 20 10 c 0 6 -8 11.5 -8 11.5 S 4 16 4 10 a 8 8 0 0 1 16 0 z" />
  <circle cx="12" cy="10" r="2.6" />
</svg>
