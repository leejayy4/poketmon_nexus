import type {SaveData} from './types';
import type {Furnishing} from './explore-interiors';
import {ECRUTEAK_DISCLOSURE_STAGES} from './ecruteak-disclosure';
export function paintEcruteakDisclosureFurnishing(c:CanvasRenderingContext2D,mapId:string,o:Furnishing,f:SaveData['flags']):void{
  if(mapId!=='tour_ecruteak_hall_2f'||o.event!=='ecruteakDisclosureOriginals')return;
  const x=o.x*16,y=o.y*16;c.save();c.beginPath();c.rect(x,y,o.w*16,o.h*16);c.clip();
  c.fillStyle='#71634e';c.fillRect(x+5,y+7,30,18);
  if(f[ECRUTEAK_DISCLOSURE_STAGES[0]]){c.fillStyle='#eadfc0';c.fillRect(x+5,y+5,30,19);c.fillStyle='#60727a';for(let i=0;i<3;i++)c.fillRect(x+8,y+8+i*3,22,1);c.fillStyle='#886054';c.fillRect(x+23,y+19,8,2);}
  if(f[ECRUTEAK_DISCLOSURE_STAGES[1]]){c.fillStyle='#eee5cb';c.fillRect(x+44,y+5,41,19);c.fillStyle='#687968';for(let i=0;i<4;i++)c.fillRect(x+48,y+8+i*3,30-i*3,1);c.fillStyle='#c3a05e';c.fillRect(x+81,y+7,6,5);c.fillRect(x+81,y+16,6,5);}
  c.restore();
}
