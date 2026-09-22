import { newSave } from '../src/save';
import test from 'node:test';
import assert from 'node:assert/strict';
import { Engine } from '../src/engine';
import { TOUR_MAPS } from '../src/explore-world';
import { handleJourneyEvent } from '../src/journey-services';
import { encounterPool,wildPokemon } from '../src/runtime-encounters';
import { ROAD_TRAINER_DATABASE } from '../src/road-trainers';
import { grantPokemon,pokemonMoves } from '../src/pokemon';
import { battleTurn,createTrainerBattle } from '../src/battle';
import { maxHpAtLevel } from '../src/growth';

test('Unova Route 8 connects Icirrus, Moor and Tubeline with a safe main road',()=>{
  const route=TOUR_MAPS.tour_unova_route_08,moor=TOUR_MAPS.tour_icirrus_moor;
  assert.deepEqual([route.width,route.height],[64,36]);assert.deepEqual([moor.width,moor.height],[56,48]);
  assert(route.warps.some(w=>w.to==='tour_icirrus'));
  assert(route.warps.some(w=>w.to==='tour_tubeline_bridge'));
  assert(route.warps.some(w=>w.to==='tour_icirrus_moor'));
  assert(moor.warps.some(w=>w.to==='tour_unova_route_08'));
  for(let x=1;x<63;x++)assert.equal(route.walkable[18][x],'.',`safe road ${x},18`);
  for(const patch of route.terrain??[])for(let y=patch.y;y<patch.y+patch.h;y++)for(let x=patch.x;x<patch.x+patch.w;x++)assert.equal(route.walkable[y][x],'.',`encounter tile ${x},${y}`);
});

test('Icirrus city, Route 8, Moor and its tower approach share one local audio scene',()=>{
  const g=new Engine();g.announce=()=>{};g.persist=()=>true;g.save=newSave();g.panel='field';
  for(const map of ['tour_icirrus','tour_icirrus_center','tour_unova_route_08','tour_icirrus_moor','tour_dragonspiral_approach'] as const){
    g.save.map=map;g.save.player={x:TOUR_MAPS[map].warps[0]?.spawn.x??3,y:TOUR_MAPS[map].warps[0]?.spawn.y??3,facing:'down'};g.update(0);
    assert.equal(g.audio.scene,'icirrus',map);
  }
  g.save.map='tour_tubeline_bridge';g.save.player={x:2,y:9,facing:'right'};g.update(0);assert.equal(g.audio.scene,'town');
});

test('Dragonspiral grounds and public floors use their own scene beyond the Icirrus approach',()=>{
  const g=new Engine();g.announce=()=>{};g.persist=()=>true;g.save=newSave();g.panel='field';
  g.save.map='tour_dragonspiral_approach';g.save.player={x:24,y:3,facing:'up'};g.update(0);assert.equal(g.audio.scene,'icirrus');
  for(const map of ['tour_dragonspiral','tour_dragonspiral_hall','tour_dragonspiral_hall_2f','tour_dragonspiral_hall_3f'] as const){
    g.save.map=map;g.save.player={x:TOUR_MAPS[map].warps[0]?.spawn.x??24,y:TOUR_MAPS[map].warps[0]?.spawn.y??44,facing:'up'};g.update(0);assert.equal(g.audio.scene,'dragonspiral',map);
  }
});

test('Route 8 uses the sourced level-capped pool and optional trainer',()=>{
  const pool=encounterPool('tour_unova_route_08')!;
  assert.equal(pool.id,'LOCAL-U-R08-DAY');assert.deepEqual(pool.levels,[24,25]);
  assert.deepEqual(pool.slots.map(s=>[s.speciesId,s.weight]),[[588,50],[616,50]]);
  let calls=0;const first=wildPokemon('tour_unova_route_08',()=>calls++?0:0.1)!;
  calls=0;const second=wildPokemon('tour_unova_route_08',()=>calls++?1-Number.EPSILON:0.9)!;
  assert.deepEqual([first.species,first.level,first.met],[588,24,'하나 8번도로']);
  assert.deepEqual([second.species,second.level,second.met],[616,25,'하나 8번도로']);
  const trainer=ROAD_TRAINER_DATABASE.get('tour_unova_route_08:tourRouteEightTrainer')!;
  assert.deepEqual(trainer.team,[[588,18],[616,19]]);assert(trainer.localPages?.join('').includes('가운데 마른 본선'));
});

