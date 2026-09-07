import { SPECIES } from './pokemon';
import { encounterPool } from './runtime-encounters';

export interface EncounterGuidance {
  hasEncounters: boolean;
  pages: string[];
}

export function encounterGuidance(map: string): EncounterGuidance {
  const pool = encounterPool(map);
  if (!pool) return { hasEncounters: false, pages: ['도시 사이를 걷기 좋은 길이야.\n북쪽 공터도 둘러보고 가자.'] };

  const slots = [...pool.slots].sort((a, b) => b.weight - a.weight);
  const common = slots.slice(0, 2).map(slot => SPECIES[slot.speciesId].name).join('·');
  const rare = SPECIES[slots.at(-1)!.speciesId].name;
  return {
    hasEncounters: true,
    pages: [
      `흔한 동료: ${common}\n드물게 ${rare}도 만날 수 있어.`,
      `이곳의 포켓몬은\nLv.${pool.levels[0]}~${pool.levels[1]} 정도야.`,
    ],
  };
}

export function routeCompanionPages(map: string): string[] {
  const guidance = encounterGuidance(map);
  const pool = encounterPool(map);
  return [
    pool
      ? `${guidance.pages[0]}\nLv.${pool.levels[0]}~${pool.levels[1]} 정도야.`
      : guidance.pages[0],
    'HP를 절반 이하로 줄인 뒤\n몬스터볼을 던져 동료로 맞아 보자.',
  ];
}

export function passageSignPages(map: string, left: string, right: string): string[] {
  const guidance = encounterGuidance(map);
  return guidance.hasEncounters
    ? [`← ${left}\n→ ${right}`, ...guidance.pages, ...(map==='tour_pass_jubilife_oreburgh'?['남쪽 자갈밭에서 동료를 만날 수 있어.\n밝은 통로를 따르면 안전하게 지나가.']:[])]
    : [`← ${left}\n→ ${right}`, guidance.pages[0]];
}

export function passageWalkerPages(map: string, left: string, right: string, hasItem: boolean): string[] {
  const guidance = encounterGuidance(map);
  const pages = [...guidance.pages, `← ${left}\n→ ${right}`];
  pages.push(hasItem ? '공터의 도구는 챙겼구나.\n다친 포켓몬에게 써 봐.' : '북쪽 공터에 도구가 있어.\n주변을 둘러보고 가자.');
  return pages;
}
