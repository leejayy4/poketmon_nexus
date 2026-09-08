import test from 'node:test';
import assert from 'node:assert/strict';
import {adventureObjective,adventureGuide} from '../src/adventure-guide';
import {newSave,parseSave} from '../src/save';
import {grantPokemon} from '../src/pokemon';
import {GYMS} from '../src/gyms';
import {getMap,canEnter} from '../src/maps';
import {worldSpawn} from '../src/unified-world';
import {markTourVisit} from '../src/explore-journal';
import {planTourNavigation} from '../src/explore-navigation';
import {TOUR_MAPS,tourPlaceForMap} from '../src/explore-world';
import {FLOOR_PARENTS} from '../src/journey-world';
import {Engine} from '../src/engine';
import type {MapId,Direction} from '../src/types';

function ready(map:MapId='tour_vermilion'){
  const s=newSave();grantPokemon(s,1);s.flags.departureCleared=true;s.flags.observationCollected=true;s.flags.researchDelivered=true;s.flags.ferryPass=true;s.badges=GYMS.map(g=>g.badge);s.keyItems=GYMS.map(g=>g.tm);s.map=map;s.player={...worldSpawn(map)!,facing:'down'};return s;
}
test('free exploration chooses the local landmark, then the actual same-region road to an unvisited landmark',()=>{
  const s=ready(),before=structuredClone(s);assert.equal(adventureObjective(s)!.map,'tour_vermilion_hall');assert.deepEqual(s,before);
  s.tourVisited=['tour_vermilion','tour_vermilion_hall'];
  for(const map of ['tour_vermilion','tour_vermilion_center','tour_pass_vermilion_cerulean','tour_cerulean'] as const){
    s.map=map;s.player={...worldSpawn(map)!,facing:'down'};const before=structuredClone(s),goal=adventureObjective(s)!;
    assert.equal(goal.map,'tour_cerulean_hall');assert.equal(goal.event,'tourHost');assert.deepEqual(s,before);
    const nav=planTourNavigation(s,goal.map,undefined,goal.event)!;assert.equal(nav.status,'walking');assert(nav.maps.every(id=>tourPlaceForMap(id)?.region==='관동'));assert(!nav.maps.some(id=>id.includes('mart')));
    if(map==='tour_vermilion_center')assert.equal(nav.exit!.to,'tour_vermilion');
  }
});
test('an entered landmark stays available for leisurely inspection until leaving, without inventing completion flags',()=>{
  const s=ready('tour_vermilion_hall');markTourVisit(s);const before=structuredClone(s),goal=adventureObjective(s)!;
  assert.equal(goal.map,s.map);assert.equal(goal.event,'tourHost');assert.match(goal.action,/천천히 살펴/);assert.deepEqual(s,before);
  const nav=planTourNavigation(s,goal.map,undefined,goal.event)!;assert(nav.interaction);s.player={...nav.tiles.at(-1)!,facing:nav.interaction.facing};assert.equal(planTourNavigation(s,goal.map,undefined,goal.event)!.status,'arrived');
  assert.equal(adventureObjective(s)!.map,'tour_vermilion_hall');
  s.map='tour_vermilion';s.player={...worldSpawn(s.map)!,facing:'down'};assert.equal(adventureObjective(s)!.map,'tour_cerulean_hall');
  const restored=parseSave(JSON.stringify(s));assert(restored);assert.deepEqual(adventureObjective(restored),adventureObjective(s));
  for(const [floor,parent] of Object.entries(FLOOR_PARENTS).filter(([,parent])=>parent==='tour_vermilion_hall')){s.map=floor as MapId;assert.equal(adventureObjective(s)!.map,floor);assert.equal(adventureObjective(s)!.event,'tourHost');}
});
test('the aquarium itinerary reaches the real exit tiles and final speaking face while the goal stays stable on the road',()=>{
  const s=ready();s.tourVisited=['tour_vermilion','tour_vermilion_hall'];
  for(let i=0;i<5;i++){
    const goal=adventureObjective(s)!;assert.equal(goal.map,'tour_cerulean_hall');const map=getMap(s.map,s.flags),nav=planTourNavigation(s,goal.map,undefined,goal.event)!;
    assert.notEqual(nav.status,'blocked');assert(nav.tiles.length>0);
    for(let j=1;j<nav.tiles.length;j++){const a=nav.tiles[j-1],b=nav.tiles[j];const direction:Direction=b.x>a.x?'right':b.x<a.x?'left':b.y>a.y?'down':'up';assert(canEnter(map,b.x,b.y,direction));}
    if(nav.interaction){s.player={...nav.tiles.at(-1)!,facing:nav.interaction.facing};assert.equal(planTourNavigation(s,goal.map,undefined,goal.event)!.status,'arrived');assert(map.npcs.some(n=>n.x===nav.interaction!.x&&n.y===nav.interaction!.y&&n.dialogue===goal.event));return;}
    assert(nav.exit);s.map=nav.exit.to;s.player={...nav.exit.spawn,facing:nav.exit.facing};markTourVisit(s);
  }
  assert.fail('must reach the aquarium host');
});
test('unfinished story and critical recovery retain priority, and a fully visited region does not force another region',()=>{
  const s=ready();s.badges.pop();assert.equal(adventureObjective(s)!.id,'maylene');s.badges=GYMS.map(g=>g.badge);
  delete s.flags.observationCollected;assert.equal(adventureObjective(s)!.id,'observation');s.flags.observationCollected=true;delete s.flags.researchDelivered;assert.equal(adventureObjective(s)!.id,'research');s.flags.researchDelivered=true;delete s.flags.ferryPass;assert.equal(adventureObjective(s)!.id,'ferry');s.flags.ferryPass=true;
  s.party[0].hp=1;assert.equal(adventureGuide(s)!.objective.map,'tour_vermilion_center');s.party[0].hp=s.party[0].maxHp;
  s.tourVisited=Object.keys(TOUR_MAPS).filter(id=>tourPlaceForMap(id)?.region==='관동') as typeof s.tourVisited;const before=structuredClone(s),goal=adventureObjective(s)!;
  assert.equal(goal.map,s.map);assert.match(goal.action,/지도에서/);assert(!goal.action.includes('왕복선'));assert.deepEqual(s,before);
});
test('Engine objective navigation refreshes when a newly recorded landmark changes its destination',()=>{
  const g=new Engine();g.save=ready();g.followingObjective=true;assert.equal(g.tourNavigation?.destination,'tour_vermilion_hall');
  g.save.tourVisited=['tour_vermilion','tour_vermilion_hall'];assert.equal(g.tourNavigation?.destination,'tour_cerulean_hall');assert.equal(g.tourNavigation?.status,'walking');
});
