// Project-authored BW/BW2-style arena: the old inhabited stone bridge remains
// visible behind the combatants instead of falling back to a generic meadow.
export function paintVillageBridgeBattleArena(c:CanvasRenderingContext2D){
  c.fillStyle='#8bc6cf';c.fillRect(0,0,256,192);
  c.fillStyle='#72b5c5';c.fillRect(0,82,256,110);
  for(let y=88;y<192;y+=9){c.fillStyle=y%18?'#8bcbd0':'#67aab9';c.fillRect(0,y,256,3);}
  // Distant banks and the inhabited bridge deck.
  c.fillStyle='#557c58';c.fillRect(0,52,256,18);
  c.fillStyle='#76945e';c.fillRect(0,48,256,8);
  c.fillStyle='#8b8172';c.fillRect(0,65,256,15);
  c.fillStyle='#c4b79c';c.fillRect(0,61,256,8);
  c.fillStyle='#625d58';c.fillRect(0,76,256,5);
  for(let x=18;x<250;x+=55){
    c.fillStyle='#574d45';c.fillRect(x,38,38,23);
    c.fillStyle='#d8c59b';c.fillRect(x+3,42,32,19);
    c.fillStyle='#8d5549';c.beginPath();c.moveTo(x-2,42);c.lineTo(x+19,28);c.lineTo(x+40,42);c.fill();
    c.fillStyle='#577d83';c.fillRect(x+14,48,9,13);
  }
  // Stone arches and their water openings.
  for(let x=5;x<256;x+=64){
    c.fillStyle='#777069';c.fillRect(x,78,48,24);
    c.fillStyle='#72b5c5';c.beginPath();c.arc(x+24,102,17,Math.PI,0);c.fill();c.fillRect(x+7,101,34,10);
  }
  // Battle platforms use dressed bridge stone rather than grass.
  const platform=(x:number,y:number,w:number)=>{
    c.fillStyle='#6a625a';c.beginPath();c.ellipse(x+w/2,y+13,w/2,11,0,0,Math.PI*2);c.fill();
    c.fillStyle='#c9bda3';c.beginPath();c.ellipse(x+w/2,y+7,w/2,10,0,0,Math.PI*2);c.fill();
    c.strokeStyle='#eee2c5';c.lineWidth=2;c.beginPath();c.ellipse(x+w/2,y+5,w/2-4,6,0,0,Math.PI*2);c.stroke();
  };
  platform(142,91,91);platform(16,143,104);
}
