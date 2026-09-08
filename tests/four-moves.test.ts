import test from 'node:test';
import assert from 'node:assert/strict';
import { Engine } from '../src/engine';
import { newSave,parseSave } from '../src/save';
import { encodeSave,decodeSave } from '../src/save-library';
import { grantPokemon,pokemonMoves,teachMove,validPokemonMoves } from '../src/pokemon';
import { maxHpAtLevel,gainExperience } from '../src/growth';
import { createBattle,battleTurn,type BattleAction } from '../src/battle';
import { battleHint } from '../src/battle-hints';
import { showMoveSchool } from '../src/move-school';
import type { Choice } from '../src/types';

const four=['할퀴기','울음소리','불꽃세례','용의분노'];
function ready(){const s=newSave();grantPokemon(s,4);const p=s.party[0];p.level=16;p.hp=p.maxHp=maxHpAtLevel(4,16);s.flags.departureCleared=true;s.map='route_s01';s.player={x:29,y:12,facing:'left'};return s;}
function dom(run:()=>void){const previous=Object.getOwnPropertyDescriptor(globalThis,'document');Object.defineProperty(globalThis,'document',{value:{getElementById:()=>null},configurable:true});try{run();}finally{if(previous)Object.defineProperty(globalThis,'document',previous);else Reflect.deleteProperty(globalThis,'document');}}
function school(){
  const save=ready();let dialogue:{pages:string[];choices:Choice[]}={pages:[],choices:[]},writes=0;
  const g={save,partyIndex:0,battle:null,say(_name:string,pages:string[],_after?:()=>void,choices:Choice[]=[]){dialogue={pages,choices};},persist(){writes++;},audio:{play(){}}} as unknown as Engine;
  const choose=(label:string)=>{const c=dialogue.choices.find(c=>c.label===label);assert(c,label);c.action();};
  return {g,choose,get dialogue(){return dialogue;},get writes(){return writes;}};
}

test('one through four learned slots round-trip while legacy defaults and slot order remain unchanged',()=>{
  for(let length=1;length<=4;length++){const s=ready();s.party[0].moves=four.slice(0,length);assert.deepEqual(decodeSave(encodeSave(s))?.save.party[0].moves,four.slice(0,length));}
  const s=ready();assert.deepEqual(pokemonMoves(s.party[0]),four.slice(0,2));assert.deepEqual(parseSave(JSON.stringify(s))?.party[0].moves,four.slice(0,2));
  delete s.party[0].moves;assert(parseSave(JSON.stringify(s)));assert.equal(pokemonMoves(s.party[0]).length,2);
  for(const moves of [[],[...four,'발버둥'],['할퀴기','울음소리','할퀴기'],['없는기술']]){s.party[0].moves=moves;assert.equal(parseSave(JSON.stringify(s)),null);}
});

test('learning appends or replaces a valid slot and rejects duplicate, skipped and out-of-range slots',()=>{
  const s=ready(),p=s.party[0];
  for(const slot of [-1,1.5,3,4]){assert(!teachMove(s,0,'불꽃세례',slot));assert.deepEqual(p.moves,four.slice(0,2));}
  assert(teachMove(s,0,'불꽃세례',2));assert(teachMove(s,0,'용의분노',3));assert.deepEqual(p.moves,four);
  assert(!teachMove(s,0,'할퀴기',3));assert(!teachMove(s,0,'발버둥',4));
  p.moves=['할퀴기','할퀴기'];assert(validPokemonMoves(p,[]));assert(teachMove(s,0,'불꽃세례',2));assert(validPokemonMoves(p,[]));
});

