import { TOWN_REVISION } from '../src/town';
import test from 'node:test';
import assert from 'node:assert/strict';
import { getMap } from '../src/maps';
import { Engine,VECTOR } from '../src/engine';
import { newSave,parseSave } from '../src/save';
import { grantPokemon } from '../src/pokemon';
import { createBattle,battleTurn } from '../src/battle';
import { gainExperience,maxHpAtLevel } from '../src/growth';
import { FIRST_BADGE,FIRST_TM,grantFirstBadge } from '../src/first-badge';
function ready(species=7,level=8){const s=newSave();grantPokemon(s,species);Object.assign(s.party[0],{level,hp:maxHpAtLevel(species,level),maxHp:maxHpAtLevel(species,level)});s.flags.departureCleared=true;s.inventory={pokeBalls:5,potions:2};s.map='oreburgh_gym';s.player={x:8,y:5,facing:'up'};return s}
function ui(run:()=>void){const old=Object.getOwnPropertyDescriptor(globalThis,'document');Object.defineProperty(globalThis,'document',{configurable:true,value:{getElementById:()=>null}});try{run()}finally{if(old)Object.defineProperty(globalThis,'document',old);else Reflect.deleteProperty(globalThis,'document')}}
function finish(g:Engine){for(let i=0;g.dialogue&&i<100;i++)g.confirm();assert.equal(g.dialogue,null)}
function step(g:Engine,key:string){g.press(key);g.release(key);for(let i=0;i<20;i++)g.update(.04)}

