import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { TOUR_MAPS } from '../src/explore-world';
import { handleSinnohCelesticLife } from '../src/sinnoh-celestic-life';
import { handleRoadTrainer } from '../src/road-trainers';
import { battleTurn } from '../src/battle';
import { SPECIES } from '../src/pokemon';
import { encounterPool, wildPokemon } from '../src/runtime-encounters';

const fixture=()=>JSON.parse(readFileSync('tests/eterna-combat-played-save.json','utf8'));

test('211 pass pages to Budew and preserves the optional two-layer record',()=>{
  const save=fixture();save.map='tour_coronet_211_pass';let dialogue:any;
  const game:any={save,battle:null,panel:'field',partyIndex:0,audio:{play(){}},persist(){},say(speaker:string,pages:string[],after?:()=>void,choices?:any[]){dialogue={speaker,pages,after,choices};},setTourDestination(){}};
  assert.equal(handleSinnohCelesticLife(game,'coronet211Guide'),true);
  const next=dialogue.choices.find((choice:any)=>choice.label==='다음 동료들');assert.ok(next);next.action();
  const budew=dialogue.choices.find((choice:any)=>choice.label==='꼬몽울');assert.ok(budew);budew.action();
  assert.equal(save.flags.coronet211Partner,406);assert.match(dialogue.pages[0],/꼬몽울과/);
  handleSinnohCelesticLife(game,'coronet211WestLayer');assert.equal(save.flags.coronet211WestLayerChecked,true);assert.equal(save.flags.coronet211LayersCompared,false);
  handleSinnohCelesticLife(game,'coronet211EastLayer');assert.equal(save.flags.coronet211EastLayerChecked,true);assert.equal(save.flags.coronet211LayersCompared,true);
});

test('both 211 road trainers offer optional battles',()=>{
  const save=fixture();let dialogue:any;
  const game:any={save,battle:null,say(speaker:string,pages:string[],after?:()=>void,choices?:any[]){dialogue={speaker,pages,after,choices};}};
  for(const [map,event] of [['tour_sinnoh_route_211_west','route211WestTrainer'],['tour_sinnoh_route_211_east','route211EastTrainer']]){
    save.map=map;dialogue=undefined;assert.equal(handleRoadTrainer(game,event),true);
    assert.ok(dialogue.choices.some((choice:any)=>choice.label==='배틀한다'));
    assert.ok(dialogue.choices.some((choice:any)=>choice.label==='다음에 한다'));
  }
});

test('Route 210 north trainer remains optional and advertises its complete team',()=>{
  const save=fixture();save.map='tour_sinnoh_route_210_north';let dialogue:any;const game:any={save,battle:null,say(speaker:string,pages:string[],after?:()=>void,choices?:any[]){dialogue={speaker,pages,after,choices};}};
  assert.equal(handleRoadTrainer(game,'route210NorthTrainer'),true);assert.match(dialogue.pages.join('\n'),/요가랑/);assert.match(dialogue.pages.join('\n'),/알통몬/);assert.ok(dialogue.choices.some((choice:any)=>choice.label==='다음에 한다'));
});

test('211 east battle advances from Ponyta to Machop and awards 460 on the final win',()=>{
  const save=fixture();save.map='tour_sinnoh_route_211_east';const before=save.money;let dialogue:any;
  const game:any={save,battle:null,persist(){},say(speaker:string,pages:string[],after?:()=>void,choices?:any[]){dialogue={speaker,pages,after,choices};}};
  assert.equal(handleRoadTrainer(game,'route211EastTrainer'),true);
  dialogue.choices.find((choice:any)=>choice.label==='배틀한다').action();
  assert.equal(game.battle.enemy.species,77);assert.equal(game.battle.enemy.level,17);
  game.battle.enemy.hp=1;battleTurn(save,game.battle,'move0',()=>0);
  assert.equal(game.battle.enemy.species,66);assert.equal(game.battle.enemy.level,18);assert.equal(game.battle.betweenOpponents,true);
  game.battle.betweenOpponents=false;game.battle.enemy.hp=1;
  const result=battleTurn(save,game.battle,'move0',()=>0);
  assert.equal(result.outcome,'won');assert.equal(result.reward,460);assert.equal(save.money,before+460);
});

test('211 route warps and every interaction have a reachable approach',()=>{
  for(const id of ['tour_sinnoh_route_211_west','tour_coronet_211_pass','tour_sinnoh_route_211_east','tour_celestic','tour_sinnoh_route_210_north','tour_celestic_ruins','tour_celestic_center','tour_celestic_shop','tour_celestic_home']){
    const map:any=TOUR_MAPS[id];assert.ok(map);
    const start={x:map.warps[0].x,y:map.warps[0].y},key=(x:number,y:number)=>`${x},${y}`;
    const seen=new Set<string>([key(start.x,start.y)]),queue=[start];
    while(queue.length){const point=queue.shift()!;for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const x=point.x+dx,y=point.y+dy,k=key(x,y);if(!seen.has(k)&&map.walkable[y]?.[x]==='.')seen.add(k),queue.push({x,y});}}
    for(const warp of map.warps)assert.ok(seen.has(key(warp.x,warp.y)),`${id} warp ${warp.x},${warp.y} is unreachable`);
    for(const object of map.npcs)assert.ok([[1,0],[-1,0],[0,1],[0,-1]].some(([dx,dy])=>seen.has(key(object.x+dx,object.y+dy))),`${id} ${object.dialogue} has no reachable facing tile`);
    for(const event of new Set(map.props.map((p:any)=>p.dialogue)))assert.ok(map.props.filter((p:any)=>p.dialogue===event).some((object:any)=>[[1,0],[-1,0],[0,1],[0,-1]].some(([dx,dy])=>seen.has(key(object.x+dx,object.y+dy)))),`${id} ${event} has no reachable facing tile`);
  }
});

