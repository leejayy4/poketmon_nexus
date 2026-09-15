/** Project-drawn Chargestone backdrop; shared battle positions remain unchanged. */
export function paintChargestoneBattleArena(c:CanvasRenderingContext2D){
  c.save();
  const rect=(x:number,y:number,w:number,h:number,color:string)=>{c.fillStyle=color;c.fillRect(x,y,w,h);};
  rect(0,0,256,192,'#253a43');
  for(let x=0;x<256;x+=32){
    rect(x,12+(x%3)*5,28,58,'#344b55');
    rect(x+3,18+(x%3)*5,3,35,'#405761');
  }
  rect(0,75,256,117,'#52676d');
  for(let y=84;y<192;y+=16)for(let x=(y%32?8:21);x<256;x+=39){
    rect(x,y,13,2,'#405761');rect(x+3,y+2,7,1,'#668087');
  }
  // Crystals frame the arena rather than covering either battler or its platform.
  for(const [x,y,w,h] of [[9,33,14,31],[43,47,10,20],[111,23,16,36],[231,39,15,30]]){
    c.fillStyle='#347d91';c.beginPath();c.moveTo(x,y+h);c.lineTo(x-2,y+9);c.lineTo(x+w/2,y);c.lineTo(x+w,y+8);c.lineTo(x+w-2,y+h);c.closePath();c.fill();
    rect(x+3,y+10,3,h-13,'#8de1df');rect(x+3,y+8,5,2,'#e2fff1');
    rect(x-3,y+h+5,w+6,2,'#20333b');
  }
  for(const [x,y,rx,ry] of [[196,84,53,12],[59,133,70,19]]){
    c.fillStyle='#304b56';c.beginPath();c.ellipse(x,y+3,rx,ry,0,0,Math.PI*2);c.fill();
    c.fillStyle='#759398';c.beginPath();c.ellipse(x,y,rx-2,ry-3,0,0,Math.PI*2);c.fill();
    rect(x-rx+16,y-3,rx-5,2,'#9eb8b6');
  }
  c.restore();
}
