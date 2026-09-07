import type {Direction} from './types';
// Platinum's frame order is NORTH, SOUTH, WEST, EAST (four frames each).
export const DIRECTION_FRAME:Record<Direction,number>={up:0,down:4,left:8,right:12};
export function spriteFrame(dir:Direction,moving:boolean,step:number,progress:number,running:boolean,frameCount:number){
  const phase=moving?[1,0,3,0][(step%2)*2+(progress>.5?1:0)]:0;
  return DIRECTION_FRAME[dir]+phase+(moving&&running&&frameCount>=32?16:0);
}
export function recolorSprite(source:HTMLImageElement,colors:Record<string,string>):HTMLCanvasElement{
  const c=document.createElement('canvas');c.width=source.width;c.height=source.height;const ctx=c.getContext('2d')!;ctx.drawImage(source,0,0);
  const pixels=ctx.getImageData(0,0,c.width,c.height),data=pixels.data;
  const palette=new Map(Object.entries(colors).map(([from,to])=>[parseInt(from,16),[parseInt(to.slice(0,2),16),parseInt(to.slice(2,4),16),parseInt(to.slice(4,6),16)]]));
  for(let i=0;i<data.length;i+=4){if(!data[i+3])continue;const next=palette.get((data[i]<<16)|(data[i+1]<<8)|data[i+2]);if(next){data[i]=next[0];data[i+1]=next[1];data[i+2]=next[2]}}
  ctx.putImageData(pixels,0,0);return c;
}
