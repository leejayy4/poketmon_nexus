import test from 'node:test';
import assert from 'node:assert/strict';
import { Engine } from '../src/engine';
import { getMap } from '../src/maps';
import { journeyConnection } from '../src/journey-world';
import { grantPokemon } from '../src/pokemon';
import { newSave } from '../src/save';
import { TEXT } from '../src/dialogues';
import { handleRoadTrainer, trainerWinFlag } from '../src/road-trainers';

function game(){
  const g=new Engine();
  g.save=newSave();
  grantPokemon(g.save,4);
  g.save.flags.departureCleared=true;
  g.save.map='route_s01';
  return g;
}

function dom(run:()=>void){
  const previous=globalThis.document;
  globalThis.document={getElementById:()=>null} as unknown as Document;
  try{run()}finally{globalThis.document=previous;}
}

function actualGuidance(){
  const route=journeyConnection(getMap('route_s01',{departureCleared:true}),'tour_jubilife');
  const city=journeyConnection(getMap('tour_jubilife',{departureCleared:true}),'tour_oreburgh');
  const names={up:'북쪽',right:'동쪽',down:'남쪽',left:'서쪽'} as Record<string,string>;
  return {route:names[route!.entry],city:names[city!.entry]};
}

function assertNoOverflow(pages:string[]){
  for(const page of pages)assert(page.split('\n').length<=3,`dialogue page overflow: ${page}`);
}

test('roadworker static dialogue follows the real integrated route',()=>{
  const d=TEXT.roadworker.pages.join('\n');
  const expected=actualGuidance();
  assert.match(d,new RegExp(expected.route+' 출구'));
  assert.match(d,new RegExp(expected.city+' 출구'));
  assert.match(d,/축복시티/);
  assert.match(d,/암반굴/);
  assert.match(d,/무쇠시티/);
  assert.match(d,/축복시티의 남쪽 출구에서/);
  assert.doesNotMatch(d,/북쪽 연결길/);
  assertNoOverflow(TEXT.roadworker.pages);
});

test('roadworker battle proposal gives one or two pages of correct route guidance',()=>dom(()=>{
  const g=game();
  assert.equal(handleRoadTrainer(g,'roadworker'),true);
  assert(g.dialogue);
  const pages=g.dialogue!.pages.join('\n');
  const expected=actualGuidance();
  assert.match(pages,new RegExp(expected.route+' 출구'));
  assert.match(pages,new RegExp(expected.city+' 출구'));
  assert.match(pages,/축복시티/);
  assert.match(pages,/축복시티의 남쪽 출구에서/);
  assert.match(pages,/무쇠시티/);
  assertNoOverflow(g.dialogue!.pages);
}));

test('roadworker help and post-victory guidance keep the real route',()=>dom(()=>{
  const expected=actualGuidance();
  const g=game();
  handleRoadTrainer(g,'roadworker');
  const help=g.dialogue!.choices!.find(c=>c.label==='도움말을 듣는다')!;
  g.dialogue=null;help.action();
  assert.match(g.dialogue!.pages.join('\n'),new RegExp(expected.route+' 출구'));
  assert.match(g.dialogue!.pages.join('\n'),new RegExp(expected.city+' 출구'));
  assert.match(g.dialogue!.pages.join('\n'),/축복시티의 남쪽 출구에서/);
  assertNoOverflow(g.dialogue!.pages);

  g.dialogue=null;
  g.save.flags[trainerWinFlag('west-road-practice')]=true;
  handleRoadTrainer(g,'roadworker');
  assert.match(g.dialogue!.pages.join('\n'),new RegExp(expected.route+' 출구'));
  assert.match(g.dialogue!.pages.join('\n'),new RegExp(expected.city+' 출구'));
  assert.match(g.dialogue!.pages.join('\n'),/축복시티의 남쪽 출구에서/);
  assertNoOverflow(g.dialogue!.pages);
}));
