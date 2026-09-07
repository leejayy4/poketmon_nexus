import test from 'node:test';
import assert from 'node:assert/strict';
import { battleTurn,createBattle,type BattleAction } from '../src/battle';
import { battleHint } from '../src/battle-hints';
import { newSave,parseSave } from '../src/save';
import { grantPokemon } from '../src/pokemon';
import { Engine } from '../src/engine';

function ready(){const s=newSave();grantPokemon(s,7);s.flags.departureCleared=true;s.inventory={pokeBalls:5,potions:2};return s;}
function dom(run:()=>void){const old=Object.getOwnPropertyDescriptor(globalThis,'document');Object.defineProperty(globalThis,'document',{configurable:true,value:{getElementById:()=>null}});try{run()}finally{if(old)Object.defineProperty(globalThis,'document',old);else Reflect.deleteProperty(globalThis,'document')}}

test('counterattack declares the move before changing displayed HP for every action that spends a turn',()=>{
  for(const action of ['move0','move1','ball','potion',{switch:1},{potion:1}] as BattleAction[]){
    const s=ready();s.party[0].hp=12;s.party.push({species:399,level:3,hp:10,maxHp:18,experience:0,nature:'성실',met:'새잎 서쪽길'});
    const b=createBattle(s)!,t=battleTurn(s,b,action,()=>1),attack=t.pages.findIndex(p=>p.startsWith('야생 비버니의'));
    assert(attack>=0);assert(!t.pages[attack].includes('피해'));
    const before=t.frames![attack],after=t.frames![attack+1];
    assert.equal(before.effect,undefined);assert.equal(before.player.hp-after.player.hp,4);
    assert.deepEqual(after.effect,{target:'player',kind:'damage',amount:4});
    assert.equal(after.active,before.active);assert.equal(after.player.hp,s.party[b.active].hp);
    assert.equal(t.frames!.length,t.pages.length);
  }
});

test('lethal counter keeps the outgoing Pokemon alive through the attack declaration, then shows exact loss before fainting',()=>{
  const s=ready();s.party[0].hp=2;s.party.push({...s.party[0],species:399,hp:18,maxHp:18,level:3});
  const b=createBattle(s,'gym')!,t=battleTurn(s,b,'move1'),attack=t.pages.findIndex(p=>p.startsWith('강석의 꼬마돌의'));
  assert.equal(t.frames![attack].player.hp,2);assert.equal(t.frames![attack].player.species,7);
  assert.equal(t.frames![attack+1].player.hp,0);assert.equal(t.frames![attack+1].effect?.amount,2);
  assert(t.pages[attack+1].includes('2의 피해'));assert(t.pages[attack+2].includes('쓰러졌다'));
  assert.equal(t.frames!.at(-1)!.player.species,399);assert.equal(b.active,1);
});

test('finishing blow reports actual HP loss in hint, dialogue and effect while preserving victory XP',()=>{
  const s=ready(),b=createBattle(s)!;b.enemy.hp=1;b.menu='moves';
  assert.equal(battleHint(s,b)[0],'상대에게 1 피해');
  const t=battleTurn(s,b,'move0');assert.equal(t.outcome,'won');
  assert(t.pages[1].includes('1의 피해'));assert.equal(t.frames![1].effect?.amount,1);
  assert.equal(s.party[0].hp,20);assert.equal(s.party[0].experience,30);
});

test('low-HP counter previews report at most the HP the selected Pokemon can lose',()=>{
  const s=ready(),b=createBattle(s)!;s.party[0].hp=1;
  b.menu='bag';assert(battleHint(s,b)[1].endsWith('HP -1'));
  b.menu='moves';b.selected=1;b.enemyDefenseDrop=3;assert(battleHint(s,b)[1].endsWith('HP -1'));
  b.enemyDefenseDrop=0;b.enemy.hp=1;assert.equal(battleHint(s,b)[1],'다음 공격 피해 1');
  const pikachu=ready();pikachu.party[0].species=25;pikachu.party[0].hp=1;const p=createBattle(pikachu)!;p.menu='moves';p.selected=1;
  assert.equal(battleHint(pikachu,p)[1],'이번 반격 피해 1');
});

test('counter playback and reload never apply damage or item use for a second time',()=>dom(()=>{
  const g=new Engine();g.save=ready();g.save.party[0].hp=3;g.battle=createBattle(g.save);g.actBattle('potion');
  const committed=structuredClone(g.save),attack=g.dialogue!.pages.findIndex(p=>p.startsWith('야생 비버니의'));
  assert.equal(committed.party[0].hp,16);assert.equal(committed.inventory.potions,1);
  g.dialogue!.page=attack;assert.equal(g.battleFrame!.player.hp,20);
  for(let i=0;g.dialogue&&i<30;i++)g.confirm();assert.deepEqual(g.save,committed);
  g.restore(parseSave(JSON.stringify(committed))!);assert.equal(g.battle,null);assert.equal(g.battleFrame,null);assert.deepEqual(g.save.party,committed.party);
}));
