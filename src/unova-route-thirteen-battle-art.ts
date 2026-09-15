/** Project-drawn Route 13 arena: seaside sandbars below a grassy cliff. */
export function paintUnovaRouteThirteenBattleArena(c:CanvasRenderingContext2D,coastal:boolean){
  c.save();
  const rect=(x:number,y:number,w:number,h:number,color:string)=>{c.fillStyle=color;c.fillRect(x,y,w,h);};
  rect(0,0,256,192,'#b9d9d6');rect(0,43,256,42,'#579aad');
  for(let x=0;x<256;x+=31){rect(x,54,18,1,'#c1e5df');rect(x+9,68,14,2,'#88c3c6');}
  for(const [x,w,h] of [[0,48,27],[50,38,18],[91,51,30],[147,35,21],[186,70,28]] as const){
    rect(x,43-h,w,h,'#667a62');rect(x,43-h,w,5,'#718f61');
    for(let p=x+4;p<x+w-4;p+=11)rect(p,41-h,5,2,'#9bb775');
  }
  rect(0,83,256,109,coastal?'#d1b47d':'#71935d');
  for(let y=91;y<192;y+=17)for(let x=(y%34?6:22);x<256;x+=37){rect(x,y,7,1,'#b69664');rect(x+3,y+4,3,1,'#e2ca96');}
  c.fillStyle='#e6cf9b';c.beginPath();c.ellipse(194,87,58,14,0,0,Math.PI*2);c.fill();
  c.fillStyle='#f0dfb2';c.beginPath();c.ellipse(194,83,49,9,0,0,Math.PI*2);c.fill();
  c.fillStyle=coastal?'#a68b61':'#536f4d';c.beginPath();c.ellipse(59,137,73,22,0,0,Math.PI*2);c.fill();
  c.fillStyle=coastal?'#d8bf88':'#789c63';c.beginPath();c.ellipse(59,133,70,18,0,0,Math.PI*2);c.fill();
  c.fillStyle=coastal?'#ead6a3':'#a7be79';c.beginPath();c.ellipse(59,129,61,12,0,0,Math.PI*2);c.fill();
  rect(24,126,42,1,coastal?'#f6e5ba':'#d4dfa0');rect(172,80,38,1,'#f7e8bd');c.restore();
}
