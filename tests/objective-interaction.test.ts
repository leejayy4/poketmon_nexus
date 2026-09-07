import test from 'node:test';
import assert from 'node:assert/strict';
import {Engine,VECTOR} from '../src/engine';
import {Renderer} from '../src/renderer';
import {getMap,ACTIVE_MAPS,canEnter} from '../src/maps';
import {newSave,parseSave} from '../src/save';
import {grantPokemon} from '../src/pokemon';
import {GYMS} from '../src/gyms';
import {adventureGuide} from '../src/adventure-guide';
import {objectiveInteractionPath,planTourNavigation} from '../src/explore-navigation';
import {setupExplorePanel} from '../src/explore-panel';
import {isWorldCenter,worldSpawn} from '../src/unified-world';
import type {Direction,MapId} from '../src/types';

function dom(run:()=>void){const old=Object.getOwnPropertyDescriptor(globalThis,'document');Object.defineProperty(globalThis,'document',{configurable:true,value:{getElementById:()=>null}});try{run()}finally{if(old)Object.defineProperty(globalThis,'document',old);else Reflect.deleteProperty(globalThis,'document')}}
function game(map:MapId='oreburgh_gym'){const g=new Engine();g.save=newSave();grantPokemon(g.save,7);g.save.flags.departureCleared=true;g.save.map=map;g.save.player={...(worldSpawn(map)??{x:8,y:14}),facing:'up'};return g}
function step(g:Engine,dir:Direction){g.press('Arrow'+dir[0].toUpperCase()+dir.slice(1));g.release('Arrow'+dir[0].toUpperCase()+dir.slice(1));for(let i=0;i<12;i++)g.update(.04)}
function follow(g:Engine){const route=g.tourNavigation!;for(let i=1;i<route.tiles.length;i++){const a=route.tiles[i-1],b=route.tiles[i],dir=(Object.keys(VECTOR) as Direction[]).find(d=>a.x+VECTOR[d].x===b.x&&a.y+VECTOR[d].y===b.y)!;step(g,dir);}return g.tourNavigation!}

test('objective continues inside a gym to a legal speaking tile without awarding progress',()=>dom(()=>{
  const g=game();g.guideObjective();const before=structuredClone(g.save),route=g.tourNavigation!;assert.equal(route.status,'walking');assert.equal(route.exit,null);assert(route.interaction);assert.deepEqual(g.save,before);const arrived=follow(g);assert.equal(arrived.status,'arrived');assert.equal(g.save.map,'oreburgh_gym');assert.deepEqual(g.save.badges,[]);g.save.player.facing=arrived.interaction!.facing;g.confirm();assert.equal(g.gymPreview,'roark');assert.equal(g.save.badges.length,0);
}));

test('all expanded centers route to accessible nurse or counter interaction, not the blocked nurse tile',()=>{
  let count=0;for(const map of Object.values(ACTIVE_MAPS)){if(!isWorldCenter(map.id))continue;count++;const current=getMap(map.id),start=worldSpawn(map.id)!;const route=objectiveInteractionPath(current,start,'nurse')!;assert(route,map.id);const last=route.tiles.at(-1)!,v=VECTOR[route.interaction.facing];assert.equal(last.x+v.x,route.interaction.x);assert.equal(last.y+v.y,route.interaction.y);
    for(let i=1;i<route.tiles.length;i++){const a=route.tiles[i-1],b=route.tiles[i],dir=(Object.keys(VECTOR) as Direction[]).find(d=>a.x+VECTOR[d].x===b.x&&a.y+VECTOR[d].y===b.y)!;assert(canEnter(current,b.x,b.y,dir));assert(!current.warps.some(w=>w.x===b.x&&w.y===b.y));}
  }assert.equal(count,38);
});

test('center healing updates the followed objective from local interaction back to the next gym',()=>dom(()=>{
  const g=game('tour_oreburgh_center');g.save.party[0].hp=1;g.guideObjective();assert.equal(g.tourNavigation?.destination,'tour_oreburgh_center');const arrived=follow(g);assert.equal(arrived.status,'arrived');g.save.player.facing=arrived.interaction!.facing;g.confirm();assert.equal(g.save.party[0].hp,g.save.party[0].maxHp);assert.equal(g.tourNavigation?.destination,'oreburgh_gym');assert(g.tourNavigation?.exit);assert.equal(g.tourNavigation?.interaction,undefined);assert(parseSave(JSON.stringify(g.save)));
}));

