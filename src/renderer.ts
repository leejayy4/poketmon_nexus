import { withParticle } from './korean-text';
import { paintOreburghGymBattleArena } from './oreburgh-gym-art';
import { paintEternaGymBattleArena } from './eterna-gym-art';
import { paintHearthomeGymBattleArena } from './hearthome-gym-art';
import { paintVeilstoneGymBattleArena } from './veilstone-gym-art';
import { paintCoronetBattleArena } from './coronet-art';
import { paintFerryJourney,ferryProgress,type FerryJourneyView } from './ferry-art';
import { gymCartView } from './gym-cart';
import { paintGymCart,paintGymCartSamples } from './gym-cart-art';
import { isOreburghCave, paintCaveEncounter, paintCaveBattleArena } from './oreburgh-cave-art';
import { paintJourneyOverlay } from './journey-art';
import { paintMoveTechnique } from './move-art';
import { showPokedex } from './journey-services';
import { worldGymDoor } from './unified-world';
import { adventureGuide } from './adventure-guide';
import { fieldPotionPreview } from './team';
import { experienceParticipants,moveType,opponentTrainerName } from './battle';
import { battleHint } from './battle-hints';
import { paintCenterFurnishing,paintCenterReception } from './explore-center-art';
import { paintTourFurnishing } from './explore-interior-art';
import { tourMapMarkers,tourMinimapLayout,tourMarkerBounds } from './explore-minimap';
import { FIELD_POKEMON } from './explore-pokemon';
import { paintTownPokemon,paintTourWaterMotion } from './explore-life-art';
import { groveTrees,paintGroveTree } from './explore-tree-art';
import { forestBorderTrees } from './forest-border-art';
import { DIRECTION_LABEL,tourPassageLabel } from './explore-navigation';
import { Engine } from './engine';
import { SPECIES, STARTERS,pokemonMoves } from './pokemon';
import type { Direction, Pokemon } from './types';
import { buildTownArt,paintTallGrass,TOWN_BUILDINGS,paintBuilding } from './town';
import { CITY_BUILDINGS,buildBadgeArt,paintCityBuilding } from './badge-maps';
import { LEVEL_CAP,nextLevelXp } from './growth';
import { growthPreview } from './growth-preview';
import { GYMS,gymById,gymPreparation } from './gyms';
import { TOUR_MAPS,TOUR_INTERIORS,TOUR_OUTDOORS,TOUR_BUILDINGS,TOUR_FEATURES,tourPlaceForMap,placeById,PLACES } from './explore-world';
import { buildExploreArt,paintTourSign,paintTourBuilding,TOUR_COLORS } from './explore-art';
import { SINNOH_MAPS,SINNOH_CITIES,buildSinnohArt } from './sinnoh-maps';
import { buildRouteArt, ROUTE_SIGN } from './route';
import { spriteFrame,recolorSprite } from './sprites';
type Hit = { x:number;y:number;w:number;h:number;action:()=>void };
const W=256,H=192;
const INK='#384750',PAPER='#f8f8e8';
const TYPE_COLORS:Record<string,string>={'노말':'#9b9983','풀':'#6c9c4d','독':'#a16ca0','물':'#5c91b1','불꽃':'#c87d55','전기':'#bba149','바위':'#9a8861','땅':'#aa8455','고스트':'#79648f','에스퍼':'#bd7189','격투':'#a56b59'};
export class Renderer {
  ctx:CanvasRenderingContext2D; touch:CanvasRenderingContext2D; images:Record<string,HTMLImageElement|HTMLCanvasElement>={}; hits:Hit[]=[];
  constructor(public game:Engine,public field:HTMLCanvasElement,public bottom:HTMLCanvasElement){this.ctx=field.getContext('2d')!;this.touch=bottom.getContext('2d')!;this.ctx.imageSmoothingEnabled=false;this.touch.imageSmoothingEnabled=false;}
  async load(){const names=[...FIELD_POKEMON.map(n=>'field-'+n),'center-reference','pokecenter_nurse','jubilife-reference','eevee-play','bedroom-reference','home-reference','town-reference','lab-reference','sandgem-reference','grass-reference','player_m','mom','prof_rowan','scientist_m','youngster','lass','old_man','middle_aged_man','ace_trainer_m','ace_trainer_f','scientist_f','pokemon_breeder_f','worker','rancher','school_kid_m','school_kid_f',...Object.keys(SPECIES).flatMap(n=>['pokemon-'+n,'pokemon-back-'+n])];await Promise.all(names.map(name=>new Promise<void>((resolve,reject)=>{const im=new Image();im.onload=()=>{this.images[name]=im;resolve()};im.onerror=()=>reject(Error('리소스를 불러오지 못했습니다: '+name));im.src='/assets/'+name+'.png'})));await document.fonts.load('10px Galmuri');
    this.images.hero=recolorSprite(this.images.ace_trainer_m as HTMLImageElement,{'637b4a':'4a627b','425239':'303e53','8ca563':'7894a5','9c5a63':'b57947','de8c73':'ebba73','4a3139':'493e38'});
    this.images.professor=recolorSprite(this.images.scientist_f as HTMLImageElement,{'525a52':'696078','848c6b':'aaa0b1','313139':'40384d','c66b52':'579e96'});
    this.images.mother=recolorSprite(this.images.pokemon_breeder_f as HTMLImageElement,{'42735a':'706492','52a584':'9b8bbb','294a4a':'453d65'});
    this.images.gardener=recolorSprite(this.images.ace_trainer_f as HTMLImageElement,{'637b4a':'735544','425239':'493c36','8ca563':'af8660'});
    this.images.town=buildTownArt(this.images);this.images.route_s01=buildRouteArt(this.images);for(const id of ['jubilife','oreburgh','center','oreburgh_gym'] as const)this.images[id]=buildBadgeArt(this.images,id);for(const map of Object.values(SINNOH_MAPS))this.images[map.background]=buildSinnohArt(this.images,map);for(const id of Object.keys(TOUR_MAPS))this.images[id]=buildExploreArt(this.images,id);
  }
  rect(c:CanvasRenderingContext2D,x:number,y:number,w:number,h:number,color:string){c.fillStyle=color;c.fillRect(Math.round(x),Math.round(y),w,h)}
  line(c:CanvasRenderingContext2D,x1:number,y1:number,x2:number,y2:number,color:string){c.strokeStyle=color;c.lineWidth=1;c.beginPath();c.moveTo(x1+.5,y1+.5);c.lineTo(x2+.5,y2+.5);c.stroke()}
  text(c:CanvasRenderingContext2D,text:string,x:number,y:number,color=INK,size=10,align:CanvasTextAlign='left'){c.fillStyle=color;c.font=`${size}px Galmuri`;c.textBaseline='top';c.textAlign=align;for(const [i,line]of text.split('\n').entries())c.fillText(line,Math.round(x),Math.round(y+i*(size+5)));c.textAlign='left'}
  frame(c:CanvasRenderingContext2D,x:number,y:number,w:number,h:number,fill=PAPER){this.rect(c,x,y,w,h,'#394954');this.rect(c,x+1,y+1,w-2,h-2,'#a0b1b9');this.rect(c,x+3,y+3,w-6,h-6,'#fff');this.rect(c,x+5,y+5,w-10,h-10,fill);}
  ball(c:CanvasRenderingContext2D,x:number,y:number,r=5,selected=false){c.fillStyle='#34464b';c.beginPath();c.arc(x,y,r+1,0,Math.PI*2);c.fill();c.fillStyle=selected?'#f39867':'#de6a62';c.beginPath();c.arc(x,y,r,Math.PI,0);c.fill();c.fillStyle='#f2f1df';c.beginPath();c.arc(x,y,r,0,Math.PI);c.fill();this.rect(c,x-r,y-1,r*2,2,'#34464b');this.rect(c,x-2,y-2,4,4,'#34464b');this.rect(c,x-1,y-1,2,2,'#f6f9e5')}
  battleArena(c:CanvasRenderingContext2D){const battle=this.game.presentedBattle;if(battle?.kind==='gym'&&battle.gymId==='maylene'){paintVeilstoneGymBattleArena(c);return;}if(battle?.kind==='gym'&&battle.gymId==='fantina'){paintHearthomeGymBattleArena(c);return;}if(battle?.kind==='gym'&&battle.gymId==='gardenia'){paintEternaGymBattleArena(c);return;}if((battle?.kind==='gym'&&battle.gymId==='roark')||(battle?.kind==='trainer'&&this.game.save.map==='oreburgh_gym')){paintOreburghGymBattleArena(c);return;}if(battle?.kind==='wild'&&this.game.save.map==='tour_coronet'){paintCoronetBattleArena(c);return;}if(isOreburghCave(this.game.save.map)){paintCaveBattleArena(c);return;}this.rect(c,0,0,256,192,'#e7edd5');for(let y=0;y<62;y+=3)this.rect(c,0,y,256,1,'#dce7cb');const drift=Math.floor(this.game.clock*5)%286;for(const [x,y,w]of [[-12,12,18],[84,31,24],[194,8,16]] as const){const px=(x+drift)%286-15;this.rect(c,px,y,w,2,'#f3f3dc');this.rect(c,px+4,y-2,w-8,2,'#f3f3dc');this.rect(c,px+7,y+2,w-13,1,'#d4dfca');}for(const [x,w,h]of [[-20,56,7],[48,42,4],[126,68,8],[212,51,5]] as const)this.rect(c,x,62-h,w,h,'#b4c69a');this.rect(c,0,62,256,130,'#c7d7aa');for(let y=72;y<192;y+=16)for(let x=(y%32?7:15);x<256;x+=37)this.rect(c,x,y,5,1,'#afc58d');for(const [x,y,rx,ry]of [[196,84,53,12],[59,133,70,19]] as const){c.fillStyle='#76996e';c.beginPath();c.ellipse(x,y+3,rx,ry,0,0,Math.PI*2);c.fill();c.fillStyle='#9fbd7e';c.beginPath();c.ellipse(x,y,rx-2,ry-3,0,0,Math.PI*2);c.fill();c.fillStyle='#dbe5b6';c.beginPath();c.ellipse(x,y-3,rx-7,ry-6,0,0,Math.PI*2);c.fill();this.rect(c,x-rx+12,y-2,rx-13,1,'#eef0cc');this.rect(c,x+5,y+5,rx-13,1,'#8bad76');}}
  draw(){if(this.game.ferryJourney){this.ferry(this.game.ferryJourney);return;}this.world();this.lower();if(this.game.transition){const alpha=this.game.transition>.18?Math.min(1,(.4-this.game.transition)/.16):this.game.transition/.18;this.ctx.fillStyle=`rgba(0,0,0,${alpha})`;this.ctx.fillRect(0,0,W,H)}if(this.game.toastTime>0){this.frame(this.touch,8,153,240,31);this.text(this.touch,this.game.toast,128,163,INK,8,'center')}}
  ferry(view:FerryJourneyView){
    this.hits=[];paintFerryJourney(this.ctx,view);
    const c=this.touch;this.rect(c,0,0,W,H,'#dfe7d9');this.frame(c,10,25,236,142,'#f4f0d7');
    this.text(c,'조사선 항해',128,42,INK,11,'center');
    this.text(c,view.outbound?'운하항 → 갈색항':'갈색항 → 운하항',128,67,INK,11,'center');
    this.rect(c,38,106,180,2,'#8aaca8');this.rect(c,38,108,180,1,'#c5d5bc');
    for(const x of [36,216]){this.rect(c,x,103,5,7,'#5b8286');this.rect(c,x+1,104,3,4,'#d8dabe');}
    const marker=43+Math.round(ferryProgress(view)*166);
    this.rect(c,marker-3,101,7,8,'#537d88');this.rect(c,marker-2,102,5,5,'#c4d9cd');
    this.text(c,'바다를 건너고 있어요',128,133,'#627d79',9,'center');
  }
  world(){const c=this.ctx,g=this.game,map=g.map;if(g.showingGymReward){this.gymRewardTop(c);if(g.dialogue)this.dialogue(c,false);return}if(g.showingCatch){this.catchTop(c);if(g.dialogue)this.dialogue(c,false);return}if(g.presentedBattle){this.battleTop(c);if(g.dialogue)this.dialogue(c);return}this.rect(c,0,0,W,H,'#101b20');const pos=g.position;
    const camera=(p:number,total:number,view:number)=>total<view?(total-view)/2:Math.max(0,Math.min(total-view,p-view/2));
    const cx=Math.round(camera(pos.x*16+8,map.width*16,W)),cy=Math.round(camera(pos.y*16+8,map.height*16,H));
    c.save();c.translate(-cx,-cy);c.drawImage(this.images[map.background],0,0);
    paintTourWaterMotion(c,TOUR_FEATURES[map.id]??[],g.clock);
    if(map.id==='tour_jubilife')for(const r of map.terrain??[]){this.rect(c,r.x*16-3,r.y*16-3,r.w*16+6,r.h*16+6,'#8c9c77');this.rect(c,r.x*16-1,r.y*16-1,r.w*16+2,r.h*16+2,'#cee0a4');}
    if(['tour_eterna_forest','tour_coronet','tour_jubilife'].includes(map.id))for(const r of map.terrain??[])for(let y=r.y;y<r.y+r.h;y++)for(let x=r.x;x<r.x+r.w;x++)paintTallGrass(c,x*16,y*16,false,g.clock,this.images['grass-reference']);
    if(map.id==='town')for(let k=0;k<4;k++){this.rect(c,465+((k*19+Math.floor(g.clock*3))%78),237+(k%2)*17,7,1,'#a3d9ed')}
    const layers:{depth:number;draw:()=>void}[]=[];
    if(map.id==='oreburgh_gym'){const view=gymCartView(g);layers.push({depth:7.9,draw:()=>paintGymCart(c,view)},{depth:10.9,draw:()=>paintGymCartSamples(c,view)});}
    for(const tree of forestBorderTrees(map))layers.push({depth:tree.depth,draw:()=>paintGroveTree(c,this.images['sandgem-reference'],tree)});
    for(const f of TOUR_FEATURES[map.id]??[])for(const tree of groveTrees(f))layers.push({depth:tree.depth,draw:()=>paintGroveTree(c,this.images['sandgem-reference'],tree)});
    for(const n of [...map.npcs.map(n=>({...n,...(n.id==='tourPokemon'?g.roaming?.position:{}),player:false})),{...pos,facing:g.save.player.facing,sprite:'hero',player:true}])layers.push({depth:n.y,draw:()=>{
      if(n.sprite.startsWith('field-')&&g.roaming)paintTownPokemon(c,this.images,g.roaming.position,g.clock,g.save.player.facing,g.dialogue?.speaker===g.roaming.npc.name,g.roaming.move?g.roaming.move.elapsed/g.roaming.move.duration:undefined);
      else if(n.sprite==='eevee-play')this.eevee(c,n.x*16+8,n.y*16+8);
      else this.character(c,n.sprite,n.x*16+8,n.y*16+8,n.facing,n.player&&!!g.move);
    }});
    if(map.id==='town'){
      for(const b of TOWN_BUILDINGS)layers.push({depth:b.y+b.h-1.1,draw:()=>paintBuilding(c,this.images,b)});
      layers.push({depth:17,draw:()=>c.drawImage(this.images['town-reference'],245,156,24,26,268,260,24,26)});
      // The southern forest stands in front of the last walkable row.
      layers.push({depth:27,draw:()=>c.drawImage(this.images.town,0,432,640,48,0,432,640,48)});
    }
    if(map.id==='jubilife'||map.id==='oreburgh'||SINNOH_CITIES.includes(map.id as any))for(const b of CITY_BUILDINGS[map.id==='jubilife'?'jubilife':'oreburgh'])layers.push({depth:b.y+b.h-.1,draw:()=>paintCityBuilding(c,this.images,b)});
    if(map.id==='route_s01')layers.push({depth:ROUTE_SIGN.y,draw:()=>c.drawImage(this.images['town-reference'],245,156,24,26,ROUTE_SIGN.x*16-4,ROUTE_SIGN.y*16-12,24,26)});
    if(map.id==='lab'){
      layers.push({depth:6,draw:()=>this.labTable(c)});
      for(const r of [[8,90,31,43,7],[169,90,31,43,7],[24,55,48,24,4],[8,166,38,47,12],[162,166,38,47,12]])layers.push({depth:r[4],draw:()=>c.drawImage(this.images['lab-reference'],r[0],r[1],r[2],r[3],r[0],r[1],r[2],r[3])});
      layers.push({depth:4.2,draw:()=>{const t=(Math.sin(g.clock*2)+1)/2;this.ball(c,257+t*15,76-Math.sin(t*Math.PI)*7,3);}});
    }
    if(map.id==='bedroom')layers.push({depth:8,draw:()=>c.drawImage(this.images[map.background],144,103,32,37,144,103,32,37)});
    if(['home','neighbor','cottage'].includes(map.id)){
      for(const r of [[46,94,32,28,7],[112,104,40,12,6]])layers.push({depth:r[4],draw:()=>c.drawImage(this.images[map.background],r[0],r[1],r[2],r[3],r[0],r[1],r[2],r[3])});
    }
    for(const sign of TOUR_OUTDOORS[map.id]?.signs??[])layers.push({depth:sign.y+.1,draw:()=>paintTourSign(c,this.images,sign)});
    if(TOUR_BUILDINGS[map.id])for(const b of TOUR_BUILDINGS[map.id])layers.push({depth:b.y+b.h-.1,draw:()=>paintTourBuilding(c,this.images,tourPlaceForMap(map.id)!,b)});
    const gymDoor=worldGymDoor(map.id);if(gymDoor)layers.push({depth:gymDoor.y+.95,draw:()=>{this.rect(c,gymDoor.x*16-4,gymDoor.y*16-17,24,10,'#455877');this.text(c,'GYM',gymDoor.x*16+8,gymDoor.y*16-16,'#fff2cc',7,'center');}});
    const room=TOUR_INTERIORS[map.id];
    if(room?.style==='center'){
      for(const o of room.objects)layers.push({depth:o.y+o.h-.1,draw:()=>paintCenterFurnishing(c,this.images,o)});
      layers.push({depth:room.reception!.y+.9,draw:()=>paintCenterReception(c,this.images,room)});
    }
    else if(room)for(const o of room.objects)layers.push({depth:o.y+o.h-.1,draw:()=>paintTourFurnishing(c,this.images,room,o)});
    layers.sort((a,b)=>a.depth-b.depth).forEach(l=>l.draw());
    {const x=Math.round(pos.x),y=Math.round(pos.y);if(map.terrain?.some(r=>x>=r.x&&x<r.x+r.w&&y>=r.y&&y<r.y+r.h)){if(isOreburghCave(map.id))paintCaveEncounter(c,x*16,y*16,true,g.move?g.clock:0);else paintTallGrass(c,x*16,y*16,true,g.clock*2+x,this.images['grass-reference']);}}
    paintJourneyOverlay(c,this.images,map,g.save.flags,g.clock);
    c.restore();
    if(g.labelTime>0){const alpha=Math.min(1,g.labelTime*2),w=Math.min(132,22+map.name.length*9);c.globalAlpha=alpha;this.rect(c,6,6,w,17,'#263c42');this.rect(c,7,7,w-2,15,'#708777');this.rect(c,9,9,w-6,11,'#d9d8ab');this.text(c,map.name,15,11,'#35483e',8);c.globalAlpha=1}
    if(g.panel==='menu')this.menuTop(c);
    if(g.panel==='starters'&&!g.dialogue)this.starterTop(c);
    if(g.panel==='summary')this.summaryTop(c);
    if(g.panel==='fieldHeal')this.fieldHealTop(c);
    if(g.dialogue)this.dialogue(c);
  }
  character(c:CanvasRenderingContext2D,name:string,x:number,y:number,dir:Direction,moving:boolean){const g=this.game,image=this.images[name];const frame=spriteFrame(dir,moving,g.stepPhase,g.move?g.move.elapsed/g.move.duration:0,g.keys.has('Shift'),image.height/32);c.fillStyle='#293d393d';c.beginPath();c.ellipse(Math.round(x),Math.round(y-2),6,2,0,0,Math.PI*2);c.fill();c.drawImage(image,0,frame*32,32,32,Math.round(x-16),Math.round(y-30),32,32)}
  eevee(c:CanvasRenderingContext2D,x:number,y:number){const t=this.game.clock,hop=Math.max(0,Math.sin(t*4))*3;const active=!this.game.dialogue;const frame=active?Math.floor(t*4)%2:0;c.fillStyle='#293d393d';c.beginPath();c.ellipse(x,y-2,6,2,0,0,Math.PI*2);c.fill();c.drawImage(this.images['eevee-play'],0,frame*32,32,32,x-16,Math.round(y-31-(active?hop:0)),32,32);}
  labTable(c:CanvasRenderingContext2D){this.rect(c,78,98,52,13,'#5b727a');this.rect(c,78,96,52,10,'#a9bbc5');this.rect(c,80,96,48,5,'#e2e3d3');this.rect(c,80,107,3,6,'#546873');this.rect(c,125,107,3,6,'#546873');if(!this.game.save.flags.starterReceived)for(let i=0;i<3;i++)this.ball(c,87+i*16,97,4);}
  dialogue(c:CanvasRenderingContext2D,showChoices=true){const d=this.game.dialogue!;const page=d.pages[d.page];if(showChoices&&d.choices&&d.page===d.pages.length-1&&d.shown>=page.length){const max=Math.max(...d.choices.map(q=>q.label.length));const w=Math.max(80,max*10+30),h=d.choices.length*19+12;this.frame(c,250-w,128-h,w,h);d.choices.forEach((q,i)=>{this.text(c,q.label,268-w,134-h+i*19,INK,9);if(i===d.selected)this.text(c,'▶',256-w,134-h+i*19,'#b15b45',9)})}this.frame(c,3,132,250,57,'#fffef0');if(d.speaker){this.rect(c,12,126,d.speaker.length*9+14,14,'#415b66');this.text(c,d.speaker,19,128,'#fffde3',8)}this.text(c,page.slice(0,Math.floor(d.shown)),15,146,INK,10);if(d.shown>=page.length&&Math.floor(this.game.clock*3)%2===0)this.text(c,'▼',233,174,'#bd6957',9)}
  menuTop(c:CanvasRenderingContext2D){const labels=['포켓몬','가방','트레이너','리포트','설정','닫기'];this.frame(c,161,5,91,145);labels.forEach((label,i)=>{if(this.game.menuIndex===i){this.rect(c,167,12+i*22,79,21,'#e9deae');this.text(c,'▶',171,18+i*22,'#ad6351',8)}this.text(c,label,187,18+i*22,INK,10)})}
  starterTop(c:CanvasRenderingContext2D){const id=STARTERS[this.game.starterIndex],p=SPECIES[id];this.frame(c,14,19,228,153,'#edf1df');this.rect(c,20,25,216,19,'#547b7e');this.text(c,'함께할 포켓몬을 골라 주세요',128,29,'#fffdea',9,'center');this.pokemon(c,id,44,46,1);this.text(c,p.name,138,62,INK,13);this.text(c,p.genus,139,84,'#7c857a',8);this.typePills(c,p.types,138,102);this.text(c,p.description,128,134,INK,9,'center')}
  pokemon(c:CanvasRenderingContext2D,id:number,x:number,y:number,scale=1){c.drawImage(this.images['pokemon-'+id],x,y,80*scale,80*scale)}
  typePills(c:CanvasRenderingContext2D,types:string[],x:number,y:number){for(const [i,type]of types.entries())this.typeBadge(c,type,x+i*33,y)}
  typeBadge(c:CanvasRenderingContext2D,type:string,x:number,y:number){this.rect(c,x,y,30,13,'#43545a');this.rect(c,x+1,y+1,28,11,TYPE_COLORS[type]??'#7a8582');this.rect(c,x+2,y+2,26,1,'#fff8d8');this.text(c,type,x+14,y+3,'#fffdec',7,'center')}
  summaryTop(c:CanvasRenderingContext2D){const pokemon=this.game.save.party[this.game.partyIndex];if(!pokemon)return;const p=SPECIES[pokemon.species];this.rect(c,0,0,256,192,'#dce8e7');for(let y=25;y<192;y+=4)this.rect(c,0,y,256,1,'#d2e0df');this.rect(c,0,0,256,24,'#547f8b');this.text(c,'포켓몬의 정보',12,8,'#fffbea');this.text(c,`${this.game.partyIndex+1} / ${this.game.save.party.length}`,244,9,'#dfeee3',8,'right');this.frame(c,7,32,104,113,'#f8f3da');this.pokemon(c,pokemon.species,19,38);this.text(c,p.name,59,123,INK,10,'center');this.text(c,`No. ${String(pokemon.species).padStart(3,'0')}`,121,39,'#6c7f7f',8);this.text(c,`Lv. ${pokemon.level}`,239,39,INK,10,'right');this.typePills(c,p.types,121,58);this.text(c,`성격  ${pokemon.nature}`,121,82,INK,9);this.text(c,'만난 장소',121,104,'#7b8984',8);this.text(c,pokemon.met.replace(' · ','\n'),121,120,INK,9);this.frame(c,7,151,242,34);this.text(c,`HP  ${pokemon.hp} / ${pokemon.maxHp}`,19,162,INK,9);this.hp(c,120,164,114,pokemon)}
  hp(c:CanvasRenderingContext2D,x:number,y:number,w:number,p:Pokemon){
    const ratio=Math.max(0,Math.min(1,p.hp/p.maxHp));
    const [fill,shine]=ratio<=.2?['#cc595b','#ef9690']:ratio<=.5?['#cfaa45','#f3d57b']:['#64ad73','#a9d78d'];
    const width=ratio>0?Math.max(1,Math.round((w-2)*ratio)):0;
    this.rect(c,x,y,w,6,'#43565e');this.rect(c,x+1,y+1,w-2,4,'#f0f2ce');
    this.rect(c,x+1,y+1,width,4,fill);this.rect(c,x+1,y+1,width,1,shine);
  }
  experience(c:CanvasRenderingContext2D,x:number,y:number,w:number,p:Pokemon){
    const capped=p.level>=LEVEL_CAP,ratio=capped?1:Math.max(0,Math.min(1,p.experience/nextLevelXp(p.level)));
    this.rect(c,x,y,w,4,'#43565e');this.rect(c,x+1,y+1,w-2,2,'#dce5e7');
    this.rect(c,x+1,y+1,Math.round((w-2)*ratio),2,capped?'#a69b6a':'#599ecb');
  }
  lower(){const c=this.touch,g=this.game;this.hits=[];this.rect(c,0,0,W,H,'#e5e9d8');if(g.showingGymReward){this.gymRewardLower(c)}else if(g.showingCatch){this.catchLower(c)}else if(g.presentedBattle){this.battleLower(c)}else if(g.recoveryPreview&&g.dialogue){this.recovery(c)}else if(g.gymPreview&&g.dialogue){this.gymPreparation(c)}else if(g.panel==='field'||g.panel==='menu'){this.poketch(c);if(g.panel==='menu')this.menuLower(c)}else if(g.panel==='starters')this.starters(c);else if(g.panel==='party'||g.panel==='fieldHeal')this.party(c);else if(g.panel==='summary')this.moves(c);else if(g.panel==='bag')this.bag(c);else if(g.panel==='trainer')this.trainer(c);else if(g.panel==='options')this.options(c);
    if(g.dialogue){this.hits=[];const d=g.dialogue;if(d.choices&&d.page===d.pages.length-1&&d.shown>=d.pages[d.page].length){const step=d.choices.length>4?25:29,start=Math.max(31,188-d.choices.length*step);this.rect(c,5,start-4,246,192-start,'#e5e9d8');d.choices.forEach((choice,i)=>this.button(c,12,start+i*step,232,step-4,choice.label,()=>{d.selected=i;g.confirm()},i===d.selected))}else {this.frame(c,8,151,240,33);this.text(c,'Z / Enter  다음 이야기',128,162,INK,9,'center');this.hits.push({x:0,y:0,w:256,h:192,action:()=>g.confirm()})}}
  }
  topbar(c:CanvasRenderingContext2D,title:string){this.rect(c,0,0,256,27,'#527a80');this.text(c,title,13,9,'#fffce7',10);this.ball(c,240,13,5)}
  gymRewardTop(c:CanvasRenderingContext2D){
    const g=this.game,reward=g.gymReward!,gym=gymById(reward.id);
    this.rect(c,0,0,W,H,'#dce8e7');this.topbar(c,`${gym.name}에게 승리!`);
    this.frame(c,7,33,242,94,'#f8f3da');
    this.text(c,gym.label+' 획득',128,42,INK,13,'center');
    GYMS.forEach((entry,i)=>{const x=78+i*33,earned=g.save.badges.includes(entry.badge),current=entry.id===reward.id;this.frame(c,x-11,62,24,22,current?'#f3df9f':'#e2e5d8');this.text(c,earned?'◆':'◇',x+1,64,earned?['#997457','#668c59','#8e74a1','#ba8564'][i]:'#a1aaa0',17,'center')});
    this.text(c,`기술머신 · ${gym.move}`,128,92,INK,9,'center');
    this.text(c,`상금 +${reward.money.toLocaleString()}원 · 배지 ${g.save.badges.length}/4`,128,109,'#617878',9,'center');
  }
  gymRewardLower(c:CanvasRenderingContext2D){
    const guide=adventureGuide(this.game.save),choices=this.game.dialogue?.choices?.length??0,compact=choices>=3;
    this.topbar(c,'다음 모험을 준비하자');
    if(guide){this.text(c,guide.objective.title,128,compact?31:40,INK,12,'center');this.text(c,guide.lines.join('\n'),128,compact?51:63,'#617878',9,'center');}
    this.text(c,'목표 안내를 누르면 지도에 길을 표시해요.',128,compact?81:99,INK,8,'center');
  }
  catchTop(c:CanvasRenderingContext2D){
    const g=this.game,p=g.caughtPokemon!,species=SPECIES[p.species];
    this.rect(c,0,0,W,H,'#dce8e7');this.topbar(c,'새로운 친구를 만났다!');
    this.frame(c,7,33,242,94,'#f8f3da');this.pokemon(c,p.species,10,39,.95);
    this.text(c,species.name,100,44,INK,13);this.text(c,`Lv.${p.level}`,232,47,INK,10,'right');this.typePills(c,species.types,100,66);
    this.text(c,`HP ${p.hp} / ${p.maxHp}`,100,87,INK,9);this.hp(c,100,106,132,p);
  }
  catchLower(c:CanvasRenderingContext2D){
    const g=this.game,p=g.caughtPokemon!;this.topbar(c,g.caughtBoxPreview?'포획 성공 · PC 박스 보관':'포획 성공 · 파티 등록');
    this.text(c,g.caughtBoxPreview?`박스 ${g.save.box?.length??0}/60마리`:`파티 ${g.caughtPreview!+1}번째 · ${g.save.party.length}/6마리`,128,38,INK,10,'center');
    this.text(c,'만난 장소: '+p.met,128,58,'#617878',9,'center');
    this.text(c,p.hp<p.maxHp?'HP가 줄어 있어요. 회복해 주세요.':'건강한 새 친구와 모험을 이어 가요.',128,79,INK,9,'center');
    this.text(c,g.caughtBoxPreview?'센터 PC에서 파티로 데려올 수 있어요':'정보 보기에서 회복 · 선두 편성',128,99,'#617878',8,'center');
  }
  recovery(c:CanvasRenderingContext2D){
    const s=this.game.save;this.topbar(c,'포켓몬 회복 완료');
    s.party.forEach((p,i)=>{const x=8+(i%2)*124,y=34+Math.floor(i/2)*32;this.frame(c,x,y,116,29,'#f8f3da');this.pokemon(c,p.species,x+1,y-1,.35);this.text(c,SPECIES[p.species].name,x+32,y+5,INK,9);this.text(c,`HP ${p.hp}/${p.maxHp}`,x+32,y+17,'#527a69',7);});
    this.text(c,`출전 ${s.party.filter(p=>p.hp>0).length}/${s.party.length} · 상처약 ${s.inventory.potions}개`,128,137,INK,9,'center');
  }
  gymPreparation(c:CanvasRenderingContext2D){
    const g=this.game,id=g.gymPreview!,gym=gymById(id),ready=gymPreparation(g.save,id);
    this.topbar(c,`${gym.name} · ${gym.label}`);
    gym.team.forEach(([species,level],i)=>{const x=7+i*83;this.frame(c,x,32,76,58,'#f8f3da');this.pokemon(c,species,x+22,33,.4);this.text(c,SPECIES[species].name,x+38,66,INK,9,'center');this.text(c,`Lv.${level}`,x+38,79,'#617878',8,'center')});
    this.text(c,`출전 ${ready.available}/${ready.total}  최고 Lv.${ready.highestLevel}  권장 Lv.${ready.recommendedLevel}`,128,96,INK,8,'center');
    this.text(c,`회복 필요 ${ready.injured}마리 · 상처약 ${ready.potions}개`,128,108,ready.injured?'#a4513f':'#617878',8,'center');
  }
  button(c:CanvasRenderingContext2D,x:number,y:number,w:number,h:number,label:string,action:()=>void,selected=false){this.frame(c,x,y,w,h,selected?'#f3df9f':'#fbf9e6');if(selected)this.rect(c,x+5,y+5,3,h-10,'#c2774d');this.text(c,label,x+w/2,y+(h-10)/2,INK,9,'center');this.hits.push({x,y,w,h,action})}
  back(c:CanvasRenderingContext2D,label='X  돌아가기'){this.button(c,157,164,92,23,label,()=>this.game.cancel())}
  poketch(c:CanvasRenderingContext2D){const g=this.game;if(g.fieldMap){this.exploreMap(c);return;}this.rect(c,0,0,256,192,'#b95f4c');this.rect(c,4,0,248,192,'#da8265');this.rect(c,10,0,231,192,'#ebaa78');this.rect(c,14,7,219,177,'#664f48');this.rect(c,17,10,213,171,'#afbb88');for(let y=12;y<180;y+=3)this.rect(c,18,y,211,1,'#aab783');this.rect(c,24,17,200,24,'#89966b');this.text(c,'POKéTCH',31,24,'#2f4938',8);this.text(c,'01',216,24,'#2f4938',8,'right');
    const guide=adventureGuide(g.save);
    this.text(c,g.map.name,124,48,'#2f4938',9,'center');
    if(guide){this.text(c,guide.objective.title,124,71,'#2b4434',12,'center');this.text(c,guide.lines.join('\n'),124,96,'#304b39',9,'center');}
    this.line(c,34,128,214,128,'#778e68');
    if(g.save.party.length)this.pokemon(c,g.save.party[0].species,34,132,.4);else this.ball(c,50,148,9);
    this.text(c,`출전 가능 ${g.save.party.filter(p=>p.hp>0).length}/${g.save.party.length}`,145,136,'#304b39',9,'center');
    this.text(c,`배지 ${g.save.badges.length}/4 · 상처약 ${g.save.inventory.potions}`,145,151,'#304b39',9,'center');
    this.rect(c,238,66,15,48,'#8c493f');this.rect(c,239,65,14,43,'#de6b57');this.rect(c,241,69,9,34,'#ec9670');this.text(c,'▶',242,83,'#8e5445',8);this.hits.push({x:233,y:0,w:23,h:192,action:()=>g.cancel()});
    if(!g.dialogue&&g.panel==='field'){this.text(c,g.interactionHint??'X  메뉴',123,172,'#3f5d42',8,'center');this.hits.push({x:17,y:10,w:213,h:171,action:()=>g.cancel()});if(g.interactionHint)this.hits.push({x:17,y:163,w:213,h:18,action:()=>g.confirm()})}
    if(!g.locked&&!g.move)this.button(c,159,19,61,20,'M 지도',()=>g.toggleFieldMap());
  }
  exploreMap(c:CanvasRenderingContext2D){
    const g=this.game,m=g.map,p=tourPlaceForMap(m.id),markers=tourMapMarkers(m);
    this.topbar(c,p?p.region+' · '+p.name:m.name);
    this.text(c,g.interactionHint??(markers.length?'＋ 센터  G 체육관  ◆ 시설  ● 사람':'모험 지도  ·  출구를 따라 이동'),128,34,g.interactionHint?INK:'#657b74',8,'center');
    if(g.interactionHint)this.hits.push({x:0,y:27,w:256,h:19,action:()=>g.confirm()});
    const {scale,x:ox,y:oy}=tourMinimapLayout(m);
    this.frame(c,ox-4,oy-4,m.width*scale+8,m.height*scale+8);
    for(let y=0;y<m.height;y++)for(let x=0;x<m.width;x++)this.rect(c,ox+x*scale,oy+y*scale,Math.ceil(scale),Math.ceil(scale),m.walkable[y][x]==='.'?'#d4d6b0':'#829c8b');
    for(const b of TOUR_BUILDINGS[m.id]??[])this.rect(c,ox+b.x*scale,oy+b.y*scale,b.w*scale,b.h*scale,b.kind==='center'?'#c77969':'#6f869f');
    for(const f of TOUR_FEATURES[m.id]??[])this.rect(c,ox+f.x*scale,oy+f.y*scale,f.w*scale,f.h*scale,f.kind==='water'?'#70b9ce':'#718977');
    for(const sign of TOUR_OUTDOORS[m.id]?.signs??[])this.rect(c,ox+sign.x*scale,oy+sign.y*scale,scale,scale,'#ae8356');
    const route=g.tourNavigation;
    if(route?.status==='walking')for(const tile of route.tiles)this.rect(c,ox+tile.x*scale+scale*.25,oy+tile.y*scale+scale*.25,Math.max(2,scale*.5),Math.max(2,scale*.5),'#f6e785');
    for(const w of m.warps)this.rect(c,ox+w.x*scale,oy+w.y*scale,scale,scale,'#ebbb57');
    if(route?.exit&&route.status==='walking'){const b=tourMarkerBounds(m,route.exit);this.rect(c,b.cx-6,b.cy-6,12,12,'#b671a4')}
    for(const marker of markers){
      const b=tourMarkerBounds(m,marker),x=b.cx,y=b.cy;
      this.rect(c,x-4,y-4,8,8,'#fffbe2');
      if(marker.kind==='center'){this.rect(c,x-1,y-3,2,6,'#b94d4e');this.rect(c,x-3,y-1,6,2,'#b94d4e')}
      else if(marker.kind==='gym'){this.rect(c,x-3,y-3,6,6,'#bb964d');this.text(c,'G',x,y-3,'#fffce7',6,'center')}
      else if(marker.kind==='facility'){this.rect(c,x-3,y-2,6,4,'#42618d');this.rect(c,x-2,y-3,4,6,'#42618d')}
      else if(marker.kind==='pokemon'){this.rect(c,x-3,y-2,2,3,'#bb7083');this.rect(c,x+1,y-2,2,3,'#bb7083');this.rect(c,x-2,y,4,2,'#bb7083');this.rect(c,x-1,y+2,2,1,'#bb7083')}
      else{this.rect(c,x-1,y-3,2,2,'#42618d');this.rect(c,x-2,y,4,3,'#42618d')}
      if(!g.locked&&!g.move)this.hits.push({...b,action:()=>{
        if(g.locked||g.move||g.map.id!==m.id)return;
        if(marker.destination)g.setTourDestination(marker.destination);
        else g.notice(marker.name+' · 앞에서 Z 대화');
      }});
    }
    this.rect(c,ox+g.save.player.x*scale,oy+g.save.player.y*scale,scale,scale,'#bf5d56');
    if(route?.interaction){const b=tourMarkerBounds(m,route.interaction);this.rect(c,b.cx-5,b.cy-5,10,10,'#b671a4');this.text(c,'!',b.cx,b.cy-4,'#fffbe2',8,'center');}
    const goal=g.followingObjective?adventureGuide(g.save):null;
    this.text(c,route?route.status==='arrived'?(route.interaction?DIRECTION_LABEL[route.interaction.facing]+'을 보고 Z 대화':goal?.objective.action??route.name+' 도착'):route.status==='blocked'?'길이 막혔어요. 출발 준비·주변 길을 확인하세요':route.interaction?(goal?.objective.action??'목표 인물을 만나자'):DIRECTION_LABEL[route.exit!.entry]+' '+tourPassageLabel(route.exit!)+' · '+route.nextName:'시설 표식을 누르면 입구까지 길안내',128,44,INK,7,'center');
    if(!g.locked&&!g.move){
      this.button(c,4,170,80,20,g.followingObjective?'목표 추적 중':'목표 안내',()=>g.guideObjective(),g.followingObjective);
      this.button(c,88,170,80,20,'안내 해제',()=>{if(!g.locked&&!g.move)g.setTourDestination(null)});
      this.button(c,172,170,80,20,'M 닫기',()=>g.toggleFieldMap());
    }
  }
  menuLower(c:CanvasRenderingContext2D){this.topbar(c,'메뉴');const labels=['포켓몬','가방','트레이너','리포트','설정','닫기'];labels.forEach((label,i)=>{const x=9+(i%2)*124,y=36+Math.floor(i/2)*45;this.button(c,x,y,114,38,label,()=>{this.game.menuIndex=i;this.game.selectMenu(i)},this.game.menuIndex===i)});this.text(c,'방향키로 선택 · Z로 확인',128,177,'#687d73',8,'center')}
  starters(c:CanvasRenderingContext2D){const g=this.game;this.topbar(c,'첫 번째 파트너');this.text(c,'마음이 끌리는 몬스터볼을 선택하세요',128,37,INK,8,'center');STARTERS.forEach((id,i)=>{const x=7+i*83,selected=g.starterIndex===i;this.frame(c,x,57,77,92,selected?'#f0dfa6':'#f8f7e6');this.ball(c,x+38,78,7,selected);this.pokemon(c,id,x+8,81,.75);this.text(c,SPECIES[id].name,x+38,130,INK,10,'center');if(selected)this.text(c,'▼',x+35,48,'#b56f4c',8);this.hits.push({x,y:57,w:77,h:92,action:()=>{if(g.starterIndex===i)g.chooseStarter();else g.starterIndex=i}})});this.button(c,9,159,145,27,'Z  이 친구로 결정',()=>g.chooseStarter(),true);this.button(c,162,159,86,27,'X  돌아가기',()=>g.cancel())}
  party(c:CanvasRenderingContext2D){const g=this.game,healing=g.panel==='fieldHeal';this.topbar(c,healing?'상처약을 쓸 포켓몬':'함께하는 포켓몬');if(!g.save.party.length){this.frame(c,15,52,226,87);this.text(c,'아직 함께하는 포켓몬이 없어요.\n\n연구소에서 첫 친구를 만나 보세요!',128,68,INK,9,'center')}else{g.save.party.forEach((p,i)=>{const data=SPECIES[p.species],x=8+(i%2)*124,y=35+Math.floor(i/2)*41;this.frame(c,x,y,116,37,g.partyIndex===i?'#efe2ad':'#f4f5e7');this.pokemon(c,p.species,x+1,y-4,.55);this.text(c,data.name,x+44,y+7,INK,9);this.text(c,`Lv.${p.level}`,x+100,y+8,'#697e7a',7,'right');this.hp(c,x+45,y+22,60,p);this.hits.push({x,y,w:116,h:37,action:()=>{if(healing)g.useFieldPotion(i);else{g.partyIndex=i;g.panel='summary';g.summaryActionIndex=0;}}})});for(let i=g.save.party.length;i<6;i++){const x=8+(i%2)*124,y=35+Math.floor(i/2)*41;this.rect(c,x,y,116,37,'#c3d1c9');this.rect(c,x+2,y+2,112,33,'#cedad0');this.text(c,'—',x+58,y+12,'#9aaeaa',9,'center')}}this.text(c,healing?'남은 상처약 '+g.save.inventory.potions+'개':'포켓몬을 선택해 주세요',10,173,INK,8);this.back(c)}
  moves(c:CanvasRenderingContext2D){const p=this.game.save.party[this.game.partyIndex];if(!p)return;this.topbar(c,'기억하고 있는 기술');pokemonMoves(p).forEach((m,i)=>{const x=8+(i%2)*124,y=32+Math.floor(i/2)*29;this.frame(c,x,y,116,25);this.text(c,m,x+9,y+8,INK,9)});this.text(c,growthPreview(p),128,96,'#345c49',8,'center');this.button(c,8,139,78,23,'선두로',()=>this.game.manageParty(0),this.game.summaryActionIndex===0);this.button(c,89,139,78,23,'상처약 '+this.game.save.inventory.potions,()=>this.game.manageParty(1),this.game.summaryActionIndex===1);this.button(c,170,139,78,23,'기술 배우기',()=>this.game.manageParty(2),this.game.summaryActionIndex===2);this.text(c,p.level===LEVEL_CAP?`현재 성장 한도 Lv.${LEVEL_CAP}`:`다음 레벨까지 ${nextLevelXp(p.level)-p.experience} EXP`,128,111,'#657a72',9,'center');this.text(c,'EXP',14,125,'#52758d',7);this.experience(c,37,127,203,p);if(this.game.save.party.length>1){this.button(c,8,164,68,23,'↑ 이전',()=>this.game.browseParty(-1));this.button(c,81,164,68,23,'↓ 다음',()=>this.game.browseParty(1));}this.back(c)}
  fieldHealTop(c:CanvasRenderingContext2D){
    const g=this.game,p=g.save.party[g.partyIndex];if(!p)return;
    this.rect(c,0,0,256,192,'#dce8e7');this.topbar(c,'포켓몬 회복');
    this.frame(c,8,33,240,89);this.pokemon(c,p.species,17,35,.9);
    this.text(c,SPECIES[p.species].name,109,47,INK,11);this.text(c,`Lv.${p.level}`,235,49,INK,8,'right');
    this.text(c,p.hp>0?`HP ${p.hp} / ${p.maxHp}`:'기절',110,69,INK,9);this.hp(c,110,90,123,p);
    this.frame(c,3,132,250,57);this.text(c,fieldPotionPreview(g.save,g.partyIndex).join('\n'),15,146,INK,9);
  }
  bag(c:CanvasRenderingContext2D){
    const g=this.game,s=g.save;this.topbar(c,'가방');
    ['몬스터볼 '+s.inventory.pokeBalls,'상처약 '+s.inventory.potions].forEach((label,i)=>this.button(c,8+i*124,34,116,33,label,()=>g.selectFieldItem(i),g.bagIndex===i));
    const machines=GYMS.filter(gym=>s.keyItems.includes(gym.tm));
    machines.forEach((gym,i)=>this.text(c,'TM '+gym.move+' ×1',14+(i%2)*122,77+Math.floor(i/2)*16,INK,8));
    this.text(c,machines.length?'포켓몬 정보 → 기술 배우기에서 사용':'기술머신 없음',14,109,'#78877c',7);
    this.frame(c,8,123,240,36);
    this.text(c,g.bagIndex===0?(s.inventory.pokeBalls?'야생전에서 포획할 때 사용합니다.':'몬스터볼 없음 · 선택하면 보충 장소 안내'):s.inventory.potions>0?'포켓몬을 골라 HP를 최대 20 회복합니다.':'상처약 없음 · 선택하면 보충 장소 안내',128,136,INK,8,'center');
    this.back(c);
  }
  trainer(c:CanvasRenderingContext2D){const s=this.game.save;this.topbar(c,'트레이너 카드');this.frame(c,10,32,236,130,'#e8e5c6');this.text(c,'빛나래 · 포켓몬 '+s.party.length+'마리',23,43,INK,10);GYMS.forEach((g,i)=>this.text(c,(s.badges.includes(g.badge)?'◆ ':'◇ ')+g.label,23+(i%2)*111,67+Math.floor(i/2)*20,INK,9));this.text(c,'소지금 '+s.money.toLocaleString()+'원',23,110);this.text(c,s.flags.ferryPass?'조사선 왕복 승선권':s.flags.researchDelivered?'운하항에서 승선 안내':s.flags.observationCollected?'장막 자료 → 축복 안내원':s.badges.length===4?'장막 관측 연구원을 만나자':'배지를 모아 다음 도시로',23,140,INK,8);this.button(c,8,164,142,23,'Z  포켓몬도감',()=>showPokedex(this.game));this.back(c)}
  options(c:CanvasRenderingContext2D){const g=this.game;this.topbar(c,'설정');const labels=[`대화 속도     ${g.textSpeed===36?'보통':'빠르게'}`,`소리          ${g.audio.enabled?'켜짐':'꺼짐'}`,'처음부터 다시 시작'];labels.forEach((label,i)=>this.button(c,14,39+i*38,228,32,label,()=>g.selectOption(i),g.optionIndex===i));this.back(c)}

