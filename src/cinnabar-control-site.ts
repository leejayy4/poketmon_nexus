import type { GameMap } from './types';
import type { Furnishing,TourInterior } from './explore-interiors';

export const CINNABAR_CONTROL_SITE='tour_cinnabar_control_site' as const;
export const CINNABAR_SITE_ARRIVAL='tourCinnabarSiteArrival';
export const CINNABAR_SITE_PROTECTION='tourCinnabarSiteProtection';
export const CINNABAR_SITE_EVACUATION='tourCinnabarSiteEvacuation';
export const CINNABAR_SITE_ACCESS={x:43,y:2,w:3,h:10};
const object=(kind:Furnishing['kind'],name:string,event:string,x:number,y:number,w:number,h:number,pages:string[]):Furnishing=>({kind,name,event,x,y,w,h,pages});

export function installCinnabarControlSite(maps:Record<string,GameMap>,rooms:Record<string,TourInterior>){
  const town=maps.tour_cinnabar;if(!town||maps[CINNABAR_CONTROL_SITE])return;
  const objects:Furnishing[]=[
    object('workbench','반입 기록대','tourCinnabarSiteManifest',7,39,6,2,['실프에서 보존한 원본과 같은 반입 표식이다. 보호 장치와 제어 장비를 따로 실어 왔다.']),
    object('chart','현장 구역도','tourCinnabarSitePlan',25,39,5,2,['남쪽 반입 로비와 귀환문, 중앙 보호 구역, 북쪽 제어실, 동쪽 대피 통로가 그려져 있다.']),
    object('machine','보호 전원 장치',CINNABAR_SITE_PROTECTION,10,25,4,3,['보호 장치의 전원 표시가 켜져 있다. 연결선은 포켓몬이 기다리는 자리로 이어진다.']),
    object('tank','보호 장치 덮개','tourCinnabarSiteShelter',14,21,3,2,['투명한 덮개 아래로 따뜻한 공기가 흐른다. 옆에서 포켓몬들이 움직임을 기다린다.']),
    object('machine','제어 신호 단말','tourCinnabarSiteControl',25,8,5,3,['보호 전원과 다른 선이 북쪽 단말에 연결돼 있다. 신호 표시가 계속 깜빡인다.']),
    object('machine','닫힌 북쪽 서비스 문','tourCinnabarSiteServiceDoor',20,18,3,1,['책임자가 지나간 뒤 안쪽에서 잠긴 서비스 문이다. 문 아래에 먼지가 길게 밀려 있다.','사람을 쫓는 동안 보호 장치 곁의 포켓몬을 혼자 둘 수는 없다.']),
    object('chart','동쪽 대피로 확인대',CINNABAR_SITE_EVACUATION,32,26,3,2,['동쪽 통로는 남쪽 반입 로비에 합류한다. 운반대가 지날 폭과 포켓몬이 쉴 자리를 먼저 살펴야 한다.']),
    object('bench','대피 대기 운반대','tourCinnabarSiteStretcher',32,35,4,2,['포켓몬이 누울 낮은 운반대다. 아직 아무도 옮겨지지 않았다.']),
    object('shelf','반입 장비 선반','tourCinnabarSiteCrates',4,31,9,3,['보호 장치용 부품과 제어 장비 상자를 분리해 두었다.']),
    object('shelf','제어실 부품 선반','tourCinnabarSiteControlShelf',4,5,9,3,['동작 신호를 연결하는 부품이다. 보호 전원을 대신 공급하는 장치는 아니다.']),
  ];
  const rows=Array.from({length:48},(_,y)=>Array.from({length:40},(_,x)=>x>=2&&x<=37&&y>=3&&y<=45?'.':'#'));
  // Room partitions leave wide, unconditional circulation around both ends.
  for(const [x,y,w,h] of [[14,31,15,2],[12,17,18,2],[29,20,2,18]])for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)rows[j][i]='#';
  const props:GameMap['props']=[];
  for(const o of objects)for(let y=o.y;y<o.y+o.h;y++)for(let x=o.x;x<o.x+o.w;x++){rows[y][x]='#';props.push({x,y,dialogue:o.event});}
  rows[46][20]='.';rows[47][20]='.';
  maps[CINNABAR_CONTROL_SITE]={id:CINNABAR_CONTROL_SITE,name:'홍련 보호·제어 현장',width:40,height:48,background:'lab',walkable:rows.map(r=>r.join('')),props,
    npcs:[
      {id:'cinnabarSiteYujin',name:'유진',sprite:'school_kid_m',x:20,y:25,facing:'down',dialogue:CINNABAR_SITE_ARRIVAL},
      {id:'cinnabarControlGuard',name:'제어실 경비',sprite:'worker',x:24,y:12,facing:'down',dialogue:'tourCinnabarControlGuard'},
      {id:'cinnabarSitePikachu',name:'보호 장치 곁의 피카츄',sprite:'field-pikachu',x:18,y:23,facing:'right',dialogue:'tourCinnabarSitePokemon'},
      {id:'cinnabarSiteMachop',name:'대피를 기다리는 알통몬',sprite:'field-machop',x:23,y:23,facing:'left',dialogue:'tourCinnabarSitePokemon'},
    ],warps:[{x:20,y:47,to:'tour_cinnabar',spawn:{x:44,y:3},entry:'down',facing:'down'}]};
  rooms[CINNABAR_CONTROL_SITE]={style:'lab',title:'홍련 보호·제어 현장',host:{x:20,y:25},objects,greeting:['반입 로비 너머로 보호 장치의 불빛이 보인다.']};
  const outer=town.walkable.map(r=>r.split(''));
  const a=CINNABAR_SITE_ACCESS;
  for(let y=a.y;y<a.y+a.h;y++)for(let x=a.x;x<a.x+a.w;x++)outer[y][x]='.';
  outer[1][44]='.';town.walkable=outer.map(r=>r.join(''));
  town.warps.push({x:44,y:1,to:CINNABAR_CONTROL_SITE,spawn:{x:20,y:44},entry:'up',facing:'up',requiresFlag:'nexusSilphRecordsSecured'});
}

