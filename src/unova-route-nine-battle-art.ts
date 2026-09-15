/** Project-drawn B2W2 Route 9 arena: paved biker road, mall front and south grass. */
export function paintUnovaRouteNineBattleArena(c:CanvasRenderingContext2D,grassSide:boolean){
  const rect=(x:number,y:number,w:number,h:number,color:string)=>{c.fillStyle=color;c.fillRect(x,y,w,h);};
  c.save();rect(0,0,256,192,'#d6e1d2');
  // Shopping Mall Nine remains visible as the route's northern landmark.
  rect(68,18,120,49,'#687482');rect(75,25,106,42,'#9ca6ad');rect(84,34,88,33,'#c7d2d5');
  rect(98,45,60,22,'#536876');rect(105,49,46,18,'#9fc3c5');
  for(const x of [82,174]){rect(x,54,6,13,'#4e5961');rect(x-2,52,10,4,'#d1bb6b');}
  // Windbreak trees separate the southern winding grass from the asphalt.
  for(const [x,y,r] of [[8,69,36],[48,60,39],[207,62,43],[254,67,35]] as const){c.fillStyle='#506f4d';c.beginPath();c.arc(x,y,r,Math.PI,Math.PI*2);c.fill();}
  rect(0,67,256,125,'#78915f');
  // The broad safe road dominates Route 9 and supports the optional biker battle.
  rect(0,79,256,57,'#555c61');rect(0,83,256,3,'#7a8386');rect(0,130,256,3,'#30383c');
  for(let x=-18;x<256;x+=44)rect(x,105,24,3,'#d5c68b');
  rect(0,75,256,4,'#bbb6a0');rect(0,136,256,5,'#464f48');
  if(grassSide){
    // Wild encounters move the near platform into the winding south grass.
    c.fillStyle='#4d6d48';c.beginPath();c.ellipse(63,155,76,25,0,0,Math.PI*2);c.fill();
    c.fillStyle='#759458';c.beginPath();c.ellipse(63,150,70,19,0,0,Math.PI*2);c.fill();
    c.fillStyle='#a5c171';c.beginPath();c.ellipse(63,145,61,12,0,0,Math.PI*2);c.fill();
    for(let x=12;x<115;x+=14){rect(x,132+(x%4),2,10,'#4e7144');rect(x-2,133+(x%4),6,2,'#b8cf77');}
  }else{
    // Trainer battles stay on a dry turnout beside the paved main line.
    c.fillStyle='#777b75';c.beginPath();c.ellipse(62,151,74,23,0,0,Math.PI*2);c.fill();
    c.fillStyle='#a5a493';c.beginPath();c.ellipse(62,147,68,17,0,0,Math.PI*2);c.fill();
    rect(23,143,46,2,'#d6d2b3');
  }
  c.fillStyle='#454c4f';c.beginPath();c.ellipse(196,119,59,14,0,0,Math.PI*2);c.fill();
  c.fillStyle='#777d7d';c.beginPath();c.ellipse(196,116,53,10,0,0,Math.PI*2);c.fill();
  rect(174,112,39,2,'#d7c98e');c.restore();
}
