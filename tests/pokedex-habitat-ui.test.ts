import test from 'node:test';
import assert from 'node:assert/strict';
import type { Engine } from '../src/engine';
import type { Choice } from '../src/types';
import { newSave } from '../src/save';
import { grantPokemon } from '../src/pokemon';
import { showPokedex } from '../src/journey-services';

function fixture(){
  const save=newSave();grantPokemon(save,7);save.pokedex={seen:[7,74],caught:[7]};
  let dialogue:{pages:string[];choices:Choice[];after?:()=>void}={pages:[],choices:[]};
  const g={save,battle:null,say(_speaker:string,pages:string[],after?:()=>void,choices:Choice[]=[]){dialogue={pages,choices,after};}} as unknown as Engine;
  return {g,get dialogue(){return dialogue;},choose(label:string){const c=dialogue.choices.find(c=>c.label===label);assert(c);c.action();}};
}
test('seen-only species shows actual habitats without granting capture or changing progress',()=>{
  const f=fixture(),before=structuredClone(f.g.save);showPokedex(f.g);f.choose('○ 꼬마돌');
  assert(f.dialogue.pages[0].includes('발견한 포켓몬'));
  assert(f.dialogue.pages.some(p=>p.includes('축복–무쇠 암반굴')));
  for(const p of f.dialogue.pages.slice(2)){assert(p.split('\n').length<=3);assert(p.split('\n').every(l=>l.length<=24));}
  f.dialogue.after!();assert(f.dialogue.choices.some(c=>c.label==='○ 꼬마돌'));
  assert(!f.dialogue.choices.some(c=>c.label.includes('알통몬')));
  assert.deepEqual(f.g.save,before);
});
test('gift partner without a wild pool does not invent a habitat',()=>{
  const f=fixture();showPokedex(f.g);f.choose('● 꼬부기');
  assert.equal(f.dialogue.pages.at(-1),'야생 서식지 정보가 없다.');
});
test('old detail action cannot open against a different save or an active battle',()=>{
  for(const battle of [false,true]){const f=fixture();showPokedex(f.g);const choice=f.dialogue.choices[1];const before=f.dialogue;
    if(battle)f.g.battle={} as NonNullable<Engine['battle']>;else f.g.save=newSave();
    choice.action();assert.equal(f.dialogue,before);
  }
});
