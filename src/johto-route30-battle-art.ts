/** Project-drawn HGSS Route 30 battle space: pond fork, low ledge and grass path. */
export function paintJohtoRoute30BattleArena(c:CanvasRenderingContext2D){
  const rect=(x:number,y:number,w:number,h:number,color:string)=>{c.fillStyle=color;c.fillRect(x,y,w,h);};
  c.save();rect(0,0,256,192,'#dce8ca');
  for(const [x,y,r,color] of [[18,59,35,'#688a58'],[65,48,43,'#77975f'],[205,51,50,'#668653'],[248,62,39,'#789962']] as const){c.fillStyle=color;c.beginPath();c.arc(x,y,r,Math.PI,Math.PI*2);c.fill();}
  rect(0,61,256,131,'#8eaa65');
  c.fillStyle='#557f91';c.beginPath();c.ellipse(207,79,52,16,-.08,0,Math.PI*2);c.fill();
  c.fillStyle='#78a9b0';c.beginPath();c.ellipse(207,76,47,11,-.08,0,Math.PI*2);c.fill();
  rect(181,72,33,2,'rgba(215,236,213,.62)');rect(216,79,22,1,'rgba(215,236,213,.48)');
  rect(0,101,102,11,'#657557');rect(0,101,102,3,'#d1c197');
  for(let x=9;x<99;x+=18){rect(x,106,10,3,'#7e8765');rect(x+3,103,5,2,'#b8aa83');}
  c.fillStyle='#a98f67';c.beginPath();c.ellipse(190,125,76,23,-.08,0,Math.PI*2);c.fill();
  c.fillStyle='#c6ae7c';c.beginPath();c.ellipse(190,120,69,17,-.08,0,Math.PI*2);c.fill();
  c.fillStyle='#587a4e';c.beginPath();c.ellipse(60,151,76,25,0,0,Math.PI*2);c.fill();
  c.fillStyle='#7e9f60';c.beginPath();c.ellipse(60,146,71,19,0,0,Math.PI*2);c.fill();
  c.fillStyle='#a9c778';c.beginPath();c.ellipse(60,141,62,12,0,0,Math.PI*2);c.fill();
  for(let x=13;x<111;x+=16){rect(x,126+(x%5),2,9,'#587946');rect(x-2,127+(x%5),6,2,'#b8d078');}
  rect(23,138,45,1,'#e0e5aa');rect(163,115,46,1,'#dfcf9a');c.restore();
}
