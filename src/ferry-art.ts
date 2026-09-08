export interface FerryJourneyView {elapsed:number;duration:number;outbound:boolean}

export function ferryProgress(view:FerryJourneyView):number{
  return view.duration>0?Math.max(0,Math.min(1,view.elapsed/view.duration)):1;
}

// Every primitive is clipped and snapped to the native DS screen, including
// wave strips that wrap across its sides. No external artwork or timers.
function rect(c:CanvasRenderingContext2D,x:number,y:number,w:number,h:number,color:string){
  const left=Math.max(0,Math.round(x)),top=Math.max(0,Math.round(y)),right=Math.min(256,Math.round(x+w)),bottom=Math.min(192,Math.round(y+h));
  if(right<=left||bottom<=top)return;
  c.fillStyle=color;c.fillRect(left,top,right-left,bottom-top);
}

function ship(c:CanvasRenderingContext2D,x:number,y:number,right:boolean){
  const r=(dx:number,dy:number,w:number,h:number,color:string)=>rect(c,x+(right?dx:96-dx-w),y+dy,w,h,color);
  // Waterline, stepped bow, cream hull and a narrow timber deck.
  r(11,54,67,4,'#467f91');r(7,51,75,4,'#487d8a');
  r(4,35,87,10,'#526777');r(8,45,79,5,'#526777');r(12,50,68,3,'#526777');
  r(6,36,82,7,'#eee4c4');r(10,43,74,5,'#e0d4b3');r(14,48,62,2,'#c4baa3');
  r(5,35,86,2,'#fff2d0');r(10,43,74,2,'#a96752');
  r(13,31,67,4,'#a99068');r(15,31,62,1,'#d6bf93');
  // Cabin, bridge and the modest orange funnel seen in the port's existing boat.
  r(26,16,39,15,'#6b7f80');r(28,18,35,12,'#e8e1c6');r(25,14,42,4,'#f2e9cc');
  r(53,9,19,16,'#5f747b');r(55,10,15,13,'#e3dcc1');r(52,7,22,3,'#f3e9cc');
  for(const wx of [31,41,55,63]){r(wx,19,6,6,'#548ca1');r(wx+1,19,4,2,'#abd3d2');}
  r(57,12,10,4,'#7eafb9');r(58,12,8,1,'#c9dfd5');
  r(33,2,12,12,'#b87c56');r(34,3,10,10,'#db9b65');r(31,0,16,3,'#626c69');r(35,4,3,8,'#edbb7d');
  r(76,16,2,15,'#9d9479');r(73,15,8,2,'#e4d2ae');
  for(const wx of [19,31,43,55,67]){r(wx,38,4,3,'#819b9e');r(wx+1,38,2,1,'#bed6cd');}
  // Short rail uprights stop above the hull rather than becoming extra windows.
  r(12,27,12,1,'#e9ddbe');r(68,27,14,1,'#e9ddbe');
  for(const wx of [12,22,70,80])r(wx,27,1,5,'#e0d2b0');
}

/** Brief voyage presentation only; the engine owns time, arrival and saving. */
export function paintFerryJourney(c:CanvasRenderingContext2D,view:FerryJourneyView):void{
  c.save();try{
    const p=ferryProgress(view),direction=view.outbound?1:-1;
    rect(c,0,0,256,192,'#6ba6b5');rect(c,0,0,256,59,'#c1d9ce');
    rect(c,0,46,256,13,'#b2ceca');rect(c,0,59,256,4,'#e0e2c4');
    for(const [x,y,w] of [[18,18,37],[97,29,29],[193,13,39]]){
      rect(c,x,y,w,3,'#eef0d6');rect(c,x+6,y-2,w-13,2,'#eef0d6');rect(c,x+10,y+3,w-18,1,'#d4e2cf');
    }
    rect(c,0,63,256,25,'#8ab8bd');rect(c,0,87,256,2,'#abcfc8');
    const drift=Math.round(p*72)*-direction;
    for(let row=0;row<8;row++)for(let col=0;col<7;col++){
      const x=((col*47+row*17+drift+292)%292)-20,y=69+row*16;
      rect(c,x,y,12+row%3*4,1,row<2?'#bfd9cd':'#a4cfc9');
      if(row>2)rect(c,x+15,y+6,10,1,'#5792a5');
    }
    const x=view.outbound?24+Math.round(p*112):136-Math.round(p*112),y=85+(Math.floor(p*6)%2);
    const stern=view.outbound?x+8:x+88;
    for(let row=0;row<3;row++){
      const width=18+row*4,wx=view.outbound?stern-width:stern;
      rect(c,wx,y+43+row*5,width,2,row===1?'#d9e7d3':'#b9ddd1');
      rect(c,wx+(view.outbound?-4:width),y+45+row*5,4,1,'#9bc8c2');
    }
    ship(c,x,y,view.outbound);
  }finally{c.restore();}
}
