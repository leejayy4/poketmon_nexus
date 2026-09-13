import type { ExpandedTown } from './explore-expansion';
import type { TourOutdoors } from './explore-outdoors';
import type { GameMap } from './types';

export const FUCHSIA_CITY_SIZE={width:56,height:56};

/** Expand Fuchsia around a protected wetland, daily care streets and three distinct travel edges. */
export function extendFuchsiaCity(plan:ExpandedTown):ExpandedTown{
  return {...plan,...FUCHSIA_CITY_SIZE,
    buildings:[
      {kind:'center',x:6,y:7,w:5,h:2,door:{x:8,y:8},room:'tour_fuchsia_center'},
      {kind:'landmark',x:22,y:8,w:8,h:3,door:{x:24,y:10},room:'tour_fuchsia_hall'},
      {kind:'house',x:5,y:19,w:4,h:2,door:{x:6,y:20}},
      {kind:'house',x:21,y:23,w:4,h:2,door:{x:22,y:24}},
      {kind:'house',x:5,y:25,w:4,h:2,door:{x:6,y:26}},
    ],
    features:[...plan.features.map((feature,index)=>index===0?{
      ...feature,name:'연분홍 중앙 보호숲',description:'도시 생활 구역과 보호구역 사이의\n낮은 경계 숲이다.',
    }:feature.name==='광장 분수'?{...feature,description:'광장 가운데 작은 물줄기가 솟는다.\n여행자가 쉬어 가는 자리다.'}:feature),
      {kind:'water',x:31,y:5,w:15,h:11,name:'북동 관찰 연못',description:'안내소 뒤 관찰 데크다.\n물가 흔적과 갈대를 살핀다.'},
      {kind:'grove',x:36,y:19,w:13,h:12,name:'보호구역 완충숲',description:'도시와 보호구역 사이의 숲이다.\n작은 포켓몬이 몸을 숨긴다.'},
      {kind:'garden',x:16,y:35,w:15,h:10,name:'돌봄 작업뜰',description:'먹이 그릇과 관찰 도구를 씻는다.\n동료의 젖은 발도 살핀다.'},
      {kind:'water',x:37,y:38,w:12,h:10,name:'남부 습지 바람터',description:'19번수로 쪽 바람을 느끼며\n도시 연못의 수위를 비교한다.'},
    ],
    paths:[...plan.paths,
      [2,16,52,4],[12,3,5,51],[2,31,52,4],[2,50,52,4],
      [26,12,5,22],[30,17,20,4],[32,28,18,4],[29,34,5,18],
      [3,36,14,4],[10,38,5,13],[33,35,18,4],[48,18,4,33],
    ],
  };
}

export function installFuchsiaDetails(map:GameMap,outdoors:TourOutdoors){
  const rows=map.walkable.map(row=>row.split(''));
  const objects=[
    {name:'18번도로 도착 기록석',event:'tourFuchsiaRoute18Arrival',cells:[{x:4,y:20}],pages:['서쪽: 18→17→16번도로\n그 너머는 무지개시티다.','현재는 도보로 왕복한다.\n자전거를 통행 조건으로 삼지 않는다.']},
    {name:'보호구역 관찰 규칙판',event:'tourFuchsiaReserveRules',cells:[{x:28,y:15}],pages:['표시된 관찰길에서 보고\n생활 포켓몬과 거리를 둔다.','보호구역 입장·포획 규칙은\n독립 구현 전까지 적용하지 않는다.']},
    {name:'관찰 연못 수위표',event:'tourFuchsiaPondGauge',cells:[{x:34,y:16}],pages:['북동 연못과 남부 습지의\n수위를 비교하는 표다.','조사만으로 조우·포획·도구는\n발생하지 않는다.']},
    {name:'돌봄 도구 세척대',event:'tourFuchsiaCareWash',cells:[{x:15,y:39}],pages:['관찰 도구와 동료의 발에서\n묻은 흙을 씻는 세척대다.','실제 HP 회복은\n포켓몬센터에서 한다.']},
    {name:'12→13→14→15번도로 방향판',event:'tourFuchsiaEastRoadBoard',cells:[{x:51,y:16}],pages:['후속15→14→13→12번도로가\n보라타운으로 이어질 자리다.','현재는 보라 방면 축약 연결이다.\n네 도로는 아직 독립되지 않았다.']},
    {name:'19번수로 전망 표석',event:'tourFuchsiaRoute19Outlook',cells:[{x:31,y:49}],pages:['남쪽 출구: 관동19번수로 연락선\n후속20번수로·쌍둥이섬→홍련 방향','19번수로는 왕복 가능하다.\n20번수로와 쌍둥이섬은 아직 열지 않았다.']},
  ];
  for(const object of objects)for(const cell of object.cells){rows[cell.y][cell.x]='#';map.props.push({...cell,dialogue:object.event});}
  map.walkable=rows.map(row=>row.join(''));outdoors.objects.push(...objects);
}
