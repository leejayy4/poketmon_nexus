import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import type { Engine } from '../src/engine';
import type { Choice } from '../src/types';
import { parseSave } from '../src/save';
import { battleTurn } from '../src/battle';
import { createPracticeBattle, startPalletSparring } from '../src/pallet-sparring';

const source=()=>parseSave(readFileSync('tests/pallet-ready-copy-save.json','utf8'))!;

test('practice uses detached healthy copies and preserves defense changes across real battle turns',()=>{
  const s=source();s.party[3].hp=1;const before=structuredClone(s),trial=createPracticeBattle(s,3,5)!;
  assert.equal(trial.save.party[0].hp,75);assert.equal(trial.save.party.length,1);
  battleTurn(trial.save,trial.battle,'move1',()=>0.9);
  assert.equal(trial.battle.playerDefense?.[0],1);
  const hp=trial.save.party[0].hp;assert(hp<75);
  battleTurn(trial.save,trial.battle,'move0',()=>0.9);
  assert.equal(trial.battle.playerDefense?.[0],1);assert(trial.save.party[0].hp<hp);
  assert(trial.battle.enemy.hp<trial.battle.enemy.maxHp);assert.deepEqual(s,before);
  assert.equal(createPracticeBattle(s,0,0),null);assert.equal(createPracticeBattle(s,0,6),null);
});

test('practice victory grants neither growth nor money even to simulation copies; loss stays local',()=>{
  const s=source(),before=structuredClone(s),trial=createPracticeBattle(s,0,3)!;
  trial.battle.enemy.hp=1;const xp=trial.save.party[0].experience;
  const win=battleTurn(trial.save,trial.battle,'move0');assert.equal(win.outcome,'won');
  assert(!win.frames?.some(f=>f.growth));assert.equal(trial.save.party[0].experience,xp);assert.equal(trial.save.money,s.money);
  const loss=createPracticeBattle(s,3,5)!;loss.save.party[0].hp=1;
  assert.equal(battleTurn(loss.save,loss.battle,'move1').outcome,'lost');assert.deepEqual(s,before);
});

test('dialogue trial supports repeated turns, restart and cancellation while rejecting replayed actions',()=>{
  const save=source(),before=structuredClone(save);let choices:Choice[]=[],pages:string[]=[],after:(()=>void)|undefined,valid=true;
  const g={save,say(_s:string,p:string[],a?:()=>void,c:Choice[]=[]){pages=p;after=a;choices=c;}} as unknown as Engine;
  startPalletSparring(g,0,3,()=>valid,()=>{});
  const first=choices[0];first.action();const result=pages;first.action();assert.equal(pages,result);
  for(let turn=0;turn<10&&!choices.some(c=>c.label==='같은 동료로 다시');turn++){after?.();choices[0].action();}
  assert(choices.some(c=>c.label==='같은 동료로 다시'));assert(!pages.some(p=>p.includes('상금')||p.includes('경험치를')));
  choices[0].action();assert(pages[0].includes('HP 87/87'));
  const stale=choices[0];valid=false;stale.action();assert.deepEqual(save,before);
});