/** Draw after the common indoor floor; fixtures and actors keep their shared renderer. */
export function paintCinnabarControlFloor(c:CanvasRenderingContext2D,map:GameMap){
  if(map.id!==CINNABAR_CONTROL_SITE)return;
  c.save();
  for(let y=3;y<46;y++)for(let x=2;x<38;x++){
    if(map.walkable[y]?.[x]!=='.')continue;
    c.fillStyle=y>38?'#ae9575':x>30?'#91b8a1':y<17?'#8ba0b5':'#b7ba9c';
    c.fillRect(x*16+1,y*16+14,14,2);
    if(x===33&&y>=20&&y<=42){c.fillStyle='#dce6bb';c.fillRect(x*16+7,y*16+1,2,12);}
  }
  // Protection and signal cables end at their own hardware; they never imply a powered-off result.
  c.strokeStyle='#82c8aa';c.lineWidth=3;c.beginPath();c.moveTo(12*16,28*16);c.lineTo(16*16,28*16);c.lineTo(16*16,23*16);c.stroke();
  c.strokeStyle='#bd8eaf';c.beginPath();c.moveTo(27*16,11*16);c.lineTo(27*16,16*16);c.stroke();
  c.fillStyle='#394b53';c.fillRect(20*16,18*16-15,48,31);
  for(let y=0;y<5;y++){c.fillStyle=y%2?'#809096':'#a9b0ac';c.fillRect(20*16+3,18*16-12+y*5,42,3);}
  c.restore();
}

/** Keep the sealed service shutter distinct from the common machine illustration. */
export function paintCinnabarSiteFurnishing(c:CanvasRenderingContext2D,o:Furnishing):boolean{
  if(o.event!=='tourCinnabarSiteServiceDoor')return false;
  const x=o.x*16,y=o.y*16-15,w=o.w*16;
  c.save();c.fillStyle='#394b53';c.fillRect(x,y,w,31);
  for(let row=0;row<5;row++){c.fillStyle=row%2?'#809096':'#a9b0ac';c.fillRect(x+3,y+3+row*5,w-6,3);}
  c.fillStyle='#c59b74';c.fillRect(x+w/2-4,y+15,8,7);c.restore();return true;
}

/** Called by the existing Cinnabar landing overlay after outdoor scenery. */
export function paintCinnabarSiteEntrance(c:CanvasRenderingContext2D,map:GameMap){
  if(map.id!=='tour_cinnabar')return;
  c.save();const a=CINNABAR_SITE_ACCESS;
  for(let y=a.y;y<a.y+a.h;y++)for(let x=a.x;x<a.x+a.w;x++)if(map.walkable[y]?.[x]==='.'){
    c.fillStyle='#b9aaa0';c.fillRect(x*16,y*16,16,16);c.fillStyle='#ded2bc';c.fillRect(x*16+1,y*16+1,14,1);
  }
  c.fillStyle='#424e53';c.fillRect(43*16,0,48,30);c.fillStyle='#968d81';c.fillRect(43*16+2,2,44,26);
  c.fillStyle='#344b55';c.fillRect(44*16,8,16,24);c.fillStyle='#b5c8be';c.fillRect(44*16+3,11,10,20);c.fillStyle='#d8b974';c.fillRect(44*16+10,22,2,3);
  c.restore();
}
