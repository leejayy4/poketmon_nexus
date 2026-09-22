import test from 'node:test';
import assert from 'node:assert/strict';
import type { Engine } from '../src/engine';
import type { Choice, Dialogue } from '../src/types';
import { newNexusSave, newSave } from '../src/save';
import { grantPokemon, pokemonMoves } from '../src/pokemon';
import { NEXUS_STARTERS } from '../src/nexus-starters';
import { NEXUS_OPENING } from '../src/nexus-opening-state';
import { battleTurn } from '../src/battle';
import { currentPp, maxPp, spendPp } from '../src/move-pp';
import { trainerWinFlag } from '../src/trainer-flags';
import { meetNexusFirstRival, finishNexusFirstRivalBattle, NEXUS_FIRST_RIVAL as F, NEXUS_FIRST_RIVAL_TRAINER } from '../src/nexus-first-rival';

// Dormant during QA pause. The harness uses no Engine constructor or browser storage.
function game(species=900002){
  const save=newNexusSave();
  save.flags[NEXUS_OPENING.profile]=true;save.flags[NEXUS_OPENING.broadcast]=true;
  save.flags[NEXUS_OPENING.postcards]=true;save.flags[NEXUS_OPENING.reply]=1;
  assert(grantPokemon(save,species));
  save.flags[NEXUS_OPENING.outside]=true;save.flags.departureCleared=true;
  save.map='town';save.player={x:8,y:25,facing:'left'};
  save.inventory={pokeBalls:5,potions:2};
  let writes=0;
  const stub={save,panel:'field',sceneRevision:0,battle:null,dialogue:null as Dialogue|null,
    move:null,transition:0,battleFrames:null,grassSteps:0,
    clearInput(){},persist(){writes++;return true;},setTourDestination(){},
    say(speaker:string,pages:string[],after?:()=>void,choices?:Choice[]){
      this.sceneRevision++;this.battleFrames=null;
      this.dialogue={speaker,pages,page:0,shown:0,selected:0,after,choices};
    },
  };
  return {g:stub as unknown as Engine,writes:()=>writes};
}
function finishScene(g:Engine){const dialogue=g.dialogue;assert(dialogue&&!dialogue.choices);g.dialogue=null;dialogue.after?.();}
function choose(g:Engine,label:string){const choice=g.dialogue?.choices?.find(choice=>choice.label===label);assert(choice,label);g.dialogue=null;choice.action();}
function offer(g:Engine){
  assert(meetNexusFirstRival(g));
  while(g.dialogue&&!g.dialogue.choices)finishScene(g);
  assert(g.dialogue?.choices);
}
function start(g:Engine){offer(g);choose(g,'첫 승부를 한다');assert(g.battle);finishScene(g);return g.battle!;}
function fullParty(g:Engine){
  for(const partner of g.save.party){
    assert.equal(partner.hp,partner.maxHp);
    assert.deepEqual(currentPp(partner,pokemonMoves(partner)),pokemonMoves(partner).map(maxPp));
  }
}

test('the first rivalry starts only after NEXUS partner exit and departure',()=>{
  for(const missing of [NEXUS_OPENING.outside,'departureCleared']){
    const {g}=game();delete g.save.flags[missing];
    assert.equal(meetNexusFirstRival(g),false);assert.equal(g.dialogue,null);
  }
  const {g}=game();g.save=newSave();g.save.map='town';
  assert.equal(meetNexusFirstRival(g),false);
});

test('meeting and declining record a relationship without battle, rewards or departure changes',()=>{
  const {g}=game(),inventory={...g.save.inventory},position={...g.save.player};
  assert(meetNexusFirstRival(g));assert.equal(g.save.flags[F.met],undefined);
  finishScene(g);assert.equal(g.dialogue?.speaker,'유진');
  assert(g.dialogue?.pages[0].includes(g.save.trainer!.name));
  finishScene(g);assert.equal(g.save.flags[F.met],true);
  choose(g,'먼저 길을 둘러본다');
  assert.equal(g.battle,null);assert.equal(g.save.flags[F.started],undefined);
  assert.equal(g.save.flags[F.participated],undefined);assert.equal(g.save.flags[F.won],undefined);
  assert.equal(g.save.flags.departureCleared,true);assert.deepEqual(g.save.inventory,inventory);
  assert.deepEqual(g.save.player,position);assert.equal(g.save.money,0);
});

