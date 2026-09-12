import test from 'node:test';
import assert from 'node:assert/strict';
import {Engine} from '../src/engine';
import {playerDamage,type BattleAction} from '../src/battle';
import {pokemonMoves} from '../src/pokemon';
import {parseSave} from '../src/save';
import {eternaCombatFixture} from './eterna-combat-fixture';

function finish(g:Engine){for(let i=0;g.dialogue&&i<180;i++){g.dialogue.shown=1000;g.confirm();}assert(!g.dialogue);}
function win(g:Engine){
  for(let turn=0;g.battle&&!g.battle.result&&turn<100;turn++){
    finish(g);const b=g.battle!;
    const best=g.save.party.flatMap((p,i)=>p.hp>0?pokemonMoves(p).map((move,j)=>({i,j,damage:playerDamage(p,{...b,active:i},move)})):[]).sort((a,z)=>z.damage-a.damage)[0];assert(best);
    const action:BattleAction=b.forcedSwitch||best.i!==b.active?{switch:best.i}:`move${best.j}` as BattleAction;
    g.actBattle(action);finish(g);
  }
  assert(!g.battle||g.battle.result==='won');finish(g);
}
test('Eterna optional trainer cancellation, victory, restoration and repeat interaction preserve one-time reward',t=>{
  const g=new Engine();t.mock.method(g,'announce',()=>{});g.save=eternaCombatFixture();
  const before=structuredClone(g.save);g.event('journeyWalker');g.cancel();assert.deepEqual(g.save,before);assert(!g.battle);
  g.event('journeyWalker');g.dialogue!.choices!.find(c=>c.label==='배틀한다')!.action();finish(g);
  assert.equal(g.battle?.enemy.species,406);win(g);
  assert.equal(g.save.flags['trainerWon:eterna-forest-practice'],true);assert.equal(g.save.money,before.money+240);
  g.restore(parseSave(JSON.stringify(g.save))!);const money=g.save.money;g.event('journeyWalker');finish(g);assert(!g.battle);assert.equal(g.save.money,money);
});
test('Eterna trainer defeat restores the city center without granting victory',t=>{
  const g=new Engine();t.mock.method(g,'announce',()=>{});g.save=eternaCombatFixture();g.save.party=g.save.party.slice(0,1);g.save.party[0].hp=1;
  g.event('journeyWalker');g.dialogue!.choices!.find(c=>c.label==='배틀한다')!.action();finish(g);g.actBattle('move1');finish(g);
  assert.equal(g.save.map,'tour_eterna_center');assert(!g.save.flags['trainerWon:eterna-forest-practice']);assert.equal(g.save.party[0].hp,g.save.party[0].maxHp);assert(parseSave(JSON.stringify(g.save)));
});
test('Prepared pre-Eterna party can challenge Gardenia without the optional trainer and preserves badge reward on reload',t=>{
  const g=new Engine();t.mock.method(g,'announce',()=>{});g.save=eternaCombatFixture();g.save.map='eterna_gym';g.save.player={x:8,y:5,facing:'up'};
  g.event('gardenia');finish(g);assert.equal(g.battle?.gymId,'gardenia');win(g);
  assert(g.save.badges.includes('BADGE-GS02'));assert(g.save.keyItems.includes('TM-grass-knot'));assert(!g.save.flags['trainerWon:eterna-forest-practice']);
  g.restore(parseSave(JSON.stringify(g.save))!);const money=g.save.money;g.event('gardenia');finish(g);assert(!g.battle);assert.equal(g.save.money,money);
});
