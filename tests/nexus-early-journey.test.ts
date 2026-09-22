import test from 'node:test';
import assert from 'node:assert/strict';
import { Engine } from '../src/engine';
import type { Choice, Dialogue, MapId, SaveData } from '../src/types';
import { newNexusSave, newSave, parseSave } from '../src/save';
import { grantPokemon, pokemonMoves } from '../src/pokemon';
import { currentPp, maxPp, spendPp } from '../src/move-pp';
import { createBattle, createSpecialBattle, createTrainerBattle } from '../src/battle';
import { leadPokemon } from '../src/team';
import { getMap } from '../src/maps';
import { worldSpawn } from '../src/unified-world';
import { GYMS } from '../src/gyms';
import { adventureObjective, itemSupply } from '../src/adventure-guide';
import { planTourNavigation } from '../src/explore-navigation';
import { NEXUS_OPENING } from '../src/nexus-opening-state';
import { NEXUS_FIRST_RIVAL as RIVAL } from '../src/nexus-first-rival';
import { NEXUS_EARLY as F, applyNexusEarlyActors, earlyPartners } from '../src/nexus-early-state';
import { handleNexusEarlyJourney } from '../src/nexus-early-journey';

// Dormant during the QA pause. These source contracts use no browser storage,
// Engine construction, rendering, timer or user save file.
function journey(legacy=false):SaveData {
  const save=legacy?newSave():newNexusSave();
  if(!legacy)Object.assign(save.flags,{
    [NEXUS_OPENING.profile]:true,[NEXUS_OPENING.broadcast]:true,
    [NEXUS_OPENING.postcards]:true,[NEXUS_OPENING.reply]:1,
    [NEXUS_OPENING.outside]:true,
  });
  assert(grantPokemon(save,legacy?7:900002));
  save.flags.departureCleared=true;save.map='tour_sandgem_center';
  save.player={x:10,y:12,facing:'up'};save.inventory={pokeBalls:0,potions:0};
  return save;
}
function fixture(save=journey()){
  const writes:SaveData[]=[],destinations:Array<{map:string;event?:string}>=[];
  const stub={save,panel:'field',sceneRevision:0,dialogue:null as Dialogue|null,
    battle:null,move:null,transition:0,grassSteps:0,battleFrames:null,
    partyIndex:0,summaryActionIndex:0,caughtPreview:null,caughtBoxPreview:null,
    random:()=>0,clearInput(){},deferFieldAction(){return false;},audio:{play(){}},
    get map(){return applyNexusEarlyActors(getMap(this.save.map,this.save.flags),this.save);},
    persist(){const parsed=parseSave(JSON.stringify(this.save));assert(parsed,'every committed checkpoint must remain loadable');writes.push(parsed);return true;},
    healParty(){Engine.prototype.healParty.call(this as unknown as Engine);},
    returnHome(){Engine.prototype.returnHome.call(this as unknown as Engine);},
    setTourDestination(map:string,event?:string){destinations.push({map,event});},
    say(speaker:string,pages:string[],after?:()=>void,choices?:Choice[]){
      this.sceneRevision++;this.battleFrames=null;this.caughtPreview=null;this.caughtBoxPreview=null;
      this.dialogue={speaker,pages,page:0,shown:0,selected:0,after,choices};
    },
  };
  return {g:stub as unknown as Engine,writes,destinations};
}
function place(g:Engine,map:MapId){g.save.map=map;g.save.player={...(worldSpawn(map)??{x:10,y:12}),facing:'up'};}
function finish(g:Engine){const scene=g.dialogue;assert(scene&&!scene.choices);g.dialogue=null;scene.after?.();}
function choose(g:Engine,label:string){const choice=g.dialogue?.choices?.find(choice=>choice.label===label);assert(choice,label);g.dialogue=null;choice.action();}
function event(g:Engine,id:string){Engine.prototype.event.call(g,id);}
function act(g:Engine,action:Parameters<Engine['actBattle']>[0]){Engine.prototype.actBattle.call(g,action);}
function healthy(g:Engine){for(const p of g.save.party){assert.equal(p.hp,p.maxHp);assert.deepEqual(currentPp(p,pokemonMoves(p)),pokemonMoves(p).map(maxPp));}}
function damage(g:Engine){g.save.party[0].hp=0;spendPp(g.save.party[0],pokemonMoves(g.save.party[0]),0);}
function catchStarly(g:Engine){
  place(g,'tour_sinnoh_route_201');g.save.inventory.pokeBalls=5;
  g.battle=createBattle(g.save,'wild','roark',()=>0);assert(g.battle);assert.equal(g.battle.enemy.species,396);
  act(g,'ball');assert.equal(g.save.party.length,2);choose(g,'계속 모험하기');
  return g.save.party[1];
}

