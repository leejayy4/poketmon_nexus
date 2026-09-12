import type { ExpandedTown } from './explore-expansion';
import type { TourBuilding,TourFeature } from './explore-world';

export const MISTRALTON_CITY_SIZE={width:72,height:56};

/** Preserve the original town core while opening the eastern airfield and southern cave arrival. */
export function mistraltonPlan():ExpandedTown{
  const buildings:TourBuilding[]=[
    {kind:'center',x:6,y:7,w:5,h:2,door:{x:8,y:8},room:'tour_mistralton_center'},
    {kind:'landmark',x:26,y:17,w:10,h:4,door:{x:31,y:20},room:'tour_mistralton_hall'},
    {kind:'house',x:5,y:25,w:5,h:2,door:{x:7,y:26}},
    {kind:'house',x:22,y:27,w:5,h:2,door:{x:24,y:28}},
    {kind:'house',x:5,y:16,w:5,h:2,door:{x:7,y:17}},
    {kind:'house',x:18,y:7,w:5,h:2,door:{x:20,y:8}},
  ];
  const features:TourFeature[]=[
    {x:5,y:29,w:7,h:6,kind:'garden',name:'동굴 도착 바람뜰',description:'전기돌동굴을 나온 여행자와 포켓몬이 바람을 쐬는 풀밭이다.\n센터와 공항 터미널 방향 표지가 함께 보인다.'},
    {x:16,y:19,w:3,h:2,kind:'fountain',name:'비행운 약속 분수',description:'얇은 물줄기가 하늘로 뻗은 비행운 모양을 만든다.\n주거 골목과 터미널 사이의 약속 장소다.'},
    {x:40,y:5,w:26,h:7,kind:'runway',name:'북쪽 활주로',description:'흰 유도선과 바람 방향 표지가 동서로 길게 이어진다.\n울타리 밖 보행로에서 이착륙 준비를 볼 수 있다.'},
    {x:44,y:17,w:9,h:7,kind:'rocks',name:'화물 적재장',description:'항공 화물을 무게와 목적지에 따라 나눈 작업장이다.\n파트너가 쉬는 낮은 그늘막은 보행로 쪽에 있다.'},
    {x:58,y:18,w:8,h:7,kind:'garden',name:'비행 포켓몬 바람쉼터',description:'비행을 마친 포켓몬이 날개를 고르고 물을 마시는 쉼터다.\n활주로 울타리와 충분히 떨어져 있다.'},
    {x:41,y:31,w:25,h:6,kind:'runway',name:'남쪽 유도로',description:'격납고와 활주로를 잇는 넓은 유도로다.\n보행자는 표시된 횡단 데크만 이용한다.'},
    {x:43,y:42,w:10,h:6,kind:'garden',name:'농로 바람밭',description:'공항 가장자리의 바람을 견디는 작물을 기른다.\n도시 생활과 주변 농로가 맞닿는 자리다.'},
    {x:58,y:41,w:8,h:7,kind:'statue',name:'날개 방향 표지탑',description:'바람이 부는 방향에 따라 작은 날개판이 돌아간다.\n동쪽과 북쪽의 다음 길을 구분해 보여 준다.'},
  ];
  return {...MISTRALTON_CITY_SIZE,style:'urban',buildings,features,
    paths:[[12,3,5,51],[2,11,68,3],[2,24,68,3],[2,49,68,3],[7,9,10,2],[7,18,10,2],[7,27,10,2],[20,9,3,3],[15,21,18,3],[24,29,14,3],[31,12,5,9],[35,11,5,39],[38,14,31,3],[38,27,31,3],[38,38,31,3],[53,12,4,16],[67,11,3,39],[14,47,25,3],[14,51,5,4],[40,47,14,3],[39,22,6,3],[51,22,7,3],[54,35,3,15],[63,35,4,3]],
    boardwalks:[[39,27,29,2],[53,25,4,5]],
  };
}
