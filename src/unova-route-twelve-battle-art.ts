/** Project-drawn Route 12 arena: gentle grass hills and a low safe footpath. */
export function paintUnovaRouteTwelveBattleArena(c:CanvasRenderingContext2D){
  c.save();
  const rect=(x:number,y:number,w:number,h:number,color:string)=>{c.fillStyle=color;c.fillRect(x,y,w,h);};
  rect(0,0,256,192,'#dce8cf');
  for(const [x,y,rx,ry,color] of [[26,60,82,33,'#8faf71'],[128,54,94,38,'#799963'],[230,61,73,31,'#91ac70']] as const){
    c.fillStyle=color;c.beginPath();c.ellipse(x,y,rx,ry,0,Math.PI,Math.PI*2);c.fill();
  }
  rect(0,62,256,130,'#91ae6d');
  for(let y=70;y<192;y+=15)for(let x=(y%30?7:21);x<256;x+=34){rect(x,y,5,1,'#6e905b');rect(x+2,y-3,1,4,'#bad086');}
  // The lower path recalls the grass-free bypass without changing encounter rules.
  c.fillStyle='#a89570';c.beginPath();c.ellipse(196,87,58,14,0,0,Math.PI*2);c.fill();
  c.fillStyle='#c6b58c';c.beginPath();c.ellipse(196,83,51,9,0,0,Math.PI*2);c.fill();
  c.fillStyle='#58784f';c.beginPath();c.ellipse(59,137,73,22,0,0,Math.PI*2);c.fill();
  c.fillStyle='#82a463';c.beginPath();c.ellipse(59,133,70,18,0,0,Math.PI*2);c.fill();
  c.fillStyle='#acc67c';c.beginPath();c.ellipse(59,129,61,12,0,0,Math.PI*2);c.fill();
  rect(24,126,42,1,'#dce6a6');rect(174,80,38,1,'#ded0a9');
  c.restore();
}
