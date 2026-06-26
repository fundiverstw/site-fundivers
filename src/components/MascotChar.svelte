<script lang="ts">
  let { size = 54 }: { size?: number } = $props()
</script>

<!-- A cute little octopus — 8 arms: two raised to hold up the banner, six
     fanning out below. -->
<svg width={size} height={(size * 130) / 140} viewBox="0 0 140 130" fill="none" aria-hidden="true">
  <!-- 2 raised arms (holding the banner) -->
  <path d="M48 42 C36 26 40 14 54 14" stroke="#f5824f" stroke-width="9" stroke-linecap="round" />
  <path d="M92 42 C104 26 100 14 86 14" stroke="#f5824f" stroke-width="9" stroke-linecap="round" />
  <!-- 6 lower arms -->
  <path d="M42 78 C26 92 24 108 32 120" stroke="#ff8a5b" stroke-width="8" stroke-linecap="round" />
  <path d="M52 84 C46 102 50 114 56 122" stroke="#ff8a5b" stroke-width="8" stroke-linecap="round" />
  <path d="M63 86 C61 104 61 116 61 124" stroke="#ff8a5b" stroke-width="8" stroke-linecap="round" />
  <path d="M77 86 C79 104 79 116 79 124" stroke="#ff8a5b" stroke-width="8" stroke-linecap="round" />
  <path d="M88 84 C94 102 90 114 84 122" stroke="#ff8a5b" stroke-width="8" stroke-linecap="round" />
  <path d="M98 78 C114 92 116 108 108 120" stroke="#ff8a5b" stroke-width="8" stroke-linecap="round" />
  <!-- head / body -->
  <ellipse cx="70" cy="56" rx="40" ry="34" fill="#ff8a5b" />
  <ellipse cx="70" cy="64" rx="24" ry="17" fill="#ffb38f" opacity="0.55" />
  <!-- eyes -->
  <circle cx="56" cy="52" r="10" fill="#fff" />
  <circle cx="58" cy="54" r="5" fill="#26344f" />
  <circle cx="55.5" cy="50.5" r="2" fill="#fff" />
  <circle cx="84" cy="52" r="10" fill="#fff" />
  <circle cx="82" cy="54" r="5" fill="#26344f" />
  <circle cx="81.5" cy="50.5" r="2" fill="#fff" />
  <!-- smile + cheeks -->
  <path d="M62 68 q8 8 16 0" stroke="#26344f" stroke-width="3" stroke-linecap="round" />
  <circle cx="47" cy="64" r="5" fill="#ff6b8a" opacity="0.5" />
  <circle cx="93" cy="64" r="5" fill="#ff6b8a" opacity="0.5" />
</svg>
