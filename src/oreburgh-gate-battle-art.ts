/** Project-drawn Platinum Oreburgh Gate 1F arena: lit transit tunnel and ore alcoves. */
export function paintOreburghGateBattleArena(c:CanvasRenderingContext2D){
  const rect=(x:number,y:number,w:number,h:number,color:string)=>{c.fillStyle=color;c.fillRect(x,y,w,h);};
  c.save();rect(0,0,256,192,'#2d3336');
  // Layered rock walls narrow into the short east-west through tunnel.
  c.fillStyle='#50565a';c.beginPath();c.moveTo(0,0);c.lineTo(256,0);c.lineTo(256,64);c.lineTo(213,78);c.lineTo(43,78);c.lineTo(0,62);c.fill();
  for(const [x,y,w,h,color] of [[9,15,46,17,'#626569'],[67,8,38,24,'#444b50'],[117,20,53,20,'#66686a'],[184,7,58,25,'#484f53']] as const){rect(x,y,w,h,color);rect(x+5,y+h-4,w-10,3,'#77736c');}
  // Daylight at both portals keeps the location readable as a gate, not a deep dungeon.
  for(const [x,flip] of [[0,false],[226,true]] as const){
    const g=c.createLinearGradient(flip?256:0,55,flip?220:36,55);g.addColorStop(0,'#e4e8bf');g.addColorStop(1,'rgba(196,210,174,0)');c.fillStyle=g;c.fillRect(x,35,30,77);
  }
  rect(0,70,256,122,'#66635c');
  for(let y=77;y<192;y+=14)for(let x=(y%28?4:15);x<256;x+=31){rect(x,y,12,5,'#77736a');rect(x+2,y+1,8,2,'#989181');}
  // The upside-down-T branch toward the unopened basement is visible behind battle space.
  c.fillStyle='#888174';c.beginPath();c.moveTo(102,70);c.lineTo(154,70);c.lineTo(147,117);c.lineTo(109,117);c.fill();
  rect(111,70,34,4,'#b3a685');rect(120,79,16,30,'#393f41');rect(124,83,8,24,'#20292b');
  // Copper-gold seams identify the Oreburgh side without copying original tiles.
  c.strokeStyle='#b18a54';c.lineWidth=3;c.beginPath();c.moveTo(176,53);c.lineTo(191,44);c.lineTo(208,51);c.lineTo(220,39);c.stroke();
  c.strokeStyle='#76939a';c.lineWidth=2;c.beginPath();c.moveTo(42,50);c.lineTo(55,43);c.lineTo(69,49);c.stroke();
  // Stable rock platforms preserve the common battle sprite coordinates.
  c.fillStyle='#3f4545';c.beginPath();c.ellipse(197,113,57,15,0,0,Math.PI*2);c.fill();
  c.fillStyle='#77746a';c.beginPath();c.ellipse(197,109,51,10,0,0,Math.PI*2);c.fill();
  c.fillStyle='#3d4343';c.beginPath();c.ellipse(60,154,73,24,0,0,Math.PI*2);c.fill();
  c.fillStyle='#716e65';c.beginPath();c.ellipse(60,149,68,18,0,0,Math.PI*2);c.fill();
  c.fillStyle='#99917d';c.beginPath();c.ellipse(60,144,59,11,0,0,Math.PI*2);c.fill();
  rect(23,142,43,1,'#c8bc95');rect(177,106,39,1,'#c5ae7e');c.restore();
}
