import { worldMapId } from './unified-world';
import type { MapId,SaveData } from './types';
import { GYMS } from './gyms';
import { getMap,MAPS } from './maps';

export interface AdventureObjective {id:string;title:string;map:MapId;action:string;event?:string}

export function itemSupply(save:SaveData,item:keyof SaveData['inventory']):AdventureObjective|null{
  const queue:MapId[]=[worldMapId(save.map)],seen=new Set<MapId>(queue);
  const events=item==='pokeBalls'?['routeGuide']:['nurse','routeGuide','trailGuide'];
  for(let i=0;i<queue.length;i++){
    const map=getMap(queue[i],save.flags),provider=map.npcs.find(n=>events.includes(n.dialogue));
    if(provider)return {id:'supply',map:map.id,event:provider.dialogue,title:map.name,action:provider.name+'에게 말을 걸자'};
    for(const warp of map.warps){if(seen.has(warp.to)||warp.requiresFlag&&!save.flags[warp.requiresFlag])continue;seen.add(warp.to);queue.push(warp.to);}
  }
  return null;
}

// Guidance reflects existing progression only; reading it never grants progress.
export function adventureObjective(save:SaveData):AdventureObjective|null{

  if(!save.party.length)return {id:'partner',event:'professor',title:'첫 파트너 만나기',map:'lab',action:'은솔박사에게 말을 걸자'};
  if(!save.flags.departureCleared)return {id:'departure',event:'gatekeeper',title:'모험 출발 준비',map:'town',action:'서쪽 입구의 도윤과 이야기하자'};
  const next=GYMS.findIndex(g=>!save.badges.includes(g.badge));
  if(next>=0)return {id:GYMS[next].id,event:GYMS[next].id,title:GYMS[next].label+'에 도전',map:(['oreburgh_gym','eterna_gym','hearthome_gym','veilstone_gym'] as const)[next],action:`관장 ${GYMS[next].name}과 이야기하자`};
  if(!save.flags.observationCollected)return {id:'observation',event:'observation',title:'관측 자료 받기',map:'tour_veilstone',action:'마을 안내 자리의 연구원을 만나자'};
  if(!save.flags.researchDelivered)return {id:'research',event:'researchGate',title:'관측 자료 전달',map:'tour_jubilife',action:'연구 통로 안내원을 만나자'};
  if(!save.flags.ferryPass)return {id:'ferry',event:'ferry',title:'조사선으로 출발',map:'tour_canalave',action:'조사선 선원에게 말을 걸자'};
  return {id:'explore',title:'다시 자유롭게 둘러보기',map:save.map,action:'왕복선으로 운하항과 갈색항을 오가자'};
}

// Breadth-first traversal measures area transitions, not walking distance.
function* connectedAreas(save:SaveData){
  const queue:{id:MapId;first:MapId|null}[]=[{id:worldMapId(save.map),first:null}],seen=new Set<MapId>([worldMapId(save.map)]);
  for(let i=0;i<queue.length;i++){
    const current=queue[i],map=getMap(current.id,save.flags);
    yield {...current,map};
    const exits=map.warps.filter(w=>!w.requiresFlag||save.flags[w.requiresFlag]).map(w=>w.to);
    // The existing ferry is a dialogue transition rather than a map warp.
    if(save.flags.researchDelivered&&map.npcs.some(n=>n.dialogue==='ferry')){
      if(current.id==='tour_vermilion')exits.push('tour_canalave');
      if(current.id==='tour_canalave')exits.push('tour_vermilion');
    }
    for(const id of exits){if(seen.has(id))continue;seen.add(id);queue.push({id,first:current.first??id});}
  }
}

export function adventureGuide(save:SaveData):{objective:AdventureObjective;lines:[string,string]}|null{
  const objective=adventureObjective(save);if(!objective)return null;
  if(save.party.some(p=>p.hp*5<=p.maxHp)){
    for(const area of connectedAreas(save)){
      const nurse=area.map.npcs.find(n=>['mom','nurse','routeGuide','trailGuide'].includes(n.dialogue));
      if(!nurse)continue;
      const recovery:AdventureObjective={id:'recover',event:nurse.dialogue,title:'포켓몬을 회복하자',map:area.id,action:nurse.name+'에게 말을 걸자'};
      const ferry=save.map==='tour_vermilion'&&area.first==='tour_canalave';
      return {objective:recovery,lines:area.first?[ferry?'선원에게 왕복선을 부탁하자':'회복: '+area.map.name,'다음 구역: '+MAPS[area.first].name]:[save.party.some(p=>p.hp===0)?'쓰러진 친구가 있어요':'HP가 위험한 친구가 있어요',recovery.action]};
    }
  }
  if(save.map===objective.map)return {objective,lines:['이곳에서 할 일',objective.action]};
  for(const area of connectedAreas(save)){
    if(area.id===objective.map&&area.first)return {objective,lines:['목적지: '+MAPS[objective.map].name,'다음 구역: '+MAPS[area.first].name]};
  }
  return {objective,lines:['목적지: '+MAPS[objective.map].name,'주변 안내원에게 길을 물어보자']};
}
