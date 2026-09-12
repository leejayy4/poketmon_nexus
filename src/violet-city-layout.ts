import type { ExpandedTown } from './explore-expansion';
import type { TourOutdoors } from './explore-outdoors';
import type { GameMap } from './types';

export const VIOLET_CITY_SIZE={width:48,height:44};

/** Keep the former 36x34 city in place and open eastern and southern districts. */
export function extendVioletCity(plan:ExpandedTown):ExpandedTown{
  const buildings=plan.buildings.map(building=>building.kind==='landmark'?{
    ...building,x:24,y:8,w:8,h:3,door:{x:26,y:10},room:'tour_violet_hall' as const,
  }:building);
  return {...plan,...VIOLET_CITY_SIZE,buildings,
    features:[...plan.features.map((feature,index)=>index===0?{
      ...feature,name:'모다피의 탑 앞 오래된 정원',description:'낮은 돌과 풀 사이로 탑의 나무 기둥이 보인다.\n새 포켓몬이 처마 아래를 오가며 쉰다.',
    }:feature),
      {kind:'garden',x:37,y:5,w:7,h:8,name:'동쪽 수련 뜰',description:'탑 수련생들이 발 디딤과 호흡을 익히는 잔디 뜰이다.\n도시 큰길과 낮은 돌길로 이어진다.'},
      {kind:'grove',x:38,y:19,w:6,h:8,name:'새 포켓몬 쉼숲',description:'낮은 나무와 물그릇을 새 포켓몬이 함께 이용한다.\n사람은 바깥 돌길에서 조용히 살핀다.'},
      {kind:'garden',x:4,y:35,w:9,h:5,name:'남쪽 바람 화단',description:'남쪽 길에서 불어오는 바람에 긴 풀이 한쪽으로 눕는다.\n주택가 산책로가 중앙 큰길로 돌아온다.'},
      {kind:'grove',x:34,y:34,w:10,h:6,name:'도라지 남쪽 완충숲',description:'도시 끝의 낮은 숲이 길과 주택가 사이 바람을 막는다.\n표시된 길은 남쪽 출구까지 이어진다.'},
    ],
    paths:[...plan.paths,
      [22,10,8,4],[28,11,9,3],[34,11,3,23],[36,14,9,3],
      [32,27,13,3],[14,31,23,3],[12,32,5,10],[3,40,15,2],
      [16,37,19,3],[31,31,4,8],[34,39,11,2],
    ],
  };
}

export function installVioletDetails(map:GameMap,outdoors:TourOutdoors){
  const rows=map.walkable.map(row=>row.split(''));
  const objects=[
    {name:'32번도로 도착 기록석',event:'tourVioletRoute32Stone',cells:[{x:19,y:5}],pages:['북쪽 출구 아래 돌에 32번도로의 물가와 연결동굴 방향이 새겨져 있다.\n고동마을까지 같은 길로 돌아갈 수 있다.']},
    {name:'탑 수련 앞마당',event:'tourVioletTrainingYard',cells:[{x:32,y:15}],pages:['나무 기둥의 흔들림을 따라 발을 옮기는 표시가 그려져 있다.\n모다피의 탑 내부 수련과 체육관은 서로 다른 장소다.']},
    {name:'새 포켓몬 물그릇',event:'tourVioletBirdBasin',cells:[{x:36,y:27}],pages:['낮은 물그릇 가장자리에 작은 발자국과 깃털이 남아 있다.\n마을 사람들이 물을 갈아 주는 생활 자리다.']},
    {name:'남쪽 길 방향 표석',event:'tourVioletSouthStone',cells:[{x:19,y:38}],pages:['남쪽 길은 현재 연결 표지를 따라 금빛시티 방향으로 이어진다.\n35번도로·자연공원·36번도로 분리는 후속 경계다.']},
  ];
  for(const object of objects)for(const cell of object.cells){rows[cell.y][cell.x]='#';map.props.push({...cell,dialogue:object.event});}
  map.walkable=rows.map(row=>row.join(''));outdoors.objects.push(...objects);
}
