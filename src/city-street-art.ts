// Native Platinum paving and inset drain cover from the existing Jubilife image.
export const CITY_STREET_SAMPLES = { paving:[464,112,16,16], drain:[632,224,16,16] } as const;
const asphalt='#59616a';
const curb=['#738397','#c0cad3','#9baabc','#647384'];
const key=(x:number,y:number)=>`${x},${y}`;

export function cityRoadTiles(walkable:string[],rectangles:readonly (readonly number[])[]){
  const roads=new Set<string>();
  for(const [x,y,w,h]of rectangles)for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++){
    if(walkable[j]?.[i]==='.')roads.add(key(i,j));
  }
  return roads;
}

export function paintCityStreets(c:CanvasRenderingContext2D,source:CanvasImageSource,roads:Set<string>,paths:Set<string>,crossings:number[]){
  const paving=new Set([...paths,...roads]);
  for(const tile of paving){
    const [x,y]=tile.split(',').map(Number),s=CITY_STREET_SAMPLES.paving;
    c.drawImage(source,...s,x*16,y*16,16,16);
    if(roads.has(tile))continue;
    // Thin stone edging finishes the pavement at the grass without adding a wall.
    c.fillStyle='#89988d';
    if(!paving.has(key(x,y-1)))c.fillRect(x*16,y*16,16,1);
    if(!paving.has(key(x,y+1)))c.fillRect(x*16,y*16+15,16,1);
    if(!paving.has(key(x-1,y)))c.fillRect(x*16,y*16,1,16);
    if(!paving.has(key(x+1,y)))c.fillRect(x*16+15,y*16,1,16);
  }
  for(const tile of roads){
    const [x,y]=tile.split(',').map(Number),px=x*16,py=y*16;
    const north=roads.has(key(x,y-1)),south=roads.has(key(x,y+1)),west=roads.has(key(x-1,y)),east=roads.has(key(x+1,y));
    const corners=[
      {a:north,b:west,diagonal:roads.has(key(x-1,y-1)),right:false,bottom:false},
      {a:north,b:east,diagonal:roads.has(key(x+1,y-1)),right:true,bottom:false},
      {a:south,b:west,diagonal:roads.has(key(x-1,y+1)),right:false,bottom:true},
      {a:south,b:east,diagonal:roads.has(key(x+1,y+1)),right:true,bottom:true},
    ];
    // Draw short horizontal pixel runs; no antialiased curves or seams inside roads.
    for(let j=0;j<16;j++){
      let start=0,last:string|undefined;
      for(let i=0;i<=16;i++){
        let color:string|undefined;
        if(i<16){
          let d=Math.min(north?16:j,south?16:15-j,west?16:i,east?16:15-i);
          for(const corner of corners){
            const u=corner.right?15-i:i,v=corner.bottom?15-j:j;
            if(!corner.a&&!corner.b)d=Math.min(d,(u+v-3)*.707);
            else if(corner.a&&corner.b&&!corner.diagonal)d=Math.min(d,Math.hypot(u+1,v+1)-1);
          }
          color=d<0?undefined:d<4?curb[Math.floor(d)]:asphalt;
        }
        if(color!==last||i===16){
          if(last){c.fillStyle=last;c.fillRect(px+start,py+j,i-start,1)}
          start=i;last=color;
        }
      }
    }
  }
  for(const y of crossings){
    for(let x=12;x<16;x++)if(roads.has(key(x,y))){
      c.fillStyle='#d6dcd6';c.fillRect(x*16+3,y*16+2,8,12);
      // Lowered curb at each end visually joins the crossing to its pavement.
      c.fillStyle='#aebcc7';
      if(!roads.has(key(x-1,y)))c.fillRect(x*16,y*16+2,3,12);
      if(!roads.has(key(x+1,y)))c.fillRect(x*16+13,y*16+2,3,12);
    }
    for(const x of [11,16])if(paths.has(key(x,y+1))&&!roads.has(key(x,y+1))){
      const s=CITY_STREET_SAMPLES.drain;c.drawImage(source,...s,x*16,(y+1)*16,16,16);
    }
  }
}
