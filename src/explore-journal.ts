import { PLACES,TOUR_MAPS,tourPlaceForMap,type TourId } from './explore-world';
import type { SaveData } from './types';

export function validTourVisits(value:unknown):value is TourId[]{
  return Array.isArray(value)&&value.length<=Object.keys(TOUR_MAPS).length&&new Set(value).size===value.length&&value.every(id=>typeof id==='string'&&Object.hasOwn(TOUR_MAPS,id));
}

// Old saves can attest to the current location only; do not invent earlier visits.
export function markTourVisit(save:SaveData){
  if(!save.tourVisited&&!tourPlaceForMap(save.map))return;

  const visits=save.tourVisited??=[];
  for(const id of [...visits,save.map]){
    const place=tourPlaceForMap(id);if(!place)continue;
    for(const value of [place.id,id as TourId])if(!visits.includes(value))visits.push(value);
  }
}

export function tourVisitSummary(save:SaveData,region:string){
  const visited=new Set(save.tourVisited??[]),places=PLACES.filter(p=>p.region===region);
  return {outdoors:PLACES.filter(p=>visited.has(p.id)).length,interiors:[...visited].filter(id=>!PLACES.some(p=>p.id===id)).length,
    regionVisited:places.filter(p=>visited.has(p.id)).length,regionTotal:places.length};
}
