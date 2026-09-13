import type { ExpandedTown } from './explore-expansion';
import type { TourOutdoors } from './explore-outdoors';
import type { GameMap } from './types';

export const SAFFRON_CITY_SIZE={width:64,height:64};

/** Preserve the former 40x36 core and add distinct work, residential and rail districts. */
export function extendSaffronCity(plan:ExpandedTown):ExpandedTown{
  return {...plan,...SAFFRON_CITY_SIZE,
    buildings:[
      {kind:'center',x:6,y:7,w:5,h:2,door:{x:8,y:8},room:'tour_saffron_center'},
      {kind:'landmark',x:26,y:17,w:10,h:4,door:{x:31,y:20},room:'tour_saffron_hall'},
      {kind:'house',x:5,y:25,w:5,h:2,door:{x:7,y:26}},
      {kind:'house',x:22,y:27,w:5,h:2,door:{x:24,y:28}},
      {kind:'house',x:5,y:16,w:5,h:2,door:{x:7,y:17}},
      {kind:'house',x:18,y:7,w:5,h:2,door:{x:20,y:8}},
    ],
    features:[...plan.features.map((feature,index)=>index===0?{
      ...feature,name:'노랑 중앙 업무 화단',description:'높은 빌딩 사이의 바람을 낮추는 작은 화단이다.\n직장인과 동행 포켓몬이 점심시간에 함께 쉰다.',
    }:feature),
      {kind:'garden',x:43,y:5,w:13,h:8,name:'동쪽 연구 휴게정원',description:'연구원과 포켓몬이 사옥 밖에서 빛과 바람을 쬐는 정원이다.\n8번도로에서 들어온 큰길과 이어진다.'},
      {kind:'fountain',x:43,y:22,w:9,h:7,name:'업무 지구 시계 분수',description:'출퇴근 시간과 열차 시간을 함께 표시하는 낮은 분수다.\n실프 사건이나 도시 봉쇄를 알리는 장치는 아니다.'},
      {kind:'garden',x:5,y:43,w:12,h:9,name:'남서 공동주택 쉼뜰',description:'주민과 몸집이 다른 포켓몬이 함께 머물 수 있는 넓은 뜰이다.\n물그릇과 낮은 벤치가 생활 골목을 따라 놓여 있다.'},
      {kind:'rail',x:23,y:45,w:17,h:8,name:'노랑 열차 환승 광장',description:'성도 금빛역 방면 열차 안내선이 도시 출구까지 이어진다.\n현재 열차는 기존 계약대로 무료 왕복한다.'},
      {kind:'grove',x:47,y:43,w:10,h:12,name:'남동 도시 완충숲',description:'큰길과 주거 골목 사이의 소음을 낮추는 작은 숲이다.\n주민의 동행 포켓몬이 나무 그늘에서 쉬어 간다.'},
    ],
    paths:[...plan.paths,
      [12,3,5,59],[2,11,60,3],[2,32,60,4],[2,58,60,4],
      [31,18,31,4],[34,20,4,40],[38,27,19,4],[43,12,4,11],
      [3,39,20,4],[16,41,4,18],[20,50,24,4],[40,39,20,4],
      [52,29,5,31],[27,36,6,10],[40,53,17,4],
    ],
  };
}

export function installSaffronDetails(map:GameMap,outdoors:TourOutdoors){
  const rows=map.walkable.map(row=>row.split(''));
  const objects=[
    {name:'7번도로 도착 안내판',event:'tourSaffronRoute7Board',cells:[{x:4,y:15}],pages:['서쪽은 7번도로와 무지개시티 방향이다.\n남쪽 지하통로를 이용하면 8번도로로 우회할 수 있다.']},
    {name:'8번도로 도착 안내판',event:'tourSaffronRoute8Board',cells:[{x:58,y:15}],pages:['동쪽은 8번도로와 보라타운 방향이다.\n지상 큰길은 노랑시티 중앙을 지나 서쪽 7번도로까지 이어진다.']},
    {name:'연구 휴게정원 관찰대',event:'tourSaffronResearchGarden',cells:[{x:41,y:17}],pages:['실내 연구를 마친 사람과 포켓몬이 눈의 피로를 풀도록 마련한 낮은 관찰대다.\n새 장치나 사건을 작동시키는 시설은 아니다.']},
    {name:'공동주택 동료 급수대',event:'tourSaffronCompanionWater',cells:[{x:20,y:46}],pages:['사람용 수도 옆에 높이가 다른 포켓몬 물그릇이 놓여 있다.\n도시 주민이 매일 씻고 채우는 생활 시설이다.']},
    {name:'성도행 열차 환승 표석',event:'tourSaffronRailMarker',cells:[{x:31,y:54}],pages:['성도 금빛역 방면 열차의 환승 방향이 표시되어 있다.\n기존 열차는 승차권이나 새 이야기 조건 없이 왕복한다.']},
  ];
  for(const object of objects)for(const cell of object.cells){rows[cell.y][cell.x]='#';map.props.push({...cell,dialogue:object.event});}
  map.walkable=rows.map(row=>row.join(''));outdoors.objects.push(...objects);
}
