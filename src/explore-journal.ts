import { PLACES,placeById,TOUR_MAPS,TOUR_INTERIORS,tourPlaceForMap,type TourId } from './explore-world';
import { PASSAGE_PLACES } from './journey-world';
import type { SaveData } from './types';

export function journalPlaces(){
  const extras=['tour_celestic','tour_castelia_sewers','tour_castelia_park'].map(placeById).filter((p):p is NonNullable<typeof p>=>Boolean(p));
  return [...new Map([...PLACES,...extras].map(p=>[p.id,p])).values()];
}

/** Routes and cave floors keep their own visited identity instead of masquerading as towns. */
export function journalPassages(region:string){
  const towns=new Set(PLACES.map(place=>place.id));
  const kantoSouth=['tour_kanto_route_19','tour_kanto_route_20','tour_kanto_seafoam_exterior','tour_kanto_seafoam_1f','tour_kanto_seafoam_b1f','tour_kanto_seafoam_b2f','tour_kanto_seafoam_b3f','tour_kanto_seafoam_b4f'];
  const order=region==='관동'?new Map(kantoSouth.map((id,index)=>[id,index])):new Map<string,number>();
  return Object.values(PASSAGE_PLACES)
    .filter(place=>place.region===region&&!towns.has(place.id)&&Object.hasOwn(TOUR_MAPS,place.id))
    .map((place,index)=>({place,index,journey:order.get(place.id)}))
    .sort((a,b)=>(a.journey??Number.MAX_SAFE_INTEGER)-(b.journey??Number.MAX_SAFE_INTEGER)||a.index-b.index)
    .map(entry=>entry.place);
}

export function validTourVisits(value:unknown):value is TourId[]{
  return Array.isArray(value)&&value.length<=Object.keys(TOUR_MAPS).length&&new Set(value).size===value.length&&value.every(id=>typeof id==='string'&&Object.hasOwn(TOUR_MAPS,id));
}

// Old saves can attest to the current location only; do not invent earlier visits.
export function markTourVisit(save:SaveData){
  if(!save.tourVisited&&!tourPlaceForMap(save.map))return;

  const visits=save.tourVisited??=[];
  for(const id of [...visits,save.map]){
    const place=tourPlaceForMap(id);if(!place)continue;
    // Rooms group under their city; a route does not mark either endpoint or
    // unobserved floors as visited when restoring a legacy save or a QA jump.
    for(const value of [place.id,id as TourId])if(!visits.includes(value))visits.push(value);
  }
}

export function tourVisitSummary(save:SaveData,region:string){
  const visited=new Set(save.tourVisited??[]),places=journalPlaces().filter(p=>p.region===region);
  const passages=journalPassages(region);
  return {outdoors:places.filter(p=>visited.has(p.id)).length,interiors:[...visited].filter(id=>Object.hasOwn(TOUR_INTERIORS,id)).length,
    passages:passages.filter(p=>visited.has(p.id)).length,interiorTotal:Object.keys(TOUR_INTERIORS).length,passageTotal:passages.length,
    regionVisited:places.filter(p=>visited.has(p.id)).length,regionTotal:places.length};
}