test('Celestic keeps its east-west road and ruins approach clear of residents',()=>{
  const map:any=TOUR_MAPS.tour_celestic;
  for(let x=1;x<=38;x++)assert.ok(!map.npcs.some((n:any)=>n.x===x&&n.y===20),`resident blocks Celestic main road at ${x},20`);
  for(let y=14;y<=20;y++)assert.ok(!map.npcs.some((n:any)=>n.x===20&&n.y===y),`resident blocks Celestic ruins approach at 20,${y}`);
});

test('Celestic continues through Route 210 north and the public ruins return to town',()=>{
  const town:any=TOUR_MAPS.tour_celestic,north:any=TOUR_MAPS.tour_sinnoh_route_210_north,south:any=TOUR_MAPS.tour_sinnoh_route_210_south,ruins:any=TOUR_MAPS.tour_celestic_ruins;
  assert.deepEqual(town.warps.map((w:any)=>w.to),['tour_sinnoh_route_211_east','tour_sinnoh_route_210_north','tour_celestic_ruins','tour_celestic_center','tour_celestic_shop','tour_celestic_home']);
  assert.equal(north.warps[0].to,'tour_celestic');assert.equal(north.warps[1].to,'tour_sinnoh_route_210_south');
  assert.ok(south.warps.some((w:any)=>w.to==='tour_sinnoh_route_210_north'));
  assert.equal(ruins.warps[0].to,'tour_celestic');assert.equal(ruins.width,24);assert.equal(ruins.height,20);
});

test('Celestic ruins connects the selected companion layer record to the stone exhibit',()=>{
  const save=fixture();save.map='tour_celestic_ruins';save.flags.coronet211PartnerSlot=0;save.flags.coronet211Partner=save.party[0].species;save.flags.coronet211LayersCompared=true;let dialogue:any;
  const game:any={save,battle:null,say(speaker:string,pages:string[]){dialogue={speaker,pages};}};
  assert.equal(handleSinnohCelesticLife(game,'tourCelesticRuinsStone'),true);assert.match(dialogue.pages.join('\n'),/현장 기록/);assert.match(dialogue.pages.join('\n'),new RegExp(SPECIES[save.party[0].species].name));
});

test('Celestic ruins exhibits use world-interaction event ids',()=>{
  const ruins:any=TOUR_MAPS.tour_celestic_ruins;
  assert.deepEqual([...new Set(ruins.props.map((p:any)=>p.dialogue))].sort(),[
    'tourCelesticRuinsMural','tourCelesticRuinsRecord','tourCelesticRuinsStone',
  ]);
});

test('Route 210 north has a sourced optional encounter grove and a safe main path',()=>{
  const map:any=TOUR_MAPS.tour_sinnoh_route_210_north;
  assert.deepEqual(map.terrain,[{kind:'tallGrass',x:31,y:39,w:7,h:4}]);
  assert.equal(encounterPool(map.id)?.node,'S-R210-NORTH-DAY');
  const low=[0,0],high=[.99,.99];
  assert.deepEqual([wildPokemon(map.id,()=>low.shift()!)?.species,wildPokemon(map.id,()=>high.shift()!)?.species],[307,66]);
  for(let y=39;y<=43;y++)for(let x=24;x<=30;x++)assert.ok(!map.terrain.some((t:any)=>x>=t.x&&x<t.x+t.w&&y>=t.y&&y<t.y+t.h),`main path grass at ${x},${y}`);
});

test('Celestic residents and ruins recognize a companion caught on Route 210 north',()=>{
  const save=fixture(),caught={...save.party[0],species:307,met:'신오 210번도로 북부'};save.party.push(caught);let dialogue:any;
  const game:any={save,battle:null,say(speaker:string,pages:string[]){dialogue={speaker,pages};}};
  save.map='tour_celestic';assert.equal(handleSinnohCelesticLife(game,'celesticResident'),true);assert.match(dialogue.pages.join('\n'),/요가랑.*잘 적응/s);
  save.party.pop();save.box.push(caught);handleSinnohCelesticLife(game,'celesticResident');assert.match(dialogue.pages.join('\n'),/PC에서 쉬고/);
  save.map='tour_celestic_ruins';handleSinnohCelesticLife(game,'tourCelesticRuinsRecord');assert.match(dialogue.pages.join('\n'),/요가랑.*안개 숲 관찰/s);
});

test('Celestic has a center, household shop and family home with return warps',()=>{
  const town:any=TOUR_MAPS.tour_celestic;
  assert.deepEqual(town.warps.filter((w:any)=>w.to.startsWith('tour_celestic_')).map((w:any)=>w.to).sort(),['tour_celestic_center','tour_celestic_home','tour_celestic_ruins','tour_celestic_shop']);
  for(const [id,size] of [['tour_celestic_center',[28,22]],['tour_celestic_shop',[24,20]],['tour_celestic_home',[24,20]]] as const){const map:any=TOUR_MAPS[id];assert.deepEqual([map.width,map.height],size);assert.equal(map.warps[0].to,'tour_celestic');}
  assert.ok(town.warps.some((w:any)=>w.to==='tour_celestic_center'&&w.x===31&&w.y===9));
  assert.ok(town.warps.some((w:any)=>w.to==='tour_celestic_shop'&&w.x===8&&w.y===30));
});