test('v1 visits keep generic Sandgem behavior without NEXUS actors or milestones',()=>{
  const {g}=fixture(journey(true)),base=getMap(g.save.map,g.save.flags);
  assert.equal(applyNexusEarlyActors(base,g.save),base);
  assert.equal(handleNexusEarlyJourney(g,'tourExhibit2'),false);
  place(g,'tour_sinnoh_route_202');assert.equal(handleNexusEarlyJourney(g,'route202Sign'),false);
  place(g,'tour_sandgem_center');damage(g);event(g,'nurse');healthy(g);
  assert.equal(g.save.inventory.pokeBalls,0);assert.equal(g.save.inventory.potions,2);
  for(const key of Object.values(F))assert.equal(g.save.flags[key],undefined);
});

for(const outcome of ['won','lost','skipped','unmet'] as const)test(`Sandgem reunion recalls ${outcome} without healing or awarding a capture`,()=>{
  const {g,writes}=fixture();
  if(outcome!=='unmet')g.save.flags[RIVAL.met]=true;
  if(outcome==='won'||outcome==='lost')Object.assign(g.save.flags,{[RIVAL.completed]:true,[RIVAL.won]:outcome==='won'});
  damage(g);const party=structuredClone(g.save.party),inventory={...g.save.inventory};
  event(g,'tourExhibit2');assert.equal(g.dialogue?.speaker,'유진');
  const pages=g.dialogue!.pages.join('\n');
  assert(pages.includes(outcome==='won'?'다음엔 나도 쉽게 지지':outcome==='lost'?'우리 첫 승부':outcome==='skipped'?'승부는 서두르지':'여행을 시작'));
  assert.equal(g.save.flags[F.reunion],undefined);assert.equal(writes.length,0);
  const complete=g.dialogue!.after!;finish(g);assert.equal(g.save.flags[F.reunion],true);
  choose(g,'이야기를 마친다');complete();assert.equal(writes.length,1,'completed scene callbacks cannot replay');
  assert.deepEqual(g.save.party,party);assert.deepEqual(g.save.inventory,inventory);
  assert.equal(g.save.healingPoint,'home');assert.equal(g.save.flags[F.rested],undefined);
  assert.equal(g.save.flags[F.caught],undefined);assert.equal(g.save.flags[F.partnerBattled],undefined);
  event(g,'tourExhibit2');assert(g.dialogue?.choices);assert.equal(writes.length,1);
});

test('reunion callbacks cannot commit after another scene, save or tile replaces their context',()=>{
  for(const replacement of ['scene','save','tile','map'] as const){
    const {g,writes}=fixture();event(g,'tourExhibit2');const complete=g.dialogue!.after!;
    if(replacement==='scene')g.say('간호사',['다른 이야기']);
    if(replacement==='save')g.save=structuredClone(g.save);
    if(replacement==='tile')g.save.player.x++;
    if(replacement==='map')place(g,'tour_sandgem');
    g.dialogue=null;complete();assert.equal(g.save.flags[F.reunion],undefined);assert.equal(writes.length,0);
  }
});

test('actual nurse service heals HP/PP, establishes recovery and tops supplies up without reducing extras',()=>{
  const {g,writes}=fixture();damage(g);event(g,'nurse');healthy(g);
  assert.equal(g.save.healingPoint,'tour_sandgem_center');assert.equal(g.save.flags[F.rested],true);
  assert.deepEqual(g.save.inventory,{pokeBalls:5,potions:2});assert.equal(writes.length,1);
  assert.equal(g.save.flags[F.reunion],undefined);assert.equal(g.save.flags[F.caught],undefined);
  finish(g);g.save.inventory={pokeBalls:12,potions:7};damage(g);event(g,'nurse');healthy(g);
  assert.deepEqual(g.save.inventory,{pokeBalls:12,potions:7});finish(g);event(g,'nurse');
  assert.deepEqual(g.save.inventory,{pokeBalls:12,potions:7},'repeat visits never stack the starter allowance');
  assert.equal(writes.length,3);
});

test('after the first badge the same nurse still heals but stops both free supply top-ups',()=>{
  const {g}=fixture();g.save.badges=[GYMS[0].badge];g.save.keyItems=[GYMS[0].tm];
  damage(g);event(g,'nurse');healthy(g);
  assert.deepEqual(g.save.inventory,{pokeBalls:0,potions:0});assert.equal(g.save.flags[F.rested],true);
  assert.equal(g.save.healingPoint,'tour_sandgem_center');
});

