import type { Engine } from './engine';
import { SPECIES } from './pokemon';

const partner=(g:Engine)=>{const slot=g.save.flags.pastoriaObservationPartnerSlot,mon=typeof slot==='number'?g.save.party[slot]:undefined;return mon&&mon.species===g.save.flags.pastoriaObservationPartner?mon:undefined;};
const guide=(g:Engine,map:string,event:string)=>()=>{if(g.save.map==='tour_pastoria'&&!g.battle)g.setTourDestination(map,event);};
export function handlePastoriaLife(g:Engine,event:string):boolean{
  if(g.save.map!=='tour_pastoria')return false;
  if(event==='tourResident0'){
    const mon=partner(g),done=Boolean(g.save.flags.pastoriaObservationCompared),hurt=g.save.party.some(p=>p.hp<p.maxHp);
    g.say('습지 관찰자',[!g.save.party.length?'동료와 함께 오면 관찰소에서 물길 기록을 시작할 수 있어.':hurt?'젖은 길을 더 걷기 전에 센터에서 동료를 쉬게 하자.':done&&mon?`${SPECIES[mon.species].name}와 두 물길을 비교했구나.\n같은 도시 안에서도 흐름과 갈대가 다르지.`:mon?`${SPECIES[mon.species].name}와 얕은 습지와 동쪽 수로를\n데크 위에서 차례로 살펴봐.`:'관찰소 기록판에서 건강한 동료를 고른 뒤\n외부의 두 물길을 살펴봐.','물속에 들어가거나 포획하지 않아도 흔적을 관찰할 수 있어.'],undefined,[{label:'센터 안내',action:guide(g,'tour_pastoria_center','tourExhibit1')},{label:'관찰소 안내',action:guide(g,'tour_pastoria_hall','pastoriaObservationDesk')},{label:'얕은 습지',action:guide(g,'tour_pastoria','pastoriaShallowWetland')},{label:'동쪽 수로',action:guide(g,'tour_pastoria','pastoriaObservationChannel')},{label:'안내 마치기',action:()=>{}}]);return true;
  }
  if(event==='tourResident1'){
    g.say('관찰소 학생',['서쪽은 212번도로 남부 습지와 북부 정원길을 지나\n연고시티로 이어져요.','동쪽은 213번도로 해변과 입지호수 근처를 지나\n222번도로에서 물가시티로 이어져요.','두 길은 관찰 완료나 포획 없이도 걸어서 왕복할 수 있어요.'],undefined,[{label:'212번도로 · 연고',action:guide(g,'tour_sinnoh_route_212_south','journeySign')},{label:'213번도로 · 물가',action:guide(g,'tour_sinnoh_route_213','journeySign')},{label:'관찰소 안내',action:guide(g,'tour_pastoria_hall','pastoriaObservationDesk')},{label:'안내 마치기',action:()=>{}}]);return true;
  }
  return false;
}
