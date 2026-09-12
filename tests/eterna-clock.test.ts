import test from 'node:test';
import assert from 'node:assert/strict';
import { Engine,VECTOR } from '../src/engine';
import { getMap,getWorldOutdoors,canStand } from '../src/maps';
import { newSave } from '../src/save';
import { ETERNA_CLOCK,ETERNA_CLOCK_PAGES } from '../src/eterna-clock-art';

test('Eterna clock owns one reachable investigation surface, not the wall survey event',t=>{
  const map=getMap('tour_eterna'),outdoors=getWorldOutdoors(map)!,{x,y,event}=ETERNA_CLOCK;
  const owners=outdoors.objects.filter(o=>o.cells.some(c=>c.x===x&&c.y===y));
  assert.equal(owners.length,1);assert.equal(owners[0].event,event);
  assert.equal(map.props.filter(p=>p.x===x&&p.y===y).length,1);
  assert.equal(map.props.find(p=>p.x===x&&p.y===y)!.dialogue,event);assert(!canStand(map,x,y));
  const g=new Engine();g.save=newSave();g.save.map=map.id;g.save.player={x,y:y+1,facing:'up'};
  t.mock.method(g,'announce',()=>{});
  assert(canStand(map,x,y+1));assert.equal(g.interactionHint,'Z 조사 · 시계 관측 기록판');
  const before=structuredClone(g.save);g.confirm();assert.equal(g.dialogue?.speaker,owners[0].name);assert.deepEqual(g.dialogue?.pages,ETERNA_CLOCK_PAGES);assert.deepEqual(g.save,before);
  g.dialogue=null;g.save.flags.researchDelivered=true;g.confirm();assert(g.dialogue?.pages.some(p=>p.includes('이미 끝낸 전달')));assert(!g.save.flags.eternaSurveyBorder);
  // Other wall faces remain available for the museum survey.
  const wall=outdoors.objects.find(o=>o.name==='숲 경계의 옛 돌담')!;
  assert(wall.cells.some(c=>Object.values(VECTOR).some(v=>canStand(map,c.x+v.x,c.y+v.y))));
  for(const c of wall.cells)assert.equal(map.props.find(p=>p.x===c.x&&p.y===c.y)?.dialogue,wall.event);
});
