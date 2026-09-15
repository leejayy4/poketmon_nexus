import type { Engine } from './engine';
import type { Battle } from './battle';
import { SPECIES } from './pokemon';
import { leadPokemon } from './team';
import { RUNTIME_RULES } from './data/rules';
import type { SaveData } from './types';

const SEWER='tour_castelia_sewers',PARK='tour_castelia_park';
export const CASTELIA_SEWER_JOURNEY={
  inspected:'nexusCasteliaSewerHabitatInspected',
  partner:'nexusCasteliaSewerParkPartner',
  slot:'nexusCasteliaSewerParkPartnerSlot',
  level:'nexusCasteliaSewerParkPartnerLevel',
  participated:'nexusCasteliaSewerParkPartnerWon',
  returned:'nexusCasteliaSewerParkReturned',
} as const;

const localMet=new Set(['구름하수도','구름시티 공원']);

/** Record only this selected object taking part in a newly won full trainer battle. */
export function recordCasteliaSewerPartnerBattle(save:SaveData,battle:Battle,outcome:string|undefined){
  const f=CASTELIA_SEWER_JOURNEY,slot=save.flags[f.slot];
  if(outcome!=='won'||battle.kind!=='trainer'||battle.trainer?.id!=='castelia-park-practice'||typeof slot!=='number')return false;
  const partner=save.party[slot];
  if(!partner||partner.species!==save.flags[f.partner]||!localMet.has(partner.met)||!battle.defeatedOpponentParticipants?.includes(partner))return false;
  if(save.flags[f.participated])return false;
  save.flags[f.participated]=true;return true;
}

