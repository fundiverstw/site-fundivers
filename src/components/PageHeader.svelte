<script lang="ts">
  let { title, subtitle }: { title: string; subtitle?: string } = $props()
</script>

<section class="text-white">
  <div class="mx-auto max-w-[1600px] px-4 py-12 sm:px-6 sm:py-16">
    <h1 class="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
    {#if subtitle}
      <p class="mt-3 max-w-2xl text-brand-100">{subtitle}</p>
    {/if}
  </div>
</section>
