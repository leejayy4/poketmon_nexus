import test from 'node:test';
import assert from 'node:assert/strict';
import { Engine } from '../src/engine';
import { TOUR_MAPS } from '../src/explore-world';
import { handleJourneyEvent,purchase,depositPokemon,withdrawPokemon } from '../src/journey-services';
import { grantPokemon,SPECIES } from '../src/pokemon';
import { wildPokemon } from '../src/runtime-encounters';
import { newSave,parseSave } from '../src/save';
import { neighborJourneyLabel } from '../src/neighbor-journey';
import { handleRoadTrainer } from '../src/road-trainers';

function prepared(){
  const g=new Engine();g.announce=()=>{};g.persist=()=>true;g.save=newSave();g.panel='field';
  assert(grantPokemon(g.save,7));g.save.flags.departureCleared=true;
  const local=wildPokemon('tour_kanto_route_18',()=>0)!;g.save.party.push(local);
  g.save.pokedex!.seen.push(local.species);g.save.pokedex!.caught.push(local.species);
  g.save.map='tour_fuchsia';g.save.player={x:14,y:39,facing:'right'};
  g.save.tourVisited=['tour_kanto_route_16','tour_kanto_route_17','tour_kanto_route_18','tour_fuchsia'];
  return {g,local};
}

test('Fuchsia uses Route 18, 17 and 16 in both the warps and atlas journey label',()=>{
  const fuchsia=TOUR_MAPS.tour_fuchsia,route18=TOUR_MAPS.tour_kanto_route_18;
  assert.deepEqual(fuchsia.warps.find(w=>w.to==='tour_kanto_route_18'),{x:1,y:18,to:'tour_kanto_route_18',spawn:{x:52,y:15},entry:'left',facing:'left'});
  assert.deepEqual(route18.warps.find(w=>w.to==='tour_fuchsia'),{x:54,y:15,to:'tour_fuchsia',spawn:{x:3,y:18},entry:'right',facing:'right'});
  assert.equal(neighborJourneyLabel('tour_fuchsia','tour_celadon',{}),'← 무지개시티 · 경유: 관동 18번도로 → 관동 17번도로 → 관동 16번도로');
});

test('Fuchsia east gate enters independent Route 15 and continues into Route 14',()=>{
  const fuchsia=TOUR_MAPS.tour_fuchsia,route15=TOUR_MAPS.tour_kanto_route_15;
  assert.deepEqual({width:route15.width,height:route15.height},{width:64,height:28});
  assert.deepEqual(fuchsia.warps.find(w=>w.to==='tour_kanto_route_15'),{x:54,y:12,to:'tour_kanto_route_15',spawn:{x:3,y:14},entry:'right',facing:'right'});
  assert.deepEqual(route15.warps.map(w=>w.to),['tour_fuchsia','tour_kanto_route_14']);
  const start={x:1,y:14},goal={x:62,y:14},seen=new Set([`${start.x},${start.y}`]),queue=[start];
  for(const point of queue)for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const x=point.x+dx,y=point.y+dy,key=`${x},${y}`;if(route15.walkable[y]?.[x]!=='.'||seen.has(key))continue;seen.add(key);queue.push({x,y});}
  assert(seen.has(`${goal.x},${goal.y}`),'Route 15 must keep a walkable west-east main line');
});

test('Route 15 keeps its main road safe while side grass yields the supported original species',()=>{
  const route15=TOUR_MAPS.tour_kanto_route_15;
  assert(route15.terrain?.length===3);
  for(let x=1;x<=62;x++)if(route15.walkable[14][x]==='.')assert(!route15.terrain!.some(r=>x>=r.x&&x<r.x+r.w&&14>=r.y&&14<r.y+r.h));
  const wild=wildPokemon('tour_kanto_route_15',()=>0)!;
  assert.equal(wild.species,16);assert.equal(wild.level,24);assert.equal(wild.met,'관동 15번도로');
  const {g}=prepared();g.save.map='tour_kanto_route_15';g.save.player={x:51,y:20,facing:'right'};
  assert(handleRoadTrainer(g,'tourRoute15Trainer'));assert.match(g.dialogue!.pages.join('\n'),/구구 Lv\.24 \/ 구구 Lv\.25/);
  assert.equal(g.battle,null);assert.equal(g.save.flags['trainerWon:kanto-route-15-practice'],undefined);
});

