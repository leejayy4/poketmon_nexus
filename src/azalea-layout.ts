import type { ExpandedTown } from './explore-expansion';
import type { TourOutdoors } from './explore-outdoors';
import type { GameMap } from './types';

export const AZALEA_SIZE={width:40,height:36};

/** Preserve the former 34x30 village and extend its eastern and southern edge. */
export function extendAzaleaTown(plan:ExpandedTown):ExpandedTown{
  return {...plan,...AZALEA_SIZE,
    features:[...plan.features.map((feature,index)=>index===0?{...feature,name:'서쪽 숲 입구 규토리 나무',description:'너도밤나무숲에서 나온 길에 규토리 나무가 서 있다.\n마을 사람들은 열매가 익는 때를 함께 살핀다.'}:feature),
      {kind:'grove',x:32,y:4,w:5,h:8,name:'동쪽 마을 바람막이',description:'낮은 나무들이 마을 안쪽 바람을 막아 준다.\n큰길은 나무 아래에서 남쪽으로 굽는다.'},
      {kind:'garden',x:34,y:16,w:4,h:7,name:'공방 옆 규토리 마당',description:'색과 단단함이 다른 규토리를 나누어 놓았다.\n공방에서 쓰기 전에 천천히 말리는 자리다.'},
      {kind:'water',x:21,y:29,w:7,h:4,name:'야돈우물 주변 샘터',description:'낮은 돌담 안으로 맑은 물이 고여 있다.\n현재는 우물 주변을 살펴보는 마을 쉼터다.'},
      {kind:'grove',x:31,y:28,w:6,h:5,name:'남동쪽 마을 숲',description:'마을과 다음 도로 사이에 나무 그늘이 남아 있다.\n주민과 포켓몬이 더위를 피하는 곳이다.'},
    ],
    paths:[...plan.paths,
      [30,10,8,3],[28,11,3,18],[16,27,15,3],[14,28,4,6],
      [27,22,10,3],[28,24,3,8],[16,32,15,2],[35,23,3,5],
    ],
  };
}

export function installAzaleaDetails(map:GameMap,outdoors:TourOutdoors){
  const rows=map.walkable.map(row=>row.split(''));
  const objects=[
    {name:'공방 앞 규토리 선별 자리',event:'tourAzaleaApricornYard',cells:[{x:33,y:23}],pages:['말린 천 위에 색과 단단함이 다른 규토리를 나눠 놓았다.\n공방 안 작업대에서 다음 과정을 살펴볼 수 있다.']},
    {name:'야돈우물 주변 관찰석',event:'tourAzaleaWell',cells:[{x:20,y:31}],pages:['낮은 돌 위에서 물결과 발자국을 살필 수 있다.\n현재는 구조 사건이 아닌 마을 생태 관찰 장소다.']},
    {name:'33번도로 출발 표석',event:'tourAzaleaRoute33Stone',cells:[{x:17,y:5}],pages:['북쪽 출구는 33번도로로 이어진다.\n연결동굴 1층과 32번도로를 지나면 도라지시티다.']},
  ];
  for(const object of objects)for(const cell of object.cells){rows[cell.y][cell.x]='#';map.props.push({...cell,dialogue:object.event});}
  map.walkable=rows.map(row=>row.join(''));outdoors.objects.push(...objects);
}
