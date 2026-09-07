import test from 'node:test';
import assert from 'node:assert/strict';
import {Engine} from '../src/engine';
import {newSave} from '../src/save';
import {grantPokemon} from '../src/pokemon';
function game(){const g=new Engine();g.save=newSave();grantPokemon(g.save,4);g.save.flags.departureCleared=true;g.save.map='oreburgh_gym';g.persist=()=>true;g.announce=()=>{};return g;}
function choose(g:Engine,label:string){const choice=g.dialogue!.choices!.find(c=>c.label===label)!;assert(choice);g.dialogue=null;choice.action();}
test('gym coach connects optional advice to party without granting progress',()=>{
 const g=game(),before=structuredClone(g.save);g.event('gymGuide');choose(g,'내 파티 준비 상담');assert.equal(g.dialogue!.speaker,'체육관 안내원');choose(g,'포켓몬 확인');assert.equal(g.panel,'party');assert.deepEqual(g.save,before);assert.equal(g.battle,null);
});
test('leaving or replacing a save invalidates a pending coach shortcut',()=>{
 const g=game();g.event('gymGuide');const c=g.dialogue!.choices![0];g.dialogue=null;g.save=structuredClone(g.save);c.action();assert.equal(g.dialogue,null);assert.equal(g.panel,'field');
});
test('west road sign uses actual rare encounter and preserves safe-path directions',()=>{
 const g=game();g.save.map='route_s01';const before=structuredClone(g.save);g.event('routeSign');assert.match(g.dialogue!.pages.join(''),/꼬몽울/);assert.match(g.dialogue!.pages.join(''),/흙길/);assert.deepEqual(g.save,before);
});
