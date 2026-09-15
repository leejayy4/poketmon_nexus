/** Project-drawn Platinum Route 203 arena: pond, stepped hill and split grass belts. */
export function paintSinnohRoute203BattleArena(c:CanvasRenderingContext2D,grassSide:boolean){
  const rect=(x:number,y:number,w:number,h:number,color:string)=>{c.fillStyle=color;c.fillRect(x,y,w,h);};
  c.save();rect(0,0,256,192,'#cfe1c2');
  // Distant trees frame the short east-west road without hiding its open Sinnoh skyline.
  rect(0,54,256,138,'#7f9a62');
  for(const [x,y,r] of [[4,55,31],[36,48,37],[220,47,42],[255,57,32]] as const){
    c.fillStyle='#4f714b';c.beginPath();c.arc(x,y,r,Math.PI,Math.PI*2);c.fill();
    c.fillStyle='#65865a';c.beginPath();c.arc(x,y-5,r-8,Math.PI,Math.PI*2);c.fill();
  }
  // A small western pond and pale bank identify the lower start of Route 203.
  c.fillStyle='#9aaf75';c.beginPath();c.ellipse(40,87,43,19,0,0,Math.PI*2);c.fill();
  c.fillStyle='#6daab2';c.beginPath();c.ellipse(38,84,35,13,0,0,Math.PI*2);c.fill();
  c.strokeStyle='#b5d9d2';c.lineWidth=2;c.beginPath();c.ellipse(34,81,19,5,-.08,0,Math.PI*1.25);c.stroke();
  // The eastern hill rises in two readable terraces with stone stair cuts.
  rect(111,57,145,18,'#6e8359');rect(111,54,145,5,'#b5b78a');
  rect(151,35,105,21,'#657b53');rect(151,32,105,5,'#c1bf91');
  for(let x=119;x<145;x+=7){rect(x,57,5,18,'#9b9478');rect(x,57,5,2,'#d0c59c');}
  for(let x=157;x<184;x+=7){rect(x,35,5,20,'#989177');rect(x,35,5,2,'#d0c59c');}
  // The road widens between the pond and hill before entering Oreburgh Gate.
  c.fillStyle='#b8a77d';c.beginPath();c.moveTo(0,102);c.lineTo(256,81);c.lineTo(256,139);c.lineTo(0,150);c.fill();
  c.strokeStyle='#d7c69b';c.lineWidth=3;c.beginPath();c.moveTo(0,105);c.lineTo(256,85);c.stroke();
  if(grassSide){
    // Wild battles use the route's lower or upper grass belts.
    c.fillStyle='#4d7247';c.beginPath();c.ellipse(61,155,76,25,0,0,Math.PI*2);c.fill();
    c.fillStyle='#7da15d';c.beginPath();c.ellipse(61,150,69,19,0,0,Math.PI*2);c.fill();
    c.fillStyle='#a9c777';c.beginPath();c.ellipse(61,145,59,12,0,0,Math.PI*2);c.fill();
    for(let x=12;x<113;x+=13){rect(x,133+(x%3),2,10,'#547a48');rect(x-2,134+(x%3),6,2,'#c2d983');}
  }else{
    // The optional trainer stands on the dry central turnout, away from encounter grass.
    c.fillStyle='#887c62';c.beginPath();c.ellipse(61,153,75,23,0,0,Math.PI*2);c.fill();
    c.fillStyle='#b5a47b';c.beginPath();c.ellipse(61,148,68,17,0,0,Math.PI*2);c.fill();
    c.fillStyle='#d5c69c';c.beginPath();c.ellipse(61,144,58,10,0,0,Math.PI*2);c.fill();
  }
  // Opponent platform sits against the elevated eastern grass patch.
  c.fillStyle='#496943';c.beginPath();c.ellipse(196,115,59,15,0,0,Math.PI*2);c.fill();
  c.fillStyle='#77985a';c.beginPath();c.ellipse(196,111,53,10,0,0,Math.PI*2);c.fill();
  for(let x=171;x<220;x+=9)rect(x,101,2,9,'#4e7445');
  c.restore();
}
