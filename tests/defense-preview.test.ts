import test from 'node:test';
import assert from 'node:assert/strict';
import {newSave,parseSave} from '../src/save';
import {grantPokemon} from '../src/pokemon';
import {maxHpAtLevel} from '../src/growth';
import {createTrainerBattle,battleTurn} from '../src/battle';
import {battleHint} from '../src/battle-hints';
import type {Pokemon} from '../src/types';

const mon=(species:number,level:number,moves:string[]):Pokemon=>({species,level,moves,hp:maxHpAtLevel(species,level),maxHp:maxHpAtLevel(species,level),experience:0,nature:'성실',met:'검사'});
function fixture(stage:number,hp=35,active=0){
  const save=newSave();grantPokemon(save,7);save.flags.departureCleared=true;const squirtle=save.party[0];Object.assign(squirtle,mon(7,10,['몸통박치기','껍질에숨기']),{hp});
  if(active)save.party.unshift(mon(399,3,['몸통박치기']));
  assert(parseSave(JSON.stringify(save)));
  const battle=createTrainerBattle(save,{id:'defense',name:'검사',reward:0,team:[mon(74,7,['몸통박치기','방어'])]})!;
  battle.active=active;battle.menu='moves';battle.selected=1;battle.playerDefense={0:0,[active]:stage};
  return {save,battle,squirtle};
}

test('defense preview applies the next stage before retaliation and does not mutate its inputs',()=>{
  for(const [stage,after,damage] of [[0,1,8],[2,3,6],[3,3,6]]){
    const {save,battle,squirtle}=fixture(stage),before=structuredClone({save,battle});
    assert.deepEqual(battleHint(save,battle),[stage===3?'방어 상승은 이미 최대':`자신 방어 ${stage} → ${after}/3`,`반격 후 HP ${35-damage}/35`]);assert.deepEqual({save,battle},before);
    const turn=battleTurn(save,battle,'move1');assert.equal(battle.playerDefense![0],after);assert.equal(squirtle.hp,35-damage);assert.equal(battle.turn,1);assert(!turn.retry);
    assert(turn.pages.some(p=>p.includes(stage===3?'더 이상 올라가지 않는다':'방어가 올라갔다')));
    assert.equal(turn.pages.some(p=>p.includes('방어가 올라갔다')),stage!==3);
    assert.equal(turn.frames!.filter(f=>f.effect?.target==='player'&&f.effect.kind==='damage').reduce((total,f)=>total+f.effect!.amount,0),damage);
  }
});

test('defense preview handles lethal HP boundaries and an active Pokemon outside slot zero',()=>{
  for(const stage of [2,3])for(const hp of [1,6,7]){
    const {save,battle,squirtle}=fixture(stage,hp,1),before=structuredClone(battle.playerDefense);
    assert.equal(battleHint(save,battle)[1],hp<=6?'반격 후 기절 (HP 0)':'반격 후 HP 1/35');assert.deepEqual(battle.playerDefense,before);
    const turn=battleTurn(save,battle,'move1');assert.equal(squirtle.hp,Math.max(0,hp-6));assert.equal(battle.playerDefense![1],3);assert.equal(battle.playerDefense![0],0);
    assert(turn.frames!.some(f=>f.effect?.target==='player'&&f.effect.kind==='damage'&&f.effect.amount===Math.min(hp,6)));
  }
});

test('opponent defense reaches its cap and reports a capped attempt without advancing the stat',()=>{
  for(const stage of [2,3]){
    const {save,squirtle}=fixture(0);
    const battle=createTrainerBattle(save,{id:'enemy-defense',name:'검사',reward:0,team:[mon(7,10,['껍질에숨기'])]})!;battle.enemyDefense=stage;
    const turn=battleTurn(save,battle,'move1');assert.equal(battle.enemyDefense,3);assert.equal(battle.turn,1);assert.equal(squirtle.hp,squirtle.maxHp);
    assert(turn.pages.includes(stage===3?'꼬부기의 방어는\n더 이상 올라가지 않는다!':'꼬부기의 방어가 올라갔다!'));
    // The first defense message belongs to the player's own successful move.
    assert.equal(turn.pages.filter(p=>p==='꼬부기의 방어가 올라갔다!').length,stage===3?1:2);
  }
});
