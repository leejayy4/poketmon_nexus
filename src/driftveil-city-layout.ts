import type { ExpandedTown } from './explore-expansion';
import type { TourBuilding,TourFeature } from './explore-world';

export const DRIFTVEIL_CITY_SIZE={width:64,height:56};
export function driftveilPlan():ExpandedTown{
  const buildings:TourBuilding[]=[
    {kind:'center',x:6,y:7,w:5,h:2,door:{x:8,y:8},room:'tour_driftveil_center'},
    {kind:'landmark',x:26,y:11,w:10,h:4,door:{x:31,y:14},room:'tour_driftveil_hall'},
    {kind:'house',x:5,y:25,w:5,h:2,door:{x:7,y:26}},
    {kind:'house',x:26,y:26,w:5,h:2,door:{x:28,y:27}},
    {kind:'house',x:18,y:7,w:5,h:2,door:{x:20,y:8}},
  ];
  const features:TourFeature[]=[
    {x:5,y:13,w:4,h:5,kind:'water',name:'시장 옆 운하',description:'시장으로 들어온 작은 운하에 짐배가 잠시 머문다.\n물가 난간 너머로 상자 표식이 보인다.'},
    {x:20,y:18,w:3,h:2,kind:'fountain',name:'시장 약속 분수',description:'시장 손님과 배달원이 만나는 작은 분수다.\n센터와 시장 건물 사이 길을 알려 준다.'},
    {x:40,y:5,w:9,h:8,kind:'rocks',name:'광물 분류 야적장',description:'색과 무게가 다른 광석 상자를 선적 순서대로 모아 두었다.\n작업 포켓몬이 쉴 통로는 비워 두었다.'},
    {x:52,y:6,w:8,h:9,kind:'water',name:'북동 선적 수면',description:'광물 창고 앞 깊은 수면에 화물선이 닿는다.\n난간을 따라 남쪽 작업 부두로 이어진다.'},
    {x:41,y:20,w:11,h:8,kind:'water',name:'중앙 작업 부두',description:'시장 물품과 광물 화물이 서로 다른 표식 아래 오간다.\n젖은 데크에서는 천천히 걸어야 한다.'},
    {x:54,y:23,w:7,h:7,kind:'rocks',name:'선적 대기 상자',description:'목적지와 무게를 적은 상자가 높이별로 나뉘어 있다.\n작은 포켓몬이 지나는 낮은 길은 막지 않았다.'},
    {x:5,y:37,w:10,h:7,kind:'garden',name:'도개교 도착 쉼터',description:'긴 다리를 건넌 여행자와 포켓몬이 바람을 피하는 정원이다.\n남쪽 길 끝에 물풍경도개교 표지가 보인다.'},
    {x:22,y:39,w:9,h:7,kind:'garden',name:'시장 배달 텃밭',description:'가판대에서 쓰는 채소와 나무열매를 소량 기른다.\n수확 바구니 옆에 포켓몬용 물그릇이 있다.'},
    {x:40,y:38,w:12,h:8,kind:'water',name:'남동 화물 수로',description:'도개교 아래 강물과 항구 수로가 만나는 곳이다.\n부두 순환 데크에서 물결을 살펴볼 수 있다.'},
    {x:55,y:39,w:6,h:7,kind:'garden',name:'교대 작업자 휴게원',description:'하역 교대를 마친 사람과 포켓몬이 함께 쉬는 작은 녹지다.\n북쪽 창고와 남쪽 도착장 사이에 있다.'},
  ];
  return {...DRIFTVEIL_CITY_SIZE,style:'waterfront',buildings,features,
    paths:[[12,3,5,51],[2,11,60,3],[2,29,60,3],[2,49,60,3],[7,9,10,2],[7,19,10,2],[7,27,10,2],[20,9,3,3],[15,15,18,3],[28,16,5,12],[28,28,10,3],[35,11,4,39],[38,16,24,3],[38,31,24,3],[50,3,4,47],[60,11,2,39],[15,35,23,3],[14,47,25,3],[14,51,5,4],[32,22,8,3],[15,41,7,3],[31,40,8,3],[52,34,4,16]],
    boardwalks:[[4,12,6,1],[4,18,6,2],[9,13,2,6],[39,19,14,2],[39,20,2,10],[41,28,14,2],[52,20,2,9],[51,5,10,2],[51,6,2,10],[52,15,10,2],[60,6,2,10],[39,37,14,2],[39,38,2,10],[41,46,13,2],[52,38,2,10]],
  };
}
