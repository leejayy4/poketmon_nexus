import { grantPokemon } from '../src/pokemon';
import test from 'node:test';
import assert from 'node:assert/strict';
import { Engine } from '../src/engine';
import { newSave,parseSave } from '../src/save';
import { markTourVisit,tourVisitSummary } from '../src/explore-journal';
import { TOUR_MAPS,TOUR_INTERIORS,TOUR_SPAWNS,type TourId } from '../src/explore-world';
import { PASSAGES } from '../src/journey-world';
import { checkpoint,encodeSave,decodeSave,SaveLibrary } from '../src/save-library';
function tour(){const g=new Engine();g.exploring=true;g.save=g.freshSave();return g}
function step(g:Engine,key:string){g.press(key);g.release(key);for(let i=0;i<20;i++)g.update(.04)}
test('guidance does not record a visit; actual door arrivals and public travel do, once',()=>{
  const g=tour();g.setTourDestination('tour_jubilife');assert.deepEqual(g.save.tourVisited??[],[]);
  grantPokemon(g.save,7);g.save.flags.departureCleared=true;g.save.map='route_s01';g.save.player={x:3,y:12,facing:'left'};step(g,'ArrowLeft');assert.equal(g.save.map,'tour_jubilife');assert.deepEqual(g.save.tourVisited,['tour_jubilife']);
  g.save.player={x:8,y:9,facing:'up'};step(g,'ArrowUp');assert.equal(g.save.map,'tour_jubilife_center');assert.deepEqual(g.save.tourVisited,['tour_jubilife','tour_jubilife_center']);
  g.exploreTo('tour_jubilife');g.exploreTo('tour_jubilife_center');assert.equal(g.save.tourVisited?.length,2);
  g.exploreTo('tour_canalave');assert(g.save.tourVisited?.includes('tour_canalave'));assert.deepEqual(g.save.flags,{departureCleared:true,starterReceived:true});assert.equal(g.save.party[0].species,7);
});
test('legacy tour saves attest only to the current place and current interior, retaining progress',()=>{
  const s=tour().save;delete s.tourVisited;s.map='tour_eterna_hall';s.player={...TOUR_SPAWNS.tour_eterna_hall,facing:'up'};s.steps=321;s.seconds=456;
  const loaded=parseSave(JSON.stringify(s))!;assert(loaded);assert.deepEqual(loaded.tourVisited,['tour_eterna','tour_eterna_hall']);assert.equal(loaded.steps,321);assert.equal(loaded.seconds,456);assert.deepEqual(loaded.flags,s.flags);assert.deepEqual(loaded.player,s.player);
  const normal=newSave();assert.deepEqual(parseSave(JSON.stringify(normal)),normal);
});
test('visit history survives file and slot round trips without leaking between saves',()=>{
  const a=tour();a.exploreTo('tour_pallet');a.exploreTo('tour_pallet_hall');const b=tour();b.exploreTo('tour_snowpoint');
  const data=new Map<string,string>(),lib=new SaveLibrary({getItem:k=>data.get(k)??null,setItem:(k,v)=>{data.set(k,v)}},'qa-journal');lib.write(1,a.save);lib.write(2,b.save);
  assert.deepEqual(lib.read(1)?.save.tourVisited,a.save.tourVisited);assert.deepEqual(lib.read(2)?.save.tourVisited,b.save.tourVisited);assert.deepEqual(decodeSave(encodeSave(a.save))?.save.tourVisited,a.save.tourVisited);
  a.restore(lib.read(2)!.save);assert.deepEqual(a.save.tourVisited,b.save.tourVisited);assert.deepEqual(a.freshSave().tourVisited??[],[]);
});
test('visit lists reject malformed or foreign IDs and normalize known interior parents',()=>{
  const s=tour().save;
  for(const value of [null,{},'tour_jubilife',[1],['town'],['tour_unknown'],['toString'],['tour_jubilife','tour_jubilife']])assert.equal(parseSave(JSON.stringify({...s,tourVisited:value})),null,JSON.stringify(value));
  assert(parseSave(JSON.stringify({...newSave(),tourVisited:[]})));
  const parsed=parseSave(JSON.stringify({...s,tourVisited:['tour_jubilife_hall']}))!;assert.deepEqual(parsed.tourVisited,['tour_jubilife_hall','tour_jubilife']);
});
test('all map visits separate 43 original places, interiors and new passages without duplicates',()=>{
  const s=tour().save;for(const id of Object.keys(TOUR_MAPS)){s.map=id as TourId;s.player={...TOUR_SPAWNS[id as TourId],facing:'down'};markTourVisit(s);markTourVisit(s)}
  assert.equal(s.tourVisited?.length,Object.keys(TOUR_MAPS).length);assert.equal(tourVisitSummary(s,'신오').outdoors,43);assert.equal(tourVisitSummary(s,'신오').interiors,Object.keys(TOUR_INTERIORS).length);assert.equal(tourVisitSummary(s,'신오').passages,Object.keys(PASSAGES).length);
  for(const region of ['신오','관동','성도','하나']){const result=tourVisitSummary(s,region);assert.equal(result.regionVisited,result.regionTotal)}assert(parseSave(JSON.stringify(s)));
});
test('doorway checkpoint records both the known source and normalized arrival without mutating input',()=>{
  const s=tour().save;s.map='tour_jubilife';s.player={x:8,y:8,facing:'up'};const before=structuredClone(s),copy=checkpoint(s);assert.equal(copy.map,'tour_jubilife_center');assert.deepEqual(copy.tourVisited,['tour_jubilife','tour_jubilife_center']);assert.deepEqual(s,before);
});
