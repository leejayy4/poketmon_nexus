import test from 'node:test';
import assert from 'node:assert/strict';
import { newSave,parseSave } from '../src/save';
import { grantPokemon,pokemonMoves } from '../src/pokemon';
import { maxHpAtLevel } from '../src/growth';
import { createTrainerBattle,battleTurn,type BattleAction } from '../src/battle';
import { battleHint } from '../src/battle-hints';
import type { Pokemon } from '../src/types';

const mon=(species:number,level:number,hp=maxHpAtLevel(species,level)):Pokemon=>({species,level,hp,maxHp:maxHpAtLevel(species,level),experience:0,nature:'성실',met:'검사'});
function draining(hp:number,enemyHp=40,defense=0){
  const save=newSave();grantPokemon(save,4);save.flags.departureCleared=true;
  const budew=mon(406,8,hp);budew.moves=pokemonMoves(budew);save.party.unshift(budew);
  assert(parseSave(JSON.stringify(save)));
  const enemy=mon(74,7,enemyHp);enemy.moves=['몸통박치기','방어'];
  const battle=createTrainerBattle(save,{id:'drain-check',name:'검사',reward:0,team:[enemy]})!;battle.menu='moves';battle.enemyDefense=defense;
  return {save,battle,budew};
}

test('Budew drain preview counts healing before retaliation and leaves its inputs untouched',()=>{
  const {save,battle,budew}=draining(1),before=structuredClone({save,battle});
  assert.deepEqual(battleHint(save,battle),['상대에게 18 피해 · 효과가 굉장했다!','HP +9 · 반격 후 HP 1/51']);assert.deepEqual({save,battle},before);
  const turn=battleTurn(save,battle,'move0');assert.equal(budew.hp,1);assert(turn.frames!.some(f=>f.effect?.kind==='heal'&&f.effect.amount===9));assert(!turn.pages.some(p=>p.includes('꼬몽울은 쓰러졌다')));
});

test('drain preview caps healing at missing HP, including a completely healthy Pokemon',()=>{
  for(const [start,healed] of [[50,1],[51,0]]){
    const {save,battle,budew}=draining(start);assert.equal(battleHint(save,battle)[1],`HP +${healed} · 반격 후 HP 42/51`);
    const turn=battleTurn(save,battle,'move0');assert.equal(budew.hp,42);assert.equal(turn.frames!.filter(f=>f.effect?.kind==='heal').reduce((n,f)=>n+f.effect!.amount,0),healed);
  }
});

test('finishing drain uses actual remaining enemy HP and promises no retaliation',()=>{
  for(const [enemyHp,healed] of [[1,1],[3,1],[5,2]]){
    const {save,battle,budew}=draining(1,enemyHp);
    assert.deepEqual(battleHint(save,battle),[`상대에게 ${enemyHp} 피해 · 효과가 굉장했다!`,`HP +${healed} · 반격 없음 (${1+healed}/51)`]);
    const turn=battleTurn(save,battle,'move0');assert.equal(turn.outcome,'won');assert.equal(budew.hp,1+healed);assert(!turn.frames!.some(f=>f.effect?.kind==='damage'&&f.effect.target==='player'));
  }
});

test('enemy defense reduces both drain damage and healing and still predicts a real knockout',()=>{
  const {save,battle,budew}=draining(1,40,2);
  assert.deepEqual(battleHint(save,battle),['상대에게 14 피해 · 효과가 굉장했다!','HP +7 · 반격 후 기절 (HP 0)']);
  const turn=battleTurn(save,battle,'move0');assert.equal(budew.hp,0);assert(turn.frames!.some(f=>f.effect?.kind==='heal'&&f.effect.amount===7));assert(turn.pages.some(p=>p.includes('꼬몽울은 쓰러졌다')));
});

test('enemy drain and Protect retain their existing HP predictions and actual recovery rules',()=>{
  for(const protect of [false,true]){
    const save=newSave();grantPokemon(save,7);save.flags.departureCleared=true;const squirtle=save.party[0];squirtle.level=protect?22:13;squirtle.hp=squirtle.maxHp=maxHpAtLevel(7,squirtle.level);squirtle.moves=['몸통박치기',protect?'방어':'물대포'];assert(parseSave(JSON.stringify(save)));
    const enemy=mon(406,8,40);enemy.moves=pokemonMoves(enemy);
    const battle=createTrainerBattle(save,{id:'enemy-drain',name:'검사',reward:0,team:[enemy]})!;battle.menu='moves';battle.selected=protect?1:0;
    const hint=battleHint(save,battle);assert.equal(hint[1],protect?'연속 사용하면 성공률이 낮아집니다':'반격 후 HP 35/44');
    const turn=battleTurn(save,battle,`move${battle.selected}` as BattleAction,()=>.99);assert.equal(squirtle.hp,protect?71:35);assert.equal(battle.enemy.hp,protect?40:34);
    assert.equal(turn.frames!.filter(f=>f.effect?.kind==='heal').reduce((n,f)=>n+f.effect!.amount,0),protect?0:4);
  }
});
