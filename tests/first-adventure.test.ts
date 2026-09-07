import test from 'node:test';
import assert from 'node:assert/strict';
import { Engine } from '../src/engine';
import { getMap,canStand } from '../src/maps';
import { newSave,parseSave } from '../src/save';
import { grantPokemon } from '../src/pokemon';
import { createBattle,battleTurn } from '../src/battle';
import { checkpoint } from '../src/save-library';

function ui(run:()=>void){const previous=Object.getOwnPropertyDescriptor(globalThis,'document');Object.defineProperty(globalThis,'document',{configurable:true,value:{getElementById:()=>null}});try{run()}finally{if(previous)Object.defineProperty(globalThis,'document',previous);else Reflect.deleteProperty(globalThis,'document')}}
function finish(g:Engine){for(let i=0;g.dialogue&&i<60;i++)g.confirm();assert.equal(g.dialogue,null)}
function step(g:Engine,key:string){g.press(key);g.release(key);for(let i=0;i<20;i++)g.update(.04)}
function ready(species=7){const s=newSave();grantPokemon(s,species);s.flags.departureCleared=true;s.inventory={pokeBalls:5,potions:2};s.map='route_s01';s.player={x:29,y:12,facing:'left'};return s}
function encounter(g:Engine){g.save.player={x:17,y:6,facing:'right'};for(let i=0;i<6;i++)step(g,i%2?'ArrowLeft':'ArrowRight');assert(g.battle);finish(g)}

test('departure needs a healthy partner and completed guidance; all starter orders unlock only once',()=>ui(()=>{
  for(const ids of [[],[1],[4],[7],[25],[7,25]]){
    const g=new Engine();g.save=newSave();g.save.map='town';g.save.player={x:4,y:15,facing:'left'};
    for(const id of ids)grantPokemon(g.save,id);
    g.interact();assert(!g.save.flags.departureCleared);assert(!canStand(g.map,3,15));
    const before=parseSave(JSON.stringify(g.save))!;assert(!getMap('town',before.flags).warps.some(w=>w.to==='route_s01'));
    finish(g);assert.equal(g.save.flags.departureCleared===true,ids.length>0);
    if(!ids.length)continue;
    assert.deepEqual(g.save.inventory,{pokeBalls:5,potions:2});assert(canStand(g.map,3,15));assert(!canStand(g.map,4,14));
    g.event('gatekeeper');finish(g);assert.deepEqual(g.save.inventory,{pokeBalls:5,potions:2});
    const opened=parseSave(JSON.stringify(g.save))!;g.restore(before);assert(!canStand(g.map,3,15));g.restore(opened);assert(canStand(g.map,3,15));
  }
  const g=new Engine();g.save=ready();g.save.flags.departureCleared=false;g.save.party[0].hp=0;g.event('gatekeeper');finish(g);assert.equal(g.save.flags.departureCleared,false);
}));

test('unlocked western threshold and route entrance work both ways, including transition checkpoints',()=>{
  const g=new Engine();g.save=ready();g.save.map='town';g.save.player={x:4,y:15,facing:'left'};
  step(g,'ArrowLeft');step(g,'ArrowLeft');assert.equal(g.save.map,'route_s01');assert.deepEqual(g.save.player,{x:29,y:12,facing:'left'});
  step(g,'ArrowRight');assert.equal(g.save.map,'town');assert.deepEqual(g.save.player,{x:4,y:15,facing:'right'});
  g.save.player={x:2,y:15,facing:'left'};assert.equal(checkpoint(g.save).map,'route_s01');
  assert.equal(checkpoint({...g.save,flags:{starterReceived:true}}).map,'town');
});

test('safe road never encounters; six completed grass steps start battle and lock field movement',()=>ui(()=>{
  const g=new Engine();g.save=ready();for(let i=0;i<16;i++)step(g,i%2?'ArrowRight':'ArrowLeft');assert.equal(g.battle,null);
  encounter(g);const before={...g.save.player};g.press('ArrowUp');g.release('ArrowUp');assert.equal(g.move,null);assert.deepEqual(g.save.player,before);
  g.actBattle('run');finish(g);assert.equal(g.battle,null);assert.equal(g.grassSteps,0);step(g,'ArrowRight');assert.equal(g.battle,null);
}));

test('each partner wins the first battle; capture survives reload without changing gift flags',()=>{
  for(const species of [1,4,7,25]){
    const save=ready(species),b=createBattle(save)!;
    for(let i=0;i<3;i++)battleTurn(save,b,'move0');assert.equal(b.enemy.hp,0);assert(save.party[0].hp>0);assert(parseSave(JSON.stringify(save)));
    const next=createBattle(save)!;battleTurn(save,next,'move0');battleTurn(save,next,'move0');
    const flags={...save.flags};assert.equal(battleTurn(save,next,'ball',()=>.99).outcome,'caught');
    assert.equal(save.party.length,2);assert.deepEqual(save.flags,flags);assert.equal(save.inventory.pokeBalls,4);assert.equal(parseSave(JSON.stringify(save))?.party[1].species,399);
    battleTurn(save,next,'ball',()=>0);assert.equal(save.party.length,2);assert.equal(save.inventory.pokeBalls,4);
    assert.equal(grantPokemon(save,399),false);
  }
});

