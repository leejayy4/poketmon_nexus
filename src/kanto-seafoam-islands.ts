import type { GameMap,Point,Warp } from './types';
import { installSeafoamBoulder } from './seafoam-boulder';
import { installSeafoamSupply } from './seafoam-supply';
import { installSeafoamIceWalk } from './seafoam-ice-walk';
import type { Passage } from './journey-world';
import type { Place,TourId } from './explore-world';
import type { TourOutdoors } from './explore-outdoors';
import { KANTO_ROUTE_TWENTY,KANTO_SEAFOAM_EXTERIOR } from './kanto-south-sea-route';

export const SEAFOAM_1F='tour_kanto_seafoam_1f' as const;
export const SEAFOAM_B1F='tour_kanto_seafoam_b1f' as const;
export const SEAFOAM_B2F='tour_kanto_seafoam_b2f' as const;
export const SEAFOAM_B3F='tour_kanto_seafoam_b3f' as const;
export const SEAFOAM_B4F='tour_kanto_seafoam_b4f' as const;

type ObjectInfo={name:string;event:string;cells:Point[];pages:string[]};
const props=(objects:ObjectInfo[])=>objects.flatMap(object=>object.cells.map(cell=>({...cell,dialogue:object.event})));

export function installKantoSeafoamIslands(world:{
  places:Place[];maps:Record<TourId,GameMap>;passages:Record<string,Passage>;
  passagePlaces:Record<string,Place>;spawns:Record<TourId,Point>;outdoors:Record<string,TourOutdoors>;
}){
  const fuchsia=world.places.find(place=>place.id==='tour_fuchsia')!;
  const floorObjects:Record<string,ObjectInfo[]>={};
  const make=(id:TourId,name:string,width:number,height:number,carves:number[][],warps:Warp[],objects:ObjectInfo[]):GameMap=>{
    const rows=Array.from({length:height},()=>Array<string>(width).fill('#'));
    for(const [x,y,w,h] of carves)for(let yy=y;yy<y+h;yy++)for(let xx=x;xx<x+w;xx++)rows[yy][xx]='.';
    for(const warp of warps)rows[warp.y][warp.x]='.';
    for(const object of objects)for(const cell of object.cells)rows[cell.y][cell.x]='#';
    floorObjects[id]=objects;
    return {id,name,width,height,background:id,walkable:rows.map(row=>row.join('')),warps,npcs:[],props:props(objects),terrain:[]};
  };
  const boundary=(floor:string,event:string,x:number,y:number):ObjectInfo=>({name:`${floor} 얼음 수로 경계`,event,cells:[{x,y}],pages:['차가운 물길과 둥근 바위가 마른 통로 옆으로 이어진다.','현재 해류 변화·바위 밀기·수상 이동은 작동하지 않으며 계단 본선으로 왕복한다.']});

  world.maps[SEAFOAM_1F]=make(SEAFOAM_1F,'쌍둥이섬 · 1F',48,48,
    [[25,1,8,19],[20,16,13,8],[8,20,17,7],[6,20,7,22],[29,28,13,7],[36,31,7,15],
      [18,7,8,3],[18,9,3,9],[13,30,7,3],[17,32,3,6],[12,36,8,3]],
    [
      {x:29,y:1,to:KANTO_SEAFOAM_EXTERIOR,spawn:{x:32,y:12},entry:'up',facing:'up'},
      {x:10,y:40,to:SEAFOAM_B1F,spawn:{x:10,y:5},entry:'down',facing:'down'},
      {x:39,y:44,to:KANTO_ROUTE_TWENTY,spawn:{x:34,y:18},entry:'down',facing:'left'},
      {x:39,y:29,to:SEAFOAM_B1F,spawn:{x:39,y:40},entry:'up',facing:'up'},
    ],[boundary('1F','tourSeafoam1FWater',22,22),{name:'1F 동서 출구도',event:'tourSeafoam1FChart',cells:[{x:31,y:18}],pages:['동쪽 입구는20번수로 상륙지, 서쪽 출구는 홍련 방향 연락선으로 이어진다.','두 통로는 아래 네 층을 왕복한 뒤 서로 연결된다.']}]);

  world.maps[SEAFOAM_B1F]=make(SEAFOAM_B1F,'쌍둥이섬 · B1F',48,48,
    [[6,3,9,28],[6,27,17,8],[33,18,10,25],
      [14,12,10,3],[21,14,3,10],[14,23,10,3],[18,25,6,4]],
    [
      {x:10,y:3,to:SEAFOAM_1F,spawn:{x:10,y:38},entry:'up',facing:'up'},
      {x:22,y:31,to:SEAFOAM_B2F,spawn:{x:10,y:5},entry:'down',facing:'down'},
      {x:39,y:42,to:SEAFOAM_1F,spawn:{x:39,y:31},entry:'down',facing:'down'},
      {x:35,y:20,to:SEAFOAM_B2F,spawn:{x:39,y:40},entry:'up',facing:'up'},
    ],[
      boundary('B1F','tourSeafoamB1Water',20,23),
      {name:'B1F 수로 얼음 능선 표석',event:'tourSeafoamB1IceRidge',cells:[{x:24,y:20}],pages:[
        '서쪽1F 계단과 남쪽B2F 계단 사이로 흰 얼음 능선이 길게 이어진다.\n반짝이는 면 옆의 짙은 테두리를 따라 걸으면 수로 둘레길과 합류한다.',
        '이 얼음면은 길의 높낮이와 방향을 보여 주는 지형이다.\n미끄럼 이동 없이 남쪽 마른 통로로 내려가 B2F 계단을 이용한다.',
      ]},
    ]);

  world.maps[SEAFOAM_B2F]=make(SEAFOAM_B2F,'쌍둥이섬 · B2F',48,48,
    [[6,3,9,29],[6,28,20,8],[33,18,10,25],
      [2,9,5,3],[2,11,3,10],[4,18,3,3],[14,23,10,3],[21,25,3,4],
      [14,17,10,3],[18,19,6,7],
      [42,24,4,3],[44,26,2,11],[42,34,4,3]],
    [
      {x:10,y:3,to:SEAFOAM_B1F,spawn:{x:22,y:29},entry:'up',facing:'up'},
      {x:23,y:33,to:SEAFOAM_B3F,spawn:{x:10,y:5},entry:'down',facing:'down'},
      {x:39,y:42,to:SEAFOAM_B1F,spawn:{x:35,y:22},entry:'down',facing:'down'},
      {x:37,y:20,to:SEAFOAM_B3F,spawn:{x:39,y:40},entry:'up',facing:'up'},
    ],[
      boundary('B2F','tourSeafoamB2Water',22,23),
      {name:'B2F 갈라진 얼음판 표석',event:'tourSeafoamB2IceField',cells:[{x:24,y:24}],pages:[
        '북서쪽 B1F 계단에서 내려온 길이 두 갈래 얼음판을 지나 남쪽B3F 계단으로 굽는다.\n거친 암반에서는 쥬쥬와 주뱃을 만날 수 있다.',
        '동쪽 상승 통로는 별도 계단으로 B1F에 돌아간다.\n작은 바위 곁길은 선택 탐험이며 본선 왕복에는 필요하지 않다.',
      ]},
    ]);

  world.maps[SEAFOAM_B3F]=make(SEAFOAM_B3F,'쌍둥이섬 · B3F',48,48,
    [[6,3,9,31],[6,30,20,8],[33,18,10,25],
      [14,9,7,3],[18,11,3,8],[18,16,9,3],[24,18,3,10],[20,25,7,3],[20,27,3,4]],
    [
      {x:10,y:3,to:SEAFOAM_B2F,spawn:{x:23,y:31},entry:'up',facing:'up'},
      {x:23,y:35,to:SEAFOAM_B4F,spawn:{x:12,y:5},entry:'down',facing:'down'},
      {x:39,y:42,to:SEAFOAM_B2F,spawn:{x:37,y:22},entry:'down',facing:'down'},
      {x:38,y:20,to:SEAFOAM_B4F,spawn:{x:44,y:40},entry:'up',facing:'up'},
    ],[
      boundary('B3F','tourSeafoamB3Water',23,23),
      {name:'B3F 동쪽 상승 회랑 표석',event:'tourSeafoamB3EastReturn',cells:[{x:43,y:28}],pages:[
        'B4F 동쪽 계단에서 올라온 냉기가 이 긴 회랑을 따라 흐른다.\n남쪽 끝 계단은 B2F 동쪽 통로로 이어진다.',
        '서쪽 굽은 냉기길과는 이 층에서 합류하지 않는다.\nB4F를 다시 건너거나 남쪽 계단으로 계속 올라가야 한다.',
      ]},
    ]);

  world.maps[SEAFOAM_B4F]=make(SEAFOAM_B4F,'쌍둥이섬 · B4F',56,48,
    [[8,3,9,20],[8,19,19,8],[22,21,7,14],[24,31,23,8],[42,18,9,20],[40,35,11,9],
      [28,25,9,3],[34,27,3,5],[17,8,7,3],[21,10,3,6]],
    [
      {x:12,y:3,to:SEAFOAM_B3F,spawn:{x:23,y:33},entry:'up',facing:'up'},
      {x:44,y:42,to:SEAFOAM_B3F,spawn:{x:38,y:22},entry:'down',facing:'down'},
    ],[boundary('B4F','tourSeafoamB4Water',26,25),{name:'B4F 깊은 냉기 관찰대',event:'tourSeafoamB4Cold',cells:[{x:42,y:34}],pages:['가장 낮은 층의 차가운 물결과 얼음벽을 안전 난간에서 살핀다.','전설 포켓몬 조우·포획·보상은 이 통과로에 포함하지 않는다.']}]);

  const eastReturnMarkers:[TourId,ObjectInfo][]=[
    [SEAFOAM_B2F,{name:'B2F 동쪽 상승 회랑 표석',event:'tourSeafoamB2EastReturn',cells:[{x:43,y:29}],pages:['B3F 동쪽 계단에서 올라온 길이다.\n남쪽 계단으로 가면 B1F 동쪽 통로가 이어진다.','서쪽 조우 회랑과는 이 층에서 합류하지 않는다.\n최하층을 되건너지 않고 홍련 쪽으로 계속 올라간다.']}],
    [SEAFOAM_B1F,{name:'B1F 동쪽 상승 회랑 표석',event:'tourSeafoamB1EastReturn',cells:[{x:43,y:29}],pages:['B2F 동쪽 계단에서 올라온 길이다.\n남쪽 계단은 1F 서쪽 출구 통로로 이어진다.','서쪽 수로 능선과는 분리된 귀환 회랑이다.\n이 길을 따라 20번수로 홍련 방면으로 올라간다.']}],
    [SEAFOAM_1F,{name:'1F 서쪽 출구 회랑 표석',event:'tourSeafoam1FWestReturn',cells:[{x:43,y:37}],pages:['B1F에서 올라온 길이 남쪽 20번수로 출구로 이어진다.','출구 밖 서쪽 연락선 구간을 따라가면 홍련섬 포켓몬센터와 연구소로 돌아간다.']}],
  ];
  for(const [id,object] of eastReturnMarkers){
    floorObjects[id].push(object);world.maps[id].props.push(...props([object]));
    const rows=world.maps[id].walkable.map(row=>row.split(''));
    for(const cell of object.cells)rows[cell.y][cell.x]='#';
    world.maps[id].walkable=rows.map(row=>row.join(''));
  }

  // Add guide surfaces only on previously blocked rock. Old walkable save positions stay valid.
  const previews:[TourId,Point,string,string,string][]=[
    [SEAFOAM_1F,{x:24,y:4},'1F 입구 길잡이','왼쪽 낮은 곁길은 출구도 앞에서 합류한다.\n본선은 남서쪽 B1F 계단으로 이어진다.','돌아올 때는 북쪽 입구가 상륙지다.\n서쪽 통로는 지하층을 돌아 올라오는 길이다.'],
    [SEAFOAM_B1F,{x:15,y:5},'B1F 수로 둘레길','남쪽 본선은 아래층 계단으로 꺾인다.\n중간 오른쪽 길은 수로 경계를 돌아 합류한다.','벽 너머 귀환 계단에는 여기서 건널 수 없다.\n돌아가려면 북쪽 1F 계단을 이용한다.'],
    [SEAFOAM_B2F,{x:15,y:5},'B2F 암벽 회랑','왼쪽 작은 회랑은 본선으로 돌아온다.\n남쪽 굽이의 수로 경계 옆이 B3F 방향이다.','반대편 상승 통로에도 짧은 바깥 회랑이 있다.\n각 곁길은 같은 쪽 통로에 다시 합류한다.'],
    [SEAFOAM_B3F,{x:15,y:5},'B3F 굽은 암반길','곧장 남쪽으로 가면 B4F 계단이다.\n오른쪽 곁길은 두 번 꺾여 수로 표석에 닿는다.','표석에서 남쪽으로 내려오면 본선과 합류한다.\n북쪽 계단은 B2F로 돌아가는 길이다.'],
    [SEAFOAM_B4F,{x:17,y:5},'B4F 최하층 안내','입구 오른쪽 좁은 냉기 틈은 막다른 길이다.\n남쪽 본선을 따라가면 반대편 상승 계단이다.','중앙 수로 표석 오른쪽 길은 냉기 관찰대 앞에서 합류한다.\n물에 들어가지 않고 마른 통로로 돌아간다.'],
  ];
  for(const [id,cell,name,outward,back] of previews){
    const object:ObjectInfo={name,event:`${id}Preview`,cells:[cell],pages:[outward,back]};
    floorObjects[id].push(object);world.maps[id].props.push({...cell,dialogue:object.event});
  }
  const observations:[TourId,string,string][]=[
    [SEAFOAM_1F,'tourSeafoam1FWater','낮은 곁길과 본선 사이에 얼음벽이 서 있다.\n남서쪽 계단은 B1F, 북쪽 길은 상륙지로 이어진다.'],
    [SEAFOAM_B1F,'tourSeafoamB1Water','수로 가장자리의 짧은 둘레길을 따라왔다.\n남쪽 합류점에서 오른쪽으로 꺾으면 B2F 계단이다.'],
    [SEAFOAM_B2F,'tourSeafoamB2Water','북쪽 갈림길은 얼음이 낀 암벽을 돌아 이곳에 합류한다.\n남쪽 넓은 발판의 계단은 B3F로 내려간다.'],
    [SEAFOAM_B3F,'tourSeafoamB3Water','두 번 꺾이는 암반길 아래에서 냉기가 올라온다.\n남쪽 본선에 합류하면 B4F 계단이 보인다.'],
    [SEAFOAM_B4F,'tourSeafoamB4Water','중앙 암반 오른쪽 좁은 길은 남쪽 발판에 합류한다.\n발판 동쪽의 냉기 관찰대를 지나 상승 계단으로 향한다.'],
  ];
  for(const [id,event,page] of observations){
    const object=floorObjects[id].find(object=>object.event===event);
    if(object)object.pages=[page,id===SEAFOAM_B2F?'물길은 그대로 두고 마른 통로로 돌아간다. 북서쪽 작은 바위는 남쪽 홈으로 밀어 가로 곁길을 열 수 있다.':'발밑은 마른 암반이다. 물길과 바위는 건드리지 않고 돌아간다.'];
  }

  const exterior=world.maps[KANTO_SEAFOAM_EXTERIOR],outsideRows=exterior.walkable.map(row=>row.split(''));
  outsideRows[10][32]='.';exterior.walkable=outsideRows.map(row=>row.join(''));
  exterior.warps.push({x:32,y:10,to:SEAFOAM_1F,spawn:{x:29,y:3},entry:'up',facing:'up'});
  const route20=world.maps[KANTO_ROUTE_TWENTY],routeRows=route20.walkable.map(row=>row.split(''));
  for(let y=15;y<=22;y++)for(let x=39;x<=42;x++)routeRows[y][x]='#';
  for(let x=1;x<=6;x++)for(let y=16;y<=20;y++)routeRows[y][x]='.';
  routeRows[18][34]='.';route20.walkable=routeRows.map(row=>row.join(''));
  route20.warps.push({x:34,y:18,to:SEAFOAM_1F,spawn:{x:39,y:42},entry:'left',facing:'up'});

  const cinnabar=world.maps.tour_cinnabar,cinnabarRows=cinnabar.walkable.map(row=>row.split(''));
  for(let y=38;y<=41;y++)for(let x=1;x<=13;x++)cinnabarRows[y][x]='.';
  cinnabarRows[40][1]='.';cinnabar.walkable=cinnabarRows.map(row=>row.join(''));
  route20.warps.push({x:1,y:18,to:'tour_cinnabar',spawn:{x:3,y:40},entry:'left',facing:'left'});
  cinnabar.warps.push({x:1,y:40,to:KANTO_ROUTE_TWENTY,spawn:{x:4,y:18},entry:'left',facing:'right'});
  const landing:ObjectInfo={name:'20번수로 홍련 상륙표',event:'tourCinnabarRoute20Landing',cells:[{x:5,y:38}],pages:['서쪽 출구는 관동20번수로 연락선이다.\n쌍둥이섬 전 층과19번수로를 거쳐 연분홍시티까지 왕복한다.','북쪽 태초 방면은 현재 창작 도보 해안길이며 공식21번수로 전환은 별도 범위다.\n동쪽 갈색 직결도 원작 도로가 아닌 기존 창작 연결이다.']};
  cinnabarRows[38][5]='#';cinnabar.walkable=cinnabarRows.map(row=>row.join(''));
  cinnabar.props.push({x:5,y:38,dialogue:landing.event});world.outdoors.tour_cinnabar.objects.push(landing);

  const floorProfiles:Record<string,{concept:string;landmark:string}>={
    [SEAFOAM_1F]:{concept:'20번수로 동쪽 입구에서 서쪽 출구로 이어지는 두 갈래의 시작층. 양쪽 통로는 B4F 횡단 뒤 연결된다.',landmark:'1F 동서 출구도'},
    [SEAFOAM_B1F]:{concept:'서쪽 안전 본선과 쥬쥬·주뱃 서식 암반 능선을 고르고 B2F로 내려가는 수로층.',landmark:'B1F 수로 얼음 능선 표석'},
    [SEAFOAM_B2F]:{concept:'갈라진 얼음판과 선택 조우 회랑, 작은 바위 곁길을 지나 B3F로 이어지는 중간층.',landmark:'B2F 갈라진 얼음판 표석'},
    [SEAFOAM_B3F]:{concept:'안전 얼음길과 굽은 냉기 조우 회랑이 B4F 하강 계단 앞에서 합류하는 깊은 층.',landmark:'B3F 굽은 암반길'},
    [SEAFOAM_B4F]:{concept:'네 냉기 선반과 마른 안전선을 횡단해 반대편 B3F 상승 통로로 돌아가는 최하층.',landmark:'B4F 깊은 냉기 관찰대'},
  };
  for(const [id,name] of [[SEAFOAM_1F,'쌍둥이섬 · 1F'],[SEAFOAM_B1F,'쌍둥이섬 · B1F'],[SEAFOAM_B2F,'쌍둥이섬 · B2F'],[SEAFOAM_B3F,'쌍둥이섬 · B3F'],[SEAFOAM_B4F,'쌍둥이섬 · B4F']] as const){
    if(id===SEAFOAM_B2F)world.maps[id].terrain=[
      {kind:'tallGrass',x:18,y:17,w:3,h:7},
      {kind:'tallGrass',x:21,y:18,w:3,h:5},
    ];
    if(id===SEAFOAM_B1F)world.maps[id].terrain=[
      {kind:'tallGrass',x:16,y:12,w:5,h:3},
      {kind:'tallGrass',x:21,y:14,w:3,h:6},
    ];
    if(id===SEAFOAM_B3F)world.maps[id].terrain=[
      {kind:'tallGrass',x:16,y:9,w:5,h:3},
      {kind:'tallGrass',x:18,y:13,w:3,h:4},
      {kind:'tallGrass',x:22,y:16,w:5,h:3},
      {kind:'tallGrass',x:24,y:21,w:3,h:5},
      {kind:'tallGrass',x:20,y:25,w:4,h:3},
    ];
    if(id===SEAFOAM_B4F)world.maps[id].terrain=[
      {kind:'tallGrass',x:10,y:19,w:7,h:3},
      {kind:'tallGrass',x:26,y:25,w:3,h:6},
      {kind:'tallGrass',x:30,y:31,w:10,h:3},
      {kind:'tallGrass',x:43,y:21,w:6,h:5},
    ];
    if(id===SEAFOAM_1F)world.maps[id].terrain=[
      {kind:'tallGrass',x:18,y:7,w:6,h:3},
      {kind:'tallGrass',x:13,y:30,w:7,h:3},
    ];
    world.passages[id]={id,a:fuchsia,b:fuchsia,kind:'cave',bend:24};
    const profile=floorProfiles[id];
    world.passagePlaces[id]={id,name,region:'관동',theme:'cave',concept:profile.concept,landmark:profile.landmark,x:fuchsia.x-.45,y:fuchsia.y+.8};
    world.spawns[id]=id===SEAFOAM_1F?{x:29,y:3}:id===SEAFOAM_B4F?{x:12,y:5}:{x:10,y:5};
    world.outdoors[id]={objects:floorObjects[id]??[],signs:[]};
  }
  installSeafoamBoulder(world.maps[SEAFOAM_B2F],world.outdoors[SEAFOAM_B2F]);
  installSeafoamSupply(world.maps[SEAFOAM_B1F],world.outdoors[SEAFOAM_B1F]);
  installSeafoamIceWalk(world.maps[SEAFOAM_B1F],world.outdoors[SEAFOAM_B1F]);
  installSeafoamIceWalk(world.maps[SEAFOAM_B2F],world.outdoors[SEAFOAM_B2F]);
}
