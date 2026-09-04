<script lang="ts">
  import { t } from '$engine/i18n'
  // Drawn, not built: this page used to render a dive computer out of CSS
  // gradients and sixteen-segment SVG glyphs, which was a lot of machinery for
  // a page nobody should ever see. The drawing says the same thing.
  //
  // Through ?responsive because the source is a 2 MB PNG and the page paints it
  // 420px wide: the largest copy the browser can pick is 960px, and a phone
  // takes a 384px one.
  import art from '$assets/404.png?responsive'
</script>

<section
  class="mx-auto flex max-w-[1600px] flex-col items-center gap-8 px-4 py-24 text-center sm:px-6"
>
  <!-- Decorative. The drawing's own screen reads "404 / PAGE NOT FOUND" in
       English only; the meaning of this page is in the translated heading and
       paragraph below, which is where a screen reader finds it too. -->
  <img
    src={art.src}
    srcset={art.srcset}
    sizes="(min-width: 640px) 420px, 90vw"
    width={art.width}
    height={art.height}
    alt=""
    class="w-[min(90vw,420px)] rounded-3xl shadow-2xl"
  />

  <!-- Accessible, translated copy. State the error code here for screen
       readers, since the picture above cannot. -->
  <div class="flex flex-col items-center gap-3">
    <span class="sr-only">{$t.notFound.code}</span>
    <h1 class="text-t2 font-bold text-white">{$t.notFound.title}</h1>
    <p class="max-w-md text-brand-100">{$t.notFound.text}</p>
    <a
      href="/"
      class="mt-2 rounded-full bg-brand-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-brand-700"
    >
      {$t.notFound.back}
    </a>
  </div>
</section>
