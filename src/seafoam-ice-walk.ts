import type { Engine } from './engine';
import type { GameMap,Point } from './types';
import type { TourOutdoors } from './explore-outdoors';
import { encounterGuidance } from './encounter-guidance';

export const SEAFOAM_ICE_WALK_EVENTS={b1Start:'tourSeafoamB1WalkStart',b1Main:'tourSeafoamB1WalkMainEnd',b1RidgeCheck:'tourSeafoamB1WalkRidgeCheck',b1Ridge:'tourSeafoamB1WalkRidgeEnd',b2Start:'tourSeafoamB2WalkStart',b2Side:'tourSeafoamB2WalkSideMark',b2End:'tourSeafoamB2WalkEnd'} as const;
const B1='tour_kanto_seafoam_b1f',B2='tour_kanto_seafoam_b2f';
const B1_CHOICE='seafoamB1WalkChoice',B1_RIDGE='seafoamB1RidgeChecked',B1_DONE='seafoamB1WalkCompleted',B2_CHOICE='seafoamB2WalkChoice',B2_SIDE='seafoamB2SideChecked',B2_DONE='seafoamB2WalkCompleted';
export const SEAFOAM_B1_HABITAT_OBSERVED='seafoamB1RidgeHabitatObserved';
export const SEAFOAM_B2_ICE_OBSERVED='seafoamB2WestIceObserved';
export const SEAFOAM_FINDINGS_COMPARED='seafoamRouteFindingsCompared';
type ObjectInfo={name:string;event:string;cells:Point[];pages:string[]};

export function installSeafoamIceWalk(map:GameMap,outdoors:TourOutdoors){
  const e=SEAFOAM_ICE_WALK_EVENTS,additions:ObjectInfo[]=map.id===B1?[
    {name:'B1F 두 길 출발 표식',event:e.b1Start,cells:[{x:15,y:8}],pages:['서쪽 넓은 본선과 수로를 도는 얼음 능선길을 고르는 지점이다.']},
    {name:'B1F 본선 발자국',event:e.b1Main,cells:[{x:5,y:29}],pages:['넓은 마른 본선이 남쪽 계단 발판으로 굽는다.']},
    {name:'B1F 북쪽 능선 자국',event:e.b1RidgeCheck,cells:[{x:18,y:11}],pages:['북쪽 서식 암반을 따라 수로 능선으로 들어가는 경유 지점이다.']},
    {name:'B1F 능선 끝자국',event:e.b1Ridge,cells:[{x:24,y:22}],pages:['수로를 돌아온 얼음 능선길이 남쪽 합류점에 닿는다.']},
  ]:map.id===B2?[
    {name:'B2F 두 길 출발 표식',event:e.b2Start,cells:[{x:15,y:8}],pages:['남쪽 직행 본선과 서쪽 바깥 얼음판 우회를 고르는 지점이다.']},
    {name:'B2F 서쪽 우회 자국',event:e.b2Side,cells:[{x:1,y:15}],pages:['서쪽 벽의 조용한 얼음판이 되돌아가는 짧은 우회를 만든다.']},
    {name:'B2F 남쪽 합류 자국',event:e.b2End,cells:[{x:15,y:27}],pages:['두 길이 남쪽의 넓은 계단 발판 앞에서 합류한다.']},
  ]:[];
  for(const object of additions){if(map.props.some(p=>p.dialogue===object.event)||object.cells.some(p=>map.walkable[p.y]?.[p.x]!=='#'))continue;map.props.push(...object.cells.map(p=>({...p,dialogue:object.event})));outdoors.objects.push(object);}
}

