import type { TourOutdoors } from './explore-outdoors';
import type { GameMap } from './types';

const ROUTES={
  up:{destination:'tour_sinnoh_route_204_south',name:'204번도로',pages:['↑ 북쪽 출구 → 204번도로\n험한샛길과 꽃향기마을 방면','길은 험한샛길을 지나 꽃향기마을과 205번도로 남부로 이어진다.']},
  right:{destination:'tour_sinnoh_route_203',name:'203번도로',pages:['→ 동쪽 출구 → 203번도로\n무쇠게이트·무쇠시티 방면','연못과 바위턱이 있는 203번도로를 지나 무쇠게이트로 이어진다.']},
  down:{destination:'tour_sinnoh_route_202',name:'202번도로',pages:['↓ 남쪽 출구 → 202번도로\n잔모래마을 방면','초보 트레이너가 있는 풀길을 따라 잔모래마을과 201번도로로 돌아갈 수 있다.']},
  left:{destination:'tour_sinnoh_route_218',name:'218번도로',pages:['← 서쪽 출구 → 218번도로\n수로 전망·운하시티 방면','육지 접근부와 수로 전망 뒤 서부 연구 연결길을 거쳐 운하시티로 이어진다.']},
} as const;

export function installJubilifeWayfinding(map:GameMap,outdoors:TourOutdoors){
  for(const sign of outdoors.signs){
    const route=ROUTES[sign.direction];
    sign.destination=route.destination;sign.name=route.name;sign.pages=[...route.pages];
  }
  const x=23,y=14,event='jubilifeCityDirectory';
  if(map.walkable[y]?.[x]!=='.'||map.props.some(prop=>prop.x===x&&prop.y===y)||map.npcs.some(npc=>npc.x===x&&npc.y===y))return;
  const row=map.walkable[y].split('');row[x]='#';map.walkable[y]=row.join('');
  map.props.push({x,y,dialogue:event});
  outdoors.objects.push({
    name:'축복시티 종합 안내판',event,cells:[{x,y}],pages:[
      '북서 · 포켓치주식회사\n서쪽 · 포켓몬센터와 트레이너스쿨',
      '동쪽 · 축복방송국\n남쪽 광장길 · 프렌들리숍과 공동주택',
      '북 204 · 동 203 · 남 202 · 서 218\n각 출구 표지에서 다음 경유지를 확인할 수 있다.',
    ],
  });
}
