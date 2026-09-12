import type { ExpandedTown } from './explore-expansion';
import type { TourBuilding,TourFeature } from './explore-world';

export const UNDELLA_TOWN_SIZE={width:48,height:40};

/** 리버스마운틴의 붉은 동굴에서 바닷바람 생활권으로 전환되는 물결마을 외부. */
export function undellaPlan():ExpandedTown{
  const buildings:TourBuilding[]=[
    {kind:'center',x:6,y:6,w:6,h:3,door:{x:9,y:8},room:'tour_undella_center'},
    {kind:'landmark',x:25,y:7,w:10,h:4,door:{x:30,y:10},room:'tour_undella_hall'},
    {kind:'house',x:6,y:20,w:5,h:3,door:{x:8,y:22}},
    {kind:'house',x:18,y:23,w:5,h:3,door:{x:20,y:25}},
    {kind:'house',x:31,y:20,w:5,h:3,door:{x:33,y:22}},
  ];
  const features:TourFeature[]=[
    {x:3,y:12,w:8,h:5,kind:'rocks',name:'리버스마운틴 도착 절벽',description:'동굴을 나온 사람과 포켓몬이 바닷바람을 처음 맞는 붉은 절벽이다.\n센터와 동굴 귀환 표지가 함께 보인다.'},
    {x:14,y:8,w:6,h:5,kind:'water',name:'절벽 온천수 관찰지',description:'산에서 데워진 물이 식으며 흐르는 작은 관찰지다.\n포켓몬을 임의로 넣거나 회복 효과가 있다고 안내하지 않는다.'},
    {x:25,y:14,w:9,h:5,kind:'garden',name:'해풍 휴게정원',description:'소금기 있는 바람을 견디는 낮은 풀이 자란다.\n동굴 여행을 마친 동료가 그늘과 물을 이용한다.'},
    {x:3,y:30,w:42,h:7,kind:'water',name:'물결 해변',description:'얕은 물결과 모래가 길게 이어지는 마을 남쪽 해변이다.\n수상이동이나 야생 조우 구역으로 구현한 장소는 아니다.'},
    {x:39,y:11,w:6,h:8,kind:'statue',name:'13번도로 방향 표지',description:'동쪽은 하나 13번도로와 보배마을 방향이다.\n해안 절벽과 고지 초원을 지나 같은 길로 왕복할 수 있다.'},
  ];
  return {...UNDELLA_TOWN_SIZE,style:'waterfront',buildings,features,
    paths:[[12,3,5,34],[2,10,44,3],[2,26,44,3],[9,9,8,3],[16,13,15,3],[8,23,9,3],[20,26,14,3],[30,11,5,12],[34,19,12,3],[44,12,2,17]],
    boardwalks:[[2,28,44,2],[11,31,3,6],[24,31,3,6],[37,31,3,6]],
  };
}
