import test from 'node:test';
import assert from 'node:assert/strict';
import { enemyDamage,battleTurn} from '../src/battle';
import {createBattle} from './runtime-battle-fixture';
import { Engine } from '../src/engine';
import { Renderer } from '../src/renderer';
import { newSave,parseSave } from '../src/save';
import { grantPokemon } from '../src/pokemon';

function ready(){const s=newSave();grantPokemon(s,7);s.flags.departureCleared=true;s.inventory.potions=2;s.party.push({species:399,level:8,hp:33,maxHp:33,experience:0,nature:'성실',met:'새잎 서쪽길'});return s}
function dom(run:()=>void){const old=Object.getOwnPropertyDescriptor(globalThis,'document');Object.defineProperty(globalThis,'document',{configurable:true,value:{getElementById:()=>null}});try{run()}finally{if(old)Object.defineProperty(globalThis,'document',old);else Reflect.deleteProperty(globalThis,'document')}}
function finish(g:Engine){for(let i=0;g.dialogue&&i<90;i++)g.confirm();assert(!g.dialogue)}

test('battle arena uses layered platform colors without changing battle state',()=>{const g=new Engine(),ctx={getContext:()=>({})} as unknown as HTMLCanvasElement,r=new Renderer(g,ctx,ctx),fills:string[]=[];const c={fillStyle:'',fillRect:()=>fills.push(c.fillStyle),beginPath:()=>{},ellipse:()=>{},fill:()=>fills.push(c.fillStyle)} as unknown as CanvasRenderingContext2D;r.battleArena(c);assert(fills.includes('#76996e'));assert(fills.includes('#9fbd7e'));assert(fills.includes('#dbe5b6'));assert.equal(g.battle,null);});

test('attack, damage, knockout and next opponent retain distinct detached display states',()=>{
  const s=ready(),b=createBattle(s,'gym')!;b.enemy.hp=1;const t=battleTurn(s,b,'move0'),f=t.frames!;assert.equal(f.length,t.pages.length);
  assert.equal(f[0].enemy.species,74);assert.equal(f[0].enemy.hp,1);assert.equal(f[1].enemy.hp,0);assert.equal(f[2].enemy.species,74);
  for(const frame of f.slice(0,-1))assert.equal(frame.enemyIndex,0);
  assert.equal(f.at(-1)!.enemy.species,95);assert.equal(f.at(-1)!.enemyIndex,1);assert.equal(b.enemy.species,95);
  const before=structuredClone(f);s.party[0].hp=1;b.enemy.hp=1;assert.deepEqual(f,before,'display records do not change with the next turn');
});

test('normal and free switches show outgoing then incoming Pokemon and only the normal switch takes a counter',()=>{
  for(const free of [false,true]){const s=ready(),b=createBattle(s,'gym')!;b.betweenOpponents=free;b.turn=1;const reply=enemyDamage({...b,active:1},b.enemyAttackDrop,s.party[1]);const t=battleTurn(s,b,{switch:1}),f=t.frames!;assert.equal(f.length,t.pages.length);assert.equal(f[0].player.species,7);assert.equal(f[1].player.species,399);assert.equal(f[1].player.hp,33);assert.equal(f.at(-1)!.player.hp,free?33:33-reply);assert.equal(s.party[1].hp,free?33:33-reply);}
});

test('healing and debuffs appear before the counterattack in their respective dialogue pages',()=>{
  const s=ready(),b=createBattle(s)!;s.party[0].hp=3;const t=battleTurn(s,b,'potion');assert.equal(t.frames![0].player.hp,20);assert.equal(t.frames![1].player.hp,20);assert.equal(t.frames![2].player.hp,16);assert.equal(s.inventory.potions,1);
  const d=battleTurn(s,b,'move1');assert.equal(d.frames![0].enemyDefenseDrop,0);assert.equal(d.frames![1].enemyDefenseDrop,1);assert.equal(d.frames!.at(-1)!.player.hp,12);
});

test('fainting keeps the defeated Pokemon visible in status until automatic or chosen replacement',()=>{
  for(const forced of [false,true]){const s=ready();s.party[0].hp=1;if(forced)s.party.push({...s.party[1],species:1});const b=createBattle(s)!;const t=battleTurn(s,b,'move1'),f=t.frames!,faint=t.pages.findIndex(p=>p.includes('는 쓰러졌다'));assert.equal(f[faint].player.species,7);assert.equal(f[faint].player.hp,0);assert.equal(f.at(-1)!.player.species,forced?7:399);assert.equal(b.forcedSwitch,forced);}
});

test('advancing display dialogue never reapplies committed damage, items or XP and restore drops playback',()=>dom(()=>{
  const g=new Engine();g.save=ready();g.battle=createBattle(g.save,'gym');g.battle!.enemy.hp=1;g.actBattle('move0');const before=structuredClone(g.save);assert.equal(g.battleFrame!.enemy.species,74);assert.equal(g.battle!.enemy.species,95);const snapshot=g.snapshot();snapshot.battleFrame!.enemy.hp=999;assert.equal(g.battleFrame!.enemy.hp,1);
  g.actBattle('move0');assert.deepEqual(g.save,before);finish(g);assert.equal(g.battleFrame,null);assert.equal(g.battleFrames,null);assert.deepEqual(g.save,before);
  g.actBattle('potion');const saved=parseSave(JSON.stringify(g.save))!;assert(saved);assert(!('battleFrames'in saved));g.restore(saved);assert.equal(g.battleFrame,null);assert.equal(g.battleFrames,null);assert.equal(g.battle,null);assert.deepEqual(g.save.party,saved.party);
}));

test('renderer hides future opponent and choices during playback and uses current data afterwards',()=>dom(()=>{
  const g=new Engine();g.save=ready();g.battle=createBattle(g.save,'gym');g.battle!.enemy.hp=1;g.actBattle('move0');const words:string[]=[],drawn:unknown[]=[];
  const context=new Proxy({}, {get:(_,key)=>key==='fillText'?(s:string)=>words.push(s):key==='drawImage'?(im:unknown)=>drawn.push(im):()=>{}}) as CanvasRenderingContext2D,canvas={getContext:()=>context} as HTMLCanvasElement,r=new Renderer(g,canvas,canvas);
  for(const id of [74,95])r.images['pokemon-'+id]={id} as unknown as HTMLImageElement;
  r.battleTop(context);r.lower();assert(words.includes('꼬마돌'));assert(!words.includes('롱스톤'));assert(!words.includes('교대한다'));assert(drawn.includes(r.images['pokemon-74']));assert(!drawn.includes(r.images['pokemon-95']));
  g.confirm();g.confirm();words.length=0;drawn.length=0;r.battleTop(context);assert(!drawn.includes(r.images['pokemon-74']),'knocked out enemy sprite disappears');
  finish(g);words.length=0;r.battleTop(context);r.lower();assert(words.includes('롱스톤'));assert(words.includes('교대한다'));
}));

test('rejected actions, a replaced dialogue and final battle completion leave no stale frame',()=>dom(()=>{
  const g=new Engine();g.save=ready();g.battle=createBattle(g.save);g.actBattle('potion');assert.equal(g.battleFrames,null);finish(g);g.actBattle('move1');assert(g.battleFrame);g.say('리포트',['기록']);assert.equal(g.battleFrame,null);finish(g);
  g.battle!.enemy.hp=1;g.actBattle('move0');assert(g.battleFrame);finish(g);assert.equal(g.battle,null);assert.equal(g.battleFrame,null);assert.equal(g.battleFrames,null);
}));
