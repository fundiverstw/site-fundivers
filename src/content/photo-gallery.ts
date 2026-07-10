// Photo-gallery catalog for the /photos page. These are self-hosted dive photos
// under public/imgs/gallery/<category>/ (AVIF, optimized). Two sets: macro
// nudibranch shots and wider reef / marine-life photos. Add files to the folder
// and list them here.

export type GallerySection = { key: string; images: string[] }

const nudibranchs: string[] = [
  '/imgs/gallery/nudibranchs/b37fef_001ac8cae76d47b7808984706d504018_mv2.avif',
  '/imgs/gallery/nudibranchs/b37fef_145a9d6779c04088ac85e619f2dffc95_mv2.avif',
  '/imgs/gallery/nudibranchs/b37fef_15e2aa8e635b4d07bc24effb8f6ea632_mv2.avif',
  '/imgs/gallery/nudibranchs/b37fef_301b2a669e334a919c477752c7cdcfa7_mv2.avif',
  '/imgs/gallery/nudibranchs/b37fef_3cbfe40f7ca64c16b2099622661b0108_mv2.avif',
  '/imgs/gallery/nudibranchs/b37fef_3e3eef8faa104c61a7f91e1ed5ed7db2_mv2.avif',
  '/imgs/gallery/nudibranchs/b37fef_522c1b56b18e4ace9a6fe6e89dc6af98_mv2.avif',
  '/imgs/gallery/nudibranchs/b37fef_6aaac722ae424eb58fe71ab0c1d8326d_mv2.avif',
  '/imgs/gallery/nudibranchs/b37fef_8babbfc22f324dffac16776d7f41eee4_mv2.avif',
  '/imgs/gallery/nudibranchs/b37fef_8e3180976b0241fd8983ff9f660ea9a9_mv2.avif',
  '/imgs/gallery/nudibranchs/b37fef_96fac3e76c1d42f0affd0b06699cab51_mv2.avif',
  '/imgs/gallery/nudibranchs/b37fef_c0667d4b32cc4ddc9890be45b53728b5_mv2.avif',
  '/imgs/gallery/nudibranchs/b37fef_d72fa160211d4ffcb540195c8e86900a_mv2.avif',
  '/imgs/gallery/nudibranchs/b37fef_e0c7c3a12a1d4787be3943657801f4da_mv2.avif',
  '/imgs/gallery/nudibranchs/b37fef_e62dbb675b644cb89ace00189359cbe5_mv2.avif',
  '/imgs/gallery/nudibranchs/b37fef_fb8db6bcbf4f4661a11e3edc5bbaf69d_mv2.avif',
]

const reef: string[] = [
  '/imgs/gallery/reef/b37fef_0a355c68c5494e7fb465f28898d870b6_mv2.avif',
  '/imgs/gallery/reef/b37fef_0ad361d641664798b9f03e03fd74181a_mv2.avif',
  '/imgs/gallery/reef/b37fef_25e66d59603e4316b1def36bc4072e37_mv2.avif',
  '/imgs/gallery/reef/b37fef_29ba8d22db53481fb80e5fa43f4b3b3c_mv2.avif',
  '/imgs/gallery/reef/b37fef_3094b1b44c674b9594412cd50f24f6ac_mv2.avif',
  '/imgs/gallery/reef/b37fef_5fc10a5cb160416e9f846d867f4def49_mv2.avif',
  '/imgs/gallery/reef/b37fef_6abc6fc40b334fdaa0b5153e659f693f_mv2.avif',
  '/imgs/gallery/reef/b37fef_791b9c897f3a44898bcd103c138d705e_mv2.avif',
  '/imgs/gallery/reef/b37fef_7be7b57082534582ac3eb5f7e7e22723_mv2.avif',
  '/imgs/gallery/reef/b37fef_aad786cd2f344a4faa0f967e79e79fd2_mv2.avif',
  '/imgs/gallery/reef/b37fef_b289a5e811074dd0a330c97d4668820a_mv2.avif',
  '/imgs/gallery/reef/b37fef_b78266df243f4d388f28c5430014164b_mv2.avif',
  '/imgs/gallery/reef/b37fef_ca028e4ea29e44aa9cd15c89755a151d_mv2.avif',
  '/imgs/gallery/reef/b37fef_cb175bdf2a944d6599570d66ef4b66cf_mv2.avif',
  '/imgs/gallery/reef/b37fef_d9fce3b40f55407ab9bc3d0756f59373_mv2.avif',
  '/imgs/gallery/reef/b37fef_dd6d2e0dddf84a60a77330e75ea41253_mv2.avif',
  '/imgs/gallery/reef/b37fef_ee16fff470d94ef1a78da1786355d6a2_mv2.avif',
  '/imgs/gallery/reef/b37fef_f39cba46f8f04ec5ba15f50a680e51ba_mv2.avif',
  '/imgs/gallery/reef/b37fef_f4fdbe0906d540d6a6a7ee51abdfb645_mv2.avif',
  '/imgs/gallery/reef/b37fef_f86a23b654b84f7c879dc706c91d6f80_mv2.avif',
]

// Sections in display order. `key` maps to an i18n label ($t.photos.sections).
export const GALLERY: GallerySection[] = [
  { key: 'nudibranchs', images: nudibranchs },
  { key: 'reef', images: reef },
]

/** Flat list of every image, in section order — used by the lightbox. */
export const ALL_PHOTOS: string[] = GALLERY.flatMap((s) => s.images)
