<script lang="ts">
  import taiwanGeo from '../lib/taiwan.geo.json'
  import { fetchDiveSites, diveSitePath, type DiveSite, type Region } from '../lib/sites'
  import { placeLabels } from '../lib/map-layout'
  import { t } from '../lib/i18n'
  import PageHeader from '../components/PageHeader.svelte'

  // Ported from app-fundivers MapPage.tsx (see reference/dive-map). Inline SVG
  // map of Taiwan with clickable regions, a per-region site list, and links out
  // to each site's travel page. Projection + label placement are the original
  // framework-agnostic logic; only the rendering is Svelte.

  interface RegionInfo {
    name: string
    center: [number, number] // [lon, lat] overview marker
    bbox: [number, number, number, number] // [minLon, minLat, maxLon, maxLat]
    description: string
    maxZoom?: number
  }

  const REGIONS: Record<Region, RegionInfo> = {
    keelung: {
      name: 'Keelung / Badouzi', center: [121.81, 25.15], bbox: [121.785, 25.122, 121.836, 25.195],
      description: 'Northern port-area diving — Badouzi Bay reefs and shipwrecks, with Keelung Islet just offshore.',
      maxZoom: 40,
    },
    longdong: {
      name: 'Long Dong Bay', center: [121.91, 25.118], bbox: [121.895, 25.108, 121.927, 25.130],
      description: 'The classic northeast wall and reef dives — sheer basalt cliffs, deep gullies, dramatic rock formations.',
      maxZoom: 40,
    },
    yilan: {
      name: 'Yilan / Turtle Island', center: [121.95, 24.95], bbox: [121.810, 24.800, 121.990, 25.050],
      description:
        "East-coast diving — Toucheng / Wai'ao reefs, the Cathedral and Cauliflower Garden walls, the Wan An Jian wreck, " +
        'and Turtle Island offshore (Guishan Dao).',
    },
    greenisland: {
      name: 'Green Island (Lyudao)', center: [121.4901443, 22.6620886], bbox: [121.460, 22.625, 121.530, 22.700],
      description:
        'Green Island is located off the coast of Taitung, on the southeast coast of Taiwan. It is a favorite dive ' +
        'destination for many locals. Renowned for its impressive visibility, which can reach up to 30–40 m, it is ideal ' +
        'for photography enthusiasts.',
    },
    lanyu: {
      name: 'Lanyu (Orchid Island)', center: [121.548418, 22.0435616], bbox: [121.470, 21.985, 121.605, 22.115],
      description:
        'Orchid Island is best known for the Badai Wreck, a Korean lumber-carrying vessel that starts at 26 m and ' +
        'descends to 40 m deep.',
    },
    xiaoliuqiu: {
      name: 'Xiao Liuqiu (Lambai Island)', center: [120.3715149, 22.3404158], bbox: [120.350, 22.315, 120.405, 22.365],
      description:
        'Xiao Liuqiu / Lambai is a large coral island. Due to its nesting beach, it is home to hundreds of green sea ' +
        'turtles that both snorkelers and divers can enjoy.',
    },
    kenting: {
      name: 'Kenting', center: [120.7797516, 21.9483307], bbox: [120.685, 21.925, 120.845, 22.020],
      description:
        'Kenting has been a top dive destination in Taiwan for decades. It is best known for its myriad of corals that ' +
        'are plastered atop the reef.',
    },
    penghu: {
      name: 'Penghu Islands', center: [119.5793157, 23.5711899], bbox: [119.290, 23.090, 119.760, 23.700],
      description:
        'Of all the dive locations in Taiwan, Penghu has the most fish in numbers, size, and diversity! If you have the ' +
        "experience and time, it's a definite must-see!",
    },
  }

  const REGION_ORDER: Region[] = [
    'keelung', 'longdong', 'yilan', 'greenisland', 'lanyu', 'xiaoliuqiu', 'kenting', 'penghu',
  ]

  // --- Projection ----------------------------------------------------------
  const VIEW_W = 290
  const VIEW_H = 360
  const COS_MID_LAT = Math.cos((23.5 * Math.PI) / 180)
  const LAT_PX_PER_DEG = 100
  const LON_PX_PER_DEG = LAT_PX_PER_DEG * COS_MID_LAT
  const LON_MIN = 119.2
  const LAT_MAX = 25.3
  const MARGIN = 10

  const projectX = (lon: number) => (lon - LON_MIN) * LON_PX_PER_DEG + MARGIN
  const projectY = (lat: number) => (LAT_MAX - lat) * LAT_PX_PER_DEG + MARGIN

  function bboxToSvgRect(bbox: [number, number, number, number]) {
    const [lon0, lat0, lon1, lat1] = bbox
    const x = projectX(lon0)
    const y = projectY(lat1)
    return { x, y, w: projectX(lon1) - x, h: projectY(lat0) - y }
  }

  const REGION_BBOX_SVG = Object.fromEntries(
    REGION_ORDER.map((r) => [r, bboxToSvgRect(REGIONS[r].bbox)]),
  ) as Record<Region, { x: number; y: number; w: number; h: number }>

  const MAX_ZOOM = 18

  function scaleForRegion(r: Region): number {
    const b = REGION_BBOX_SVG[r]
    const cap = REGIONS[r].maxZoom ?? MAX_ZOOM
    return Math.min(VIEW_W / b.w, VIEW_H / b.h, cap)
  }

  function transformForRegion(r: Region | null): string {
    if (!r) return 'translate(0px, 0px) scale(1)'
    const b = REGION_BBOX_SVG[r]
    const scale = scaleForRegion(r)
    const cx = b.x + b.w / 2
    const cy = b.y + b.h / 2
    return `translate(${VIEW_W / 2 - scale * cx}px, ${VIEW_H / 2 - scale * cy}px) scale(${scale})`
  }

  function siteToViewBoxXY(lon: number, lat: number, region: Region): [number, number] {
    const px = projectX(lon)
    const py = projectY(lat)
    const b = REGION_BBOX_SVG[region]
    const scale = scaleForRegion(region)
    const cx = b.x + b.w / 2
    const cy = b.y + b.h / 2
    return [scale * px + (VIEW_W / 2 - scale * cx), scale * py + (VIEW_H / 2 - scale * cy)]
  }

  // --- Path construction ---------------------------------------------------
  type Ring = number[][]
  interface Feature { geometry: { type: string; coordinates: Ring[] | Ring[][] } }

  function ringToPath(ring: Ring): string {
    return (
      ring
        .map((c, i) => `${i === 0 ? 'M' : 'L'}${projectX(c[0]).toFixed(2)} ${projectY(c[1]).toFixed(2)}`)
        .join(' ') + ' Z'
    )
  }

  const features = (taiwanGeo as { features: Feature[] }).features
  const allPaths = features.map((f) => ringToPath((f.geometry.coordinates as Ring[])[0]))

  function strokeWidthForZoom(r: Region | null): number {
    return r ? 0.5 / scaleForRegion(r) : 0.5
  }

  // --- State ---------------------------------------------------------------
  let selected = $state<Region | null>(null)
  let sites = $state<DiveSite[]>([])

  $effect(() => {
    fetchDiveSites()
      .then((s) => (sites = s))
      .catch(() => (sites = [])) // empty list still renders region pins
  })

  let sitesByRegion = $derived.by(() => {
    const m = new Map<Region, DiveSite[]>()
    REGION_ORDER.forEach((r) => m.set(r, []))
    for (const s of sites) if (m.has(s.region)) m.get(s.region)!.push(s)
    return m
  })

  let visibleSites = $derived(selected ? sitesByRegion.get(selected) ?? [] : [])
  let stroke = $derived(strokeWidthForZoom(selected))

  let visibleSiteLayout = $derived.by(() => {
    if (!selected) return []
    const region = selected
    const projected = visibleSites.map((s) => {
      const [vx, vy] = siteToViewBoxXY(s.longitude, s.latitude, region)
      return { name: s.name, vx, vy }
    })
    return placeLabels(projected, { bounds: { width: VIEW_W, height: VIEW_H } }).map((p) => ({
      site: visibleSites[p.index],
      vx: p.vx, vy: p.vy, labelX: p.labelX, labelY: p.labelY,
      anchor: p.anchor, leaderStart: p.leaderStart, leaderEnd: p.leaderEnd,
    }))
  })

  function pick(r: Region) {
    selected = selected === r ? null : r
  }
  function regionKeyDown(e: KeyboardEvent, r: Region) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      pick(r)
    }
  }
