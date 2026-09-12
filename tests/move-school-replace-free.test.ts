import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import type { Engine } from '../src/engine';
import type { Choice } from '../src/types';
import { parseSave } from '../src/save';
import { showMoveSchool } from '../src/move-school';

function fixture(){
  const save=parseSave(readFileSync('tests/viridian-journey-final-save.json','utf8'))!;
  let choices:Choice[]=[],writes=0;
  const g={save,partyIndex:3,battle:null,audio:{play(){}},persist(){writes++;},
    say(_s:string,_p:string[],_a:unknown,c:Choice[]=[]){choices=c;this.dialogue={selected:0};},
  } as unknown as Engine;
  return {g,get choices(){return choices;},get writes(){return writes;},choose(label:string){const c=choices.find(c=>c.label===label);assert(c,label);c.action();}};
}

test('two-move Kakuna may replace Struggle without filling empty slots; stale add cannot run',()=>{
  const f=fixture();showMoveSchool(f.g,0,'독침');f.choose('독침');
  const staleAdd=f.choices[0];f.choose('기존 기술과 비교');f.choose('발버둥과 비교');
  assert.deepEqual(f.g.save.party[3].moves,['발버둥','단단해지기']);
  f.choose('바꿔서 배운다');staleAdd.action();
  assert.deepEqual(f.g.save.party[3].moves,['독침','단단해지기']);assert.equal(f.writes,1);
  assert.deepEqual(parseSave(JSON.stringify(f.g.save))?.party[3],f.g.save.party[3]);
});

test('replacement comparison can be cancelled without learning or writing; ordinary add remains available',()=>{
  const f=fixture(),before=structuredClone(f.g.save);showMoveSchool(f.g,0,'독침');f.choose('독침');
  f.choose('기존 기술과 비교');f.choose('발버둥과 비교');f.choose('기술 목록으로');
  assert.deepEqual(f.g.save,before);assert.equal(f.writes,0);
  showMoveSchool(f.g,0,'독침');f.choose('독침');f.choose('빈 자리에 배운다');
  assert.deepEqual(f.g.save.party[3].moves,['발버둥','단단해지기','독침']);assert.equal(f.writes,1);
});
