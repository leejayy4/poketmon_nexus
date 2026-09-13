import type { ExpandedTown } from './explore-expansion';
import type { TourOutdoors } from './explore-outdoors';
import type { GameMap } from './types';

export const BLACKTHORN_CITY_SIZE={width:56,height:56};

/** Keep the existing city core while giving the mountain settlement distinct arrival and overlook districts. */
export function extendBlackthornCity(plan:ExpandedTown):ExpandedTown{
  return {...plan,...BLACKTHORN_CITY_SIZE,
    buildings:[
      {kind:'center',x:6,y:7,w:5,h:2,door:{x:8,y:8},room:'tour_blackthorn_center'},
      {kind:'landmark',x:24,y:8,w:8,h:3,door:{x:26,y:10},room:'tour_blackthorn_hall'},
      {kind:'house',x:5,y:23,w:4,h:2,door:{x:6,y:24}},
      {kind:'house',x:24,y:27,w:4,h:2,door:{x:25,y:28}},
      {kind:'house',x:16,y:26,w:4,h:2,door:{x:17,y:27}},
    ],
    features:[
      {kind:'rocks',x:35,y:5,w:14,h:10,name:'용의 굴 앞 푸른 암벽',description:'북쪽 산벽의 문을 지나 용의 굴 지하 호수와 전승 사당으로 이어진다.\n같은 길로 검은먹시티에 돌아올 수 있다.'},
      {kind:'grove',x:4,y:34,w:12,h:10,name:'얼음샛길 도착 서리숲',description:'얼음샛길을 빠져나온 여행자가 찬바람을 고르는 낮은 숲이다.\n서쪽 입구와 포켓몬센터로 이어지는 돌길이 곁을 지난다.'},
      {kind:'water',x:34,y:21,w:14,h:11,name:'용 수행 물길',description:'산에서 내려온 찬물을 주민과 포켓몬이 함께 관리한다.\n수상 이동·낚시·특별 조우 구역은 아니다.'},
      {kind:'rocks',x:32,y:40,w:17,h:10,name:'45번도로 절벽 전망대',description:'남쪽 굽은 산길과 낮은 계곡을 내려다보는 바위턱이다.\n남문에서45번도로·46번도로를 지나29번도로 동쪽 합류부까지 갈 수 있다.'},
    ],
    paths:[...plan.paths,
      [2,11,52,4],[12,3,5,50],[2,29,52,4],
      [2,12,13,5],[8,14,5,21],[14,17,20,4],
      [22,10,8,8],[27,12,5,20],[29,32,5,20],
      [15,45,18,4],[14,51,5,4],[45,12,9,4],
    ],
  };
}

export function installBlackthornDetails(map:GameMap,outdoors:TourOutdoors){
  const rows=map.walkable.map(row=>row.split(''));
  const objects=[
    {name:'얼음샛길 도착 표석',event:'tourBlackthornIcePathStone',cells:[{x:4,y:16}],pages:['서쪽은 얼음샛길 1F·B1F·B2F·B3F와 44번도로를 거쳐 황토마을로 이어진다.\n같은 동굴길로 언제든 되돌아갈 수 있다.']},
    {name:'용의 굴 북쪽 길잡이석',event:'tourBlackthornDragonDenBoundary',cells:[{x:33,y:12}],pages:['북쪽 산벽의 문은 용의 굴 지하 호수와 전승 사당으로 이어진다.\n공개 관찰길은 왕복할 수 있지만 장로 시험·배지·특별 포켓몬 보상은 아직 열리지 않는다.']},
    {name:'45번도로 절벽 표석',event:'tourBlackthornRoute45Stone',cells:[{x:30,y:48}],pages:['남쪽 출구는45번도로와46번도로를 거쳐29번도로 동쪽 합류부로 이어진다.\n절벽 턱은 남쪽으로 내려가며 별도 오르막길로 검은먹시티에 돌아올 수 있다.']},
    {name:'용 수행 물길 관리판',event:'tourBlackthornTrainingWater',cells:[{x:33,y:25}],pages:['찬물의 흐름을 살피며 사람과 포켓몬이 함께 호흡을 가다듬는 곳이다.\n조사만으로 전투·회복·도구 획득은 발생하지 않는다.']},
    {name:'용 전승관 안내석',event:'tourBlackthornHallStone',cells:[{x:29,y:16}],pages:['동북쪽 건물은 도시 주민이 돌보는 용 전승 전시관이다.\n북쪽 용의 굴과는 서로 다른 장소다.']},
  ];
  for(const object of objects)for(const cell of object.cells){rows[cell.y][cell.x]='#';map.props.push({...cell,dialogue:object.event});}
  map.walkable=rows.map(row=>row.join(''));outdoors.objects.push(...objects);
}
