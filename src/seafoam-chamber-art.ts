import type { GameMap } from './types';

/** Project reconstruction: relief follows collision, not an independent painted path. */
export function paintSeafoamChamberRelief(c:CanvasRenderingContext2D,map:GameMap){
  if(map.id!=='tour_kanto_seafoam_b1f'&&map.id!=='tour_kanto_seafoam_b2f'&&map.id!=='tour_kanto_seafoam_b3f'&&map.id!=='tour_kanto_seafoam_b4f')return;
  const floor=(x:number,y:number)=>map.walkable[y]?.[x]==='.';
  const occupied=new Set([...map.props,...map.warps].map(p=>`${p.x},${p.y}`));
  const rect=(x:number,y:number,w:number,h:number,color:string)=>{c.fillStyle=color;c.fillRect(x,y,w,h);};
  const iceFields=map.id==='tour_kanto_seafoam_b1f'
    ?[{x:7,y:16,w:7,h:8},{x:8,y:27,w:10,h:5},{x:21,y:20,w:3,h:4},{x:14,y:23,w:10,h:3}]
    :map.id==='tour_kanto_seafoam_b2f'
      ?[{x:7,y:17,w:7,h:9},{x:7,y:28,w:12,h:5},{x:34,y:24,w:8,h:7}]
      :map.id==='tour_kanto_seafoam_b3f'
        ?[{x:7,y:18,w:7,h:10},{x:7,y:30,w:12,h:5},{x:21,y:28,w:4,h:4},{x:34,y:25,w:8,h:7}]
        :[{x:9,y:22,w:12,h:4},{x:22,y:27,w:4,h:7},{x:25,y:34,w:16,h:4},{x:42,y:28,w:8,h:7}];
  const onIce=(x:number,y:number)=>iceFields.some(r=>x>=r.x&&x<r.x+r.w&&y>=r.y&&y<r.y+r.h);
  for(let y=1;y<map.height-1;y++)for(let x=1;x<map.width-1;x++){
    if(occupied.has(`${x},${y}`))continue;
    // The dynamic boulder painter owns its complete pocket, before and after pushing.
    if(map.id==='tour_kanto_seafoam_b2f'&&x>=15&&x<=17&&y>=20&&y<=22)continue;
    const px=x*16,py=y*16;
    if(floor(x,y)){
      // The base painter owns encounter stone. Small habitat traces sit over it,
      // so cave encounter ground remains distinct from the safe visual ice.
      if(map.terrain?.some(r=>x>=r.x&&x<r.x+r.w&&y>=r.y&&y<r.y+r.h)){
        if((x+y)%3===0){
          rect(px+3,py+9,4,2,'#b8d4d5');rect(px+2,py+11,6,2,'#6f96a5');
        }else if((x*2+y)%4===0){
          rect(px+9,py+4,4,2,'#30495e');rect(px+10,py+3,2,1,'#6e8793');
        }
        continue;
      }
      // HGSS-inspired floor fields give each stair-to-stair leg a readable cold landmark.
      // They are visual ground only: the project does not claim slippery movement here.
      if(onIce(x,y)){
        rect(px,py,16,16,(x+y)%2===0?'#b9d9da':'#aecfd2');
        rect(px+1,py+1,14,2,'#e6f1e9');
        if((x+2*y)%4===0){
          rect(px+3,py+9,7,1,'#789eab');rect(px+9,py+7,1,4,'#789eab');
          rect(px+10,py+6,3,1,'#dcebe6');
        }
      }
      if(!floor(x,y-1)&&!occupied.has(`${x},${y-1}`))rect(px,py,16,3,'#607c91');
      if(!floor(x-1,y)&&!occupied.has(`${x-1},${y}`))rect(px,py+3,2,13,'#7895a4');
      if(!floor(x+1,y)&&!occupied.has(`${x+1},${y}`))rect(px+14,py+3,2,13,'#d4e3df');
      // Fine, flush seams distinguish the broad chambers without implying ice sliding.
      if(floor(x-2,y)&&floor(x+2,y)&&floor(x,y-2)&&floor(x,y+2)&&(x+2*y)%7===0){
        rect(px+2,py+11,7,1,'#8ba5b0');rect(px+9,py+8,1,4,'#8ba5b0');
      }
      continue;
    }
    // Retain the enclosed B1F water instead of turning its bank into a rock wall.
    if(map.id==='tour_kanto_seafoam_b1f'&&x>=15&&x<=20&&y>=15&&y<=22)continue;
    if(floor(x,y+1)){
      rect(px,py,16,4,'#d4e8e5');rect(px,py+4,16,8,'#82a8bb');
      rect(px+3,py+5,2,7,'#b8d8df');rect(px+11,py+5,3,9,'#547c96');
      rect(px,py+14,16,2,'#2e4b65');
    }else if(floor(x-1,y)||floor(x+1,y)){
      const edge=floor(x-1,y)?0:12;
      rect(px+edge,py,4,16,'#a6cbd5');rect(px+edge+1,py+2,1,11,'#e0ede6');
    }else if(floor(x,y-1)){
      rect(px,py,16,3,'#d4e8e5');rect(px,py+3,16,3,'#65879e');
    }
  }
}
