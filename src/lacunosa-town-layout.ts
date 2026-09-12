import type { ExpandedTown } from './explore-expansion';
import type { TourBuilding,TourFeature } from './explore-world';

export const LACUNOSA_TOWN_SIZE={width:40,height:40};

/** B2W2 동부 여행의 조용한 중간 거점인 보배마을 외부. */
export function lacunosaPlan():ExpandedTown{
  const buildings:TourBuilding[]=[
    {kind:'center',x:5,y:5,w:6,h:3,door:{x:8,y:7},room:'tour_lacunosa_center'},
    {kind:'landmark',x:23,y:5,w:10,h:4,door:{x:28,y:8},room:'tour_lacunosa_hall'},
    {kind:'house',x:5,y:20,w:5,h:3,door:{x:7,y:22}},
    {kind:'house',x:17,y:23,w:5,h:3,door:{x:19,y:25}},
    {kind:'house',x:29,y:20,w:5,h:3,door:{x:31,y:22}},
  ];
  const features:TourFeature[]=[
    {x:3,y:10,w:5,h:8,kind:'rocks',name:'보배마을 오래된 성벽',description:'마을 둘레의 바람을 줄이는 밝은 돌담이다.\n주민과 포켓몬이 다니는 문과 보행로는 넓게 비워 두었다.'},
    {x:13,y:10,w:10,h:7,kind:'garden',name:'공동 생활 안뜰',description:'주민이 함께 화분과 낮은 풀을 돌보는 마을 중심의 안뜰이다.\n동료 포켓몬이 쉬는 그늘과 물그릇도 마련돼 있다.'},
    {x:27,y:11,w:8,h:5,kind:'garden',name:'식재료 바람 건조대',description:'들판에서 가져온 허브와 열매를 바람에 천천히 말린다.\n포켓몬 먹이와 사람 식재료를 칸으로 나누어 보관한다.'},
    {x:4,y:29,w:10,h:5,kind:'statue',name:'13번도로 도착 표석',description:'남쪽은 하나 13번도로와 물결마을 방향이다.\n긴 해안길을 마친 사람과 포켓몬이 귀환 방향을 확인한다.'},
    {x:27,y:29,w:10,h:5,kind:'statue',name:'12번도로 방향 표지',description:'서쪽은 하나 12번도로와 빌리지브리지 방향이다.\n전원 초원과 동료 쉼터를 지나 같은 길로 왕복할 수 있다.'},
  ];
  return {...LACUNOSA_TOWN_SIZE,style:'heritage',buildings,features,
    paths:[[12,3,5,35],[2,8,36,3],[2,26,36,3],[7,8,9,3],[16,8,13,3],[7,22,10,3],[19,25,13,3],[28,9,4,14],[2,28,14,3],[24,28,14,3]],
    boardwalks:[],
  };
}
