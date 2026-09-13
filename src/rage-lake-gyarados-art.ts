import type {GameMap,SaveData} from './types';
import type {Furnishing} from './explore-interiors';
import {rageGyaradosCalm,rageGyaradosCaught,RAGE_RECOVERY_FLAGS} from './rage-lake-gyarados';
import {MAHOGANY_TRANSMISSION_STOPPED} from './mahogany-transmitter';
import {paintTownPokemon} from './explore-life-art';

export function rageLakeGyaradosLayers(c:CanvasRenderingContext2D,map:GameMap,f:SaveData['flags'],images:Record<string,HTMLImageElement>):{depth:number;draw:()=>void}[]{
  if(map.id!=='tour_rage_lake'||!f[MAHOGANY_TRANSMISSION_STOPPED]||rageGyaradosCaught({flags:f}))return [];
  const calm=rageGyaradosCalm({flags:f}),x=(calm?36:43)*16,y=(calm?21:17)*16;
  return [{depth:(calm?24:20),draw:()=>{
    c.save();c.beginPath();c.rect(28*16,8*16,20*16,23*16);c.clip();
    c.strokeStyle=calm?'#b1d1d2':'#e1ecdf';c.lineWidth=calm?1:2;
    for(let i=0;i<(calm?2:4);i++){c.beginPath();c.ellipse(x+24,y+43,25+i*6,5+i*3,0,0,Math.PI*2);c.stroke();}
    const sprite=images['pokemon-shiny-130'];if(sprite)c.drawImage(sprite,x,y,48,48);
    c.restore();
  }}];
}

export function paintRageLakeRecoveryFurnishing(c:CanvasRenderingContext2D,mapId:string,o:Furnishing,f:SaveData['flags'],images:Record<string,HTMLImageElement>):void{
  if(mapId!=='tour_rage_lake_home1'||!f[RAGE_RECOVERY_FLAGS.residents])return;
  if(o.event!=='rageLakeHomeReedTable'&&o.event!=='rageLakeHomeCompanionSeat')return;
  const x=o.x*16,y=o.y*16;c.save();c.beginPath();c.rect(x,y,o.w*16,o.h*16);c.clip();
  if(o.event==='rageLakeHomeReedTable'){
    c.fillStyle='#a89a6d';c.fillRect(x+7,y+7,25,17);c.strokeStyle='#6d7853';for(let i=0;i<5;i++){c.beginPath();c.moveTo(x+10+i*4,y+20);c.lineTo(x+13+i*4,y+5);c.stroke();}
    c.fillStyle='#bfc6b5';c.fillRect(x+47,y+9,15,14);c.fillStyle='#82abb6';c.fillRect(x+49,y+10,11,4);
  }else{
    c.fillStyle='#d1c6a4';c.fillRect(x+8,y+2,27,12);
    c.save();c.translate(x+12,y);c.scale(.5,.5);
    // The shared painter selects one 32px frame; fit that full frame in the 16px-high seat.
    paintTownPokemon(c,images,{id:'rageLakeResidentCompanion',name:'호숫가 주민의 피카츄',species:'pikachu',sprite:'field-pikachu',x:.5,y:1.375,facing:'right',dialogue:'rageLakeHomeCompanionSeat',pages:[]},0,'down',false);c.restore();
    c.fillStyle='#d5d9c3';c.fillRect(x+41,y+8,10,6);c.fillStyle='#77abb7';c.fillRect(x+43,y+9,6,2);
  }
  c.restore();
}
