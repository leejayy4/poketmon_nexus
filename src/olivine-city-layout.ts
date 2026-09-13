import type { ExpandedTown } from './explore-expansion';
import type { TourOutdoors } from './explore-outdoors';
import type { GameMap } from './types';

export const OLIVINE_CITY_SIZE={width:64,height:56};

/** Separate Olivine's overland arrival, lived-in streets, lighthouse and working harbour. */
export function extendOlivineCity(plan:ExpandedTown):ExpandedTown{
  return {...plan,...OLIVINE_CITY_SIZE,
    buildings:[
      {kind:'center',x:7,y:8,w:5,h:2,door:{x:9,y:9},room:'tour_olivine_center'},
      {kind:'landmark',x:48,y:31,w:10,h:4,door:{x:53,y:34},room:'tour_olivine_hall'},
      {kind:'house',x:7,y:21,w:5,h:2,door:{x:9,y:22}},
      {kind:'house',x:24,y:18,w:5,h:2,door:{x:26,y:19}},
      {kind:'house',x:34,y:25,w:5,h:2,door:{x:36,y:26}},
    ],
    features:[
      {kind:'garden',x:18,y:5,w:15,h:8,name:'39번도로 해풍맞이뜰',description:'목초지에서 내려온 여행자와 포켓몬이 바닷바람에 적응하는 뜰이다.\n센터와 항구로 가는 길이 여기서 나뉜다.'},
      {kind:'water',x:3,y:35,w:18,h:16,name:'서쪽 작업항 수로',description:'작업선이 낮은 방파제 안에서 짐을 싣고 내리는 물길이다.\n보행자는 표시된 부두 가장자리만 지난다.'},
      {kind:'rocks',x:23,y:36,w:11,h:10,name:'항구 창고 적재장',description:'밧줄과 빈 상자를 종류별로 정리한 작업 구역이다.\n통행로와 적재선을 바닥 색으로 구분했다.'},
      {kind:'water',x:40,y:38,w:20,h:14,name:'등대 아래 외항',description:'등대 불빛을 보고 들어온 배가 항만 안쪽으로 방향을 잡는 바다다.\n40번수로와 국제 여객 항로는 안내판에서 구분한다.'},
      {kind:'garden',x:41,y:17,w:15,h:8,name:'등대지기 바람정원',description:'렌즈를 닦는 천과 작은 화분을 말리는 바람받이 뜰이다.\n동행 포켓몬이 등대 오르기 전에 쉬어 간다.'},
    ],
    paths:[...plan.paths,
      [12,2,5,52],[2,12,60,4],[2,29,60,4],[2,52,60,3],
      [8,9,9,7],[9,20,8,12],[16,18,20,4],[29,14,5,19],
      [33,24,15,4],[45,20,5,15],[50,27,7,8],
      [18,31,5,22],[31,31,5,22],[35,46,14,4],[47,33,5,17],
    ],
    boardwalks:[[2,33,21,3],[18,34,5,19],[35,35,25,3],[35,49,25,3],[47,36,5,14]],
  };
}

export function installOlivineDetails(map:GameMap,outdoors:TourOutdoors){
  const rows=map.walkable.map(row=>row.split(''));
  const objects=[
    {name:'39번도로 도착 표석',event:'tourOlivineRoute39Stone',cells:[{x:17,y:8}],pages:['북쪽은 39번도로이며 38번도로와 인주시티로 이어진다.\n튼튼목장은 39번도로 동쪽의 선택 분기다.']},
    {name:'담청항 노선 안내판',event:'tourOlivineHarborBoard',cells:[{x:27,y:34}],pages:['남서쪽은 작업항, 남동쪽은 등대와 외항이다.\n성도 40번수로와 프로젝트 고유 담청항↔구름항 국제 항로를 같은 노선으로 부르지 않는다.']},
    {name:'작업항 안전선',event:'tourOlivineWorkDock',cells:[{x:20,y:43}],pages:['상자 적재선과 여행자 보행선을 나누었다.\n작업 중인 포켓몬에게 가까이 다가가지 말고 표시된 길을 걷자.']},
    {name:'등대 오름길 표지',event:'tourOlivineLighthouseBoard',cells:[{x:46,y:28}],pages:['동쪽 길은 담청등대 입구로 이어진다.\n현재 등대 생활 공간과 전시는 전설 조우나 체육관 조건이 아니다.']},
    {name:'40번수로 출발 전망대',event:'tourOlivineRoute40Lookout',cells:[{x:39,y:47}],pages:['남쪽 승선 데크는 40번수로 정기 연락선에서 41번수로·소용돌이섬 외부 분기·진청시티로 이어진다.\n수상 기술이 아니라 안전 연락선을 이용한다.']},
  ];
  for(const object of objects)for(const cell of object.cells){rows[cell.y][cell.x]='#';map.props.push({...cell,dialogue:object.event});}
  map.walkable=rows.map(row=>row.join(''));outdoors.objects.push(...objects);
  map.npcs.push({id:'olivineDockTrainer',name:'담청 작업항 트레이너',sprite:'worker',x:25,y:44,facing:'left',dialogue:'olivineDockTrainer'});
}
