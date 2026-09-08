import test from 'node:test';
import assert from 'node:assert/strict';
import { Engine, VECTOR } from '../src/engine';
import { newSave, parseSave } from '../src/save';
import { grantPokemon } from '../src/pokemon';
import { getMap, canStand } from '../src/maps';
import { canChallenge } from '../src/gyms';
import { GYM_ROCKS } from '../src/badge-maps';
import { handleGymCart, updateGymCart, gymCartView, gymCartMoving } from '../src/gym-cart';

function dom(run:()=>void){const old=globalThis.document;globalThis.document={getElementById:()=>null} as unknown as Document;try{run();}finally{globalThis.document=old;}}
function fixture(){const g=new Engine();g.save=newSave();grantPokemon(g.save,7);g.save.flags.departureCleared=true;g.save.map='oreburgh_gym';g.save.player={x:8,y:13,facing:'up'};let writes=0;g.persist=()=>{writes++;return true;};return {g,get writes(){return writes;}};}
function event(g:Engine,id:string){g.dialogue=null;assert(handleGymCart(g,'gymCart'+id));}
function choose(g:Engine,index=0){const c=g.dialogue?.choices?.[index];assert(c);g.dialogue=null;c.action();}
function send(g:Engine){event(g,'Launch');choose(g);assert(gymCartMoving(g));}
function tick(g:Engine,elapsed=1.21){g.clock+=elapsed;updateGymCart(g);}

test('cart props use existing rock collision and preserve leader, trainers, guide and every floor connection',()=>{
  const map=getMap('oreburgh_gym'),props=map.props.filter(p=>p.dialogue.startsWith('gymCart'));
  assert.equal(props.length,3);
  for(const p of props){assert(GYM_ROCKS.some(([x,y,w,h])=>p.x>=x&&p.x<x+w&&p.y>=y&&p.y<y+h));assert(!canStand(map,p.x,p.y));assert(canStand(map,p.x,p.y+1));}
  const q=[[8,13]],seen=new Set<string>();
  for(let i=0;i<q.length;i++){const [x,y]=q[i],key=`${x},${y}`;if(seen.has(key)||!canStand(map,x,y))continue;seen.add(key);for(const v of Object.values(VECTOR))q.push([x+v.x,y+v.y]);}
  for(let y=0;y<map.height;y++)for(let x=0;x<map.width;x++)if(canStand(map,x,y))assert(seen.has(`${x},${y}`));
  for(let y=5;y<=15;y++)assert(canStand(map,8,y));
  for(const n of map.npcs)assert(Object.values(VECTOR).some(v=>seen.has(`${n.x+v.x},${n.y+v.y}`)),n.id);
  assert(canChallenge(fixture().g.save,'roark'));
  for(const id of ['eterna_gym','hearthome_gym','veilstone_gym'] as const){
    const other=getMap(id);
    assert(!other.props.some(p=>p.dialogue.startsWith('gymCart')));
    assert(!other.npcs.some(n=>n.id==='gymTypeTrainer'||n.id==='gymSwitchTrainer'));
  }
});

test('observation and launch cancellation preserve progress, and canceled callbacks cannot start a cart',()=>dom(()=>{
  const f=fixture(),g=f.g,before=structuredClone(g.save);event(g,'Observe');assert.match(g.dialogue!.pages[0],/줄무늬/);assert.match(g.dialogue!.pages.join(''),/건너뛰어도/);event(g,'Launch');assert.equal(g.dialogue!.selected,1);const replay=g.dialogue!.choices![0].action;choose(g,1);replay();assert(!gymCartMoving(g));assert.deepEqual(g.save,before);assert.equal(f.writes,0);
  assert.equal(handleGymCart(g,'roark'),false);g.save.map='town';assert.equal(handleGymCart(g,'gymCartLever'),false);
}));

test('wrong branch returns to the start without advancing, then both correct deliveries complete exactly once',()=>dom(()=>{
  const f=fixture(),g=f.g,progress=structuredClone(g.save);event(g,'Lever');assert(gymCartView(g).right);send(g);tick(g,.6);assert(gymCartMoving(g));assert(gymCartView(g).targetRight,'incorrect delivery follows the selected right branch');assert.equal(gymCartView(g).progress,.5);assert.equal(gymCartView(g).stage,0);tick(g,.61);assert(!gymCartMoving(g));assert.equal(gymCartView(g).stage,0);assert.match(g.dialogue!.pages[0],/무늬가 달라/);assert.equal(f.writes,1);
  event(g,'Lever');assert(!gymCartView(g).right);send(g);assert(!gymCartView(g).targetRight);tick(g);assert.equal(gymCartView(g).stage,1);assert(!gymCartView(g).targetRight);assert.match(g.dialogue!.pages[0],/1\/2/);event(g,'Observe');assert.match(g.dialogue!.pages[0],/점무늬/);event(g,'Lever');send(g);assert(gymCartView(g).targetRight);tick(g);assert.equal(gymCartView(g).stage,2);assert.match(g.dialogue!.pages[0],/완료등/);assert.equal(f.writes,5);
  const done=structuredClone(g.save);for(const action of ['Observe','Lever','Launch']){event(g,action);assert.equal(g.dialogue!.choices,undefined);assert.match(g.dialogue!.pages[0],/2\/2/);}tick(g,10);assert.deepEqual(g.save,done);assert.equal(f.writes,5);assert.deepEqual(g.save.party,progress.party);assert.equal(g.save.money,progress.money);assert.deepEqual(g.save.inventory,progress.inventory);assert.deepEqual(g.save.badges,progress.badges);assert(canChallenge(g.save,'roark'));
}));

