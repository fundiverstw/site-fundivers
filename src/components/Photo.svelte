<script lang="ts">
  import { SIZES, type ResponsiveImage } from '$engine/responsive-image'

  // A plain `<img>` for a photo that sizes itself — a headshot, a figure in a
  // grid, a picture beside a paragraph. The sibling of CoverPhoto, which is for
  // the other case: filling a `relative` box behind text.
  //
  // It exists so the five attributes a responsive photo needs (src, srcset,
  // sizes, width, height) are written once instead of at a dozen call sites,
  // where any one of them is easy to leave off — and leaving off `sizes` in
  // particular fails silently, by making the browser fetch the largest copy.
  //
  // Renders nothing when there's no photo. Callers that want something in the
  // empty case draw it themselves, which is what Team.svelte does with its
  // placeholder avatar.
  let {
    image = null,
    alt = '',
    sizes = SIZES.card,
    priority = false,
    class: className = '',
  }: {
    image?: ResponsiveImage | null
    alt?: string
    sizes?: string
    priority?: boolean
    class?: string
  } = $props()
</script>

{#if image}
  <img
    src={image.src}
    srcset={image.srcset}
    {sizes}
    {alt}
    width={image.width}
    height={image.height}
    loading={priority ? 'eager' : 'lazy'}
    fetchpriority={priority ? 'high' : 'auto'}
    class={className}
  />
{/if}
