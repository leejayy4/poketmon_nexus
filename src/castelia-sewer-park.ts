import type { GameMap,Point } from './types';
import type { Place,TourId } from './explore-world';
import type { TourOutdoors } from './explore-outdoors';

export const CASTELIA_SEWERS='tour_castelia_sewers' as const;
export const CASTELIA_PARK='tour_castelia_park' as const;
type World={maps:Record<TourId,GameMap>;passagePlaces:Record<string,Place>;spawns:Record<TourId,Point>;outdoors:Record<string,TourOutdoors>};
const open=(rows:string[][],x:number,y:number,w:number,h:number)=>{for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)rows[j][i]='.';};
/** BW2 harbor/sewer/park relationship; compact dry reconstruction, no seasonal or story locks. */
export function installCasteliaSewerPark(w:World){
  const city=w.maps.tour_castelia,outside=w.outdoors.tour_castelia;if(!city||!outside)return;
  const sewer=Array.from({length:28},()=>Array<string>(48).fill('#'));
  open(sewer,5,22,42,4);open(sewer,5,2,4,23);
  open(sewer,18,10,12,8);open(sewer,24,16,4,8);
  const park=Array.from({length:40},()=>Array<string>(32).fill('#'));
  open(park,14,2,5,37);open(park,3,8,16,12);open(park,18,17,11,11);
  open(park,7,19,3,11);open(park,7,28,12,3);open(park,18,7,8,3);open(park,23,9,3,9);
  const sewerObjects=[
    {name:'공원으로 오르는 계단 표지',event:'tourCasteliaSewerParkSign',cells:[{x:9,y:3}],pages:['북쪽 계단 → 구름시티 숨은 공원','항구로 돌아가려면 남쪽으로 내려가 긴 통로 끝의 동쪽 계단을 오른다.']},
    {name:'하수도 관리 표지',event:'tourCasteliaSewerHabitat',cells:[{x:28,y:18}],pages:['곁방의 어두운 바닥에는 꼬렛과 주뱃이 모인다. 진흙 가까이에서는 질퍽이도 발견된다.','공원은 서쪽 통로를 따라 북쪽 계단. 항구는 남쪽 본선에서 동쪽 계단으로.']},
  ];
  const parkObjects=[
    {name:'공원 귀환 표지',event:'tourCasteliaParkReturn',cells:[{x:19,y:35}],pages:['남쪽 계단 → 구름하수도 → 구름시티 항구','풀밭을 피해 가운데 산책길로 돌아갈 수 있다. 다친 동료는 항구에서 북서쪽 포켓몬센터로 데려가자.']},
    {name:'빌딩 사이 햇볕',event:'tourCasteliaParkLight',cells:[{x:13,y:5}],pages:['빌딩 사이로 들어온 햇볕이 풀잎 끝에 머문다.','거리에서는 보이지 않던 작은 공원이다. 남쪽 계단이 하수도와 이어져 있다.']},
  ];
  for(const [id,rows,objects,name,terrain,warps,theme,spawn] of [
    [CASTELIA_SEWERS,sewer,sewerObjects,'구름하수도',[{kind:'tallGrass' as const,x:19,y:11,w:5,h:5}],[{x:46,y:24,to:'tour_castelia' as const,spawn:{x:58,y:48},entry:'right' as const,facing:'left' as const},{x:6,y:2,to:CASTELIA_PARK,spawn:{x:16,y:36},entry:'up' as const,facing:'up' as const}],'cave' as const,{x:44,y:24}],
    [CASTELIA_PARK,park,parkObjects,'구름시티 숨은 공원',[{kind:'tallGrass' as const,x:4,y:10,w:8,h:8},{kind:'tallGrass' as const,x:22,y:19,w:6,h:7}],[{x:16,y:38,to:CASTELIA_SEWERS,spawn:{x:6,y:3},entry:'down' as const,facing:'down' as const}],'forest' as const,{x:16,y:36}],
  ] as const){
    for(const object of objects)for(const p of object.cells)rows[p.y][p.x]='#';
    w.maps[id]={id,name,width:rows[0].length,height:rows.length,background:id,walkable:rows.map(row=>row.join('')),terrain:[...terrain],warps:[...warps],npcs:[],props:objects.flatMap(object=>object.cells.map(p=>({...p,dialogue:object.event})))};
    w.passagePlaces[id]={id,name,region:'하나',theme,concept:id===CASTELIA_SEWERS?'항구와 숨은 공원을 잇는 마른 하수 통로':'빌딩 안쪽 햇볕과 풀밭이 남은 공원',landmark:id===CASTELIA_SEWERS?'북서쪽 공원 계단':'남쪽 하수도 계단',x:4.1,y:id===CASTELIA_SEWERS?5.1:4.9};
    w.spawns[id]=spawn;w.outdoors[id]={objects:[...objects],signs:[]};
  }
  w.maps[CASTELIA_PARK].npcs.push({id:'casteliaParkTrainer',name:'공원 산책 트레이너',sprite:'ace_trainer_f',x:18,y:29,facing:'left',dialogue:'tourCasteliaParkTrainer'});
  w.maps[CASTELIA_SEWERS].npcs.push({id:'casteliaSewerScientist',name:'배수 연구원',sprite:'scientist_f',x:28,y:11,facing:'down',dialogue:'tourCasteliaSewerScientist'});
  const row=city.walkable[48];city.walkable[48]=row.slice(0,59)+'.'+row.slice(60);
  city.warps.push({x:59,y:48,to:CASTELIA_SEWERS,spawn:{x:44,y:24},entry:'right',facing:'left'});
  const sign={name:'구름하수도 입구',event:'tourCasteliaSewerEntrance',cells:[{x:59,y:47}],pages:['동쪽 계단 → 구름하수도','하수도의 서쪽 통로 끝 북쪽 계단은 빌딩 사이 숨은 공원으로 이어진다. 돌아올 때도 같은 길을 이용한다.']};
  outside.objects.push(sign);city.props.push({x:59,y:47,dialogue:sign.event});
  // The east street remains open at y=11..13; this blocked wall cell gives
  // departure preparation an actual place beside, rather than on, the road.
  const routeFourDesk={name:'4번도로 출발 점검대',event:'tourCasteliaRouteFourDesk',cells:[{x:66,y:10}],pages:['구름시티 동쪽 큰길에서 4번도로로 나가기 전 동료와 보급 상태를 확인하는 자리다.','표지 옆 길은 언제나 열려 있으며 점검 기록은 통행 조건이 아니다.']};
  outside.objects.push(routeFourDesk);city.props.push({x:66,y:10,dialogue:routeFourDesk.event});
}

