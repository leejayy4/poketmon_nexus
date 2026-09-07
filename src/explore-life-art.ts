import { fieldPokemonFrame,pokemonFacing,type TownPokemon } from './explore-pokemon';
import type { Direction } from './types';
import type { TourFeature } from './explore-world';

type Images=Record<string,HTMLImageElement|HTMLCanvasElement>;
export function paintTownPokemon(c:CanvasRenderingContext2D,images:Images,n:TownPokemon,clock:number,playerFacing:Direction,reacting:boolean,walkProgress?:number){
  const x=Math.round(n.x*16+8),y=Math.round(n.y*16+8),dir=reacting?pokemonFacing(playerFacing):n.facing;
  const frame=fieldPokemonFrame(n.species,dir,walkProgress===undefined?clock:walkProgress*2,reacting);
  c.fillStyle='#293d393d';c.beginPath();c.ellipse(x,y-2,5,2,0,0,Math.PI*2);c.fill();
  const hop=n.species==='starly'?Math.round(Math.max(0,Math.sin(clock*3))):0;
  c.drawImage(images[n.sprite],0,frame*32,32,32,x-16,y-30-hop,32,32);
  if(reacting){
    c.fillStyle='#fff9e8';c.fillRect(x+6,y-38,15,13);c.fillRect(x+7,y-25,3,3);
    c.fillStyle='#d7788b';c.fillRect(x+9,y-35,4,4);c.fillRect(x+15,y-35,4,4);c.fillRect(x+10,y-32,8,3);c.fillRect(x+12,y-29,4,2);
  }
}
export function paintTourWaterMotion(c:CanvasRenderingContext2D,features:TourFeature[],clock:number){
  for(const f of features){
    if(f.kind!=='water'&&f.kind!=='fountain')continue;
    const x=f.x*16,y=f.y*16,w=f.w*16,h=f.h*16;
    c.save();c.beginPath();c.rect(x+6,y+6,w-12,h-12);c.clip();
    if(f.kind==='water'){
      for(let i=0;i<4;i++){
        const px=x+8+(i*19+Math.floor(clock*3))%Math.max(1,w-30),py=y+12+(i*23)%Math.max(1,h-22);
        c.fillStyle=i%2?'#d0e9e3':'#8dd0dd';c.fillRect(px,py,8,1);c.fillRect(px+3,py+2,5,1);
      }
    }else{
      const radius=8+(Math.floor(clock*6)%7);c.strokeStyle='#c6e6e5';c.lineWidth=1;c.beginPath();c.ellipse(x+w/2,y+h-9,radius,3,0,0,Math.PI*2);c.stroke();
    }
    c.restore();
  }
}
