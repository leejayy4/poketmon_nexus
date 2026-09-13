import type { Engine } from './engine';
import { SPECIES,pokemonMoves } from './pokemon';

const EVENTS=new Set(['tourIcirrusGearCare','tourIcirrusRainLedger','tourIcirrusDryRest','tourIcirrusRoadKit','tourIcirrusTowerMap','tourIcirrusWindRest']);

/** Optional home-life records around Icirrus travel; never heals, rewards or gates travel. */
export function handleIcirrusHomeLife(g:Engine,event:string):boolean{
  if(g.save.map==='tour_icirrus_hall'&&event==='tourIcirrusCompanionCorner'){
    const save=g.save,current=()=>g.save===save&&save.map==='tour_icirrus_hall'&&!g.battle;
    const guide=(map:string,target?:string)=>()=>{if(current())g.setTourDestination(map,target);};
    const choose=(page=0)=>{
      if(!current())return;
      g.say('생활관 동료 교류 코너',['함께 여행하는 동료를 보여 주세요. 지금 익힌 기술과 다음 도전을 함께 살펴볼게요.'],undefined,[
        ...save.party.slice(page*3,page*3+3).map(mon=>({label:`${SPECIES[mon.species].name} Lv.${mon.level}`,action:()=>{
          if(!current()||!save.party.includes(mon))return;
          g.say('동료의 현재 모습',[`${SPECIES[mon.species].name} Lv.${mon.level} · HP ${mon.hp}/${mon.maxHp}`,`만난 곳: ${mon.met}\n현재 기술: ${pokemonMoves(mon).join(' / ')}`,
            mon.hp<=0?'먼저 센터에서 동료를 회복해 주세요.':save.flags['trainerWon:unova-route-8-practice']?'8번도로 실전에서 이미 승리했군요. 지금 동료의 상태를 확인하고 트레이너에게 다음 여행길을 물어보세요.':mon.level<19?'8번도로 상대는 딱정곤 Lv.18·쪼마리 Lv.19예요. 동료의 레벨과 기술을 살펴 준비해 보세요.':'8번도로에서는 딱정곤 Lv.18·쪼마리 Lv.19와 겨룰 수 있어요. 레벨뿐 아니라 기술과 남은 HP도 살펴 주세요.',
          ],undefined,[{label:'이 동료의 파티 화면',action:()=>{if(!current())return;const index=save.party.indexOf(mon);if(index<0)return;g.panel='party';g.partyIndex=index;}},{label:'설화센터 회복·PC',action:guide('tour_icirrus_center')},{label:save.flags['trainerWon:unova-route-8-practice']?'8번도로 여행 조언':'8번도로 실전 준비로',action:guide('tour_unova_route_08','tourRouteEightTrainer')},{label:'다른 동료 보여주기',action:()=>choose(page)},{label:'이야기를 마친다',action:()=>{}}]);
        }})),
        ...(save.party.length>(page+1)*3?[{label:'다음 동료',action:()=>choose(page+1)}]:[]),
        ...(page>0?[{label:'앞쪽 동료',action:()=>choose(page-1)}]:[]),
        {label:'센터에서 동료 데려오기',action:guide('tour_icirrus_center')},{label:'나중에 들른다',action:()=>{}},
      ]);
    };choose();return true;
  }
  if(g.save.map==='tour_icirrus'&&event==='tourOutdoor0'){
    const save=g.save;
    const guide=(map:Parameters<Engine['setTourDestination']>[0],target?:string)=>()=>{if(g.save===save&&save.map==='tour_icirrus'&&!g.battle)g.setTourDestination(map,target);};
    const compared=!!save.flags.icirrusWaterCompared;
    g.say('도시 빗물 연못',['석재 물턱 안에 고인 빗물과 마른 생활길의 높이가 다르다.',compared?'생활관에서 비교한 길·연못·생활용 물의 구분을 수위판에서 다시 읽었다.':save.flags.icirrusArrivalLogged?'생활관 2층에서 이 연못과 8번도로 웅덩이의 쓰임을 비교할 수 있다.':'생활관 1층에서 8번도로 도착 기록을 남긴 뒤 2층 물 비교로 이어갈 수 있다.',save.flags.icirrusMoorObservationCompleted?'습지의 갈대·물새 관찰 기록도 남아 있다. 현장과 도시 자료를 다시 살펴볼 수 있다.':'현장 관찰은 동쪽 8번도로의 북쪽 분기에 있는 설화의 습지에서 시작한다.'],undefined,[{label:save.flags.icirrusArrivalLogged?'생활관 물 비교':'생활관 도착 기록',action:save.flags.icirrusArrivalLogged?guide('tour_icirrus_hall_2f','tourIcirrusWaterStudy'):guide('tour_icirrus_hall','tourIcirrusArrivalLog')},{label:'습지 현장 관찰',action:guide('tour_icirrus_moor','icirrusMoorKeeper')},{label:'계속 걷는다',action:()=>{}}]);return true;
  }
  if(g.save.map==='tour_icirrus'&&event==='tourOutdoor2'){
    const save=g.save;
    const guide=(map:Parameters<Engine['setTourDestination']>[0],target?:string)=>()=>{if(g.save===save&&save.map==='tour_icirrus'&&!g.battle)g.setTourDestination(map,target);};
    g.say('용나선탑 전망 둔덕',['겹쳐진 돌턱 위의 방향판에 북문과 탑 기단이 새겨져 있다.',save.flags.dragonspiralWindRecorded?'탑에서 기록한 바람 방향을 도시의 전망과 다시 맞춰 본다.':save.flags.dragonspiralApproachMoatObserved?'해자에서 살핀 흔적 다음으로 탑 기슭을 향하는 길이 이어진다.':'용나선탑은 도시 북문의 번호 없는 접근로로 간다. 이 둔덕은 탑 입구가 아니다.','설화의 습지는 동쪽 8번도로에서 북쪽으로 갈라지는 별도 장소다.'],undefined,[{label:'용나선탑 접근로',action:guide('tour_dragonspiral_approach')},{label:'생활관 전망실',action:guide('tour_icirrus_hall_3f','tourIcirrusCompanionRest')},{label:'계속 걷는다',action:()=>{}}]);return true;
  }
  if(g.save.map==='tour_icirrus'&&event==='tourOutdoor1'){
    const save=g.save;
    const guide=(map:Parameters<Engine['setTourDestination']>[0],target?:string)=>()=>{if(g.save===save&&save.map==='tour_icirrus'&&!g.battle)g.setTourDestination(map,target);};
    g.say('습지 생활 뜰',['돌 수조 옆으로 물이 빠지고, 건조대에는 크기가 다른 천이 걸려 있다.',save.flags.icirrusGearChecked?'주택에서 동료와 장화를 손질한 기록이 있다. 위층 방석에서 건조 휴게 자리를 살펴볼 수 있다.':'습지 주민의 집 1층에서 동료의 발과 장화를 손질할 수 있다.'],undefined,[{label:'주택 손질방으로',action:guide('tour_icirrus_home1','tourIcirrusGearCare')},{label:'건조 휴게방으로',action:guide('tour_icirrus_home1_3f','tourIcirrusDryRest')},{label:'계속 걷는다',action:()=>{}}]);return true;
  }
  if(!g.save.map.startsWith('tour_icirrus_home')||!EVENTS.has(event))return false;
  const save=g.save,map=save.map,current=()=>g.save===save&&save.map===map&&!g.battle;
  const healthy=save.party.map((mon,slot)=>({mon,slot})).filter(({mon})=>mon.hp>0);
  const record=(flag:string,speciesFlag:string,species:number,title:string,pages:string[])=>{if(!current())return;save.flags[flag]=true;save.flags[speciesFlag]=species;g.persist();g.say(title,pages);};
  if(event==='tourIcirrusGearCare'){
    g.say('습지 장비 선반',[save.flags.icirrusGearChecked?'앞서 장화와 동료 발을 살핀 기록이 있다.':'8번도로와 습지를 걸은 뒤 진흙·갈대 조각·젖은 털을 확인하는 자리다.','HP를 회복하는 시설은 아니며 건강한 동료와 생활 점검만 기록한다.'],undefined,[...healthy.map(({mon,slot})=>({label:`${SPECIES[mon.species].name} 발 살피기`,action:()=>{if(!current()||save.party[slot]!==mon||mon.hp<=0)return;record('icirrusGearChecked','icirrusGearSpecies',mon.species,'습지 여행 손질',[`${SPECIES[mon.species].name}의 발과 털에서 진흙·갈대 조각을 털고 마른 천으로 닦았다.`,'HP·상태·능력치는 변하지 않는다. 실제 회복은 설화시티 센터를 이용한다.']);}})),{label:'장화만 정리한다',action:()=>record('icirrusGearChecked','icirrusGearSpecies',0,'습지 여행 손질',['장화의 물기와 흙을 털어 다음 이동을 준비했다.','포켓몬 상태와 소지품은 변하지 않는다.'])},{label:'나중에 한다',action:()=>{}}]);return true;
  }
  if(event==='tourIcirrusRainLedger'){g.say('빗물 높이 수첩',[save.flags.icirrusMoorObservationCompleted?'설화의 습지에서 확인한 갈대 수위와 물새 흔적이 오늘 기록 옆에 적혀 있다.':'습지 현장 기록은 비어 있고 8번도로 웅덩이와 도시 연못의 높이만 날짜별로 적혀 있다.',save.flags.icirrusWaterCompared?'생활관에서 마른 본선·빗물 길·생활용 물을 나눈 기록도 함께 표시됐다.':'생활관 2층에서 길·연못·생활용 물의 쓰임을 비교할 수 있다.','수첩은 계절·결빙·수상 이동을 바꾸지 않는다.']);return true;}
  if(event==='tourIcirrusDryRest'){
    const species=Number(save.flags.icirrusGearSpecies??0),name=SPECIES[species]?.name;g.say('따뜻한 동료 방석',[save.flags.icirrusGearChecked?(name?`${name}의 발을 살핀 뒤 몸을 말릴 자리를 비워 두었다.`:'여행 장비를 손질한 뒤 동료가 쉴 자리를 비워 두었다.'):'1층 장비 선반에서 여행 뒤 발과 장화를 먼저 살필 수 있다.','방석은 생활 표현이며 HP·상태를 회복하지 않는다.']);return true;
  }
  if(event==='tourIcirrusRoadKit'){g.say('마른 길 준비대',[save.flags.dragonspiralApproachMoatObserved?'북문 접근로 해자 기록이 있어 마른 중앙길과 관찰 데크를 구분해 표시했다.':'북문 접근로에서는 중앙 마른 길로 탑까지 갈 수 있고 해자 관찰은 선택이다.','동쪽 8번도로 본선과 북문 접근로는 서로 다른 출구다. 장비 확인은 통행 조건이 아니다.']);return true;}
  if(event==='tourIcirrusTowerMap'){
    const species=SPECIES[Number(save.flags.dragonspiralPartnerSpecies??save.flags.dragonspiralApproachPartnerSpecies??0)]?.name;
    g.say('용나선 방향 지도',[save.flags.dragonspiralWindRecorded?(species?`${species}와 탑 1층 기단→2층 석재→3층 바람을 살핀 경로가 표시됐다.`:'탑 1층 기단→2층 석재→3층 바람을 살핀 경로가 표시됐다.'):save.flags.dragonspiralBaseObserved?'탑 1층 기단까지 살핀 기록과 다음 2층 계단이 표시됐다.':save.flags.dragonspiralApproachMoatObserved?'접근로 해자 관찰 뒤 탑 기슭으로 이어지는 중앙길이 표시됐다.':'설화 북문→번호 없는 접근로→용나선탑 기슭의 왕복 경로가 표시됐다.','서쪽 궐수 암반굴은 과거 저장 귀환용 프로젝트 통로이며 공식 도로·동굴 이름이 아니다.']);return true;
  }
  if(event==='tourIcirrusWindRest'){
    const companion=healthy[0]?.mon;if(!companion){g.say('북풍 창가 자리',['함께 바람을 돌아볼 건강한 동료가 없다.','실제 회복은 설화시티 센터를 이용하며 집과 북문 통행은 열려 있다.']);return true;}
    record('icirrusTowerReturnRested','icirrusTowerReturnSpecies',companion.species,'북풍 창가 휴게 기록',[`${SPECIES[companion.species].name}와 창가에서 도시 연못·북문 접근로·용나선탑 방향의 바람을 차례로 돌아봤다.`,save.flags.dragonspiralWindRecorded?'탑 3층 바람 기록과 설화시티 귀환 방향을 함께 정리했다.':'탑 관찰 전에도 도시의 북쪽 방향을 살필 수 있다.','HP·상태·능력치·보상·통행은 변하지 않는다.']);return true;
  }
  return false;
}
