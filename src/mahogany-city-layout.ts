import type { ExpandedTown } from './explore-expansion';
import type { TourOutdoors } from './explore-outdoors';
import type { GameMap } from './types';

export const MAHOGANY_TOWN_SIZE={width:40,height:36};

/** Preserve the compact village core while separating the Route 42, 43 and 44 thresholds. */
export function extendMahoganyTown(plan:ExpandedTown):ExpandedTown{
  return {...plan,...MAHOGANY_TOWN_SIZE,
    buildings:[
      {kind:'center',x:6,y:7,w:5,h:2,door:{x:8,y:8},room:'tour_mahogany_center'},
      {kind:'landmark',x:22,y:8,w:8,h:3,door:{x:24,y:10},room:'tour_mahogany_hall'},
      {kind:'house',x:5,y:19,w:4,h:2,door:{x:6,y:20}},
      {kind:'house',x:21,y:23,w:4,h:2,door:{x:22,y:24}},
      {kind:'house',x:5,y:25,w:4,h:2,door:{x:6,y:26}},
    ],
    features:[
      {kind:'garden',x:13,y:15,w:11,h:6,name:'산기슭 건조 장터',description:'산나물과 여행 장비를 낮은 차양 아래 나누어 말린다.\n주민과 포켓몬이 오가는 생활 장터이며 특별 도구 판매는 없다.'},
      {kind:'rocks',x:29,y:5,w:7,h:8,name:'44번도로 얼음바람 준비뜰',description:'동쪽 산길에서 내려오는 찬 바람을 돌담이 막는다.\n얼음샛길은 다음 구간이며 이 뜰에서 동굴 통과를 완료하지 않는다.'},
      {kind:'water',x:27,y:25,w:9,h:7,name:'43번도로 상류 빗물못',description:'분노의호수 방향에서 흘러온 빗물을 마을 생활에 나누어 쓴다.\n수상 이동이나 야생 수상 조우 구역은 아니다.'},
      {kind:'grove',x:10,y:29,w:12,h:4,name:'42번도로 도착 바람숲',description:'절구산 아래 길을 지나온 여행자가 바람을 피하는 낮은 숲이다.\n서쪽 본선과 마을 장터를 잇는다.'},
    ],
    paths:[...plan.paths,
      [2,11,36,4],[12,3,5,31],[2,28,36,4],
      [3,15,10,4],[8,17,8,4],[16,13,4,17],
      [20,20,10,4],[25,12,5,15],[28,9,10,4],
      [12,30,5,4],[14,32,4,3],
    ],
  };
}

export function installMahoganyDetails(map:GameMap,outdoors:TourOutdoors){
  const rows=map.walkable.map(row=>row.split(''));
  const objects=[
    {name:'42번도로 도착 표석',event:'tourMahoganyRoute42Stone',cells:[{x:4,y:15}],pages:['서쪽은 42번도로와 절구산 선택 분기, 그 너머는 인주시티다.\n절구산을 방문하지 않아도 본선으로 돌아갈 수 있다.']},
    {name:'43번도로 호수 방향 표석',event:'tourMahoganyRoute43Stone',cells:[{x:18,y:4}],pages:['북쪽은 43번도로를 거쳐 분노의호수로 이어진다.\n호수 사건·특별 조우·통행 조건은 후속 범위다.']},
    {name:'44번도로 얼음샛길 표석',event:'tourMahoganyRoute44Stone',cells:[{x:35,y:14}],pages:['동쪽은 44번도로와 얼음샛길 1F·B1F·B2F·B3F를 거쳐 검은먹시티로 이어진다.\n본선과 모든 계단은 양방향으로 왕복할 수 있다.']},
    {name:'산기슭 장터 건조대',event:'tourMahoganyMarketRack',cells:[{x:14,y:18}],pages:['산나물과 젖은 여행 장비를 품목별로 나누어 말린다.\n조사만으로 도구·돈·회복 효과를 받지 않는다.']},
    {name:'상류 빗물 분배대',event:'tourMahoganyWaterTable',cells:[{x:28,y:28}],pages:['43번도로 상류에서 내려온 빗물을 장터와 집의 생활용으로 나눈다.\n분노의호수 사건을 해결했다는 기록은 아니다.']},
  ];
  for(const object of objects)for(const cell of object.cells){rows[cell.y][cell.x]='#';map.props.push({...cell,dialogue:object.event});}
  map.walkable=rows.map(row=>row.join(''));outdoors.objects.push(...objects);
}
