const rect=(c:CanvasRenderingContext2D,x:number,y:number,w:number,h:number,color:string)=>{c.fillStyle=color;c.fillRect(x,y,w,h);};

/** Small DP-style field landmarks; collision and dialogue live in the layout. */
export function paintIlexForestLandmarks(c:CanvasRenderingContext2D){
  const sx=39*16,sy=34*16;
  rect(c,sx-12,sy-9,40,23,'#6e765f');
  rect(c,sx-9,sy-13,34,8,'#53634f');
  rect(c,sx-5,sy-18,26,8,'#a15f50');
  rect(c,sx-1,sy-22,18,6,'#c78261');
  rect(c,sx+3,sy-10,10,14,'#b79a6a');
  rect(c,sx+6,sy-7,4,7,'#514d45');
  rect(c,sx-10,sy+5,36,3,'#8a795f');

  const lx=29*16,ly=31*16;
  c.fillStyle='#f3edb640';c.beginPath();c.moveTo(lx-8,ly+16);c.lineTo(lx+8,ly-19);c.lineTo(lx+25,ly+16);c.closePath();c.fill();
  rect(c,lx+4,ly+6,8,3,'#e8dca6');

  const tx=29*16,ty=49*16;
  for(const [dx,dy] of [[-5,-2],[5,4],[-2,10]]){rect(c,tx+dx,ty+dy,4,2,'#706554');rect(c,tx+dx+1,ty+dy-2,2,2,'#817360');}
}
