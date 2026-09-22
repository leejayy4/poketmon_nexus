import test from 'node:test';
import assert from 'node:assert/strict';
import { Engine } from '../src/engine';
import type { Choice, Dialogue, MapId, SaveData } from '../src/types';
import { inspectSave, newNexusSave, newSave } from '../src/save';
import { SaveSession } from '../src/save-session';
import { grantPokemon } from '../src/pokemon';
import { NEXUS_STARTERS, starterSpeciesFor } from '../src/nexus-starters';
import { NEXUS_OPENING as F } from '../src/nexus-opening-state';
import { completeNexusProfile, updateNexusOpening, arriveNexusOpening, deferNexusProfile } from '../src/nexus-opening';
import { handleFirstJourneyEvent } from '../src/first-journey-events';
import { sayField } from '../src/field-scene';
import { getMap } from '../src/maps';

// Dormant contracts for QA resumption. No actual browser storage is used.
function fixture(save=newNexusSave()){
  let writes=0;
  const stub={save,panel:'field',sceneRevision:0,dialogue:null as Dialogue|null,
    move:null,battle:null,transition:0,starterIndex:0,
    get map(){return getMap(this.save.map,this.save.flags);},
    get locked(){return !!this.dialogue||this.panel!=='field';},
    get starterChoices(){return starterSpeciesFor(this.save);},
    clearInput(){},audio:{play(){}},
    persist(){assert.equal(inspectSave(JSON.stringify(this.save)).kind,'ready');writes++;return true;},
    say(speaker:string,pages:string[],after?:()=>void,choices?:Choice[]){
      this.sceneRevision++;this.dialogue={speaker,pages,page:0,shown:0,selected:0,after,choices};
    },
    receive(species:number){Engine.prototype.receive.call(this as unknown as Engine,species);},
  };
  return {game:stub as unknown as Engine,writes:()=>writes};
}
function finish(g:Engine){const d=g.dialogue;assert(d);assert(!d.choices);g.dialogue=null;d.after?.();}
function drain(g:Engine){for(let i=0;g.dialogue&&!g.dialogue.choices&&i<12;i++)finish(g);}
function choose(g:Engine,index:number){const choice=g.dialogue?.choices?.[index];assert(choice);g.dialogue=null;choice.action();}
function place(g:Engine,map:MapId,x:number,y:number){g.save.map=map;g.save.player={x,y,facing:'up'};}
function prepare(g:Engine){
  assert(updateNexusOpening(g));assert.equal(g.panel,'profile');
  assert(completeNexusProfile(g,{name:'다온',appearance:'coral'}));
  assert(updateNexusOpening(g));finish(g);
  place(g,'home',4,5);assert(handleFirstJourneyEvent(g,'mom'));choose(g,2);drain(g);
  place(g,'lab',6,5);assert(handleFirstJourneyEvent(g,'professor'));drain(g);
  assert.equal(g.panel,'starters');
}

test('all three new partners progress through the introduction and serialize each durable step',()=>{
  for(const [index,species] of NEXUS_STARTERS.entries()){
    const {game:g}=fixture();prepare(g);
    assert.equal(g.save.flags[F.reply],3,'every postcard response can progress');
    g.starterIndex=index;Engine.prototype.chooseStarter.call(g);
    choose(g,0);drain(g);
    assert.equal(g.save.party[0].species,species);
    assert.equal(g.save.flags[F.outside],undefined);
    place(g,'town',10,10);arriveNexusOpening(g,'lab');g.persist();drain(g);
    assert.equal(g.save.flags[F.outside],true);
    const restored=inspectSave(JSON.stringify(g.save));assert.equal(restored.kind,'ready');
    if(restored.kind==='ready'){
      assert.deepEqual(restored.save.trainer,{name:'다온',appearance:'coral'});
      assert.equal(restored.save.party[0].species,species);
      assert.equal(updateNexusOpening(fixture(restored.save).game),false,'finished intro does not replay');
    }
  }
});

test('declining and replaying a starter choice never replaces or doubles the partner',()=>{
  const {game:g}=fixture();prepare(g);
  Engine.prototype.chooseStarter.call(g);choose(g,1);
  assert.equal(g.save.party.length,0);assert.equal(g.panel,'starters');
  Engine.prototype.chooseStarter.call(g);
  const accept=g.dialogue!.choices![0].action;g.dialogue=null;accept();
  const received=structuredClone(g.save);accept();
  assert.deepEqual(g.save,received);drain(g);
  assert(handleFirstJourneyEvent(g,'pokeballs'));drain(g);
  assert.equal(g.panel,'field');assert.equal(g.save.party.length,1);
});

