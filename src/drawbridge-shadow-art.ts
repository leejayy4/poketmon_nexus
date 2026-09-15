/** Project's fixed encounter patches: bird shadows on bridge decking, not grass. */
export function paintDrawbridgeShadow(c:CanvasRenderingContext2D,x:number,y:number,clock:number){
  const spread=3+Math.sin(clock*2+x*.07+y*.03);
  c.save();c.fillStyle='rgba(35,55,64,.42)';
  c.beginPath();c.ellipse(x+8,y+9,2,4,0,0,Math.PI*2);c.fill();
  c.beginPath();c.moveTo(x+8,y+7);c.lineTo(x+1,y+5-spread);c.lineTo(x+4,y+10);c.lineTo(x+8,y+9);c.lineTo(x+12,y+10);c.lineTo(x+15,y+5-spread);c.closePath();c.fill();c.restore();
}

/** The encounter stays on the bridge deck; the river is beyond its railing. */
export function paintDrawbridgeBattleArena(c:CanvasRenderingContext2D){
  c.save();
  const r=(x:number,y:number,w:number,h:number,color:string)=>{c.fillStyle=color;c.fillRect(x,y,w,h);};
  r(0,0,256,192,'#aaa89a');r(0,0,256,34,'#b2d1d1');r(0,34,256,30,'#5f9da9');
  for(let x=0;x<256;x+=29){r(x,43,16,1,'#9bc4c5');r(x+9,53,11,1,'#83b4bb');}
  // Far bank silhouettes and the red steel structure identify the crossing.
  for(const [x,w,h] of [[0,29,14],[36,19,21],[63,39,12],[112,23,18],[145,40,15],[197,25,24],[231,25,13]])r(x,34-h,w,h,'#819b9c');
  for(const x of [12,118,224]){r(x,0,10,67,'#874f48');r(x+2,0,3,67,'#c48c73');}
  r(0,57,256,5,'#925b50');r(0,63,256,3,'#e0c3a0');
  for(let x=3;x<256;x+=13)r(x,62,2,12,'#765951');
  r(0,73,256,4,'#6e7370');r(0,77,256,3,'#d4c7ae');
  for(let y=85;y<192;y+=14){r(0,y,256,1,'#858c86');for(let x=(y%28?8:24);x<256;x+=32)r(x,y+1,1,13,'#969a90');}
  for(const [x,y,w,h] of [[148,81,101,16],[0,128,121,22]]){
    r(x,y+3,w,h,'#777f7b');r(x,y,w,h-3,'#c5c3ae');r(x+3,y+2,w-6,2,'#e0d7bc');
  }
  c.restore();
}
