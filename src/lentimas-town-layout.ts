import type { ExpandedTown } from './explore-expansion';
import type { TourBuilding,TourFeature } from './explore-world';

export const LENTIMAS_TOWN_SIZE={width:40,height:36};

/** B2W2 산로마을의 비행 도착, 화산재 생활, 리버스마운틴 준비를 한눈에 읽는 외부. */
export function lentimasPlan():ExpandedTown{
  const buildings:TourBuilding[]=[
    {kind:'center',x:5,y:5,w:6,h:3,door:{x:8,y:7},room:'tour_lentimas_center'},
    {kind:'landmark',x:24,y:8,w:9,h:4,door:{x:28,y:11},room:'tour_lentimas_hall'},
    {kind:'house',x:5,y:18,w:5,h:3,door:{x:7,y:20}},
    {kind:'house',x:16,y:21,w:5,h:3,door:{x:18,y:23}},
    {kind:'house',x:27,y:18,w:5,h:3,door:{x:29,y:20}},
  ];
  const features:TourFeature[]=[
    {x:3,y:27,w:12,h:5,kind:'runway',name:'산로 착륙장',description:'궐수에서 온 작은 비행기가 화산재 바람을 피해 내리는 흙 활주로다.\n조종사와 포켓몬이 함께 기체와 날개 상태를 살핀다.'},
    {x:3,y:11,w:8,h:5,kind:'rocks',name:'붉은 화산재 언덕',description:'바람에 쌓인 붉은 재와 가벼운 돌이 층을 이룬다.\n주민들은 포켓몬의 눈과 발에 재가 끼지 않게 닦아 준다.'},
    {x:14,y:7,w:5,h:4,kind:'garden',name:'재바람 휴게뜰',description:'낮은 돌담과 질긴 풀이 바람을 줄여 주는 쉼터다.\n비행을 마친 동료가 물을 마시고 숨을 고른다.'},
    {x:24,y:14,w:8,h:3,kind:'rocks',name:'도자기 건조장',description:'화산 흙으로 빚은 그릇을 그늘에서 천천히 말린다.\n불꽃 포켓몬에게 굽기를 맡긴다는 뜻은 아니다.'},
    {x:33,y:24,w:5,h:7,kind:'statue',name:'리버스마운틴 진입 표지',description:'동쪽은 리버스마운틴, 그 너머는 물결마을 방향이다.\n현재는 동굴 입구 경계를 준비한 표지이며 통행 연결은 다음 단계다.'},
  ];
  return {...LENTIMAS_TOWN_SIZE,style:'mining',buildings,features,
    paths:[[12,3,5,31],[2,9,36,3],[2,24,36,3],[7,8,10,3],[16,11,13,3],[7,21,10,3],[18,24,20,3],[28,12,5,9],[14,27,4,5]],
    boardwalks:[],
  };
}