test('home rest also restores spent PP at full HP while keeping the chosen center checkpoint',()=>{
  const {g,writes}=fixture();g.save.healingPoint='tour_sandgem_center';
  g.save.map='home';g.save.player={x:4,y:5,facing:'up'};
  const partner=g.save.party[0];spendPp(partner,pokemonMoves(partner),0);
  assert.equal(partner.hp,partner.maxHp);event(g,'mom');healthy(g);
  assert.equal(g.save.healingPoint,'tour_sandgem_center');assert.equal(writes.length,1);
  assert.equal(g.save.flags[F.rested],undefined,'home care does not invent a Sandgem nurse visit');
});

test('defeat after Sandgem care returns to that real checkpoint with no capture or growth invention',()=>{
  const {g,writes}=fixture();event(g,'nurse');finish(g);place(g,'tour_sinnoh_route_202');
  g.battle=createBattle(g.save,'wild','roark',()=>0);assert(g.battle);g.save.party[0].hp=1;
  const experience=g.save.party[0].experience;act(g,'move2');
  assert.equal(g.save.map,'tour_sandgem_center');healthy(g);assert.equal(g.battle,null);
  assert.equal(g.save.party[0].experience,experience);assert.equal(g.save.flags[F.caught],undefined);
  assert.equal(g.save.flags[F.partnerBattled],undefined);assert.equal(writes.at(-1)?.map,'tour_sandgem_center');
});

test('reading the catching lesson records only the completed lesson and keeps onward travel optional',()=>{
  const {g,destinations}=fixture();place(g,'tour_sinnoh_route_202');
  const before=structuredClone(g.save);event(g,'route202Sign');choose(g,'포획 안내를 읽는다');
  assert.equal(g.save.flags[F.lesson],undefined);const complete=g.dialogue!.after!;
  finish(g);assert.equal(g.save.flags[F.lesson],true);choose(g,'202번도로로 향한다');complete();
  assert.deepEqual(destinations,[{map:'tour_sinnoh_route_202',event:undefined}]);
  assert.deepEqual(g.save.party,before.party);assert.deepEqual(g.save.inventory,before.inventory);
  assert.deepEqual(g.save.pokedex,before.pokedex);assert.equal(g.save.flags[F.caught],undefined);
  assert.equal(g.save.flags[F.partnerBattled],undefined);assert.equal(g.save.flags[F.rested],undefined);
});

test('actual capture and a later local-partner victory persist separate milestones through Engine hooks',()=>{
  const {g,writes}=fixture();const caught=catchStarly(g);
  assert.equal(g.save.flags[F.caught],true);assert.equal(g.save.flags[F.partnerBattled],undefined);
  assert.equal(caught.experience,0);assert.equal(g.save.inventory.pokeBalls,4);
  assert.equal(writes.at(-1)?.party[1].species,396);
  leadPokemon(g.save,1);assert.equal(g.save.party[0],caught);place(g,'tour_sinnoh_route_202');
  g.battle=createBattle(g.save,'wild','roark',()=>0);assert(g.battle);g.battle.enemy.hp=1;
  const level=caught.level;act(g,'move0');
  assert.equal(g.save.flags[F.partnerBattled],true);assert(caught.level>level||caught.experience>0);
  assert.equal(writes.at(-1)?.flags[F.partnerBattled],true);
  const restored=parseSave(JSON.stringify(g.save));assert(restored);assert.equal(restored.party[0].met,'신오 201번도로');
});

test('a caught passenger never gets the local-partner battle milestone for the starter winning',()=>{
  const {g}=fixture();const caught=catchStarly(g);place(g,'tour_sinnoh_route_202');
  g.battle=createBattle(g.save,'wild','roark',()=>0);assert(g.battle);g.battle.enemy.hp=1;
  act(g,'move0');assert.equal(g.save.flags[F.partnerBattled],undefined);assert.equal(caught.experience,0);
  assert.equal(g.save.flags[F.caught],true);
});

test('a local partner fighting an earlier trainer opponent remains credited after a later switch',()=>{
  const {g}=fixture();const caught=catchStarly(g);leadPokemon(g.save,1);place(g,'tour_sinnoh_route_202');
  const wild=createBattle(g.save,'wild','roark',()=>0);assert(wild);
  const opponent={...wild.enemy,hp:1};
  g.battle=createTrainerBattle(g.save,{id:'early-two-opponents',name:'도로 연습 상대',reward:0,team:[opponent,opponent]});assert(g.battle);
  act(g,'move0');assert.equal(g.battle.enemyIndex,1);assert.equal(g.save.flags[F.partnerBattled],undefined);
  finish(g);act(g,{switch:1});finish(g);
  assert.deepEqual(g.battle!.participants,[1]);act(g,'move0');
  assert.equal(g.save.flags[F.partnerBattled],true);
  assert(g.battle!.defeatedOpponentParticipants?.includes(caught));
});

