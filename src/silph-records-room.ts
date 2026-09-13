import type { GameMap,Point } from './types';
import type { Furnishing,TourInterior } from './explore-interiors';

export const SILPH_RECORDS_MAP='tour_saffron_records' as const;
export const SILPH_RECORDS_ENTRY={x:25,y:2};
const fixture=(kind:Furnishing['kind'],name:string,event:string,x:number,y:number,w:number,h:number,pages:string[]):Furnishing=>({kind,name,event,x,y,w,h,pages});

/** Nexus archive annex, not a reconstruction of an original Silph floor. */
export function installSilphRecordsRoom(maps:Record<string,GameMap>,rooms:Record<string,TourInterior>,spawns:Record<string,Point>){
  const publicMap=maps.tour_saffron_hall_2f;
  if(!publicMap||maps[SILPH_RECORDS_MAP])return;
  const objects:Furnishing[]=[
    fixture('chart','기록실 안내','tourSilphRecordsIndex',23,33,5,2,['남쪽 문은 실프 공개 2층으로 돌아간다.','서가 끝을 돌아 북쪽 보관 구역으로 간다. 양옆 열람길은 같은 보관 구역에 합류한다.']),
    fixture('shelf','생활 설비 분류 서가','tourSilphRecordsShelfA',8,27,20,3,['급수·조명·보호 장치의 기록을 나눠 보관했다.','서가 양 끝으로 열람길이 이어진다.']),
    fixture('shelf','반입 구역 분류 서가','tourSilphRecordsShelfB',12,19,20,3,['대피 구역과 제어 구역의 반입 분류가 서로 다른 칸에 적혀 있다.','공개 사본과 대조할 원본은 북쪽 보관 구역에 있다.']),
    fixture('shelf','장치 운용 분류 서가','tourSilphRecordsShelfC',8,11,20,3,['보호 장치의 운용 기록과 제어 배선 기록을 별도로 분류했다.']),
    fixture('chart','보호선 안내','tourSilphRecordsWiring',3,16,3,2,['대피 중인 포켓몬의 보호 장치에 전원을 공급하는 선이다.']),
    fixture('console','제어선 운용 기록','tourSilphRecordsControl',34,16,3,2,['장치의 동작을 외부 신호에 맞춰 제한하는 제어선의 운용 기록이다.']),
    fixture('workbench','원본 대조 작업대','tourSilphRecordsOriginalDesk',17,5,7,2,['반입 원본 보관함 옆에 두 자료를 펼칠 작업대가 있다.']),
    fixture('shelf','원본 보관 서가','tourSilphRecordsStorage',5,4,6,3,['반입 일자와 장치별 보관 번호가 붙어 있다. 원본은 보관 상태다.']),
    fixture('bench','동료 대기 자리','tourSilphRecordsRest',31,32,5,2,['서가 사이를 걷는 동료가 사람 곁에서 잠시 쉬는 자리다.','회복이 필요하면 남쪽 문으로 공개층에 돌아가 포켓몬센터를 이용하자.']),
  ];
  const rows=Array.from({length:40},(_,y)=>Array.from({length:40},(_,x)=>x>=2&&x<=37&&y>=3&&y<=37?'.':'#'));
  const props:GameMap['props']=[];
  for(const o of objects)for(let y=o.y;y<o.y+o.h;y++)for(let x=o.x;x<o.x+o.w;x++){rows[y][x]='#';props.push({x,y,dialogue:o.event});}
  rows[38][20]='.';rows[39][20]='.';
  maps[SILPH_RECORDS_MAP]={id:SILPH_RECORDS_MAP,name:'실프 비공개 기록실',width:40,height:40,background:'lab',walkable:rows.map(r=>r.join('')),props,npcs:[{id:'silph-records-guard',name:'기록실 경비',sprite:'worker',x:20,y:9,facing:'down',dialogue:'tourSilphRecordsGuard'}],warps:[{x:20,y:39,to:'tour_saffron_hall_2f',spawn:{x:25,y:4},entry:'down',facing:'down'}]};
  rooms[SILPH_RECORDS_MAP]={style:'lab',title:'실프 비공개 기록실',host:{x:20,y:35},objects,greeting:['서가 사이로 원본 보관 구역이 보인다.']};
  spawns[SILPH_RECORDS_MAP]={x:20,y:36};
  const publicRows=publicMap.walkable.map(row=>row.split(''));
  publicRows[2][25]='.';
  publicMap.walkable=publicRows.map(row=>row.join(''));
  publicMap.warps.push({...SILPH_RECORDS_ENTRY,to:SILPH_RECORDS_MAP,spawn:{x:20,y:36},entry:'up',facing:'up',requiresFlag:'nexusSilphDiscrepancyConfirmed'});
}

/** Overlay after the common room floor, before furniture and actors. */
export function paintSilphRecordsFloor(c:CanvasRenderingContext2D,map:GameMap){
  if(map.id==='tour_saffron_hall_2f'){
    c.save();c.fillStyle='#334c56';c.fillRect(25*16-2,16,20,32);c.fillStyle='#aac2ba';c.fillRect(25*16+2,20,12,26);c.fillStyle='#476977';c.fillRect(25*16+4,23,8,12);c.fillStyle='#e5cd82';c.fillRect(25*16+11,37,2,3);c.restore();return;
  }
  if(map.id!==SILPH_RECORDS_MAP)return;
  c.save();
  for(let y=3;y<38;y++)for(let x=2;x<38;x++){
    if(map.walkable[y]?.[x]!=='.')continue;
    c.fillStyle=y<9?'#b79b6d':y>31?'#86aea0':'#8b9fa7';
    c.fillRect(x*16+1,y*16+14,14,2);
    if((x===6||x===34)&&y>=9&&y<=31){c.fillStyle='#d9c786';c.fillRect(x*16+7,y*16,2,16);}
  }
  // Both shelf-end lanes return to the south lobby; no decorative false door.
  for(const x of [6,34])for(const y of [15,24,31]){
    c.fillStyle='#557c72';c.beginPath();c.moveTo(x*16+4,y*16+5);c.lineTo(x*16+12,y*16+5);c.lineTo(x*16+8,y*16+11);c.fill();
  }
  c.restore();
}
