import test from 'node:test';
import assert from 'node:assert/strict';
import { adventureGuide,adventureObjective } from '../src/adventure-guide';
import { newSave,parseSave } from '../src/save';
import { grantPokemon } from '../src/pokemon';
import { Engine } from '../src/engine';
import { createBattle } from '../src/battle';
import { GYMS } from '../src/gyms';

function ready(){const s=newSave();grantPokemon(s,7);s.flags.departureCleared=true;s.map='route_s01';s.player={x:25,y:11,facing:'up'};s.party[0].hp=4;return s;}
function dom(run:()=>void){const old=Object.getOwnPropertyDescriptor(globalThis,'document');Object.defineProperty(globalThis,'document',{value:{getElementById:()=>null},configurable:true});try{run();}finally{if(old)Object.defineProperty(globalThis,'document',old);else Reflect.deleteProperty(globalThis,'document');}}
function finish(g:Engine){for(let i=0;i<30&&g.dialogue;i++)g.confirm();assert(!g.dialogue);}

test('critical HP boundary and fainted reserves temporarily prioritize recovery without replacing story progress',()=>{
  const s=ready(),before=structuredClone(s);assert.equal(adventureGuide(s)!.objective.id,'recover');assert.equal(adventureObjective(s)!.id,'roark');assert.deepEqual(s,before);
  s.party[0].hp=5;assert.equal(adventureGuide(s)!.objective.id,'roark');
  s.party.push({species:399,level:3,hp:0,maxHp:18,experience:0,nature:'성실',met:'새잎 서쪽길'});
  assert.match(adventureGuide(s)!.lines[0],/쓰러진/);s.party[1].hp=18;assert.equal(adventureGuide(s)!.objective.id,'roark');
  s.party=[];assert.equal(adventureGuide(s)!.objective.id,'partner');s.flags.exploration=true;assert.equal(adventureGuide(s)!.objective.id,'partner');
});

test('recovery chooses existing local NPCs and follows real gym exits to a center',()=>{
  const s=ready();assert.equal(adventureGuide(s)!.objective.map,'route_s01');assert.match(adventureGuide(s)!.lines[1],/길 안내원/);
  s.map='home';assert.match(adventureGuide(s)!.lines[1],/엄마/);
  s.map='oreburgh_gym';assert.equal(adventureGuide(s)!.objective.map,'tour_oreburgh_center');assert.equal(adventureGuide(s)!.lines[1],'다음 구역: 무쇠시티');
  s.map='tour_oreburgh_center';assert.match(adventureGuide(s)!.lines[1],/간호사/);
});

test('expanded port has its own working center even before the research ferry quest',()=>{
  const s=ready();s.map='tour_vermilion';s.flags.researchDelivered=true;s.flags.ferryPass=true;
  assert.equal(adventureGuide(s)!.objective.map,'tour_vermilion_center');assert.equal(adventureGuide(s)!.lines[1],'다음 구역: 갈색시티 · 포켓몬센터');
  s.flags.researchDelivered=false;assert.equal(adventureGuide(s)!.objective.id,'recover');
});

test('escaping with critical HP shows recovery and actual route-guide healing restores the original objective',()=>dom(()=>{
  const g=new Engine();g.exploring=false;g.save=ready();g.save.party[0].hp=8;g.save.inventory={pokeBalls:0,potions:0};g.battle=createBattle(g.save);
  assert.equal(adventureGuide(g.save)!.objective.id,'roark');g.actBattle('move1');finish(g);assert.equal(g.save.party[0].hp,4);
  g.actBattle('run');finish(g);assert(!g.battle);assert.equal(adventureGuide(g.save)!.objective.id,'recover');
  const flags=structuredClone(g.save.flags);g.event('routeGuide');finish(g);assert.equal(g.save.party[0].hp,20);assert.equal(g.save.inventory.potions,2);assert.equal(g.save.inventory.pokeBalls,5);
  assert.equal(adventureGuide(g.save)!.objective.id,'roark');assert.deepEqual(g.save.flags,flags);assert.equal(g.save.party[0].experience,0);
}));

test('saving a recovery state preserves badges and fainted HP; nursing restores both party and next badge guidance',()=>dom(()=>{
  const g=new Engine();g.exploring=false;g.save=ready();g.save.badges=[GYMS[0].badge];g.save.keyItems=[GYMS[0].tm];g.save.map='tour_oreburgh_center';g.save.player={x:8,y:7,facing:'up'};
  g.save.party.push({species:399,level:3,hp:0,maxHp:18,experience:12,nature:'성실',met:'새잎 서쪽길'});
  const saved=parseSave(JSON.stringify(g.save));assert(saved);g.restore(saved);assert.equal(adventureGuide(g.save)!.objective.id,'recover');assert.equal(g.save.party[1].hp,0);
  g.event('nurse');finish(g);assert.equal(adventureGuide(g.save)!.objective.id,'gardenia');assert.equal(g.save.party[1].experience,12);assert(g.save.party.every(p=>p.hp===p.maxHp));assert.equal(g.save.healingPoint,'tour_oreburgh_center');
}));
