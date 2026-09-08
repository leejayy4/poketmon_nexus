import test from 'node:test';
import assert from 'node:assert/strict';
import {Engine} from '../src/engine';
import {newSave,parseSave} from '../src/save';
import {grantPokemon} from '../src/pokemon';
import {GYMS} from '../src/gyms';
import {worldSpawn} from '../src/unified-world';
import {FERRY_DURATION} from '../src/ferry-journey';

function ui(run:()=>void){const old=Object.getOwnPropertyDescriptor(globalThis,'document');Object.defineProperty(globalThis,'document',{configurable:true,value:{getElementById:()=>null}});try{run();}finally{if(old)Object.defineProperty(globalThis,'document',old);else Reflect.deleteProperty(globalThis,'document');}}
function ready(map:'tour_canalave'|'tour_vermilion'='tour_canalave'){
  const g=new Engine();g.save=newSave();grantPokemon(g.save,1);g.save.flags.departureCleared=true;g.save.badges=GYMS.map(g=>g.badge);g.save.keyItems=GYMS.map(g=>g.tm);g.save.flags.observationCollected=true;g.save.flags.researchDelivered=true;
  if(map==='tour_vermilion')g.save.flags.ferryPass=true;
  g.save.map=map;g.save.player={...worldSpawn(map)!,facing:'down'};g.save.healingPoint='tour_veilstone_center';g.save.money=6060;g.save.inventory={pokeBalls:3,potions:10};return g;
}
function finish(g:Engine){for(let i=0;i<20&&g.dialogue;i++)g.confirm();assert.equal(g.dialogue,null);}
function ticks(g:Engine,count:number){for(let i=0;i<count;i++)g.update(.05);}
test('ferry choice starts a locked 1.8 second journey and commits destination once at arrival in both directions',()=>ui(()=>{
  for(const outbound of [true,false]){
    const g=ready(outbound?'tour_canalave':'tour_vermilion'),before=structuredClone(g.save);let writes=0;g.persist=()=>{writes++;return true;};
    g.event('ferry');const stale=g.dialogue!.choices![0].action;g.keys.add('ArrowRight');finish(g);
    assert.deepEqual(g.ferryJourney,{elapsed:0,duration:FERRY_DURATION,outbound});assert.equal(g.locked,true);assert.equal(g.dialogue,null);assert.equal(g.keys.size,0);assert.equal(writes,0);assert.deepEqual(g.save,before);
    stale();g.press('ArrowRight');g.press('x');g.press('m');g.confirm();g.cancel();g.walk('left');g.event('ferry');assert.equal(g.move,null);assert.equal(g.panel,'field');assert.equal(g.dialogue,null);assert.equal(g.keys.size,0);
    ticks(g,35);assert.equal(g.save.map,before.map);assert.equal(writes,0);assert(g.ferryJourney);assert(g.snapshot().ferryJourney!.elapsed>1.7);
    ticks(g,1);assert.equal(g.ferryJourney,null);assert.equal(g.save.map,outbound?'tour_vermilion':'tour_canalave');assert.deepEqual(g.save.player,{...worldSpawn(g.save.map)!,facing:'down'});assert.equal(g.save.flags.ferryPass,true);assert.equal(writes,1);assert(g.dialogue?.pages[0].includes(outbound?'갈색항에 도착':'운하항에 도착'));
    assert.deepEqual(g.save.party,before.party);assert.deepEqual(g.save.inventory,before.inventory);assert.equal(g.save.money,before.money);assert.deepEqual(g.save.badges,before.badges);assert.deepEqual(g.save.keyItems,before.keyItems);
    stale();ticks(g,40);assert.equal(writes,1);assert.equal(g.ferryJourney,null);
  }
}));
test('mid-voyage save stays at departure, restore cancels the old journey, and returnHome cannot complete it later',()=>ui(()=>{
  for(const mode of ['restore','returnHome'] as const){
    const g=ready();g.event('ferry');finish(g);ticks(g,12);
    const snapshot=g.snapshot();assert(snapshot.ferryJourney);assert.equal(snapshot.save.map,'tour_canalave');assert(!snapshot.save.flags.ferryPass);
    const stored=parseSave(JSON.stringify(g.save));assert(stored);assert(!('ferryJourney' in stored));assert.equal(stored.map,'tour_canalave');
    if(mode==='restore')g.restore(stored);else g.returnHome();
    const after=structuredClone(g.save);assert.equal(g.ferryJourney,null);ticks(g,40);assert.equal(g.save.map,after.map);assert.deepEqual(g.save.player,after.player);assert(!g.save.flags.ferryPass);assert.equal(g.dialogue,null);
  }
}));
test('declining or restoring a boarding prompt invalidates its callback and an undelivered record cannot board',()=>ui(()=>{
  const g=ready();g.event('ferry');let stale=g.dialogue!.choices![0].action;g.cancel();stale();assert.equal(g.ferryJourney,null);assert(!g.save.flags.ferryPass);
  g.event('ferry');stale=g.dialogue!.choices![0].action;g.restore(structuredClone(g.save));stale();assert.equal(g.ferryJourney,null);
  g.save.flags.researchDelivered=false;g.event('ferry');assert.equal(g.dialogue?.choices,undefined);finish(g);assert.equal(g.ferryJourney,null);assert.equal(g.save.map,'tour_canalave');
}));
test('revisiting the observation researcher after collection only reminds delivery without rewriting progress',()=>ui(()=>{
  const g=ready();g.save.map='tour_veilstone';g.save.flags.researchDelivered=false;const before=structuredClone(g.save);let writes=0;g.persist=()=>{writes++;return true;};
  g.event('observation');assert.deepEqual(g.dialogue?.pages,['맡긴 관측 자료는 축복시티의\n연구 통로 안내원에게 전해 주세요.']);finish(g);assert.deepEqual(g.save,before);assert.equal(writes,0);
  delete g.save.flags.observationCollected;g.event('observation');assert.equal(g.save.flags.observationCollected,true);assert.equal(writes,1);assert(g.dialogue?.pages.some(p=>p.includes('관측 자료를 맡길게요')));
}));
