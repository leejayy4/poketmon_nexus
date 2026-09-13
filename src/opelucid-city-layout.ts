import type { ExpandedTown } from './explore-expansion';
import type { TourBuilding,TourFeature } from './explore-world';

export const OPELUCID_CITY_SIZE={width:64,height:64};

export function opelucidPlan():ExpandedTown{
  const buildings:TourBuilding[]=[
    {kind:'center',x:6,y:7,w:7,h:3,door:{x:9,y:9},room:'tour_opelucid_center'},
    {kind:'landmark',x:38,y:6,w:13,h:5,door:{x:44,y:10},room:'tour_opelucid_hall'},
    {kind:'house',x:8,y:27,w:5,h:3,door:{x:10,y:29}},
    {kind:'house',x:42,y:29,w:5,h:3,door:{x:44,y:31}},
  ];
  const features:TourFeature[]=[
    {x:20,y:7,w:10,h:8,kind:'statue',name:'용 문양 중앙 광장',description:'서로 다른 시대의 용 문양을 한 광장에서 비교한다.\n전설 포켓몬 조우나 사건을 시작하는 장소는 아니다.'},
    {x:5,y:17,w:14,h:7,kind:'rocks',name:'오래된 석조 거리',description:'낮은 돌담과 거친 포장석이 이어지는 오래된 생활 거리다.\n주민과 포켓몬이 쉬는 벽면 여백을 남겼다.'},
    {x:35,y:18,w:18,h:7,kind:'garden',name:'새 거리 생활 정원',description:'밝은 포장과 낮은 화단을 사용한 새 생활 구역이다.\n옛 거리와 어느 쪽이 우월하다는 결론 대신 쓰임을 비교한다.'},
    {x:21,y:35,w:14,h:8,kind:'rocks',name:'도시 높낮이 관찰뜰',description:'석조 계단과 완만한 경사로가 같은 높이로 다시 만난다.\n필수 기술 없이 사람과 포켓몬이 함께 오를 수 있다.'},
    {x:45,y:46,w:14,h:8,kind:'statue',name:'11번도로 도착문',description:'동쪽은 하나 11번도로와 빌리지브리지 방향이다.\n물길과 바위 단차를 지나온 동료가 귀환 방향을 확인한다.'},
    {x:5,y:46,w:14,h:8,kind:'statue',name:'레거시 산길 안내석',description:'기존 궐수·기하 방향 축약 통로를 과거 저장의 귀환길로 보존한다.\n공식 도로·동굴 지명으로 오해하지 않도록 별도 표시한다.'},
  ];
  return {...OPELUCID_CITY_SIZE,style:'heritage',buildings,features,
    paths:[[2,11,60,4],[28,3,6,58],[2,25,60,5],[2,43,60,5],[8,9,24,4],[31,9,15,4],[9,28,23,4],[31,30,15,4],[2,11,5,39],[57,11,5,39],[10,43,22,5],[31,43,22,5]],
    boardwalks:[],
  };
}
