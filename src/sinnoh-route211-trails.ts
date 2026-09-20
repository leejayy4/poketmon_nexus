import type { GameMap } from './types';

type Trail=readonly [x:number,y:number,width:number,height:number];
// Additive trails: retain every formerly valid position and the existing east-west road.
const west:readonly Trail[]=[
  [8,6,2,6], [8,6,16,2], // north spur circles the foothill and rejoins the central rise
  [24,18,16,2], [38,14,2,6], // south spur rejoins beyond the optional trainer
];
const east:readonly Trail[]=[
  [28,6,16,2], [42,6,2,8], // higher approach above the trainer's clearing
  [10,15,2,8], [10,21,18,2], // lower stone shelf returns to the central footpath
];

/** Preserve old floors and entities; optional habitats leave a dry lane alongside. */
export function openRoute211Trails(map:GameMap,side:'west'|'east'){
  const rows=map.walkable.map(row=>row.split(''));
  for(const [x,y,w,h] of side==='west'?west:east){
    for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)rows[j][i]='.';
  }
  map.walkable=rows.map(row=>row.join(''));
  const habitats=side==='west'
    ?[{x:12,y:6,w:6,h:1},{x:28,y:18,w:7,h:1}]
    :[{x:32,y:6,w:7,h:1},{x:15,y:21,w:7,h:1}];
  // The adjacent row of each two-tile trail remains a dry return lane. Neither
  // patch touches the five-tile east-west main road or a warp/NPC/prop cell.
  // Regional MAP_POOLS bindings supply the supported Pt-derived encounter subsets.
  for(const habitat of habitats)if(!map.terrain?.some(t=>t.kind==='tallGrass'&&t.x===habitat.x&&t.y===habitat.y))
    (map.terrain??=[]).push({kind:'tallGrass',...habitat});
}

export function isRoute211SideTrail(map:GameMap,x:number,y:number){
  const mid=Math.floor(map.height/2);
  return (map.id==='tour_sinnoh_route_211_west'||map.id==='tour_sinnoh_route_211_east')
    &&map.walkable[y]?.[x]==='.'&&(y<mid-2||y>mid+2);
}

/** Optional rock shelves connect the existing survey points to the central aisle.
 * Keep every existing floor cell: old saves and the direct crossing remain valid.
 */
const surveyTrails:readonly Trail[]=[[18,18,9,2],[18,18,2,6],[37,25,2,9],[30,32,9,2]];
export function isCoronet211SurveyTrail(map:GameMap,x:number,y:number){
  return map.id==='tour_coronet_211_pass'&&map.walkable[y]?.[x]==='.'
    &&surveyTrails.some(([ax,ay,w,h])=>x>=ax&&x<ax+w&&y>=ay&&y<ay+h);
}
export function openCoronet211SurveyTrails(map:GameMap){
  const rows=map.walkable.map(row=>row.split(''));
  for(const [x,y,w,h] of surveyTrails)for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)rows[j][i]='.';
  map.walkable=rows.map(row=>row.join(''));
}
