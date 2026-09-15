import type { GameMap,SaveData } from './types';
import { MISTRALTON_NEXUS as F } from './mistralton-nexus';

/** Show the chosen cargo order and companion water on existing blocked feature cells. */
export function mistraltonWorkLayers(c:CanvasRenderingContext2D,map:GameMap,flags:SaveData['flags']){
  if(map.id!=='tour_mistralton')return [];
  return map.props.filter(p=>(p.dialogue==='tourOutdoor3'&&flags[F.loaded])||(p.dialogue==='tourOutdoor4'&&flags[F.rested]))
    .filter(p=>map.walkable[p.y]?.[p.x]==='#').filter((p,i,all)=>all.findIndex(q=>q.dialogue===p.dialogue)===i)
    .map(p=>({depth:p.y+.8,draw:()=>{const x=p.x*16,y=p.y*16;c.save();
      if(p.dialogue==='tourOutdoor3'){
        const mineral=flags[F.kind]===1;for(let i=0;i<2;i++){const left=x+1+i*8;c.fillStyle='#675647';c.fillRect(left,y+5,7,9);c.fillStyle=(i===0)===mineral?'#71a9b2':'#91ad68';c.fillRect(left+1,y+6,5,5);c.fillStyle='#d8c596';c.fillRect(left,y+11,7,2);}
      }else{c.fillStyle='#637275';c.fillRect(x+1,y+8,14,6);c.fillStyle='#c2d4ca';c.fillRect(x,y+7,16,4);c.fillStyle='#6faec0';c.fillRect(x+2,y+8,12,2);}
      c.restore();}}));
}
