import type { Engine } from './engine';
import { SPECIES } from './pokemon';
import type { GameMap } from './types';
import type { TourOutdoors } from './explore-outdoors';

const SLOT='pastoriaObservationPartnerSlot',SPECIES_FLAG='pastoriaObservationPartner',SHALLOW='pastoriaShallowObserved',CHANNEL='pastoriaChannelObserved',DONE='pastoriaObservationCompared';
const SHALLOW_EVENT='pastoriaShallowWetland',CHANNEL_EVENT='pastoriaObservationChannel';
export function installPastoriaObservation(map:GameMap,outdoors:TourOutdoors){for(const [name,event] of [['도시 안쪽 얕은 습지',SHALLOW_EVENT],['동쪽 관찰 수로',CHANNEL_EVENT]] as const){const object=outdoors.objects.find(o=>o.name===name);if(!object)continue;const old=object.event,cells=new Set(object.cells.map(c=>`${c.x},${c.y}`));object.event=event;for(const prop of map.props)if(prop.dialogue===old&&cells.has(`${prop.x},${prop.y}`))prop.dialogue=event;}}
export function handlePastoriaObservation(g:Engine,event:string):boolean{
  const save=g.save,selected=()=>{const slot=save.flags[SLOT],mon=typeof slot==='number'?save.party[slot]:undefined;return mon&&mon.species===save.flags[SPECIES_FLAG]?mon:undefined;};
  if(save.map==='tour_pastoria_hall'&&event==='pastoriaObservationDesk'){
    const mon=selected();if(mon&&save.flags[SHALLOW]&&save.flags[CHANNEL]){save.flags[DONE]=true;g.persist();g.say('습지 관찰 기록',[`${SPECIES[mon.species].name}와 본 얕은 습지의 잔물결과\n동쪽 수로의 흐름을 지도에서 비교했다.`,'낚시나 포획 기록은 아니며 언제든 다시 관찰할 수 있다.']);return true;}
    if(!save.party.length){g.say('습지 관찰 기록판',['함께 걸을 동료가 생기면 외부 물길을 살펴보자.']);return true;}
    g.say('관찰 동료',['얕은 습지와 수로를 함께 살펴볼 건강한 동료를 고르세요.'],undefined,[...save.party.map(p=>({label:SPECIES[p.species].name,action:()=>{if(g.save!==save||save.map!=='tour_pastoria_hall'||!save.party.includes(p))return;if(p.hp<=0){g.say('관찰소 안내원',['지친 동료는 센터에서 먼저 쉬게 해 주세요.']);return;}save.flags[SLOT]=save.party.indexOf(p);save.flags[SPECIES_FLAG]=p.species;save.flags[SHALLOW]=false;save.flags[CHANNEL]=false;save.flags[DONE]=false;g.persist();g.say('습지 관찰 기록',[`${SPECIES[p.species].name}와 외부 데크를 걷기로 했다.\n얕은 습지와 동쪽 관찰 수로를 차례로 살펴보자.`]);}})),{label:'돌아가기',action:()=>{}}]);return true;
  }
  if(save.map!=='tour_pastoria'||![SHALLOW_EVENT,CHANNEL_EVENT].includes(event))return false;const mon=selected();if(!mon){g.say('습지 관찰 지점',['습지 관찰소의 기록판에서 동료를 먼저 골라 보자.']);return true;}if(mon.hp<=0){g.say('습지 관찰 지점',[`${SPECIES[mon.species].name}은 지쳐 있다.\n센터에서 쉬고 다시 데크를 걷자.`]);return true;}const key=event===SHALLOW_EVENT?SHALLOW:CHANNEL;save.flags[key]=true;save.flags[DONE]=false;g.persist();g.say(event===SHALLOW_EVENT?'도시 안쪽 얕은 습지':'동쪽 관찰 수로',[event===SHALLOW_EVENT?`${SPECIES[mon.species].name}와 갈대 사이의 작은 잔물결을 살폈다.\n물속에 들어가지 않고 데크 가장자리에서 기다렸다.`:`${SPECIES[mon.species].name}와 수로의 흐름과 수초 방향을 살폈다.\n나무 데크 위에서 흔적만 기록했다.`,save.flags[SHALLOW]&&save.flags[CHANNEL]?'두 지점을 모두 살폈다.\n관찰소 기록판에서 지도와 비교해 보자.':'다른 관찰 지점도 데크를 따라 찾아보자.']);return true;
}
