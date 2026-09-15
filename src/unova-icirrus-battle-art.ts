/** Project-drawn B2W2-inspired arenas for Route 8 and the Moor of Icirrus. */
export function paintIcirrusWetlandBattleArena(c:CanvasRenderingContext2D,mapId:string,onEncounterPatch:boolean){
  const rect=(x:number,y:number,w:number,h:number,color:string)=>{c.fillStyle=color;c.fillRect(x,y,w,h);};
  const ellipse=(x:number,y:number,rx:number,ry:number,color:string)=>{c.fillStyle=color;c.beginPath();c.ellipse(x,y,rx,ry,0,0,Math.PI*2);c.fill();};
  const moor=mapId==='tour_icirrus_moor';
  c.save();
  rect(0,0,256,192,moor?'#c7dcd2':'#cfded4');
  // Low reed banks and distant wet woodland keep the flat Unova marsh horizon.
  for(const [x,y,rx,ry,color] of [[20,65,66,26,'#68866c'],[116,61,84,30,'#587b65'],[226,66,75,27,'#6d8a6c']] as const){
    c.fillStyle=color;c.beginPath();c.ellipse(x,y,rx,ry,0,Math.PI,Math.PI*2);c.fill();
  }
  rect(0,65,256,127,moor?'#718d78':'#7b9477');
  // Standing water stays behind the battlers; neither arena implies Surf access.
  ellipse(196,92,63,18,'#6f999b');ellipse(196,88,57,13,'#93b8b4');
  rect(153,87,86,1,'#d0dfd2');rect(172,94,49,1,'#5e8589');
  if(moor){
    // A raised boardwalk recalls the safe central and observation loops.
    rect(0,108,256,24,'#857a5f');rect(0,111,256,17,'#b6a579');
    for(let x=-8;x<256;x+=23){rect(x,113,2,14,'#756b54');rect(x+2,115,18,1,'#d5c79a');}
    for(let x=8;x<250;x+=19){rect(x,70+(x%3),2,19,'#56785c');rect(x-2,73+(x%3),6,2,'#b0a66e');}
  }else{
    // The broad dry Route 8 line remains readable behind the optional puddles.
    rect(0,102,256,34,'#978b6c');rect(0,106,256,25,'#c0b187');rect(0,130,256,3,'#7c765f');
    for(let x=-12;x<256;x+=38)rect(x,115,22,2,'#ded0a0');
  }
  if(onEncounterPatch){
    ellipse(61,154,76,24,'#4f7155');ellipse(61,150,70,19,'#759666');ellipse(61,145,61,12,'#a4bc77');
    for(let x=8;x<114;x+=13){rect(x,130+(x%5),2,13,'#527650');rect(x-2,132+(x%5),6,2,'#b7ca78');}
  }else{
    ellipse(61,154,76,23,moor?'#80755d':'#8d8266');ellipse(61,149,69,17,moor?'#baa97d':'#c3b58d');
    rect(25,146,50,2,'#dfd1a2');
  }
  ellipse(196,119,59,14,moor?'#756d58':'#877c62');ellipse(196,116,53,10,moor?'#b1a277':'#c2b38a');
  rect(171,113,48,1,'#e0d3a6');
  c.restore();
}
