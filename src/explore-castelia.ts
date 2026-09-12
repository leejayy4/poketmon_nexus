import type { ExpandedTown } from './explore-expansion';
import type { TourBuilding,TourFeature } from './explore-world';
import { cityRoadTiles,paintCityStreets } from './city-street-art';

export const CASTELIA_SIZE={width:72,height:64};
export const CASTELIA_HABITAT='구름시티 북쪽 정원';
export const CASTELIA_GRASS=[{kind:'tallGrass' as const,x:26,y:4,w:5,h:3},{kind:'tallGrass' as const,x:45,y:5,w:5,h:3}];
const CASTELIA_STREETS:[number,number,number,number][]=[
  [12,3,4,45],[2,11,68,3],[2,24,52,3],[35,12,4,36],
  [52,12,4,37],[14,46,44,4],[14,58,44,4],
];

export function paintCasteliaStreets(c:CanvasRenderingContext2D,reference:HTMLImageElement|HTMLCanvasElement,walkable:string[],paths:Set<string>){
  paintCityStreets(c,reference,cityRoadTiles(walkable,CASTELIA_STREETS),paths,[9,23,31]);
}

/** Existing doors and scenery footprints stay intact; new districts grow east/south. */
export function casteliaPlan():ExpandedTown {
  const buildings:TourBuilding[]=[
    {kind:'center',x:6,y:7,w:5,h:2,door:{x:8,y:8},room:'tour_castelia_center'},
    {kind:'landmark',x:26,y:17,w:10,h:4,door:{x:31,y:20},room:'tour_castelia_hall'},
    {kind:'house',x:5,y:25,w:5,h:2,door:{x:7,y:26}},
    {kind:'house',x:22,y:27,w:5,h:2,door:{x:24,y:28}},
    {kind:'house',x:5,y:16,w:5,h:2,door:{x:7,y:17}},
    {kind:'house',x:18,y:7,w:5,h:2,door:{x:20,y:8}},
    {kind:'house',x:43,y:19,w:5,h:2,door:{x:45,y:20}},
    {kind:'house',x:43,y:28,w:5,h:2,door:{x:45,y:29}},
  ];
  const features:TourFeature[]=[
    {x:5,y:28,w:4,h:5,kind:'garden',name:'항구의 작은 정원',description:'바닷바람을 피할 수 있는 낮은 정원이다.\n남쪽 길은 부두 산책로로 이어진다.'},
    {x:16,y:19,w:3,h:2,kind:'fountain'},
    {x:3,y:37,w:8,h:6,kind:'water',name:'서쪽 항만 수면',description:'부두의 그늘과 밝은 바닷빛이\n물결을 따라 번갈아 흔들린다.'},
    {x:20,y:35,w:11,h:7,kind:'water',name:'중앙 부두의 물결',description:'바닷물이 두 산책로 사이로 들어온다.\n동쪽 데크를 돌아가면 갤러리 쪽이다.'},
    {x:37,y:35,w:14,h:7,kind:'water',name:'동쪽 항만 전경',description:'물 위에 긴 빌딩 그림자가 드리웠다.\n갤러리의 항구 그림과 비교해 보자.'},
    {x:50,y:19,w:2,h:10,kind:'garden',name:'골목의 화분 정원',description:'집 사이 좁은 길에 화분을 모아 두었다.\n작은 포켓몬이 쉴 자리도 남아 있다.'},
    {x:58,y:18,w:9,h:8,kind:'garden',name:'스카이애로 산책 광장',description:'높은 빌딩 사이 바람길에\n동료와 쉴 긴 의자가 놓여 있다.'},
    {x:3,y:49,w:9,h:11,kind:'water',name:'서쪽 여객선 물길',description:'담청 정기선이 드나드는 수로다.\n남쪽 승선로에서 출발 안내를 본다.'},
    {x:22,y:51,w:13,h:9,kind:'water',name:'중앙 항구 선착장',description:'낮은 말뚝과 계류 밧줄 너머로\n도시의 긴 부두가 이어진다.'},
    {x:44,y:50,w:13,h:10,kind:'water',name:'동쪽 화물 부두',description:'수레 자국과 창고 표지가 남아 있다.\n북쪽 큰길은 4번도로로 이어진다.'},
  ];
  return {
    ...CASTELIA_SIZE,style:'urban',buildings,features,
    paths:[
      [12,3,5,59],[2,11,68,3],[2,24,54,3],
      [7,9,9,2],[7,18,9,2],[7,27,9,1],[20,9,3,3],
      [15,21,23,3],[24,29,13,3],
      [35,12,4,23],[38,16,11,2],[40,16,2,18],[45,21,4,7],
      [43,30,13,3],[12,33,46,2],[12,42,46,2],
      [31,34,6,13],[51,33,5,16],[52,12,4,37],[55,11,15,3],
      [14,46,44,4],[14,58,44,4],[12,47,4,15],
      [58,17,11,1],[58,26,11,1],[57,18,1,9],[68,18,1,9],
      [2,47,12,2],[2,60,14,2],[12,48,2,13],
      [20,49,17,2],[20,60,17,2],[20,51,2,9],[35,51,2,9],
      [42,48,17,2],[42,60,17,2],[42,50,2,10],[57,50,2,10],
      [4,27,6,1],[4,33,6,1],[4,28,1,5],[9,28,1,5],
      [15,18,5,1],[15,21,5,1],[15,19,1,2],[19,19,1,2],
    ],
    boardwalks:[[12,34,6,14],[18,33,40,2],[31,34,6,13],[51,34,5,15],[18,42,40,2],
      [14,46,44,4],[14,58,44,4],[12,47,4,15],[20,49,17,2],[42,48,17,2]],
  };
}