test('A level-capped starter and one Route 8 capture can clear the optional trainer',()=>{
  const g=new Engine();g.announce=()=>{};g.persist=()=>true;g.save=newSave();g.panel='field';grantPokemon(g.save,7);
  const starter=g.save.party[0];starter.level=25;starter.maxHp=maxHpAtLevel(starter.species,starter.level);starter.hp=starter.maxHp;starter.moves=pokemonMoves(starter);
  g.save.party.push(wildPokemon('tour_unova_route_08',()=>0)!);
  const trainer=ROAD_TRAINER_DATABASE.get('tour_unova_route_08:tourRouteEightTrainer')!;
  const team=trainer.team.map(([species,level])=>{const maxHp=maxHpAtLevel(species,level),mon={species,level,hp:maxHp,maxHp,experience:0,nature:'성실',met:'연습 배틀'};return {...mon,moves:pokemonMoves(mon)};});
  const battle=createTrainerBattle(g.save,{id:trainer.id,name:trainer.name,reward:trainer.reward,team})!;
  let result;
  for(const action of ['move0','move0','move0','move1','move0','move0','move0','move0'] as const){result=battleTurn(g.save,battle,action);if(result.outcome)break;}
  assert.equal(result?.outcome,'won');assert(g.save.party.some(mon=>mon.hp>0));assert.equal(g.save.money,trainer.reward);
});

test('Moor companion observation persists in sequence without rewards or locks',()=>{
  const g=new Engine();g.announce=()=>{};g.persist=()=>true;g.save=newSave();g.panel='field';grantPokemon(g.save,7);
  g.save.map='tour_icirrus_moor';g.save.player={x:31,y:37,facing:'up'};
  assert.equal(handleJourneyEvent(g,'tourGuide'),true);g.dialogue!.choices![0].action();
  assert.equal(g.save.flags.icirrusMoorPartnerSpecies,7);
  assert.equal(handleJourneyEvent(g,'tourIcirrusMoorReeds'),true);assert.equal(g.save.flags.icirrusMoorReedsObserved,true);
  assert.equal(handleJourneyEvent(g,'tourIcirrusMoorBirds'),true);assert.equal(g.save.flags.icirrusMoorBirdsObserved,true);
  const before={money:g.save.money,inventory:{...g.save.inventory},hp:g.save.party[0].hp,experience:g.save.party[0].experience};
  assert.equal(handleJourneyEvent(g,'tourIcirrusMoorNorth'),true);assert.equal(g.save.flags.icirrusMoorObservationCompleted,true);
  assert.deepEqual({money:g.save.money,inventory:g.save.inventory,hp:g.save.party[0].hp,experience:g.save.party[0].experience},before);
  assert.equal(TOUR_MAPS.tour_icirrus_moor.warps[0].to,'tour_unova_route_08');
});

