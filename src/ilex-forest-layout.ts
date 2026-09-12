import type { TourFeature } from './explore-world';
import type { TourOutdoors } from './explore-outdoors';
import type { GameMap } from './types';

export const ILEX_FOREST_SIZE={width:56,height:64};
export const ILEX_FOREST_EAST={point:{x:54,y:32},spawn:{x:53,y:32},facing:'left' as const};
export const ILEX_FOREST_GRASS=[
  {kind:'tallGrass' as const,x:14,y:28,w:6,h:3},
  {kind:'tallGrass' as const,x:14,y:34,w:3,h:8},
  {kind:'tallGrass' as const,x:18,y:47,w:8,h:3},
  {kind:'tallGrass' as const,x:31,y:40,w:3,h:3},
];
type Rect=[number,number,number,number];

// The former 20x18 forest remains at the same coordinates in the northwest.
// The old east edge opens into the deeper forest; only the actual Azalea exit
// moves to the new eastern boundary.
export const ILEX_FOREST_FEATURES:TourFeature[]=[
  {x:23,y:3,w:10,h:10,kind:'grove',name:'북동쪽 짙은 나무벽',description:'북쪽 들머리의 밝은 길 뒤로\n나뭇잎이 여러 겹 포개져 있다.'},
  {x:36,y:3,w:17,h:15,kind:'grove',name:'고동 쪽 오래된 나무',description:'굵은 뿌리가 숲 바닥을 붙잡고 있다.\n동쪽 길은 나무벽 아래로 굽는다.'},
  {x:22,y:17,w:10,h:12,kind:'grove',name:'깊은 숲의 나무 군락',description:'햇빛이 거의 닿지 않는 깊은 숲이다.\n좁은 흙길이 양옆으로 갈라진다.'},
  {x:38,y:22,w:12,h:7,kind:'grove',name:'사당 북쪽 보호림',description:'오래된 나무들이 조용한 공터를 감싼다.\n가운데 길에서 숲 사당 쪽이 보인다.'},
  {x:34,y:37,w:16,h:10,kind:'grove',name:'동쪽 이끼 숲',description:'습기를 머금은 이끼가 뿌리를 덮었다.\n나뭇가지 사이로 고동 쪽 빛이 든다.'},
  {x:18,y:36,w:10,h:14,kind:'grove',name:'남서쪽 낮은 숲',description:'낮은 가지 아래로 포켓몬이 지난 흔적이 있다.\n순환길은 깊은 숲 큰길로 돌아간다.'},
  {x:3,y:21,w:10,h:20,kind:'grove',name:'서쪽 고목 지대',description:'고목이 빽빽해 길 밖으로 나갈 수 없다.\n나무 사이 바람은 북쪽에서 불어온다.'},
  {x:3,y:47,w:13,h:13,kind:'grove',name:'남쪽 완충림',description:'숲 안쪽을 감싸는 낮은 나무벽이다.\n동쪽 순환길로 되돌아갈 수 있다.'},
  {x:21,y:54,w:32,h:6,kind:'grove',name:'남쪽 깊은 나무벽',description:'겹겹의 나무가 더 먼 길을 막고 있다.\n표시된 순환길은 사당 공터로 돌아간다.'},
];

export const ILEX_FOREST_PATHS:Rect[]=[
  // Original north entrance and crossroads.
  [9,3,2,6],[9,8,11,2],[4,9,7,2],[4,10,2,5],[4,14,7,1],
  // Former east exit becomes the threshold to the deeper forest.
  [17,8,5,3],[20,9,3,9],[20,15,16,3],[33,16,3,17],
  // Shrine clearing and the long road to Azalea.
  [29,29,18,8],[45,30,10,5],[51,28,3,5],
  // Optional southern loop returns to the central road.
  [13,28,9,4],[13,30,4,19],[15,47,20,4],[30,43,5,8],[30,35,5,9],
];

export function makeIlexForestFloor():string[][]{
  const {width,height}=ILEX_FOREST_SIZE;
  return Array.from({length:height},(_,y)=>Array.from({length:width},(_,x)=>{
    if(x<20&&y<18){
      if((x===18||x===19)&&y>=8&&y<=10)return '.';
      return x>=2&&x<=17&&y>=3&&y<=15?'.':'#';
    }
    return x>=2&&x<width-2&&y>=3&&y<height-2?'.':'#';
  }));
}

export function installIlexForestDetails(map:GameMap,outdoors:TourOutdoors){
  const rows=map.walkable.map(row=>row.split(''));
  const objects=[
    {name:'너도밤나무숲 사당',event:'tourIlexShrine',cells:[{x:39,y:34}],pages:['오래된 나무 사이에 작은 숲 사당이 서 있다.\n조용히 인사하고 표시 길로 돌아가자.','사당을 살펴본 것만으로\n전설의 포켓몬을 만났다고 할 수는 없다.']},
    {name:'깊은 숲의 빛 기둥',event:'tourIlexLight',cells:[{x:29,y:31}],pages:['나뭇잎 사이로 한 줄기 햇빛이 내려온다.\n빛이 드는 쪽으로 사당 공터가 이어진다.']},
    {name:'남쪽 순환길의 발자국',event:'tourIlexTracks',cells:[{x:29,y:49}],pages:['작은 발자국이 풀 가장자리를 돌아 나갔다.\n사람 길과 포켓몬이 다니는 자리가 조금 다르다.']},
    {name:'고동마을 방향 표석',event:'tourIlexAzaleaStone',cells:[{x:50,y:35}],pages:['동쪽으로 갈수록 나무 사이가 밝아진다.\n이 길 끝은 고동마을 서쪽 입구다.']},
  ];
  for(const object of objects)for(const cell of object.cells){
    rows[cell.y][cell.x]='#';
    map.props.push({...cell,dialogue:object.event});
  }
  map.walkable=rows.map(row=>row.join(''));
  map.terrain=ILEX_FOREST_GRASS;
  map.npcs.push({id:'ilexTrainer',name:'너도밤나무숲 곤충채집가',sprite:'school_kid_m',x:32,y:45,facing:'left',dialogue:'tourIlexTrainer'});
  outdoors.objects.push(...objects);
}