test('growth carries residual XP, restores only gained HP and stops at level 25',()=>{
  const p=ready(7,5).party[0];p.hp=7;gainExperience(p,49);assert.equal(p.level,5);gainExperience(p,1);assert.deepEqual([p.level,p.experience,p.hp,p.maxHp],[6,0,10,23]);
  gainExperience(p,130);assert.deepEqual([p.level,p.experience,p.hp,p.maxHp],[8,0,16,29]);gainExperience(p,99999);assert.equal(p.level,25);assert.equal(p.experience,0);const copy={...p};gainExperience(p,100);assert.deepEqual(p,copy);
});
test('all four level 8 partners can defeat the complete gym team with two potions',()=>{
  for(const species of [1,4,7,25]){const s=ready(species),b=createBattle(s,'gym')!;const seen=new Set<number>();let outcome;
    for(let i=0;i<40&&!b.result;i++){seen.add(b.enemy.species);const p=s.party[b.active];outcome=battleTurn(s,b,p.hp<=10&&s.inventory.potions?'potion':'move0').outcome;}
    assert.equal(outcome,'won',String(species));assert.deepEqual([...seen],[74,95,408]);assert(s.party[0].hp>0);assert.equal(s.party[0].level,9);assert.equal(s.party[0].experience,70);assert(parseSave(JSON.stringify(s)));
    const copy=JSON.stringify(s);battleTurn(s,b,'move0');assert.equal(JSON.stringify(s),copy);
  }
});
test('trainer capture is rejected without a turn; enemy change resets debuffs; retreat grants nothing',()=>{
  const s=ready(),b=createBattle(s,'gym')!,before=JSON.stringify(s);battleTurn(s,b,'ball');assert.equal(JSON.stringify(s),before);
  b.enemyDefenseDrop=3;b.enemyAttackDrop=3;b.enemy.hp=1;battleTurn(s,b,'move0');assert.equal(b.enemy.species,95);assert.equal(b.enemyDefenseDrop,0);assert.equal(b.enemyAttackDrop,0);assert.equal(s.party[0].experience,50);
  assert.equal(battleTurn(s,b,'run').outcome,'escaped');assert.deepEqual(s.badges,[]);assert.equal(s.money,0);
});
test('gym confirmation can cancel, accepts a healthy partner, and rejects no partner',()=>ui(()=>{
  const g=new Engine();g.save=ready();g.event('roark');g.cancel();assert.equal(g.battle,null);assert.equal(g.dialogue,null);g.event('roark');finish(g);assert.equal(g.battle?.kind,'gym');
  g.restore(newSave());g.event('roark');finish(g);assert.equal(g.battle,null);
}));
test('final knockout commits all rewards once before dialogue and survives reload/revisit',()=>ui(()=>{
  const g=new Engine();g.save=ready();g.event('roark');finish(g);
  for(let i=0;g.battle&&!g.battle.result&&i<40;i++){const p=g.save.party[g.battle.active];g.actBattle(p.hp<=10&&g.save.inventory.potions?'potion':'move0');if(!g.battle?.result)finish(g);}
  assert(g.dialogue);assert.deepEqual(g.save.badges,[FIRST_BADGE]);assert.deepEqual(g.save.keyItems,[FIRST_TM]);assert.equal(g.save.money,1440);
  const saved=parseSave(JSON.stringify(g.save))!;assert(saved);g.restore(saved);assert.equal(g.battle,null);g.event('roark');finish(g);assert.equal(g.battle,null);assert.equal(grantFirstBadge(g.save),false);assert.equal(g.save.money,1440);
}));
test('nurse sets a persistent recovery point; gym defeat recovers there without badge',()=>ui(()=>{
  for(const map of ['tour_jubilife_center','tour_oreburgh_center'] as const){const g=new Engine();g.save=ready();g.save.map=map;g.save.player={x:8,y:7,facing:'up'};g.save.party[0].hp=1;g.save.inventory.potions=0;g.event('nurse');finish(g);assert.equal(g.save.healingPoint,map);assert.equal(g.save.party[0].hp,29);assert.equal(g.save.inventory.potions,2);
    g.save.map='oreburgh_gym';g.save.player={x:8,y:5,facing:'up'};g.save.party[0].hp=1;g.event('roark');finish(g);g.actBattle('move0');assert.equal(g.save.map,map);assert.deepEqual(g.save.player,{x:8,y:10,facing:'up'});assert.equal(g.save.party[0].hp,29);assert.deepEqual(g.save.badges,[]);assert(parseSave(JSON.stringify(g.save)));
  }
}));
test('reload during the second opponent keeps earned XP but cancels the challenge without rewards',()=>ui(()=>{
  const g=new Engine();g.save=ready();g.battle=createBattle(g.save,'gym');g.battle!.enemy.hp=1;g.actBattle('move0');const saved=parseSave(JSON.stringify(g.save))!;assert.equal(saved.party[0].experience,50);g.restore(saved);assert.equal(g.battle,null);assert.deepEqual(g.save.badges,[]);g.event('roark');finish(g);assert.equal(g.battle?.enemy.species,74);
}));
test('revision 4 save migration preserves party, inventory and flags while supplying new fields',()=>{
  const original=ready(7,5),raw:any=JSON.parse(JSON.stringify(original));raw.worldRevision=4;raw.map='route_s01';raw.player={x:3,y:12,facing:'left'};for(const k of ['badges','keyItems','money','healingPoint'])delete raw[k];delete raw.party[0].experience;
  const loaded=parseSave(JSON.stringify(raw))!;assert(loaded);assert.deepEqual(loaded.party,original.party);assert.deepEqual(loaded.inventory,original.inventory);assert.deepEqual(loaded.flags,original.flags);assert.deepEqual(loaded.badges,[]);assert.equal(loaded.money,0);assert.equal(loaded.healingPoint,'home');assert.equal(loaded.worldRevision,TOWN_REVISION);
});
test('save validation rejects invalid growth, trainer-only ownership and inconsistent badges',()=>{
  const mutations=[(s:any)=>s.party[0].level=26,(s:any)=>s.party[0].experience=80,(s:any)=>s.party[0].maxHp++,(s:any)=>s.party[0].species=74,(s:any)=>s.money=-1,(s:any)=>s.healingPoint='lab',(s:any)=>s.badges=[FIRST_BADGE],(s:any)=>{s.badges=[FIRST_BADGE,FIRST_BADGE];s.keyItems=[FIRST_TM,FIRST_TM]}];
  for(const mutate of mutations){const s=ready();mutate(s);assert.equal(parseSave(JSON.stringify(s)),null)}
});
test('western route, expanded cities and both center/gym entrances round trip',()=>{
  const g=new Engine();g.save=ready();
  const sources=['route_s01','tour_jubilife','tour_oreburgh','tour_jubilife_center','tour_oreburgh_center','oreburgh_gym'] as const;
  for(const id of sources)for(const w of getMap(id,g.save.flags).warps){const v=VECTOR[w.entry];g.save.map=id;g.save.player={x:w.x-v.x,y:w.y-v.y,facing:w.entry};step(g,'Arrow'+w.entry[0].toUpperCase()+w.entry.slice(1));assert.equal(g.save.map,w.to);assert(parseSave(JSON.stringify(g.save)));}
});