test('Dragonspiral approach offers optional companion ecology without changing travel or rewards',()=>{
  const g=new Engine();g.announce=()=>{};let persisted=0;g.persist=()=>{persisted++;return true;};g.save=newSave();g.panel='field';grantPokemon(g.save,7);
  g.save.map='tour_dragonspiral_approach';g.save.player={x:34,y:12,facing:'right'};g.save.flags.icirrusMoorObservationCompleted=true;
  assert.equal(handleJourneyEvent(g,'tourGuide'),true);assert.match(g.dialogue!.pages.join('\n'),/갈대와 물새 흔적/);
  assert(g.dialogue!.choices?.some(c=>c.label==='해자 관찰 데크'));assert(g.dialogue!.choices?.some(c=>c.label==='용나선탑 기슭'));assert(g.dialogue!.choices?.some(c=>c.label==='설화시티 북문'));
  const before={money:g.save.money,inventory:{...g.save.inventory},hp:g.save.party[0].hp,experience:g.save.party[0].experience};
  assert.equal(handleJourneyEvent(g,'tourDragonspiralMoat'),true);g.dialogue!.choices![0].action();
  assert.equal(g.save.flags.dragonspiralApproachMoatObserved,true);assert.equal(persisted,1);
  assert.equal(g.save.flags.dragonspiralApproachPartnerSpecies,7);
  assert.deepEqual({money:g.save.money,inventory:g.save.inventory,hp:g.save.party[0].hp,experience:g.save.party[0].experience},before);
  assert.equal(handleJourneyEvent(g,'tourDragonspiralGate'),true);assert.match(g.dialogue!.pages.join('\n'),/동행 관찰 기록/);
  g.save.map='tour_dragonspiral';assert.equal(handleJourneyEvent(g,'tourGuide'),true);assert.match(g.dialogue!.pages.join('\n'),/꼬부기와 남쪽 해자 가장자리/);
  const towerPidove=TOUR_MAPS.tour_dragonspiral.npcs.find(n=>n.id==='tourPokemon');assert.equal(towerPidove?.sprite,'field-pidove');
  assert.equal(handleJourneyEvent(g,'tourPokemon'),true);assert.match(g.dialogue!.pages.join('\n'),/남쪽 해자에서 기록한 갈대 방향/);assert.match(g.dialogue!.pages.join('\n'),/야생 조우나 포획 대상이 아니다/);
  g.save.map='tour_dragonspiral_hall';assert.equal(handleJourneyEvent(g,'tourDragonspiralBaseStone'),true);g.dialogue!.choices![0].action();
  assert.equal(handleJourneyEvent(g,'tourDragonspiralMoatChart'),true);assert.match(g.dialogue!.pages.join('\n'),/접근로에서 꼬부기와/);assert.match(g.dialogue!.pages.join('\n'),/같은 기록/);
  assert(TOUR_MAPS.tour_dragonspiral_approach.warps.some(w=>w.to==='tour_icirrus'));
  assert(TOUR_MAPS.tour_dragonspiral_approach.warps.some(w=>w.to==='tour_dragonspiral'));
});

test('Route capture, trainer result and Moor record reach Icirrus guidance',()=>{
  const g=new Engine();g.announce=()=>{};g.persist=()=>true;g.save=newSave();g.panel='field';grantPokemon(g.save,7);
  const local=wildPokemon('tour_unova_route_08',()=>0)!;g.save.box=[local];
  g.save.flags['trainerWon:unova-route-8-practice']=true;g.save.flags.icirrusMoorObservationCompleted=true;
  g.save.map='tour_unova_route_08';
  assert.equal(handleJourneyEvent(g,'tourGuide'),true);assert.match(g.dialogue!.pages.join('\n'),/보유 동료 1마리/);assert.match(g.dialogue!.pages.join('\n'),/겨룬 기록/);assert.match(g.dialogue!.pages.join('\n'),/모두 살핀 기록/);
  g.event('tourRouteEightTrainer');assert(g.dialogue!.choices?.some(c=>c.label==='설화센터에서 편성'));assert(g.dialogue!.choices?.some(c=>c.label==='설화의 습지 관찰'));
  g.save.map='tour_icirrus_center';assert.equal(handleJourneyEvent(g,'tourIcirrusCenterGuide'),true);
  assert.match(g.dialogue!.pages.join('\n'),/PC 1마리/);assert(g.dialogue!.choices?.some(c=>c.label==='8번도로 재방문'));assert(g.dialogue!.choices?.some(c=>c.label==='설화의 습지 관찰'));
  g.save.map='tour_icirrus';assert.equal(handleJourneyEvent(g,'tourResident0'),true);assert.match(g.dialogue!.pages.join('\n'),/파티와 PC에 1마리/);
  assert.equal(handleJourneyEvent(g,'tourResident3'),true);assert.match(g.dialogue!.pages.join('\n'),/갈대와 물새 흔적/);
});

