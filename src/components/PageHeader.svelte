<script lang="ts">
  let {
    title,
    subtitle,
    logo,
    logoAlt = '',
  }: { title: string; subtitle?: string; logo?: string; logoAlt?: string } = $props()
</script>

<section class="text-white">
  <div class="mx-auto max-w-[1600px] px-4 py-12 sm:px-6 sm:py-16">
    {#if logo}
      <img src={logo} alt={logoAlt} class="mb-5 h-14 w-auto max-w-full sm:h-16" />
    {/if}
    <h1 class="text-t1 font-bold tracking-tight">{title}</h1>
    {#if subtitle}
      <p class="mt-3 max-w-2xl text-brand-100">{subtitle}</p>
    {/if}
  </div>
</section>
