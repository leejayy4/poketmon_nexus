import test from 'node:test';
import assert from 'node:assert/strict';
import { battleTurn,createTrainerBattle,moveEffectiveness,techniqueDamage } from '../src/battle';
import { battleHint } from '../src/battle-hints';
import { newSave } from '../src/save';
import { maxHpAtLevel } from '../src/growth';
import { pokemonMoves } from '../src/pokemon';
import type { Pokemon } from '../src/types';

function mon(species=63,level=5):Pokemon{
  const maxHp=maxHpAtLevel(species,level),p:Pokemon={species,level,maxHp,hp:maxHp,experience:0,nature:'성실',met:'테스트'};
  p.moves=pokemonMoves(p);return p;
}
function ready(reserves=0,team=[mon(399,6)]){
  const s=newSave();s.party=[mon(),...Array.from({length:reserves},()=>mon(4))];s.inventory={pokeBalls:5,potions:3};
  const b=createTrainerBattle(s,{id:'recoil',name:'연습 상대',team,reward:160})!;return {s,b};
}
test('Struggle ignores type in damage, preview and resolved dialogue; ordinary immunity remains',()=>{
  for(const species of [92,74,448]){
    const {s,b}=ready(0,[mon(species,10)]);b.menu='moves';b.selected=0;
    assert.equal(moveEffectiveness('발버둥',b.enemy),1);
    assert(techniqueDamage(s.party[0],b.enemy,'발버둥')>0);
    assert(!battleHint(s,b).join().includes('효과'));
    assert(!battleTurn(s,b,'move0').pages.some(p=>p.includes('효과')));
  }
  assert.equal(moveEffectiveness('몸통박치기',mon(92)),0);
});
test('recoil knockout ends action immediately with zero, one or several healthy reserves',()=>{
  for(const reserves of [0,1,2]){
    const {s,b}=ready(reserves);s.party[0].hp=1;const inventory={...s.inventory};
    b.menu='moves';b.selected=0;assert.match(battleHint(s,b)[1],/반동으로 기절/);
    const result=battleTurn(s,b,'move0');
    assert.equal(s.party[0].hp,0);assert.equal(result.frames?.filter(f=>f.technique).length,1);
    assert(!result.pages.some(p=>p.includes('에게 0의 피해')));assert.deepEqual(s.inventory,inventory);
    assert.equal(result.pages.filter(p=>p.includes('쓰러졌다')).length,1);
    if(!reserves){assert.equal(result.outcome,'lost');assert.equal(s.money,0);}
    else if(reserves===1){assert.equal(b.active,1);assert.equal(s.party[1].hp,s.party[1].maxHp);}
    else {
      assert(b.forcedSwitch);const before=structuredClone(s);
      for(const action of ['ball','potion','move0'] as const){assert(battleTurn(s,b,action).retry);assert.deepEqual(s,before);}
      const entry=battleTurn(s,b,{switch:2});assert(!entry.frames?.some(f=>f.technique));assert(!b.forcedSwitch);assert.equal(b.active,2);
    }
  }
});
test('player simultaneous knockout gives defeat without reserves, otherwise one terminal reward',()=>{
  for(const reserves of [0,1,2]){
    const {s,b}=ready(reserves);s.party[0].hp=1;b.enemy.hp=1;
    const result=battleTurn(s,b,'move0');assert.equal(result.outcome,reserves?'won':'lost');
    assert.equal(result.pages.filter(p=>p.includes('쓰러졌다')).length,2);
    assert.equal(s.party[0].experience,0);assert.equal(s.money,reserves?160:0);
    const before=structuredClone(s);battleTurn(s,b,'move0');assert.deepEqual(s,before);
  }
});
test('simultaneous knockout in a team battle requires replacement then allows next action',()=>{
  for(const reserves of [1,2]){
    const {s,b}=ready(reserves,[mon(399,6),mon(399,6)]);s.party[0].hp=1;b.enemy.hp=1;
    assert.equal(battleTurn(s,b,'move0').outcome,undefined);assert.equal(b.enemyIndex,1);assert(b.forcedSwitch);
    const hp=s.party[1].hp;const entry=battleTurn(s,b,{switch:1});
    assert(!entry.frames?.some(f=>f.technique));assert.equal(s.party[1].hp,hp);
    assert(!b.forcedSwitch);assert(!b.betweenOpponents);assert(!battleTurn(s,b,'move0').retry);
  }
});
test('automatic replacement after recoil still takes entry hazard damage',()=>{
  const {s,b}=ready(1);s.party[0].hp=1;s.party[1].hp=1;b.playerRocks=true;
  const result=battleTurn(s,b,'move0');assert.equal(result.outcome,'lost');
  assert(result.pages.some(p=>p.includes('뾰족한 바위')));assert.equal(result.frames?.filter(f=>f.technique).length,1);
});
test('enemy recoil resolves single and simultaneous knockouts and consumes a potion only once',()=>{
  for(const lethal of [false,true])for(const reserves of [0,1,2]){
    const {s,b}=ready(reserves,[mon()]);b.enemy.hp=1;
    s.party[0].moves=['튀어오르기','방어'];if(lethal)s.party[0].hp=1;
    const result=battleTurn(s,b,'move0');assert.equal(b.enemy.hp,0);
    assert.equal(result.outcome,lethal&&!reserves?'lost':'won');
    assert.equal(result.pages.filter(p=>p.includes('쓰러졌다')).length,lethal?2:1);
  }
  const {s,b}=ready(0,[mon()]);b.enemy.hp=1;s.party[0].hp=1;
  assert.equal(battleTurn(s,b,'potion').outcome,'won');assert.equal(s.inventory.potions,2);
  battleTurn(s,b,'potion');assert.equal(s.inventory.potions,2);assert.equal(s.inventory.pokeBalls,5);
});
test('enemy recoil in a team battle advances once and forced entry clears both pending states',()=>{
  const {s,b}=ready(2,[mon(),mon(399,6)]);b.enemy.hp=1;s.party[0].hp=1;s.party[0].moves=['튀어오르기','방어'];
  const result=battleTurn(s,b,'move0');assert.equal(result.outcome,undefined);assert.equal(b.enemyIndex,1);assert(b.forcedSwitch);
  battleTurn(s,b,{switch:2});assert(!b.forcedSwitch);assert(!b.betweenOpponents);assert.equal(b.active,2);assert.equal(s.money,0);
});
test('surviving recoil preview includes its HP cost and agrees with final HP',()=>{
  const {s,b}=ready();b.menu='moves';b.selected=0;
  const hint=battleHint(s,b);assert.match(hint[0],/반동/);
  battleTurn(s,b,'move0');assert.equal(hint[1],`반격 후 HP ${s.party[0].hp}/${s.party[0].maxHp}`);
});
test('blocking enemy Struggle preserves its HP and spends no item',()=>{
  const {s,b}=ready(0,[mon()]);s.party[0].moves=['방어','튀어오르기'];const hp=b.enemy.hp,inventory={...s.inventory};
  const result=battleTurn(s,b,'move0',()=>0);assert.equal(b.enemy.hp,hp);
  assert(!result.pages.some(p=>p.includes('반동')));assert.deepEqual(s.inventory,inventory);
});