test('profile can yield to report recovery without writing or being forced open next frame',()=>{
  const {game:g,writes}=fixture();assert(updateNexusOpening(g));
  deferNexusProfile(g);assert.equal(g.panel,'field');assert.equal(updateNexusOpening(g),false);
  assert.equal(writes(),0);assert.equal(g.save.flags[F.profile],undefined);
  assert(handleFirstJourneyEvent(g,'tv'));assert.equal(g.panel,'profile');
});

test('cancelling the family choice does not receive postcards or record a response',()=>{
  const {game:g}=fixture();updateNexusOpening(g);completeNexusProfile(g,{name:'다온',appearance:'blue'});
  updateNexusOpening(g);finish(g);place(g,'home',4,5);
  handleFirstJourneyEvent(g,'mom');choose(g,3);
  assert.equal(g.save.flags[F.postcards],undefined);assert.equal(g.save.flags[F.reply],undefined);
  handleFirstJourneyEvent(g,'mom');choose(g,0);assert.equal(g.save.flags[F.postcards],true);
});

test('field choices cannot mutate another save, another tile, or a superseding scene',()=>{
  for(const invalidate of [
    (g:Engine)=>{g.save=newNexusSave();},
    (g:Engine)=>{g.save.player.x++;},
    (g:Engine)=>{g.say('다른 사람',['다른 장면']);g.dialogue=null;},
  ]){
    const {game:g}=fixture();let effects=0;
    sayField(g,'장면',['선택'],undefined,[{label:'선택',action:()=>{effects++;}}]);
    const choice=g.dialogue!.choices![0].action;g.dialogue=null;invalidate(g);choice();
    assert.equal(effects,0);
  }
});

test('legacy partner saves continue without profile or NEXUS story replay',()=>{
  for(const species of [1,4,7,25]){
    const save=newSave();assert(grantPokemon(save,species));
    const result=inspectSave(JSON.stringify(save));assert.equal(result.kind,'ready');
    if(result.kind!=='ready')continue;
    const {game:g}=fixture(result.save),before=structuredClone(g.save);
    assert.equal(updateNexusOpening(g),false);
    assert.equal(handleFirstJourneyEvent(g,'tv'),false);
    assert.deepEqual(g.save,before);
    assert.equal(g.save.party[0].species,species);
  }
});

test('v2 rejects invalid onboarding claims and foreign starter ownership',()=>{
  const {game:g}=fixture();prepare(g);Engine.prototype.chooseStarter.call(g);choose(g,0);drain(g);
  const cases:Array<(save:SaveData)=>void>=[
    save=>{save.trainer!.name=' ';},save=>{save.campaign=undefined;},
    save=>{delete save.flags[F.postcards];},save=>{save.flags[F.reply]=4;},
    save=>{save.flags.departureCleared=true;},save=>{save.version=1;delete save.campaign;delete save.trainer;},
    save=>{const old=newSave();grantPokemon(old,7);save.party=old.party;},
  ];
  for(const mutate of cases){const candidate=structuredClone(g.save);mutate(candidate);assert.equal(inspectSave(JSON.stringify(candidate)).kind,'rejected');}
});

test('an unfinished broadcast restarts safely after a file roundtrip',()=>{
  const {game:g}=fixture();updateNexusOpening(g);completeNexusProfile(g,{name:'하늘',appearance:'blue'});
  updateNexusOpening(g);assert.equal(g.save.flags[F.broadcast],undefined);
  const result=inspectSave(JSON.stringify(g.save));assert.equal(result.kind,'ready');
  if(result.kind!=='ready')return;
  const restored=fixture(result.save).game;assert(updateNexusOpening(restored));finish(restored);
  assert.equal(restored.save.flags[F.broadcast],true);
});

test('starting v2 selects a managed copy and preserves the exact v1 report',()=>{
  const old=newSave();assert(grantPokemon(old,7));
  const raw=JSON.stringify(old),values=new Map([['nexus-test',raw]]);
  const storage={getItem:(key:string)=>values.get(key)??null,setItem:(key:string,value:string)=>{values.set(key,value);}};
  const session=new SaveSession(storage,'nexus-test');assert.equal(session.open()?.version,1);
  assert(session.activate(newNexusSave()));
  assert.equal(values.get('nexus-test'),raw);
  assert.equal(new SaveSession(storage,'nexus-test').open()?.version,2);
});
