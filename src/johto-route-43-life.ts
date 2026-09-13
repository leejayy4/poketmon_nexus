import type { Engine } from './engine';
import { SPECIES } from './pokemon';
import { JOHTO_ROUTE_43 } from './johto-route-43';

export function handleJohtoRoute43Life(g:Engine,event:string):boolean{
  if(g.save.map!==JOHTO_ROUTE_43)return false;
  const lead=g.save.party[0],party=lead?`선두 ${SPECIES[lead.species].name} · HP ${lead.hp}/${lead.maxHp}`:'현재 함께 걷는 동료가 없다.';
  const local=[...g.save.party,...g.save.box??[]].filter(mon=>mon.met==='성도 43번도로'),localParty=local.filter(mon=>g.save.party.includes(mon));
  const localLine=local.length?`43번도로 출신 동료 ${local.length}마리 · 파티 ${localParty.length} · PC ${local.length-localParty.length}\n${[...new Set(local.map(mon=>SPECIES[mon.species]?.name).filter(Boolean))].join('·')}`:'43번도로에서 만난 보유 동료는 아직 없다.';
  const won=Boolean(g.save.flags['trainerWon:johto-route-43-practice']);
  if(event==='journeyWalker'){g.say('43번도로 상류 여행자',[party,localLine,won?'새잡이 선택 실전 승리 기록이 있다.':'서쪽 풀밭 옆 새잡이와 선택 실전을 할 수 있다.','북쪽은 분노의호수, 남쪽은 황토마을이며 가운데 마른 본선으로 왕복할 수 있다.','옛 검문 흔적에는 현재 통행료·강제 전투·길막이 없다.']);return true;}
  const titles:Record<string,string>={tourRoute43LakeBoard:'분노의호수 남쪽 도착 표지',tourRoute43WaterRail:'상류 물길 관찰대',tourRoute43GateTrace:'옛 검문 흔적 표지',tourRoute43MahoganyBoard:'황토 북쪽 43번도로 표석'};
  if(!titles[event])return false;
  const boundary=event==='tourRoute43WaterRail'?'물길은 풍경 구역이며 수상 이동·낚시·야생 조우를 제공하지 않는다.':event==='tourRoute43GateTrace'?'현재 통행료·강제 전투·길막 조건은 없다.':'호숫가 주택에서 주민과 이야기를 나눌 수 있다. 물가에서는 표지와 둑길을 따라 걷자.';
  g.say(titles[event],[party,localLine,won?'선택 실전 승리 기록 있음':'선택 실전 미승리','황토마을 ↔ 43번도로 ↔ 분노의호수',boundary]);return true;
}
