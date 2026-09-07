import test from 'node:test';
import assert from 'node:assert/strict';
import type { Engine } from '../src/engine';
import type { Choice } from '../src/types';
import { grantPokemon } from '../src/pokemon';
import { newSave } from '../src/save';
import { showMoveSchool } from '../src/move-school';

function fixture(level=16){
  const save=newSave();grantPokemon(save,4);
  const p=save.party[0];p.level=level;
  const dialogue:{pages:string[];choices:Choice[];selected:number}={pages:[],choices:[],selected:0};
  const game={save,partyIndex:0,battle:null,
    say(_speaker:string,pages:string[],_after?:()=>void,choices:Choice[]=[]){dialogue.pages=pages;dialogue.choices=choices;dialogue.selected=0;(game as unknown as Engine).dialogue=dialogue;},
  } as unknown as Engine;
  return {game,dialogue};
}

test('preferred new move opens its page and selects its item',()=>{
  const f=fixture();
  showMoveSchool(f.game,0,'용의분노');
  assert.match(f.dialogue.pages[0],/2\/2쪽/);
  assert.equal(f.dialogue.selected,0);
  assert.equal(f.dialogue.choices[0].label,'용의분노');
  assert(!f.dialogue.choices.some(c=>c.label.includes('★')));
});

test('preferred move on the first page selects its third item',()=>{
  const f=fixture();
  showMoveSchool(f.game,1,'불꽃세례');
  assert.match(f.dialogue.pages[0],/1\/2쪽/);
  assert.equal(f.dialogue.selected,2);
  assert.equal(f.dialogue.choices[2].label,'불꽃세례');
});

test('missing or remembered preferred moves keep ordinary page and cursor behavior',()=>{
  const f=fixture();
  showMoveSchool(f.game,1,'없는기술');
  assert.match(f.dialogue.pages[0],/2\/2쪽/);
  assert.equal(f.dialogue.selected,0);
  showMoveSchool(f.game,1,'할퀴기');
  assert.match(f.dialogue.pages[0],/2\/2쪽/);
  assert.equal(f.dialogue.selected,0);
});
