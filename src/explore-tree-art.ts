import type { TourFeature } from './explore-world';

// A complete Platinum tree, including its trunk, from the existing Sandgem sheet.
export const GROVE_TREE_SAMPLE = { x:24, y:88, w:32, h:48 };
const outline = [
  [14,1],[18,1],[18,5],[21,5],[21,10],[24,10],[24,16],[27,16],
  [27,21],[30,21],[30,27],[32,27],[32,33],[29,33],[29,37],[25,37],
  [25,40],[23,40],[23,44],[19,47],[11,47],[7,44],[7,40],[5,40],
  [5,37],[2,37],[2,33],[0,33],[0,27],[2,27],[2,21],[5,21],
  [5,16],[8,16],[8,10],[11,10],[11,5],[14,5],
];

export interface GroveTree { x:number; y:number; depth:number }

export function groveTrees(f:TourFeature):GroveTree[] {
  if(f.kind!=='grove'||f.w<2||f.h<2)return [];
  // Overlap the final row/column in odd-sized groves instead of slicing a tree.
  const offsets=(size:number)=>{
    const values:number[]=[];
    for(let n=0;n<=size-2;n+=2)values.push(n);
    if(values[values.length-1]!==size-2)values.push(size-2);
    return values;
  };
  return offsets(f.h).flatMap(row=>offsets(f.w).map(col=>({
    x:(f.x+col)*16,y:(f.y+row)*16-16,depth:f.y+row+1.5,
  })));
}

export function paintGroveGround(c:CanvasRenderingContext2D,f:TourFeature){
  // A low, scalloped bed keeps the full blocked footprint legible below the trees.
  const x=f.x*16,y=f.y*16,w=f.w*16,h=f.h*16;
  c.fillStyle='#54784d';c.fillRect(x+2,y,w-4,h);c.fillRect(x,y+2,w,h-4);
  c.fillStyle='#71925c';
  for(let i=4;i<w-3;i+=8){c.fillRect(x+i,y+h-3,4,2);c.fillRect(x+i-2,y,3,2)}
}

export function paintGroveTree(c:CanvasRenderingContext2D,source:CanvasImageSource,tree:GroveTree){
  c.save();c.translate(tree.x,tree.y);
  c.fillStyle='#344f4144';c.fillRect(5,43,22,4);c.fillRect(2,44,28,2);
  c.beginPath();outline.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));
  c.closePath();c.clip();
  const s=GROVE_TREE_SAMPLE;c.drawImage(source,s.x,s.y,s.w,s.h,0,0,s.w,s.h);
  c.restore();
}
