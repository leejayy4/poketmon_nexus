import type {SaveData} from './types';
import type {Furnishing} from './explore-interiors';
import {paintTownPokemon} from './explore-life-art';
type Images=Record<string,HTMLImageElement|HTMLCanvasElement>;

/** Overlay the existing console footprints; no room or actor placement changes. */
export function paintGoldenrodNexusFurnishing(c:CanvasRenderingContext2D,mapId:string,o:Furnishing,flags:SaveData['flags'],images?:Images){
  if(mapId==='tour_goldenrod_home3'&&o.event==='tourExhibit2'){
    const x=o.x*16,y=o.y*16,w=o.w*16,h=o.h*16,rest=Boolean(flags.nexusGoldenrodReceiverConfirmed);
    c.save();c.beginPath();c.rect(x,y,w,h);c.clip();
    c.fillStyle='#b5a280';c.fillRect(x,y,w,h);
    c.fillStyle=rest?'#a9ba92':'#bcb098';c.fillRect(x+2,y+2,w-18,h-4);
    c.fillStyle='#e1d4ad';c.fillRect(x+4,y+4,w-22,2);
    c.fillStyle='#677d87';c.fillRect(x+w-15,y+h-14,12,10);
    c.fillStyle=rest?'#a9d7dc':'#9eaa9e';c.fillRect(x+w-13,y+h-12,8,5);
    if(images)paintTownPokemon(c,images,{id:'goldenrodHouseCompanion',name:'청취 주택의 피카츄',species:'pikachu',sprite:'field-pikachu',x:o.x+.5,y:o.y+o.h-1,facing:rest?'down':'right',dialogue:'tourExhibit2',pages:[]},0,'down',false);
    c.restore();return;
  }
  if(!flags.nexusGoldenrodIanBriefed)return;
  const tower=mapId==='tour_goldenrod_hall',home=mapId==='tour_goldenrod_home3';
  if((!tower&&!home)||o.event!=='tourExhibit0')return;
  const x=o.x*16,y=o.y*16;
  const on=Boolean(tower?flags.nexusGoldenrodTestSent:flags.nexusGoldenrodReceiverConfirmed);
  c.save();c.fillStyle='#405858';c.fillRect(x+6,y+3,22,10);
  c.fillStyle=on?'#b5df92':'#b79773';c.fillRect(x+8,y+5,5,5);
  c.fillStyle=on?'#d8ecc2':'#7d8e87';
  for(let i=0;i<3;i++)c.fillRect(x+16+i*3,y+10-i*2,2,2+i*2);
  c.restore();
}
