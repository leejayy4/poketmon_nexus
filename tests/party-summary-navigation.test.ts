import test from 'node:test';
import assert from 'node:assert/strict';
import { Engine } from '../src/engine';
import { Renderer } from '../src/renderer';
import { newSave,parseSave } from '../src/save';
import { grantPokemon,pokemonMoves } from '../src/pokemon';
import { createBattle } from '../src/battle';

function dom(run:()=>void){const old=Object.getOwnPropertyDescriptor(globalThis,'document');Object.defineProperty(globalThis,'document',{configurable:true,value:{getElementById:()=>null}});try{run()}finally{if(old)Object.defineProperty(globalThis,'document',old);else Reflect.deleteProperty(globalThis,'document')}}
function game(count=6){const g=new Engine();g.save=newSave();if(count)grantPokemon(g.save,7);g.save.flags.departureCleared=true;g.save.inventory.potions=2;for(let i=1;i<count;i++)g.save.party.push({species:399,level:3,hp:i===2?0:i===1?2:18,maxHp:18,experience:i,nature:'성실',met:'새잎 서쪽길'});g.panel='summary';return g;}
function finish(g:Engine){for(let i=0;g.dialogue&&i<40;i++)g.confirm();assert.equal(g.dialogue,null);}
function renderer(g:Engine){const words:string[]=[],ctx=new Proxy({},{get:(_,key)=>key==='fillText'?(text:string)=>words.push(text):()=>{}}) as CanvasRenderingContext2D,canvas={getContext:()=>ctx} as HTMLCanvasElement;return {words,ctx,r:new Renderer(g,canvas,canvas)};}

test('up/down compare every party member in order including fainted members, while left/right choose actions',()=>{
  for(const count of [1,2,3,4,5,6]){const g=game(count),before=structuredClone(g.save);g.press('ArrowRight');g.release('ArrowRight');assert.equal(g.summaryActionIndex,1);
    for(let i=1;i<=count;i++){g.press('ArrowDown');g.release('ArrowDown');assert.equal(g.partyIndex,i%count);assert.equal(g.summaryActionIndex,1);}
    g.press('ArrowUp');g.release('ArrowUp');assert.equal(g.partyIndex,count-1);g.press('ArrowLeft');g.release('ArrowLeft');assert.equal(g.summaryActionIndex,0);assert.deepEqual(g.save,before);
  }
});

test('touch previous/next changes both information and moves without changing progress',()=>{
  const g=game(3),before=structuredClone(g.save),{r,words,ctx}=renderer(g);r.lower();assert(words.includes('↑ 이전'));assert(words.includes('↓ 다음'));
  r.click(110,175);assert.equal(g.partyIndex,1);words.length=0;r.summaryTop(ctx);r.lower();assert(words.includes('비버니'));assert(pokemonMoves(g.save.party[1]).every(move=>words.includes(move)));assert(words.includes('2 / 3'));assert(words.includes('HP  2 / 18'));
  r.click(35,175);assert.equal(g.partyIndex,0);r.lower();r.click(35,175);assert.equal(g.partyIndex,2);assert.deepEqual(g.save,before);
});

test('browsing keeps the action selection and medicine applies only to the inspected member',()=>dom(()=>{
  const g=game(3);g.press('ArrowRight');g.press('ArrowDown');assert.equal(g.partyIndex,1);g.confirm();assert.equal(g.save.party[1].hp,18);assert.equal(g.save.inventory.potions,1);
  g.browseParty(1);assert.equal(g.partyIndex,1);finish(g);g.press('ArrowDown');assert.equal(g.partyIndex,2);g.confirm();assert.equal(g.save.party[2].hp,0);assert.equal(g.save.inventory.potions,1);
  finish(g);g.cancel();assert.equal(g.panel,'party');assert.equal(g.partyIndex,2);
}));

test('lead changes retain the inspected Pokemon and survive save restore after browsing',()=>dom(()=>{
  const g=game(3),chosen=g.save.party[1];g.press('ArrowDown');g.confirm();assert.equal(g.save.party[0],chosen);assert.equal(g.partyIndex,0);finish(g);
  g.press('ArrowDown');assert.equal(g.save.party[g.partyIndex].species,7);g.cancel();assert.equal(g.partyIndex,1);
  const saved=parseSave(JSON.stringify(g.save));assert(saved);g.restore(saved);assert.deepEqual(g.save.party,saved.party);assert.equal(g.panel,'field');assert.equal(g.partyIndex,0);
}));

test('stale browsing callbacks cannot run through dialogue, battle, movement, transitions or another panel',()=>dom(()=>{
  for(const mode of ['dialogue','battle','move','transition','party']){const g=game(3),before=structuredClone(g.save);if(mode==='dialogue')g.say('안내',['대화']);if(mode==='battle')g.battle=createBattle({...structuredClone(g.save),map:'route_s01'},'wild','roark',()=>0);if(mode==='move')g.move={from:{x:6,y:6},to:{x:7,y:6},elapsed:0,duration:.16};if(mode==='transition')g.transition=.4;if(mode==='party')g.panel='party';g.browseParty(1);assert.equal(g.partyIndex,0);assert.deepEqual(g.save,before);}
  const g=game(3);for(const invalid of [0,2,-2,NaN,Infinity])g.browseParty(invalid);assert.equal(g.partyIndex,0);
}));

test('empty and single-member summaries do not expose unusable browsing buttons',()=>{
  for(const count of [0,1]){const g=game(count),{r,words}=renderer(g);r.lower();g.browseParty(1);g.browseParty(-1);assert.equal(g.partyIndex,0);assert(!words.includes('↑ 이전'));assert(!words.includes('↓ 다음'));}
});
