import { SPECIES } from './pokemon';
import { encounterPool } from './runtime-encounters';
import { eternaApproachPages } from './eterna-approaches';
import { ETERNA_CORONET_APPROACH } from './eterna-coronet-approach';
import { SINNOH_ROUTE_208 } from './sinnoh-route-208';
import { CINNABAR_ROUTE,CINNABAR_ROUTE_NAME,CINNABAR_DEPARTURE_ROUTE,CINNABAR_DEPARTURE_NAME } from './cinnabar-layout';
import { VERMILION_CERULEAN_ROUTE,VERMILION_CERULEAN_NAME } from './vermilion-layout';

export interface EncounterGuidance {
  hasEncounters: boolean;
  pages: string[];
}

export function encounterGuidance(map: string): EncounterGuidance {
  const pool = encounterPool(map);
  if(map===CINNABAR_DEPARTURE_ROUTE&&!pool)return {hasEncounters:false,pages:['큰 만의 남쪽을 돌아가는 해안길이야.\n북쪽 전망길에서도 양쪽 큰길로 돌아올 수 있어.']};
  if(map===CINNABAR_ROUTE&&!pool)return {hasEncounters:false,pages:['만을 돌아가는 모래길이 홍련으로 이어져.\n북쪽 전망길과 남쪽 바위 샛길도 돌아봐.']};
  if (!pool) return { hasEncounters: false, pages: ['도시 사이를 걷기 좋은 길이야.\n북쪽 공터도 둘러보고 가자.'] };

  const slots = [...pool.slots].sort((a, b) => b.weight - a.weight);
  const common = slots.slice(0, 2).map(slot => SPECIES[slot.speciesId].name).join('·');
  const rare = SPECIES[slots.at(-1)!.speciesId].name;
  return {
    hasEncounters: true,
    pages: [
      slots.length<=2?`만날 수 있는 동료: ${common}\n${map==='tour_union_cave_1f'?'부서진 암반 구역':'풀밭'}에서 천천히 살펴봐.`:`흔한 동료: ${common}\n드물게 ${rare}도 만날 수 있어.`,
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

const GOLDENROD_VIOLET_PASS='tour_pass_goldenrod_violet';
const GOLDENROD_ECRUTEAK_PASS='tour_pass_goldenrod_ecruteak';

function goldenrodNorthPassPages(map:string,left:string,right:string):string[]|undefined{
  if(map===GOLDENROD_VIOLET_PASS)return [
    `← ${left}\n→ ${right}`,
    '본래 경유 1/2\n금빛 → 35번도로 → 자연공원',
    '본래 경유 2/2\n자연공원 → 36번도로 → 도라지',
    '지금은 여러 구간이 한 연결도로로 이어져 있다.\n자연공원과 번호별 도로는 아직 나뉘지 않았다.',
  ];
  if(map===GOLDENROD_ECRUTEAK_PASS)return [
    `← ${left}\n→ ${right}`,
    '본래 경유 1/2\n금빛 → 35번도로 → 자연공원',
    '본래 경유 2/2\n자연공원 → 36번도로 → 37번도로 → 인주',
    '지금은 여러 구간이 한 연결도로로 이어져 있다.\n도라지 갈림길과 번호별 도로는 아직 나뉘지 않았다.',
  ];
}

export function viridianForestGuidePages():string[]{
  return [
    '북쪽은 회색시티, 남쪽은 상록시티야.\n흙길을 따라가면 안전하게 지날 수 있어.',
    '새 동료는 동쪽과 서쪽 풀밭에서 찾아봐.\n두 샛길 모두 흙길로 돌아올 수 있어.',
    ...encounterGuidance('tour_viridian_forest').pages,
    '다친 동료는 두 도시의 센터에서 쉬게 해.\n몬스터볼과 상처약은 상점에서 살 수 있어.',
  ];
}

export function passageSignPages(map: string, left: string, right: string): string[] {
  if(map===CINNABAR_DEPARTURE_ROUTE)return [CINNABAR_DEPARTURE_NAME,`← ${left}\n→ ${right}`,...encounterGuidance(map).pages,'갈색 쪽 센터와 상점에서 준비할 수 있어.\n이 길에서는 걸어서 두 도시를 오갈 수 있어.'];
  if(map===VERMILION_CERULEAN_ROUTE)return [VERMILION_CERULEAN_NAME,`← ${left}\n→ ${right}`,'정식 여행 경유\n갈색 → 6번도로 → 지하통로 → 5번도로 → 블루',...encounterGuidance(map).pages];
  const approach=eternaApproachPages(map);if(approach)return approach;
  if(map===ETERNA_CORONET_APPROACH.id)return [ETERNA_CORONET_APPROACH.name,`← ${left}\n→ ${right}`,'돌계단 본선과 두 전망길은\n모두 천관산 입구 앞에서 합류한다.','이 길에는 야생 풀밭이 없다.\n동료를 돌보려면 영원 센터를 이용하자.','현재 축약 여행의 산기슭 길이다.\n원작의 번호 도로와는 구분한다.'];
  if(map===SINNOH_ROUTE_208.id)return [SINNOH_ROUTE_208.name,`← ${left}\n→ ${right}`,'계단 본선과 개울 산책길은\n연고 입구 앞에서 다시 합류한다.','현재 야생 조우 구역은 적용 전이다.\n천관산에서 동료를 먼저 준비하자.'];
  if(map===CINNABAR_ROUTE)return [CINNABAR_ROUTE_NAME,`← ${left}\n→ ${right}`,...encounterGuidance(map).pages,'홍련에 도착하면 센터에서 쉬어 가.\n연구소에서는 섬의 화산암을 볼 수 있어.'];
  const johtoNorth=goldenrodNorthPassPages(map,left,right);if(johtoNorth)return johtoNorth;
  const guidance = encounterGuidance(map);
  return guidance.hasEncounters
    ? [`← ${left}\n→ ${right}`, ...guidance.pages, ...(map==='tour_pass_jubilife_oreburgh'?['남쪽 자갈밭에서 동료를 만날 수 있어.\n밝은 통로를 따르면 안전하게 지나가.']:[])]
    : [`← ${left}\n→ ${right}`, guidance.pages[0]];
}

export function passageWalkerPages(map: string, left: string, right: string, hasItem: boolean): string[] {
  const approach=eternaApproachPages(map);if(approach)return approach;
  if(map===ETERNA_CORONET_APPROACH.id)return ['낮은 돌길과 위쪽 전망길 어느 쪽도\n천관산 입구로 다시 합류해.',`← ${left}\n→ ${right}`,'야생 포켓몬은 이 입구길에 없고\n천관산 안쪽 풀밭에서 만날 수 있어.','지금은 영원과 산 하부를 잇는 축약 길이야.\n번호 도로 표지는 따로 세우지 않았어.'];
  if(map===SINNOH_ROUTE_208.id)return ['천관산에서 내려오는 208번도로야.\n계단과 개울길이 아래에서 다시 만나.',`← ${left}\n→ ${right}`,'이 맵의 야생 조우는 아직 적용 전이야.\n연고 센터에서 동료를 쉬게 할 수 있어.'];
  const johtoNorth=goldenrodNorthPassPages(map,left,right);if(johtoNorth)return [...johtoNorth,hasItem?'공터의 상처약은 이미 챙겼어.\n같은 길로 두 도시를 오갈 수 있어.':'공터에 상처약이 있어.\n준비한 뒤 같은 길로 돌아올 수 있어.'];
  const guidance = encounterGuidance(map);
  const pages = [...guidance.pages, `← ${left}\n→ ${right}`];
  pages.push(hasItem ? '공터의 도구는 챙겼구나.\n다친 포켓몬에게 써 봐.' : '북쪽 공터에 도구가 있어.\n주변을 둘러보고 가자.');
  return pages;
}
