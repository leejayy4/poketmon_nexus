const box=(c:CanvasRenderingContext2D,x:number,y:number,w:number,h:number,color:string)=>{c.fillStyle=color;c.fillRect(x,y,w,h)};

/** Static harbour machinery placed only over blocked water/feature tiles. */
export function paintVermilionHarbor(c:CanvasRenderingContext2D):void{
  const x=60*16,y=23*16;
  // Compact orange cargo crane on the eastern work-water footprint.
  box(c,x,y+54,54,8,'#4c6265');box(c,x+5,y+18,8,41,'#b66f45');box(c,x+7,y+19,4,38,'#e1a365');
  box(c,x+9,y+17,39,6,'#945c42');box(c,x+11,y+18,35,2,'#efb574');
  box(c,x+43,y+21,3,25,'#5a6461');box(c,x+41,y+44,8,3,'#d7bd82');box(c,x+43,y+47,4,5,'#77604a');
  box(c,x+1,y+60,18,5,'#334b54');box(c,x+38,y+60,18,5,'#334b54');
  // Covered freight on a fixed pontoon; it remains scenery, not a pickup.
  box(c,x-30,y+112,92,8,'#50666a');box(c,x-26,y+105,84,8,'#98724f');
  for(const dx of [-21,5,31]){box(c,x+dx,y+87,21,19,'#6d856f');box(c,x+dx+2,y+89,17,4,'#b8b47f');box(c,x+dx+9,y+88,3,18,'#586755');}
  // Two mooring buoys make the inner and outer water lanes readable.
  for(const [bx,by] of [[44*16,20*16],[64*16,34*16]] as const){
    box(c,bx+5,by+5,7,8,'#d5b35f');box(c,bx+4,by+9,9,5,'#b85f4c');box(c,bx+7,by+2,3,4,'#e8db9d');
  }
}
