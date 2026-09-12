import type { ExpandedTown } from './explore-expansion';
import type { TourOutdoors } from './explore-outdoors';
import type { GameMap } from './types';

export const LAVENDER_TOWN_SIZE={width:40,height:36};

/** Expand the quiet eastern and southern edges while preserving the former 36x34 doors. */
export function extendLavenderTown(plan:ExpandedTown):ExpandedTown{
  return {...plan,...LAVENDER_TOWN_SIZE,
    buildings:[
      {kind:'center',x:6,y:7,w:5,h:2,door:{x:8,y:8},room:'tour_lavender_center'},
      {kind:'landmark',x:24,y:8,w:8,h:3,door:{x:26,y:10},room:'tour_lavender_hall'},
      {kind:'house',x:5,y:23,w:4,h:2,door:{x:6,y:24}},
      {kind:'house',x:24,y:27,w:4,h:2,door:{x:25,y:28}},
      {kind:'house',x:16,y:26,w:4,h:2,door:{x:17,y:27}},
    ],
    features:[
      {kind:'garden',x:4,y:11,w:7,h:7,name:'마을 추모 꽃정원',description:'주민과 포켓몬이 함께 돌보는 보라색과 하얀 꽃밭이다.\n꽃 사이의 낮은 길은 추모탑과 주거 골목으로 이어진다.'},
      {kind:'statue',x:16,y:16,w:5,h:5,name:'동행의 기억 조각상',description:'사람과 포켓몬이 나란히 걷는 모습을 새긴 작은 조각상이다.\n특정 사건이나 전설을 기리는 시설은 아니다.'},
      {kind:'grove',x:33,y:5,w:5,h:9,name:'동쪽 바람막이 숲',description:'10번도로에서 내려오는 바람을 낮추는 조용한 나무숲이다.\n마을 포켓몬이 그늘에서 쉬어 간 흔적이 남아 있다.'},
      {kind:'garden',x:31,y:23,w:7,h:8,name:'주민과 동료의 쉼뜰',description:'집 가까이에 물그릇과 넓은 빈자리를 둔 공동 뜰이다.\n몸집이 다른 포켓몬도 주민 곁에서 편히 머물 수 있다.'},
      {kind:'grove',x:4,y:29,w:7,h:5,name:'남쪽 고요한 산책숲',description:'연분홍 방향 출구로 가기 전 발소리를 낮추는 짧은 숲길이다.\n추모 정원의 꽃잎이 바람을 따라 여기까지 날아온다.'},
    ],
    paths:[...plan.paths,
      [12,3,5,31],[2,11,36,3],[2,20,36,3],[2,30,36,3],
      [9,15,7,3],[20,17,7,3],[27,11,11,3],[28,20,4,12],
      [8,25,9,3],[20,27,12,3],[10,32,7,2],
    ],
  };
}

export function installLavenderDetails(map:GameMap,outdoors:TourOutdoors){
  const rows=map.walkable.map(row=>row.split(''));
  const objects=[
    {name:'함께 돌보는 꽃 작업대',event:'tourLavenderFlowerTable',cells:[{x:11,y:16}],pages:['작은 삽과 물뿌리개 옆에 사람용 장갑과 포켓몬 발에 맞춘 덮개가 놓여 있다.\n꽃을 꺾지 않고 시든 잎만 정리하는 마을 공동 작업대다.']},
    {name:'정원 가장자리 발자국',event:'tourLavenderGardenTracks',cells:[{x:21,y:18}],pages:['작은 발자국과 큰 발자국이 조각상 둘레를 같은 방향으로 돌고 있다.\n주민과 동료가 서두르지 않고 함께 걸은 흔적이다.']},
    {name:'동료용 물그릇',event:'tourLavenderWaterBowl',cells:[{x:30,y:25}],pages:['깨끗한 물그릇이 몸집별로 나란히 놓여 있다.\n이름표 대신 누구나 쉬어 가도 좋다는 짧은 글이 붙어 있다.']},
    {name:'10번도로 도착 표석',event:'tourLavenderArrivalStone',cells:[{x:12,y:5}],pages:['북쪽은 10번도로 남부와 돌산터널로 이어진다.\n터널을 되돌아가면 10번도로 북부와 9번도로를 거쳐 블루시티에 닿는다.']},
  ];
  for(const object of objects)for(const cell of object.cells){rows[cell.y][cell.x]='#';map.props.push({...cell,dialogue:object.event});}
  map.walkable=rows.map(row=>row.join(''));outdoors.objects.push(...objects);
}