test('all existing progression objectives resolve to a reachable person including city story NPCs',()=>{
  const cases:[MapId,string][]=[['lab','professor'],['town','gatekeeper'],['oreburgh_gym','roark'],['eterna_gym','gardenia'],['hearthome_gym','fantina'],['veilstone_gym','maylene'],['tour_veilstone','observation'],['tour_jubilife','researchGate'],['tour_canalave','ferry']];
  for(const [map,event] of cases){const g=game(map);g.save.player={...(worldSpawn(map)??(map==='lab'?{x:6,y:11}:{x:8,y:14})),facing:'up'};assert(objectiveInteractionPath(g.map,g.save.player,event),event);}
  const g=game('tour_veilstone');for(const gym of GYMS){g.save.badges.push(gym.badge);g.save.keyItems.push(gym.tm);}assert.equal(adventureGuide(g.save)?.objective.event,'observation');g.guideObjective();assert(g.tourNavigation?.interaction);assert.equal(g.tourNavigation?.status,'walking');
});

test('missing or obstructed targets report blocked and manual city destinations retain arrival behavior',()=>{
  const g=game();assert.equal(planTourNavigation(g.save,g.save.map,g.map,'missing')?.status,'blocked');const map=structuredClone(g.map);map.walkable=map.walkable.map(row=>row.replaceAll('.','#'));assert.equal(objectiveInteractionPath(map,g.save.player,'roark'),null);
  g.save.map='tour_jubilife_center';g.save.player={...worldSpawn(g.save.map)!,facing:'up'};assert.equal(planTourNavigation(g.save,'tour_jubilife')?.status,'arrived');const route=planTourNavigation(g.save,'tour_jubilife',undefined,'researchGate')!;assert.equal(route.status,'walking');assert.equal(route.exit?.to,'tour_jubilife');
});

test('map renders local routes and direction guidance without requiring a warp, and restore preserves progress',()=>{
  const g=game();g.guideObjective();const words:string[]=[],ctx=new Proxy({}, {get:(_,key)=>key==='fillText'?(s:string)=>words.push(s):()=>{}}) as CanvasRenderingContext2D,canvas={getContext:()=>ctx} as HTMLCanvasElement,r=new Renderer(g,canvas,canvas);r.lower();assert(words.includes('관장 강석과 이야기하자'));follow(g);words.length=0;r.lower();assert(words.some(s=>s.includes('을 보고 Z 대화')));const before=structuredClone(g.save);g.setTourDestination('oreburgh_gym');assert.equal(g.tourNavigation?.interaction,undefined);assert.deepEqual(g.save,before);g.restore(parseSave(JSON.stringify(g.save))!);assert.deepEqual(g.save.party,before.party);
});

test('the always-updated developer panel handles local walking routes without a warp',()=>{
  const nodes=new Map<string,any>();const node=()=>({textContent:'',innerHTML:'',value:'',checked:false,hidden:false,append(){},addEventListener(){},querySelector(key:string){if(!nodes.has(key))nodes.set(key,node());return nodes.get(key)},querySelectorAll(){return []}});
  const old=Object.getOwnPropertyDescriptor(globalThis,'document');Object.defineProperty(globalThis,'document',{configurable:true,value:{createElement:node,getElementById:()=>null}});
  try{const g=game();g.guideObjective();const update=setupExplorePanel(g,node() as unknown as HTMLElement);assert(nodes.get('#tour-route-status').textContent.includes('목표 인물'));follow(g);update();assert(nodes.get('#tour-route-status').textContent.includes('Z로 대화'));g.setTourDestination(null);update();assert(nodes.get('#tour-navigation').hidden);}finally{if(old)Object.defineProperty(globalThis,'document',old);else Reflect.deleteProperty(globalThis,'document')}
});
