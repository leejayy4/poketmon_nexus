import test from 'node:test';
import assert from 'node:assert/strict';
import { Engine,VECTOR } from '../src/engine';
import { planTourNavigation,tourExitPath,objectiveInteractionPath } from '../src/explore-navigation';
import { parseSave } from '../src/save';
import { grantPokemon,availableMoves,pokemonMoves,validPokemonMoves } from '../src/pokemon';
import { createBattle,battleTurn } from '../src/battle';
import { depositPokemon,withdrawPokemon } from '../src/journey-services';
import { TOUR_MAPS,TOUR_NEIGHBORS } from '../src/explore-world';
import { journeyConnection } from '../src/journey-world';
import { wildPokemon } from '../src/runtime-encounters';
import { handleCasteliaHome } from '../src/castelia-homes';
import { handleCasteliaGallery,casteliaChosenSketch } from '../src/castelia-gallery';
import { TOUR_OUTDOORS } from '../src/explore-world';

test('Castelia city, Route 4 entrance and required interiors use the authored target sizes',()=>{
  assert.deepEqual([TOUR_MAPS.tour_castelia.width,TOUR_MAPS.tour_castelia.height],[72,64]);
  assert.deepEqual([TOUR_MAPS.tour_unova_route_01.width,TOUR_MAPS.tour_unova_route_01.height],[72,36]);
  assert.equal(TOUR_MAPS.tour_unova_route_01.name,'4번도로 · 리조트데저트 입구');
  assert.deepEqual([TOUR_MAPS.tour_castelia_center.width,TOUR_MAPS.tour_castelia_center.height],[28,22]);
  assert.deepEqual([TOUR_MAPS.tour_castelia_mart.width,TOUR_MAPS.tour_castelia_mart.height],[24,20]);
  for(const id of Object.keys(TOUR_MAPS).filter(id=>/^tour_castelia_home[1-5](?:_[23]f)?$/.test(id))){
    assert.deepEqual([TOUR_MAPS[id].width,TOUR_MAPS[id].height],[24,18],id);
  }
  for(const id of ['tour_castelia_hall','tour_castelia_hall_2f','tour_castelia_hall_3f']){
    assert.deepEqual([TOUR_MAPS[id].width,TOUR_MAPS[id].height],[28,24],id);
  }
});

test('both garden species survive boxed capture, withdrawal and home move learning with provenance',()=>{
  for(const roll of [0,0.99]){
    const g=new Engine();g.announce=()=>{};g.persist=()=>true;g.save=g.freshSave();grantPokemon(g.save,7);
    g.save.flags.departureCleared=true;
    while(g.save.party.length<6)g.save.party.push(wildPokemon('tour_castelia',()=>0)!);
    g.save.map='tour_castelia';g.save.player={x:27,y:5,facing:'down'};g.save.inventory.pokeBalls=1;
    const mon=wildPokemon('tour_castelia',()=>roll)!;
    assert.equal(mon.species,roll===0?519:548);assert.equal(mon.met,'구름시티 북쪽 정원');
    const b=createBattle(g.save,'wild','roark',()=>0)!;b.enemy=mon;b.enemy.hp=1;
    assert.equal(battleTurn(g.save,b,'ball').outcome,'caught');
    const restored=parseSave(JSON.stringify(g.save));assert(restored);g.save=restored;
    assert.equal(g.save.box?.at(-1)?.species,mon.species);
    depositPokemon(g.save,0);withdrawPokemon(g.save,0);
    const caught=g.save.party.at(-1)!;assert.equal(caught.species,mon.species);
    g.save.map='tour_castelia_home5';g.save.player={x:8,y:10,facing:'up'};
    assert(handleCasteliaHome(g,'tourHost'));
    g.dialogue!.choices!.find(c=>c.label==='동료 기술 준비')!.action();
    g.dialogue!.choices!.find(c=>c.label==='다음 동료들')!.action();
    g.dialogue!.choices![2].action();assert.equal(g.partyIndex,5);
    const move=availableMoves(caught,g.save).find(m=>!pokemonMoves(caught).includes(m))!;assert(move);
    for(let page=0;!g.dialogue!.choices!.some(c=>c.label===move);page++){
      assert(page<20);g.dialogue!.choices!.find(c=>c.label==='다음 페이지')!.action();
    }
    g.dialogue!.choices!.find(c=>c.label===move)!.action();
    g.dialogue!.choices!.find(c=>c.label==='빈 자리에 배운다')!.action();
    assert(pokemonMoves(caught).includes(move));assert(validPokemonMoves(caught,g.save.keyItems));
    assert.equal(caught.met,'구름시티 북쪽 정원');
    assert.deepEqual(parseSave(JSON.stringify(g.save))?.party[5],caught);
  }
});

