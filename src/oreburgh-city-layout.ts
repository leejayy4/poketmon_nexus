import type { ExpandedTown } from './explore-expansion';

export const OREBURGH_CITY_SIZE={width:48,height:44} as const;

/** Pt geography rebuilt for the shared BW/BW2-style town renderer. */
export function oreburghPlan():ExpandedTown{
  return {
    ...OREBURGH_CITY_SIZE,
    style:'mining',
    buildings:[
      {kind:'center',x:7,y:8,w:7,h:4,door:{x:10,y:11},room:'tour_oreburgh_center'},
      {kind:'landmark',x:31,y:7,w:11,h:5,door:{x:36,y:11},room:'tour_oreburgh_hall'},
      // The first house slot is consumed by the existing Oreburgh Gym contract.
      {kind:'house',x:38,y:19,w:7,h:5,door:{x:41,y:23}},
      {kind:'house',x:8,y:25,w:6,h:4,door:{x:11,y:28}},
      {kind:'house',x:25,y:25,w:6,h:4,door:{x:28,y:28}},
    ],
    features:[
      {kind:'rocks',x:4,y:33,w:11,h:6,name:'남서 광재 언덕',description:'탄갱에서 옮긴 광재를 식히고 크기별로 나누는 작업 구역이다.'},
      {kind:'rail',x:18,y:34,w:17,h:4,name:'탄갱 운반 레일',description:'남쪽 무쇠탄갱에서 도시 선별장으로 이어지는 운반선이다.'},
      {kind:'rocks',x:37,y:31,w:7,h:7,name:'환기구 암반대',description:'지하 작업장에 신선한 공기를 보내는 환기구가 암반 사이로 솟아 있다.'},
    ],
    paths:[
      [2,11,44,4],       // west Oreburgh Gate to the eastern Gym street
      [14,3,5,39],       // Route 207 to Oreburgh Mine
      [8,15,5,14],       // Center and Mart lane
      [28,11,4,18],      // Museum and housing lane
      [31,19,14,5],      // Gym forecourt
      [22,14,5,5],       // central mine directory forecourt
      [4,30,40,3],       // mining district overlook
      [10,28,21,3],      // homes to the southern work road
      [18,38,17,4],      // rail-side approach to the mine entrance
    ],
    boardwalks:[],
  };
}
