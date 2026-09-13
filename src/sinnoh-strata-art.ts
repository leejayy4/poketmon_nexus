import type { GameMap,SaveData } from './types';

/** Shared visual vocabulary for the existing optional field survey and museum samples. */
export function paintSinnohStratum(c:CanvasRenderingContext2D,x:number,y:number,w:number,h:number,west:boolean){
  c.save();c.beginPath();c.rect(x,y,w,h);c.clip();
  c.fillStyle=west?'#c3b58c':'#627e80';c.fillRect(x,y,w,h);
  for(let row=2;row<h;row+=5){
    c.fillStyle=west?'#dfcea2':'#91aaa1';
    if(west){
      // Broken bedding and a stepped fissure distinguish the rough, pale layer.
      for(let col=1;col<w;col+=7)c.fillRect(x+col,y+row+(col%3),5,1);
    }else{
      c.fillRect(x+1,y+row,w-2,1);
      c.fillStyle='#adc0b1';c.fillRect(x+w-4,y+row,1,3);
    }
  }
  if(west){
    c.fillStyle='#827c60';
    for(let row=0;row<h;row+=4)c.fillRect(x+Math.floor(w/2)+(Math.floor(row/4)%2),y+row,1,4);
  }
  c.restore();
}

/** Live notes overlay the cached field background, so recording is visible immediately. */
export function paintCoronetSurveyNotes(c:CanvasRenderingContext2D,map:GameMap,save:SaveData){
  if(map.id!=='tour_coronet_211_pass')return;
  c.save();
  for(const prop of map.props){
    const key=prop.dialogue==='coronet211WestLayer'?'coronet211WestLayerChecked'
      :prop.dialogue==='coronet211EastLayer'?'coronet211EastLayerChecked':undefined;
    if(!key||!save.flags[key])continue;
    const x=prop.x*16+8,y=prop.y*16+8;
    // A small field-note slip lies flat within the existing survey tile.
    c.fillStyle='#54645a';c.fillRect(x-1,y-1,8,8);
    c.fillStyle='#e9dfbd';c.fillRect(x,y,6,6);
    c.fillStyle='#508068';c.fillRect(x+1,y+3,2,1);c.fillRect(x+2,y+4,1,1);c.fillRect(x+3,y+2,1,2);c.fillRect(x+4,y+1,1,2);
  }
  c.restore();
}
