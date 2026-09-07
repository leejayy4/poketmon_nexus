import assert from 'node:assert/strict';
import test from 'node:test';
import {battleTurn} from '../src/battle';
import {newSave} from '../src/save';
import {grantPokemon} from '../src/pokemon';
import {createBattle} from './runtime-battle-fixture';

test('capture messages use 조사 matching the caught species name',()=>{
  const save=newSave();grantPokemon(save,7);save.flags.departureCleared=true;const battle=createBattle(save)!;
  battle.enemy={...battle.enemy,species:74,hp:1,maxHp:22};
  save.inventory.pokeBalls=1;
  const result=battleTurn(save,battle,'ball',()=>0);
  assert.equal(result.pages[1],'좋아! 꼬마돌을 잡았다!\n꼬마돌이 파티에 등록되었다.');
});

test('battle knockout messages use 조사 matching player and enemy names',()=>{
  const save=newSave();grantPokemon(save,7);save.flags.departureCleared=true;const battle=createBattle(save)!;
  battle.enemy={...battle.enemy,species:74,hp:1,maxHp:22};
  save.party[0].species=399;save.party[0].hp=18;save.party[0].maxHp=18;
  const result=battleTurn(save,battle,'move0',()=>0);
  assert(result.pages.some(page=>page.includes('야생 꼬마돌이 쓰러졌다!')));
});