test('departure, replacing a save, battle, and changed puzzle state cancel a run without delayed commits',()=>dom(()=>{
  for(const kind of ['map','save','battle','stage','direction']){
    const f=fixture(),g=f.g;send(g);
    if(kind==='map')g.save.map='town';
    if(kind==='save')g.save=structuredClone(g.save);
    if(kind==='battle')g.battle={} as NonNullable<Engine['battle']>;
    if(kind==='stage')g.save.flags.gymCartStage=1;
    if(kind==='direction')g.save.flags.gymCartRight=true;
    tick(g);assert(!gymCartMoving(g),kind);assert.equal(f.writes,0,kind);assert.equal(g.save.flags.gymCartStage,kind==='stage'?1:undefined,kind);
  }
  const f=fixture();f.g.battle={} as NonNullable<Engine['battle']>;assert(handleGymCart(f.g,'gymCartLever'));assert.equal(f.writes,0);assert.equal(f.g.save.flags.gymCartRight,undefined);
}));

test('launch callbacks are single use and cannot act on another save or changed direction',()=>dom(()=>{
  for(const kind of ['save','map','direction']){const f=fixture(),g=f.g;event(g,'Launch');const launch=g.dialogue!.choices![0].action;if(kind==='save')g.save=structuredClone(g.save);if(kind==='map')g.save.map='town';if(kind==='direction')g.save.flags.gymCartRight=true;launch();assert(!gymCartMoving(g));}
  const f=fixture(),g=f.g;event(g,'Launch');const launch=g.dialogue!.choices![0].action;choose(g);g.clock+=.4;launch();assert(Math.abs(gymCartView(g).progress!-1/3)<1e-9);event(g,'Lever');assert.equal(g.save.flags.gymCartRight,undefined);tick(g,.81);assert.equal(gymCartView(g).stage,1);assert.equal(f.writes,1);launch();tick(g,5);assert.equal(f.writes,1);
}));

test('old, in-flight, partial and completed saves round-trip without requiring puzzle flags or persisting animation',()=>dom(()=>{
  const f=fixture(),g=f.g;assert.equal(gymCartView(g).stage,0);assert(parseSave(JSON.stringify(g.save)));send(g);const inflight=parseSave(JSON.stringify(g.save));assert(inflight);g.restore(inflight);assert(!gymCartMoving(g));assert.equal(gymCartView(g).stage,0);
  send(g);tick(g);const partial=parseSave(JSON.stringify(g.save));assert(partial);g.restore(partial);assert.equal(gymCartView(g).stage,1);assert(!gymCartMoving(g));event(g,'Lever');send(g);tick(g);const done=parseSave(JSON.stringify(g.save));assert(done);g.restore(done);assert.equal(gymCartView(g).stage,2);assert(gymCartView(g).right);
  for(const invalid of [-1,99,.5,true]){g.save.flags.gymCartStage=invalid;assert.equal(gymCartView(g).stage,0);}g.save.flags.gymCartRight=1;assert.equal(gymCartView(g).right,false);
}));

test('field interaction launches the cart and Engine updates finish it while field controls remain locked',()=>dom(()=>{
  const f=fixture(),g=f.g;g.save.player={x:6,y:8,facing:'up'};g.confirm();assert.equal(g.dialogue?.speaker,'탄차 출발 버튼');choose(g);assert(g.locked);const player={...g.save.player};g.press('ArrowRight');g.confirm();g.cancel();assert.equal(g.move,null);assert.equal(g.dialogue,null);assert.deepEqual(g.save.player,player);
  for(let i=0;i<25;i++)g.update(.05);
  assert.equal(gymCartView(g).stage,1);assert(!gymCartMoving(g));assert.match(g.dialogue!.pages[0],/1\/2/);assert.equal(f.writes,1);assert.equal(g.snapshot().gymCart.stage,1);
}));
