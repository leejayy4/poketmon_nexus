import type { GameMap,Point } from './types';

const maps=new Set(['tour_sinnoh_route_211_west','tour_sinnoh_route_211_east','tour_coronet_211_pass','tour_celestic','tour_sinnoh_route_210_north']);
const events=new Set(['route211WestSign','route211EastSign','coronet211Sign','celesticSign','celesticEastSign','route210NorthSign','route210NorthFogSign']);

/** Field art and minimap both read the actual interaction props, never copied coordinates. */
export function celesticTravelMarkers(map:GameMap){
  return maps.has(map.id)?map.props.filter(p=>events.has(p.dialogue)):[];
}

export function minimapTravelMarkers(map:GameMap,registered:readonly Point[]):Point[]{
  const result:Point[]=[],seen=new Set<string>();
  for(const p of [...registered,...celesticTravelMarkers(map)]){
    const key=`${p.x},${p.y}`;
    if(seen.has(key))continue;
    seen.add(key);result.push({x:p.x,y:p.y});
  }
  return result;
}

/** Reconcile coarse landmark rectangles with actual traversable cells before
 * signs, navigation and exits are drawn. Restrict the correction to this slice. */
export function paintCelesticMinimapPaths(c:CanvasRenderingContext2D,map:GameMap,ox:number,oy:number,scale:number){
  if(!maps.has(map.id))return;
  c.save();
  for(let y=0;y<map.height;y++)for(let x=0;x<map.width;x++){
    if(map.walkable[y]?.[x]!=='.')continue;
    const grass=map.terrain?.some(t=>t.kind==='tallGrass'&&x>=t.x&&x<t.x+t.w&&y>=t.y&&y<t.y+t.h);
    c.fillStyle=grass?'#91b875':'#d4d6b0';
    // Shared rounded boundaries avoid spilling a path pixel into a blocked tile.
    const left=Math.round(ox+x*scale),top=Math.round(oy+y*scale);
    c.fillRect(left,top,Math.round(ox+(x+1)*scale)-left,Math.round(oy+(y+1)*scale)-top);
  }
  c.restore();
}
