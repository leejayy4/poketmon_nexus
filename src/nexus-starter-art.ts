/** Original provisional NEXUS first-form art. Existing species keep their usual sprites. */
const NEXUS_STARTER_ART_IDS = new Set([900001, 900002, 900003]);

/** Returns a transparent 80 × 80 front/back SVG, or undefined for other species. */
export function getNexusStarterSpriteUrl(number: number, back = false): string | undefined {
  if (!NEXUS_STARTER_ART_IDS.has(number)) return undefined;
  return `/assets/nexus-starters/${number}-${back ? 'back' : 'front'}.svg`;
}
