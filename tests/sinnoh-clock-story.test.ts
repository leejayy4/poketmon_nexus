import test from 'node:test';
import assert from 'node:assert/strict';
import type { Engine } from '../src/engine';
import type { Choice, Dialogue, GameMap } from '../src/types';
import type { TourOutdoors } from '../src/explore-outdoors';
import { newSave } from '../src/save';
import { installJubilifeClock,JUBILIFE_CLOCK,SINNOH_CLOCK_FLAGS } from '../src/sinnoh-clock-state';
import { cancelSinnohClock,handleSinnohClock,sinnohClockView,updateSinnohClock,watchingSinnohClock } from '../src/sinnoh-clock-story';

// Dormant until QA resumes. This harness never creates Engine or accesses browser storage.
function game(){
  let writes=0;
  const save=newSave();
  save.map='tour_jubilife';save.player={x:17,y:19,facing:'left'};
  const stub={
    save,clock:0,panel:'field',battle:null,move:null,transition:0,dialogue:null as Dialogue|null,
    clearInput(){},persist(){writes++;return true;},
    say(speaker:string,pages:string[],after?:()=>void,choices?:Choice[]){
      this.dialogue={speaker,pages,page:0,shown:0,selected:0,after,choices};
    },
  };
  return {g:stub as unknown as Engine,writes:()=>writes};
}

function start(g:Engine){
  assert(handleSinnohClock(g,JUBILIFE_CLOCK.event));
  const action=g.dialogue!.choices![0].action;
  g.dialogue=null; // Engine.confirm clears a selected dialogue before dispatching its choice.
  action();
  assert(watchingSinnohClock(g));
}

test('Jubilife observation records only a completed scene and completion persists once',()=>{
  const {g,writes}=game();start(g);
  updateSinnohClock(g,4);
  assert.equal(g.save.flags[SINNOH_CLOCK_FLAGS.observed],undefined);
  assert.equal(writes(),0);
  assert.equal(sinnohClockView(g)?.elapsed,4);
  updateSinnohClock(g,.31);
  assert.equal(g.save.flags[SINNOH_CLOCK_FLAGS.observed],true);
  assert.equal(watchingSinnohClock(g),false);
  assert.equal(sinnohClockView(g),null);
  assert.equal(writes(),1);
  updateSinnohClock(g,10);
  assert.equal(writes(),1);
  assert(g.dialogue!.pages.some(page=>page.includes('분수는 계속 흐르고')));
});

test('cancelling a partial observation leaves no evidence and allows a fresh attempt',()=>{
  const {g,writes}=game();start(g);updateSinnohClock(g,2);
  cancelSinnohClock(g);updateSinnohClock(g,10);
  assert.equal(watchingSinnohClock(g),false);
  assert.equal(g.save.flags[SINNOH_CLOCK_FLAGS.observed],undefined);
  assert.equal(writes(),0);
  start(g);assert.equal(sinnohClockView(g)?.elapsed,0);updateSinnohClock(g,4.31);
  assert.equal(g.save.flags[SINNOH_CLOCK_FLAGS.observed],true);
  assert.equal(writes(),1);
});

test('save, map, movement, dialogue and field-context changes cannot finish an old observation',()=>{
  const changes:[string,(g:Engine)=>void][]=[
    ['save',g=>{g.save=structuredClone(g.save);}],
    ['map',g=>{g.save.map='tour_sandgem';}],
    ['position',g=>{g.save.player.x++;}],
    ['movement',g=>{g.move={from:{x:17,y:19},to:{x:17,y:20},elapsed:0,duration:.16};}],
    ['dialogue',g=>{g.say('다른 대화',['이미 다른 장면이다.']);}],
    ['panel',g=>{g.panel='menu';}],
    ['battle',g=>{g.battle={} as NonNullable<Engine['battle']>;}],
    ['transition',g=>{g.transition=.4;}],
  ];
  for(const [name,change] of changes){
    const {g,writes}=game();start(g);const original=g.save;
    updateSinnohClock(g,2);change(g);updateSinnohClock(g,10);
    assert.equal(watchingSinnohClock(g),false,name);
    assert.equal(original.flags[SINNOH_CLOCK_FLAGS.observed],undefined,name);
    assert.equal(g.save.flags[SINNOH_CLOCK_FLAGS.observed],undefined,name);
    assert.equal(writes(),0,name);
  }
});

test('an observation choice from a replaced dialogue or save cannot start a later scene',()=>{
  for(const replaceSave of [false,true]){
    const {g,writes}=game();handleSinnohClock(g,JUBILIFE_CLOCK.event);
    const action=g.dialogue!.choices![0].action;
    if(replaceSave)g.save=structuredClone(g.save);
    else g.say('다른 대화',['시계 선택지는 끝났다.']);
    updateSinnohClock(g,.05);g.dialogue=null;action();updateSinnohClock(g,10);
    assert.equal(watchingSinnohClock(g),false);
    assert.equal(g.save.flags[SINNOH_CLOCK_FLAGS.observed],undefined);
    assert.equal(writes(),0);
  }
});

test('clock installation is idempotent and preserves the other fountain interaction cells and collision',()=>{
  const cells=[{x:14,y:19},{x:15,y:19},{x:16,y:19},{x:14,y:20},{x:15,y:20},{x:16,y:20}];
  const walkable=Array.from({length:24},()=>'.'.repeat(24));
  walkable[19]=walkable[19].slice(0,16)+'#'+walkable[19].slice(17);
  const map:GameMap={id:'tour_jubilife',name:'축복시티',width:24,height:24,background:'tour_jubilife',walkable,warps:[],npcs:[],props:cells.map(cell=>({...cell,dialogue:'jubilifePlazaLearning'}))};
  const outdoors:TourOutdoors={objects:[{name:'교류 광장 분수',event:'jubilifePlazaLearning',pages:['분수'],cells}],signs:[]};
  const originalCollision=[...map.walkable];
  installJubilifeClock(map,outdoors);
  const once=structuredClone({map,outdoors});
  installJubilifeClock(map,outdoors);
  assert.deepEqual({map,outdoors},once);
  assert.deepEqual(map.walkable,originalCollision);
  assert.equal(map.props.filter(prop=>prop.dialogue===JUBILIFE_CLOCK.event).length,1);
  assert.equal(outdoors.objects.filter(object=>object.event===JUBILIFE_CLOCK.event).length,1);
  assert.equal(outdoors.objects.find(object=>object.event==='jubilifePlazaLearning')!.cells.length,5);
});
