import { worldMapId,worldSpawn } from '../src/unified-world';
import { TOWN_REVISION } from '../src/town';
import test from 'node:test';
import assert from 'node:assert/strict';
import { Engine } from '../src/engine';
import { newSave,parseSave } from '../src/save';
import { grantPokemon,pokemonMoves } from '../src/pokemon';
import { maxHpAtLevel,gainExperience } from '../src/growth';
import { GYMS,awardGym } from '../src/gyms';
import {battleTurn,playerDamage,enemyDamage,type Battle,type BattleAction } from '../src/battle';
import {createBattle} from './runtime-battle-fixture';
import {createBattle as createRegionalBattle} from '../src/battle';
import {encounterPool} from '../src/runtime-encounters';
import type {SaveData} from '../src/types';
import { getMap,canStand,MAPS } from '../src/maps';
import { checkpoint } from '../src/save-library';
import { SINNOH_CENTERS,SINNOH_GYMS,SINNOH_MAPS } from '../src/sinnoh-maps';
function ready(species=7,level=15,badges=1){const s=newSave();grantPokemon(s,species);Object.assign(s.party[0],{level,hp:maxHpAtLevel(species,level),maxHp:maxHpAtLevel(species,level)});s.flags.departureCleared=true;s.inventory={pokeBalls:5,potions:2};for(const g of GYMS.slice(0,badges))awardGym(s,g.id);s.map='tour_jubilife';s.player={...worldSpawn(s.map)!,facing:'left'};return s}
function ui(run:()=>void){const old=Object.getOwnPropertyDescriptor(globalThis,'document');Object.defineProperty(globalThis,'document',{configurable:true,value:{getElementById:()=>null}});try{run()}finally{if(old)Object.defineProperty(globalThis,'document',old);else Reflect.deleteProperty(globalThis,'document')}}
function finish(g:Engine){for(let i=0;g.dialogue&&i<150;i++)g.confirm();assert.equal(g.dialogue,null)}
function step(g:Engine,key:string){g.press(key);g.release(key);for(let i=0;i<20;i++)g.update(.04)}
function prepare(s:SaveData,stage:number){
  // S02 + S04 species; Meditite is only added once S15 is in the travelled region.
  const ids=stage===1?[403,41,396,406,399]:[403,41,396,406,307];
  const level=stage===1?12:stage===2?15:20;
  s.party=s.party.slice(0,1);
  for(const species of ids){const maxHp=maxHpAtLevel(species,level);s.party.push({species,level,hp:maxHp,maxHp,experience:0,nature:'성실',met:species===307?'천관산 하부':'신오 초반 도로와 동굴'});}
  for(const p of s.party){delete p.moves;p.moves=pokemonMoves(p);}
}
function strategy(s:SaveData,b:Battle):BattleAction{
  const candidates=s.party.map((p,i)=>({i,p,hit:p.hp>0?playerDamage(p,{...b,active:i}):-1})).filter(p=>p.p.hp>0).sort((a,c)=>c.hit-a.hit);
  if(b.forcedSwitch)return {switch:candidates[0].i};
  const p=s.party[b.active],best=candidates[0];
  if(best.i!==b.active&&best.hit>playerDamage(p,b))return {switch:best.i};
  if(p.hp<=enemyDamage(b,b.enemyAttackDrop,p)&&s.inventory.potions&&p.hp<p.maxHp)return 'potion';
  return 'move0';
}
test('each starter can lead a locally obtainable prepared party through all later gyms with two potions',()=>{
  for(const species of [1,4,7,25])for(let stage=1;stage<4;stage++){
    const gym=GYMS[stage],s=ready(species,gym.level,stage);prepare(s,stage);const b=createBattle(s,'gym',gym.id)!;let result;
    for(let i=0;i<60&&!b.result;i++){result=battleTurn(s,b,strategy(s,b)).outcome;}
    assert.equal(result,'won',species+' '+gym.id);assert(awardGym(s,gym.id));assert.equal(s.badges.length,stage+1);assert(parseSave(JSON.stringify(s)));
  }
});
test('gym order cannot be skipped and wins, reload and revisits do not duplicate rewards',()=>ui(()=>{
  const g=new Engine();g.save=ready();g.event('maylene');finish(g);assert.equal(g.battle,null);assert(!awardGym(g.save,'maylene'));
  for(let stage=1;stage<4;stage++){
    prepare(g.save,stage);g.save.map=SINNOH_GYMS[stage-1];g.save.player={x:8,y:5,facing:'up'};g.healParty();g.save.inventory.potions=2;g.event(GYMS[stage].id);finish(g);
    for(let i=0;g.battle&&!g.battle.result&&i<60;i++){g.actBattle(strategy(g.save,g.battle));if(!g.battle?.result)finish(g)}
    assert.equal(g.save.badges.length,stage+1);const saved=parseSave(JSON.stringify(g.save))!;assert(saved);g.restore(saved);const money=g.save.money;g.event(GYMS[stage].id);finish(g);assert.equal(g.battle,null);assert.equal(g.save.money,money);
  }assert.equal(g.save.money,8400);
}));
test('all new recovery centers persist and recover a gym defeat to a valid tile',()=>ui(()=>{
  for(let i=0;i<3;i++){const g=new Engine();g.save=ready(7,15,3);g.save.map=worldMapId(SINNOH_CENTERS[i]);g.save.player={x:8,y:7,facing:'up'};g.event('nurse');finish(g);assert.equal(g.save.healingPoint,worldMapId(SINNOH_CENTERS[i]));g.save.map=SINNOH_GYMS[i];g.save.player={x:8,y:5,facing:'up'};g.save.party[0].hp=1;g.battle=createBattle(g.save,'gym',GYMS[i+1].id);g.actBattle('move0');assert.equal(g.save.map,worldMapId(SINNOH_CENTERS[i]));assert.equal(g.save.party[0].hp,g.save.party[0].maxHp);assert(parseSave(JSON.stringify(g.save)))}
}));
test('forest and mountain encounters follow their design pools, grant level XP and preserve location',()=>ui(()=>{
  for(const map of ['tour_eterna_forest','tour_coronet'] as const){const g=new Engine();g.save=ready();g.save.map=map;g.save.player={x:4,y:10,facing:'right'};g.random=()=>0;
    for(let i=0;i<6;i++)step(g,i%2?'ArrowLeft':'ArrowRight');const pool=encounterPool(map)!;assert.equal(g.battle?.enemy.level,pool.levels[0]);assert.equal(g.battle?.enemy.species,pool.slots[0].speciesId);finish(g);
    g.battle!.enemy.hp=1;const expected=structuredClone(g.save.party[0]);gainExperience(expected,pool.levels[0]*10);g.actBattle('move0');assert.deepEqual(g.save.party[0],expected);finish(g);
    const b=createRegionalBattle(g.save,'wild','roark',()=>0)!;b.enemy.hp=1;assert.equal(battleTurn(g.save,b,'ball').outcome,'caught');assert.equal(g.save.party[1].level,pool.levels[0]);assert.equal(g.save.party[1].met,MAPS[map].name);assert(parseSave(JSON.stringify(g.save)));
  }
}));
test('records require four badges and delivery completes once while world travel stays open',()=>ui(()=>{
  const g=new Engine();g.save=ready();g.event('observation');finish(g);assert(!g.save.flags.observationCollected);g.save=ready(7,15,4);g.event('observation');assert.equal(g.save.flags.observationCollected,true);finish(g);g.event('researchGate');assert(!g.save.flags.researchDelivered);
  const before=parseSave(JSON.stringify(g.save))!;g.restore(before);assert(g.map.warps.some(w=>w.to==='research_path'));g.event('researchGate');finish(g);assert.equal(g.save.flags.researchDelivered,true);assert(g.map.warps.some(w=>w.to==='research_path'));assert(g.map.warps.some(w=>w.to==='research_path'));
  const done=parseSave(JSON.stringify(g.save))!;g.restore(before);assert(!g.save.flags.researchDelivered);g.restore(done);assert(g.map.warps.some(w=>w.to==='research_path'));g.event('researchGate');finish(g);assert.equal(g.save.money,8400);
  g.event('observation');assert(g.dialogue?.pages.some(l=>l.includes('무사히 전달')));finish(g);
}));
test('Veilstone guide stops directing a completed observation delivery',()=>ui(()=>{
  const g=new Engine();g.save=ready(7,15,4);g.save.map='tour_veilstone';g.save.flags.observationCollected=true;g.save.flags.researchDelivered=true;
  g.event('sinnohGuide');assert(g.dialogue?.pages.some(line=>line.includes('무사히 전달')));assert(!g.dialogue?.pages.some(line=>line.includes('관측 연구원을 만나세요')));finish(g);
  const restored=parseSave(JSON.stringify(g.save))!;g.restore(restored);g.event('sinnohGuide');assert(g.dialogue?.pages.some(line=>line.includes('새로운 소식')));finish(g);
}));
test('Sinnoh city guides do not direct the player to an already won gym',()=>ui(()=>{
  const g=new Engine();g.save=ready(7,15,2);g.save.map='tour_eterna';g.event('sinnohGuide');assert(g.dialogue?.pages.some(line=>line.includes('멜리사에게 도전')));assert(!g.dialogue?.pages.some(line=>line.includes('먼저 유채')));finish(g);
  g.save=ready(7,15,3);g.save.map='tour_hearthome';g.event('sinnohGuide');assert(g.dialogue?.pages.some(line=>line.includes('자두 체육관')));assert(!g.dialogue?.pages.some(line=>line.includes('이곳은 멜리사의')));finish(g);
  const restored=parseSave(JSON.stringify(g.save))!;g.restore(restored);g.event('sinnohGuide');assert(g.dialogue?.pages.some(line=>line.includes('자두 체육관')));finish(g);
}));
test('free ferry cancellation, outbound reload and return preserve party, supplies and funds',()=>ui(()=>{
  const g=new Engine();g.save=ready(7,15,4);g.save.flags.observationCollected=true;g.save.flags.researchDelivered=true;g.save.map='tour_canalave';g.save.player={...worldSpawn('tour_canalave')!,facing:'down'};const party=JSON.stringify(g.save.party),inv={...g.save.inventory};g.event('ferry');g.cancel();assert.equal(g.save.map,'tour_canalave');assert(!g.save.flags.ferryPass);g.event('ferry');finish(g);assert.equal(g.save.map,'tour_vermilion');assert.equal(g.save.flags.ferryPass,true);g.restore(parseSave(JSON.stringify(g.save))!);g.event('ferry');finish(g);assert.equal(g.save.map,'tour_canalave');assert.equal(JSON.stringify(g.save.party),party);assert.deepEqual(g.save.inventory,inv);assert.equal(g.save.money,8400);
}));
test('revision 5 capped partners and first badge migrate without losing valid progress',()=>{
  const s=ready();s.worldRevision=5;s.party[0].experience=0;const loaded=parseSave(JSON.stringify(s))!;assert(loaded);assert.equal(loaded.worldRevision,TOWN_REVISION);assert.deepEqual(loaded.party,s.party);assert.deepEqual(loaded.badges,s.badges);gainExperience(loaded.party[0],150);assert.equal(loaded.party[0].level,16);assert(parseSave(JSON.stringify(loaded)));
});
test('save rejects skipped badges, missing TM, unearned records and invalid story dependencies',()=>{
  for(const mutate of [(s:any)=>s.badges.push('BADGE-GS03'),(s:any)=>s.keyItems.push('TM-grass-knot'),(s:any)=>s.flags.observationCollected=true,(s:any)=>s.flags.researchDelivered=true,(s:any)=>s.flags.ferryPass=true,(s:any)=>s.flags.observationCollected=1]){const s=ready();mutate(s);assert.equal(parseSave(JSON.stringify(s)),null)}
});
test('every integrated story map warp executes with a legal arrival and checkpoint',()=>{
  const s=ready(7,15,4);s.flags.observationCollected=true;s.flags.researchDelivered=true;s.flags.ferryPass=true;
  for(const m of [MAPS.jubilife,...Object.values(SINNOH_MAPS)].map(m=>getMap(worldMapId(m.id),s.flags)))for(const w of m.warps){const g=new Engine();g.save=structuredClone(s);g.save.map=m.id;const v={up:[0,-1],down:[0,1],left:[-1,0],right:[1,0]}[w.entry];g.save.player={x:w.x-v[0],y:w.y-v[1],facing:w.entry};assert(canStand(getMap(m.id,s.flags),g.save.player.x,g.save.player.y));step(g,'Arrow'+w.entry[0].toUpperCase()+w.entry.slice(1));assert.equal(g.save.map,w.to);assert.deepEqual(g.save.player,{...w.spawn,facing:w.facing});assert(parseSave(JSON.stringify(g.save)));}
  const closed=ready();assert.equal(checkpoint(closed).map,'tour_jubilife');
});
