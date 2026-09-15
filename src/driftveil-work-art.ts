import type { GameMap,SaveData } from './types';
import { DRIFTVEIL_NEXUS as F } from './driftveil-nexus';

/** Work results remain on their existing interaction tiles, clear of the street. */
export function driftveilWorkLayers(c:CanvasRenderingContext2D,map:GameMap,flags:SaveData['flags']){
  if(map.id!=='tour_driftveil')return [];
  return map.props.filter(p=>(p.dialogue==='tourOutdoor7'&&flags[F.sorted])||(p.dialogue==='tourOutdoor9'&&flags[F.rested]))
    .filter(p=>map.walkable[p.y]?.[p.x]==='#')
    // Large facilities expose many interaction cells; show one work set per site.
    .filter((p,index,sites)=>sites.findIndex(site=>site.dialogue===p.dialogue)===index)
    .map(p=>({depth:p.y+.8,draw:()=>{
      const x=p.x*16,y=p.y*16;c.save();
      if(p.dialogue==='tourOutdoor7'){
        for(let i=0;i<3;i++){
          c.fillStyle='#69503b';c.fillRect(x+1+i*5,y+6,4,8);
          c.fillStyle=['#85a166','#a4a9a1','#dbc796'][i];c.fillRect(x+1+i*5,y+5,4,4);
          c.fillStyle='#c6a66f';c.fillRect(x+1+i*5,y+11,4,1);
        }
      }else{
        c.fillStyle='#536567';c.fillRect(x+2,y+8,12,6);
        c.fillStyle='#b5c6bb';c.fillRect(x+1,y+7,14,4);
        c.fillStyle='#6ca6b2';c.fillRect(x+3,y+8,10,2);
        c.fillStyle='#d0e3d6';c.fillRect(x+4,y+8,4,1);
      }
      c.restore();
    }}));
}
