import test from 'node:test';
import assert from 'node:assert/strict';
import { newSave } from '../src/save';
import { grantPokemon, BOX_CAPACITY } from '../src/pokemon';
import { maxHpAtLevel } from '../src/growth';
import {battleTurn,playerDamage,enemyDamage } from '../src/battle';
import {createBattle} from './runtime-battle-fixture';
import { battleHint } from '../src/battle-hints';
import { GYMS } from '../src/gyms';

function ready(species=7){const s=newSave();grantPokemon(s,species);s.flags.departureCleared=true;s.map='route_s01';s.inventory={pokeBalls:5,potions:2};return s;}
test('move damage previews agree with resolved wild and gym turns across levels and debuffs',()=>{
  for(const species of [1,4,7,25])for(const level of [5,8,25])for(const gym of [null,...GYMS.map(g=>g.id)]){
    const s=ready(species),p=s.party[0];p.level=level;p.hp=p.maxHp=maxHpAtLevel(species,level);
    const b=createBattle(s,gym?'gym':'wild',gym??'roark')!;b.menu='moves';b.enemyDefenseDrop=2;b.enemyAttackDrop=1;
    const hit=playerDamage(p,b),reply=enemyDamage(b,b.enemyAttackDrop,p),old=structuredClone({s,b});
    assert.match(battleHint(s,b)[0],new RegExp(`^상대에게 ${Math.min(b.enemy.hp,hit)} 피해`));assert.deepEqual({s,b},old);
    const turn=battleTurn(s,b,'move0');assert.equal(turn.frames![1].enemy.hp,Math.max(0,old.b.enemy.hp-hit));assert.equal(p.hp,Math.max(0,old.s.party[0].hp-(hit>=old.b.enemy.hp?0:reply)));
  }
});
test('finishing blow preview promises no retaliation and resolution preserves HP',()=>{
  const s=ready(),b=createBattle(s)!;b.menu='moves';b.enemy.hp=1;const hp=s.party[0].hp;
  assert.equal(battleHint(s,b)[1],'쓰러뜨리면 반격 없음');assert.equal(battleTurn(s,b,'move0').outcome,'won');assert.equal(s.party[0].hp,hp);
});
test('status previews reflect next damage and capped effects report failure but still cost a turn',()=>{
  for(const species of [1,7]){
    const s=ready(species),b=createBattle(s)!;b.menu='moves';b.selected=1;
    const defense=species===7;
    for(let i=0;i<3;i++){
      assert.match(battleHint(s,b)[0],new RegExp(`${i} → ${i+1}/3`));
      assert.equal(battleHint(s,b)[1],defense?`다음 공격 피해 ${7+i}`:`이번 반격 피해 ${3-i}`);
      battleTurn(s,b,'move1');
    }
    assert.match(battleHint(s,b)[0],/이미 최대/);const hp=s.party[0].hp;
    const result=battleTurn(s,b,'move1');assert(result.pages.some(p=>p.includes('더 이상 떨어지지 않는다')));
    assert.equal(s.party[0].hp,hp-enemyDamage(b));assert.equal(defense?b.enemyDefenseDrop:b.enemyAttackDrop,3);
  }
});
test('potion and switch previews include the retaliation and invalid action reasons',()=>{
  const s=ready(),b=createBattle(s)!;b.menu='heal';b.selected=0;
  assert.match(battleHint(s,b)[0],/가득/);s.party[0].hp=2;
  assert.equal(battleHint(s,b)[1],'반격 후 HP 16/20');battleTurn(s,b,'potion');assert.equal(s.party[0].hp,16);
  s.inventory.potions=0;assert.match(battleHint(s,b)[0],/없습니다/);
  s.party.push({species:399,level:3,hp:3,maxHp:18,experience:0,nature:'성실',met:'새잎 서쪽길'});
  b.menu='party';b.selected=0;assert.match(battleHint(s,b)[0],/이미 싸우/);
  b.selected=1;assert.equal(battleHint(s,b)[1],'반격 후 기절 (HP 0)');battleTurn(s,b,{switch:1});assert.equal(s.party[1].hp,0);
  assert.match(battleHint(s,b)[0],/교대 불가/);
});
test('catch preview follows HP threshold and eligibility without consuming resources',()=>{
  const s=ready(),b=createBattle(s)!;b.menu='bag';const before=structuredClone({s,b});
  assert.match(battleHint(s,b)[0],/55%/);assert.deepEqual({s,b},before);
  b.enemy.hp=b.enemy.maxHp/2;assert.match(battleHint(s,b)[0],/100%/);
  const caught=battleTurn(s,b,'ball',()=>.99);assert.equal(caught.outcome,'caught');
  const gym=createBattle(s,'gym')!;gym.menu='bag';assert.match(battleHint(s,gym)[0],/포획 불가/);
  const wild=createBattle(s)!;wild.menu='bag';s.inventory.pokeBalls=0;assert.match(battleHint(s,wild)[0],/없습니다/);
  while(s.party.length<6)s.party.push({...s.party[1]});s.inventory.pokeBalls=1;assert.match(battleHint(s,wild)[1],/PC 박스/);s.box=Array.from({length:60},()=>({...s.party[1]}));assert.match(battleHint(s,wild)[0],/가득/);
});

test('full party catch preview preserves failure damage and agrees with success, failure and capacity limits',()=>{
  for(const hp of [1,20])for(const certain of [false,true]){
    const s=ready();while(s.party.length<6)s.party.push({...s.party[0]});s.party[0].hp=hp;
    const b=createBattle(s)!;b.menu='bag';if(certain)b.enemy.hp=Math.floor(b.enemy.maxHp/2);
    const before=structuredClone({s,b}),loss=Math.min(hp,enemyDamage(b,b.enemyAttackDrop,s.party[0]));
    const hint=battleHint(s,b);assert.match(hint[1],/PC 박스/);
    if(certain)assert.doesNotMatch(hint[1],/실패/);else assert.match(hint[1],new RegExp(`실패 반격: HP -${loss}$`));
    assert.deepEqual({s,b},before);
    const result=battleTurn(s,b,'ball',()=>.99);
    assert.equal(s.inventory.pokeBalls,before.s.inventory.pokeBalls-1);
    assert.equal(s.party[0].hp,certain?hp:hp-loss);
    assert.equal(s.box?.length??0,certain?1:0);
    if(certain){assert.equal(result.outcome,'caught');assert.equal(result.caughtInBox,true);}
    else assert(result.pages.some(page=>page.includes('빠져나왔다')));
  }
  const s=ready();while(s.party.length<6)s.party.push({...s.party[0]});
  const b=createBattle(s)!;b.menu='bag';s.box=Array.from({length:BOX_CAPACITY},()=>({...s.party[0]}));
  const before=structuredClone(s);assert.match(battleHint(s,b)[0],/가득/);battleTurn(s,b,'ball',()=>0);assert.deepEqual(s,before);
});
