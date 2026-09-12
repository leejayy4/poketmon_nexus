import test from 'node:test';
import assert from 'node:assert/strict';
import { Engine } from '../src/engine';
import { createBattle } from '../src/battle';
import { newSave,parseSave } from '../src/save';
import { grantPokemon } from '../src/pokemon';
import { canStand } from '../src/maps';

test('both Cinnabar encounters recover a defeat to a saved and healed island center',()=>{
  const old=Object.getOwnPropertyDescriptor(globalThis,'document');
  Object.defineProperty(globalThis,'document',{configurable:true,value:{getElementById:()=>null}});
  try{for(const random of [()=>0,()=>.999]){
    const g=new Engine();g.save=newSave();grantPokemon(g.save,1);
    g.save.flags.departureCleared=true;g.save.flags.cinnabarCliffObserved=true;g.save.flags.cinnabarShoreObserved=true;
    g.save.map='tour_cinnabar';g.save.player={x:9,y:31,facing:'left'};g.save.healingPoint='tour_cinnabar_center';
    g.save.party[0].hp=1;g.save.party[0].moves=['울음소리'];
    g.battle=createBattle(g.save,'wild','roark',random);assert(g.battle);
    assert([58,88].includes(g.battle.enemy.species));const before=structuredClone(g.save);g.random=()=>0;
    const saves:string[]=[];g.persist=()=>{saves.push(JSON.stringify(g.save));return true;};
    g.actBattle('move0');assert.equal(g.save.map,'tour_cinnabar_center');assert.equal(g.battle,null);
    assert(canStand(g.map,g.save.player.x,g.save.player.y));assert(g.save.party.every(p=>p.hp===p.maxHp));
    assert.equal(saves.length,1);const restored=parseSave(saves[0]);assert(restored);
    for(const k of ['flags','inventory','money','badges','box','pokedex'] as const)assert.deepEqual(restored[k],before[k],k);
    g.restore(restored);assert.equal(g.defeatScene,null);assert.equal(g.recoveryPreview,false);
    assert.equal(g.save.map,'tour_cinnabar_center');
  }}finally{if(old)Object.defineProperty(globalThis,'document',old);else Reflect.deleteProperty(globalThis,'document');}
});

test('Cinnabar music covers interiors, routes, battle priority and restored exploration',()=>{
  const g=new Engine();g.save=newSave();grantPokemon(g.save,1);g.save.flags.departureCleared=true;
  for(const map of ['tour_cinnabar','tour_cinnabar_hall','tour_cinnabar_home1','tour_cinnabar_center'] as const){
    g.save.map=map;g.update(0);assert.equal(g.audio.scene,'cinnabar',map);
  }
  g.save.map='tour_pass_pallet_cinnabar';g.update(0);assert.equal(g.audio.scene,'route');
  g.save.map='tour_cinnabar';g.battle=createBattle(g.save,'wild','roark',()=>0);g.update(0);assert.equal(g.audio.scene,'wild');
  g.battle=null;g.update(0);assert.equal(g.audio.scene,'cinnabar');assert.equal(g.audio.enabled,false);
  g.audio.dispose();
});
