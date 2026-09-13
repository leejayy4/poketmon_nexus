import type { ExpandedTown } from './explore-expansion';
import type { TourOutdoors } from './explore-outdoors';
import type { GameMap } from './types';

export const CIANWOOD_CITY_SIZE={width:48,height:44};

/** Separate the Route 41 landing, beach life, homes and sea-dojo practice yard. */
export function extendCianwoodCity(plan:ExpandedTown):ExpandedTown{
  return {...plan,...CIANWOOD_CITY_SIZE,
    buildings:[
      {kind:'center',x:6,y:7,w:5,h:2,door:{x:8,y:8},room:'tour_cianwood_center'},
      {kind:'landmark',x:33,y:8,w:10,h:4,door:{x:38,y:11},room:'tour_cianwood_hall'},
      {kind:'house',x:6,y:19,w:5,h:2,door:{x:8,y:20}},
      {kind:'house',x:21,y:18,w:5,h:2,door:{x:23,y:19}},
      {kind:'house',x:31,y:24,w:5,h:2,door:{x:33,y:25}},
    ],
    features:[
      {kind:'water',x:3,y:29,w:16,h:11,name:'41번수로 상륙 만',description:'정기 연락선이 낮은 상륙 데크에 닿는 잔잔한 만이다.\n북쪽 큰길에서 센터와 생활권으로 이어진다.'},
      {kind:'rocks',x:20,y:30,w:10,h:9,name:'해변 둥근바위 지대',description:'파도에 닳은 바위 사이로 작은 포켓몬 흔적이 남는다.\n현재는 육지 관찰 구역이며 수상 조우는 없다.'},
      {kind:'garden',x:34,y:14,w:10,h:8,name:'바다 도장 앞 호흡마당',description:'파도 소리에 맞춰 발과 호흡을 고르는 야외 수련 마당이다.\n체육관전이나 배지 조건과 별개다.'},
      {kind:'garden',x:5,y:24,w:12,h:5,name:'해풍 생활 화단',description:'소금기 있는 바람에도 자라는 낮은 풀을 주민과 포켓몬이 함께 돌본다.'},
      {kind:'rocks',x:36,y:31,w:8,h:8,name:'서쪽 바다 전망 암반',description:'섬 바깥 바다와 연락선의 귀환 방향을 확인하는 높은 암반이다.\n새 탐험 출구는 열지 않았다.'},
    ],
    paths:[...plan.paths,[12,2,5,40],[2,11,44,4],[2,22,44,4],[2,40,44,3],[8,8,9,7],[8,19,9,5],[16,17,12,4],[27,10,7,16],[32,12,5,13],[36,20,5,22],[17,27,20,4],[18,35,20,4]],
    boardwalks:[[2,27,18,3],[16,28,5,13],[17,38,22,3]],
  };
}

export function installCianwoodDetails(map:GameMap,outdoors:TourOutdoors){
  const rows=map.walkable.map(row=>row.split(''));
  const objects=[
    {name:'41번수로 상륙 표지',event:'tourCianwoodRoute41Board',cells:[{x:18,y:37}],pages:['상륙 데크 → 41번수로 정기 연락선 → 40번수로 → 담청시티\n소용돌이섬 외부는 41번수로의 선택 분기다.']},
    {name:'해변 생태 발자국판',event:'tourCianwoodBeachTracks',cells:[{x:24,y:33}],pages:['젖은 모래와 둥근바위 사이의 작은 발자국을 비교한다.\n조사만으로 야생 조우·포획·도감 등록은 일어나지 않는다.']},
    {name:'바다 도장 호흡 표식',event:'tourCianwoodDojoMark',cells:[{x:38,y:18}],pages:['파도 세 번에 맞춰 발을 옮기고 숨을 고르는 생활 수련 표식이다.\n관장전·배지·통행 조건은 아직 연결하지 않았다.']},
    {name:'연락선 귀환 전망석',event:'tourCianwoodReturnLookout',cells:[{x:39,y:34}],pages:['동쪽 바다에서 연락선이 41번수로와 담청 방향으로 돌아가는 것을 볼 수 있다.\n소용돌이섬 내부나 서쪽 새 출구는 열지 않았다.']},
    {name:'해풍 화단 돌봄대',event:'tourCianwoodGardenCare',cells:[{x:11,y:26}],pages:['낮은 풀의 마른 잎과 소금기 낀 물그릇을 주민이 함께 정리한다.\n아이템·회복·보상은 지급하지 않는다.']},
  ];for(const object of objects)for(const cell of object.cells){rows[cell.y][cell.x]='#';map.props.push({...cell,dialogue:object.event});}
  map.walkable=rows.map(row=>row.join(''));outdoors.objects.push(...objects);
}
