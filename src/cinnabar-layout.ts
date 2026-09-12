import type { ExpandedTown } from './explore-expansion';

export const CINNABAR_SIZE={width:50,height:44};
export const CINNABAR_ROUTE='tour_pass_pallet_cinnabar';
export const CINNABAR_ROUTE_NAME='태초–홍련 해안길';
export const CINNABAR_DEPARTURE_ROUTE='tour_pass_vermilion_cinnabar';
export const CINNABAR_DEPARTURE_NAME='홍련–갈색 해안길';
export const CINNABAR_HABITAT_NAME='홍련섬 외곽 풀밭';
export const CINNABAR_GRASS=[{kind:'tallGrass' as const,x:36,y:28,w:6,h:2},{kind:'tallGrass' as const,x:5,y:30,w:5,h:3}];

/** Extend beyond the old town footprint; keep homes, services and old saves in place. */
export function extendCinnabarTown(plan:ExpandedTown):ExpandedTown{
  return {...plan,...CINNABAR_SIZE,
    features:[...plan.features,
      {kind:'rocks',x:35,y:5,w:6,h:4,name:'붉은 화산암 절벽',description:'식은 용암이 여러 겹으로 굳어 있다.\n연구소 앞 돌과 같은 붉은 결이다.'},
      {kind:'water',x:35,y:17,w:10,h:8,name:'홍련 물가 관찰 데크',description:'바위 사이로 바닷물이 드나든다.\n데크를 돌아 남쪽 해안으로 내려갈 수 있다.'},
      {kind:'water',x:22,y:34,w:20,h:6,name:'남쪽 작은 만',description:'둥근 만 안쪽은 물결이 잔잔하다.\n알통몬과 주민들이 쉬어 가는 물가다.'},
      {kind:'rocks',x:5,y:34,w:5,h:5,name:'물에 닳은 화산암',description:'위쪽은 거칠고 물가 쪽은 매끈하다.\n연구소 표본과 표면을 비교해 보자.'},
    ],
    paths:[...plan.paths,[30,11,19,3],[31,12,3,20],[12,28,3,13],[12,30,34,3],[43,14,3,19],[11,39,34,2],[34,15,12,2],[33,16,2,11],[34,25,12,2]],
    boardwalks:[...plan.boardwalks,[33,16,2,11],[34,25,12,2],[45,16,2,11],[21,32,24,2],[20,34,2,7],[22,40,23,2]],
  };
}