test('failed catches consume one ball and a turn; empty bag and full party cannot consume items',()=>{
  const s=ready(),b=createBattle(s)!;battleTurn(s,b,'ball',()=>.99);assert.equal(s.inventory.pokeBalls,4);assert.equal(s.party[0].hp,16);assert.equal(s.party.length,1);
  s.inventory.pokeBalls=0;const hp=s.party[0].hp;battleTurn(s,b,'ball');assert.equal(s.party[0].hp,hp);
  s.inventory.pokeBalls=5;while(s.party.length<6)s.party.push({...b.enemy});battleTurn(s,b,'ball');assert.equal(s.party.length,6);assert.equal(s.inventory.pokeBalls,5);assert(parseSave(JSON.stringify(s)));
});

test('support moves and potions change combat state with bounded effects',()=>{
  const s=ready(),b=createBattle(s)!;battleTurn(s,b,'move1');assert.equal(b.enemyDefenseDrop,1);battleTurn(s,b,'move0');assert.equal(b.enemy.hp,11);
  battleTurn(s,b,'potion');assert.equal(s.inventory.potions,1);assert.equal(s.party[0].hp,16);
  s.inventory.potions=0;const hp=s.party[0].hp;battleTurn(s,b,'potion');assert.equal(s.party[0].hp,hp);
  const pika=ready(25),pb=createBattle(pika)!;battleTurn(pika,pb,'move1');assert.equal(pb.enemyAttackDrop,1);assert.equal(pika.party[0].hp,16);
});

test('a fainted partner passes to the next healthy member; defeat recovers at home and persists',()=>ui(()=>{
  const s=ready();grantPokemon(s,25);s.party[0].hp=1;const b=createBattle(s)!;battleTurn(s,b,'move0');assert.equal(b.active,1);assert.equal(s.party[0].hp,0);
  const g=new Engine();g.save=ready();g.save.party[0].hp=1;encounter(g);g.actBattle('move0');assert.equal(g.battle,null);assert.equal(g.save.map,'home');assert.equal(g.save.party[0].hp,g.save.party[0].maxHp);assert.equal(g.save.flags.departureCleared,true);assert(parseSave(JSON.stringify(g.save)));
  const dead=ready();dead.party[0].hp=0;g.restore(dead);assert.equal(g.save.map,'home');assert.equal(g.save.party[0].hp,20);
}));

test('mid-battle saves preserve settled HP and items; restoration cancels old battle and dialogue',()=>ui(()=>{
  const g=new Engine();g.save=ready();encounter(g);g.actBattle('move0');const saved=parseSave(JSON.stringify(g.save))!;assert.equal(saved.party[0].hp,16);
  g.restore(saved);assert.equal(g.battle,null);assert.equal(g.dialogue,null);assert.equal(g.save.party[0].hp,16);assert.equal(g.save.map,'route_s01');
  encounter(g);g.actBattle('run');g.restore(newSave());finish(g);assert.equal(g.save.map,'bedroom');assert.equal(g.save.party.length,0);
}));

test('guide and mother heal; guide replenishes only missing supplies without stacking rewards',()=>ui(()=>{
  const g=new Engine();g.save=ready();g.save.party[0].hp=1;g.save.inventory={pokeBalls:0,potions:0};g.event('routeGuide');assert.equal(g.save.party[0].hp,20);assert.deepEqual(g.save.inventory,{pokeBalls:5,potions:2});finish(g);g.event('routeGuide');finish(g);assert.deepEqual(g.save.inventory,{pokeBalls:5,potions:2});
  g.save.party[0].hp=1;g.event('mom');assert.equal(g.save.party[0].hp,20);assert(g.dialogue!.pages.join('').includes('건강'));
  finish(g);g.save.party.push({...createBattle(g.save)!.enemy});g.event('mom');assert(g.dialogue!.pages[0].includes('모험길'));
}));

test('legacy saves gain empty inventory; invalid inventory and gift combinations are rejected; test travel does not grant departure',()=>{
  const old=ready();old.worldRevision=3;old.map='home';old.player={x:6,y:7,facing:'up'};delete old.flags.departureCleared;const raw=JSON.parse(JSON.stringify(old));delete raw.inventory;
  const loaded=parseSave(JSON.stringify(raw))!;assert(loaded);assert.deepEqual(loaded.inventory,{pokeBalls:0,potions:0});assert.deepEqual(loaded.party,old.party);
  for(const value of [-1,1.5,'5',null,1000]){const s=ready();(s.inventory as any).pokeBalls=value;assert.equal(parseSave(JSON.stringify(s)),null)}
  const s=ready();delete s.flags.departureCleared;assert(parseSave(JSON.stringify(s)));assert(!s.flags.departureCleared);
  s.map='home';s.player={x:6,y:7,facing:'up'};s.party.push({...s.party[0]});assert.equal(parseSave(JSON.stringify(s)),null);
});
