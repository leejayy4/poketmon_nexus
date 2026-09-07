/** Page-local, deterministic DS pixels. Call after sprites and before HP/dialogue. */
export const MOVE_TECHNIQUE_SECONDS = .7;
export type MoveTechnique = {move:string; target:'player'|'enemy'};
export type MoveStyle = 'fire'|'water'|'vine'|'leaf'|'absorb'|'electric'|'rock'|'ghost'|'lick'|'psychic'|'fight'|'scratch'|'wing'|'quick'|'guard'|'cry'|'tail'|'impact';

const STYLES: Record<string, MoveStyle> = {
  불꽃세례:'fire',화염방사:'fire',불꽃엄니:'fire',불꽃펀치:'fire',
  물대포:'water',거품:'water',거품광선:'water',파도타기:'water',
  덩굴채찍:'vine',잎날가르기:'leaf',매지컬리프:'leaf',흡수:'absorb',메가드레인:'absorb',기가드레인:'absorb',
  전기쇼크:'electric',스파크:'electric','10만볼트':'electric',번개:'electric',
  돌떨구기:'rock',암석봉인:'rock',스텔스록:'rock',구르기:'rock',
  놀래키기:'ghost',섀도볼:'ghost',핥기:'lick',염동력:'psychic',사이코키네시스:'psychic',
  태권당수:'fight',발경:'fight',마하펀치:'fight',로킥:'fight',
  할퀴기:'scratch',마구할퀴기:'scratch',베어가르기:'scratch',
  날개치기:'wing',바람일으키기:'wing',전광석화:'quick',
  방어:'guard',단단해지기:'guard',껍질에숨기:'guard',울음소리:'cry',꼬리흔들기:'tail',
  몸통박치기:'impact',박치기:'impact',
};
export function moveTechniqueStyle(move:string):MoveStyle { return Object.hasOwn(STYLES,move)?STYLES[move]:'impact'; }

