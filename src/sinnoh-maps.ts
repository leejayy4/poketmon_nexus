import type { GameMap,MapId } from './types';
import { BADGE_MAPS,buildBadgeArt } from './badge-maps';
import { paintTallGrass } from './town';
export const SINNOH_CITIES=['eterna','hearthome','veilstone'] as const;
export const SINNOH_CENTERS=['eterna_center','hearthome_center','veilstone_center'] as const;
export const SINNOH_GYMS=['eterna_gym','hearthome_gym','veilstone_gym'] as const;
function copy(map:GameMap){return JSON.parse(JSON.stringify(map)) as GameMap}
function open(map:GameMap,x:number,y:number){map.walkable[y]=map.walkable[y].slice(0,x)+'.'+map.walkable[y].slice(x+1)}
const result:Partial<Record<MapId,GameMap>>={};
for(let i=0;i<3;i++){
  const id=SINNOH_CITIES[i],name=['영원','연고','장막'][i],center=SINNOH_CENTERS[i],gym=SINNOH_GYMS[i];
  const city=copy(BADGE_MAPS.oreburgh);Object.assign(city,{id,name:name+'시티',background:id,npcs:[{id:'localGuide',name:'도시 안내원',sprite:'ace_trainer_f',x:12,y:10,facing:'down',dialogue:'sinnohGuide'}]});
  city.walkable[21]='#'.repeat(28);city.walkable[22]='#'.repeat(28);open(city,1,12);
  city.warps=[{x:1,y:12,to:(['eterna_forest','coronet_pass','hearthome'] as const)[i],spawn:{x:i===2?25:26,y:12},entry:'left',facing:'left'},
    {x:6,y:8,to:center,spawn:{x:8,y:11},entry:'up',facing:'up'},{x:18,y:9,to:gym,spawn:{x:8,y:13},entry:'up',facing:'up'}];
  if(i<2){open(city,26,12);city.warps.push({x:26,y:12,to:i===0?'coronet_pass':'veilstone',spawn:{x:2,y:12},entry:'right',facing:'right'})}
  if(i===2)city.npcs.push({id:'observer',name:'관측 연구원',sprite:'scientist_f',x:21,y:16,facing:'left',dialogue:'observation'});
  result[id]=city;
  const c=copy(BADGE_MAPS.oreburgh_center);Object.assign(c,{id:center,name:name+' 포켓몬센터'});c.warps[0].to=id;result[center]=c;
  const g=copy(BADGE_MAPS.oreburgh_gym);Object.assign(g,{id:gym,name:name+'체육관',background:gym});g.warps[0].to=id;
  Object.assign(g.npcs[0],{id:['gardenia','fantina','maylene'][i],name:'관장 '+['유채','멜리사','자두'][i],sprite:['gardener','scientist_f','ace_trainer_f'][i],dialogue:['gardenia','fantina','maylene'][i]});g.npcs[1].dialogue='sinnohGymGuide';result[gym]=g;
}
function corridor(id:MapId,name:string,left:MapId,right:MapId):GameMap{
  const map:GameMap={id,name,width:28,height:20,background:id,walkable:Array.from({length:20},(_,y)=>Array.from({length:28},(_,x)=>x>=2&&x<=25&&y>=4&&y<=16?'.':'#').join('')),warps:[{x:1,y:12,to:left,spawn:{x:left==='jubilife'?2:25,y:12},entry:'left',facing:'left'},{x:27,y:12,to:right,spawn:{x:2,y:12},entry:'right',facing:'right'}],npcs:[{id:'trailGuide',name:'길 안내원',sprite:'rancher',x:14,y:11,facing:'down',dialogue:'trailGuide'}],props:[]};
  open(map,1,12);open(map,26,12);open(map,27,12);return map;
}
result.eterna_forest=corridor('eterna_forest','영원숲','jubilife','eterna');
result.eterna_forest.terrain=[{kind:'tallGrass',x:6,y:6,w:6,h:4},{kind:'tallGrass',x:18,y:14,w:6,h:3}];
result.coronet_pass=corridor('coronet_pass','천관산 하부','eterna','hearthome');
result.coronet_pass.terrain=[{kind:'tallGrass',x:6,y:6,w:6,h:4}];
result.research_path=corridor('research_path','서부 연구 연결길','jubilife','canalave');
result.research_path.warps[0].spawn={x:3,y:16};result.research_path.warps[1].spawn={x:21,y:12};
for(const id of ['canalave','vermilion_port'] as const){
  const m=copy(BADGE_MAPS.jubilife);Object.assign(m,{id,name:id==='canalave'?'운하항':'갈색항',background:id,warps:[],props:[],npcs:[{id:'sailor',name:'조사선 선원',sprite:'worker',x:12,y:16,facing:'up',dialogue:'ferry'}]});
  m.walkable=Array.from({length:20},(_,y)=>Array.from({length:24},(_,x)=>(x>=2&&x<=21&&y>=4&&y<=14)||(x>=11&&x<=13&&y>=15&&y<=17)?'.':'#').join(''));
  if(id==='canalave'){open(m,22,12);m.warps=[{x:22,y:12,to:'research_path',spawn:{x:26,y:12},entry:'right',facing:'right'}];}
  result[id]=m;
}
export const SINNOH_MAPS=result as Record<'eterna_forest'|'eterna'|'eterna_center'|'eterna_gym'|'coronet_pass'|'hearthome'|'hearthome_center'|'hearthome_gym'|'veilstone'|'veilstone_center'|'veilstone_gym'|'research_path'|'canalave'|'vermilion_port',GameMap>;
export const SINNOH_STARTS=Object.fromEntries(Object.keys(SINNOH_MAPS).map(id=>[id,id.endsWith('_center')?[8,11]:id.endsWith('_gym')?[8,13]:id==='canalave'||id==='vermilion_port'?[12,15]:[2,12]])) as Record<keyof typeof SINNOH_MAPS,[number,number]>;
export function buildSinnohArt(images:Record<string,HTMLImageElement|HTMLCanvasElement>,map:GameMap){
  if(SINNOH_CITIES.includes(map.id as any))return buildBadgeArt(images,'oreburgh',map);
  if(SINNOH_GYMS.includes(map.id as any)){
    const c=buildBadgeArt(images,'oreburgh_gym'),ctx=c.getContext('2d')!;ctx.fillStyle=map.id==='eterna_gym'?'#5d996733':map.id==='hearthome_gym'?'#7b528433':'#ba754a33';ctx.fillRect(32,48,208,176);return c;
  }
  if(map.id.endsWith('_center'))return buildBadgeArt(images,'center');
  const c=document.createElement('canvas');c.width=map.width*16;c.height=map.height*16;const ctx=c.getContext('2d')!;ctx.imageSmoothingEnabled=false;
  const port=map.id==='canalave'||map.id==='vermilion_port',mountain=map.id==='coronet_pass';
  for(let y=0;y<map.height;y++)for(let x=0;x<map.width;x++){
    const floor=map.walkable[y][x]==='.';
    if(port){ctx.fillStyle=floor?(y>=15?'#ae9268':'#d1ccb1'):'#508dad';ctx.fillRect(x*16,y*16,16,16);ctx.fillStyle=floor?'#b4ac93':'#88bdd2';ctx.fillRect(x*16+2,y*16+12,12,1);}
    else if(mountain){ctx.fillStyle=floor?'#b6b4a3':'#717987';ctx.fillRect(x*16,y*16,16,16);ctx.fillStyle=floor?'#c6c3b1':'#929996';ctx.fillRect(x*16+2,y*16+2,12,3);}
    else {ctx.drawImage(images['town-reference'],floor?184:(x%2)*16,floor?16:(y%4)*16,16,16,x*16,y*16,16,16);if(floor&&y>=11&&y<=13){ctx.fillStyle='#d9cfac';ctx.fillRect(x*16,y*16,16,16);}}
  }
  for(const r of map.terrain??[])for(let y=r.y;y<r.y+r.h;y++)for(let x=r.x;x<r.x+r.w;x++)paintTallGrass(ctx,x*16,y*16,false,0,images['grass-reference']);
  if(port){ctx.fillStyle='#f2ead0';ctx.fillRect(224,230,74,29);ctx.fillStyle='#a16f4d';ctx.fillRect(228,255,66,9);ctx.fillStyle='#527a80';ctx.fillRect(238,225,40,15);ctx.fillStyle='#e6b57a';ctx.fillRect(250,218,15,7);}
  return c;
}