/** Render the same cell geometry used by collision; terrain encounters are drawn by the common renderer. */
export function paintCasteliaSewerPark(c:CanvasRenderingContext2D,map:GameMap):boolean{
  if(map.id!==CASTELIA_SEWERS&&map.id!==CASTELIA_PARK)return false;
  const sewer=map.id===CASTELIA_SEWERS;
  const r=(x:number,y:number,w:number,h:number,color:string)=>{c.fillStyle=color;c.fillRect(x,y,w,h);};
  r(0,0,map.width*16,map.height*16,sewer?'#303d43':'#385c48');
  for(let y=0;y<map.height;y++)for(let x=0;x<map.width;x++){
    const px=x*16,py=y*16,walk=map.walkable[y][x]==='.';
    if(walk){
      r(px,py,16,16,sewer?'#88918a':'#c6bd91');r(px,py+15,16,1,sewer?'#626f70':'#a79d78');
      r(px+(y%2?7:0),py,1,15,sewer?'#76817e':'#b5ac84');
      if(!sewer&&map.terrain?.some(t=>x>=t.x&&x<t.x+t.w&&y>=t.y&&y<t.y+t.h))r(px,py,16,16,'#6e9b58');
    }else if(sewer){
      r(px,py,16,4,'#58676b');r(px+(y%2?8:0),py,1,16,'#26353b');
      if(map.walkable[y+1]?.[x]==='.') {r(px,py+4,16,9,'#68777a');r(px,py+13,16,3,'#22363d');}
    }else if(x<3||x>28||y<3){
      // Tall city backs frame this courtyard; no building face occupies a walking tile.
      r(px,py,16,16,'#697b83');r(px,py+14,16,2,'#435660');
      if(y%3!==2){r(px+4,py+3,8,8,'#334c5c');r(px+5,py+4,6,3,'#8da9ae');}
      r(px,py,2,16,'#93a09e');
    }else if(y>32){
      r(px,py,16,16,'#b4b3a0');r(px,py+11,16,5,'#747f76');
      r(px,py+3,16,2,'#d1cbb1');r(px+7,py+5,1,6,'#929d8a');
    }else{
      r(px+6,py+8,4,8,'#6b6550');r(px+2,py+1,12,11,'#426e4b');r(px+4,py,8,5,'#638956');
      if(map.walkable[y+1]?.[x]==='.')r(px,py+14,16,2,'#8b9271');
    }
  }
  if(sewer){
    // Recessed dry drains occupy blocked cells beside the maintenance walkways.
    // This is the project's fixed dry layout, not a seasonal Surf state.
    const drain=(x:number,y:number,horizontal:boolean)=>{
      if(map.walkable[y]?.[x]!=='#'||map.props.some(p=>p.x===x&&p.y===y))return;
      const px=x*16,py=y*16;
      r(px,py,16,16,'#253a40');
      r(px+2,py+2,12,12,'#52635b');
      if(horizontal){r(px,py,16,2,'#b0b29c');r(px,py+14,16,2,'#687b77');r(px+4,py+8,7,1,'#778478');}
      else{r(px,py,2,16,'#687b77');r(px+14,py,2,16,'#b0b29c');r(px+8,py+4,1,7,'#778478');}
    };
    for(let x=4;x<=45;x++)drain(x,26,true);
    for(let y=4;y<=25;y++)drain(4,y,false);
    // Grated inlet at the side room; its narrow bars do not suggest a doorway.
    if(map.walkable[14]?.[30]==='#'){
      r(30*16,14*16,16,32,'#263b42');
      for(let bar=2;bar<16;bar+=4)r(30*16+bar,14*16+2,2,28,'#8c9b91');
      r(30*16,14*16,16,2,'#b0b29c');r(30*16,16*16-2,16,2,'#687b77');
    }
  }
  if(!sewer){
    // A distinct mature tree in the blocked central island, clear of both circulation loops.
    r(11*16+4,23*16,8,28,'#76644b');r(11*16+7,23*16,3,28,'#ad9170');
    r(10*16,21*16,44,28,'#365f49');r(10*16+4,20*16+7,36,25,'#56824f');
    r(10*16+10,20*16+5,22,9,'#83a361');
  }
  if(sewer)for(let x=12;x<43;x+=5){r(x*16,20*16,48,4,'#607e79');r(x*16+2,20*16-2,3,8,'#a0aaa0');}
  for(const warp of map.warps){
    const x=warp.x*16,y=warp.y*16;r(x,y,16,16,'#344649');
    for(let step=0;step<4;step++)r(x+2,y+2+step*3,12,2,'#bac0a7');
  }
  for(const prop of map.props){const x=prop.x*16,y=prop.y*16;r(x+6,y+8,3,8,'#66533e');r(x+1,y+2,14,8,'#ded1a1');r(x+4,y+5,8,1,'#61735d');}
  return true;
}

export function paintCasteliaSewerEntrance(c:CanvasRenderingContext2D){
  c.fillStyle='#35474d';c.fillRect(59*16,48*16,16,16);
  for(let i=0;i<4;i++){c.fillStyle='#b4b8aa';c.fillRect(59*16+2,48*16+2+i*3,12,2);}
  c.fillStyle='#d4c598';c.fillRect(59*16+1,47*16+3,14,8);
  c.fillStyle='#5c684f';c.fillRect(59*16+6,47*16+5,3,5);
}
