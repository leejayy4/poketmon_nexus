import type { GameMap,Point } from './types';
import { TOUR_BUILDINGS,TOUR_FEATURES } from './explore-world';

/** Repairs the existing island footprint; every path pixel follows current collision. */
export function paintCinnabarTownApproaches(c:CanvasRenderingContext2D,map:GameMap){
  if(map.id!=='tour_cinnabar')return;
  const key=(p:Point)=>p.x+','+p.y;
  const habitat=(x:number,y:number)=>map.terrain?.some(r=>x>=r.x&&x<r.x+r.w&&y>=r.y&&y<r.y+r.h)??false;
  const buildings=TOUR_BUILDINGS[map.id]??[],features=TOUR_FEATURES[map.id]??[];
  const roof=(x:number,y:number)=>buildings.some(b=>x>=b.x-1&&x<=b.x+b.w&&y>=b.y-5&&y<=b.y+b.h-1);
  // Pavement follows permanent terrain, not temporary actor occupancy or reserved standing spots.
  const safe=(p:Point)=>map.walkable[p.y]?.[p.x]==='.'&&!habitat(p.x,p.y)&&!map.props.some(o=>o.x===p.x&&o.y===p.y);
  const approach=(to:string):Point|undefined=>{
    const warp=map.warps.find(w=>w.to===to);if(!warp)return;
    const delta=warp.entry==='up'?{x:0,y:1}:warp.entry==='down'?{x:0,y:-1}:warp.entry==='left'?{x:1,y:0}:{x:-1,y:0};
    return {x:warp.x+delta.x,y:warp.y+delta.y};
  };
  const painted=new Set<string>();
  const route=(start:Point|undefined,end:Point|undefined)=>{
    if(!start||!end||!safe(start)||!safe(end))return;
    const queue=[start],parents=new Map<string,Point|undefined>([[key(start),undefined]]);
    for(let i=0;i<queue.length;i++){
      const p=queue[i];if(key(p)===key(end))break;
      for(const [dx,dy] of [[0,-1],[1,0],[0,1],[-1,0]]){
        const next={x:p.x+dx,y:p.y+dy};if(!safe(next)||parents.has(key(next)))continue;
        parents.set(key(next),p);queue.push(next);
      }
    }
    if(!parents.has(key(end)))return;
    let p:Point|undefined=end;while(p){painted.add(key(p));p=parents.get(key(p));}
  };
  const dock={x:3,y:40},hub={x:14,y:12},site={x:44,y:3};
  route(dock,hub);
  for(const destination of ['tour_cinnabar_center','tour_cinnabar_mart','tour_cinnabar_home1','tour_cinnabar_home2','tour_cinnabar_hall'])route(hub,approach(destination));
  route(hub,site);route(hub,approach('tour_pass_pallet_cinnabar'));route(hub,approach('tour_pass_vermilion_cinnabar'));route(hub,approach('tour_kanto_route_20'));
  c.save();
  for(const k of painted){
    const [x,y]=k.split(',').map(Number);if(roof(x,y))continue;
    // Leave the authored dock/shore planks in place, but give their edge a stone curb.
    if(y>=38||x>=43&&y>=14){c.fillStyle='#cfbb97';c.fillRect(x*16+1,y*16+14,14,2);continue;}
    c.fillStyle='#a89989';c.fillRect(x*16,y*16,16,16);
    c.fillStyle='#d3c6ac';c.fillRect(x*16+1,y*16+1,14,5);c.fillRect(x*16+1,y*16+8,14,6);
    c.fillStyle='#796f68';c.fillRect(x*16+7,y*16+1,1,5);c.fillRect(x*16+((y%2)?4:11),y*16+8,1,6);
  }
  // Basalt rubble and sparse salt-tolerant growth belong only to already blocked margins.
  for(const [left,top,width,height] of [[30,2,4,7],[46,27,9,19],[16,35,3,4]]){
    for(let y=top;y<top+height;y++)for(let x=left;x<left+width;x++){
      if(map.walkable[y]?.[x]!=='#'||roof(x,y)||habitat(x,y)||map.props.some(p=>p.x===x&&p.y===y)||features.some(f=>x>=f.x&&x<f.x+f.w&&y>=f.y&&y<f.y+f.h))continue;
      c.fillStyle='#665c58';c.fillRect(x*16,y*16,16,16);
      c.fillStyle='#9b8170';c.fillRect(x*16+1,y*16+2,14,3);c.fillStyle='#463f40';c.fillRect(x*16+2,y*16+11,12,4);
      c.fillStyle='#b0957b';c.fillRect(x*16+3,y*16+6,8,2);
      if((x+2*y)%4===0){c.fillStyle='#667b65';c.fillRect(x*16+7,y*16+5,2,6);c.fillRect(x*16+4,y*16+7,7,2);}
    }
  }
  // Exposed south/east water edges retain actual coast geometry; never spread water onto paths.
  for(const water of features.filter(f=>f.kind==='water'&&f.y>=17)){
    for(let y=water.y;y<water.y+water.h;y++)for(let x=water.x;x<water.x+water.w;x++){
      if(map.walkable[y]?.[x]!=='#'||map.props.some(p=>p.x===x&&p.y===y))continue;
      const edges=[[0,-1,0,0,16,2],[0,1,0,14,16,2],[-1,0,0,0,2,16],[1,0,14,0,2,16]];
      for(const [dx,dy,ox,oy,w,h] of edges)if(map.walkable[y+dy]?.[x+dx]==='.'){
        c.fillStyle='#b3c8bc';c.fillRect(x*16+ox,y*16+oy,w,h);
      }
    }
  }
  c.restore();
}
