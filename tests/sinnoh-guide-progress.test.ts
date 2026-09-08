import test from 'node:test';
import assert from 'node:assert/strict';
import {sinnohEvent} from '../src/sinnoh-story';
import {adventureObjective} from '../src/adventure-guide';
import {newSave} from '../src/save';
import {grantPokemon} from '../src/pokemon';
import {GYMS} from '../src/gyms';
import {MAPS} from '../src/maps';
import type {SaveData} from '../src/types';
import type {Engine} from '../src/engine';

function fixture(map:'tour_eterna'|'tour_hearthome',count:number,flags:SaveData['flags']={}){
  const save=newSave();grantPokemon(save,1);save.map=map;save.player={x:10,y:10,facing:'down'};save.flags={departureCleared:true,...flags};save.badges=GYMS.slice(0,count).map(g=>g.badge);save.keyItems=GYMS.slice(0,count).map(g=>g.tm);return save;
}
function read(save:SaveData){let pages:string[]=[];const before=structuredClone(save);const game={save,say(_name:string,text:string[]){pages=text;},persist(){assert.fail('guidance must not save');}} as unknown as Engine;assert(sinnohEvent(game,'sinnohGuide'));assert.deepEqual(save,before);return pages;}

test('existing city advice before the completed target and each three-second clue remain unchanged',()=>{
  for(const count of [0,1,2,3]){
    const eterna=read(fixture('tour_eterna',count)),hearthome=read(fixture('tour_hearthome',count));
    if(count<2)assert.match(eterna[0],/먼저 유채의 체육관/);
    if(count===2)assert.match(eterna[0],/연고의 멜리사에게 도전/);
    if(count<3)assert.match(hearthome[0],/멜리사의 체육관이 있는 연고/);
    if(count===3)assert.match(hearthome[0],/장막의 자두 체육관/);
    assert.equal(eterna[1],'얼마 전 시계가 3초 늦어졌어요.\n다른 도시에서도 같은 일이 있었대요.');
    assert.equal(hearthome[1],'역의 시계 기록도 3초가 어긋났대요.\n장막 연구원이 기록을 모으고 있어요.');
  }
});

test('Eterna after the third badge points to the next missing gym instead of replaying Fantina',()=>{
  const save=fixture('tour_eterna',3),pages=read(save);assert.match(pages[0],/코블배지에 도전/);assert.match(pages[0],/자두/);assert(!pages[0].includes('멜리사'));
  // Even malformed/noncontiguous in-memory badge lists must not skip an earlier missing gym.
  save.badges=save.badges.filter(b=>b!==GYMS[0].badge);const earlier=read(save);assert.match(earlier[0],/콜배지에 도전/);assert.match(earlier[0],/강석/);
});

test('both cities follow the existing research and ferry milestones without changing progress',()=>{
  for(const map of ['tour_eterna','tour_hearthome'] as const)for(const flags of [{},{observationCollected:true},{observationCollected:true,researchDelivered:true},{observationCollected:true,researchDelivered:true,ferryPass:true}]){
    const save=fixture(map,4,flags),goal=adventureObjective(save)!;
    const destination=MAPS[goal.map].name;
    const pages=read(save);assert.equal(pages[0],`${destination} · ${goal.title}\n${goal.id==='observation'?'관측 연구원을 만나 보세요.':goal.action}`);assert(!/멜리사에게 도전|자두 체육관으로/.test(pages[0]));assert(pages[1].includes('3초'));
    for(const page of pages){assert(page.split('\n').length<=2);for(const line of page.split('\n'))assert(line.length<=30,line);assert(!/tour_|researchGate|BADGE-|GS0/.test(page));}
  }
});

test('city guidance does not heal injured parties or replace the milestone with a recovery instruction',()=>{
  const save=fixture('tour_eterna',3);save.party[0].hp=1;const pages=read(save);assert.match(pages[0],/자두/);assert.equal(save.party[0].hp,1);
});