/** elapsed is seconds since the technique page began; never derives time/randomness itself. */
export function paintMoveTechnique(c:CanvasRenderingContext2D, technique:MoveTechnique, elapsed:number, starterPresentation=false):void {
  if(starterPresentation&&['불꽃세례','물대포','덩굴채찍'].includes(technique.move)){
    paintStarterTechnique(c,technique,elapsed);return;
  }
  if(!Number.isFinite(elapsed)||elapsed<0||elapsed>=MOVE_TECHNIQUE_SECONDS)return;
  const t=elapsed/MOVE_TECHNIQUE_SECONDS, frame=Math.floor(t*24);
  const end=technique.target==='enemy'?{x:196,y:58}:{x:64,y:103};
  const start=technique.target==='enemy'?{x:64,y:103}:{x:196,y:58};
  const dir=technique.target==='enemy'?1:-1, style=moveTechniqueStyle(technique.move);
  const p=Math.min(1,t/.55), x=start.x+(end.x-start.x)*p, y=start.y+(end.y-start.y)*p;
  const rect=(x:number,y:number,w:number,h:number,color:string)=>{
    // Clip in integer space as well, so no primitive touches the dialogue below y=144.
    const left=Math.max(0,Math.round(x)),top=Math.max(0,Math.round(y));
    const right=Math.min(256,Math.round(x)+Math.max(1,Math.round(w)));
    const bottom=Math.min(144,Math.round(y)+Math.max(1,Math.round(h)));
    if(right>left&&bottom>top){c.fillStyle=color;c.fillRect(left,top,right-left,bottom-top);}
  };
  const line=(ax:number,ay:number,bx:number,by:number,color:string,width=2)=>{
    const steps=Math.max(1,Math.ceil(Math.max(Math.abs(bx-ax),Math.abs(by-ay))));
    for(let i=0;i<=steps;i++)rect(ax+(bx-ax)*i/steps,ay+(by-ay)*i/steps,width,width,color);
  };
  const diamond=(cx:number,cy:number,r:number,color:string)=>{
    line(cx,cy-r,cx+r,cy,color);line(cx+r,cy,cx,cy+r,color);
    line(cx,cy+r,cx-r,cy,color);line(cx-r,cy,cx,cy-r,color);
  };
  const spark=(cx:number,cy:number,r:number,color:string)=>{
    rect(cx-r,cy,2*r+2,2,color);rect(cx,cy-r,2,2*r+2,color);
  };
  const scatter=(color:string,count=7)=>{
    for(let i=0;i<count;i++){
      const a=i*Math.PI*2/count, r=5+Math.max(0,t-.4)*34;
      rect(end.x+Math.cos(a)*r,end.y+Math.sin(a)*r,3,3,color);
    }
  };
  c.save();
  try {
    c.globalAlpha=t<.75?1:Math.max(0,(1-t)/.25);
    c.imageSmoothingEnabled=false;
    switch(style){
      case 'fire':
        for(let i=0;i<7;i++){
          const fx=x-dir*i*5,fy=y+Math.sin(i*2+frame*.5)*5;
          rect(fx-3,fy-6-i%3,7,11,'#bd4938');rect(fx-2,fy-5,5,8,'#f58e38');
          rect(fx,fy-2,2,4,'#ffe99c');rect(fx+2,fy-10,2,3,'#f7c66a');
        }
        if(p===1)scatter('#efad48');break;
      case 'water':
        for(let i=0;i<10;i++){
          const wx=x-dir*i*5,wy=y+Math.sin(frame*.45-i*.7)*3;
          rect(wx-2,wy-2,6,5,'#448abd');rect(wx-1,wy-2,4,2,'#c2f1fa');
        }
        if(p===1){diamond(end.x,end.y,7+(frame%5),'#94dfef');scatter('#7ccde4');}break;
      case 'vine': {
        const midx=(start.x+x)/2,midy=(start.y+y)/2+Math.sin(t*Math.PI)*22;
        line(start.x,start.y,midx,midy,'#416d3c',4);line(midx,midy,x,y,'#416d3c',4);
        line(start.x,start.y-1,midx,midy-1,'#9bc55b');line(midx,midy-1,x,y-1,'#9bc55b');
        if(p===1)spark(end.x,end.y,8,'#deefaa');break;
      }
      case 'leaf':
        for(let i=0;i<6;i++){
          const lx=x-dir*i*7,ly=y+Math.sin(t*9+i*1.6)*12;
          line(lx-4,ly+3,lx+4,ly-3,'#407346',4);line(lx-2,ly+2,lx+3,ly-2,'#bad975');
          if(technique.move==='매지컬리프')spark(lx-5,ly-5,2,i%2?'#d7b6ee':'#f3de86');
        }break;
      case 'absorb':
        diamond(end.x,end.y,8+frame%8,'#86bd76');
        for(let i=0;i<7;i++){
          const q=(t+i/7)%1,ax=end.x+(start.x-end.x)*q,ay=end.y+(start.y-end.y)*q-Math.sin(q*Math.PI)*18;
          rect(ax-2,ay-2,5,5,'#71aa63');spark(ax,ay,2,'#e4f1aa');
        }break;
      case 'electric': {
        let ax=start.x,ay=start.y;
        for(let i=1;i<=9;i++){
          const q=i/9*p,bx=start.x+(end.x-start.x)*q,by=start.y+(end.y-start.y)*q+(i%2?1:-1)*(5+frame%4);
          line(ax,ay,bx,by,'#b59840',4);line(ax,ay,bx,by,'#fff0a1');ax=bx;ay=by;
        }
        if(p===1){spark(end.x,end.y,13,'#ffdf70');diamond(end.x,end.y,18,'#fff3b6');}break;
      }
      case 'rock':
        for(let i=0;i<5;i++){
          const rx=end.x+(i-2)*10,ry=end.y-38+Math.min(1,t*1.8)*40+(i%2)*6;
          rect(rx-4,ry-3,9,8,'#786c60');rect(rx-3,ry-4,7,6,'#afa38c');rect(rx-2,ry-3,4,2,'#d0c5a9');
        }
        if(t>.5)scatter('#bca78a');break;
      case 'ghost':
        for(let i=0;i<6;i++){
          const gx=x+Math.cos(i+frame*.2)*10,gy=y+Math.sin(i+frame*.2)*8;
          rect(gx-4,gy-4,9,9,'#66557f');rect(gx-2,gy-3,5,6,'#b49dcc');
        }
        rect(x-5,y-2,3,2,'#f5dfe8');rect(x+3,y-2,3,2,'#f5dfe8');break;
      case 'lick':
        line(x-dir*24,y+4,x,y,'#9a597d',7);line(x-dir*23,y+3,x,y,'#e5a4b4',4);
        if(p===1){line(end.x-6,end.y-6,end.x+5,end.y+6,'#f5cbd2',4);scatter('#c5a1cf',4);}break;
      case 'psychic':
        for(let i=0;i<3;i++)diamond(end.x,end.y,6+(frame+i*7)%25,i%2?'#dea3cf':'#9882c1');
        spark(end.x,end.y,3,'#f9d8ee');break;
      case 'fight':
        if(technique.move==='발경'){
          diamond(end.x,end.y,7+frame%16,'#eec99a');diamond(end.x,end.y,4+frame%12,'#b67861');
        }else{
          line(x-9,y-13,x+8,y+8,'#985c50',7);line(x-7,y-13,x+9,y+6,'#e6b58d',4);
        }
        spark(x,y,10,'#f9e4b1');break;
      case 'scratch':
        for(let i=0;i<3;i++){
          const sx=end.x-13+i*9,sy=end.y-14,reach=8+Math.min(1,t*3)*20;
          line(sx,sy,sx-8,sy+reach,'#a98683',3);line(sx+1,sy,sx-7,sy+reach,'#fff0dc');
        }break;
      case 'wing':
        for(let i=0;i<5;i++){
          const wx=x-dir*i*6,wy=y+(i-2)*5;
          line(wx-dir*10,wy+4,wx,wy,'#829daf',3);line(wx-dir*8,wy+3,wx,wy,'#e4edf0');
        }
        if(p===1)diamond(end.x,end.y,8+frame%10,'#d5e8e6');break;
      case 'quick':
        for(let i=0;i<5;i++)line(x-dir*(12+i*6),y+(i-2)*4,x-dir*i*3,y+(i-2)*4,'#e8e4c9');
        spark(x,y,9,'#fff5d6');break;
      case 'guard':
        diamond(end.x,end.y,21,'#517f9a');diamond(end.x,end.y,19,'#a6d9d9');
        diamond(end.x,end.y,15,'#d6f2e1');
        spark(end.x+Math.sin(t*8)*13,end.y-14,3,'#f3fcde');break;
      case 'cry':
        for(let i=0;i<3;i++){
          const q=(t+i/3)%1,cx=start.x+(end.x-start.x)*q,cy=start.y+(end.y-start.y)*q,r=4+q*13;
          line(cx-dir*r/2,cy-r,cx+dir*r/2,cy,'#d5afcc');
          line(cx+dir*r/2,cy,cx-dir*r/2,cy+r,'#f4daea');
        }break;
      case 'tail': {
        const sway=Math.sin(t*Math.PI*5)*10;
        line(start.x,start.y+4,start.x-dir*8+sway,start.y-7,'#d1b183',5);
        line(start.x-dir*8+sway,start.y-7,start.x-dir*14+sway,start.y-15,'#f0dbaf',4);
        for(let i=0;i<3;i++){
          const tx=end.x-12+i*12,ty=end.y-9+frame%12;
          line(tx-3,ty,tx,ty+4,'#9baed1');line(tx,ty+4,tx+3,ty,'#9baed1');
        }break;
      }
      default:
        if(technique.move==='박치기'){
          diamond(x,y,12,'#b79b7d');diamond(x,y,9,'#f5ddb3');
          line(x-dir*18,y-5,x-dir*8,y-5,'#c9b397',3);
          line(x-dir*18,y+5,x-dir*8,y+5,'#c9b397',3);
        }
        for(let i=0;i<6;i++){
          const a=i*Math.PI/3,r=8+(frame%8);
          line(x+Math.cos(a)*4,y+Math.sin(a)*4,x+Math.cos(a)*r,y+Math.sin(a)*r,'#ead3a4',3);
        }
        spark(x,y,4,'#fff3d6');
    }
  } finally {c.restore();}
}