test('Route 14 extends from Route 15 into Route 13 and legacy saves return through the newest road',()=>{
  const route15=TOUR_MAPS.tour_kanto_route_15,route14=TOUR_MAPS.tour_kanto_route_14,legacy=TOUR_MAPS.tour_pass_lavender_fuchsia;
  assert.deepEqual({width:route14.width,height:route14.height},{width:28,height:72});
  assert.deepEqual(route15.warps.find(w=>w.to==='tour_kanto_route_14'),{x:62,y:14,to:'tour_kanto_route_14',spawn:{x:14,y:68},entry:'right',facing:'up'});
  assert.deepEqual(route14.warps.map(w=>w.to),['tour_kanto_route_15','tour_kanto_route_13']);
  assert.deepEqual(legacy.warps.find(w=>w.to==='tour_kanto_route_13'),{x:30,y:10,to:'tour_kanto_route_13',spawn:{x:68,y:16},entry:'right',facing:'left'});
  const start={x:14,y:70},goal={x:14,y:1},seen=new Set([`${start.x},${start.y}`]),queue=[start];
  for(const point of queue)for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const x=point.x+dx,y=point.y+dy,key=`${x},${y}`;if(route14.walkable[y]?.[x]!=='.'||seen.has(key))continue;seen.add(key);queue.push({x,y});}
  assert(seen.has(`${goal.x},${goal.y}`),'Route 14 must keep a walkable south-north main line');
});

test('Route 13 provides a walkable fence maze, Route 14 return and save-backed companion survey',()=>{
  const route14=TOUR_MAPS.tour_kanto_route_14,route13=TOUR_MAPS.tour_kanto_route_13;
  assert.deepEqual({width:route13.width,height:route13.height},{width:72,height:32});
  assert.deepEqual(route14.warps.find(w=>w.to==='tour_kanto_route_13'),{x:14,y:1,to:'tour_kanto_route_13',spawn:{x:3,y:16},entry:'up',facing:'right'});
  assert.deepEqual(route13.warps.map(w=>w.to),['tour_kanto_route_14','tour_kanto_route_12']);
  const start={x:1,y:16},goal={x:70,y:16},seen=new Set([`${start.x},${start.y}`]),queue=[start];
  for(const point of queue)for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const x=point.x+dx,y=point.y+dy,key=`${x},${y}`;if(route13.walkable[y]?.[x]!=='.'||seen.has(key))continue;seen.add(key);queue.push({x,y});}
  assert(seen.has(`${goal.x},${goal.y}`),'Route 13 must keep a walkable west-east maze route');
  const {g,local}=prepared();g.save.map='tour_kanto_route_13';g.save.player={x:33,y:24,facing:'up'};
  const before={hp:local.hp,money:g.save.money,experience:local.experience};
  assert(handleJourneyEvent(g,'tourRoute13FenceSurvey'));
  const choice=g.dialogue!.choices!.find(c=>c.label===SPECIES[local.species].name)!;assert(choice);choice.action();
  assert.equal(g.save.flags.fuchsiaRoute13FenceSurveyed,true);assert.equal(g.save.flags.fuchsiaRoute13SurveySpecies,local.species);
  assert.deepEqual({hp:local.hp,money:g.save.money,experience:local.experience},before);
});

