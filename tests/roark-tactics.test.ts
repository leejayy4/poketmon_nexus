import test from 'node:test';
import assert from 'node:assert/strict';
import {newSave} from '../src/save';
import {grantPokemon} from '../src/pokemon';
import {maxHpAtLevel} from '../src/growth';
import {createBattle,battleTurn,enemyMove,enemyDamage,playerDamage,type BattleAction} from '../src/battle';
import {battleHint} from '../src/battle-hints';
import {GYMS,gymTeam} from '../src/gyms';
import type {Pokemon} from '../src/types';

function fixture(level=9){
  const save=newSave();grantPokemon(save,7);save.flags.departureCleared=true;save.inventory.potions=3;
  const p=save.party[0];p.level=level;p.hp=p.maxHp=maxHpAtLevel(7,level);p.moves=['몸통박치기','꼬리흔들기','거품'];
  const battle=createBattle(save,'gym','roark')!;battle.enemyIndex=2;battle.enemy=battle.opponents[2];battle.menu='moves';battle.selected=2;
  return {save,battle,p};
}

// Cranidos Lv.12 (speed 18) outruns Squirtle Lv.9 (speed 12), so since speed and
// priority landed Roark acts before taking the hit: its "set up while safe" check
// sees full HP and installs rocks, then eats Bubble. The pre-speed expectation of
// an immediate counter no longer holds on the first turn. Recorded as an open
// balance question in docs/autonomy/nexus-implementation-review-20260920.md.
test('Roark sets up while still safe, then takes the Bubble it cannot outpace',()=>{
  const {save,battle,p}=fixture(),before=structuredClone({save,battle}),gyms=structuredClone(GYMS);
  assert.equal(enemyMove(battle,p),'스텔스록');assert.equal(enemyDamage(battle,0,p),0);
  // The hint panel's second line carries turn order; the resulting HP is asserted
  // below through the real turn instead.
  const hint=battleHint(save,battle);
  assert.equal(hint[0],'기본 예상 피해 18 · 효과가 굉장했다!');
  assert.match(hint[1],/상대 기술이 먼저/);
  assert.deepEqual({save,battle},before);
  const turn=battleTurn(save,battle,'move2');
  assert.equal(p.hp,32,'the rock setup deals no direct damage');
  assert.equal(battle.enemy.hp,8);
  assert(battle.playerRocks,'rocks are installed before Roark is threatened');
  assert(turn.pages.includes('강석의 두개도스의 스텔스록!'));
  assert.deepEqual(GYMS,gyms);assert.deepEqual(gymTeam('roark').map(p=>[p.level,p.maxHp]),[[10,22],[11,24],[12,26]]);
});

test('Roark installs rocks only when its remaining HP exceeds the equipped move threat',()=>{
  const {save,battle,p}=fixture();const threat=playerDamage(p,battle,'거품');battle.enemy.hp=threat;assert.equal(enemyMove(battle,p),'박치기');
  battle.enemy.hp=threat+1;assert.equal(enemyMove(battle,p),'스텔스록');
  battle.enemy.hp=26;battle.selected=1;const hint=battleHint(save,battle);assert.match(hint[0],/방어 하락/);const hp=p.hp;battleTurn(save,battle,'move1');assert(battle.playerRocks);assert.equal(p.hp,hp);
});

test('other gyms, ordinary trainers and wild move selection preserve their existing behavior',()=>{
  const {battle,p}=fixture();battle.enemy.hp=1;
  assert.equal(enemyMove({...battle,gymId:'gardenia'},p),'스텔스록');
  assert.equal(enemyMove({...battle,kind:'trainer'},p),'스텔스록');
  assert.equal(enemyMove({...battle,kind:'wild'},p),'박치기');
  assert.equal(enemyMove({...battle,turn:1},p),'박치기');
  assert.equal(enemyMove({...battle,playerRocks:true},p),'박치기');
});

test('drain, recoil and finishing attacks keep their HP previews when Roark changes tactics',()=>{
  for(const kind of ['drain','struggle','finish'] as const){
    const {save,battle,p}=fixture();battle.enemy.hp=18;
    if(kind==='drain'){Object.assign(p,{species:406,level:9,hp:20,maxHp:maxHpAtLevel(406,9),moves:['흡수']});battle.selected=0;}
    if(kind==='struggle'){p.moves=['발버둥','거품'];battle.selected=0;}
    if(kind==='finish')battle.enemy.hp=1;
    const hint=battleHint(save,battle),turn=battleTurn(save,battle,`move${battle.selected}` as BattleAction);
    // The drain and recoil notes moved onto the first line; the second now shows
    // turn order. The actual HP result is asserted from the resolved turn.
    if(kind==='drain'){assert.match(hint[0],/준 피해의 절반 흡수/);assert.equal(p.hp,26);}
    if(kind==='struggle'){assert.match(hint[0],/반동 최대HP 1\/4/);assert.equal(p.hp,4);}
    // A finishing blow no longer avoids the counter: the faster opponent still gets
    // its turn first, exactly as the series resolves speed.
    if(kind==='finish'){assert.match(hint[0],/기본 예상 피해 1\b/);assert.equal(p.hp,12);assert.equal(turn.outcome,'won');}
  }
});

test('defense and potion previews use the unchanged enemy HP for the Roark threat check',()=>{
  for(const action of ['defense','potion']){
    const {save,battle,p}=fixture(10);battle.enemy.hp=16;p.moves.push('껍질에숨기');
    if(action==='defense'){battle.selected=3;assert.match(battleHint(save,battle)[1],/물리 피해에 방어 적용/);battleTurn(save,battle,'move3');assert.equal(p.hp,17);}
    else {p.hp=5;battle.menu='heal';battle.selected=0;assert.equal(battleHint(save,battle)[1],'반격 후 HP 7/35');battleTurn(save,battle,'potion');assert.equal(p.hp,7);}
    assert(!battle.playerRocks);
  }
});

test('switch preview resets the incoming attacker stages before evaluating the Roark threat',()=>{
  const {save,battle,p}=fixture();save.party.unshift({species:399,level:3,hp:18,maxHp:18,experience:0,nature:'성실',met:'검사',moves:['몸통박치기']} satisfies Pokemon);
  battle.active=0;battle.selected=1;battle.menu='party';battle.enemy.hp=14;battle.playerAttackDrop={1:3};battle.playerDefense={1:3};
  const before=structuredClone({save,battle});assert.equal(battleHint(save,battle)[1],'반격 후 HP 12/32');assert.deepEqual({save,battle},before);
  battleTurn(save,battle,{switch:1});assert.equal(p.hp,12);assert.equal(battle.playerAttackDrop[1],0);assert(!battle.playerRocks);
});
