import test from 'node:test';
import assert from 'node:assert/strict';
import { Engine } from '../src/engine';
import { newSave } from '../src/save';
import { grantPokemon } from '../src/pokemon';

function ui(run:()=>void){const previous=Object.getOwnPropertyDescriptor(globalThis,'document');Object.defineProperty(globalThis,'document',{configurable:true,value:{getElementById:()=>null}});try{run()}finally{if(previous)Object.defineProperty(globalThis,'document',previous);else Reflect.deleteProperty(globalThis,'document')}}
function game(){const g=new Engine();g.save=newSave();return g;}
function settle(g:Engine){for(let i=0;i<20;i++)g.update(.04);}
function finish(g:Engine){for(let i=0;g.dialogue&&i<80;i++)g.confirm();assert.equal(g.dialogue,null);}

test('walking toward an NPC accepts one early confirm at the destination',()=>ui(()=>{
  const g=game();g.save.map='lab';g.save.player={x:9,y:6,facing:'up'};
  g.press('ArrowUp');g.release('ArrowUp');g.press('z');g.press('z');
  assert.equal(g.dialogue,null);settle(g);
  assert.deepEqual(g.save.player,{x:9,y:5,facing:'up'});
  assert.equal(g.dialogue?.speaker,'연구원');assert.equal(g.save.flags.assistantTalks,1);assert.equal(g.save.steps,1);
}));

test('an early investigation runs once after the step, without skipping its first page',()=>ui(()=>{
  const g=game();g.save.player={x:6,y:5,facing:'up'};
  g.press('ArrowUp');g.release('ArrowUp');g.press('z');g.press('Enter');settle(g);
  assert(g.dialogue);assert.equal(g.dialogue.page,0);assert.equal(g.save.player.y,4);assert.equal(g.save.steps,1);
}));

test('menu and map requests stop a held walk at the next tile',()=>{
  for(const key of ['x','Escape','m']){
    const g=game();g.press('ArrowRight');g.press(key);g.press('ArrowRight',true);settle(g);
    assert.equal(g.save.steps,1);assert.equal(g.save.player.x,7);assert.equal(g.move,null);
    assert.equal(g.panel,key==='m'?'field':'menu');assert.equal(g.fieldMap,key==='m');
  }
});

test('the first buffered action wins and is consumed only once',()=>{
  const g=game();g.press('ArrowRight');g.release('ArrowRight');g.press('x');g.press('m');settle(g);
  assert.equal(g.panel,'menu');assert.equal(g.fieldMap,false);g.cancel();settle(g);assert.equal(g.panel,'field');
});

test('dialogue choice direction never becomes walking after confirm or OS repeat',()=>ui(()=>{
  const g=game();g.say('', ['선택'],undefined,[{label:'예',action:()=>{}},{label:'취소',action:()=>{}}]);
  g.confirm();g.press('ArrowRight');g.confirm();g.press('ArrowRight',true);settle(g);
  assert.equal(g.save.steps,0);assert.equal(g.save.player.x,6);
  g.release('ArrowRight');g.press('ArrowRight');g.release('ArrowRight');settle(g);assert.equal(g.save.steps,1);
}));

test('menu navigation cannot leak when returning to the field with confirm',()=>{
  const g=game();g.press('x');g.press('ArrowUp');assert.equal(g.menuIndex,5);g.confirm();g.press('ArrowUp',true);settle(g);
  assert.equal(g.panel,'field');assert.equal(g.save.steps,0);
});

test('door transition discards the queued action and keys pressed during the fade',()=>{
  const g=game();g.save.player={x:8,y:5,facing:'up'};g.press('ArrowUp');g.release('ArrowUp');g.press('x');
  for(let i=0;i<4;i++)g.update(.04);assert(g.transition>0);g.press('ArrowDown');settle(g);
  assert.equal(g.save.map,'home');assert.equal(g.panel,'field');assert.equal(g.save.steps,1);assert.equal(g.dialogue,null);
});

test('a grass encounter consumes the queued confirm without advancing battle dialogue',()=>ui(()=>{
  const g=game();grantPokemon(g.save,7);g.save.flags.departureCleared=true;g.save.map='route_s01';g.save.player={x:17,y:6,facing:'right'};g.grassSteps=5;
  g.press('ArrowRight');g.release('ArrowRight');g.press('z');settle(g);assert(g.battle);assert(g.dialogue);assert.equal(g.dialogue.page,0);
  finish(g);assert.equal(g.battle.menu,'actions');assert.equal(g.save.steps,1);
}));

test('blur-style input clearing and save restore discard pending field actions',()=>{
  for(const reset of [(g:Engine)=>g.clearInput(),(g:Engine)=>g.restore(newSave())]){
    const g=game();g.press('ArrowRight');g.press('x');reset(g);g.press('ArrowRight',true);settle(g);
    assert.equal(g.panel,'field');assert.equal(g.move,null);assert(g.save.steps<=1);
  }
});

test('touch menu callbacks use the same buffer and ordinary held walking still works',()=>{
  const g=game();g.press('ArrowRight');g.cancel();settle(g);assert.equal(g.panel,'menu');assert.equal(g.save.steps,1);
  g.cancel();g.press('ArrowLeft');for(let i=0;i<8;i++)g.update(.04);g.release('ArrowLeft');settle(g);
  assert.equal(g.save.steps,4);assert.equal(g.save.player.x,4);
});

test('blocked facing still allows immediate investigation without walking',()=>ui(()=>{
  const g=game();g.save.player={x:6,y:4,facing:'down'};g.press('ArrowUp');g.release('ArrowUp');g.press('z');
  assert(g.dialogue);assert.equal(g.save.steps,0);assert.equal(g.move,null);
}));