test('Route 12 completes the numbered road chain between Route 13 and Lavender',()=>{
  const route13=TOUR_MAPS.tour_kanto_route_13,route12=TOUR_MAPS.tour_kanto_route_12,lavender=TOUR_MAPS.tour_lavender;
  assert.deepEqual({width:route12.width,height:route12.height},{width:32,height:88});
  assert.deepEqual(route13.warps.find(w=>w.to==='tour_kanto_route_12'),{x:70,y:16,to:'tour_kanto_route_12',spawn:{x:16,y:84},entry:'right',facing:'up'});
  assert.deepEqual(route12.warps,[
    {x:16,y:1,to:'tour_lavender',spawn:{x:14,y:31},entry:'up',facing:'up'},
    {x:16,y:86,to:'tour_kanto_route_13',spawn:{x:68,y:16},entry:'down',facing:'left'},
  ]);
  assert.deepEqual(lavender.warps.find(w=>w.to==='tour_kanto_route_12'),{x:14,y:32,to:'tour_kanto_route_12',spawn:{x:16,y:3},entry:'down',facing:'down'});
  const start={x:16,y:1},goal={x:16,y:86},seen=new Set([`${start.x},${start.y}`]),queue=[start];
  for(const point of queue)for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const x=point.x+dx,y=point.y+dy,key=`${x},${y}`;if(route12.walkable[y]?.[x]!=='.'||seen.has(key))continue;seen.add(key);queue.push({x,y});}
  assert(seen.has(`${goal.x},${goal.y}`),'Route 12 must keep a walkable north-south bridge spine');
  const {g,local}=prepared();g.save.map='tour_kanto_route_12';g.save.player={x:25,y:64,facing:'right'};
  const before={hp:local.hp,money:g.save.money,experience:local.experience};
  assert(handleJourneyEvent(g,'tourRoute12BridgeCheck'));
  const choice=g.dialogue!.choices!.find(c=>c.label===SPECIES[local.species].name)!;assert(choice);choice.action();
  assert.equal(g.save.flags.fuchsiaRoute12BridgeChecked,true);assert.equal(g.save.flags.fuchsiaRoute12BridgeSpecies,local.species);
  assert.deepEqual({hp:local.hp,money:g.save.money,experience:local.experience},before);
  assert.equal(wildPokemon('tour_kanto_route_12',()=>0),null);
  g.dialogue=null;g.save.player={x:7,y:69,facing:'down'};
  assert(handleRoadTrainer(g,'tourRoute12Trainer'));assert.match(g.dialogue!.pages.join('\n'),/피죤 Lv\.25/);
  assert.equal(g.battle,null);assert.equal(g.save.flags['trainerWon:kanto-route-12-practice'],undefined);
  g.dialogue=null;assert(handleJourneyEvent(g,'tourRoute12Keeper'));assert.match(g.dialogue!.pages.join('\n'),/13번도로 출신 보유 동료/);
});

test('Route 13 limits encounters to its lone side grass and keeps bird practice optional',()=>{
  const route13=TOUR_MAPS.tour_kanto_route_13;
  assert.deepEqual(route13.terrain,[{kind:'tallGrass',x:45,y:5,w:12,h:4}]);
  for(let x=1;x<=70;x++)if(route13.walkable[16][x]==='.')assert(!route13.terrain!.some(r=>x>=r.x&&x<r.x+r.w&&16>=r.y&&16<r.y+r.h));
  const pidgey=wildPokemon('tour_kanto_route_13',()=>0)!;
  assert.equal(pidgey.species,16);assert.equal(pidgey.level,24);assert.equal(pidgey.met,'관동 13번도로');
  const pidgeotto=wildPokemon('tour_kanto_route_13',()=>0.99)!;
  assert.equal(pidgeotto.species,17);assert.equal(pidgeotto.level,25);assert.equal(pidgeotto.met,'관동 13번도로');
  const {g}=prepared();g.save.map='tour_kanto_route_13';g.save.player={x:51,y:25,facing:'right'};
  assert(handleRoadTrainer(g,'tourRoute13Trainer'));assert.match(g.dialogue!.pages.join('\n'),/구구 Lv\.24 \/ 피죤 Lv\.25/);
  assert.equal(g.battle,null);assert.equal(g.save.flags['trainerWon:kanto-route-13-practice'],undefined);
});

