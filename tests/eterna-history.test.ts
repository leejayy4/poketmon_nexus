import test from 'node:test';
import assert from 'node:assert/strict';
import type { Engine } from '../src/engine';
import type { Choice } from '../src/types';
import { newSave,parseSave } from '../src/save';
import { grantPokemon } from '../src/pokemon';
import { TOUR_OUTDOORS,TOUR_SPAWNS } from '../src/explore-world';
import { handleEternaHistory } from '../src/eterna-history';
import { ETERNA_BORDER_NAME } from '../src/eterna-city-layout';

function fixture(){
  const save=newSave();assert(grantPokemon(save,1));assert(grantPokemon(save,25));save.flags.departureCleared=true;
  let pages:string[]=[],choices:Choice[]=[],after:(()=>void)|undefined;
  const g={save,battle:null,persist(){},audio:{play(){}},say(_s:string,p:string[],a?:()=>void,c:Choice[]=[]){pages=p;choices=c;after=a;}} as unknown as Engine;
  const move=(map:'tour_eterna'|'tour_eterna_hall')=>{g.save.map=map;g.save.player={...TOUR_SPAWNS[map],facing:'up'};};
  move('tour_eterna_hall');
  const f={g,move,get pages(){return pages;},get after(){return after;},choose(label:string){const c=choices.find(c=>c.label===label);assert(c,label);c.action();},finish(){const a=after;after=undefined;a?.();},open(){assert(handleEternaHistory(g,'tourExhibit1'));},select(){f.open();f.choose('답사 동료 고르기');f.choose('이상해씨');f.finish();},observe(name:string){move('tour_eterna');const event=TOUR_OUTDOORS.tour_eterna.objects.find(o=>o.name===name)!.event;assert(handleEternaHistory(g,event));}};
  return f;
}

test('Eterna survey requires both field observations, survives reload and never awards or changes party',()=>{
  const f=fixture(),before=structuredClone(f.g.save);f.select();f.choose('옛 지도와 비교');assert(f.pages.some(p=>p.includes('먼저 석상')));assert(!f.g.save.flags.eternaSurveyCompared);
  f.observe('오래된 석상');assert(!f.g.save.flags.eternaSurveyStatue);f.finish();assert.equal(f.g.save.flags.eternaSurveyStatue,true);
  f.observe(ETERNA_BORDER_NAME);f.finish();assert.equal(f.g.save.flags.eternaSurveyBorder,true);
  f.g.save=parseSave(JSON.stringify(f.g.save))!;assert(f.g.save);f.move('tour_eterna_hall');f.open();f.choose('옛 지도와 비교');f.choose('두 장소가 같은 건물');assert(!f.g.save.flags.eternaSurveyCompared);f.finish();f.choose('나중에 비교하기');assert(!f.g.save.flags.eternaSurveyCompared);
  f.choose('옛 지도와 비교');f.choose('자연을 남겨 둔 길');assert.equal(f.g.save.flags.eternaSurveyCompared,true);f.finish();f.choose('책상에서 일어나기');
  const restored=parseSave(JSON.stringify(f.g.save))!;assert(restored);assert.equal(restored.flags.eternaSurveyCompared,true);
  for(const key of ['party','inventory','money','badges','keyItems'] as const)assert.deepEqual(restored[key],before[key],key);
});

test('Eterna observation rejects stale party slots, fainted partners and replaced saves',()=>{
  const f=fixture();f.select();f.observe('오래된 석상');const pending=f.after!;
  f.g.save.party.reverse();pending();assert(!f.g.save.flags.eternaSurveyStatue);
  f.observe('오래된 석상');assert(f.pages.some(p=>p.includes('파티 편성이 바뀌어')));
  f.move('tour_eterna_hall');f.select();f.g.save.party[1].hp=0;f.observe('오래된 석상');assert(f.pages.some(p=>p.includes('지쳐 있다')));assert(!f.after);
  f.g.save.party[1].hp=f.g.save.party[1].maxHp;f.observe('오래된 석상');const stale=f.after!;f.g.save=structuredClone(f.g.save);stale();assert(!f.g.save.flags.eternaSurveyStatue);
  f.observe('오래된 석상');f.finish();f.move('tour_eterna_hall');f.select();assert.equal(f.g.save.flags.eternaSurveyStatue,true);
});
