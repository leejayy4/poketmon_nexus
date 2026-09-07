import test from 'node:test';
import assert from 'node:assert/strict';
import { Engine } from '../src/engine';
import { createBattle } from '../src/battle';
import { grantPokemon,SPECIES,pokemonMoves } from '../src/pokemon';
import { newSave,parseSave } from '../src/save';
import { getMap,canStand } from '../src/maps';
import { maxHpAtLevel } from '../src/growth';
import { handleRoadTrainer,trainerWinFlag } from '../src/road-trainers';
import { handleJourneyEvent } from '../src/journey-services';
import { showMoveSchool } from '../src/move-school';
import { itemSupply } from '../src/adventure-guide';

function game(){const g=new Engine();g.save=newSave();grantPokemon(g.save,4);grantPokemon(g.save,25);g.save.flags.departureCleared=true;g.save.map='route_s01';g.random=()=>0;return g;}
function dom(run:()=>void){const previous=globalThis.document;globalThis.document={getElementById:()=>null} as unknown as Document;try{run();}finally{globalThis.document=previous;}}
function choose(g:Engine,label:string){const choice=g.dialogue?.choices?.find(c=>c.label===label);assert(choice,label);g.dialogue=null;choice.action();}
function finish(g:Engine){for(let i=0;i<300&&g.dialogue;i++){g.dialogue.shown=999;if(g.battlePresentation&&!g.battlePresentation.canAdvance)g.update(.05);else g.confirm();}}

test('a seventh catch presents the caught species in the PC and survives save reload',()=>dom(()=>{
  const g=game();while(g.save.party.length<6)g.save.party.push({species:399,level:3,hp:18,maxHp:18,experience:0,nature:'성실',met:'새잎 서쪽길'});
  g.save.inventory.pokeBalls=2;g.battle=createBattle(g.save,'wild','roark',()=>.5)!;
  const species=g.battle.enemy.species;g.battle.enemy.hp=1;g.actBattle('ball');
  assert.equal(g.save.party.length,6);assert.equal(g.save.box?.length,1);assert.equal(g.caughtPokemon?.species,species);
  g.dialogue!.page=g.dialogue!.pages.length-1;assert.equal(g.showingCatch,true);
  assert.deepEqual(g.dialogue!.choices?.map(c=>c.label),['도감 보기','계속 모험하기']);
  const reloaded=parseSave(JSON.stringify(g.save));assert.equal(reloaded?.box?.[0].species,species);
  choose(g,'계속 모험하기');assert.equal(g.battle,null);assert.equal(g.caughtPokemon,null);
}));

test('optional road trainer victory pays once and re-visiting remembers it',()=>dom(()=>{
  const g=game();const mon=g.save.party[0];mon.level=15;mon.hp=mon.maxHp=maxHpAtLevel(mon.species,15);delete mon.moves;mon.moves=pokemonMoves(mon);
  assert(handleRoadTrainer(g,'roadworker'));choose(g,'배틀한다');finish(g);
  assert.equal(g.battle?.kind,'trainer');g.battle!.enemy.hp=1;const money=g.save.money;
  g.actBattle('move0');assert.equal(g.save.money,money+160);assert.equal(g.save.flags[trainerWinFlag('west-road-practice')],true);
  finish(g);assert.equal(g.battle,null);handleRoadTrainer(g,'roadworker');assert.equal(g.dialogue?.choices,undefined);assert.equal(g.save.money,money+160);
}));

test('collected passage item frees its collision only in the collecting save',()=>dom(()=>{
  const g=game();g.save.map='tour_pass_jubilife_oreburgh';const before=getMap(g.save.map),item=before.props.find(p=>p.dialogue==='journeyItem')!;
  assert.equal(canStand(before,item.x,item.y),false);handleJourneyEvent(g,'journeyItem');
  assert.equal(canStand(getMap(g.save.map,g.save.flags),item.x,item.y),true);
  assert.equal(canStand(getMap(g.save.map),item.x,item.y),false);
}));

test('learning an earned elemental move updates the selected slots and survives reload',()=>dom(()=>{
  const g=game(),p=g.save.party[0];p.level=7;p.hp=p.maxHp=maxHpAtLevel(p.species,7);g.panel='summary';showMoveSchool(g);
  choose(g,'불꽃세례');choose(g,'울음소리와 비교');assert.deepEqual(pokemonMoves(p),['할퀴기','울음소리']);choose(g,'바꿔서 배운다');
  assert.deepEqual(pokemonMoves(p),['할퀴기','불꽃세례']);assert.equal(parseSave(JSON.stringify(g.save))?.party[0].moves?.[1],'불꽃세례');
  assert.match(g.dialogue!.pages[0],new RegExp('불꽃세례'));assert.equal(SPECIES[p.species].name,'파이리');
}));

test('all five encounter areas have reachable grass without blocking their exits',()=>dom(()=>{
  for(const map of ['route_s01','tour_jubilife','tour_pass_jubilife_oreburgh','tour_eterna_forest','tour_coronet'] as const){
    const g=game();g.save.map=map;const field=getMap(map,g.save.flags),grass=field.terrain?.[0];assert(grass,map);
    const tile={x:grass.x,y:grass.y};assert(canStand(field,tile.x,tile.y),map);g.save.player={...tile,facing:'down'};
    for(let i=0;i<6;i++)g.onFieldStep();assert(g.battle,map);
    assert(!field.warps.some(w=>w.x>=grass.x&&w.x<grass.x+grass.w&&w.y>=grass.y&&w.y<grass.y+grass.h),map);
  }
}));

test('after the first badge recovery remains free and item guidance leads to a real shop',()=>dom(()=>{
  for(const [map,event] of [['route_s01','routeGuide'],['tour_jubilife_center','nurse'],['tour_eterna_forest','trailGuide']] as const){
    const g=game();g.save.map=map;g.save.badges=['BADGE-GS01'];g.save.inventory={pokeBalls:0,potions:0};g.save.party[0].hp=1;
    g.event(event);assert.equal(g.save.party[0].hp,g.save.party[0].maxHp);assert.deepEqual(g.save.inventory,{pokeBalls:0,potions:0});
    for(const item of ['pokeBalls','potions'] as const){const supply=itemSupply(g.save,item)!;assert.equal(supply.event,'martClerk');assert(getMap(supply.map).npcs.some(n=>n.dialogue===supply.event));}
  }
}));
