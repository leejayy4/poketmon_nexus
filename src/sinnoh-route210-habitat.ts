import type { GameMap } from './types';

/** Project reconstruction within the existing Route 210 north footprint.
 * Two mouths join the safe road; entering the grass is always a choice.
 * Additive carving keeps every previously valid save position walkable.
 */
export function openRoute210Habitat(map:GameMap){
  const rows=map.walkable.map(row=>row.split(''));
  const areas=[
    [39,33,10,3], // upper fork beneath the existing northern cliff
    [46,33,3,12], // dry outer rim
    [39,42,10,3], // return toward the existing trainer clearing
    [42,36,4,6], // habitat, accessible from either end and the dry rim
  ] as const;
  for(const [x,y,w,h] of areas)
    for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)rows[j][i]='.';
  map.walkable=rows.map(row=>row.join(''));
  // The existing map pool supplies Meditite/Machop and the capture origin.
  // Both the field grass renderer and minimap consume this same rectangle.
  map.terrain.push({kind:'tallGrass',x:42,y:36,w:4,h:6});
}
