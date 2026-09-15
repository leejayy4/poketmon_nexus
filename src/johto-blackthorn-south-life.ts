import type { Engine } from './engine';
import { SPECIES } from './pokemon';
import { JOHTO_ROUTE_29,JOHTO_ROUTE_45,JOHTO_ROUTE_46 } from './johto-blackthorn-south';
import type { MapId } from './types';
import {handleCherrygroveLife} from './johto-cherrygrove-life';
import {TOUR_OUTDOORS} from './explore-world';
import {showMoveSchool} from './move-school';
import {handleRoute46Practice,ROUTE46_PRACTICE} from './johto-route46-practice';
import {JOHTO_SOUTH_BATTLE} from './johto-south-battle';

const MAPS=new Set<string>([JOHTO_ROUTE_45,JOHTO_ROUTE_46,JOHTO_ROUTE_29]);

/** Describe the southbound ecology using actual caught companions and optional battle records. */
export function handleJohtoBlackthornSouthLife(g:Engine,event:string):boolean{
  if(handleRoute46Practice(g,event))return true;
  if(handleCherrygroveLife(g,event))return true;
  if(!MAPS.has(g.save.map))return false;
  if((g.save.map===JOHTO_ROUTE_46&&event==='tourRoute46Rest')||(g.save.map===JOHTO_ROUTE_29&&event==='tourRoute29Rest')){
    const save=g.save,source=save.map,current=()=>g.save===save&&g.save.map===source&&!g.battle;
    const guide=(map:MapId,id?:string)=>()=>{if(current())g.setTourDestination(map,id);};
    const choose=(page=0)=>{
      if(!current())return;
      g.say('산길 동료 기술 준비',['함께 걸어온 동료의 기술을 확인하고 편성하자.'],undefined,[
        ...save.party.slice(page*3,page*3+3).map(mon=>({label:SPECIES[mon.species].name,action:()=>{
          if(!current()||!save.party.includes(mon))return;
          if(mon.hp<=0){g.say('동료 휴식',['이 동료는 센터에서 먼저 회복해야 한다.'],undefined,[{label:'무궁센터로 안내',action:guide('tour_cherrygrove_center','tourHost')},{label:'나중에 준비',action:()=>{}}]);return;}
          g.partyIndex=save.party.indexOf(mon);showMoveSchool(g);
        }})),
        ...(save.party.length>3?[{label:page?'앞 동료':'다음 동료',action:()=>choose(page?0:1)}]:[]),
        {label:'돌아가기',action:()=>{}},
      ]);
    };
    g.say('산길 도착 쉼터',['배틀 전에 동료의 기술과 HP를 확인할 수 있는 자리다.','46번도로 선택 실전에는 꼬렛·깨비참·꼬마돌이 차례로 나온다. 상대가 바뀌면 기술과 교대할 동료를 살펴보자.'],undefined,[
      {label:'동료 기술 편성',action:choose},
      {label:'46번 선택 실전',action:guide(JOHTO_ROUTE_46,ROUTE46_PRACTICE)},
      {label:'무궁센터 회복',action:guide('tour_cherrygrove_center','tourHost')},
      {label:'그냥 쉬어가기',action:()=>{}},
    ]);return true;
  }
  const lead=g.save.party[0],party=lead?`선두 ${SPECIES[lead.species].name} · HP ${lead.hp}/${lead.maxHp}`:'현재 함께 걷는 동료가 없다.';
  const origins=new Set(['성도 29번도로','성도 45번도로','성도 46번도로']);
  const owned=[...g.save.party,...g.save.box??[]].filter(mon=>origins.has(mon.met));
  const names=[...new Set(owned.map(mon=>SPECIES[mon.species]?.name).filter(Boolean))].join('·')||'아직 없음';
  const local=`29·45·46번도로 출신 보유 동료 ${owned.length}마리 · ${names}`;
  const wins=`선택 실전 · 45번 ${g.save.flags['trainerWon:johto-route-45-practice']?'승리':'미승리'} · 46번 ${g.save.flags['trainerWon:johto-route-46-practice']?'승리':'미승리'}`;
  const bf=JOHTO_SOUTH_BATTLE,battleSpecies=Number(g.save.flags[bf.partner]??0),battleName=SPECIES[battleSpecies]?.name,battleSlot=g.save.flags[bf.slot],battlePartner=typeof battleSlot==='number'&&g.save.party[battleSlot]?.species===battleSpecies?g.save.party[battleSlot]:undefined;
  const battleResult=g.save.flags[bf.participated]===true&&battleName?(battlePartner?`${battleName} 실제 격파 · Lv.${Number(g.save.flags[bf.level]??battlePartner.level)}→${battlePartner.level} · HP ${battlePartner.hp}/${battlePartner.maxHp}`:`${battleName} 실제 격파 기록 · 현재 PC 또는 다른 편성`):'남쪽 현지 동료의 실제 격파 기록은 아직 없다.';
  if(event==='journeyWalker'){
    const route=g.save.map===JOHTO_ROUTE_45?'북쪽 검은먹시티 · 남쪽46번도로':g.save.map===JOHTO_ROUTE_46?'북쪽45번도로 · 남쪽29번도로 동쪽 합류부':'북쪽46번도로 · 서쪽 무궁시티 · 동쪽 연두마을 방향 미개통';
    const save=g.save,source=save.map,current=()=>g.save===save&&g.save.map===source&&!g.battle,guide=(map:MapId,eventId?:string)=>()=>{if(current())g.setTourDestination(map,eventId);};
    const prepare=()=>{
      if(!current())return;
      const hurt=save.party.filter(mon=>mon.hp<mon.maxHp).length;
      g.say('무궁시티 여행 준비',[
        source===JOHTO_ROUTE_46?'남쪽29번도로에 내려간 뒤 서쪽으로 가면 무궁시티 동문이다.':'29번도로 서쪽 출구는 무궁시티 동문이다.',
        hurt?`회복이 필요한 동료 ${hurt}마리. 센터에서 쉬고 다음 길을 준비하자.`:'파티 상태를 확인하고 PC에서 동료를 편성할 수 있다.',
        `몬스터볼 ${save.inventory.pokeBalls}개 · 상처약 ${save.inventory.potions}개. 상점에서 필요한 물품을 고르자.`,
      ],undefined,[
        {label:'센터에서 회복',action:guide('tour_cherrygrove_center','tourHost')},
        {label:'센터 PC 편성',action:guide('tour_cherrygrove_center','tourExhibit1')},
        {label:'상점에서 보급',action:guide('tour_cherrygrove_mart','martClerk')},
        {label:'안내 마치기',action:()=>{}},
      ]);
    };
    const choices=g.save.map===JOHTO_ROUTE_45?[
      {label:'45번 풀밭 안내',action:guide(JOHTO_ROUTE_45,'tourRoute45Habitat')},{label:'45번 선택 실전',action:guide(JOHTO_ROUTE_45,'tourRoute45Trainer')},{label:'46번도로로 이동',action:guide(JOHTO_ROUTE_46)},{label:'검은먹으로 귀환',action:guide('tour_blackthorn')},
    ]:g.save.map===JOHTO_ROUTE_46?[
      {label:'46번 풀밭 안내',action:guide(JOHTO_ROUTE_46,'tourRoute46Habitat')},{label:'46번 선택 실전',action:guide(JOHTO_ROUTE_46,ROUTE46_PRACTICE)},{label:'무궁 회복·보급',action:prepare},{label:'검은먹으로 귀환',action:guide('tour_blackthorn')},
    ]:[{label:'29번 풀언덕으로',action:guide(JOHTO_ROUTE_29,'tourRoute29GrassHill')},{label:'무궁시티에서 준비',action:prepare},{label:'46번도로로 귀환',action:guide(JOHTO_ROUTE_46)},{label:'안내를 마친다',action:()=>{}}];
    g.say('검은먹 남쪽 산길 여행자',[party,local,wins,battleResult,route,source===JOHTO_ROUTE_29?'29번도로 북서쪽 선택 풀언덕에는 구구·꼬렛이 살고 동서 본선은 안전하다. 서쪽 무궁에서 회복·보급하고 북쪽46번도로로 돌아갈 수 있다.':'긴 풀은 야생 포켓몬의 생활 구역이고 가운데 본선과 동쪽 귀환 오르막은 안전하다.'],undefined,choices);return true;
  }
  const titles:Record<string,string>={tourRoute45NorthStone:'검은먹 남쪽 절벽 표석',tourRoute45Ledge:'45번도로 낙차 턱',tourRoute45Habitat:'45번도로 산악 생태판',tourRoute45Spring:'산기슭 샘 관찰대',tourRoute45SouthStone:'46번도로 인계 표석',tourRoute46NorthStone:'45번도로 귀환 표석',tourRoute46Ledge:'46번도로 낮은 턱',tourRoute46Habitat:'46번도로 산기슭 생태판',tourRoute46Rest:'산허리 바람쉼터',tourRoute46SouthStone:'29번도로 합류 표석',tourRoute29Junction:'46번도로 합류 안내',tourRoute29GrassHill:'29번도로 풀언덕',tourRoute29TownBoundary:'연두·무궁 방향 경계',tourRoute29Rest:'산길 도착 쉼터'};
  if(!titles[event])return false;
  const boundary=g.save.map===JOHTO_ROUTE_29?'서쪽은 무궁시티, 북쪽은46번도로다. 동쪽 연두마을 방향은 미개통이다. 29번도로 북서쪽 선택 풀언덕에는 구구·꼬렛이 살고 동서 본선은 안전하다.':'풀밭 조우와 선택 배틀은 필수가 아니며 모든 출구와 귀환 오르막은 계속 열린다.';
  const authored=TOUR_OUTDOORS[g.save.map]?.objects.find(object=>object.event===event);
  g.say(authored?.name??titles[event],[...(authored?.pages??[]),party,local,wins,battleResult,boundary]);return true;
}
