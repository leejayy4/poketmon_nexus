/** Uses the field sewer palette; both battlers stand on dry maintenance ledges. */
export function paintCasteliaSewerBattleArena(c:CanvasRenderingContext2D){
  c.save();
  const rect=(x:number,y:number,w:number,h:number,color:string)=>{c.fillStyle=color;c.fillRect(x,y,w,h);};
  rect(0,0,256,192,'#657975');
  rect(0,0,256,64,'#3b5057');
  for(let y=0;y<64;y+=12){
    rect(0,y,256,1,'#263b43');
    for(let x=(y%24?12:0);x<256;x+=24){
      rect(x,y,1,12,'#263b43');rect(x+2,y+2,20,1,'#65787a');
    }
  }
  // Back wall pipe and its brackets keep the horizon recognizably artificial.
  rect(0,43,256,9,'#263e46');rect(0,44,256,3,'#79908d');
  for(const x of [22,86,150,214]){rect(x,41,5,13,'#354b51');rect(x+1,42,2,11,'#a1aaa0');}
  rect(0,64,256,6,'#afb49e');rect(0,70,256,3,'#455e60');
  // The recessed channel lies between the two raised platforms.
  rect(0,97,256,18,'#3a5a60');rect(0,97,256,2,'#b5b69f');rect(0,113,256,2,'#9aab9b');
  for(let x=5;x<256;x+=25)rect(x,105,12,1,'#759793');
  for(const [x,y,w,h] of [[148,74,100,20],[0,120,122,29]]){
    rect(x,y+5,w,h,'#435d5f');rect(x,y,w,h-3,'#a1aba0');rect(x+2,y+2,w-4,2,'#d0d1b9');
    for(let sx=x+16;sx<x+w;sx+=20)rect(sx,y+4,1,h-7,'#7d8f88');
  }
  c.restore();
}
