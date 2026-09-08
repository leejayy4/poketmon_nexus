import test from 'node:test';
import assert from 'node:assert/strict';
import { adventureGuide,adventureObjective } from '../src/adventure-guide';
import { newSave,parseSave } from '../src/save';
import { grantPokemon } from '../src/pokemon';
import { GYMS } from '../src/gyms';
import { Engine } from '../src/engine';

function dom(run:()=>void){const old=Object.getOwnPropertyDescriptor(globalThis,'document');Object.defineProperty(globalThis,'document',{value:{getElementById:()=>null},configurable:true});try{run();}finally{if(old)Object.defineProperty(globalThis,'document',old);else Reflect.deleteProperty(globalThis,'document');}}
function finish(g:Engine){for(let i=0;i<30&&g.dialogue;i++)g.confirm();assert(!g.dialogue);}

test('normal starter and Pikachu-first progression both guide departure without inventing capture requirements',()=>{
  for(const species of [7,25]){
    const s=newSave();assert.equal(adventureObjective(s)!.id,'partner');grantPokemon(s,species);
    assert.equal(adventureObjective(s)!.id,'departure');s.flags.departureCleared=true;
    assert.equal(adventureObjective(s)!.id,'roark');assert(!s.party.some(p=>p.species===399));
  }
});

test('each existing badge and research flag selects its implemented next objective without mutating saves',()=>{
  const s=newSave();grantPokemon(s,7);s.flags.departureCleared=true;
  for(const gym of GYMS){assert.equal(adventureObjective(s)!.id,gym.id);s.badges.push(gym.badge);s.keyItems.push(gym.tm);}
  assert.equal(adventureObjective(s)!.id,'observation');s.flags.observationCollected=true;
  assert.equal(adventureObjective(s)!.id,'research');s.flags.researchDelivered=true;
  assert.equal(adventureObjective(s)!.id,'ferry');s.flags.ferryPass=true;s.map='tour_vermilion';s.player={x:12,y:15,facing:'down'};
  assert.equal(adventureObjective(s)!.id,'explore');const before=structuredClone(s);adventureGuide(s);assert.deepEqual(s,before);
  const restored=parseSave(JSON.stringify(s));assert(restored);assert.deepEqual(adventureGuide(restored),adventureGuide(s));
});

test('gym objective particles match each leader while preserving progress and the next missing badge',()=>{
  const s=newSave();grantPokemon(s,7);s.flags.departureCleared=true;
  for(const [i,name] of ['강석과','유채와','멜리사와','자두와'].entries()){
    const before=structuredClone(s),objective=adventureObjective(s)!;
    assert.equal(objective.action,`관장 ${name} 이야기하자`);assert.equal(objective.id,GYMS[i].id);assert.deepEqual(s,before);s.badges.push(GYMS[i].badge);
  }
  s.badges=['BADGE-GS01','BADGE-GS03'];assert.equal(adventureObjective(s)!.action,'관장 유채와 이야기하자');
});

test('guidance follows real interior exits and connecting maps; on arrival it names the interaction',()=>{
  const s=newSave();assert.equal(adventureGuide(s)!.lines[1],'다음 구역: 우리 집 · 1층');
  s.map='home';assert.equal(adventureGuide(s)!.lines[1],'다음 구역: 새잎마을');
  s.map='lab';assert.match(adventureGuide(s)!.lines[1],/은솔박사/);
  grantPokemon(s,7);s.flags.departureCleared=true;s.map='route_s01';assert.equal(adventureGuide(s)!.lines[1],'다음 구역: 축복시티');
  s.map='jubilife_center';assert.equal(adventureGuide(s)!.lines[1],'다음 구역: 축복시티');
  s.map='oreburgh_gym';assert.match(adventureGuide(s)!.lines[1],/강석/);
  s.badges=GYMS.map(g=>g.badge);s.keyItems=GYMS.map(g=>g.tm);s.flags.observationCollected=true;s.flags.researchDelivered=true;s.map='jubilife';
  assert.equal(adventureGuide(s)!.lines[1],'다음 구역: 서부 연구 연결길');
  s.flags.exploration=true;assert.equal(adventureGuide(s)!.objective.id,'ferry');
});

test('research guidance updates only when the existing delivery dialogue actually completes',()=>dom(()=>{
  const g=new Engine();g.exploring=false;g.save=newSave();grantPokemon(g.save,7);g.save.flags.departureCleared=true;g.save.badges=GYMS.map(x=>x.badge);g.save.keyItems=GYMS.map(x=>x.tm);g.save.flags.observationCollected=true;
  g.event('researchGate');assert.equal(adventureObjective(g.save)!.id,'research');finish(g);assert.equal(adventureObjective(g.save)!.id,'ferry');
}));

test('adventure interaction hints require a faced NPC or prop and disappear while busy',()=>dom(()=>{
  const g=new Engine();g.exploring=false;g.save=newSave();g.save.map='home';g.save.player={x:4,y:5,facing:'up'};
  assert.equal(g.interactionHint,'Z 말걸기 · 엄마');g.save.player.facing='down';assert.equal(g.interactionHint,null);
  g.save.player={x:6,y:5,facing:'up'};assert.equal(g.interactionHint,'Z 조사하기');
  g.panel='menu';assert.equal(g.interactionHint,null);g.panel='field';g.say('검사',['대화']);assert.equal(g.interactionHint,null);finish(g);
  g.move={from:{x:6,y:5},to:{x:6,y:6},elapsed:0,duration:.16};assert.equal(g.interactionHint,null);
}));