export function handleSeafoamIceWalk(g:Engine,event:string):boolean{
  const e=SEAFOAM_ICE_WALK_EVENTS,save=g.save,map=save.map,player=save.player,x=player.x,y=player.y;
  if(!Object.values(e).includes(event as typeof e[keyof typeof e])||![B1,B2].includes(map))return false;
  const current=()=>g.save===save&&save.map===map&&save.player===player&&player.x===x&&player.y===y&&!g.battle&&!g.move&&!g.transition;
  const guide=(target:string,id:string)=>()=>{if(current())g.setTourDestination(target,id);};
  if(event===e.b1Start&&map===B1){g.say('B1F 두 길 출발 표식',['남쪽 B2F 계단으로 가는 두 길이 갈라진다.','서쪽 넓은 본선은 조우 암반을 피하는 짧은 길이다. 오른쪽 수로 능선길은 북쪽 쥬쥬·주뱃 서식 암반의 경유 자국을 지나 남쪽에서 합류한다.'],undefined,[{label:'넓은 본선으로 걷기',action:()=>{if(current()){save.flags[B1_CHOICE]=1;save.flags[B1_RIDGE]=false;save.flags[B1_DONE]=false;g.persist();g.setTourDestination(B1,e.b1Main);}}},{label:'수로 능선길로 걷기',action:()=>{if(current()){save.flags[B1_CHOICE]=2;save.flags[B1_RIDGE]=false;save.flags[B1_DONE]=false;g.persist();g.setTourDestination(B1,e.b1RidgeCheck);}}},{label:'길을 고르지 않는다',action:()=>{}}]);return true;}
  if(event===e.b1Main&&map===B1){const chosen=save.flags[B1_CHOICE]===1;g.say('B1F 넓은 본선',[chosen?'출발 표식에서 고른 넓은 길을 실제로 걸어 남쪽 발판에 도착했다.':'북쪽 출발 표식에서 길을 정하면 실제로 걸은 본선 기록을 남길 수 있다.','이 길은 서식 암반을 밟지 않고 B2F 계단으로 이어진다.'],undefined,[...(chosen&&!save.flags[B1_DONE]?[{label:'본선 도착 기록',action:()=>{if(current()&&save.flags[B1_CHOICE]===1){save.flags[B1_DONE]=true;g.persist();g.setTourDestination(B2,e.b2Start);}}}]:[]),{label:'B2F 계단으로',action:guide(B2,e.b2Start)},{label:'직접 더 걷기',action:()=>{}}]);return true;}
  if(event===e.b1RidgeCheck&&map===B1){const chosen=save.flags[B1_CHOICE]===2;if(chosen&&!save.flags[B1_RIDGE]){save.flags[B1_RIDGE]=true;g.persist();}const observed=save.flags[SEAFOAM_B1_HABITAT_OBSERVED]===true;g.say('B1F 북쪽 능선',[chosen?'선택 뒤 북쪽 서식 암반의 경유 자국까지 직접 걸어 왔다. 이제 수로 오른쪽을 돌아 남쪽 끝자국으로 간다.':'출발 표식에서 능선길을 고른 뒤 이 북쪽 지점을 확인하면 능선 경유가 남는다.',...encounterGuidance(B1).pages,observed?'얼음 가장자리의 젖은 발자국과 천장 쪽 작은 날개 흔적을 기록했다. 홍련 연구소에서 아래층 기록과 비교할 수 있다.':'얼음 가장자리에는 물가에서 올라온 둥근 발자국과 천장으로 이어지는 작은 날개 흔적이 겹쳐 있다. 조우하지 않아도 서식 흔적을 살필 수 있다.'],undefined,[...(!observed?[{label:'서식 흔적 기록',action:()=>{if(current()&&save.flags[B1_RIDGE]===true){save.flags[SEAFOAM_B1_HABITAT_OBSERVED]=true;g.persist();g.setTourDestination(B1,e.b1Ridge);}}}]:[]),{label:'남쪽 능선 끝으로 걷기',action:guide(B1,e.b1Ridge)},{label:'주변 더 살피기',action:()=>{}}]);return true;}
  if(event===e.b1Ridge&&map===B1){const chosen=save.flags[B1_CHOICE]===2,checked=save.flags[B1_RIDGE]===true,valid=chosen&&checked;g.say('B1F 수로 능선길',[valid?'북쪽 서식 암반을 확인하고 수로 오른쪽을 돌아 남쪽 합류점에 도착했다.':chosen?'먼저 북쪽 능선의 경유 자국을 확인해야 이 길의 보행 기록을 남길 수 있다.':'북쪽 출발 표식에서 능선길을 고른 뒤 경유 자국과 이곳을 차례로 확인하면 기록할 수 있다.',...encounterGuidance(B1).pages,'조우는 이 길의 결과일 수 있지만 포획·승리는 도착 조건이 아니다.'],undefined,[...(valid&&!save.flags[B1_DONE]?[{label:'능선길 도착 기록',action:()=>{if(current()&&save.flags[B1_CHOICE]===2&&save.flags[B1_RIDGE]===true){save.flags[B1_DONE]=true;g.persist();g.setTourDestination(B2,e.b2Start);}}}]:[]),...(!checked?[{label:'북쪽 경유 자국으로',action:guide(B1,e.b1RidgeCheck)}]:[]),{label:'B2F 계단으로',action:guide(B2,e.b2Start)},{label:'직접 더 걷기',action:()=>{}}]);return true;}
  if(event===e.b2Start&&map===B2){g.say('B2F 두 길 출발 표식',['남쪽 B3F 계단 발판까지 직행하거나 서쪽 벽의 얼음판을 한 번 돌아볼 수 있다.','직행 본선은 짧다. 서쪽 우회는 조우 암반을 지나지 않는 조용한 막다른 얼음판을 확인한 뒤 같은 본선으로 돌아온다.'],undefined,[{label:'직행 본선으로',action:()=>{if(current()){save.flags[B2_CHOICE]=1;save.flags[B2_SIDE]=false;save.flags[B2_DONE]=false;g.persist();g.setTourDestination(B2,e.b2End);}}},{label:'서쪽 얼음판을 돌아서',action:()=>{if(current()){save.flags[B2_CHOICE]=2;save.flags[B2_SIDE]=false;save.flags[B2_DONE]=false;g.persist();g.setTourDestination(B2,e.b2Side);}}},{label:'길을 고르지 않는다',action:()=>{}}]);return true;}
  if(event===e.b2Side&&map===B2){const chosen=save.flags[B2_CHOICE]===2;if(chosen&&!save.flags[B2_SIDE]){save.flags[B2_SIDE]=true;g.persist();}const observed=save.flags[SEAFOAM_B2_ICE_OBSERVED]===true;g.say('B2F 서쪽 얼음판',[chosen?'서쪽 벽의 얼음판 끝까지 직접 걸어 왔다. 이제 같은 길을 되돌아 남쪽 합류점으로 간다.':'북쪽 출발 표식에서 서쪽 우회를 고르면 이곳을 확인한 뒤 합류 기록을 남길 수 있다.',observed?'얼음 아래의 둥근 조개껍질 광택을 위치만 기록했다. 원작의 숨은 진주 아이템을 지급하거나 채취한 상태는 아니다.':'얕은 균열 아래에 둥근 조개껍질 같은 광택이 비친다. 꺼내지 않고 위치와 얼음 두께만 살필 수 있다.'],undefined,[...(!observed&&chosen?[{label:'얼음 아래 광택 기록',action:()=>{if(current()&&save.flags[B2_SIDE]===true){save.flags[SEAFOAM_B2_ICE_OBSERVED]=true;g.persist();g.setTourDestination(B2,e.b2End);}}}]:[]),{label:'남쪽 합류점으로 걷기',action:guide(B2,e.b2End)},{label:'직접 돌아가기',action:()=>{}}]);return true;}
  if(event===e.b2End&&map===B2){const side=save.flags[B2_CHOICE]===2&&save.flags[B2_SIDE]===true,valid=save.flags[B2_CHOICE]===1||side,both=save.flags[SEAFOAM_B1_HABITAT_OBSERVED]===true&&save.flags[SEAFOAM_B2_ICE_OBSERVED]===true;g.say('B2F 남쪽 합류점',[valid?(side?'서쪽 얼음판을 확인하고 본선으로 되돌아와 남쪽 발판에 도착했다.':'북쪽 출발 표식에서 남쪽 직행 본선을 걸어 도착했다.'):'북쪽 출발 표식에서 길을 정하고 실제 경로를 걸으면 본선과 우회의 차이를 기록할 수 있다.','남쪽 계단은 B3F로 내려간다. 동쪽 상승 계단과 작은 바위 곁길은 별도 선택 탐험이다.',...(both?['B1F 서식 흔적과 B2F 얼음 아래 광택을 모두 기록했다. 동굴을 빠져나가 홍련 연구소의 관찰판에서 비교할 수 있다.']:[])],undefined,[...(valid&&!save.flags[B2_DONE]?[{label:'B2F 도착 기록',action:()=>{if(current()){save.flags[B2_DONE]=true;g.persist();g.setTourDestination('tour_kanto_seafoam_b3f','tourSeafoamB3Water');}}}]:[]),...(both?[{label:'홍련 연구소 귀환 안내',action:guide('tour_cinnabar_hall','tourExhibit2')}]:[]),{label:'B3F 계단으로',action:guide('tour_kanto_seafoam_b3f','tourSeafoamB3Water')},{label:'직접 더 걷기',action:()=>{}}]);return true;}
  return false;
}
