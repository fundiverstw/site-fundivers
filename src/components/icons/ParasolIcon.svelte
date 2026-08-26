<script lang="ts">
  let { size = 20 }: { size?: number } = $props()
</script>

<!-- A beach parasol — trips away. The booking app calls this one
     ScheduledTripsIcon, after the screen it sits on; here it is named for what
     it draws. See README.md in this folder. -->
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
  <path d="M12.5 11.134 18.196 21" />
  <path
    d="M20.425 5.299a10 10 0 0 0-16.941 9.78c.183.563.843.774 1.355.478L20.16 6.711c.512-.296.66-.973.264-1.413"
  />
  <path d="M21 21H3" />
</svg>
