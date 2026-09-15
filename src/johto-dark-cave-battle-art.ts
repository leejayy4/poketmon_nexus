/** Project-drawn HGSS Dark Cave arena: Route 31 light, rough rock and the lower pond. */
export function paintJohtoDarkCaveBattleArena(c:CanvasRenderingContext2D,pondSide:boolean){
  const rect=(x:number,y:number,w:number,h:number,color:string)=>{c.fillStyle=color;c.fillRect(x,y,w,h);};
  c.save();rect(0,0,256,192,'#202a2f');

  // Layered ceiling and columns keep the single-floor cave narrow and difficult to read at a glance.
  c.fillStyle='#3a464b';c.beginPath();c.moveTo(0,0);c.lineTo(256,0);c.lineTo(256,63);c.lineTo(220,55);c.lineTo(188,71);c.lineTo(150,57);c.lineTo(112,72);c.lineTo(72,54);c.lineTo(35,67);c.lineTo(0,55);c.fill();
  for(const [x,y,w,h] of [[10,17,37,18],[58,8,33,26],[108,20,43,19],[168,9,31,28],[211,18,35,17]] as const){
    rect(x,y,w,h,(x+y)%2?'#515c60':'#485359');rect(x+4,y+h-5,w-8,3,'#6e716c');
  }

  // The Route 31 entrance and project safety stones create local pools of light, not full-cave daylight.
  const light=c.createRadialGradient(14,82,2,14,82,74);light.addColorStop(0,'rgba(239,229,164,.62)');light.addColorStop(.5,'rgba(207,199,139,.20)');light.addColorStop(1,'rgba(207,199,139,0)');c.fillStyle=light;c.fillRect(0,25,96,112);
  for(const [x,y] of [[23,93],[45,87],[69,94],[92,83]] as const){
    c.fillStyle='#d8d2a4';c.beginPath();c.ellipse(x,y,6,3,0,0,Math.PI*2);c.fill();
    rect(x-2,y-2,4,1,'#f1e7b1');
  }

  rect(0,72,256,120,'#5e6059');
  for(let y=78;y<192;y+=15)for(let x=(y%30?7:18);x<256;x+=29){rect(x,y,10,4,(x+y)%3?'#77766b':'#686961');rect(x+2,y,6,1,'#969184');}

  if(pondSide){
    // The southern return loop borders the second underground pond on the Route 31 side.
    c.fillStyle='#293f49';c.beginPath();c.ellipse(127,137,118,42,0,0,Math.PI*2);c.fill();
    c.fillStyle='#315f70';c.beginPath();c.ellipse(128,132,109,34,0,0,Math.PI*2);c.fill();
    c.strokeStyle='#78a7a6';c.lineWidth=2;for(const [x,y,w] of [[54,119,42],[132,139,54],[176,116,35]] as const){c.beginPath();c.ellipse(x,y,w,4,0,0,Math.PI);c.stroke();}
    // Narrow dry shelves hold the common battle sprite positions.
    c.fillStyle='#454b49';c.beginPath();c.ellipse(61,158,74,24,0,0,Math.PI*2);c.fill();
    c.fillStyle='#817e6e';c.beginPath();c.ellipse(61,152,66,17,0,0,Math.PI*2);c.fill();
    c.fillStyle='#444a48';c.beginPath();c.ellipse(197,111,57,15,0,0,Math.PI*2);c.fill();
    c.fillStyle='#777568';c.beginPath();c.ellipse(197,107,50,10,0,0,Math.PI*2);c.fill();
  }else{
    // Encounters away from the pond use rough gravel alcoves cut into the same cave.
    c.fillStyle='#3f4747';c.beginPath();c.ellipse(61,155,75,25,0,0,Math.PI*2);c.fill();
    c.fillStyle='#77766b';c.beginPath();c.ellipse(61,150,68,18,0,0,Math.PI*2);c.fill();
    c.fillStyle='#969184';c.beginPath();c.ellipse(61,145,58,11,0,0,Math.PI*2);c.fill();
    c.fillStyle='#3f4747';c.beginPath();c.ellipse(197,113,58,15,0,0,Math.PI*2);c.fill();
    c.fillStyle='#716f65';c.beginPath();c.ellipse(197,109,51,10,0,0,Math.PI*2);c.fill();
    for(const [x,y] of [[26,140],[44,151],[78,139],[181,105],[209,102]] as const){rect(x,y,7,3,'#aaa28b');rect(x+2,y-1,4,1,'#cbc19d');}
  }
  c.restore();
}
