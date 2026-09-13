import type {GameMap} from './types';
import {JOHTO_MT_MORTAR_1F} from './johto-route-42';

/** Replace selected generic wall tiles, never floor or event footprints. */
export function mortarLandmarkLayers(c:CanvasRenderingContext2D,map:GameMap):{depth:number;draw:()=>void}[]{
  if(map.id!==JOHTO_MT_MORTAR_1F)return [];
  const patches=[
    {x:47,y:17,w:1,h:5,kind:'split'},
    {x:22,y:11,w:6,h:1,kind:'shelf'},
    {x:8,y:18,w:1,h:6,kind:'rubble'},
    {x:19,y:42,w:5,h:1,kind:'ledge'},
  ];
  return [{depth:-1,draw:()=>{c.save();
    for(const patch of patches)for(let y=patch.y;y<patch.y+patch.h;y++)for(let x=patch.x;x<patch.x+patch.w;x++){
      if(map.walkable[y]?.[x]!=='#'||map.props.some(p=>p.x===x&&p.y===y)||map.warps.some(p=>p.x===x&&p.y===y))continue;
      const px=x*16,py=y*16;c.save();c.beginPath();c.rect(px,py,16,16);c.clip();
      c.fillStyle='#43535a';c.fillRect(px,py,16,16);
      if(patch.kind==='split'){
        c.fillStyle='#79847f';c.fillRect(px+2,py,14,16);c.fillStyle='#a9afa0';c.fillRect(px+2,py,2,16);
        c.fillStyle='#35464e';c.fillRect(px+7+(y%2),py,3,9);c.fillRect(px+10,py+8,3,8);c.fillStyle='#66766f';c.fillRect(px+12,py+2,4,4);
      }else if(patch.kind==='shelf'){
        c.fillStyle='#9c9e86';c.fillRect(px,py,16,5);c.fillStyle='#c2bea0';c.fillRect(px,py+4,16,2);
        c.fillStyle='#788575';c.fillRect(px,py+6,16,8);c.fillStyle='#4d655c';c.fillRect(px+5+(x%2)*3,py+7,2,7);c.fillRect(px,py+14,16,2);
      }else if(patch.kind==='rubble'){
        c.fillStyle='#6d7c71';c.fillRect(px,py,14,16);c.fillStyle='#9caa91';c.fillRect(px+13,py,2,16);
        for(const [dx,dy,w,h] of [[1,2,7,6],[5,9,7,5],[9,1,4,6]]){c.fillStyle='#344b50';c.fillRect(px+dx,py+dy+1,w,h);c.fillStyle='#a0a68e';c.fillRect(px+dx,py+dy,w-1,2);c.fillStyle='#7b8a77';c.fillRect(px+dx,py+dy+2,w-1,h-2);}
      }else{
        c.fillStyle='#b4ae91';c.fillRect(px,py,16,3);c.fillStyle='#86947e';c.fillRect(px,py+3,16,6);
        c.fillStyle='#536b61';c.fillRect(px,py+9,16,7);c.fillStyle='#758c74';c.fillRect(px+3,py+11,9,2);c.fillStyle='#374f50';c.fillRect(px+(x%3)*4,py+4,2,5);
      }
      c.restore();
    }c.restore();
  }}];
}
