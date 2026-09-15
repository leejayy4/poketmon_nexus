/** Project-drawn HGSS Route 31 arena: short pond road and Dark Cave approach. */
export function paintJohtoRoute31BattleArena(c:CanvasRenderingContext2D){
  const rect=(x:number,y:number,w:number,h:number,color:string)=>{c.fillStyle=color;c.fillRect(x,y,w,h);};
  c.save();rect(0,0,256,192,'#d7e2c8');
  // Dark Cave's western mouth anchors the east side without opening a dungeon.
  rect(177,26,79,48,'#626a5c');
  c.fillStyle='#303b3b';c.beginPath();c.ellipse(218,65,30,28,0,Math.PI,Math.PI*2);c.fill();
  rect(186,69,62,9,'#7c806c');rect(193,68,48,3,'#b5ad8a');
  for(const [x,y,r] of [[12,62,39],[65,51,48],[151,59,36],[252,57,31]] as const){c.fillStyle='#688a57';c.beginPath();c.arc(x,y,r,Math.PI,Math.PI*2);c.fill();}
  rect(0,70,256,122,'#87a35f');
  // Small north-side pond and the winding grass-free road toward Violet.
  c.fillStyle='#587f91';c.beginPath();c.ellipse(62,91,52,15,.05,0,Math.PI*2);c.fill();
  c.fillStyle='#82adb1';c.beginPath();c.ellipse(62,88,47,10,.05,0,Math.PI*2);c.fill();
  rect(31,84,31,2,'rgba(223,237,215,.55)');
  c.fillStyle='#a68e68';c.beginPath();c.moveTo(99,72);c.bezierCurveTo(147,86,132,108,191,119);c.lineTo(256,134);c.lineTo(256,161);c.bezierCurveTo(192,143,142,139,113,119);c.bezierCurveTo(87,101,73,89,99,72);c.fill();
  c.strokeStyle='#d0bc8a';c.lineWidth=3;c.beginPath();c.moveTo(104,79);c.bezierCurveTo(139,91,135,112,188,126);c.stroke();
  // Long ledge and broad southern grass patch distinguish this road from Route 30.
  rect(13,116,89,12,'#5c7151');rect(13,116,89,3,'#d2c094');
  for(let x=19;x<98;x+=17){rect(x,121,10,3,'#798260');rect(x+3,118,5,2,'#b4a780');}
  c.fillStyle='#54734a';c.beginPath();c.ellipse(61,156,78,25,0,0,Math.PI*2);c.fill();
  c.fillStyle='#78995b';c.beginPath();c.ellipse(61,151,72,19,0,0,Math.PI*2);c.fill();
  c.fillStyle='#a8c574';c.beginPath();c.ellipse(61,146,63,12,0,0,Math.PI*2);c.fill();
  for(let x=10;x<113;x+=14){rect(x,132+(x%4),2,9,'#537344');rect(x-2,133+(x%4),6,2,'#b8d17a');}
  rect(24,144,47,1,'#e4e7ab');rect(178,124,45,1,'#dac797');c.restore();
}
