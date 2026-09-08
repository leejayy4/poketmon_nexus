import type { GameMap } from './types';
type Images=Record<string,HTMLImageElement|HTMLCanvasElement>;
export const CITY_BUILDINGS={
  jubilife:[{kind:'center',x:5,y:7,w:5,h:2,door:{x:7,y:8}}],
  oreburgh:[{kind:'center',x:4,y:7,w:5,h:2,door:{x:6,y:8}},{kind:'gym',x:16,y:7,w:8,h:3,door:{x:18,y:9}}],
} as const;
export const GYM_ROCKS=[[4,6,3,2],[10,9,3,2],[4,12,2,2]];
function floor(w:number,h:number,blocks:readonly (readonly number[])[]=[],openings:number[][]=[]){
  const g=Array.from({length:h},(_,y)=>Array.from({length:w},(_,x)=>x>=2&&x<w-2&&y>=3&&y<h-2?'.':'#'));
  for(const[x,y,rw,rh]of blocks)for(let j=y;j<y+rh;j++)for(let i=x;i<x+rw;i++)g[j][i]='#';
  for(const[x,y]of openings)g[y][x]='.';return g.map(r=>r.join(''));
}
function cityFloor(id:'jubilife'|'oreburgh',w:number,h:number,openings:number[][]){return floor(w,h,CITY_BUILDINGS[id].map(b=>[b.x,b.y,b.w,b.h]),[...openings,...CITY_BUILDINGS[id].map(b=>[b.door.x,b.door.y])])}
function center(id:'jubilife_center'|'oreburgh_center',city:'jubilife'|'oreburgh',x:number):GameMap{return {id,name:(city==='jubilife'?'축복':'무쇠')+' 포켓몬센터',width:16,height:14,background:'center',walkable:floor(16,14,[[3,5,10,1]],[[8,12],[8,13]]),warps:[{x:8,y:13,to:city,spawn:{x,y:9},entry:'down',facing:'down'}],npcs:[{id:'nurse',name:'간호사',sprite:'pokemon_breeder_f',x:8,y:6,facing:'down',dialogue:'nurse'}],props:[]}}
export const BADGE_MAPS:Record<'jubilife'|'oreburgh'|'jubilife_center'|'oreburgh_center'|'oreburgh_gym',GameMap>={
  jubilife:{id:'jubilife',name:'축복시티',width:24,height:20,background:'jubilife',walkable:cityFloor('jubilife',24,20,[[22,12],[12,2],[1,12],[1,16]]),
    warps:[{x:1,y:12,to:'eterna_forest',spawn:{x:2,y:12},entry:'left',facing:'right'},{x:1,y:16,to:'research_path',spawn:{x:2,y:12},entry:'left',facing:'right',requiresFlag:'researchDelivered'},{x:22,y:12,to:'route_s01',spawn:{x:3,y:12},entry:'right',facing:'right'},{x:12,y:2,to:'oreburgh',spawn:{x:12,y:20},entry:'up',facing:'up'},
      {x:7,y:8,to:'jubilife_center',spawn:{x:8,y:11},entry:'up',facing:'up'}],
    npcs:[{id:'researchGate',name:'연구 통로 안내원',sprite:'scientist_m',x:2,y:16,facing:'right',dialogue:'researchGate'},{id:'cityGuide',name:'도시 안내원',sprite:'ace_trainer_f',x:13,y:10,facing:'down',dialogue:'cityGuide'}],props:[]},
  oreburgh:{id:'oreburgh',name:'무쇠시티',width:28,height:24,background:'oreburgh',walkable:cityFloor('oreburgh',28,24,[[12,21],[12,22]]),
    warps:[{x:12,y:22,to:'jubilife',spawn:{x:12,y:3},entry:'down',facing:'down'},
      {x:6,y:8,to:'oreburgh_center',spawn:{x:8,y:11},entry:'up',facing:'up'},{x:18,y:9,to:'oreburgh_gym',spawn:{x:8,y:13},entry:'up',facing:'up'}],
    npcs:[{id:'miner',name:'광부',sprite:'worker',x:21,y:17,facing:'left',dialogue:'miner'}],props:[]},
  jubilife_center:center('jubilife_center','jubilife',7),
  oreburgh_center:center('oreburgh_center','oreburgh',6),
  oreburgh_gym:{id:'oreburgh_gym',name:'무쇠체육관',width:17,height:16,background:'oreburgh_gym',walkable:floor(17,16,GYM_ROCKS,[[8,14],[8,15]]),
    warps:[{x:8,y:15,to:'oreburgh',spawn:{x:18,y:10},entry:'down',facing:'down'}],
    npcs:[{id:'roark',name:'관장 강석',sprite:'worker',x:8,y:4,facing:'down',dialogue:'roark'},
      {id:'gymGuide',name:'체육관 안내원',sprite:'rancher',x:12,y:12,facing:'left',dialogue:'gymGuide'},
      {id:'gymTypeTrainer',name:'체육관 수련생',sprite:'ace_trainer_f',x:3,y:9,facing:'right',dialogue:'gymTypeTrainer'},
      {id:'gymSwitchTrainer',name:'체육관 연습생',sprite:'ace_trainer_m',x:13,y:6,facing:'left',dialogue:'gymSwitchTrainer'}],
    props:[{x:11,y:10,dialogue:'gymCartObserve'},{x:5,y:7,dialogue:'gymCartLever'},{x:6,y:7,dialogue:'gymCartLaunch'}]},
};
export function paintCityBuilding(c:CanvasRenderingContext2D,images:Images,b:typeof CITY_BUILDINGS['oreburgh'][number]|typeof CITY_BUILDINGS['jubilife'][number]){
  const source=images['sandgem-reference'];
  if(b.kind==='center'){
    const x=b.x*16,y=(b.y+2)*16-78;
    c.save();c.beginPath();[[4,24],[8,14],[40,0],[76,14],[82,26],[80,78],[0,78],[0,30]].forEach(([a,d],i)=>i?c.lineTo(x+a,y+d):c.moveTo(x+a,y+d));c.closePath();c.clip();c.drawImage(source,232,70,82,78,x,y,82,78);c.restore();
  }else{
    const x=b.x*16-8,y=b.y*16-53;
    c.save();c.beginPath();[[5,4],[92,4],[92,13],[137,13],[137,88],[92,88],[92,101],[5,101]].forEach(([a,d],i)=>i?c.lineTo(x+a,y+d):c.moveTo(x+a,y+d));c.closePath();c.clip();c.drawImage(source,80,46,140,105,x,y,140,105);c.restore();
    c.fillStyle='#f6efd0';c.fillRect(x+13,y+62,37,12);c.fillStyle='#495979';c.font='8px Galmuri';c.fillText('GYM',x+18,y+64);
  }
}
export function buildBadgeArt(images:Images,id:'jubilife'|'oreburgh'|'center'|'oreburgh_gym',override?:GameMap){
  const map=override??(id==='center'?BADGE_MAPS.jubilife_center:BADGE_MAPS[id]);
  const canvas=document.createElement('canvas');canvas.width=map.width*16;canvas.height=map.height*16;const c=canvas.getContext('2d')!;c.imageSmoothingEnabled=false;
  const outdoor=id==='jubilife'||id==='oreburgh';
  for(let y=0;y<map.height;y++)for(let x=0;x<map.width;x++){
    if(outdoor){c.drawImage(images['town-reference'],184,16,16,16,x*16,y*16,16,16);if(x<2||x>=map.width-2||y<3||y>=map.height-2)c.drawImage(images['town-reference'],(x%2)*16,(y%4)*16,16,16,x*16,y*16,16,16);}
    else {c.fillStyle=(x<2||x>=map.width-2||y<3||y>=map.height-2)?'#596878':((x+y)%2?'#cbd1d3':'#d6dcdb');c.fillRect(x*16,y*16,16,16);c.fillStyle='#bac6c6';if(x>1&&x<map.width-2&&y>2&&y<map.height-2)c.fillRect(x*16,y*16,16,1);}
  }
  if(outdoor){
    // Broad paving and straight route signs keep the small hub readable.
    for(let y=10;y<=14;y++)for(let x=2;x<map.width-2;x++){c.fillStyle=(x+y)%2?'#d6d3bf':'#dedac7';c.fillRect(x*16,y*16,16,16);}
    for(let y=2;y<map.height-1;y++)for(let x=11;x<=13;x++)if(map.walkable[y][x]==='.'){c.fillStyle='#ddd9bf';c.fillRect(x*16,y*16,16,16);}
    for(const b of CITY_BUILDINGS[id]){c.fillStyle='#ddd9bf';c.fillRect(b.door.x*16,(b.door.y+1)*16,16,(11-b.door.y)*16);}
    for(const w of map.warps){c.fillStyle='#ddd9bf';c.fillRect(w.x*16,w.y*16,16,16);}
  }else if(id==='center'){
    c.fillStyle='#779298';c.fillRect(48,77,160,19);c.fillStyle='#edf0dc';c.fillRect(48,77,160,9);
    c.fillStyle='#c97678';c.fillRect(93,26,70,38);c.fillStyle='#fff5db';c.fillRect(123,31,10,28);c.fillRect(114,40,28,10);
    c.fillStyle='#b56967';c.fillRect(112,156,48,36);c.fillRect(128,192,16,32);
  }else{
    c.fillStyle='#c1a47e';c.fillRect(119,48,34,176);c.fillRect(128,224,16,32);
    for(const[x,y,w,h]of GYM_ROCKS){c.fillStyle='#656b78';c.fillRect(x*16,y*16+8,w*16,h*16-8);c.fillStyle='#9ca39e';c.fillRect(x*16+3,y*16,w*16-6,h*16-6);c.fillStyle='#c1c2ac';c.fillRect(x*16+6,y*16+2,w*16-12,5);}
  }
  return canvas;
}
