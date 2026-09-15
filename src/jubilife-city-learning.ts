import type { Engine } from './engine';
import type { GameMap } from './types';
import type { TourOutdoors } from './explore-outdoors';
import { SPECIES } from './pokemon';
import { leadPokemon } from './team';

const F={
  partner:'jubilifeCityLearningPartner',slot:'jubilifeCityLearningPartnerSlot',
  plaza:'jubilifeCityLearningPlaza',broadcast:'jubilifeCityLearningBroadcast',
  completed:'jubilifeCityLearningCompleted',visited:'jubilifeTrainerSchoolVisited',
} as const;
export const JUBILIFE_PLAZA_LEARNING='jubilifePlazaLearning';

const selected=(g:Engine)=>{
  const slot=g.save.flags[F.slot],mon=typeof slot==='number'?g.save.party[slot]:undefined;
  return mon?.species===g.save.flags[F.partner]?mon:undefined;
};

export function installJubilifeCityLearning(map:GameMap,outdoors:TourOutdoors){
  const object=outdoors.objects.find(item=>item.name==='교류 광장 분수');if(!object)return;
  const previous=object.event,cells=new Set(object.cells.map(cell=>`${cell.x},${cell.y}`));object.event=JUBILIFE_PLAZA_LEARNING;
  for(const prop of map.props)if(prop.dialogue===previous&&cells.has(`${prop.x},${prop.y}`))prop.dialogue=JUBILIFE_PLAZA_LEARNING;
}

function choose(g:Engine,page=0){
  const save=g.save,current=()=>g.save===save&&save.map==='tour_jubilife_school'&&!g.battle;
  const choices=save.party.map((mon,slot)=>({mon,slot})).filter(({mon})=>mon.met==='신오 202번도로'&&mon.hp>0);
  if(!choices.length){g.say('트레이너스쿨 선생님',['202번도로에서 만나 파티에 편성한 건강한 동료가 필요해요.','센터에서 회복·편성하거나 남쪽 202번도로의 선택 풀밭을 둘러본 뒤 돌아오세요. 이 수업은 203번도로 통행 조건이 아니에요.']);return;}
  g.say('현장학습 동료',['광장과 방송국을 함께 걸을 202번도로 출신 동료를 골라 주세요.'],undefined,[
    ...choices.slice(page*3,page*3+3).map(({mon,slot})=>({label:`${SPECIES[mon.species].name} Lv.${mon.level}`,action:()=>{
      if(!current()||save.party[slot]!==mon||mon.hp<=0||mon.met!=='신오 202번도로')return;
      const formation=leadPokemon(save,slot);save.flags[F.partner]=mon.species;save.flags[F.slot]=save.party.indexOf(mon);
      delete save.flags[F.plaza];delete save.flags[F.broadcast];delete save.flags[F.completed];g.persist();
      g.say('트레이너스쿨 선생님',[formation,`${SPECIES[mon.species].name}와 학교 밖 교류 광장 분수를 살펴보고 방송국 로비의 도시 기록을 읽으세요.`,'두 장소를 확인한 뒤 이 교실로 돌아오면 관찰을 정리할 수 있어요.']);
    }})),
    ...(choices.length>3?[{label:page?'앞 동료들':'다음 동료들',action:()=>choose(g,page?0:1)}]:[]),
    {label:'나중에 고른다',action:()=>{}},
  ]);
}

