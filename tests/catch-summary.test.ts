import test from 'node:test';
import assert from 'node:assert/strict';
import {Engine} from '../src/engine';
import {Renderer} from '../src/renderer';
import {createBattle} from '../src/battle';
import {newSave,parseSave} from '../src/save';
import {grantPokemon} from '../src/pokemon';

function dom(run:()=>void){const old=Object.getOwnPropertyDescriptor(globalThis,'document');Object.defineProperty(globalThis,'document',{configurable:true,value:{getElementById:()=>null}});try{run()}finally{if(old)Object.defineProperty(globalThis,'document',old);else Reflect.deleteProperty(globalThis,'document')}}
function game(){const g=new Engine();g.save=newSave();grantPokemon(g.save,7);g.save.flags.departureCleared=true;g.save.map='route_s01';g.save.player={x:17,y:6,facing:'right'};g.save.inventory={pokeBalls:3,potions:2};g.battle=createBattle(g.save);g.battle!.enemy.hp=6;return g}
function choices(g:Engine){for(let i=0;i<20;i++){const d=g.dialogue!;if(d.page===d.pages.length-1&&d.shown>=d.pages[d.page].length)return;g.confirm()}assert.fail('no choice')}
function finish(g:Engine){for(let i=0;g.dialogue&&i<70;i++)g.confirm();assert.equal(g.dialogue,null)}

test('catch result appears only at the success page and default continue never duplicates the catch',()=>dom(()=>{
  const g=game(),hp=g.save.party[0].hp;g.actBattle('ball');assert.equal(g.showingCatch,false);assert.equal(g.caughtPreview,1);assert.equal(g.dialogue!.selected,1);assert.equal(g.save.party.length,2);assert.equal(g.save.inventory.pokeBalls,2);const saved=structuredClone(g.save);
  g.actBattle('ball');choices(g);assert(g.showingCatch);assert.equal(g.save.party[1].hp,6);assert.equal(g.save.party[1].met,'새잎 서쪽길');finish(g);assert.equal(g.caughtPreview,null);assert.equal(g.battle,null);assert.equal(g.panel,'field');assert.equal(g.save.party[0].hp,hp);assert.deepEqual(g.save,saved);assert(g.save.party.every(p=>p.experience===0));
}));

test('information opens the newly caught sixth Pokemon among duplicates and connects to healing and lead selection',()=>dom(()=>{
  const g=game();while(g.save.party.length<5)g.save.party.push({...g.battle!.enemy,hp:18});g.actBattle('ball');choices(g);const caught=g.save.party[5];g.navigate('up');g.confirm();assert.equal(g.panel,'summary');assert.equal(g.partyIndex,5);assert.equal(g.battle,null);assert.equal(g.caughtPreview,null);
  g.manageParty(1);finish(g);assert.equal(caught.hp,18);assert.equal(g.save.inventory.potions,1);assert.equal(g.partyIndex,5);g.manageParty(0);finish(g);assert.equal(g.save.party[0],caught);assert.equal(g.partyIndex,0);assert.equal(createBattle(g.save)!.active,0);assert.equal(g.save.party.length,6);assert.equal(g.save.inventory.pokeBalls,2);
}));

test('X and touch continuation close the result without changing party order or spending resources',()=>dom(()=>{
  for(const touch of [false,true]){const g=game();g.actBattle('ball');const before=structuredClone(g.save);choices(g);g.navigate('up');if(touch){const ctx=new Proxy({}, {get:()=>()=>{}}) as CanvasRenderingContext2D,canvas={getContext:()=>ctx} as HTMLCanvasElement,r=new Renderer(g,canvas,canvas);r.lower();r.click(128,164)}else g.cancel();assert.equal(g.dialogue,null);assert.equal(g.battle,null);assert.equal(g.caughtPreview,null);assert.equal(g.panel,'field');assert.deepEqual(g.save,before);}
}));

test('failed capture, full party and trainer Pokemon do not show the success screen',()=>dom(()=>{
  for(const kind of ['failed','full','gym']){const g=game();if(kind==='failed'){g.battle!.enemy.hp=18;g.random=()=>.99;}if(kind==='full')while(g.save.party.length<6)g.save.party.push({...g.battle!.enemy});if(kind==='gym')g.battle=createBattle(g.save,'gym');g.actBattle('ball');assert.equal(g.caughtPreview,null);assert.equal(g.showingCatch,false);assert.equal(g.dialogue!.choices,undefined);assert(!g.battle!.result);}
}));

test('result rendering shows the caught stats without covering them with top-screen choices',()=>dom(()=>{
  const g=game();g.actBattle('ball');choices(g);const upper:string[]=[],lower:string[]=[];const context=(out:string[])=>new Proxy({}, {get:(_,key)=>key==='fillText'?(text:string)=>out.push(text):()=>{}}) as CanvasRenderingContext2D;
  const r=new Renderer(g,{getContext:()=>context(upper)} as HTMLCanvasElement,{getContext:()=>context(lower)} as HTMLCanvasElement);r.world();r.lower();assert(upper.includes('비버니'));assert(upper.includes('Lv.3'));assert(upper.includes('HP 6 / 18'));assert(!upper.includes('정보 보기'));assert(lower.includes('만난 장소: 새잎 서쪽길'));assert(lower.includes('정보 보기'));r.click(128,136);assert.equal(g.panel,'summary');assert.equal(g.partyIndex,1);
}));

test('reload during catch preserves the new Pokemon once and clears the pending result action',()=>dom(()=>{
  const g=game();g.actBattle('ball');choices(g);const oldAction=g.dialogue!.choices![0].action,saved=parseSave(JSON.stringify(g.save))!;assert(saved);assert(!('caughtPreview'in saved));g.restore(saved);assert.equal(g.battle,null);assert.equal(g.caughtPreview,null);assert.equal(g.showingCatch,false);assert.equal(g.dialogue,null);assert.equal(g.save.party.length,2);assert.equal(g.save.inventory.pokeBalls,2);oldAction();assert.equal(g.panel,'field');assert.equal(g.save.party.length,2);
}));