</script>

<PageHeader title={$t.map.title} subtitle={$t.map.hint} />

<section class="mx-auto max-w-2xl space-y-4 px-4 py-8 sm:px-6">
  {#if selected}
    <div class="flex justify-end">
      <button type="button" onclick={() => (selected = null)} class="mono text-xs font-semibold text-reef-300 hover:text-reef-200">
        {$t.map.back}
      </button>
    </div>
  {/if}

  <!-- The map -->
  <div class="glass flex justify-center rounded-2xl p-4">
    <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} class="w-full max-w-md" role="img" aria-label={$t.map.title}>
      <defs>
        <marker id="site-arrow" viewBox="0 0 12 4" refX="11" refY="2" markerWidth="3.5" markerHeight="2.5" orient="auto">
          <path d="M 0 0 L 12 2 L 0 4 Z" fill="#dc2626" />
        </marker>
      </defs>

      <!-- Zoomable coastline group; markers/labels live outside so they keep a fixed visual size. -->
      <g style={`transform: ${transformForRegion(selected)}; transform-origin: 0 0; transition: transform 500ms cubic-bezier(0.4, 0, 0.2, 1);`}>
        {#each allPaths as d, i (i)}
          <path {d} fill="rgb(186 230 253)" stroke="#0284c7" stroke-width={stroke} stroke-linejoin="round" />
        {/each}
      </g>

      <!-- Region pins (overview only) -->
      {#if !selected}
        {#each REGION_ORDER as id (id)}
          {@const cx = projectX(REGIONS[id].center[0])}
          {@const cy = projectY(REGIONS[id].center[1])}
          <g
            role="button"
            tabindex="0"
            aria-label={REGIONS[id].name}
            onclick={() => pick(id)}
            onkeydown={(e) => regionKeyDown(e, id)}
            class="cursor-pointer text-emerald-500 outline-none transition-colors hover:text-emerald-600 focus:text-emerald-700"
          >
            <circle {cx} {cy} r="11" fill="transparent" />
            <circle {cx} {cy} r="4.5" fill="currentColor" stroke="white" stroke-width="1.5" />
          </g>
        {/each}
      {/if}

      <!-- Site markers (zoomed in) -->
      {#if selected}
        {#each visibleSiteLayout as item (item.site.id)}
          <g class="pointer-events-none">
            <line
              x1={item.leaderStart[0]} y1={item.leaderStart[1]}
              x2={item.leaderEnd[0]} y2={item.leaderEnd[1]}
              stroke="#dc2626" stroke-width="1.4" stroke-opacity="0.8" marker-end="url(#site-arrow)"
            />
            <a href={diveSitePath(item.site)} aria-label={item.site.name} class="pointer-events-auto cursor-pointer">
              <circle cx={item.vx} cy={item.vy} r="3" fill="#dc2626" stroke="white" stroke-width="1.2" />
              <text x={item.labelX} y={item.labelY} text-anchor={item.anchor} font-size="10" font-weight="700" fill="#1e3a8a" stroke="white" stroke-width="3.2" paint-order="stroke fill" stroke-linejoin="round" style="text-decoration: underline">{item.site.name}</text>
            </a>
          </g>
        {/each}
      {/if}
    </svg>
  </div>

  <!-- Region list -->
  <div class="grid grid-cols-2 gap-2">
    {#each REGION_ORDER as id (id)}
      {@const active = selected === id}
      <button
        type="button"
        onclick={() => pick(id)}
        class={`mono rounded-xl border p-3 text-left text-sm transition-all ${active ? 'border-reef-400/60 bg-reef-400/15 font-semibold text-reef-200 shadow-[0_0_18px_-6px_rgba(44,208,197,0.7)]' : 'border-white/15 bg-white/5 text-brand-50 hover:border-white/25 hover:bg-white/10'}`}
      >
        {REGIONS[id].name}
      </button>
    {/each}
  </div>

  <!-- Selected region detail -->
  {#if selected}
    <div class="glass rounded-2xl p-5">
      <div class="mb-2 flex items-start justify-between gap-2">
        <h2 class="text-lg font-bold text-white">{REGIONS[selected].name}</h2>
        <button type="button" onclick={() => (selected = null)} aria-label={$t.map.close} class="-mt-1 px-2 text-2xl leading-none text-white/60 hover:text-white">×</button>
      </div>
      <p class="mb-3 text-sm text-brand-100">{REGIONS[selected].description}</p>
      {#if visibleSites.length > 0}
        <h3 class="mono mb-2 text-xs font-semibold uppercase tracking-wider text-reef-300">{$t.map.diveSites}</h3>
        <ul class="space-y-2 text-sm text-brand-50">
          {#each visibleSites as s (s.id)}
            <li>
              <a href={diveSitePath(s)} class="font-semibold text-white underline decoration-reef-400/50 underline-offset-2 hover:decoration-reef-300">{s.name}</a>
              {#if s.tagline}<p class="mt-0.5 text-xs text-brand-200">{s.tagline}</p>{/if}
            </li>
          {/each}
        </ul>
      {/if}
    </div>
  {/if}
</section>
