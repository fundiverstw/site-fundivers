<script lang="ts">
  let { size = 64 }: { size?: number } = $props()
</script>

<!-- A cute little octopus with its arms raised to hold up the ad banner. -->
<svg width={size} height={(size * 120) / 140} viewBox="0 0 140 120" fill="none" aria-hidden="true">
  <!-- raised arms -->
  <path d="M42 48 C30 32 32 18 46 16" stroke="#f5824f" stroke-width="9" stroke-linecap="round" />
  <path d="M98 48 C110 32 108 18 94 16" stroke="#f5824f" stroke-width="9" stroke-linecap="round" />
  <!-- dangling tentacles -->
  <path d="M44 86 C40 100 46 108 52 110" stroke="#ff8a5b" stroke-width="8" stroke-linecap="round" />
  <path d="M70 92 C70 104 70 110 70 114" stroke="#ff8a5b" stroke-width="8" stroke-linecap="round" />
  <path d="M96 86 C100 100 94 108 88 110" stroke="#ff8a5b" stroke-width="8" stroke-linecap="round" />
  <!-- head / body -->
  <ellipse cx="70" cy="62" rx="40" ry="34" fill="#ff8a5b" />
  <ellipse cx="70" cy="70" rx="24" ry="17" fill="#ffb38f" opacity="0.55" />
  <!-- eyes -->
  <circle cx="56" cy="58" r="10" fill="#fff" />
  <circle cx="58" cy="60" r="5" fill="#26344f" />
  <circle cx="55.5" cy="56.5" r="2" fill="#fff" />
  <circle cx="84" cy="58" r="10" fill="#fff" />
  <circle cx="82" cy="60" r="5" fill="#26344f" />
  <circle cx="81.5" cy="56.5" r="2" fill="#fff" />
  <!-- smile + cheeks -->
  <path d="M62 74 q8 8 16 0" stroke="#26344f" stroke-width="3" stroke-linecap="round" />
  <circle cx="47" cy="70" r="5" fill="#ff6b8a" opacity="0.5" />
  <circle cx="93" cy="70" r="5" fill="#ff6b8a" opacity="0.5" />
</svg>