test('all harbor surfaces dispatch through player confirmation and retain optional records after reload',()=>{
  const g=new Engine();g.announce=()=>{};g.persist=()=>true;g.save=g.freshSave();grantPokemon(g.save,7);
  g.save.map='tour_castelia';g.save.player={x:14,y:30,facing:'down'};
  const unchanged=JSON.stringify({party:g.save.party,money:g.save.money,inventory:g.save.inventory,badges:g.save.badges});
  for(const name of ['서쪽 항만 수면','중앙 부두의 물결','동쪽 항만 전경']){
    g.dialogue=null;
    const object=TOUR_OUTDOORS.tour_castelia.objects.find(o=>o.name===name)!;
    const path=objectiveInteractionPath(g.map,g.save.player,object.event)!;assert(path,name);
    g.save.player={...path.tiles.at(-1)!,facing:path.interaction.facing};g.confirm();
    assert.equal(g.dialogue!.speaker,name);
    assert(g.dialogue!.choices!.some(c=>c.label==='이 풍경을 남긴다'));
    while(g.dialogue!.page<g.dialogue!.pages.length-1){g.dialogue!.shown=1000;g.confirm();}
    g.dialogue!.shown=1000;g.confirm();
  }
  for(const flag of ['casteliaSketchWest','casteliaSketchMiddle','casteliaSketchEast'])assert.equal(g.save.flags[flag],7);
  const restored=parseSave(JSON.stringify(g.save));assert(restored);g.save=restored;
  g.dialogue=null;g.save.map='tour_castelia_hall';g.save.player={x:8,y:10,facing:'up'};
  const path=objectiveInteractionPath(g.map,g.save.player,'tourExhibit0')!;assert(path);
  g.save.player={...path.tiles.at(-1)!,facing:path.interaction.facing};g.confirm();
  assert.equal(g.dialogue!.choices!.filter(c=>c.label.endsWith(' 비교')).length,3);
  assert.equal(JSON.stringify({party:g.save.party,money:g.save.money,inventory:g.save.inventory,badges:g.save.badges}),unchanged);
});

test('harbor sketch rejects a changed lead and persists one optional gallery selection',()=>{
  const g=new Engine();g.announce=()=>{};let writes=0;g.persist=()=>{writes++;return true;};
  g.save=g.freshSave();grantPokemon(g.save,7);grantPokemon(g.save,25);g.save.map='tour_castelia';
  const event=TOUR_OUTDOORS.tour_castelia.objects.find(o=>o.name==='서쪽 항만 수면')!.event;
  assert(handleCasteliaGallery(g,event));const stale=g.dialogue!.choices![0].action;
  g.save.party.reverse();stale();assert.equal(writes,0);assert.equal(g.save.flags.casteliaSketchWest,undefined);
  assert(handleCasteliaGallery(g,event));const record=g.dialogue!.choices![0].action;
  record();record();assert.equal(writes,1);assert.equal(g.save.flags.casteliaSketchWest,25);
  g.save.map='tour_castelia_hall';assert(handleCasteliaGallery(g,'tourExhibit0'));
  g.dialogue!.choices!.find(c=>c.label==='빛과 그늘 비교')!.action();
  const select=g.dialogue!.choices![0].action;select();select();assert.equal(writes,2);
  assert.equal(casteliaChosenSketch(g.save.flags),'빛과 그늘');
  const restored=parseSave(JSON.stringify(g.save));assert(restored);assert.equal(casteliaChosenSketch(restored.flags),'빛과 그늘');
  g.save.map='tour_castelia_home4';assert(handleCasteliaHome(g,'tourHost'));
  assert(g.dialogue!.pages.some(p=>p.includes('빛과 그늘')));
});

test('Castelia homes, gallery and Route 4 entrance support engine walking and save restoration in one journey',()=>{
  const g=new Engine();g.announce=()=>{};g.persist=()=>true;g.save=g.freshSave();
  grantPokemon(g.save,7);g.save.flags.departureCleared=true;
  g.save.map='tour_castelia';g.save.player={x:14,y:30,facing:'down'};
  const party=JSON.stringify(g.save.party);
  const targets=['tour_castelia_home4','tour_castelia_home4_2f','tour_castelia_home4_3f','tour_castelia_home5','tour_castelia_home5_2f','tour_castelia_home5_3f','tour_castelia_hall','tour_unova_route_01','tour_desert','tour_castelia'] as const;
  for(const target of targets){
    let crossings=0;
    while(g.save.map!==target){
      assert(crossings++<10,`stuck before ${target}`);
      let route=planTourNavigation(g.save,target)!;
      // A city destination intentionally counts its interiors as already visited.
      if(route.status==='arrived'){
        const exit=g.map.warps.find(w=>w.to===target)!;assert(exit,target);
        route={...route,status:'walking',maps:[g.save.map,target],tiles:tourExitPath(g.map,g.save.player,exit),exit};
      }
      assert.equal(route.status,'walking',target);
      for(let i=1;i<route.tiles.length;i++){
        const a=route.tiles[i-1],b=route.tiles[i];
        const dir=Object.entries(VECTOR).find(([,v])=>a.x+v.x===b.x&&a.y+v.y===b.y)![0];
        const key='Arrow'+dir[0].toUpperCase()+dir.slice(1);
        g.press(key);g.release(key);for(let tick=0;tick<20;tick++)g.update(.04);
        assert(!g.battle,`safe route entered grass before ${target}`);
      }
      assert.equal(g.save.map,route.maps[1],target);
    }
    const restored=parseSave(JSON.stringify(g.save));assert(restored,`${target} save rejected`);
    assert.deepEqual(restored.player,g.save.player,target);assert.equal(JSON.stringify(restored.party),party);
  }
  assert(g.save.steps>100);
});
