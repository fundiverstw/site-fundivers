<script lang="ts">
  import { SOCIAL } from '../lib/config'
  import { t } from '../lib/i18n'
  import PageHeader from '../components/PageHeader.svelte'

  // Placeholder gallery tiles until real imagery is wired in (e.g. a Supabase
  // storage bucket or an Instagram feed). Gradients stand in for photos.
  const tiles = [
    'Long Dong wall',
    'Green Island turtles',
    'Kenting reef',
    'Penghu schools',
    'Night dive',
    'Wreck diving',
    'Macro life',
    'Open Water class',
  ]
  const gradients = [
    'from-brand-700 to-reef-600',
    'from-reef-600 to-brand-800',
    'from-brand-800 to-brand-500',
    'from-reef-700 to-reef-400',
    'from-brand-900 to-reef-700',
    'from-reef-500 to-brand-700',
    'from-brand-600 to-reef-500',
    'from-reef-800 to-brand-600',
  ]
</script>

<PageHeader title={$t.photos.title} subtitle={$t.photos.subtitle} />

<section class="mx-auto max-w-[1600px] px-4 py-12 sm:px-6">
  <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
    {#each tiles as caption, i}
      <div class={`relative aspect-square overflow-hidden rounded-xl bg-gradient-to-br ${gradients[i % gradients.length]}`}>
        <div class="absolute inset-0 flex items-end p-3">
          <span class="text-sm font-semibold text-white/90 drop-shadow">{caption}</span>
        </div>
      </div>
    {/each}
  </div>

  <div class="glass mt-10 rounded-2xl p-8 text-center">
    <h2 class="text-xl font-bold text-white">{$t.photos.seeMore}</h2>
    <p class="mt-2 text-brand-100">{$t.photos.follow}</p>
    <div class="mt-4 flex flex-wrap justify-center gap-3">
      <a href={SOCIAL.instagram} target="_blank" rel="noopener" class="rounded-full bg-brand-600 px-5 py-2 text-sm font-semibold text-white hover:bg-brand-700">
        Instagram
      </a>
      <a href={SOCIAL.youtube} target="_blank" rel="noopener" class="rounded-full border border-white/30 px-5 py-2 text-sm font-semibold text-white hover:bg-white/10">
        YouTube
      </a>
    </div>
  </div>
</section>
