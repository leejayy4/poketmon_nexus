import type { GameMap } from './types';
import type { GroveTree } from './explore-tree-art';

export const FOREST_BORDER_MAPS = new Set(['tour_eterna_forest','tour_viridian_forest','tour_ilex']);
export const isForestBorder = (map:GameMap,x:number,y:number) => FOREST_BORDER_MAPS.has(map.id) && (x<2||x>=map.width-2||y<3||y>=map.height-2) && map.walkable[y]?.[x]==='#';

// Complete native-size trees on the existing blocked perimeter. Exit tiles are
// excluded from both the two-tile trunk footprint and the raised canopy.
export function forestBorderTrees(map:GameMap):GroveTree[]{
  if(!FOREST_BORDER_MAPS.has(map.id))return [];
  const trees:GroveTree[]=[],seen=new Set<string>();
  const add=(x:number,y:number)=>{
    if(seen.has(`${x},${y}`))return;
    for(let j=y;j<y+2;j++)for(let i=x;i<x+2;i++)if(!isForestBorder(map,i,j))return;
    if(map.warps.some(w=>w.x>=x&&w.x<x+2&&w.y>=y-1&&w.y<y+2))return;
    trees.push({x:x*16,y:y*16-16,depth:y+1.5});seen.add(`${x},${y}`);
  };
  // Fill each uninterrupted run; overlap its final tree when the run is odd.
  const row=(y:number)=>{
    let start=0;
    for(let x=0;x<=map.width;x++){
      const blocked=isForestBorder(map,x,y)&&isForestBorder(map,x,y+1);
      if(blocked)continue;
      for(let i=start;i+1<x;i+=2)add(i,y);
      if((x-start)%2===1&&x-start>=3)add(x-2,y);
      start=x+1;
    }
  };
  row(1);row(map.height-2);
  for(const x of [0,map.width-2])for(let y=3;y<map.height-3;y+=2)add(x,y);
  return trees;
}

export function paintForestBorderGround(c:CanvasRenderingContext2D,x:number,y:number){
  c.fillStyle='#54784d';c.fillRect(x*16,y*16,16,16);
  c.fillStyle='#638353';c.fillRect(x*16+2,y*16+12,4,2);c.fillRect(x*16+10,y*16+5,3,2);
}
