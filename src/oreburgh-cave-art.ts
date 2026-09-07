const OREBURGH_CAVE_ID='tour_pass_jubilife_oreburgh';

const rect=(c:CanvasRenderingContext2D,x:number,y:number,w:number,h:number,color:string)=>{
  c.fillStyle=color;
  c.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));
};

/** Returns true only for the first-badge Oreburgh cave passage. */
export function isOreburghCave(mapId:string):boolean{
  return mapId===OREBURGH_CAVE_ID;
}

/** Paints one cave encounter tile and, when in front, a small animated foot dust. */
export function paintCaveEncounter(c:CanvasRenderingContext2D,x:number,y:number,foreground:boolean,clock=0):void{
  const px=Math.round(x),py=Math.round(y);
  c.save();
  if(!foreground){
    rect(c,px,py,16,16,'#858878');
    rect(c,px,py,16,2,'#a8a58d');
    rect(c,px+1,py+13,14,2,'#6a7067');
    rect(c,px+3,py+5,5,2,'#9f9f86');
    rect(c,px+11,py+2,3,2,'#777b70');
    rect(c,px+8,py+10,4,2,'#70766d');
    rect(c,px+1+(Math.round(x)+Math.round(y))%4,py+8,2,1,'#b4ae91');
    rect(c,px+12,py+14,2,1,'#555f5b');
  }else{
    const phase=Math.floor(clock*4)%2;
    rect(c,px+4+phase,py+13,3,1,'#d2c29d');
    rect(c,px+9-phase,py+14,3,1,'#b7ab8d');
    if(phase===1)rect(c,px+2,py+12,2,1,'#e1d1aa');
  }
  c.restore();
}

/** Paints the 256x192 cave battle arena while preserving the existing actor layout. */
export function paintCaveBattleArena(c:CanvasRenderingContext2D):void{
  c.save();
  rect(c,0,0,256,192,'#9b9888');
  rect(c,0,0,256,62,'#77786f');
  for(let y=8;y<62;y+=13){
    rect(c,0,y,256,2,y%26===8?'#aaa58e':'#646963');
    rect(c,0,y+2,256,1,'#858777');
  }
  // Low-contrast rock plates and short stalactite silhouettes keep the upper
  // field readable as a cave without competing with actors or the HUD.
  for(const [x,y,w,h] of [[8,18,31,8],[52,34,26,7],[91,13,23,6],[130,42,36,9],[177,24,29,7],[219,48,24,6]] as const){
    rect(c,x,y,w,h,'#6b706a');
    rect(c,x+3,y+2,w-7,2,'#858879');
  }
  for(const [x,y,w,h] of [[37,51,7,7],[83,55,6,5],[119,47,8,8],[169,53,7,6],[207,44,6,7],[242,54,5,5]] as const){
    rect(c,x,y,w,2,'#60655f');
    rect(c,x+2,y+2,w-4,h-2,'#676c65');
  }
  rect(c,0,62,256,130,'#898675');
  for(let y=70;y<192;y+=16){
    rect(c,0,y,256,1,'#a59d82');
    for(let x=(y%32?7:15);x<256;x+=37)rect(c,x,y+6,4,1,'#6e7168');
  }
  const platform=(x:number,y:number,rx:number,ry:number)=>{
    c.fillStyle='#5f5e58';c.beginPath();c.ellipse(x,y+3,rx,ry,0,0,Math.PI*2);c.fill();
    c.fillStyle='#8d806c';c.beginPath();c.ellipse(x,y,rx,ry,0,0,Math.PI*2);c.fill();
    c.fillStyle='#a59678';c.beginPath();c.ellipse(x,y,rx-2,ry-3,0,0,Math.PI*2);c.fill();
    c.fillStyle='#b1a487';c.beginPath();c.ellipse(x,y-3,rx-7,ry-6,0,0,Math.PI*2);c.fill();
    rect(c,Math.round(x-rx+12),Math.round(y-2),Math.round(rx-13),1,'#d0bd94');
    rect(c,Math.round(x+5),Math.round(y+5),Math.round(rx-13),1,'#716956');
  };
  platform(196,84,53,12);
  platform(59,133,70,19);
  c.restore();
}
