import type { ExpandedTown } from './explore-expansion';
import type { TourOutdoors } from './explore-outdoors';
import type { GameMap } from './types';

export const ECRUTEAK_CITY_SIZE={width:56,height:56};

/** Preserve the former 36x34 center, tower and homes while opening the heritage districts. */
export function extendEcruteakCity(plan:ExpandedTown):ExpandedTown{
  const buildings=plan.buildings.map(building=>building.kind==='landmark'?{
    ...building,x:24,y:8,w:8,h:3,door:{x:26,y:10},room:'tour_ecruteak_hall' as const,
  }:building);
  return {...plan,...ECRUTEAK_CITY_SIZE,buildings,
    features:[...plan.features.map((feature,index)=>index===0?{
      ...feature,name:'방울탑 앞 전승 정원',description:'낮은 돌등과 오래된 나무가 탑 앞 길을 감싼다.\n주민과 포켓몬은 정해진 돌길을 따라 조용히 지난다.',
    }:feature),
      {kind:'grove',x:39,y:5,w:10,h:10,name:'북동 전승숲',description:'탑의 목재와 마을의 오래된 나무를 함께 돌보는 숲이다.\n안쪽은 낮은 울타리 밖에서 관찰한다.'},
      {kind:'rocks',x:5,y:37,w:11,h:8,name:'불탄탑 흔적 관찰터',description:'그을린 기와와 돌기단을 보존한 경계다.\n현재는 외부 흔적을 살피며 내부 사건·전설 조우는 열지 않는다.'},
      {kind:'garden',x:21,y:43,w:13,h:8,name:'37번도로 도착 단풍정원',description:'남문을 지난 여행자가 단풍과 목조 지붕을 처음 마주하는 뜰이다.\n중앙 전승 거리와 센터로 길이 갈라진다.'},
      {kind:'grove',x:40,y:38,w:10,h:11,name:'동쪽 산길 바람막이',description:'42번도로 방향 산바람을 낮은 나무와 담장이 막는다.\n출발 준비 길은 숲 가장자리로 이어진다.'},
    ],
    paths:[...plan.paths,
      [22,10,8,5],[28,12,16,3],[42,13,4,23],[32,32,14,4],
      [12,31,22,4],[10,33,4,15],[13,44,11,4],[18,48,20,4],
      [31,43,14,4],[42,34,4,13],[3,49,16,3],[14,51,5,4],
    ],
  };
}

export function installEcruteakDetails(map:GameMap,outdoors:TourOutdoors){
  const rows=map.walkable.map(row=>row.split(''));
  const objects=[
    {name:'37번도로 도착 기록석',event:'tourEcruteakRoute37Stone',cells:[{x:18,y:48}],pages:['남쪽은 37번도로이며 36번도로에서 도라지와 자연공원·금빛 방향이 갈라진다.\n북쪽 목조 거리가 방울탑 앞까지 이어진다.']},
    {name:'방울탑 전승 거리 표식',event:'tourEcruteakBellStreet',cells:[{x:32,y:14}],pages:['돌등과 목조 담장이 방울탑 앞 전승 거리를 구분한다.\n탑의 전시와 외부 생활은 전설 포획 사건이 아니다.']},
    {name:'불탄탑 외부 보존선',event:'tourEcruteakBurnedBoundary',cells:[{x:16,y:40}],pages:['그을린 기와와 돌기단을 더 훼손하지 않도록 보존선을 두었다.\n내부 탐험·전설 등장·사건 완료는 아직 열지 않았다.']},
    {name:'서쪽 목초지 방향 표석',event:'tourEcruteakRoute38Stone',cells:[{x:5,y:14}],pages:['서쪽 현행 연결은 담청시티 방향이다.\n원작 38번도로·39번도로와 목장 구간은 다음 담당에서 분리한다.']},
    {name:'동쪽 산길 방향 표석',event:'tourEcruteakRoute42Stone',cells:[{x:49,y:18}],pages:['동쪽은 42번도로 본선과 절구산 1층 선택 분기를 지나 황토마을로 이어진다.\n절구산 깊은 층은 아직 열리지 않았다.']},
  ];
  for(const object of objects)for(const cell of object.cells){rows[cell.y][cell.x]='#';map.props.push({...cell,dialogue:object.event});}
  map.walkable=rows.map(row=>row.join(''));outdoors.objects.push(...objects);
}
