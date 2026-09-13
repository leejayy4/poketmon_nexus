import type { ExpandedTown } from './explore-expansion';
import type { GameMap } from './types';
import type { TourOutdoors } from './explore-outdoors';
import type { TourBuilding,TourFeature } from './explore-world';
export const ICIRRUS_CITY_SIZE={width:48,height:44};
export const ICIRRUS_POND_BANK={x:26,y:4,w:3,h:11} as const;
export function installIcirrusWindmillBoard(map:GameMap,outdoors:TourOutdoors){
  const relief=map.props.filter(p=>p.dialogue==='tourOutdoor3');
  const board=relief.find(p=>map.walkable[p.y+1]?.[p.x]==='.')??relief[0];
  if(board)map.props=map.props.filter(p=>p.dialogue!=='tourOutdoor3'||p===board);
  const object=outdoors.objects.find(o=>o.event==='tourOutdoor3');
  if(object&&board)object.cells=[{x:board.x,y:board.y}];
}
export function openIcirrusPondBank(map:GameMap){
  const rows=map.walkable.map(row=>row.split('')),r=ICIRRUS_POND_BANK;
  for(let y=r.y;y<r.y+r.h;y++)for(let x=r.x;x<r.x+r.w;x++){
    if(map.props.some(p=>p.x===x&&p.y===y)||map.npcs.some(n=>n.x===x&&n.y===y))continue;
    rows[y][x]='.';
  }
  map.walkable=rows.map(row=>row.join(''));
}
export const ICIRRUS_YARD_AISLES=[{x:10,y:16,w:2,h:7},{x:10,y:19,w:7,h:1}] as const;
export const ICIRRUS_LOOKOUT_SIGN={x:35,y:19} as const;
export const ICIRRUS_LOOKOUT_ACCESS=[{x:35,y:21,w:2,h:4},{x:32,y:20,w:7,h:2}] as const;
export function openIcirrusLookout(map:GameMap,outdoors:TourOutdoors){
  // Investigate the direction board from the landing, not the entire rock perimeter.
  map.props=map.props.filter(p=>p.dialogue!=='tourOutdoor2');
  const object=outdoors.objects.find(o=>o.event==='tourOutdoor2');
  if(object){
    object.cells=[{...ICIRRUS_LOOKOUT_SIGN}];
    map.props.push({...ICIRRUS_LOOKOUT_SIGN,dialogue:object.event});
  }
  const rows=map.walkable.map(row=>row.split(''));
  for(const r of ICIRRUS_LOOKOUT_ACCESS)for(let y=r.y;y<r.y+r.h;y++)for(let x=r.x;x<r.x+r.w;x++){
    if(map.props.some(p=>p.x===x&&p.y===y)||map.npcs.some(n=>n.x===x&&n.y===y))continue;
    rows[y][x]='.';
  }
  map.walkable=rows.map(row=>row.join(''));
}
export function openIcirrusYard(map:GameMap,outdoors:TourOutdoors){
  const inAisle=(p:{x:number;y:number})=>ICIRRUS_YARD_AISLES.some(r=>p.x>=r.x&&p.x<r.x+r.w&&p.y>=r.y&&p.y<r.y+r.h);
  // Perimeter investigations must not remain as invisible plugs at the entrances.
  map.props=map.props.filter(p=>p.dialogue!=='tourOutdoor1'||!inAisle(p));
  const yard=outdoors.objects.find(object=>object.event==='tourOutdoor1');
  if(yard)yard.cells=yard.cells.filter(p=>!inAisle(p));
  const rows=map.walkable.map(row=>row.split(''));
  for(const r of ICIRRUS_YARD_AISLES)for(let y=r.y;y<r.y+r.h;y++)for(let x=r.x;x<r.x+r.w;x++){
    if(map.props.some(p=>p.x===x&&p.y===y)||map.npcs.some(n=>n.x===x&&n.y===y))continue;
    rows[y][x]='.';
  }
  map.walkable=rows.map(row=>row.join(''));
}
export function icirrusPlan():ExpandedTown{
  const buildings:TourBuilding[]=[
    {kind:'center',x:6,y:6,w:7,h:3,door:{x:9,y:8},room:'tour_icirrus_center'},
    {kind:'landmark',x:31,y:5,w:11,h:5,door:{x:36,y:9},room:'tour_icirrus_hall'},
    {kind:'house',x:7,y:28,w:6,h:3,door:{x:10,y:30}},
    {kind:'house',x:18,y:29,w:6,h:3,door:{x:21,y:31}},
    {kind:'house',x:31,y:29,w:6,h:3,door:{x:34,y:31}},
  ];
  const features:TourFeature[]=[
    {x:17,y:5,w:9,h:8,kind:'water',name:'도시 빗물 연못',description:'습지에서 흘러온 물을 모아 보행로와 생활 구역을 나눈다.'},
    {x:5,y:16,w:12,h:7,kind:'garden',name:'습지 생활 뜰',description:'젖은 장화와 포켓몬의 발을 씻고 쉬는 생활 공간이다.'},
    {x:29,y:16,w:13,h:7,kind:'rocks',name:'용나선탑 전망 둔덕',description:'북쪽 용나선탑 방향을 바라보는 마른 높은 자리다.'},
    {x:31,y:34,w:11,h:6,kind:'statue',name:'남쪽 풍차와 귀환 안내판',description:'습지 바람을 받는 풍차 옆 작은 안내판에 설화시티·8번도로·튜브라인브리지·9번도로·쌍용시티가 적혀 있다. 출구는 이곳이 아니라 도시 동쪽 마른 길 끝에 있다. 8번도로 북쪽은 설화의 습지, 설화 북문은 용나선탑 접근로다.'},
  ];
  return {...ICIRRUS_CITY_SIZE,style:'heritage',buildings,features,paths:[[2,11,44,5],[21,3,6,39],[2,24,44,5],[2,36,44,5],[8,8,18,5],[25,8,13,5],[9,29,17,5],[25,30,12,5]],boardwalks:[]};
}

/** Restore authored access paths after coarse feature rectangles on the minimap. */
export function paintIcirrusMinimapAccess(c:CanvasRenderingContext2D,map:GameMap,ox:number,oy:number,scale:number){
  if(map.id!=='tour_icirrus')return;
  c.save();c.fillStyle='#d4d6b0';
  for(const area of [ICIRRUS_POND_BANK,...ICIRRUS_YARD_AISLES,...ICIRRUS_LOOKOUT_ACCESS]){
    for(let y=area.y;y<area.y+area.h;y++)for(let x=area.x;x<area.x+area.w;x++){
      if(map.walkable[y]?.[x]!=='.')continue;
      const left=Math.round(ox+x*scale),top=Math.round(oy+y*scale);
      c.fillRect(left,top,Math.round(ox+(x+1)*scale)-left,Math.round(oy+(y+1)*scale)-top);
    }
  }
  c.restore();
}

