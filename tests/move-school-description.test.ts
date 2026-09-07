import test from 'node:test';
import assert from 'node:assert/strict';
import type { Engine } from '../src/engine';
import type { Choice } from '../src/types';
import { MOVE_RULES,grantPokemon,pokemonMoves } from '../src/pokemon';
import { newSave,parseSave } from '../src/save';
import { maxHpAtLevel } from '../src/growth';
import { moveDescription } from '../src/move-description';
import { showMoveSchool } from '../src/move-school';

function fixture(){
  const save=newSave();grantPokemon(save,4);
  const p=save.party[0];p.level=7;p.hp=p.maxHp=maxHpAtLevel(4,7);
  let dialogue:{pages:string[];choices:Choice[];after?:()=>void}={pages:[],choices:[]};
  let writes=0,sounds=0;
  const game={save,partyIndex:0,battle:null,
    say(_speaker:string,pages:string[],after?:()=>void,choices:Choice[]=[]){
      for(const page of pages){assert(page.split('\n').length<=3);}
      dialogue={pages,choices,after};
    },persist(){writes++;},audio:{play(){sounds++;}},
  } as unknown as Engine;
  const choose=(label:string)=>{const c=dialogue.choices.find(c=>c.label===label);assert(c,label);c.action();};
  return {game,choose,get dialogue(){return dialogue;},get writes(){return writes;},get sounds(){return sounds;},
    compare(){showMoveSchool(game);choose('불꽃세례');choose('할퀴기와 비교');}};
}

test('all runtime rules have short descriptions without invented secondary effects',()=>{
  for(const [move,data] of Object.entries(MOVE_RULES)){
    const text=moveDescription(move);assert(!text.includes('정보 없음'),move);
    assert(text.split('\n').length<=2,move);
    for(const line of text.split('\n'))assert(line.length<=24,`${move}: ${line}`);
    if(data.rule==='damage'){
      assert(text.includes(`위력 ${data.power}`));assert(!/마비|독 상태|급소|명중|선공|풀죽/.test(text));
    }
  }
  assert.match(moveDescription('용의분노'),/고정 피해 40/);
  assert.match(moveDescription('지구던지기'),/자기 레벨만큼 피해/);
  assert.match(moveDescription('풀묶기'),/무거울수록/);
  assert.match(moveDescription('흡수'),/절반.*HP 흡수/);
  assert.match(moveDescription('방어'),/연속.*성공률 감소/);
  assert.match(moveDescription('울음소리'),/상대 공격.*하락/);
  assert.match(moveDescription('꼬리흔들기'),/상대 방어.*하락/);
  assert.match(moveDescription('발버둥'),/반동.*1\/4/);
  assert.match(moveDescription('스텔스록'),/교대 때만 피해/);
  assert.match(moveDescription('순간이동'),/트레이너전에서는 효과 없음/);
  assert.match(moveDescription('튀어오르기'),/아무 효과 없음/);
});

test('comparison is read-only, cancellation preserves moves, confirmation saves once and reloads',()=>{
  const f=fixture(),before=structuredClone(f.game.save);
  f.compare();assert.deepEqual(f.game.save,before);assert.equal(f.writes,0);
  assert.equal(f.dialogue.pages.length,3);
  assert.equal(f.dialogue.pages[0],`현재: 할퀴기\n${moveDescription('할퀴기')}`);
  assert.equal(f.dialogue.pages[1],`새 기술: 불꽃세례\n${moveDescription('불꽃세례')}`);
  for(const page of f.dialogue.pages)assert(page.split('\n').length<=3);
  f.choose('기술 목록으로');assert.deepEqual(f.game.save,before);
  f.compare();const confirm=f.dialogue.choices[0].action;confirm();confirm();
  assert.deepEqual(pokemonMoves(f.game.save.party[0]),['불꽃세례','울음소리']);
  assert.equal(f.writes,1);assert.equal(f.sounds,1);
  assert.deepEqual(parseSave(JSON.stringify(f.game.save))!.party[0].moves,['불꽃세례','울음소리']);
});

test('stale confirmations cannot change a replaced save, party member, moves or active battle',()=>{
  for(const change of [
    (g:Engine)=>{g.save=structuredClone(g.save);},
    (g:Engine)=>{g.save.party[0]={...g.save.party[0]};},
    (g:Engine)=>{g.save.party[0].moves=['할퀴기','불꽃세례'];},
    (g:Engine)=>{g.battle={} as NonNullable<Engine['battle']>;},
  ]){
    const f=fixture();f.compare();const confirm=f.dialogue.choices[0].action;
    change(f.game);const before=structuredClone(f.game.save);confirm();
    assert.deepEqual(f.game.save,before);assert.equal(f.writes,0);
  }
});

test('remembered moves show effects without offering a replacement',()=>{
  const f=fixture();showMoveSchool(f.game);f.choose('● 할퀴기');
  assert(f.dialogue.pages.includes(moveDescription('할퀴기')));
  assert.deepEqual(f.dialogue.choices.map(c=>c.label),['기술 목록으로']);
  assert.equal(f.writes,0);
});
