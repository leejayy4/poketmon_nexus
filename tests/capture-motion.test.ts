import test from 'node:test';
import assert from 'node:assert/strict';
import {Engine} from '../src/engine';
import {Renderer} from '../src/renderer';
import {battleTurn} from '../src/battle';
import {createBattle} from './runtime-battle-fixture';
import {captureMotion} from '../src/battle-effect';
import {newSave,parseSave} from '../src/save';
import {grantPokemon} from '../src/pokemon';
function dom(run:()=>void){const old=Object.getOwnPropertyDescriptor(globalThis,'document');Object.defineProperty(globalThis,'document',{configurable:true,value:{getElementById:()=>null}});try{run()}finally{if(old)Object.defineProperty(globalThis,'document',old);else Reflect.deleteProperty(globalThis,'document')}}
function game(){const g=new Engine();g.save=newSave();grantPokemon(g.save,7);g.save.flags.departureCleared=true;g.save.inventory.pokeBalls=3;g.battle=createBattle(g.save);return g}
function next(g:Engine){const d=g.dialogue!;if(d.shown<d.pages[d.page].length)g.confirm();g.confirm()}

test('successful and failed throws share the same initial scene without revealing the result',()=>{
  const success=game(),failure=game(),a=battleTurn(success.save,success.battle!,'ball',()=>0),b=battleTurn(failure.save,failure.battle!,'ball',()=>1);
  assert.deepEqual(a.frames![0],b.frames![0]);assert.equal(a.pages[0],b.pages[0]);assert.equal(a.frames![0].capture,'throw');assert.equal(a.outcome,'caught');assert.equal(b.outcome,undefined);assert(b.pages[1].includes('빠져나왔다'));assert.equal(b.frames![1].player.hp,20);assert.equal(b.frames![2].player.hp,20);assert.equal(b.frames![3].player.hp,16);assert(!b.frames![1].capture);assert(!b.frames![2].capture);assert.equal(success.save.inventory.pokeBalls,2);assert.equal(failure.save.inventory.pokeBalls,2);
});
test('the ball follows an arc, hides the target on contact and comes to rest without modifying game data',()=>{
  const g=game(),turn=battleTurn(g.save,g.battle!,'ball',()=>0),f=turn.frames![0],before=structuredClone({save:g.save,f});const start=captureMotion(f,0)!,middle=captureMotion(f,.225)!,land=captureMotion(f,.65)!,rest=captureMotion(f,2)!;
  assert.equal(start.hideEnemy,false);assert(middle.x>start.x&&middle.x<196);assert(middle.y<75);assert(land.hideEnemy);assert.deepEqual(rest,{phase:'rest',x:196,y:80,hideEnemy:true});assert.deepEqual({save:g.save,f},before);
  for(const t of [-1,NaN,Infinity])assert.equal(captureMotion(f,t),null);assert.equal(captureMotion(turn.frames![1],0),null);
});
test('failed escape restores the enemy before counterattack and success opens the existing catch card',()=>dom(()=>{
  for(const success of [true,false]){const g=game();g.random=()=>success?0:1;g.actBattle('ball');for(let i=0;i<30;i++)g.update(.05);assert.equal(g.captureMotion?.hideEnemy,true);const saved=structuredClone(g.save);next(g);assert.equal(g.captureMotion,null);assert.equal(g.showingCatch,success);assert.equal(g.battleFrame?.player.hp,20);if(!success){next(g);assert.equal(g.battleFrame?.player.hp,20);assert.equal(g.battleEffect,null);next(g);assert.equal(g.battleFrame?.player.hp,16);}assert.deepEqual(g.save,saved);}
}));
test('renderer draws the ball in flight and keeps the opponent hidden only during the throw page',()=>dom(()=>{
  const g=game();g.random=()=>1;g.actBattle('ball');const drawn:unknown[]=[],ctx=new Proxy({}, {get:(_,key)=>key==='drawImage'?(image:unknown)=>drawn.push(image):()=>{}}) as CanvasRenderingContext2D,canvas={getContext:()=>ctx} as HTMLCanvasElement,r=new Renderer(g,canvas,canvas),enemy={id:399} as unknown as HTMLImageElement;r.images['pokemon-399']=enemy;
  let balls=0;r.ball=()=>{balls++};r.battleTop(ctx);assert(drawn.includes(enemy));assert.equal(balls,1);for(let i=0;i<30;i++)g.update(.05);drawn.length=0;r.battleTop(ctx);assert(!drawn.includes(enemy));assert.equal(balls,2);next(g);drawn.length=0;r.battleTop(ctx);assert(drawn.includes(enemy));assert.equal(balls,2);
}));
test('fast forwarding and reload cannot replay a throw or grant another Pokemon',()=>dom(()=>{
  for(const mode of ['skip','reload','replace']){const g=game();g.random=()=>0;g.actBattle('ball');const saved=parseSave(JSON.stringify(g.save))!;assert(saved);if(mode==='reload')g.restore(saved);else if(mode==='replace')g.say('안내',['다른 대화']);else {for(let i=0;i<20&&g.dialogue;i++)g.confirm();}assert.equal(g.captureMotion,null);assert.equal(g.save.party.length,2);assert.equal(g.save.inventory.pokeBalls,2);assert.deepEqual(g.save.party,saved.party);assert(!('captureMotion'in saved));}
}));
test('empty balls, full party and box and gym capture rejection never animate or consume a ball',()=>dom(()=>{
  for(const mode of ['empty','full','gym']){const g=game();if(mode==='empty')g.save.inventory.pokeBalls=0;if(mode==='full')while(g.save.party.length<6)g.save.party.push({...g.save.party[0]});if(mode==='full')g.save.box=Array.from({length:60},()=>({...g.battle!.enemy}));if(mode==='gym')g.battle=createBattle(g.save,'gym');const before=structuredClone(g.save);g.actBattle('ball');assert.equal(g.captureMotion,null);assert.equal(g.battleFrames,null);assert.deepEqual(g.save,before);}
}));