  battleSelectionTop(c:CanvasRenderingContext2D){
    const g=this.game,b=g.battle!,p=g.save.party[b.selected],species=SPECIES[p.species];
    this.rect(c,0,0,256,192,'#dce8e7');this.topbar(c,b.menu==='heal'?'상처약을 사용할 포켓몬':'교대할 포켓몬');
    this.text(c,`${b.selected+1}/${g.save.party.length}`,222,9,'#fffce7',9,'right');
    this.frame(c,7,33,242,101,'#f8f3da');this.pokemon(c,p.species,10,34,.95);
    this.text(c,species.name,100,42,INK,12);this.text(c,`Lv.${p.level}`,235,45,INK,9,'right');this.typePills(c,species.types,100,62);
    this.text(c,`HP ${p.hp} / ${p.maxHp}`,100,81,p.hp?'#384750':'#a3463f',9);this.hp(c,100,98,132,p);
    const moves=pokemonMoves(p);for(let row=0;row<Math.ceil(moves.length/2);row++)this.text(c,moves.slice(row*2,row*2+2).join(' · '),128,109+row*13,'#617878',8,'center');
    this.frame(c,3,139,250,50);this.text(c,battleHint(g.save,b).join('\n'),15,149,INK,9);
  }
  battleTop(c:CanvasRenderingContext2D){const presentation=this.game.battlePresentation,b=this.game.presentedBattle!,view=presentation?.frame??this.game.battleFrame,p=view?.player??this.game.save.party[b.active],enemy=view?.enemy??b.enemy,attackDrop=view?.enemyAttackDrop??b.enemyAttackDrop,defenseDrop=view?.enemyDefenseDrop??b.enemyDefenseDrop;
    if(!this.game.dialogue&&(b.menu==='party'||b.menu==='heal')&&this.game.save.party[b.selected]){this.battleSelectionTop(c);return;}
    this.battleArena(c);
    const effect=presentation?null:this.game.battleEffect,capture=this.game.captureMotion;
    const hit=presentation?.phase==='impact',target=view?.effect?.target;
    const recoil=hit?Math.round(Math.sin(this.game.dialogueElapsed/.15*Math.PI*4)*3):0;
    if((enemy.hp>0||presentation?.keepEnemyVisible)&&!capture?.hideEnemy)this.pokemon(c,enemy.species,155+(hit&&target==='enemy'?recoil:effect?.target==='enemy'?effect.recoil:0),9);
    if(p.hp>0||presentation?.keepPlayerVisible)c.drawImage(this.images['pokemon-back-'+p.species],20+(hit&&target==='player'?recoil:effect?.target==='player'?effect.recoil:0),65,96,96);
    if(hit){
      const x=target==='enemy'?196:64,y=target==='enemy'?58:103;
      this.rect(c,x-9,y-1,19,3,'#fff2b3');this.rect(c,x-1,y-9,3,19,'#fffce9');
    }
    if(capture)this.ball(c,capture.x,capture.y,6);
    if(view?.technique)paintMoveTechnique(c,view.technique,this.game.dialogueElapsed,!!presentation);
    if(effect){
      const x=effect.target==='enemy'?196:64,y=(effect.target==='enemy'?19:69)-effect.rise,heal=effect.kind==='heal',color=heal?'#43815a':'#a3463f';
      const spread=8+Math.round(effect.progress*13);
      for(const side of [-1,1]){const px=x+side*spread,py=y+18;this.rect(c,px-3,py,7,2,heal?'#8ad89b':'#fff2a7');this.rect(c,px,py-3,2,7,heal?'#8ad89b':'#fff2a7');}
      const label=(heal?'+':'−')+effect.amount;
      this.text(c,label,x+1,y+1,'#fffdf0',12,'center');this.text(c,label,x,y,color,12,'center');
    }
    this.frame(c,5,15,135,39);this.text(c,SPECIES[enemy.species].name,14,23,INK,10);this.text(c,`Lv.${enemy.level}`,129,24,INK,8,'right');this.hp(c,38,41,89,enemy);this.text(c,'HP',13,39,INK,7);
    if(b.kind==='wild'&&b.caughtBeforeBattle)this.ball(c,87,28,3);
    if(attackDrop||defenseDrop)this.text(c,`공격 -${attackDrop} · 방어 -${defenseDrop}`,14,58,'#485e51',8);
    this.frame(c,122,87,130,43);this.text(c,SPECIES[p.species].name,132,94,INK,10);this.text(c,`Lv.${p.level}`,241,94,INK,8,'right');this.hp(c,156,110,83,p);this.text(c,`${p.hp}/${p.maxHp}`,131,109,INK,7);this.text(c,p.level>=LEVEL_CAP?'MAX':'EXP',131,120,'#52758d',6);this.experience(c,156,122,83,p);
    if(!this.game.dialogue){this.frame(c,3,132,250,57);this.text(c,(b.menu==='party'||b.menu==='heal'||b.menu==='between')?battleHint(this.game.save,b).join('\n'):`${withParticle(SPECIES[p.species].name,'은/는')}\n무엇을 할까?`,15,146,INK,(b.menu==='party'||b.menu==='heal'||b.menu==='between')?9:10);}
  }
  battleGrowth(c:CanvasRenderingContext2D){
    const growth=this.game.battleFrame!.growth!,p=growth.after,levelUp=growth.kind==='level',evolution=growth.kind==='evolution',move=growth.kind==='move';
    this.topbar(c,evolution?'축하합니다! 진화했어요':move?'새로운 기술을 배울 수 있어요':levelUp?'레벨 업!':'경험치 획득');
    this.frame(c,7,33,242,108,'#f8f3da');this.pokemon(c,p.species,9,36,.85);
    this.text(c,SPECIES[p.species].name,89,42,INK,12);this.text(c,`파티 ${growth.index+1}`,237,44,'#617878',8,'right');
    this.text(c,evolution?`${SPECIES[growth.before.species].name} →`:move?'정보 → 기술 배우기':levelUp?`Lv.${growth.before.level} → Lv.${p.level}`:`Lv.${p.level}  EXP +${growth.amount}`,89,63,levelUp?'#a36536':INK,10);
    this.text(c,`HP ${p.hp} / ${p.maxHp}`,89,82,INK,9);this.hp(c,89,97,147,p);
    this.text(c,evolution?'새로운 모습의 파트너!':move?'배울 기술을 직접 선택해 주세요':levelUp?`최대 HP +${p.maxHp-growth.before.maxHp}`:'함께 싸워 얻은 경험치',16,115,'#617878',8);
    const status=p.level>=LEVEL_CAP?`성장 한도 Lv.${LEVEL_CAP}`:p.experience>=nextLevelXp(p.level)?'레벨업!':`다음까지 ${nextLevelXp(p.level)-p.experience} EXP`;
    this.text(c,status,237,115,'#52758d',8,'right');this.experience(c,16,131,221,p);
  }
  battleLower(c:CanvasRenderingContext2D){const g=this.game,b=g.presentedBattle!,p=g.save.party[b.active],view=g.battleFrame;
    if(view?.growth){this.battleGrowth(c);return;}
    if(g.confirmingBattleExit){this.topbar(c,'도전 중단 확인');this.frame(c,12,37,232,71,'#f8f3da');this.text(c,'이번 도전을 마칠까요?',128,49,INK,11,'center');this.text(c,'경험치 · 현재 HP 유지',128,74,'#617878',9,'center');this.text(c,'재도전은 첫 상대부터',128,90,'#617878',8,'center');return;}
    if(view){this.topbar(c,b.kind!=='wild'?`${opponentTrainerName(b)} · ${view.enemyIndex+1}/${b.opponents.length}`:`야생 ${SPECIES[view.enemy.species].name}`);this.frame(c,12,42,232,91,'#f8f3da');this.text(c,view.capture?'포획 시도 중':'전투 진행 중',128,56,INK,11,'center');this.text(c,`${SPECIES[view.player.species].name} · ${SPECIES[view.enemy.species].name}`,128,82,INK,10,'center');this.text(c,view.capture?'Z / Enter로 포획 결과를 확인하세요':'대사가 끝나면 행동을 선택하세요',128,111,'#617878',8,'center');return;}
    this.topbar(c,b.kind!=='wild'?`${opponentTrainerName(b)} · ${b.enemyIndex+1}/${b.opponents.length}`:`야생 ${SPECIES[b.enemy.species].name}`);
    if(b.menu==='between'){
      this.text(c,'다음 상대를 확인하고 준비하세요',128,40,INK,9,'center');
      this.frame(c,8,59,240,43);this.text(c,`${SPECIES[b.enemy.species].name}  Lv.${b.enemy.level}`,128,73,INK,12,'center');
      ['계속 싸운다','교대한다'].forEach((label,i)=>this.button(c,8+i*124,114,116,36,label,()=>{b.selected=i;g.selectBattle()},b.selected===i));
      this.text(c,'교대 시 추가 반격 없음',128,160,INK,8,'center');
      this.text(c,'X  현재 포켓몬으로 계속',128,176,INK,8,'center');return;
    }
    if(b.menu==='party'||b.menu==='heal'){
      g.save.party.forEach((mon,i)=>{const x=8+(i%2)*124,y=32+Math.floor(i/2)*41;
        this.frame(c,x,y,116,37,b.selected===i?'#f3df9f':'#fbf9e6');this.pokemon(c,mon.species,x,y-4,.5);
        this.text(c,SPECIES[mon.species].name,x+43,y+5,INK,9);
        this.text(c,mon.hp<=0?'기절':b.menu!=='heal'&&i===b.active?'전투 중':`Lv.${mon.level}  ${mon.hp}/${mon.maxHp}`,x+43,y+17,'#687b70',7);
        this.hp(c,x+43,y+28,65,mon);this.hits.push({x,y,w:116,h:37,action:()=>{b.selected=i;g.selectBattle()}});
      });
      this.text(c,b.menu==='heal'?'상처약 '+g.save.inventory.potions+'개 · 회복할 포켓몬 선택':b.forcedSwitch?'다음 포켓몬 선택 · 추가 반격 없음':b.betweenOpponents?'다음 상대 준비 · 추가 반격 없음':'교대하면 상대가 공격합니다',8,157,INK,8);
      this.button(c,8,169,240,20,b.forcedSwitch?(b.kind!=='wild'?'도전 중단':'도망친다'):'X  돌아가기',()=>b.forcedSwitch?g.requestBattleExit():g.cancel());return;
    }
    this.text(c,`${SPECIES[p.species].name}의 행동을 선택하세요`,128,36,INK,9,'center');
    const labels=b.menu==='moves'?pokemonMoves(p):b.menu==='bag'?[`몬스터볼 (${g.save.inventory.pokeBalls})`,`상처약 (${g.save.inventory.potions})`]:['싸운다','가방','포켓몬',b.kind!=='wild'?'도전 중단':'도망친다'];
    labels.forEach((label,i)=>{const x=8+(i%2)*124,y=54+Math.floor(i/2)*(b.menu==='moves'?36:47),action=()=>{b.selected=i;g.selectBattle()};
      if(b.menu==='moves')this.moveButton(c,x,y,label,action,i===b.selected);else this.button(c,x,y,116,40,label,action,i===b.selected);
    });
    if(b.menu==='actions')this.text(c,(b.kind==='wild'?(b.caughtBeforeBattle?'포획 기록 있음':'미포획')+' · ':'')+'경험치 참여 '+experienceParticipants(g.save,b).length+'마리',128,149,'#657b72',8,'center');
    if(b.menu==='actions')this.text(c,'방향키로 선택 · Z로 확인',128,165,INK,9,'center');
    else {
      const moves=b.menu==='moves';this.frame(c,8,moves?128:102,240,moves?33:53,'#fbf9e6');
      this.text(c,battleHint(g.save,b).join('\n'),18,moves?133:112,INK,moves?8:9);
      this.button(c,8,165,240,24,'X  행동 선택으로',()=>g.cancel());
    }
  }
  moveButton(c:CanvasRenderingContext2D,x:number,y:number,move:string,action:()=>void,selected=false){this.frame(c,x,y,116,32,selected?'#f3df9f':'#fbf9e6');if(selected)this.rect(c,x+5,y+5,3,22,'#c2774d');this.text(c,move,x+13,y+11,INK,9);this.typeBadge(c,moveType(move)??'?',x+80,y+9);this.hits.push({x,y,w:116,h:32,action})}
  click(x:number,y:number){if(this.game.ferryJourney||this.game.transition||this.game.move)return;const hit=[...this.hits].reverse().find(h=>x>=h.x&&x<h.x+h.w&&y>=h.y&&y<h.y+h.h);if(hit){this.game.audio.play('confirm');hit.action()}}
}