/** Declaration-only pixels; the following damage page owns recoil and HP. */
function paintStarterTechnique(c:CanvasRenderingContext2D, technique:MoveTechnique, elapsed:number):void {
  if(!Number.isFinite(elapsed)||elapsed<0||elapsed>=.9)return;
  const enemy=technique.target==='enemy',sx=enemy?64:196,sy=enemy?103:58;
  const ex=enemy?196:64,ey=enemy?58:103,dx=ex-sx,dy=ey-sy;
  const travel=Math.max(0,Math.min(1,(elapsed-.15)/.5));
  const fade=Math.max(0,(elapsed-.65)/.25),frame=Math.floor(elapsed*30);
  const fire=technique.move==='불꽃세례',vine=technique.move==='덩굴채찍';
  const dark=fire?'#aa4038':vine?'#395f39':'#3677aa';
  const mid=fire?'#ef853a':vine?'#75a64d':'#65b9df';
  const light=fire?'#ffe49a':vine?'#c6df88':'#d5f5fa';
  const pixel=(x:number,y:number,w:number,h:number,color:string)=>{
    const l=Math.max(0,Math.round(x)),top=Math.max(0,Math.round(y));
    const r=Math.min(256,Math.round(x)+w),bottom=Math.min(144,Math.round(y)+h);
    if(r>l&&bottom>top){c.fillStyle=color;c.fillRect(l,top,r-l,bottom-top);}
  };
  const bead=(x:number,y:number)=>{
    pixel(x-3,y-3,7,7,dark);pixel(x-2,y-3,5,5,mid);pixel(x-1,y-2,2,2,light);
  };
  c.save();
  try{
    c.imageSmoothingEnabled=false;
    c.globalAlpha=1-fade;
    if(elapsed<.15){
      const r=5-Math.floor(elapsed/.15*3);
      for(let i=0;i<3;i++)bead(sx+Math.cos(i*2.1)*r,sy+Math.sin(i*2.1)*r);
    }else if(vine){
      const reach=travel*(1-fade),bend=Math.sin(reach*Math.PI)*18;
      for(let i=0;i<=60;i++){
        const q=i/60*reach,x=sx+dx*q,y=sy+dy*q+Math.sin(i/60*Math.PI)*bend;
        pixel(x-1,y,3,3,dark);pixel(x,y,1,1,mid);
      }
      if(fade>0&&fade<.5){pixel(ex-8,ey-1,17,2,light);pixel(ex-1,ey-8,2,17,light);}
    }else if(elapsed<.65){
      const count=fire?4:9;
      for(let i=count-1;i>=0;i--){
        const q=travel-i*(fire?.085:.035);
        if(q<0)continue;
        const x=sx+dx*q,y=sy+dy*q+Math.sin(frame*.7-i)*2;
        bead(x,y);
        if(fire){pixel(x-1,y-6,3,3,mid);pixel(x,y-7,1,2,light);}
      }
    }else{
      for(let i=0;i<7;i++){
        const angle=i*Math.PI*2/7,r=4+fade*19;
        const x=ex+Math.cos(angle)*r,y=ey+Math.sin(angle)*r+(fire?-fade*7:fade*fade*10);
        pixel(x,y,3,fire?3:5,mid);pixel(x,y,2,2,light);
      }
    }
  }finally{c.restore();}
}
