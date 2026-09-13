import type { ExpandedTown } from './explore-expansion';
import type { TourBuilding,TourFeature } from './explore-world';
export const VILLAGE_BRIDGE_SIZE={width:72,height:48};
export function villageBridgePlan():ExpandedTown{
  const buildings:TourBuilding[]=[
    {kind:'center',x:51,y:5,w:7,h:3,door:{x:54,y:7},room:'tour_village_bridge_center'},
    {kind:'landmark',x:11,y:5,w:11,h:4,door:{x:16,y:8},room:'tour_village_bridge_hall'},
    {kind:'house',x:27,y:6,w:5,h:3,door:{x:29,y:8}},{kind:'house',x:39,y:7,w:5,h:3,door:{x:41,y:9}},
    {kind:'house',x:17,y:36,w:5,h:3,door:{x:19,y:38}},{kind:'house',x:49,y:35,w:5,h:3,door:{x:51,y:37}},
  ];
  const features:TourFeature[]=[
    {x:2,y:16,w:68,h:15,kind:'water',name:'빌리지브리지 수로',description:'다리 아래로 넓은 물길이 흐르고 양쪽 둔치의 생활을 잇는다.\n현재 수상이동이나 야생 조우 구역은 아니다.'},
    {x:4,y:20,w:64,h:7,kind:'statue',name:'마을을 가로지르는 긴 다리',description:'12번도로와 11번도로 사이를 잇는 넓은 보행 다리다.\n사람과 포켓몬이 멈춰도 통행로가 막히지 않게 쉼 자리를 나눴다.'},
    {x:25,y:11,w:18,h:4,kind:'garden',name:'주민 공연 뜰',description:'주민이 목소리와 손장단을 맞추는 작은 연습 공간이다.\n실제 음악 재생이나 보상을 제공하는 공연은 아직 아니다.'},
    {x:29,y:32,w:13,h:6,kind:'garden',name:'다리 동료 휴게뜰',description:'다리를 건넌 포켓몬이 물을 마시고 발을 쉬는 그늘이다.\n실제 회복은 포켓몬센터에서 받는다.'},
    {x:2,y:34,w:8,h:7,kind:'statue',name:'11번도로 방향 표지',description:'서쪽은 하나 11번도로와 쌍용시티 방향이다.\n물길 전망과 바위 단차를 지나 석조 도시까지 왕복한다.'},
  ];
  return {...VILLAGE_BRIDGE_SIZE,style:'waterfront',buildings,features,
    paths:[[2,11,68,4],[2,22,68,5],[2,40,68,4],[14,8,5,15],[27,9,5,13],[39,10,5,12],[52,8,5,14],[17,27,5,12],[49,27,5,11],[2,22,6,22]],
    boardwalks:[[2,21,68,7],[6,17,4,14],[62,17,4,14]],
  };
}