export function handleJubilifeCityLearning(g:Engine,id:string):boolean{
  if(g.save.map==='tour_jubilife_school'&&id==='jubilifeSchoolTeacher'){
    const save=g.save,mon=selected(g),routeWins=['sinnoh-route-202-starly','sinnoh-route-202-bidoof','sinnoh-route-202-burmy'].filter(key=>save.flags['trainerWon:'+key]).length;
    const schoolWins=['sinnoh-jubilife-school-starly','sinnoh-jubilife-school-bidoof'].filter(key=>save.flags['trainerWon:'+key]).length;
    const owned=[...save.party,...save.box??[]].filter(p=>p.met==='신오 202번도로');
    const hurt=save.party.filter(p=>p.hp>0&&p.hp<p.maxHp).length,fainted=save.party.filter(p=>p.hp<=0).length;
    if(!save.flags[F.visited]){save.flags[F.visited]=true;g.persist();}
    if(mon&&save.flags[F.plaza]&&save.flags[F.broadcast]&&!save.flags[F.completed]){save.flags[F.completed]=true;g.persist();}
    const current=()=>g.save===save&&save.map==='tour_jubilife_school'&&!g.battle;
    const learning=save.flags[F.completed]&&mon?`${SPECIES[mon.species].name}와 광장·방송국 현장학습 완료`:mon?`${SPECIES[mon.species].name} · 광장 ${save.flags[F.plaza]?'확인':'미확인'} · 방송국 ${save.flags[F.broadcast]?'확인':'미확인'}`:'현장학습 동료 미선택';
    g.say('트레이너스쿨 선생님',['상태이상과 파티 관리, 상대가 바뀔 때의 기술 선택을 배우는 교실이에요.',`202번도로 출신 보유 ${owned.length}마리 · 도로 실전 ${routeWins}/3 · 교실 실전 ${schoolWins}/2`,save.party.length?`현재 파티 ${save.party.length}마리 · 부상 ${hurt} · 기절 ${fainted}`:'현재 파티가 비어 있어요. 센터 PC에서 동료를 편성하세요.',learning,'현장학습과 학생전은 203번도로 통행 조건이 아니에요.'],undefined,[
      {label:save.flags[F.completed]?'다른 동료와 다시 걷기':'현장학습 동료 고르기',action:()=>{if(current())choose(g);}},
      {label:'현재 파티 확인',action:()=>{if(current()){g.panel='party';g.partyIndex=0;}}},
      {label:'포켓몬센터로',action:()=>{if(current())g.setTourDestination('tour_jubilife_center','nurse');}},
      {label:'203번도로 출발로',action:()=>{if(current())g.setTourDestination('tour_sinnoh_route_203','route203Sign');}},
    ]);return true;
  }
  if(g.save.map==='tour_jubilife'&&id===JUBILIFE_PLAZA_LEARNING){
    const mon=selected(g);if(!mon){g.say('교류 광장 분수',['네 방향에서 온 여행자와 포켓몬이 쉬어 가는 분수다.','트레이너스쿨에서 202번도로 출신 동료를 고르면 함께 도시 현장학습을 할 수 있다.']);return true;}
    if(mon.hp<=0){g.say('교류 광장 분수',[`${SPECIES[mon.species].name}가 지쳐 있다. 포켓몬센터에서 먼저 쉬게 하자.`]);return true;}
    if(!g.save.flags[F.plaza]){g.save.flags[F.plaza]=true;g.persist();}
    g.say('교류 광장 분수',[`${SPECIES[mon.species].name}와 물소리 속에서 북204·동203·남202·서218의 여행자들을 살펴봤다.`,g.save.flags[F.broadcast]?'광장과 방송국을 모두 확인했다. 트레이너스쿨 선생님에게 돌아가자.':'동쪽 방송국 로비에서 도시의 여행 기록도 살펴보자.']);return true;
  }
  if(g.save.map==='tour_jubilife_hall'&&id==='tourExhibit0'){
    const mon=selected(g);if(!mon)return false;
    if(mon.hp<=0){g.say('축복방송국 도시 기록',[`${SPECIES[mon.species].name}가 지쳐 있다. 센터에서 회복한 뒤 기록을 살펴보자.`]);return true;}
    if(!g.save.flags[F.broadcast]){g.save.flags[F.broadcast]=true;g.persist();}
    g.say('축복방송국 도시 기록',[`${SPECIES[mon.species].name}와 202번도로에서 축복 남문에 도착한 여행 기록을 찾아봤다.`,'도로에서 만난 포켓몬과 트레이너의 이야기가 도시 방송 자료로 이어진다.',g.save.flags[F.plaza]?'광장과 방송국을 모두 확인했다. 트레이너스쿨 선생님에게 돌아가자.':'학교로 돌아가기 전에 교류 광장 분수도 함께 살펴보자.']);return true;
  }
  return false;
}
