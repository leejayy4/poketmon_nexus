import type { Engine } from './engine';
import { SPECIES } from './pokemon';
import { withParticle } from './korean-text';
import { showMoveSchool } from './move-school';

const SLOT='coronet211PartnerSlot',PARTNER='coronet211Partner';
const WEST='coronet211WestLayerChecked',EAST='coronet211EastLayerChecked',DONE='coronet211LayersCompared';

export function handleSinnohCelesticLife(g:Engine,event:string):boolean{
  const save=g.save,origin=save.map,current=()=>g.save===save&&g.save.map===origin&&!g.battle;
  const guide=(map:Parameters<Engine['setTourDestination']>[0],target:string)=>()=>{
    if(current())g.setTourDestination(map,target);
  };
  const selected=()=>{const slot=save.flags[SLOT],mon=typeof slot==='number'?save.party[slot]:undefined;return mon&&mon.species===save.flags[PARTNER]?mon:undefined;};
  // Completed field notes survive PC deposits and party reordering. They describe
  // a recorded species, not an inferred identity of a currently owned Pokemon.
  const recordedSpecies=save.flags[PARTNER];
  const recordedName=typeof recordedSpecies==='number'?SPECIES[recordedSpecies]?.name:undefined;
  const completedNote=()=>recordedName?`${withParticle(recordedName,'과/와')} 두 지층을 비교한 기록이 남아 있다.`:'두 지층을 비교한 현장 기록이 남아 있다.';
  const route210Companion=()=>[...save.party,...(save.box??[])].find(mon=>mon.met==='신오 210번도로 북부');
  const localCompanion=(mon:Engine['save']['party'][number])=>['신오 210번도로 북부','천관산 211 통과층','신오 211번도로 서부','신오 211번도로 동부'].includes(mon.met);
  const careDestination=()=>{
    const local=[...save.party,...(save.box??[])].find(localCompanion);
    if(!save.party.length)return {label:'센터 PC에서 동료 편성',event:'tourPC'};
    if(save.party.some(mon=>mon.hp<mon.maxHp))return {label:'센터에서 동료 회복',event:'tourHost'};
    if(local&&!save.party.includes(local))return {label:'센터 PC에서 동료 만나기',event:'tourPC'};
    return {label:'센터 여행 지도',event:'tourCelesticCenterGuide'};
  };
  const careChoice=()=>({label:careDestination().label,action:()=>{
    if(current())g.setTourDestination('tour_celestic_center',careDestination().event);
  }});
  // One destination policy for every place that helps resume the optional survey.
  const surveyDestination=()=>{
    if(save.flags[DONE])return {label:'유적 표본과 비교',map:'tour_celestic_ruins',event:'tourCelesticRuinsStone'};
    const mon=selected();
    if(!save.party.length)return {label:'센터에서 동료 편성',map:'tour_celestic_center',event:'tourPC'};
    if(mon?mon.hp<=0:!save.party.some(p=>p.hp>0))return {label:'동료 회복부터',map:'tour_celestic_center',event:'tourHost'};
    return {label:mon?'남은 지층 관찰':'관찰 동료 고르기',map:'tour_coronet_211_pass',event:mon?(save.flags[WEST]?'coronet211EastLayer':'coronet211WestLayer'):'coronet211Guide'};
  };
  const surveyChoice=()=>({label:surveyDestination().label,action:()=>{
    if(!current())return;
    const target=surveyDestination();g.setTourDestination(target.map,target.event);
  }});
  const prepareMoves=(page=0)=>{
    if(!current())return;
    if(!save.party.length){g.say('여행 전 기술 준비',['함께 연습할 동료를 PC에서 편성하자.'],undefined,[
      {label:'센터 PC로',action:guide('tour_celestic_center','tourPC')},
      {label:'나중에 준비하기',action:()=>{}},
    ]);return;}
    g.say('여행 전 기술 준비',['동료를 골라 배울 수 있는 기술을 비교하자.\n기술을 바꾸면 다음 배틀에서도 사용한다.'],undefined,[
      ...save.party.slice(page*3,page*3+3).map(mon=>({label:SPECIES[mon.species].name,action:()=>{
        if(!current())return;
        const index=save.party.indexOf(mon);if(index<0)return;
        g.partyIndex=index;showMoveSchool(g,0,undefined,false,{label:'여행 준비로 돌아가기',action:()=>{if(current()&&save.party.includes(mon))prepareMoves(page);}});
      }})),
      ...(save.party.length>3?[{label:page?'앞 동료들':'다음 동료들',action:()=>prepareMoves(page?0:1)}]:[]),
      {label:'준비 마치기',action:()=>{if(current())g.event('tourCelesticCenterGuide');}},
    ]);
  };
  if(save.map==='tour_celestic_home'&&event==='tourHost'){
    g.say('봉신마을 주민',[
      '어서 오렴. 책장에는 우리 집에서 모아 온 산길 이야기가 있단다.',
      '옆 지도에는 영원시티에서 211번도로 서부, 천관산, 211번도로 동부를 거쳐 여기 오는 길이 그려져 있어.',
      '동료가 지쳤다면 마을 포켓몬센터에서 쉬게 해 주렴.',
    ],undefined,[
      {label:'가족의 기록 살펴보기',action:guide('tour_celestic_home','tourCelesticFamilyRecord')},
      {label:'산길 지도 살펴보기',action:guide('tour_celestic_home','tourCelesticFamilyMap')},
      careChoice(),
      {label:'인사 마치기',action:()=>{}},
    ]);return true;
  }
  if(save.map==='tour_celestic_ruins'&&event==='tourHost'){
    g.say('봉신 유적 기록원',[
      '안쪽 벽화를 천천히 살펴보세요. 마을 사람들이 오랫동안 지켜 온 흔적이지요.',
      save.flags[DONE]?completedNote():save.flags[WEST]||save.flags[EAST]?'천관산에서 살펴본 지층이 있군요. 양쪽 암반을 비교하면 이곳 표본의 결도 눈에 들어올 거예요.':'옆에는 천관산의 밝은 암반과 짙은 암반을 함께 전시하고 있어요.',
      '전승 기록과 암석 표본은 양옆에서 볼 수 있어요.',
    ],undefined,[
      {label:'안쪽 벽화 살펴보기',action:guide('tour_celestic_ruins','tourCelesticRuinsMural')},
      {label:'암석 표본 비교하기',action:guide('tour_celestic_ruins','tourCelesticRuinsStone')},
      {label:'전승 기록 읽기',action:guide('tour_celestic_ruins','tourCelesticRuinsRecord')},
      {label:'천천히 둘러보기',action:()=>{}},
    ]);return true;
  }
  if(save.map==='tour_celestic_center'&&event==='tourCelesticCenterGuide'){
    const partyLocal=save.party.filter(localCompanion),boxedLocal=(save.box??[]).filter(localCompanion);
    const healthy=save.party.filter(mon=>mon.hp>0).length;
    g.say('봉신 여행 지도',[
      `함께 걷는 동료 ${save.party.length}마리 중 ${healthy}마리가 건강하다.`,
      `천관산·210·211번도로에서 만난 동료: 파티 ${partyLocal.length}마리 · PC ${boxedLocal.length}마리.`,
      ...partyLocal.map(mon=>`${SPECIES[mon.species].name} · ${mon.met}\nLv.${mon.level} · HP ${mon.hp}/${mon.maxHp}`),
      ...(boxedLocal.length?['PC에서 쉬는 동료는 편성한 뒤 함께 출전할 수 있다.']:[]),
      '서쪽은 211번도로 동부와 천관산, 동쪽은 210번도로 북부와 남부로 이어진다.',
    ],undefined,[
      {label:'동료 편성 PC',action:guide('tour_celestic_center','tourPC')},
      ...(save.party.some(mon=>mon.hp<mon.maxHp)?[{label:'간호사에게 회복받기',action:guide('tour_celestic_center','tourHost')}]:[]),
      {label:'동료 기술 준비',action:()=>prepareMoves()},
      {label:'천관산 동료와 관찰하기',action:guide('tour_coronet_211_pass','coronet211Guide')},
      {label:save.flags['trainerWon:sinnoh-route-211-west-practice']?'211 서부 · 영원 방면 여행':'211 서부 실전 · Lv.16~17',action:guide('tour_sinnoh_route_211_west',save.flags['trainerWon:sinnoh-route-211-west-practice']?'route211WestSign':'route211WestTrainer')},
      {label:save.flags['trainerWon:sinnoh-route-211-east-practice']?'211 동부 · 산길 재방문':'211 동부 실전 · Lv.17~18',action:guide('tour_sinnoh_route_211_east',save.flags['trainerWon:sinnoh-route-211-east-practice']?'route211EastSign':'route211EastTrainer')},
      {label:save.flags['trainerWon:sinnoh-route-210-north-practice']?'210번도로 남부로 출발':'210번도로 선택 배틀로',action:guide(
        save.flags['trainerWon:sinnoh-route-210-north-practice']?'tour_sinnoh_route_210_south':'tour_sinnoh_route_210_north',
        save.flags['trainerWon:sinnoh-route-210-north-practice']?'route210SouthSign':'route210NorthTrainer')},
      {label:'지도 접기',action:()=>{}},
    ]);return true;
  }
  if(save.map==='tour_celestic_shop'&&event==='tourCelesticShopShelf'){
    g.say('산길 보급 선반',[`가방에는 몬스터볼 ${save.inventory.pokeBalls}개와 상처약 ${save.inventory.potions}개가 있다.`,'여행용 도구는 맞은편 카운터에서 고를 수 있다.'],undefined,[
      {label:'판매 카운터로',action:guide('tour_celestic_shop','martClerk')},
      {label:'센터에서 동료 돌보기',action:guide('tour_celestic_center','tourHost')},
      {label:'계속 둘러보기',action:()=>{}},
    ]);return true;
  }
  if(save.map==='tour_celestic_home'&&event==='tourCelesticFamilyMap'){
    const mon=selected();
    g.say('천관산 옛 지도',[
      '영원시티와 봉신마을 사이에 211번도로와 천관산 통과층을 그린 지도다.',
      save.flags[DONE]?'밝은 지층과 짙은 지층을 비교한 여행 기록을 유적 표본과 나란히 살펴볼 수 있다.':
        mon&&mon.hp<=0?`${SPECIES[mon.species].name}는 먼저 센터에서 쉬어야 한다. 관찰 기록은 남아 있다.`:
        mon?`${SPECIES[mon.species].name}와 진행하던 지층 관찰을 이어가 보자.`:!save.party.length?'센터 PC에서 함께 걸을 동료를 편성하자.':'천관산 안내원에게 건강한 관찰 동료를 정하고 양쪽 지층을 찾아보자.',
    ],undefined,[
      surveyChoice(),
      {label:'센터에서 동료 편성',action:guide('tour_celestic_center','tourPC')},
      {label:'지도 내려놓기',action:()=>{}},
    ]);return true;
  }
  const choose=(page=0)=>{
    if(!current())return;
    if(!save.party.length){g.say('천관산 통과 안내원',['함께 지층을 살펴볼 동료가 없다.\n센터 PC에서 동료를 편성하고 돌아오자.']);return;}
    g.say('지층 관찰 동료',['서쪽과 동쪽 암반을 함께 비교할\n건강한 동료를 골라 주세요.'],undefined,[
      ...save.party.slice(page*3,page*3+3).map(mon=>({label:SPECIES[mon.species].name,action:()=>{if(!current()||!save.party.includes(mon))return;if(mon.hp<=0){g.say('천관산 통과 안내원',['이 동료는 먼저 센터에서 쉬어야 한다.\n회복한 뒤 다시 함께 살펴보자.']);return;}save.flags[SLOT]=save.party.indexOf(mon);save.flags[PARTNER]=mon.species;save.flags[WEST]=false;save.flags[EAST]=false;save.flags[DONE]=false;g.persist();g.say('지층 관찰 기록',[`${withParticle(SPECIES[mon.species].name,'과/와')} 통과층을 살펴보기로 했다.`,`서쪽 밝은 암반과 동쪽 짙은 암반을\n각각 조사한 뒤 안내원에게 돌아오자.`]);}})),
      ...(save.party.length>3?[{label:page?'앞 동료들':'다음 동료들',action:()=>choose(page?0:1)}]:[]),{label:'나중에 고르기',action:()=>{}},
    ]);
  };
  if(save.map==='tour_sinnoh_route_211_west'&&event==='route211WestHiker'){g.say('211번도로 서부 등산객',['북쪽 산기슭 곁길의 풀밭에는 요가랑·비버니·알통몬·방울랑·동미러가 살아.\n풀밭 바로 아래 마른 길로도 돌아올 수 있어.','서쪽은 영원시티, 동쪽 동굴은\n천관산의 211번도로 통과층이야.',save.flags['trainerWon:sinnoh-route-211-west-practice']?'산기슭 선택전도 마쳤군. 동굴 안에서는\n밝은 암반과 짙은 암반을 비교해 봐.':'산기슭 트레이너와 겨루지 않아도\n동굴과 영원시티를 자유롭게 오갈 수 있어.']);return true;}
  if(save.map==='tour_sinnoh_route_211_west'&&event==='route211WestSign'){g.say('211번도로 서부 이정표',['← 영원시티  ·  천관산 211 통과층 →','번호 없는 지름길이 아니다.\n211번도로 서부의 산기슭 구간이다.']);return true;}
  if(save.map==='tour_sinnoh_route_211_east'&&event==='route211EastWalker'){g.say('211번도로 동부 여행자',['북쪽 높은 곁길에서는 요가랑·방울랑·동미러를 만날 수 있어.\n풀밭 아래 마른 길은 동굴과 마을로 돌아가는 길이야.','서쪽 동굴은 천관산 통과층,\n동쪽은 봉신마을로 이어져.',save.flags['trainerWon:sinnoh-route-211-east-practice']?'동부 선택전 기록도 남겼구나.\n봉신에서는 벽화 앞 길을 조용히 걸어 봐.':'동부 트레이너와 겨루지 않아도\n봉신마을과 천관산을 오갈 수 있어.']);return true;}
  if(save.map==='tour_sinnoh_route_211_east'&&event==='route211EastSign'){g.say('211번도로 동부 이정표',['← 천관산 211 통과층  ·  봉신마을 →','산 그림자가 옅어지고 숲이 나타나면\n봉신마을 경계에 가까워진다.']);return true;}
  if(save.map==='tour_coronet_211_pass'&&event==='coronet211Sign'){g.say('천관산 통과층 이정표',['← 211번도로 서부  ·  211번도로 동부 →','서쪽 위와 동쪽 아래 거친 암반길에는 주뱃·알통몬·꼬마돌·요가랑이 산다.\n동서 큰길과 지층 조사 자리는 조용히 건널 수 있다.']);return true;}
  if(save.map==='tour_coronet_211_pass'&&event==='coronet211Guide'){
    const mon=selected();
    if(save.flags[DONE]){
      g.say('천관산 통과 안내원',[completedNote(),'서쪽은 밝고 거친 암반, 동쪽은 짙고 매끈한 암반이다.\n같은 산 안에서도 물과 압력을 받은 흔적이 다르다.',
        '봉신 유적의 암석 표본과 현장 기록을 비교해 보자.',
      ],undefined,[
        {label:'봉신 유적 표본으로',action:guide('tour_celestic_ruins','tourCelesticRuinsStone')},
        {label:'봉신센터에서 편성',action:guide('tour_celestic_center','tourPC')},
        {label:'여행 계속하기',action:()=>{}},
      ]);return true;
    }
    if(mon){
      g.say('천관산 통과 안내원',[`${withParticle(SPECIES[mon.species].name,'과/와')} 진행하던 관찰 기록이 남아 있다.`,
        mon.hp<=0?'먼저 봉신 포켓몬센터에서 동료를 쉬게 하자.':save.flags[WEST]?'서쪽 기록은 남겼으니 동쪽 암반을 살펴보자.':'서쪽 밝은 암반부터 살펴보자.',
      ],undefined,[
        surveyChoice(),
        {label:'관찰 동료 다시 고르기',action:()=>choose()},
        {label:'나중에 이어가기',action:()=>{}},
      ]);return true;
    }
    choose();return true;
  }
  if(save.map==='tour_coronet_211_pass'&&["coronet211WestLayer","coronet211EastLayer"].includes(event)){
    if(save.flags[DONE]){
      g.say(event==='coronet211WestLayer'?'서쪽 밝은 암반':'동쪽 짙은 암반',[completedNote(),'완성한 기록을 봉신 유적의 표본과 비교할 수 있다.'],undefined,[
        {label:'봉신 유적 표본으로',action:guide('tour_celestic_ruins','tourCelesticRuinsStone')},
        {label:'계속 둘러보기',action:()=>{}},
      ]);return true;
    }
    const mon=selected();if(!mon){g.say('천관산 지층',['안내원에게 건강한 동료를 정한 뒤\n두 암반을 함께 비교해 보자.']);return true;}if(mon.hp<=0){g.say('천관산 지층',[`${withParticle(SPECIES[mon.species].name,'은/는')} 지금 지쳐 있다.\n센터에서 회복한 뒤 다시 살펴보자.`]);return true;}
    const west=event==='coronet211WestLayer',key=west?WEST:EAST;
    const title=west?'서쪽 밝은 암반':'동쪽 짙은 암반';
    const valid=()=>current()&&selected()===mon&&mon.hp>0&&!save.flags[DONE];
    const finish=()=>{
      if(!valid())return;
      save.flags[key]=true;save.flags[DONE]=Boolean(save.flags[WEST]&&save.flags[EAST]);g.persist();g.audio.play('confirm');
      g.say(title,[`${withParticle(SPECIES[mon.species].name,'과/와')} ${west?'끊어지고 어긋난 층의 균열':'이어진 층을 가로지르는 물자국'}을 기록했다.`,save.flags[DONE]?'두 지층 기록이 모였다. 봉신 유적의 표본과 비교해 보자.':'반대쪽 암반에서는 어떤 흔적이 보일까?'],undefined,[
        {label:save.flags[DONE]?'봉신 유적 표본으로':'반대쪽 지층으로',action:save.flags[DONE]?guide('tour_celestic_ruins','tourCelesticRuinsStone'):guide('tour_coronet_211_pass',west?'coronet211EastLayer':'coronet211WestLayer')},
        {label:'직접 둘러보기',action:()=>{}},
      ]);
    };
    if(save.flags[key]){g.say(title,['이쪽 흔적은 이미 기록했다. 반대쪽 지층과 비교해 보자.'],undefined,[{label:'반대쪽 지층으로',action:guide('tour_coronet_211_pass',west?'coronet211EastLayer':'coronet211WestLayer')},{label:'계속 둘러보기',action:()=>{}}]);return true;}
    g.say(title,[west?'밝은 층의 선이 중간에서 끊겨 어긋나 있다.':'짙은 수평층 위로 밝은 세로 자국이 이어져 있다.',`${SPECIES[mon.species].name}와 어떤 흔적을 기록할까?`],undefined,[
      {label:'어긋난 층의 균열',action:()=>{if(!valid())return;if(west)finish();else g.say(title,['층은 이어져 있어. 층을 가로지르는 밝은 자국을 다시 살펴보자.'],()=>{if(valid())g.event(event);});}},
      {label:'층을 가로지르는 물자국',action:()=>{if(!valid())return;if(!west)finish();else g.say(title,['이곳에서는 층이 어긋난 부분이 두드러져. 끊긴 선을 다시 따라가 보자.'],()=>{if(valid())g.event(event);});}},
      {label:'나중에 관찰하기',action:()=>{}},
    ]);return true;
  }
  if(save.map==='tour_celestic'&&event==='celesticElder'){g.say('봉신마을 전승지기',[save.flags[DONE]?'천관산 양쪽 지층을 동료와 비교했구나.\n마을의 돌담도 같은 산에서 이어진 흔적이란다.':'서쪽 211번도로와 천관산을 지나왔다면\n통과층의 서로 다른 암반을 살펴보렴.','벽화에는 마을에서 오래 전해 온 이야기가 남아 있단다.\n동료와 함께 천천히 살펴보렴.']);return true;}
  if(save.map==='tour_celestic'&&event==='celesticResident'){
    const mon=route210Companion(),inParty=mon&&save.party.includes(mon);
    g.say('봉신마을 주민',[mon?`${withParticle(SPECIES[mon.species].name,'은/는')} 210번도로 북부 안개 숲에서 만났구나.\n${inParty&&mon.hp>0?'함께 걷는 모습을 보니 이 길에 잘 적응했어.':inParty?'지금은 지쳐 있으니 먼저 센터에서 쉬게 해 줘.':'PC에서 쉬고 있어도 만난 장소 기록은 남아 있어.'}`:'동쪽 210번도로 북부의 선택 풀밭에서는\n요가랑과 알통몬을 만날 수 있어.','서쪽으로 211번도로 동부와 천관산 통과층,\n211번도로 서부를 지나면 영원시티야.','포획·지층 관찰·선택전은 어느 쪽 길의\n통행 조건도 아니야.'],undefined,[
      careChoice(),
      {label:'민가 상점에서 보급',action:guide('tour_celestic_shop','martClerk')},
      {label:'봉신 유적 관람',action:guide('tour_celestic_ruins','tourCelesticRuinsRecord')},
      {label:'인사하고 떠나기',action:()=>{}},
    ]);return true;
  }
  if(save.map==='tour_celestic'&&event==='celesticSign'){g.say('봉신마을 이정표',['← 신오 211번도로 동부 · 천관산 · 영원시티','마을 서쪽 출구로 같은 길을 되돌아갈 수 있다.']);return true;}
  if(save.map==='tour_celestic'&&event==='celesticEastSign'){g.say('봉신마을 동쪽 이정표',['봉신 유적 ↑  ·  신오 210번도로 북부 →','210번도로 북부의 안개 길은 남부 고지 분기로 이어진다.']);return true;}
  if(save.map==='tour_celestic'&&event==='celesticMural'){g.say('봉신마을 전승 벽화',['오래된 선과 문양이 산과 세 호수를 나타낸다.','비바람을 견딘 문양을 따라\n마을 사람들이 지켜 온 이야기를 살펴본다.']);return true;}
  if(save.map==='tour_sinnoh_route_210_north'&&event==='route210NorthWalker'){g.say('210번도로 북부 여행자',['서쪽은 봉신마을, 남쪽 고지 분기는 210번도로 남부로 이어져.','절벽을 따라 이어지는 큰길은 풀밭을 밟지 않고도 걸을 수 있어.'],undefined,[
      careChoice(),
      {label:'봉신 상점으로 돌아가기',action:guide('tour_celestic_shop','martClerk')},
      {label:'210번도로 남부로',action:guide('tour_sinnoh_route_210_south','route210SouthSign')},
      {label:'여행 계속하기',action:()=>{}},
    ]);return true;}
  if(save.map==='tour_sinnoh_route_210_north'&&event==='route210NorthSign'){g.say('210번도로 북부 이정표',['← 봉신마을 · ↓ 210번도로 남부','절벽을 따라 굽은 길을 내려가면 남부 목장길 고지에 닿는다.']);return true;}
  if(save.map==='tour_sinnoh_route_210_north'&&event==='route210NorthFogSign'){g.say('안개 길 안내',['안개 너머로 절벽이 이어집니다.\n굽은 큰길과 출구 이정표를 따라 걸으세요.','남쪽 출구 뒤에는 210번도로 남부와 신수마을 귀환길이 이어진다.']);return true;}
  if(save.map==='tour_celestic_ruins'&&event==='tourCelesticRuinsStone'){
    g.say('천관산 암석 표본',[
      save.flags[DONE]?completedNote():'211번도로 통과층의 밝은 암반과 짙은 암반을 나란히 놓은 표본이다.',
      save.flags[DONE]?'기록의 밝고 거친 결은 왼쪽 표본, 짙고 매끈한 물자국은 오른쪽 표본과 닮았다.':'통과층의 두 암반을 동료와 살펴보면 현장과 표본을 비교할 수 있다.',
    ],undefined,save.flags[DONE]?[
      {label:'210번도로 여행 이어가기',action:guide('tour_sinnoh_route_210_north','route210NorthWalker')},
      {label:'봉신센터에서 편성',action:guide('tour_celestic_center','tourPC')},
      {label:'표본 더 둘러보기',action:()=>{}},
    ]:[
      surveyChoice(),
      {label:'표본 더 둘러보기',action:()=>{}},
    ]);return true;
  }
  if(save.map==='tour_celestic_ruins'&&event==='tourCelesticRuinsMural'){
    g.say('봉신 유적의 벽화',['오래된 벽면에 세 개의 문양이 서로 마주 보고 있다.','기록원은 벽화를 가리켰다. “이 문양을 지켜 온 사람들의 이야기는 옆 기록에 남아 있어요.”'],undefined,[
      {label:'곁의 전승 기록 읽기',action:guide('tour_celestic_ruins','tourCelesticRuinsRecord')},
      {label:'천관산 표본과 비교',action:guide('tour_celestic_ruins','tourCelesticRuinsStone')},
      {label:'벽화를 더 바라보기',action:()=>{}},
    ]);return true;
  }
  if(save.map==='tour_celestic_ruins'&&event==='tourCelesticRuinsRecord'){
    const mon=route210Companion();
    g.say('봉신 전승 기록',['마을과 천관산에서 전해 온 이야기를 시대별로 정리했다.\n오래된 기록 옆에는 벽화의 문양을 옮겨 그린 종이가 놓여 있다.',mon?`함께한 여행 기록에는 ${SPECIES[mon.species].name}을\n210번도로 북부에서 만났다고 적혀 있다.`:'210번도로 북부의 요가랑과 알통몬은\n안개 숲 가장자리에서 관찰할 수 있다고 적혀 있다.']);return true;
  }
  return false;
}