test('Route 14 keeps the winding main road safe while side grass and bird practice stay optional',()=>{
  const route14=TOUR_MAPS.tour_kanto_route_14;
  assert.equal(route14.terrain?.length,3);
  for(let y=1;y<=70;y++)if(route14.walkable[y][14]==='.')assert(!route14.terrain!.some(r=>14>=r.x&&14<r.x+r.w&&y>=r.y&&y<r.y+r.h));
  const pidgey=wildPokemon('tour_kanto_route_14',()=>0)!;
  assert.equal(pidgey.species,16);assert.equal(pidgey.level,24);assert.equal(pidgey.met,'관동 14번도로');
  const pidgeotto=wildPokemon('tour_kanto_route_14',()=>0.99)!;
  assert.equal(pidgeotto.species,17);assert.equal(pidgeotto.level,25);assert.equal(pidgeotto.met,'관동 14번도로');
  const {g}=prepared();g.save.map='tour_kanto_route_14';g.save.player={x:19,y:60,facing:'right'};
  assert(handleRoadTrainer(g,'tourRoute14Trainer'));assert.match(g.dialogue!.pages.join('\n'),/구구 Lv\.24 \/ 피죤 Lv\.25/);
  assert.equal(g.battle,null);assert.equal(g.save.flags['trainerWon:kanto-route-14-practice'],undefined);
});

test('a healthy Route 18 companion performs observation and care without rewards or healing',()=>{
  const {g,local}=prepared(),before={hp:local.hp,money:g.save.money,inventory:{...g.save.inventory},experience:local.experience};
  assert(handleJourneyEvent(g,'tourFuchsiaPondGauge'));
  const observe=g.dialogue!.choices!.find(c=>c.label===SPECIES[local.species].name)!;assert(observe);observe.action();
  const localName=SPECIES[local.species].name,particle=((localName.charCodeAt(localName.length-1)-0xac00)%28)?'과':'와';
  assert.match(g.dialogue!.pages[0],new RegExp(`${localName}${particle} 물가 밖에서`));
  assert.equal(g.save.flags.fuchsiaPondObserved,true);assert.equal(g.save.flags.fuchsiaObservationSpecies,local.species);
  g.dialogue=null;assert(handleJourneyEvent(g,'tourFuchsiaCareWash'));
  const wash=g.dialogue!.choices!.find(c=>c.label.includes(SPECIES[local.species].name))!;assert(wash);wash.action();
  assert.match(g.dialogue!.pages[0],new RegExp(`${localName}${particle} 낮은 물그릇`));
  assert.equal(g.save.flags.fuchsiaCareWashed,true);assert.equal(g.save.flags.fuchsiaCareSpecies,local.species);
  assert.deepEqual({hp:local.hp,money:g.save.money,inventory:g.save.inventory,experience:local.experience},before);
  const loaded=parseSave(JSON.stringify(g.save))!;assert(loaded);assert.equal(loaded.flags.fuchsiaCareSpecies,local.species);
});

test('Fuchsia center, PC and mart retain the shared service contracts',()=>{
  const {g,local}=prepared();local.hp=1;g.save.map='tour_fuchsia_center';g.event('tourHost');
  assert.equal(local.hp,local.maxHp);assert.equal(g.save.healingPoint,'tour_fuchsia_center');assert.match(g.dialogue!.pages[0],/건강해졌어요/);
  assert.equal(depositPokemon(g.save,1),`${SPECIES[local.species].name}을 박스에 맡겼다.\n센터 PC에서 다시 데려올 수 있다.`);assert.equal(g.save.box.length,1);
  assert.match(withdrawPokemon(g.save,0),/파티로 돌아왔다/);assert.equal(g.save.party.length,2);
  g.save.money=1000;g.save.map='tour_fuchsia_mart';assert.equal(purchase(g.save,0,2),'몬스터볼 2개를 샀다!\n남은 돈 600원');assert.equal(g.save.inventory.pokeBalls,2);
});
