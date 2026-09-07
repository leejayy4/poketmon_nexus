import test from 'node:test';
import assert from 'node:assert/strict';
import { newSave } from '../src/save';
import { grantPokemon } from '../src/pokemon';
import { battleTurn } from '../src/battle';
import { createBattle } from './runtime-battle-fixture';

function ready(badges:string[]=[]){
  const save=newSave();
  grantPokemon(save,7);
  save.flags.departureCleared=true;
  save.map='route_s01';
  save.badges=[...badges];
  save.inventory={pokeBalls:0,potions:0};
  return save;
}

function assertShortageMessage(kind:'ball'|'potion',badges:string[],expected:string){
  const save=ready(badges);
  if(kind==='potion')save.party[0].hp=1;
  const battle=createBattle(save)!;
  const before=structuredClone({save,battle});
  const result=battleTurn(save,battle,kind);
  assert.equal(result.retry,true);
  assert(result.pages.some(page=>page.includes(expected)));
  assert.deepEqual({save,battle},before);
  assert.equal(battle.turn,undefined);
  assert.equal(battle.enemy.hp,before.battle.enemy.hp);
  assert.equal(save.inventory.pokeBalls,0);
  assert.equal(save.inventory.potions,0);
}

test('pre-badge supply shortages point to the route guide without consuming a turn',()=>{
  assertShortageMessage('ball',[],'길 안내원에게');
  assertShortageMessage('potion',[],'길 안내원에게');
});

test('post-badge supply shortages point to the town mart without changing battle state',()=>{
  assertShortageMessage('ball',['BADGE-GS01'],'마을 상점에서');
  assertShortageMessage('potion',['BADGE-GS01'],'마을 상점에서');
});
