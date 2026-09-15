import type { Engine } from './engine';
import type { Pokemon } from './types';
import {SPECIES,pokemonMoves} from './pokemon';
import {createSpecialBattle,createTrainerBattle,specialBattleResultFlag} from './battle';
import {maxHpAtLevel} from './growth';
import {showTrainerPreparation} from './trainer-preparation';
import { JOHTO_MT_MORTAR_1F,JOHTO_ROUTE_42 } from './johto-route-42';
import {handleMortarHeat} from './mortar-heat';
import {handleMortarRescue} from './mortar-rescue';
import {handleMortarDrainage} from './mortar-drainage';

const MAPS=new Set<string>([JOHTO_ROUTE_42,JOHTO_MT_MORTAR_1F]);
const SPEAROW_GROVE='route42SpearowGrove';
const SPEAROW_DONE='nexusRoute42SpearowGuided';
const SPEAROW_ENCOUNTER='johto-route-42-spearow';
const GROVE_TRAINER='johto-route-42-grove-practice';
const GROVE_WIN=`trainerWon:${GROVE_TRAINER}`;
const sessions=new WeakMap<Engine,object>();

/** Keep Route 42 and Mt. Mortar guidance aligned with the implemented, optional branch. */
export function handleJohtoRoute42Life(g:Engine,event:string,skipStory=false):boolean{
  if(!skipStory&&handleMortarDrainage(g,event,()=>{if(!handleJohtoRoute42Life(g,event,true))g.say('작은 배수홈',['물 밖에 놓인 거름틀과 침전 받이다.']);}))return true;
  if(!skipStory&&handleMortarRescue(g,event,()=>{handleJohtoRoute42Life(g,event,true);}))return true;
  if(!skipStory&&handleMortarHeat(g,event,()=>{handleJohtoRoute42Life(g,event,true);}))return true;
  if(!MAPS.has(g.save.map))return false;
  const save=g.save,player=save.player,originMap=save.map,originX=player.x,originY=player.y;
  const token={};sessions.set(g,token);
  const active=()=>g.save===save&&save.player===player&&save.map===originMap&&player.x===originX&&player.y===originY&&!g.battle&&sessions.get(g)===token;
  const lead=g.save.party[0];
  const party=lead?`선두 ${SPECIES[lead.species].name} · HP ${lead.hp}/${lead.maxHp}`:'현재 함께 걷는 동료가 없다.';
  if(g.save.map===JOHTO_ROUTE_42&&event==='route42GroveTrainer'){
    const won=save.flags[GROVE_WIN]===true,caught=save.flags[specialBattleResultFlag(SPEAROW_ENCOUNTER,'caught')]===true;
    const local=[...save.party,...save.box??[]].filter(mon=>mon.species===21&&mon.met==='성도 42번도로');
    const guide=(map:string,event?:string)=>()=>{if(active())g.setTourDestination(map,event);};
    const start=()=>{
      if(!active()||won||!save.party.some(mon=>mon.hp>0))return;
      const make=(species:number,level:number):Pokemon=>{const maxHp=maxHpAtLevel(species,level),mon:Pokemon={species,level,hp:maxHp,maxHp,experience:0,nature:'성실',met:'42번도로 기슭 트레이너 동료'};mon.moves=pokemonMoves(mon);return mon;};
      g.battle=createTrainerBattle(save,{id:GROVE_TRAINER,name:'42번도로 기슭 트레이너',reward:480,team:[make(21,17),make(74,18)]});
      if(g.battle){sessions.delete(g);g.persist();g.say('42번도로 기슭 트레이너',['깨비참의 빠른 비행 뒤 꼬마돌의 단단한 방어가 이어져. 동료의 실제 기술과 교대를 다시 골라 보자!']);}
    };
    g.say('42번도로 기슭 트레이너',[
      won?'기슭 선택 실전의 승리 기록이 남아 있다. 상금은 다시 지급되지 않는다.':'규토리 군락과 마른 기슭을 오가는 동료들과 선택 실전을 해 볼래?',
      caught?`42번도로에서 맞은 깨비참 ${local.length}마리가 파티와 PC에 있다. 포획 때 얻은 경험과 기술을 살펴 실전에 데려가도 좋아.`:'군락의 깨비참을 포획하지 않아도 도전하거나 길을 지나갈 수 있다.',
      '깨비참 Lv.17 뒤 꼬마돌 Lv.18이 나온다. 빠른 비행과 바위·땅 상대가 바뀔 때 기술과 교대를 다시 살펴보자.',
      '거절하거나 져도 인주·절구산·황토로 가는 길과 귀환은 계속 열린다.',
    ],undefined,[
      ...(!won?[{label:'동료를 고르고 선택 실전',action:()=>showTrainerPreparation(g,()=>active()&&!won,start)}]:[]),
      {label:'현재 파티 확인',action:()=>{if(active()){g.panel='party';g.partyIndex=0;}}},
      {label:'황토센터에서 회복·편성',action:guide('tour_mahogany_center','tourHost')},
      {label:'규토리 군락으로',action:guide(JOHTO_ROUTE_42,SPEAROW_GROVE)},
      {label:won?'황토로 돌아간다':'이번에는 지나간다',action:()=>{}},
    ]);return true;
  }
  if(g.save.map===JOHTO_ROUTE_42&&event===SPEAROW_GROVE){
    const healthy=save.party.filter(mon=>mon.hp>0);
    const returnChoices=()=>[
      {label:'황토센터에서 동료 돌보기',action:()=>{if(active())g.setTourDestination('tour_mahogany_center','tourHost');}},
      {label:'황토 산기슭 주택으로',action:()=>{if(active())g.setTourDestination('tour_mahogany_home1','tourHost');}},
      {label:'42번도로를 더 걷는다',action:()=>{}},
    ];
    if(save.flags[SPEAROW_DONE]){
      const species=Number(save.flags.nexusRoute42FieldSpecies??0),move=String(save.flags.nexusRoute42FieldMove??'기술');
      const caught=save.flags[specialBattleResultFlag(SPEAROW_ENCOUNTER,'caught')]===true;
      const won=save.flags[specialBattleResultFlag(SPEAROW_ENCOUNTER,'won')]===true,resolved=caught||won;
      const startEncounter=()=>{if(!active()||resolved)return;const battle=createSpecialBattle(save,{eventId:SPEAROW_ENCOUNTER,species:21,level:16,met:'성도 42번도로',allowCapture:true});if(!battle){g.say('기슭의 깨비참',['싸울 수 있는 동료와 몬스터볼을 준비해 다시 오자. 포획하지 않아도 길은 열린다.']);return;}g.battle=battle;sessions.delete(g);g.persist();};
      g.say('규토리나무 아래 깨비참',[`${SPECIES[species]?.name??'동료'}와 ${move}의 세기를 조절해 길을 비켜 준 기록이 있다.`,caught?'42번도로에서 만난 깨비참을 동료로 맞은 기록이 있다. 기슭 트레이너에게 가면 성장과 기술을 선택 실전으로 이어 볼 수 있다.':won?'깨비참과 겨룬 뒤 군락에는 다시 조용한 바람이 분다. 얻은 경험과 기술을 살펴 기슭 선택 실전으로 이어 갈 수 있다.':'깨비참은 마른 기슭으로 내려와 있다. 원한다면 약화해 포획할 수 있으며, 놓치거나 패배해도 통행은 잠기지 않는다.'],undefined,[...(!resolved?[{label:'동료를 고르고 포획에 도전',action:()=>showTrainerPreparation(g,()=>active()&&!resolved,startEncounter)}]:[]),{label:'기슭 트레이너에게',action:()=>{if(active())g.setTourDestination(JOHTO_ROUTE_42,'route42GroveTrainer');}},...returnChoices()]);return true;
    }
    if(!healthy.length){g.say('기슭에 내려온 깨비참',['깨비참이 젖은 돌 앞에서 날개를 낮추고 주위를 경계한다.','함께 행동할 건강한 동료가 없다. 황토 포켓몬센터에서 회복하거나 PC로 편성한 뒤 다시 와도 된다.'],undefined,[{label:'황토센터로',action:()=>{if(active())g.setTourDestination('tour_mahogany_center','tourHost');}},{label:'그대로 지나간다',action:()=>{}}]);return true;}
    const chooseMove=(mon:typeof healthy[number])=>{
      if(!active()||!save.party.includes(mon)||mon.hp<=0)return;
      const moves=(mon.moves?.length?mon.moves:SPECIES[mon.species]?.moves??[]).slice(0,4);
      g.say('동료의 기술 고르기',[`${SPECIES[mon.species].name}이 알고 있는 기술 가운데 하나를 세기를 낮춰 보여 주자.`,'깨비참과 싸우거나 붙잡는 행동이 아니다. 기술의 방향을 보고 젖은 돌에서 물러날 틈을 만든다.'],undefined,[...moves.map(move=>({label:move,action:()=>{
        if(!active()||!save.party.includes(mon)||mon.hp<=0)return;
        save.flags[SPEAROW_DONE]=true;save.flags.nexusRoute42FieldSpecies=mon.species;save.flags.nexusRoute42FieldMove=move;g.persist();
        g.say('나무 위로 돌아간 깨비참',[`${SPECIES[mon.species].name}이 ${move}의 세기를 낮춰 마른 쪽을 보여 주었다.`,'깨비참은 젖은 돌을 피해 규토리나무 가지로 올라갔다. 동료의 HP·경험치·능력치와 깨비참의 포획 상태는 변하지 않는다.','서쪽은 인주, 동쪽은 황토다. 황토센터에서 동료를 돌보거나 산기슭 주택에서 쉬어 갈 수 있다.'],undefined,returnChoices());
      }})),{label:'다른 동료를 고른다',action:()=>choosePartner()},{label:'그대로 지나간다',action:()=>{}}]);
    };
    const choosePartner=()=>{if(!active())return;g.say('깨비참과 거리를 지킬 동료',['건강한 파티 동료가 알고 있는 실제 기술 하나를 골라 세기를 조절한다.'],undefined,[...healthy.map(mon=>({label:`${SPECIES[mon.species].name} · HP ${mon.hp}/${mon.maxHp}`,action:()=>chooseMove(mon)})),{label:'그대로 지나간다',action:()=>{}}]);};
    g.say('기슭에 내려온 깨비참',['절구산 기슭의 규토리나무 아래에서 깨비참이 젖은 돌을 피해 마른 틈을 찾고 있다.','HGSS 42번도로의 낮 육상 서식을 바탕으로 한 선택 활동이다. 군락의 규토리는 현재 채집하지 않는다.'],undefined,[{label:'동료와 길을 보여 준다',action:choosePartner},{label:'파티를 확인한다',action:()=>{if(active()){g.panel='party';g.partyIndex=0;}}},{label:'그대로 지나간다',action:()=>{}}]);return true;
  }
  if(event==='journeyWalker'){
    if(g.save.map===JOHTO_ROUTE_42)g.say('42번도로 산물길 여행자',[party,'서쪽은 인주시티, 동쪽은 황토마을이며 가운데 북쪽 길이 절구산 1층으로 갈라진다.','절구산에 들어가지 않아도 본선으로 두 도시를 왕복할 수 있다.']);
    else g.say('절구산 산행객',[party,'남쪽 출구로 42번도로 가운데 분기에 돌아간다.','현재는 1층 암반 물길만 둘러볼 수 있고 깊은 층·폭포·특별 조우는 열리지 않았다.']);
    return true;
  }
  const titles:Record<string,string>={
    mortarNorthBypassMarker:'북쪽 횡단로 회전 표식',
    tourRoute42EcruteakStone:'인주 동쪽 42번도로 표석',tourRoute42MortarBoard:'절구산 선택 분기표',tourRoute42WaterRail:'산물길 관찰 난간',tourRoute42MahoganyStone:'황토 서쪽 도착 표지',
    tourMortarWaterTrace:'절구산 암반 물길',tourMortarEchoWall:'산바람 메아리벽',tourMortarDeepBoundary:'닫힌 깊은층 경계',tourMortarReturnBoard:'42번도로 귀환 표식',
  };
  if(!titles[event])return false;
  const route=g.save.map===JOHTO_ROUTE_42?'인주시티 ↔ 42번도로 ↔ 황토마을 · 가운데 북쪽 절구산 선택 분기':'절구산 1층 ↔ 남쪽 출구 ↔ 42번도로';
  const boundary=g.save.map===JOHTO_MT_MORTAR_1F||event==='tourRoute42MortarBoard'?'절구산 방문은 선택이다. 2·3층, 폭포, 특별 조우와 사건 완료는 아직 열리지 않았다.':'도로 옆 물길은 풍경 구역이며 수상 이동·낚시 조우를 제공하지 않는다.';
  g.say(titles[event],[party,route,boundary]);return true;
}