test('a failed ball, fleeing and special capture do not manufacture ordinary early-catch progress',()=>{
  const {g}=fixture();place(g,'tour_sinnoh_route_201');g.save.inventory.pokeBalls=5;
  g.battle=createBattle(g.save,'wild','roark',()=>0);assert(g.battle);g.random=()=>.99;
  act(g,'ball');assert.equal(g.save.party.length,1);assert.equal(g.save.flags[F.caught],undefined);
  finish(g);act(g,'run');finish(g);assert.equal(g.save.flags[F.caught],undefined);
  g.battle=createSpecialBattle(g.save,{eventId:'early-test-special',species:399,level:2,met:'신오 201번도로',allowCapture:true});assert(g.battle);
  g.random=()=>0;act(g,'ball');assert.equal(g.save.party.length,2);assert.equal(g.save.flags[F.caught],undefined);
});

test('party advice finds boxed early partners without silently withdrawing them',()=>{
  const {g,destinations}=fixture();const partner=catchStarly(g);
  g.save.party.splice(1,1);g.save.box=[partner];place(g,'tour_sandgem_center');
  event(g,'tourExhibit2');finish(g);choose(g,'새 동료와 파티 이야기');
  assert(g.dialogue!.pages.some(page=>page.includes('지금 PC 박스')));
  choose(g,'PC 위치를 확인한다');assert.equal(g.save.flags[F.reviewed],true);
  assert.equal(g.save.party.length,1);assert.equal(g.save.box[0],partner);assert.deepEqual(earlyPartners(g.save),[partner]);
  assert.deepEqual(destinations,[{map:'tour_sandgem_center',event:'tourExhibit1'}]);
});

test('cancelling the first page of partner advice does not mark its review complete',()=>{
  const {g}=fixture();catchStarly(g);place(g,'tour_sandgem_center');
  event(g,'tourExhibit2');finish(g);choose(g,'새 동료와 파티 이야기');
  assert.equal(g.dialogue!.page,0);const stale=g.dialogue!.choices![0].action;
  Engine.prototype.cancel.call(g);assert.equal(g.dialogue,null);
  assert.equal(g.save.flags[F.reviewed],undefined);assert.equal(g.panel,'field');
  stale();assert.equal(g.save.flags[F.reviewed],undefined,'the declined scene cannot be replayed');
  event(g,'tourExhibit2');choose(g,'새 동료와 파티 이야기');choose(g,'이야기를 마친다');
  assert.equal(g.save.flags[F.reviewed],true);
});

test('new v2 milestones are optional on old saves, typed when present and never invented by loading',()=>{
  const old=journey(),loaded=parseSave(JSON.stringify(old));assert(loaded);
  for(const key of Object.values(F))assert.equal(loaded.flags[key],undefined);
  for(const key of Object.values(F)){
    const valid=journey();valid.flags[key]=true;if(key===F.reviewed)valid.flags[F.reunion]=true;
    assert(parseSave(JSON.stringify(valid)),key);
    const bad=journey();bad.flags[key]=1;assert.equal(parseSave(JSON.stringify(bad)),null,key);
    const tooEarly=journey();delete tooEarly.flags.departureCleared;tooEarly.flags[key]=true;
    assert.equal(parseSave(JSON.stringify(tooEarly)),null,key);
  }
  const review=journey();review.flags[F.reviewed]=true;assert.equal(parseSave(JSON.stringify(review)),null);
});

test('guide offers learning without a capture gate and does not pull a Jubilife visitor backwards',()=>{
  const save=journey();save.map='tour_sinnoh_route_202';save.player={x:14,y:61,facing:'up'};
  save.flags[F.reunion]=true;save.flags[F.rested]=true;
  const lesson=adventureObjective(save);assert(lesson);assert.equal(lesson.id,'nexus-catch-intro');
  assert.equal(lesson.event,'route202Sign');assert.equal(lesson.point,undefined);
  const navigation=planTourNavigation(save,lesson.map,undefined,lesson.event);assert(navigation);
  assert.notEqual(navigation.status,'blocked');assert(navigation.interaction);
  save.flags[F.lesson]=true;const before=structuredClone(save);
  assert.equal(adventureObjective(save)?.map,'tour_jubilife');assert.deepEqual(save,before);
  assert.equal(save.flags[F.caught],undefined);assert.equal(save.flags[RIVAL.won],undefined);
  const road=getMap(save.map,save.flags);
  const exits=road.warps.filter(warp=>['tour_sandgem','tour_jubilife'].includes(warp.to));assert.equal(exits.length,2);
  for(const warp of exits)assert.equal(warp.requiresFlag,undefined);
  save.tourVisited=['tour_jubilife'];delete save.flags[F.reunion];delete save.flags[F.rested];delete save.flags[F.lesson];
  const objective=adventureObjective(save);assert(objective);assert(!objective.id.startsWith('nexus-'));
  assert.equal(itemSupply(save,'pokeBalls')?.map,'tour_sandgem_center');
});
