import test from 'node:test';
import assert from 'node:assert/strict';
import { Engine } from '../src/engine';
import { Renderer } from '../src/renderer';
import {battleTurn,enemyDamage } from '../src/battle';
import {createBattle} from './runtime-battle-fixture';
import { battleHint } from '../src/battle-hints';
import { newSave,parseSave } from '../src/save';
import { grantPokemon } from '../src/pokemon';
import { maxHpAtLevel } from '../src/growth';

function ready(){const s=newSave();grantPokemon(s,7);Object.assign(s.party[0],{level:8,hp:29,maxHp:29});s.party.push({species:399,level:8,hp:33,maxHp:33,experience:0,nature:'성실',met:'새잎 서쪽길'});s.flags.departureCleared=true;s.map='oreburgh_gym';s.player={x:8,y:5,facing:'up'};return s}
function dom(run:()=>void){const old=Object.getOwnPropertyDescriptor(globalThis,'document');Object.defineProperty(globalThis,'document',{configurable:true,value:{getElementById:()=>null}});try{run()}finally{if(old)Object.defineProperty(globalThis,'document',old);else Reflect.deleteProperty(globalThis,'document')}}
function finish(g:Engine){for(let i=0;g.dialogue&&i<90;i++)g.confirm();assert(!g.dialogue)}
function game(){const g=new Engine();g.save=ready();g.battle=createBattle(g.save,'gym');g.battle!.enemy.hp=1;return g}

test('a gym knockout offers exactly one free healthy replacement and resets next-opponent participation',()=>{
  const s=ready(),b=createBattle(s,'gym')!;b.enemy.hp=1;b.enemyAttackDrop=2;b.enemyDefenseDrop=2;battleTurn(s,b,'move0');assert(b.betweenOpponents);assert.equal(b.enemy.species,95);assert.equal(b.enemyAttackDrop,0);assert.equal(b.enemyDefenseDrop,0);const earned=s.party[0].experience,before=structuredClone(s);assert.equal(earned,50);
  const result=battleTurn(s,b,{switch:1});assert(!b.betweenOpponents);assert.equal(b.active,1);assert.deepEqual(b.participants,[1]);assert.deepEqual(s,before);assert(!result.pages.some(p=>p.includes('피해')));
  b.enemy.hp=1;battleTurn(s,b,'move0');assert.equal(s.party[0].experience,earned);assert.equal(s.party[1].experience,50);assert(parseSave(JSON.stringify(s)));
  battleTurn(s,b,'move1');assert(!b.betweenOpponents);const hp=s.party[0].hp,reply=enemyDamage({...b,active:0},b.enemyAttackDrop,s.party[0]);battleTurn(s,b,{switch:0});assert.equal(s.party[0].hp,Math.max(0,hp-reply-(b.playerRocks?Math.max(1,Math.floor(s.party[0].maxHp/8)):0)),'switching after Growl during combat still costs a counterattack');
});

test('invalid free replacements preserve the opportunity, items, HP and experience',()=>{
  const s=ready();s.party.push({...s.party[1],hp:0});const b=createBattle(s,'gym')!;b.enemy.hp=1;battleTurn(s,b,'move0');
  for(const i of [-1,0,2,6,1.5]){const before=structuredClone({s,b});assert(battleTurn(s,b,{switch:i}).retry);assert.deepEqual({s,b},before);}
  b.menu='party';b.selected=1;assert(battleHint(s,b)[1].includes('반격 없이'));b.selected=2;assert(battleHint(s,b)[0].includes('쓰러진'));b.selected=0;assert(battleHint(s,b)[0].includes('이미'));
});

test('single healthy Pokemon, wild victories and the last opponent do not offer an unnecessary switch',()=>{
  for(const variant of ['alone','fainted','wild','last']){const s=ready();if(variant==='alone')s.party.pop();if(variant==='fainted')s.party[1].hp=0;const b=createBattle(s,variant==='wild'?'wild':'gym')!;if(variant==='last'){b.enemyIndex=2;b.enemy=b.opponents[2];}b.enemy.hp=1;battleTurn(s,b,'move0');assert(!b.betweenOpponents,variant);}
});

test('Engine waits for the announcement, supports cancel and continue, and does not replay a free switch',()=>dom(()=>{
  const g=game();g.actBattle('move0');const b=g.battle!;assert.equal(b.menu,'between');const before=structuredClone(g.save);g.selectBattle();assert.deepEqual(g.save,before);assert(b.betweenOpponents);finish(g);g.navigate('right');g.selectBattle();assert.equal(b.menu,'party');assert.equal(b.selected,1);g.cancel();assert.equal(b.menu,'between');assert.equal(b.selected,1);assert.deepEqual(g.save,before);g.cancel();assert.equal(b.menu,'actions');assert(!b.betweenOpponents);assert.deepEqual(g.save,before);
  g.actBattle({switch:1});assert.equal(g.save.party[1].hp,before.party[1].hp);finish(g);
  const other=game();other.actBattle('move0');finish(other);other.selectBattle();assert.equal(other.battle?.menu,'actions');assert(!other.battle?.betweenOpponents);assert.equal(other.save.party[1].hp,33);
}));

test('touch selection switches without damage and remembering moves survives between opponents',()=>dom(()=>{
  const g=game(),b=g.battle!;b.moveSelections[1]=1;g.actBattle('move0');finish(g);const context=new Proxy({}, {get:()=>()=>{}}) as CanvasRenderingContext2D,canvas={getContext:()=>context} as HTMLCanvasElement,r=new Renderer(g,canvas,canvas);r.lower();r.click(190,130);assert.equal(b.menu,'party');r.lower();r.click(180,49);assert.equal(b.active,1);assert.equal(g.save.party[1].hp,33);assert.deepEqual(b.participants,[1]);finish(g);g.selectBattle();assert.equal(b.menu,'moves');assert.equal(b.selected,1);
}));

test('reload during the choice preserves earned XP and grants neither a badge nor a pending free action',()=>dom(()=>{
  const g=game();g.actBattle('move0');finish(g);const saved=parseSave(JSON.stringify(g.save))!;assert(saved);assert.equal(saved.party[0].experience,50);assert.deepEqual(saved.badges,[]);g.restore(saved);assert.equal(g.battle,null);g.battle=createBattle(g.save,'gym');assert(!g.battle!.betweenOpponents);assert.equal(g.battle!.enemyIndex,0);assert.equal(g.save.party[0].maxHp,maxHpAtLevel(7,8));
}));
