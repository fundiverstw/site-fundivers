<script lang="ts">
  import { t } from '$engine/i18n'
</script>

<section class="mx-auto flex max-w-[1600px] flex-col items-center gap-4 px-4 py-32 text-center sm:px-6">
  <p class="text-6xl font-bold text-brand-300">{$t.notFound.code}</p>
  <h1 class="text-2xl font-bold text-white">{$t.notFound.title}</h1>
  <p class="text-brand-100">{$t.notFound.text}</p>
  <a href="/" class="rounded-full bg-brand-600 px-6 py-3 font-semibold text-white hover:bg-brand-700">
    {$t.notFound.back}
  </a>
</section>