test('Dragonspiral return record reaches Icirrus center, hall and north resident',()=>{
  const g=new Engine();g.announce=()=>{};g.persist=()=>true;g.save=newSave();g.panel='field';grantPokemon(g.save,7);
  Object.assign(g.save.flags,{dragonspiralApproachMoatObserved:true,dragonspiralApproachPartnerSpecies:7,dragonspiralBaseObserved:true,dragonspiralMasonryObserved:true,dragonspiralWindRecorded:true,dragonspiralPartnerSpecies:7});
  g.save.map='tour_icirrus_center';assert.equal(handleJourneyEvent(g,'tourIcirrusCenterGuide'),true);assert.match(g.dialogue!.pages.join('\n'),/공개 1~3층 관찰 완료 · 꼬부기/);assert(g.dialogue!.choices?.some(c=>c.label==='용나선탑 기록 다시 보기'));
  g.save.map='tour_icirrus_hall_3f';assert.equal(handleJourneyEvent(g,'tourIcirrusCompanionRest'),true);assert.match(g.dialogue!.pages.join('\n'),/3층에서 세 방향 바람/);
  g.save.map='tour_icirrus';assert.equal(handleJourneyEvent(g,'tourResident2'),true);assert.match(g.dialogue!.pages.join('\n'),/꼬부기와 탑 3층/);assert.equal(handleJourneyEvent(g,'tourResident3'),true);assert.match(g.dialogue!.pages.join('\n'),/같은 북문 길로 잘 돌아왔/);
});

test('Icirrus homes turn wetland and tower travel into optional daily-life records',()=>{
  const g=new Engine();g.announce=()=>{};g.persist=()=>true;g.save=newSave();g.panel='field';grantPokemon(g.save,7);
  Object.assign(g.save.flags,{icirrusMoorObservationCompleted:true,icirrusWaterCompared:true,dragonspiralApproachMoatObserved:true,dragonspiralApproachPartnerSpecies:7,dragonspiralBaseObserved:true,dragonspiralMasonryObserved:true,dragonspiralWindRecorded:true,dragonspiralPartnerSpecies:7});
  const before={hp:g.save.party[0].hp,experience:g.save.party[0].experience,money:g.save.money,inventory:{...g.save.inventory}};
  g.save.map='tour_icirrus_home1';assert.equal(handleJourneyEvent(g,'tourIcirrusGearCare'),true);g.dialogue!.choices![0].action();assert.equal(g.save.flags.icirrusGearChecked,true);assert.equal(g.save.flags.icirrusGearSpecies,7);
  g.save.map='tour_icirrus_home1_2f';assert.equal(handleJourneyEvent(g,'tourIcirrusRainLedger'),true);assert.match(g.dialogue!.pages.join('\n'),/갈대 수위와 물새 흔적/);
  g.save.map='tour_icirrus_home2_2f';assert.equal(handleJourneyEvent(g,'tourIcirrusTowerMap'),true);assert.match(g.dialogue!.pages.join('\n'),/꼬부기와 탑 1층 기단/);
  g.save.map='tour_icirrus_home2_3f';assert.equal(handleJourneyEvent(g,'tourIcirrusWindRest'),true);assert.equal(g.save.flags.icirrusTowerReturnRested,true);
  assert.deepEqual({hp:g.save.party[0].hp,experience:g.save.party[0].experience,money:g.save.money,inventory:g.save.inventory},before);
});

