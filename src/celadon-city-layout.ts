import type { ExpandedTown } from './explore-expansion';
import type { TourOutdoors } from './explore-outdoors';
import type { GameMap } from './types';

export const CELADON_CITY_SIZE={width:72,height:64};

/** Preserve Celadon's former 34x30 core while separating gardens, shopping and route approaches. */
export function extendCeladonCity(plan:ExpandedTown):ExpandedTown{
  return {...plan,...CELADON_CITY_SIZE,
    buildings:[
      {kind:'center',x:6,y:7,w:5,h:2,door:{x:8,y:8},room:'tour_celadon_center'},
      {kind:'landmark',x:22,y:8,w:8,h:3,door:{x:24,y:10},room:'tour_celadon_hall'},
      {kind:'house',x:5,y:19,w:4,h:2,door:{x:6,y:20}},
      {kind:'house',x:21,y:23,w:4,h:2,door:{x:22,y:24}},
      {kind:'house',x:5,y:25,w:4,h:2,door:{x:6,y:26}},
    ],
    features:[...plan.features.map((feature,index)=>index===0?{
      ...feature,name:'무지개 중앙 계절화단',description:'계절마다 색이 달라지는 꽃을 주민과 포켓몬이 함께 돌본다.\n백화점과 포켓몬센터 사이에서 잠시 쉬어 갈 수 있다.',
    }:feature),
      {kind:'garden',x:37,y:5,w:15,h:9,name:'동쪽 향기정원',description:'7번도로에서 들어온 여행자가 도시의 꽃향기와 그늘에 천천히 적응하는 정원이다.'},
      {kind:'fountain',x:38,y:21,w:10,h:8,name:'백화점 앞 분수광장',description:'쇼핑을 마친 주민과 동행 포켓몬이 가방과 물통을 정리하는 넓은 광장이다.'},
      {kind:'garden',x:5,y:39,w:16,h:10,name:'남서 꽃집 재배원',description:'도시 화단에 옮겨 심을 모종을 기르고 잎과 흙의 상태를 살피는 생활 재배원이다.'},
      {kind:'grove',x:51,y:39,w:13,h:13,name:'동남 도시숲 쉼터',description:'상업 거리와 남쪽 긴 여행길 사이에서 사람과 포켓몬이 함께 쉬는 완충숲이다.'},
      {kind:'garden',x:27,y:45,w:15,h:9,name:'사이클링로드 준비뜰',description:'남쪽 16번도로에서 17·18번도로를 거쳐 연분홍으로 향하기 전 장비와 동료 상태를 살피는 뜰이다.'},
    ],
    paths:[...plan.paths,
      [12,3,5,59],[2,11,68,4],[2,31,68,4],[2,58,68,4],
      [30,12,5,47],[34,17,23,4],[48,12,5,20],[52,29,5,31],
      [3,36,22,4],[18,40,5,19],[22,50,25,4],[43,36,22,4],
      [57,18,13,4],[25,36,5,10],[39,53,20,4],
    ],
  };
}

export function installCeladonDetails(map:GameMap,outdoors:TourOutdoors){
  const rows=map.walkable.map(row=>row.split(''));
  const objects=[
    {name:'서쪽 연결 안내판',event:'tourCeladonWestBoard',cells:[{x:4,y:15}],pages:['서쪽은 상록시티와 이어지는 번호 없는 창작 연결길이다.\n관동 공식 도로 번호를 붙이지 않는다.']},
    {name:'7번도로 도착 안내판',event:'tourCeladonRoute7Board',cells:[{x:66,y:15}],pages:['동쪽은 관동7번도로를 지나 노랑시티로 이어진다.\n7번도로 남쪽 입구에서는 동서 지하통로로 갈 수 있다.']},
    {name:'16번도로 방향 표석',event:'tourCeladonCyclingBoard',cells:[{x:18,y:56}],pages:['남쪽은 관동16번도로 → 긴 내리막17번도로 → 연분홍 관문18번도로 → 연분홍시티 순서로 이어진다.\n세 도로는 독립 맵이며 현재는 자전거 조건 없는 도보 연결이다.']},
    {name:'꽃집 모종 작업대',event:'tourCeladonNursery',cells:[{x:23,y:43}],pages:['화단별 햇빛과 물의 양을 기록하며 모종을 나누는 작업대다.\n아이템 지급이나 체육관 조건을 만드는 시설은 아니다.']},
    {name:'도시숲 동료 급수대',event:'tourCeladonCompanionWater',cells:[{x:48,y:46}],pages:['백화점과 긴 도로를 오간 포켓몬이 물을 마시도록 높이가 다른 그릇을 놓았다.\n회복은 포켓몬센터에서 한다.']},
  ];
  for(const object of objects)for(const cell of object.cells){rows[cell.y][cell.x]='#';map.props.push({...cell,dialogue:object.event});}
  map.walkable=rows.map(row=>row.join(''));outdoors.objects.push(...objects);
}
