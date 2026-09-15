import type {Engine} from './engine';
import {SPECIES} from './pokemon';

const SLOT='darkCaveSurveyPartnerSlot';
const SPECIES_ID='darkCaveSurveyPartnerSpecies';
const START_LEVEL='darkCaveSurveyStartLevel';
const POND='darkCaveSurveyPondObserved';
const DONE='darkCaveSurveyCompleted';
const END_LEVEL='darkCaveSurveyEndLevel';
const ORIGIN='어둠의동굴 남서 구역';

export function handleJohtoDarkCaveLife(g:Engine,event:string):boolean{
  if(g.save.map!=='tour_johto_dark_cave_west'||!['tourDarkCaveHabitat','tourDarkCavePond','tourDarkCaveDeepBoundary','tourDarkCaveObserver'].includes(event))return false;
  const save=g.save,map=save.map,active=()=>g.save===save&&g.save.map===map&&!g.battle;
  const selected=()=>{const slot=save.flags[SLOT];const mon=typeof slot==='number'?save.party[slot]:undefined;return mon?.species===save.flags[SPECIES_ID]?mon:undefined;};
  const guide=(id:string)=>()=>{if(active())g.setTourDestination('tour_johto_dark_cave_west',id);};
  const choose=(page=0)=>{
    const local=save.party.filter(mon=>mon.met===ORIGIN);
    g.say('어둠의동굴 생태 조사원',['이 동굴에서 만난 건강한 동료와 날갯소리·암반 흔적을 비교해 보자.'],undefined,[
      ...local.slice(page*3,page*3+3).map(mon=>({label:`${SPECIES[mon.species].name} Lv.${mon.level}`,action:()=>{
        if(!active()||!save.party.includes(mon))return;
        if(mon.hp<=0){g.say('생태 조사 준비',['이 동료는 지쳐 있다. 도라지 포켓몬센터에서 회복한 뒤 다시 오자.']);return;}
        save.flags[SLOT]=save.party.indexOf(mon);save.flags[SPECIES_ID]=mon.species;save.flags[START_LEVEL]=mon.level;save.flags[POND]=false;save.flags[DONE]=false;delete save.flags[END_LEVEL];g.persist();
        g.setTourDestination('tour_johto_dark_cave_west','tourDarkCavePond');
        g.say('생태 조사 시작',[`${SPECIES[mon.species].name}와 작은 연못 쪽 메아리를 확인하자.`,'밝은 돌 본선으로 이동하면 야생 조우 없이 연못 앞까지 갈 수 있다.']);
      }})),
      ...(local.length>3?[{label:page?'앞 동료':'다음 동료',action:()=>{if(active())choose(page?0:1);}}]:[]),
      {label:'나중에 하기',action:()=>{}},
    ]);
  };

  if(event==='tourDarkCaveObserver'||event==='tourDarkCaveHabitat'){
    if(save.flags[DONE]){
      const start=Number(save.flags[START_LEVEL]??0),end=Number(save.flags[END_LEVEL]??start),species=Number(save.flags[SPECIES_ID]);
      g.say('어둠의동굴 생태 조사원',[`${SPECIES[species]?.name??'동료'}와 남긴 조사 기록이 있다. Lv.${start}에서 완료 당시 Lv.${end}.`,'31번도로로 돌아가 도라지 동문 기록석에서 귀환 기록을 확인할 수 있다.'],undefined,[
        {label:'31번도로 출구로',action:()=>{if(active())g.setTourDestination('tour_johto_dark_cave_west','tourDarkCaveRoute31Light');}},
        {label:'동굴 더 살피기',action:()=>{}},
      ]);return true;
    }
    const local=save.party.filter(mon=>mon.met===ORIGIN);
    const partner=selected();
    if(!local.length){g.say('어둠의동굴 생태 조사원',['이 동굴의 선택 암반 지대에는 꼬마돌과 주뱃이 산다. 먼저 현지 동료를 만나 포획해 보자.','포획하지 않아도 밝은 돌 본선과31번도로 귀환은 계속 열려 있다.']);return true;}
    if(!partner){choose();return true;}
    g.say('어둠의동굴 생태 조사원',[`${SPECIES[partner.species].name}와 진행 중인 기록이 있다.`,partner.hp<=0?'동료가 지쳐 있다. 도라지센터에서 회복한 뒤 다시 선택해 주세요.':save.flags[POND]?'연못의 메아리를 확인했다. 동쪽 심부 경계에서 돌아갈 방향을 기록하자.':'작은 연못 앞에서 날갯소리와 암반 울림을 비교하자.'],undefined,[
      {label:partner.hp<=0?'31번도로 출구로':save.flags[POND]?'심부 경계로':'작은 연못으로',action:partner.hp<=0?guide('tourDarkCaveRoute31Light'):guide(save.flags[POND]?'tourDarkCaveDeepBoundary':'tourDarkCavePond')},
      {label:'동료 다시 고르기',action:()=>{if(active())choose();}},
      {label:'나중에 이어하기',action:()=>{}},
    ]);return true;
  }

  const partner=selected();
  if(!partner||partner.hp<=0){g.say('어둠의동굴 조사',['함께 기록할 건강한 현지 동료가 파티에 없다. 서식 흔적의 조사원에게 돌아가 다시 준비하자.'],undefined,[{label:'조사원에게',action:guide('tourDarkCaveHabitat')},{label:'돌아가기',action:()=>{}}]);return true;}
  if(event==='tourDarkCavePond'){
    if(save.flags[POND]){g.say('남서 구역 작은 연못',[`${SPECIES[partner.species].name}와 확인한 메아리가 기록되어 있다.`,'다음은 동쪽 심부 경계에서31번도로 귀환 방향을 확인하자.'],undefined,[{label:'심부 경계로',action:guide('tourDarkCaveDeepBoundary')},{label:'더 살펴보기',action:()=>{}}]);return true;}
    g.say('남서 구역 작은 연못',[`${SPECIES[partner.species].name}와 물가의 메아리를 들어 보았다.`,'어떤 흔적을 먼저 기록할까?'],undefined,[
      {label:partner.species===41?'천장 날갯소리':'마른 암반 울림',action:()=>{if(!active()||selected()!==partner)return;save.flags[POND]=true;g.persist();g.setTourDestination('tour_johto_dark_cave_west','tourDarkCaveDeepBoundary');g.say('메아리 기록',[`${SPECIES[partner.species].name}의 움직임과 동굴 울림을 구분해 기록했다.`,'동쪽 심부 경계에서 돌아갈 길을 확인하자.']);}},
      {label:'돌아가기',action:()=>{}},
    ]);return true;
  }
  if(!save.flags[POND]){g.say('심부 통행 경계',['작은 연못의 메아리를 먼저 확인해야 이 지점까지의 탐사 기록을 완성할 수 있다.'],undefined,[{label:'작은 연못으로',action:guide('tourDarkCavePond')},{label:'돌아가기',action:()=>{}}]);return true;}
  g.say('심부 통행 경계',[`${SPECIES[partner.species].name}와 여기까지의 밝은 돌 표식과 메아리를 맞췄다.`,'31번도로로 돌아가는 방향을 조사 기록에 남길까?'],undefined,[
    {label:'귀환 방향 기록',action:()=>{if(!active()||selected()!==partner)return;save.flags[DONE]=true;save.flags[END_LEVEL]=partner.level;g.persist();g.setTourDestination('tour_johto_dark_cave_west','tourDarkCaveRoute31Light');g.say('동굴 조사 완료',[`${SPECIES[partner.species].name}와 입구 탐사 구역을 기록했다.`,'서쪽 아래 밝은 돌 표식을 따라31번도로로 돌아가자.']);}},
    {label:'아직 더 살펴보기',action:()=>{}},
  ]);return true;
}
