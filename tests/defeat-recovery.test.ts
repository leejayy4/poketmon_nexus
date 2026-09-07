import test from 'node:test';
import assert from 'node:assert/strict';
import { Engine } from '../src/engine';
import { Renderer } from '../src/renderer';
import {createBattle} from './runtime-battle-fixture';
import { newSave,parseSave } from '../src/save';
import { grantPokemon } from '../src/pokemon';

function dom(run:()=>void){const old=Object.getOwnPropertyDescriptor(globalThis,'document');Object.defineProperty(globalThis,'document',{configurable:true,value:{getElementById:()=>null}});try{run()}finally{if(old)Object.defineProperty(globalThis,'document',old);else Reflect.deleteProperty(globalThis,'document')}}
function game(home=false){const g=new Engine();g.save=newSave();grantPokemon(g.save,7);g.save.party[0].hp=1;g.save.party[0].experience=17;g.save.flags.departureCleared=true;g.save.map='oreburgh_gym';g.save.player={x:8,y:5,facing:'up'};g.save.healingPoint=home?'home':'tour_oreburgh_center';g.save.inventory={pokeBalls:3,potions:0};g.save.money=123;g.battle=createBattle(g.save,'gym');g.battle!.turn=1;return g}
function recover(g:Engine){for(let i=0;g.defeatScene&&i<50;i++)g.confirm();assert(g.recoveryPreview);assert(g.dialogue)}
function finish(g:Engine){for(let i=0;g.dialogue&&i<80;i++)g.confirm();assert.equal(g.dialogue,null)}

test('defeat commits one safe recovery save while showing the last attack and fainting on the battlefield',()=>dom(()=>{
  const g=game(),saved:string[]=[];g.persist=()=>{saved.push(JSON.stringify(g.save));return true};g.actBattle('move1');assert.equal(saved.length,1);assert(parseSave(saved[0]));assert.equal(g.save.map,'tour_oreburgh_center');assert.equal(g.save.party[0].hp,20);assert.equal(g.battle,null);assert(g.presentedBattle);assert.equal(g.battleFrame!.player.hp,1);assert.equal(g.recoveryPreview,false);
  while(g.dialogue!.page<3){g.confirm()}assert.equal(g.battleFrame!.player.hp,0);assert(g.defeatScene);const before=structuredClone(g.save);recover(g);assert.equal(g.presentedBattle,null);assert.equal(g.battleFrames,null);assert.match(g.dialogue!.pages[1],/2개/);finish(g);assert.equal(g.recoveryPreview,false);assert.equal(saved.length,1);assert.deepEqual(g.save,before);assert.equal(g.save.money,123);assert.equal(g.save.party[0].experience,17);assert.deepEqual(g.save.badges,[]);
}));

test('home and center guidance preserve inventory and recovery handles all six party members',()=>dom(()=>{
  for(const home of [true,false])for(const potions of [0,5]){
    const g=game(home);g.save.inventory.potions=potions;while(g.save.party.length<6)g.save.party.push({...g.save.party[0],species:399,level:3,maxHp:18,hp:0,experience:0,moves:undefined});
    g.actBattle('move1');recover(g);assert.equal(g.save.map,home?'home':'tour_oreburgh_center');assert.equal(g.dialogue!.speaker,home?'엄마':'간호사');assert(g.save.party.every(p=>p.hp===p.maxHp));assert.equal(g.save.inventory.potions,potions);assert.equal(g.save.inventory.pokeBalls,3);assert.equal(g.save.party.length,6);
    if(potions===0)assert.match(g.dialogue!.pages[1],home?/길 안내원/:/다시 말을/);else assert.match(g.dialogue!.pages[1],/다시 출발/);
  }
}));

test('reload during defeat or recovery clears display state and does not replay rewards or recovery',()=>dom(()=>{
  for(const phase of ['defeat','recovery']){const g=game();g.actBattle('move1');if(phase==='recovery')recover(g);const saved=parseSave(JSON.stringify(g.save))!;assert(saved);assert(!('defeatScene'in saved));assert(!('recoveryPreview'in saved));g.restore(saved);assert.equal(g.dialogue,null);assert.equal(g.defeatScene,null);assert.equal(g.recoveryPreview,false);assert.equal(g.battleFrame,null);assert.equal(g.battle,null);assert.deepEqual(g.save.party,saved.party);assert.equal(g.save.money,123);assert.equal(g.save.inventory.potions,0);}
}));

test('keyboard and touch cannot replay battle actions during defeat and recovery',()=>dom(()=>{
  const g=game();g.actBattle('move1');const before=structuredClone(g.save);g.actBattle('move0');g.press('ArrowRight');assert.equal(g.move,null);g.cancel();
  const context=new Proxy({}, {get:()=>()=>{}}) as CanvasRenderingContext2D,canvas={getContext:()=>context} as HTMLCanvasElement,r=new Renderer(g,canvas,canvas);
  for(let i=0;g.dialogue&&i<60;i++){r.lower();r.click(128,166)}assert.equal(g.dialogue,null);assert.equal(g.defeatScene,null);assert.equal(g.recoveryPreview,false);assert.deepEqual(g.save,before);g.press('ArrowDown');assert(g.move,'movement resumes after recovery dialogue');
}));

test('renderer keeps the defeated battle until return, then shows six recovered Pokemon and actual potion stock',()=>dom(()=>{
  const g=game();while(g.save.party.length<6)g.save.party.push({...g.save.party[0],hp:0});g.actBattle('move1');const words:string[]=[],context=new Proxy({}, {get:(_,key)=>key==='fillText'?(s:string)=>words.push(s):()=>{}}) as CanvasRenderingContext2D,canvas={getContext:()=>context} as HTMLCanvasElement,r=new Renderer(g,canvas,canvas);
  r.world();r.lower();assert(words.includes('꼬마돌'));assert(!words.includes('포켓몬 회복 완료'));recover(g);words.length=0;r.lower();assert(words.includes('포켓몬 회복 완료'));assert.equal(words.filter(w=>w==='HP 20/20').length,6);assert(words.includes('출전 6/6 · 상처약 0개'));
}));

test('replacing dialogue clears defeat visuals and normal nurse interaction still replenishes stock',()=>dom(()=>{
  const g=game();g.actBattle('move1');g.say('안내',['다른 대화']);assert.equal(g.defeatScene,null);assert.equal(g.battleFrames,null);finish(g);g.event('nurse');finish(g);assert.equal(g.save.inventory.potions,2);assert.equal(g.save.healingPoint,'tour_oreburgh_center');assert.equal(g.recoveryPreview,false);
  const wild=game(true);wild.battle=createBattle(wild.save);wild.actBattle('move1');assert.equal(wild.presentedBattle!.kind,'wild');recover(wild);finish(wild);assert.equal(wild.save.map,'home');
}));