/** A free local loop. It records an actual party capture and battle result, never the BW2 Hugh/Plasma story. */
export function handleCasteliaSewerJourney(g:Engine,event:string):boolean{
  const save=g.save,map=save.map,player=save.player,x=player.x,y=player.y,f=CASTELIA_SEWER_JOURNEY;
  if(map!==SEWER&&map!==PARK)return false;
  const current=()=>g.save===save&&g.save.player===player&&g.save.map===map&&player.x===x&&player.y===y&&!g.battle;
  const guide=(target:string,id?:string)=>()=>{if(current())g.setTourDestination(target,id);};
  const persist=(flag:string,value:boolean|number)=>{if(!current())return false;save.flags[flag]=value;g.persist();return true;};
  const localParty=()=>save.party.filter(mon=>mon.hp>0&&localMet.has(mon.met));
  if(map===SEWER&&event==='tourCasteliaSewerScientist'){
    const supplied='casteliaSewerScientistPotionReceived';
    const supplies=[
      {label:'가방에서 상처약 사용',action:()=>{if(current()){g.panel='bag';g.bagIndex=1;}}},
      {label:'항구 센터로',action:guide('tour_castelia_center','nurse')},
      {label:'계속 탐험한다',action:()=>{}},
    ];
    if(save.flags[supplied]){
      g.say('배수 연구원',['준비해 둔 상처약은 이미 전달했어요. 다친 동료는 항구 센터에서도 치료받을 수 있어요.','곁방의 흔적을 살핀 뒤 서쪽 계단으로 올라가면 햇볕 드는 공원이 나와요.'],undefined,supplies);return true;
    }
    g.say('배수 연구원',['배수에 섞인 물질을 조사하며 약으로 쓸 수 있는 성분을 찾고 있어요. 야생 질퍽이의 진흙을 함부로 만지지는 마세요.','탐험하는 동료를 위해 검사를 마친 상처약 하나를 준비했어요.'],undefined,[{label:'상처약을 받는다',action:()=>{
      if(!current()||save.flags[supplied])return;
      if(save.inventory.potions>=RUNTIME_RULES.inventoryCapacity){g.say('배수 연구원',['상처약을 더 넣을 자리가 없네요. 도구를 사용한 뒤 다시 오세요.'],undefined,supplies);return;}
      save.inventory.potions++;save.flags[supplied]=true;g.persist();
      g.say('배수 연구원',['상처약 1개를 받았다!','가방에서 다친 동료에게 사용하세요. 남쪽 본선은 조우 구역을 피해 항구로 이어져요.'],undefined,supplies);
    }},{label:'지금은 받지 않는다',action:()=>{}}]);return true;
  }

  if(map===SEWER&&event==='tourCasteliaSewerHabitat'){
    const first=!save.flags[f.inspected];
    g.say('마른 배수 곁방',[
      '낮은 배수홈 옆 마른 바닥에 작은 발자국과 진흙 자국이 겹쳐 있다.',
      '꼬렛과 주뱃은 마른 통로를 오가고, 질퍽이는 진흙 가까이에 머문다. 밝은 본선으로 걸으면 조우 공간을 피할 수 있다.',
      first?'흔적을 확인한 뒤 서쪽 통로의 북쪽 계단으로 공원에 올라가 보자.':'공원에서 만난 동료와 돌아왔다면 이 흔적과 실제 모습을 다시 비교할 수 있다.',
    ],undefined,[
      {label:first?'흔적을 수첩에 남긴다':'공원으로 다시 간다',action:()=>{
        if(first&&!persist(f.inspected,true))return;
        guide(PARK,'tourCasteliaParkLight')();
      }},
      {label:'항구로 돌아간다',action:guide('tour_castelia','tourCasteliaSewerEntrance')},
      {label:'계속 둘러본다',action:()=>{}},
    ]);return true;
  }

  if(map===PARK&&event==='tourCasteliaParkLight'){
    if(!save.flags[f.inspected]){
      g.say('빌딩 사이 햇볕',['중앙 나무와 양쪽 풀밭 사이로 햇볕이 든다.','먼저 남쪽 계단으로 내려가 하수도 곁방의 흔적을 살피면 두 서식지를 이어 볼 수 있다.'],undefined,[
        {label:'하수도 곁방으로',action:guide(SEWER,'tourCasteliaSewerHabitat')},
        {label:'공원을 산책한다',action:()=>{}},
      ]);return true;
    }
    const candidates=localParty();
    if(!candidates.length){
      g.say('두 서식지를 잇는 관찰',['하수도 흔적과 공원의 풀잎을 비교했다. 이곳에서 만난 포켓몬은 서로 다른 그늘과 먹이를 이용한다.','하수도나 공원에서 포켓몬을 만나 포획한 뒤, 건강한 상태로 파티에 데려오면 함께 선택전을 준비할 수 있다.'],undefined,[
        {label:'공원 풀밭을 살핀다',action:()=>{}},
        {label:'항구 센터에서 편성',action:guide('tour_castelia_center','tourExhibit1')},
      ]);return true;
    }
    const choices=candidates.map(mon=>({label:`${SPECIES[mon.species].name} · Lv.${mon.level}`,action:()=>{
      if(!current()||!save.party.includes(mon)||mon.hp<=0||!localMet.has(mon.met))return;
      const formation=leadPokemon(save,save.party.indexOf(mon));
      save.flags[f.partner]=mon.species;save.flags[f.slot]=save.party.indexOf(mon);save.flags[f.level]=mon.level;save.flags[f.participated]=false;save.flags[f.returned]=false;g.persist();
      g.say('공원 동료 관찰',[`${mon.met}에서 만난 ${SPECIES[mon.species].name}와 하수도의 흔적, 공원의 풀잎을 차례로 비교했다.`,formation,`현재 Lv.${mon.level} · HP ${mon.hp}/${mon.maxHp}\n남쪽 산책 트레이너와 겨룬 뒤 같은 계단으로 돌아오자.`],undefined,[
        {label:'산책 트레이너에게',action:guide(PARK,'tourCasteliaParkTrainer')},
        {label:'지금은 산책한다',action:()=>{}},
      ]);
    }}));
    g.say('함께 관찰할 동료',['하수도나 공원에서 실제로 만나 파티에 데려온 건강한 동료를 고르자.','선택은 포획·편성·회복을 대신하지 않는다.'],undefined,[...choices,{label:'나중에 고른다',action:()=>{}}]);return true;
  }

  if(map===PARK&&event==='tourCasteliaParkReturn'){
    const species=Number(save.flags[f.partner]??0),start=Number(save.flags[f.level]??0),slot=save.flags[f.slot];
    const partner=typeof slot==='number'?save.party[slot]:undefined;
    const samePartner=partner&&partner.species===species&&localMet.has(partner.met)?partner:undefined;
    if(save.flags[f.returned]){
      g.say('공원 귀환 기록',[`함께 출발한 동료의 첫 기록은 Lv.${start}, 귀환 때는 ${SPECIES[species]?.name??'동료'}였다.\n이 수첩에는 그날 함께 마친 여행이 남아 있다.`,'남쪽 계단 → 구름하수도 남쪽 본선 → 동쪽 계단 → 항구. 센터는 항구에서 북서쪽이다.'],undefined,[
        {label:'항구 센터로',action:guide('tour_castelia_center','nurse')},
        {label:'하수도로 내려간다',action:guide(SEWER,'tourCasteliaSewerHabitat')},
        {label:'계속 산책한다',action:()=>{}},
      ]);return true;
    }
    if(species&&!samePartner){
      g.say('다시 함께할 동료',['함께 출발한 동료를 현재 파티에서 확인할 수 없다. 같은 종의 다른 포켓몬을 이전 동료로 대신 기록하지 않는다.','햇볕 자리에서 동료를 다시 고르면 새 출발 레벨로 기록하고 선택전도 다시 진행한다.'],undefined,[
        {label:'햇볕 자리에서 다시 선택',action:guide(PARK,'tourCasteliaParkLight')},
        {label:'항구 센터에서 편성',action:guide('tour_castelia_center','pc')},
        {label:'기록을 남겨 두고 귀환',action:guide(SEWER,'tourCasteliaSewerHabitat')},
      ]);return true;
    }
    if(samePartner&&samePartner.hp<=0){
      g.say('동료를 먼저 회복하자',[`${SPECIES[samePartner.species].name}은 지금 기절해 있다. 항구 센터에서 회복한 뒤 공원에 돌아오자.`,save.flags[f.participated]?'함께 이긴 기록은 남아 있다. 회복 뒤 귀환 표지로 돌아오면 된다.':'출전할 준비가 되면 산책 트레이너와 다시 겨뤄 보자.'],undefined,[
        {label:'항구 센터에서 회복',action:guide('tour_castelia_center','nurse')},
        {label:'지금은 공원에 머문다',action:()=>{}},
      ]);return true;
    }
    if(!species||!save.flags[f.participated]){
      g.say('공원 귀환 표지',['남쪽 계단은 구름하수도의 마른 본선으로 이어진다. 동쪽 끝 계단으로 오르면 항구다.',species?'함께 관찰한 동료가 있다. 남쪽 산책 트레이너와 선택전을 마치면 현재 상태와 귀환 길을 함께 기록할 수 있다.':'하수도 흔적을 읽고 이곳에서 만난 동료와 햇볕 자리를 살피면 짧은 여행 기록을 남길 수 있다.'],undefined,[
        {label:species?'산책 트레이너에게':'햇볕 자리로',action:guide(PARK,species?'tourCasteliaParkTrainer':'tourCasteliaParkLight')},
        {label:'그대로 귀환한다',action:guide(SEWER,'tourCasteliaSewerHabitat')},
      ]);return true;
    }
    if(!samePartner||samePartner.hp<=0){
      g.say('귀환 전 동료 확인',['선택전에 함께한 동료가 현재 건강한 파티에 있어야 귀환 기록을 마칠 수 있다.','기절했다면 항구 센터에서 회복한 뒤 같은 길로 공원에 돌아오자.'],undefined,[
        {label:'항구 센터로',action:guide('tour_castelia_center','nurse')},
        {label:'공원에 머문다',action:()=>{}},
      ]);return true;
    }
    g.say('공원에서 항구로',[`${SPECIES[samePartner.species].name}와 선택전을 마치고 남쪽 계단 앞에 섰다.`,`처음 기록 Lv.${start} → 현재 Lv.${samePartner.level}\nHP ${samePartner.hp}/${samePartner.maxHp}`,'하수도 밝은 본선을 따라 동쪽 항구로 돌아가 센터에서 쉬자.'],undefined,[
      {label:'귀환 기록을 남긴다',action:()=>{
        if(!current()||!save.party.includes(samePartner)||samePartner.hp<=0||!save.flags[f.participated])return;
        if(!save.flags[f.returned]){save.flags[f.returned]=true;g.persist();}
        g.setTourDestination(SEWER,'tourCasteliaSewerHabitat');
      }},
      {label:'공원을 더 걷는다',action:()=>{}},
    ]);return true;
  }
  return false;
}