test('blank-slot learning requires confirmation, saves once, and stale confirmations cannot append',()=>{
  const f=school();showMoveSchool(f.g);f.choose('불꽃세례');assert.deepEqual(pokemonMoves(f.g.save.party[0]),four.slice(0,2));
  const confirm=f.dialogue.choices[0].action;confirm();confirm();assert.equal(f.writes,1);assert.deepEqual(f.g.save.party[0].moves,four.slice(0,3));
  for(const mutate of [
    (g:Engine)=>{g.save=structuredClone(g.save);},
    (g:Engine)=>{g.save.party[0]={...g.save.party[0]};},
    (g:Engine)=>{g.save.party[0].moves!.push('용의분노');},
    (g:Engine)=>{g.battle={} as NonNullable<Engine['battle']>;},
    (g:Engine)=>{showMoveSchool(g);},
  ]){const stale=school();showMoveSchool(stale.g);stale.choose('불꽃세례');const callback=stale.dialogue.choices[0].action;mutate(stale.g);const before=structuredClone(stale.g.save);callback();assert.deepEqual(stale.g.save,before);assert.equal(stale.writes,0);}
});

test('third and fourth move actions resolve their actual techniques and missing slots do not spend a turn',()=>{
  for(const slot of [2,3]){const s=ready();s.party[0].moves=[...four];const b=createBattle(s,'gym')!;b.menu='moves';b.selected=slot;const hint=battleHint(s,b);const turn=battleTurn(s,b,`move${slot}` as BattleAction);assert.equal(turn.frames![0].technique?.move,four[slot]);assert.equal(b.moveSelections[0],slot);assert.match(hint[0],/상대에게/);}
  const s=ready(),b=createBattle(s,'gym')!,before=structuredClone({s,b});assert(battleTurn(s,b,'move3').retry);assert.deepEqual({s,b},before);b.menu='moves';b.selected=3;assert.equal(battleHint(s,b)[0],'기억하고 있는 기술을 선택하세요');
});

test('a full moveset compares and replaces the fourth slot without creating a fifth',()=>{
  const f=school();f.g.save.party[0].moves=['할퀴기','울음소리','용의분노','발버둥'];showMoveSchool(f.g);f.choose('불꽃세례');
  assert.equal(f.dialogue.choices.length,5);assert(!f.dialogue.choices.some(c=>c.label==='빈 자리에 배운다'));
  f.choose('발버둥와 비교');const before=structuredClone(f.g.save);assert.deepEqual(f.g.save,before);f.choose('바꿔서 배운다');
  assert.deepEqual(f.g.save.party[0].moves,['할퀴기','울음소리','용의분노','불꽃세례']);assert.equal(f.writes,1);assert(parseSave(JSON.stringify(f.g.save)));
});

test('battle cursor uses actual move count, remembers slot four, and cancel preserves it',()=>dom(()=>{
  const g=new Engine();g.save=ready();g.save.party[0].moves=[...four];g.battle=createBattle(g.save,'gym')!;const b=g.battle;
  g.selectBattle();g.navigate('down');assert.equal(b.selected,2);g.navigate('right');assert.equal(b.selected,3);
  g.selectBattle();assert.equal(b.moveSelections[0],3);assert.equal(g.battleFrames![0].technique?.move,'용의분노');g.dialogue=null;g.battleFrames=null;
  b.menu='actions';b.selected=0;g.selectBattle();assert.equal(b.selected,3);g.cancel();g.selectBattle();assert.equal(b.selected,3);
  g.save.party[0].moves=four.slice(0,3);b.selected=2;g.navigate('right');assert.equal(b.selected,2);g.navigate('up');assert.equal(b.selected,0);
  g.save.party[0].moves=four.slice(0,1);b.selected=0;g.navigate('down');assert.equal(b.selected,0);g.navigate('right');assert.equal(b.selected,0);
}));

test('four selected moves survive starter evolution without reordering',()=>{
  const s=ready(),p=s.party[0],selected=[...four.slice(0,3),'발버둥'];p.level=15;p.hp=p.maxHp=maxHpAtLevel(4,15);p.experience=149;p.moves=[...selected];gainExperience(p,1);assert.equal(p.species,5);assert.deepEqual(p.moves,selected);assert.deepEqual(parseSave(JSON.stringify(s))?.party[0].moves,selected);
});