test('old first-battle choices cannot act on a new save or replacement scene',()=>{
  for(const changeSave of [false,true]){
    const {g}=game();offer(g);const action=g.dialogue!.choices![0].action;
    if(changeSave)g.save=structuredClone(g.save);else g.say('도윤',['다른 이야기']);
    g.dialogue=null;action();assert.equal(g.battle,null);
    assert.equal(g.save.flags[F.started],undefined);
  }
});

test('actual first victories keep the road position, recover HP/PP and cannot be farmed',()=>{
  for(const species of NEXUS_STARTERS){
    const {g}=game(species),position={...g.save.player},inventory={...g.save.inventory};
    const battle=start(g);battle.enemy.hp=1;
    const turn=battleTurn(g.save,battle,'move0',()=>0);
    assert.equal(turn.outcome,'won');assert(finishNexusFirstRivalBattle(g,battle,turn));
    assert.equal(g.save.flags[F.participated],true);assert.equal(g.save.flags[F.completed],true);
    assert.equal(g.save.flags[F.won],true);assert.equal(g.save.flags[trainerWinFlag(NEXUS_FIRST_RIVAL_TRAINER)],true);
    assert.equal(g.save.money,0);assert.deepEqual(g.save.inventory,inventory);
    assert.equal(g.save.map,'town');assert.deepEqual(g.save.player,position);fullParty(g);
    const after=structuredClone(g.save);
    finishScene(g);choose(g,'마을에서 더 준비');assert.equal(g.battle,null);
    assert(meetNexusFirstRival(g));assert.equal(g.dialogue?.choices,undefined);
    assert.deepEqual(g.save,after,'a completed duel never restarts or pays again');
  }
});

test('an actual loss records completion separately from victory and leaves travel ready',()=>{
  const {g}=game(),position={...g.save.player};const battle=start(g);
  g.save.party[0].hp=1;
  const turn=battleTurn(g.save,battle,'move2',()=>0);
  assert.equal(turn.outcome,'lost');assert(finishNexusFirstRivalBattle(g,battle,turn));
  assert.equal(g.save.flags[F.completed],true);assert.equal(g.save.flags[F.participated],true);
  assert.equal(g.save.flags[F.won],false);assert.equal(g.save.flags[trainerWinFlag(NEXUS_FIRST_RIVAL_TRAINER)],undefined);
  assert.equal(g.save.flags.departureCleared,true);assert.equal(g.save.map,'town');
  assert.deepEqual(g.save.player,position);assert.equal(g.save.money,0);fullParty(g);
});

test('cancelling before the first turn recovers the party and offers a later retry without a result',()=>{
  const {g}=game();const battle=start(g),partner=g.save.party[0];
  partner.hp--;spendPp(partner,pokemonMoves(partner),0);
  const turn=battleTurn(g.save,battle,'run',()=>0);
  assert.equal(turn.outcome,'escaped');assert(finishNexusFirstRivalBattle(g,battle,turn));
  assert.equal(g.save.flags[F.participated],undefined);assert.equal(g.save.flags[F.completed],undefined);
  assert.equal(g.save.flags[F.won],undefined);assert.equal(g.save.money,0);fullParty(g);
  finishScene(g);choose(g,'마을에서 더 준비');offer(g);
  assert(g.dialogue?.choices?.some(choice=>choice.label==='첫 승부를 한다'));
});

test('nonterminal turns and stale battle references never manufacture a win',()=>{
  const {g}=game();const battle=start(g);
  const turn=battleTurn(g.save,battle,'move2',()=>0);
  assert.equal(turn.outcome,undefined);assert.equal(finishNexusFirstRivalBattle(g,battle,turn),false);
  assert.equal(g.save.flags[F.participated],true);assert.equal(g.save.flags[F.completed],undefined);
  assert.equal(g.save.flags[F.won],undefined);
  const before=structuredClone(g.save);g.save=structuredClone(g.save);
  battle.result=true;
  assert.equal(finishNexusFirstRivalBattle(g,battle,{pages:[],outcome:'won'}),false);
  assert.deepEqual(g.save,before);
});
