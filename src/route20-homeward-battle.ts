import type { Engine } from './engine';
import type { Pokemon } from './types';
import { createTrainerBattle } from './battle';
import { maxHpAtLevel } from './growth';
import { pokemonMoves,SPECIES } from './pokemon';
import { isSeafoamCompanion } from './cinnabar-habitats';
import type { Battle } from './battle';

const MAP='tour_kanto_route_20';
const EVENT='route20HomewardKeeper';
const TRAINER='kanto-route-20-homeward-practice';
const WIN=`trainerWon:${TRAINER}`;
export const ROUTE20_PARTNER={
  species:'nexusRoute20BattlePartner',slot:'nexusRoute20BattlePartnerSlot',
  level:'nexusRoute20BattlePartnerLevel',participated:'nexusRoute20BattlePartnerWon',
} as const;

function preparePartner(save:Engine['save']){
  const f=ROUTE20_PARTNER,partner=save.party[0];
  delete save.flags[f.species];delete save.flags[f.slot];delete save.flags[f.level];
  save.flags[f.participated]=false;
  if(!partner||partner.hp<=0||!isSeafoamCompanion(partner))return false;
  save.flags[f.species]=partner.species;save.flags[f.slot]=0;save.flags[f.level]=partner.level;return true;
}

export function recordRoute20PartnerBattle(save:Engine['save'],battle:Battle,outcome:string|undefined){
  const f=ROUTE20_PARTNER,slot=save.flags[f.slot];
  if(save.flags[f.participated]===true||outcome!=='won'||battle.kind!=='trainer'||battle.trainer?.id!==TRAINER||typeof slot!=='number')return false;
  const partner=save.party[slot];
  if(!partner||partner.species!==save.flags[f.species]||!isSeafoamCompanion(partner)||!battle.defeatedOpponentParticipants?.includes(partner))return false;
  save.flags[f.participated]=true;return true;
}

/** Optional west-sandbar battle that turns a Seafoam catch into a return journey. */
export function handleRoute20HomewardBattle(g:Engine,event:string):boolean{
  if(g.save.map!==MAP||event!==EVENT)return false;
  const save=g.save,current=()=>g.save===save&&save.map===MAP&&!g.battle&&!g.move&&!g.transition;
  const localParty=save.party.filter(isSeafoamCompanion),localBox=(save.box??[]).filter(isSeafoamCompanion);
  const localLines=localParty.length
    ?localParty.slice(0,4).map(mon=>`${SPECIES[mon.species].name} Lv.${mon.level} · HP ${mon.hp}/${mon.maxHp}\n${pokemonMoves(mon).join(' / ')}`)
    :[localBox.length?'쌍둥이섬에서 만난 동료가 센터 PC에 있다. 홍련에서 파티로 데려올 수 있다.':'쌍둥이섬에서 포획하지 않았어도 통행과 선택전은 열려 있다.'];
  const won=save.flags[WIN]===true;
  const partnerSlot=save.flags[ROUTE20_PARTNER.slot];
  const battlePartner=typeof partnerSlot==='number'?save.party[partnerSlot]:undefined;
  const partnerWon=save.flags[ROUTE20_PARTNER.participated]===true&&battlePartner?.species===save.flags[ROUTE20_PARTNER.species]&&isSeafoamCompanion(battlePartner);
  const retry=won&&!partnerWon&&!!save.party[0]&&save.party[0].hp>0&&isSeafoamCompanion(save.party[0]);
  const guide=(map:string,event?:string)=>()=>{if(current())g.setTourDestination(map,event);};
  const show=()=>{
    if(!current())return;
    g.say('20번수로 새 조련사',[
      won?'서쪽 모래톱에서 치른 귀환전 기록이 남아 있다. 같은 상금은 다시 받지 않는다.':'쌍둥이섬을 빠져나온 동료와 모래톱에서 한 번 겨뤄 볼래? 내 찌르꼬 Lv.25가 바닷바람을 읽으며 기다리고 있어.',
      ...localLines,
      won?(save.party.some(mon=>mon.hp<mon.maxHp)?'파도가 잦아들었다. 지친 동료를 홍련센터에서 쉬게 한 뒤 다음 여행을 정하자.':'동료들의 상태가 좋다. 홍련으로 돌아가 수첩을 정리하거나 다시 수로를 건널 수 있다.'):'현지 동료를 먼저 내보내면 동굴에서 익힌 기술과 성장을 바로 확인할 수 있다. 다른 동료로 도전해도 괜찮다.',
      ...(partnerWon&&battlePartner?[`${SPECIES[battlePartner.species].name}이 실제로 상대를 쓰러뜨리고 귀환전을 마쳤다.\n시작 Lv.${Number(save.flags[ROUTE20_PARTNER.level])} → 현재 Lv.${battlePartner.level} · HP ${battlePartner.hp}/${battlePartner.maxHp}`]:won?['과거 승리는 남아 있지만 쌍둥이섬 동료의 실제 격파 기록은 없다. 건강한 현지 동료를 선두에 두면 상금 없는 확인전을 할 수 있다.']:[]),
      '이 모래톱은 현재 연락선 데크로 재구성됐다. 배틀을 거절하거나 져도 홍련·쌍둥이섬·19번수로 통행은 막히지 않는다.',
    ],undefined,[
      ...(!won||retry?[{label:won?'동료 참가 확인전':'귀환전에 도전',action:()=>{
        if(!current()||(save.flags[WIN]&&!retry))return;
        if(!save.party.some(mon=>mon.hp>0)){
          g.say('20번수로 새 조련사',['싸울 수 있는 동료가 없다. 홍련센터에서 먼저 쉬게 하자.'],undefined,[
            {label:'홍련센터 안내',action:guide('tour_cinnabar_center','nurse')},
            {label:'이번에는 쉬기',action:()=>{}},
          ]);return;
        }
        preparePartner(save);
        const level=25,maxHp=maxHpAtLevel(396,level);
        const opponent:Pokemon={species:396,level,hp:maxHp,maxHp,experience:0,nature:'성실',met:'20번수로 새 조련사 동료'};
        opponent.moves=pokemonMoves(opponent);
        g.battle=createTrainerBattle(save,{id:TRAINER,name:'20번수로 새 조련사',reward:won?0:560,team:[opponent]});
        if(g.battle){g.persist();g.say('20번수로 새 조련사',['찌르꼬는 바람을 타고 빠르게 움직여. 현재 HP와 기술을 확인하며 맞서 보자!']);}
      }}]:[]),
      {label:'현재 파티 확인',action:()=>{if(current()){g.panel='party';g.partyIndex=0;}}},
      {label:'홍련센터로 귀환',action:guide('tour_cinnabar_center','nurse')},
      {label:'쌍둥이섬 수첩으로',action:guide('tour_cinnabar_home2')},
      {label:won?'여행 계속하기':'도전하지 않는다',action:()=>{}},
    ]);
  };
  show();return true;
}