test('Icirrus mart separates supplies, recovery and the three local travel branches',()=>{
  const g=new Engine();g.announce=()=>{};g.persist=()=>true;g.save=newSave();g.panel='field';grantPokemon(g.save,7);g.save.inventory={pokeBalls:4,potions:2};g.save.money=1600;
  g.save.map='tour_icirrus_mart';assert.equal(handleJourneyEvent(g,'tourIcirrusMartGuide'),true);
  assert.match(g.dialogue!.pages.join('\n'),/몬스터볼 4개 · 상처약 2개 · 소지금 1600원/);assert.match(g.dialogue!.pages.join('\n'),/상점이 아니라 설화시티 포켓몬센터/);
  assert.deepEqual(g.dialogue!.choices?.map(c=>c.label),['상점 카운터','8번도로 준비','설화의 습지 준비','용나선탑 준비','준비를 마친다']);
});

test('Tubeline companion inspection reaches Route 9 without rewards or travel locks',()=>{
  const g=new Engine();g.announce=()=>{};g.persist=()=>true;g.save=newSave();g.panel='field';grantPokemon(g.save,7);g.save.map='tour_tubeline_bridge';g.save.player={x:41,y:11,facing:'up'};
  const before={hp:g.save.party[0].hp,experience:g.save.party[0].experience,money:g.save.money,inventory:{...g.save.inventory}};
  assert.equal(handleJourneyEvent(g,'tourGuide'),true);g.dialogue!.choices![0].action();assert.equal(handleJourneyEvent(g,'tourTubelineWestFrame'),true);assert.equal(g.save.flags.tubelineWestFrameChecked,true);
  assert.equal(handleJourneyEvent(g,'tourTubelineEastFrame'),true);assert.equal(g.save.flags.tubelineCrossingChecked,true);
  g.save.map='tour_unova_route_09';assert.equal(handleJourneyEvent(g,'tourGuide'),true);assert.match(g.dialogue!.pages.join('\n'),/꼬부기와 튜브라인브리지를 점검/);assert.equal(handleJourneyEvent(g,'tourRouteNineRest'),true);assert.match(g.dialogue!.pages.join('\n'),/횡단 점검을 마친 동료/);
  assert.equal(handleJourneyEvent(g,'tourRouteNineMall'),true);assert.equal(g.save.flags.routeNineMallFrontChecked,true);assert.match(g.dialogue!.pages.join('\n'),/보행선·하역선/);
  assert.equal(handleJourneyEvent(g,'tourRouteNineGrass'),true);assert.equal(g.save.flags.routeNineGrassPathChecked,true);assert.match(g.dialogue!.pages.join('\n'),/여행 기록을 완성/);
  assert.equal(TOUR_MAPS.tour_unova_route_09.warps.find(w=>w.to==='tour_unova_mall_nine_1f')?.x,28);assert.equal(TOUR_MAPS.tour_unova_mall_nine_1f.width,36);assert.equal(TOUR_MAPS.tour_unova_mall_nine_1f.height,28);
  g.save.map='tour_unova_mall_nine_1f';assert.equal(handleJourneyEvent(g,'tourGuide'),true);assert.match(g.dialogue!.pages.join('\n'),/판매·상층 이동/);assert.equal(handleJourneyEvent(g,'tourMallNineRest'),true);assert.match(g.dialogue!.pages.join('\n'),/HP·상태·기술 횟수는 회복하지 않는다/);
  g.save.map='tour_unova_route_09';
  assert.equal(TOUR_MAPS.tour_unova_route_09.npcs.find(n=>n.id==='tourPokemon')?.sprite,'field-pidove');assert.equal(handleJourneyEvent(g,'tourPokemon'),true);assert.match(g.dialogue!.pages.join('\n'),/9번도로 야생 조우나 포획 대상이 아니다/);
  assert.deepEqual({hp:g.save.party[0].hp,experience:g.save.party[0].experience,money:g.save.money,inventory:g.save.inventory},before);
});
